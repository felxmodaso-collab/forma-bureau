'use client';

import { useEffect, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { useIsActive } from '@/lib/activeContext';

/**
 * Spread 2 — the manifesto. Left column of text is 2/3 of the page width.
 * Right column is entirely empty — the whitespace IS the design.
 *
 * A thin amber rule draws itself vertically down the left gutter as the
 * paragraphs reveal, reading as if the eye is tracking down a document.
 */
export function Spread2() {
  const active = useIsActive();
  const [lineLen, setLineLen] = useState(0);

  useEffect(() => {
    if (!active) {
      setLineLen(0);
      return;
    }
    // Grow the rule over ~3.2s, matching the paragraph reveal cadence
    let raf = 0;
    const start = performance.now();
    const DUR = 3200;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DUR);
      setLineLen(easeInOutSine(t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div className="relative h-full w-full bg-graphite text-paper">
      <div
        className="mx-auto flex h-full"
        style={{ padding: 'var(--page-margin) clamp(1.5rem, 4vw, 4rem)', maxWidth: 1360 }}
      >
        {/* Left 2/3 — copy. justify-start so the header anchors to the top
            of the spread instead of centre-overflowing on viewport clips. */}
        <div
          className="relative flex flex-col justify-start pt-[6vh]"
          style={{ flex: '0 0 62%' }}
        >
          {/* Vertical amber rule — a draftsman's ruling on the left margin.
              2px wide, three register ticks at 25 / 50 / 75 % so it reads
              as hand-ruled, not a CSS border. Positioned inside pl-10 so
              it isn't clipped by the outer padding of the flex container. */}
          <div
            className="absolute w-[2px] bg-transparent"
            aria-hidden="true"
            style={{ left: '8px', top: '4vh', height: '84vh' }}
          >
            <div
              data-testid="spread2-rule"
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${(lineLen * 100).toFixed(2)}%`,
                background: '#c8a878',
                transition: 'none',
                boxShadow: '0 0 8px rgba(200,168,120,0.55)'
              }}
            />
            {[0.25, 0.5, 0.75].map((t) => (
              <div
                key={t}
                className="absolute w-[12px] h-px"
                style={{
                  left: '-5px',
                  top: `${(t * 100).toFixed(0)}%`,
                  background: '#c8a878',
                  opacity: lineLen > t ? 0.85 : 0,
                  transition: 'opacity 400ms ease'
                }}
              />
            ))}
          </div>

          <div className="pl-14">
            <Reveal as="p" className="font-mono text-[11px] tracking-[0.22em] uppercase text-amber/80 mb-10">
              01 / Позиция
            </Reveal>

            <Reveal delay={260}>
              <h2 className="font-serif font-light text-[clamp(2rem,3.6vw,44pt)] text-paper leading-[1.1] max-w-[24ch]">
                Дом — это не проект. Это способ жить следующие тридцать лет.
              </h2>
            </Reveal>

            <div className="mt-10 max-w-[54ch] space-y-5 text-[16pt] leading-[1.6] text-paper/82">
              <Reveal as="p" delay={720}>
                Мы работаем с двумя проектами одновременно. Всё остальное —
                потеря внимания: ни архитектор, ни клиент не могут держать в
                голове больше двух живых процессов.
              </Reveal>
              <Reveal as="p" delay={1080}>
                Мы не делаем интерьеры отдельно от архитектуры. И не делаем
                архитектуру отдельно от участка. Один проект — это земля,
                объём, свет, материалы, мебель, ландшафт, и человек, который
                там будет жить. Всё это рассматривается вместе, с первой
                встречи.
              </Reveal>
              <Reveal as="p" delay={1420}>
                Мы не рисуем рендеры для презентации. Мы чертим планы и
                разрезы. Если клиент не хочет читать чертежи — возможно, ему
                нужна не Форма.
              </Reveal>

              <Reveal delay={2020}>
                <div className="h-px w-10 bg-amber/65 my-3" aria-hidden="true" />
              </Reveal>

              <Reveal delay={2400}>
                <p
                  className="italic font-mono text-paper/70 text-[14pt] leading-[1.55] max-w-[48ch]"
                  style={{ fontStyle: 'italic' }}
                >
                  Эта позиция не переговоренная. Если что-то здесь кажется
                  вам странным — честный момент разойтись заранее.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Right 1/3 — empty, on purpose */}
        <div style={{ flex: '1 1 38%' }} />
      </div>
    </div>
  );
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
