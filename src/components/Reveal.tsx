'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsActive } from '@/lib/activeContext';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'p' | 'section' | 'li' | 'h2';
};

/**
 * Soft fade + 14px lift when the element enters the viewport.
 * Used for paragraph-by-paragraph reveal inside an active spread.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div'
}: Props) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const active = useIsActive();

  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    const t = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(t);
  }, [active, delay]);

  return (
    <Tag
      ref={ref as never}
      className={clsx(
        'transition-[opacity,transform] duration-1200 ease-dossier',
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
        className
      )}
    >
      {children}
    </Tag>
  );
}
