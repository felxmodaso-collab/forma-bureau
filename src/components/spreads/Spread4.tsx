'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { registerSpreadGate } from '@/lib/useDossier';
import { useIsActive } from '@/lib/activeContext';

const PHASES = [
  {
    id: '01',
    title: 'Первая встреча',
    meta: '2–3 часа · у вас дома или на участке',
    body: [
      'Вы рассказываете, как живёте, и как хотели бы жить. Какие привычки, какие ритмы, что болит в нынешнем жилье. Без чертежей, без мудборда. Говорим 2–3 часа.',
      'Мы уходим и в течение двух недель решаем, беремся ли.'
    ]
  },
  {
    id: '02',
    title: 'Pre-design study',
    meta: '4–6 недель · депозит 1.5 млн ₽',
    body: [
      'Анализ участка: инсоляция, почвы, ветра, рельеф, высотные ограничения, соседи. Feasibility: можно ли вообще то, что вы хотите, на этой земле.',
      'В конце — отчёт на 25–40 страниц. Если из него следует, что проект невозможен или неразумен — возвращаем разницу и расходимся.'
    ]
  },
  {
    id: '03',
    title: 'Концепция',
    meta: '8–12 недель · 2–3 варианта',
    body: [
      'Два-три объёмных решения. Каждое — это планы, разрезы, модель в масштабе 1:100, функциональные зоны, инсоляционная диаграмма. Без интерьерных рендеров.',
      'Встречаемся с вами еженедельно. Правим, спорим, думаем.'
    ]
  },
  {
    id: '04',
    title: 'Design development',
    meta: '3–6 месяцев',
    body: [
      'Выбранный концепт детализируется: материалы, узлы, окна, двери, лестницы, камин, системы (вентиляция, отопление, электрика на уровне концепта).',
      'Здесь мы делаем первые образцы: кусок деревянной обшивки, образец камня, тестовый стык. Сравниваем физически, не на мониторе.'
    ]
  },
  {
    id: '05',
    title: 'Рабочая документация',
    meta: '4–6 месяцев',
    body: [
      'Чертежи для строителей. Каждый узел, каждая высотная отметка, каждая марка бетона. Без этого этапа дом строится приблизительно.'
    ]
  },
  {
    id: '06',
    title: 'Авторский надзор',
    meta: 'весь срок строительства, 14–24 месяца',
    body: [
      'Один выезд в неделю на стройку. Иногда два. Решения на месте, когда строитель упирается в «я так не буду».',
      'Без надзора — дом оказывается чуть-чуть другим. Это «чуть-чуть» живёт тридцать лет.'
    ]
  }
] as const;

const SPREAD_INDEX = 4;

/**
 * Spread 4 — the process, as a long-form document. The spread itself fills
 * 100vh of the dossier, but its content is a ~160vh column. The visitor's
 * vertical gesture is intercepted and fed into the spread's own scroll. As
 * each phase crosses the midline it "stands up" on the page (Reveal). Only
 * when the visitor reaches the bottom or top of the internal column does
 * the gesture escape and turn the dossier.
 */
