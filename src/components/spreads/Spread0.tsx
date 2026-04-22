'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsActive } from '@/lib/activeContext';
import clsx from 'clsx';

const HOLD_MS = 1500;

/**
 * Spread 0 — the threshold. Black. A thin amber line breathes at the bottom
 * (always, not only while holding). Under it, the micro-copy pulses. When
 * the visitor presses and holds, the line grows from its centre outward in
 * saturated amber, matched to hold progress. Release cancels.
 */
export function Spread0() {
  const [progress, setProgress] = useState(0);
  const [dissolving, setDissolving] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const active = useIsActive();

  useEffect(() => {
    if (!active) return;

    const begin = () => {
      if (startRef.current !== null || dissolving) return;
      startRef.current = performance.now();
      const tick = () => {
        if (startRef.current === null) return;
        const elapsed = performance.now() - startRef.current;
        const p = Math.min(1, elapsed / HOLD_MS);
        setProgress(p);
        if (p >= 1) {
          setDissolving(true);
          window.setTimeout(() => {
            const w = window as unknown as {
              __dossier?: { jumpTo: (i: number) => void };
            };
            w.__dossier?.jumpTo(1);
          }, 1400);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const cancel = () => {
      startRef.current = null;
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      begin();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === 'Tab') return;
      begin();
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', cancel);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', cancel);
    window.addEventListener('blur', cancel);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', cancel);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', cancel);
      window.removeEventListener('blur', cancel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, dissolving]);

  // Line geometry: always present but dim; grows from centre as hold fills.
  // Max span 42% of viewport, centred.
  const lineSpan = 24 + progress * 34; // 24% idle breath → 58% at full hold
  const lineOpacity = 0.2 + progress * 0.65;

  return (
    <div
      className={clsx(
        'absolute inset-0 bg-graphite',
        'transition-opacity duration-[1800ms] ease-dossier',
        dissolving ? 'opacity-0' : 'opacity-100'
      )}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-x-0 bottom-[9vh] flex flex-col items-center gap-6">
        <div
          className="relative w-full h-[1px] flex justify-center"
          aria-hidden="true"
        >
          {/* Idle breathing line — narrow, always mid-opacity, pulse via CSS */}
          <div
            className={clsx(
              'absolute top-0 h-[1px] bg-amber/70',
              progress === 0 && 'line-pulse'
            )}
            style={{
              width: `${lineSpan}vmin`,
              opacity: progress === 0 ? undefined : lineOpacity,
              transition: 'width 220ms linear, opacity 220ms linear'
            }}
          />
        </div>
        <p
          className={clsx(
            'font-mono text-[11.5px] tracking-[0.18em] uppercase',
            progress === 0 ? 'text-amber/55 hold-pulse' : 'text-amber/85'
          )}
          style={{
            transition: 'color 600ms ease'
          }}
        >
          Удерживайте, чтобы открыть
        </p>
      </div>
    </div>
  );
}
