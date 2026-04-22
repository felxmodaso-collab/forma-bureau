'use client';

import { useEffect, useState } from 'react';
import { useIsActive } from '@/lib/activeContext';
import clsx from 'clsx';

type Props = {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  /** ms delay after spread becomes active before the press begins */
  delay?: number;
  /** seed for deterministic per-letter shadow alpha jitter (SSR-safe) */
  seed?: number;
};

/**
 * Display type rendered as an actual impression: an amber shadow layer,
 * slightly blurred and ink-bleed-filtered, sits 6px/6px behind the paper
 * glyphs. Per-letter alpha on the shadow is jittered so the impression
 * is not uniform. The paper layer itself gets a subtle ink displacement
 * filter so letter edges feel absorbed into the paper.
 *
 * Reveal sequence: shadow first (the press lands), 180ms later the ink
 * "catches" — paper layer appears. This reverses the familiar CSS shadow
 * cliché and reads as an actual print.
 */
export function InkedText({
  children,
  as: Tag = 'h1',
  className,
  delay = 260
}: Props) {
  const [pressed, setPressed] = useState(false);
  const active = useIsActive();

  useEffect(() => {
    if (!active) {
      setPressed(false);
      return;
    }
    const t = window.setTimeout(() => setPressed(true), delay);
    return () => window.clearTimeout(t);
  }, [active, delay]);

  // Both layers receive the same raw string so word wrapping stays identical
  // between shadow and main — otherwise the amber impression drifts away
  // from the paper glyphs at line breaks.
  return (
    <Tag className={clsx('inked', pressed && 'pressed', className)}>
      <span className="inked-shadow" aria-hidden="true">
        {children}
      </span>
      <span className="inked-main">{children}</span>
    </Tag>
  );
}
