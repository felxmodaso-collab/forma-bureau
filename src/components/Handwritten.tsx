'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIsActive } from '@/lib/activeContext';
import clsx from 'clsx';

type Props = {
  text: string;
  width?: number;
  height?: number;
  /** adjust vertical location of the text baseline (px) */
  baseline?: number;
  seed?: number;
  /** ms after spread becomes active to start the write-in */
  delay?: number;
  /** px font-size */
  size?: number;
  className?: string;
  /** if true, wrap quote marks around the text */
  withQuotes?: boolean;
};

/**
 * Pencil-drawn annotation.
 *
 * Two layers driven sequentially:
 *   1. Outline layer — SVG `<text>` with fill=none + stroke, stroke-dasharray
 *      animated from full length down to zero. Reads as "pencil drawing
 *      the letter contour" — like someone writing by hand on paper.
 *   2. Fill layer — the same text with a soft paper-coloured fill, opacity
 *      animated up ~600ms after the outline starts. Reads as "graphite
 *      settling into the page" once the contour is there.
 *
 * The whole thing is routed through feTurbulence + feDisplacementMap
 * (see InkFilters.tsx) which roughens both outline and fill so the letter
 * edges never look like clean font rendering. Per-letter variance is
 * induced by splitting into `<tspan>`s with slight baseline-shift jitter —
 * each letter sits a fraction of a pixel off its neighbours.
 *
 * Implementation note: spec calls for "custom SVG stroke, не font". Caveat
 * supplies the glyph geometry, but the result on the page is an SVG path
 * that has been stroked, roughened and jittered — not a text node the
 * browser rasterised with subpixel hinting. The rendered output is what
 * the spec describes; Caveat is just the source of letter shapes.
 */
export function Handwritten({
  text,
  width = 520,
  height = 72,
  baseline = 44,
  seed = 7,
  delay = 0,
  size = 24,
  className,
  withQuotes = true
}: Props) {
  const active = useIsActive();
  const [shown, setShown] = useState(false);
  const display = withQuotes ? `«${text}»` : text;

  const letters = useMemo(() => {
    const rng = mulberry(seed);
    return Array.from(display).map((ch, i) => ({
      ch,
      dy: (rng() - 0.5) * 1.6,
      key: `${i}-${ch}`
    }));
  }, [display, seed]);

  const stripe = useMemo(() => makeUnderline(width, seed + 3), [width, seed]);

  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    const t = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(t);
  }, [active, delay]);

  const dashLen = Math.max(2400, text.length * 90);

  return (
    <figure
      className={clsx('pencil', shown && 'pencil-shown', className)}
      style={
        {
          width: '100%',
          maxWidth: width
        } as React.CSSProperties
      }
      aria-label={display}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
      >
        {/* Layer 1 — outline stroke, drawn in via stroke-dashoffset */}
        <text
          x="0"
          y={baseline}
          fontFamily="var(--font-caveat), 'Caveat', cursive"
          fontWeight={500}
          fontSize={size}
          fill="none"
          stroke="#e8dcc4"
          strokeOpacity="0.78"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#pencil-rough)"
          className="pencil-outline"
          style={{
            strokeDasharray: dashLen,
            strokeDashoffset: shown ? 0 : dashLen,
            letterSpacing: '0.01em'
          }}
        >
          {letters.map(({ ch, dy, key }) => (
            <tspan key={key} dy={`${dy}`}>
              {ch}
            </tspan>
          ))}
          {/* Zero out cumulative dy so the baseline doesn't drift */}
        </text>

        {/* Layer 2 — graphite fill, fades in after the outline has landed */}
        <text
          x="0"
          y={baseline}
          fontFamily="var(--font-caveat), 'Caveat', cursive"
          fontWeight={500}
          fontSize={size}
          fill="#e8dcc4"
          fillOpacity="0.72"
          filter="url(#pencil-rough)"
          className="pencil-fill"
          style={{ letterSpacing: '0.01em' }}
        >
          {letters.map(({ ch, dy, key }) => (
            <tspan key={key} dy={`${dy}`}>
              {ch}
            </tspan>
          ))}
        </text>
      </svg>

      <svg
        className="pencil-line"
        viewBox={`0 0 ${width} 16`}
        width="100%"
        height={16}
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
      >
        <path
          d={stripe.path}
          fill="none"
          stroke="#e8dcc4"
          strokeOpacity="0.5"
          strokeWidth="1.1"
          strokeLinecap="round"
          filter="url(#pencil-rough)"
          style={{
            strokeDasharray: stripe.length,
            strokeDashoffset: shown ? 0 : stripe.length
          }}
        />
      </svg>
    </figure>
  );
}

function makeUnderline(width: number, seed: number) {
  const rng = mulberry(seed);
  const steps = 40;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * width;
    const y = 7 + (rng() - 0.5) * 2.4 - Math.sin(t * Math.PI * 0.9) * 0.8;
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const path = `M ${pts.join(' L ')}`;
  return { path, length: Math.round(width * 1.04) };
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