export function Spread4() {
  const active = useIsActive();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollRef = useRef(0);
  scrollRef.current = scrollY;
  const maxRef = useRef(0);
  maxRef.current = maxScroll;

  // Measure overflow
  useLayoutEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      const ct = contentRef.current;
      if (!vp || !ct) return;
      const diff = Math.max(0, ct.offsetHeight - vp.offsetHeight);
      setMaxScroll(diff);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Reset scroll when spread leaves
  useEffect(() => {
    if (!active) setScrollY(0);
  }, [active]);

  // Which phase is currently centred — used to highlight the progress rail
  const [currentPhase, setCurrentPhase] = useState(0);
  const phaseRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!active) return;
    const compute = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const mid = vp.getBoundingClientRect().top + vp.offsetHeight * 0.38;
      let best = 0;
      let bestDist = Infinity;
      phaseRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const centre = r.top + r.height / 2;
        const d = Math.abs(centre - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setCurrentPhase(best);
    };
    compute();
    const id = window.setInterval(compute, 180);
    return () => window.clearInterval(id);
  }, [active, scrollY]);

  // Gate: consume vertical gesture until we reach the boundary
  useEffect(() => {
    const unregister = registerSpreadGate(SPREAD_INDEX, {
      canExitUp: () => scrollRef.current >= maxRef.current - 2,
      canExitDown: () => scrollRef.current <= 2,
      consumeUp: (d) => {
        if (scrollRef.current < maxRef.current - 1) {
          setScrollY((v) => Math.min(maxRef.current, v + d * 0.85));
          return true;
        }
        return false;
      },
      consumeDown: (d) => {
        if (scrollRef.current > 1) {
          setScrollY((v) => Math.max(0, v - d * 0.85));
          return true;
        }
        return false;
      }
    });
    return unregister;
  }, []);

  const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

  return (
    <div
      ref={viewportRef}
      className="relative h-full w-full overflow-hidden bg-graphite text-paper"
    >
      {/* Fixed left column: only a section mark and a sentence. No progress
          counter — the document reads itself, no mini-navigation needed. */}
      <aside
        className="pointer-events-none absolute left-0 top-0 flex flex-col"
        style={{
          padding: 'var(--page-margin) clamp(1.5rem, 4vw, 4rem)',
          width: 'clamp(280px, 30vw, 380px)'
        }}
      >
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-amber/80">
          03 / Как мы работаем
        </p>
        <h2 className="mt-10 font-serif font-light text-[26px] leading-[1.22] text-paper/88 max-w-[22ch]">
          От первой встречи до сдачи объекта — 30–40 месяцев.
        </h2>
      </aside>

      {/* The long-scroll column. Translates by -scrollY px. Height ≈ 160vh. */}
      <div
        className="absolute inset-0"
        style={{
          paddingLeft: 'clamp(320px, 32vw, 440px)',
          paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
          paddingTop: 'var(--page-margin)',
          paddingBottom: 'var(--page-margin)'
        }}
      >
        <div
          ref={contentRef}
          className="relative will-change-transform"
          style={{
            transform: `translate3d(0, -${scrollY}px, 0)`,
            transition: 'transform 420ms cubic-bezier(0.22,0.61,0.36,1)'
          }}
        >
          {/* Vertical amber time-rail running down the entire column */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-amber/25"
            aria-hidden="true"
          />

          <div className="pl-10">
            {PHASES.map((p, i) => {
              const isNow = i === currentPhase;
              const isPast = i < currentPhase;
              return (
                <article
                  key={p.id}
                  ref={(el) => {
                    phaseRefs.current[i] = el;
                  }}
                  className="relative flex flex-col justify-center"
                  style={{
                    minHeight: '92vh',
                    paddingBottom: i === PHASES.length - 1 ? 0 : '12vh',
                    opacity: isNow ? 1 : isPast ? 0.6 : 0.4,
                    transition: 'opacity 900ms cubic-bezier(0.65,0,0.35,1)'
                  }}
                >
                  <header>
                    <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-amber/80 mb-4">
                      Фаза {p.id}
                    </div>
                    <div className="font-mono text-[12px] tracking-[0.14em] text-paper/55 mb-8">
                      {p.meta}
                    </div>
                  </header>

                  <h3 className="font-serif font-light text-[44px] leading-[1.08] text-paper max-w-[14ch]">
                    {p.title}
                  </h3>

                  <div className="mt-8 max-w-[58ch] space-y-5 text-[18pt] leading-[1.6] text-paper/82">
                    {p.body.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>

                  {/* Empty check-circle — single rhythm mark, not decoration */}
                  <div
                    className="mt-10 h-[18px] w-[18px] rounded-full border border-paper/30"
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
