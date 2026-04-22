'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDossier, DOSSIER_TOTAL } from '@/lib/useDossier';
import { ActiveSpreadContext } from '@/lib/activeContext';
import clsx from 'clsx';

type Props = {
  spreads: React.ReactNode[];
  spreadLabels?: string[];
};

/**
 * The stage. During a drag the current sheet translates by `dragPx` in real
 * time; the adjacent sheet is parked one viewport away in the direction of
 * motion so it "peeks" through as the current sheet moves. No CSS transition
 * during drag — the rAF loop in useDossier drives the value frame by frame.
 * Commit/snap are also rAF driven, eased, no CSS animation involved.
 */
export function DossierStage({ spreads, spreadLabels }: Props) {
  const dossier = useDossier();
  const { index, unlocked, dragPx, phase } = dossier;
  const reduced = useReducedMotion();

  useEffect(() => {
    (window as unknown as { __dossier?: typeof dossier }).__dossier = dossier;
  }, [dossier]);

  useEffect(() => {
    if (reduced && !unlocked) dossier.jumpTo(1);
  }, [reduced, unlocked, dossier]);

  // Deep-link #N — QA and share
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const n = Number.parseInt(hash, 10);
    if (!Number.isNaN(n) && n >= 0 && n < DOSSIER_TOTAL) {
      dossier.jumpTo(n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When drag exceeds 8vh, the trailing edge of the departing sheet shows a
  // subtle shadow — reads as if a paper edge is lifting.
  const edgeShadow = useMemo(() => {
    const abs = Math.abs(dragPx);
    return Math.min(0.55, abs / (typeof window !== 'undefined' ? window.innerHeight : 900));
  }, [dragPx]);

  const sheets = useMemo(() => {
    return spreads.map((node, i) => {
      const delta = i - index;
      // While user is dragging down (dragPx>0), the previous spread (delta=-1)
      // should peek from above. While dragging up (dragPx<0), the next spread
      // (delta=+1) should peek from below.
      let offsetVh: number;
      if (delta === 0) {
        offsetVh = 0;
      } else if (delta === 1) {
        offsetVh = 100;
      } else if (delta === -1) {
        offsetVh = -100;
      } else {
        offsetVh = delta > 0 ? 200 : -200;
      }
      const translateY = `calc(${offsetVh}vh + ${delta === 0 ? dragPx : dragPx}px)`;
      const opacity = delta === 0 || Math.abs(delta) === 1 ? 1 : 0;
      return (
        <section
          key={i}
          aria-hidden={delta !== 0}
          aria-label={spreadLabels?.[i]}
          className={clsx(
            'dossier-sheet',
            delta === 0 ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          style={{
            transform: `translate3d(0, ${translateY}, 0)`,
            opacity,
            // No CSS transition during physical drag — rAF handles it.
            // Snap-back and commit also drive dragPx via rAF, so transitions
            // here would only fight us.
            transition: 'none'
          }}
        >
          <ActiveSpreadContext.Provider value={delta === 0}>
            {node}
          </ActiveSpreadContext.Provider>
        </section>
      );
    });
  }, [spreads, index, dragPx, spreadLabels]);

  // Reduced-motion fallback: render all spreads as a plain vertical document.
  // No fixed dossier, no JS drag — the browser scrolls natively and all
  // active contexts are true so content-level animations skip their delays.
  if (reduced) {
    return (
      <main className="dossier-static">
        {spreads.slice(1).map((node, i) => (
          <section
            key={i + 1}
            aria-label={spreadLabels?.[i + 1]}
            className="dossier-static-sheet"
          >
            <ActiveSpreadContext.Provider value={true}>
              {node}
            </ActiveSpreadContext.Provider>
          </section>
        ))}
      </main>
    );
  }

  return (
    <main className="dossier-stage">
      {sheets}
      {/* No chrome, no counter, no hint. The dossier speaks through motion. */}

      {/* Paper lift — trailing edge shadow on the departing sheet */}
      {phase !== 'idle' && Math.abs(dragPx) > 30 && (
        <div
          className="pointer-events-none fixed inset-x-0 z-40"
          aria-hidden="true"
          style={{
            top: dragPx < 0 ? `calc(100vh + ${dragPx}px)` : `${dragPx}px`,
            height: '3px',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
            opacity: edgeShadow
          }}
        />
      )}
    </main>
  );
}

/**
 * Note: no on-screen page counter, no "↑ scroll" hint, no progress pill.
 * The spec's cover is statically still; inviting the visitor with UI chrome
 * would betray the whole point of the ritual.
 */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, []);
  return reduced;
}
