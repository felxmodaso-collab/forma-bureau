'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const DOSSIER_TOTAL = 7;
export const COMMIT_DURATION_MS = 1400;
export const SNAP_BACK_MS = 520;
export const EASE_COMMIT = 'cubic-bezier(0.22, 0.61, 0.36, 1)'; // out-quart-ish
export const EASE_DOSSIER = 'cubic-bezier(0.65, 0, 0.35, 1)';

type InternalGate = {
  canExitUp?: () => boolean;
  canExitDown?: () => boolean;
  /** called mid-drag: return true if spread absorbed the delta (no dossier move) */
  consumeUp?: (dy: number) => boolean;
  consumeDown?: (dy: number) => boolean;
};

const gates: Record<number, InternalGate> = {};

export function registerSpreadGate(index: number, gate: InternalGate) {
  gates[index] = gate;
  return () => {
    if (gates[index] === gate) delete gates[index];
  };
}

export type DragPhase = 'idle' | 'dragging' | 'committing' | 'snapback';

export type DossierApi = {
  index: number;
  unlocked: boolean;
  dragPx: number;
  phase: DragPhase;
  go: (next: number) => void;
  jumpTo: (next: number) => void;
};

/**
 * Physical drag mechanics for the dossier. Not slide-up-on-release.
 * While the user holds, the page literally follows the cursor with damping.
 * On release the page either coasts to the next spread (inertia commit) or
 * eases back (snap). Wheel events accumulate into a drag delta over 200ms
 * and settle the same way — so trackpad feels like a slow swipe, not a jump.
 */
export function useDossier(): DossierApi {
  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const [phase, setPhase] = useState<DragPhase>('idle');

  // Persistent refs so listeners never close over stale state
  const indexRef = useRef(0);
  const unlockedRef = useRef(false);
  const phaseRef = useRef<DragPhase>('idle');
  const dragRef = useRef(0);
  indexRef.current = index;
  unlockedRef.current = unlocked;
  phaseRef.current = phase;
  dragRef.current = dragPx;

  const vh = () =>
    typeof window === 'undefined' ? 900 : window.innerHeight;

  const commitTo = useCallback(
    (targetIndex: number, direction: 'up' | 'down', velocity: number) => {
      const startDrag = dragRef.current;
      const start = performance.now();
      const finalDrag = direction === 'up' ? -vh() : vh();
      const distance = finalDrag - startDrag;
      // Base duration, shortened when the user gave us lots of velocity
      const v = Math.abs(velocity);
      const baseMs =
        direction === 'up' || direction === 'down' ? COMMIT_DURATION_MS : 1400;
      const duration = Math.max(520, baseMs - v * 240);
      setPhase('committing');
      phaseRef.current = 'committing';

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = easeOutQuart(t);
        const d = startDrag + distance * eased;
        setDragPx(d);
        dragRef.current = d;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setIndex(targetIndex);
          indexRef.current = targetIndex;
          if (targetIndex >= 1) {
            setUnlocked(true);
            unlockedRef.current = true;
          }
          setDragPx(0);
          dragRef.current = 0;
          setPhase('idle');
          phaseRef.current = 'idle';
        }
      };
      requestAnimationFrame(step);
    },
    []
  );

  const snapBack = useCallback(() => {
    const startDrag = dragRef.current;
    const start = performance.now();
    setPhase('snapback');
    phaseRef.current = 'snapback';
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / SNAP_BACK_MS);
      const eased = easeOutCubic(t);
      const d = startDrag * (1 - eased);
      setDragPx(d);
      dragRef.current = d;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setDragPx(0);
        dragRef.current = 0;
        setPhase('idle');
        phaseRef.current = 'idle';
      }
    };
    requestAnimationFrame(step);
  }, []);

  const go = useCallback(
    (next: number) => {
      if (phaseRef.current !== 'idle') return;
      const clamped = clamp(next, 0, DOSSIER_TOTAL - 1);
      if (clamped === indexRef.current) return;
      const direction = clamped > indexRef.current ? 'up' : 'down';
      commitTo(clamped, direction, 0);
    },
    [commitTo]
  );

  const jumpTo = useCallback((next: number) => {
    const clamped = clamp(next, 0, DOSSIER_TOTAL - 1);
    setIndex(clamped);
    indexRef.current = clamped;
    if (clamped >= 1) {
      setUnlocked(true);
      unlockedRef.current = true;
    }
    setDragPx(0);
    dragRef.current = 0;
    setPhase('idle');
    phaseRef.current = 'idle';
  }, []);

  // ---------- Pointer drag ----------
  useEffect(() => {
    if (!unlocked) return;

    let startY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let active = false;
    let pid = -1;

    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'idle') return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('a,button,[data-no-drag]')) return;
      active = true;
      pid = e.pointerId;
      startY = e.clientY;
      lastY = e.clientY;
      lastT = performance.now();
      velocity = 0;
      setPhase('dragging');
      phaseRef.current = 'dragging';
    };

    const onMove = (e: PointerEvent) => {
      if (!active || e.pointerId !== pid) return;
      const rawDy = e.clientY - startY;
      // Ask the spread if it wants to absorb this motion first (e.g. S4 sub-screens)
      const gate = gates[indexRef.current];
      const absolute = Math.abs(rawDy);
      if (rawDy < 0 && gate?.consumeUp?.(Math.min(40, absolute))) {
        // spread consumed it — restart dragging origin to keep dossier neutral
        startY = e.clientY;
        lastY = e.clientY;
        return;
      }
      if (rawDy > 0 && gate?.consumeDown?.(Math.min(40, absolute))) {
        startY = e.clientY;
        lastY = e.clientY;
        return;
      }
      // Gate may refuse to exit entirely (e.g. internal sub-screen index not at edge)
      if (rawDy < 0 && gate?.canExitUp?.() === false) return;
      if (rawDy > 0 && gate?.canExitDown?.() === false) return;

      const damped = dampAtLimit(rawDy);
      setDragPx(damped);
      dragRef.current = damped;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = (e.clientY - lastY) / dt; // px/ms
      lastY = e.clientY;
      lastT = now;
    };

    const onUp = () => {
      if (!active) return;
      active = false;
      pid = -1;
      const d = dragRef.current;
      const COMMIT_DIST = vh() * 0.22;
      const COMMIT_VEL = 0.55; // px/ms
      if (d < -COMMIT_DIST || velocity < -COMMIT_VEL) {
        const nextI = clamp(indexRef.current + 1, 0, DOSSIER_TOTAL - 1);
        if (nextI !== indexRef.current) commitTo(nextI, 'up', -velocity);
        else snapBack();
      } else if (d > COMMIT_DIST || velocity > COMMIT_VEL) {
        // Gesture down on the last spread returns to cover (1) — the spec's cycle
        let nextI: number;
        if (indexRef.current === DOSSIER_TOTAL - 1) {
          nextI = 1;
        } else {
          nextI = clamp(indexRef.current - 1, 0, DOSSIER_TOTAL - 1);
        }
        if (nextI !== indexRef.current) commitTo(nextI, 'down', velocity);
        else snapBack();
      } else {
        snapBack();
      }
    };

    const onCancel = () => {
      if (!active) return;
      active = false;
      pid = -1;
      snapBack();
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }, [unlocked, commitTo, snapBack]);

  // ---------- Wheel (accumulate then settle) ----------
  useEffect(() => {
    if (!unlocked) return;
    let accum = 0;
    let lastTick = 0;
    let settleTimer: number | null = null;

    const settle = () => {
      const d = dragRef.current;
      const COMMIT_DIST = vh() * 0.18;
      if (d < -COMMIT_DIST) {
        const nextI = clamp(indexRef.current + 1, 0, DOSSIER_TOTAL - 1);
        if (nextI !== indexRef.current) commitTo(nextI, 'up', 0.5);
        else snapBack();
      } else if (d > COMMIT_DIST) {
        const nextI =
          indexRef.current === DOSSIER_TOTAL - 1
            ? 1
            : clamp(indexRef.current - 1, 0, DOSSIER_TOTAL - 1);
        if (nextI !== indexRef.current) commitTo(nextI, 'down', 0.5);
        else snapBack();
      } else {
        snapBack();
      }
      accum = 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current === 'committing') {
        e.preventDefault();
        return;
      }
      const gate = gates[indexRef.current];
      if (e.deltaY > 0 && gate?.consumeUp?.(e.deltaY)) {
        e.preventDefault();
        return;
      }
      if (e.deltaY < 0 && gate?.consumeDown?.(-e.deltaY)) {
        e.preventDefault();
        return;
      }
      if (e.deltaY > 0 && gate?.canExitUp?.() === false) return;
      if (e.deltaY < 0 && gate?.canExitDown?.() === false) return;
      e.preventDefault();
      accum += e.deltaY * 0.65; // positive when scrolling "down" — maps to drag up
      // A positive wheel (scroll down) should move us forward, so translate the
      // stage as if user dragged UP (negative px).
      const damped = dampAtLimit(-accum);
      setDragPx(damped);
      dragRef.current = damped;
      setPhase('dragging');
      phaseRef.current = 'dragging';
      if (settleTimer) window.clearTimeout(settleTimer);
      const now = performance.now();
      lastTick = now;
      settleTimer = window.setTimeout(() => {
        if (performance.now() - lastTick >= 180) settle();
      }, 220);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (settleTimer) window.clearTimeout(settleTimer);
    };
  }, [unlocked, commitTo, snapBack]);

  // ---------- Keyboard ----------
  useEffect(() => {
    if (!unlocked) return;
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'idle') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        go(indexRef.current + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        go(indexRef.current - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        go(DOSSIER_TOTAL - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlocked, go]);

  return {
    index,
    unlocked,
    dragPx,
    phase,
    go,
    jumpTo
  };
}

// ---------- helpers ----------
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Rubber-band damping: distance within 60% of viewport moves 1:1, beyond that
 * resistance grows quadratically, so page feels heavy near the commit edge.
 */
function dampAtLimit(raw: number) {
  const h = typeof window === 'undefined' ? 900 : window.innerHeight;
  const threshold = h * 0.6;
  const abs = Math.abs(raw);
  if (abs <= threshold) return raw;
  const over = abs - threshold;
  const resisted = over / (1 + over / (h * 0.35));
  const signed = (threshold + resisted) * Math.sign(raw);
  return signed;
}
