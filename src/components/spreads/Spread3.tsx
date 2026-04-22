'use client';

import { useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal';

type Slot = {
  year: number;
  season: 'Весна' | 'Осень';
  code?: string;
  area?: number;
  state: 'done' | 'active' | 'taken' | 'open';
  location?: string;
};

const CALENDAR: Slot[] = [
  { year: 2021, season: 'Весна', code: 'Озеро-I', area: 380, state: 'done', location: 'Подмосковье' },
  { year: 2021, season: 'Осень', code: 'Озеро-II', area: 160, state: 'done', location: 'Подмосковье' },
  { year: 2022, season: 'Весна', code: 'Дача-II', area: 290, state: 'done', location: 'Рижское' },
  { year: 2022, season: 'Осень', code: 'Дача-III', area: 220, state: 'done', location: 'Калужское' },
  { year: 2023, season: 'Весна', code: 'Лес-III', area: 580, state: 'done', location: 'Карелия' },
  { year: 2023, season: 'Осень', code: 'Лес-IV', area: 410, state: 'done', location: 'Карелия' },
  { year: 2024, season: 'Весна', code: 'Резиденция', area: 680, state: 'active', location: 'Подмосковье' },
  { year: 2024, season: 'Осень', code: 'Резиденция', area: 680, state: 'active', location: 'Подмосковье' },
  { year: 2025, season: 'Весна', code: 'Карелия-V', area: 320, state: 'active', location: 'Карелия' },
  { year: 2025, season: 'Осень', code: 'Карелия-VI', area: 340, state: 'active', location: 'Карелия' },
  { year: 2026, season: 'Весна', state: 'taken' },
  { year: 2026, season: 'Осень', state: 'taken' },
  { year: 2027, season: 'Весна', state: 'open' },
  { year: 2027, season: 'Осень', state: 'taken' }
];

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027];

/**
 * Spread 3 — two projects a year, shown as an archivist's ledger. Written
 * in monospace ASCII box-drawing so it reads as a typed archive record,
 * not as a UI grid. Hover lands a small typewritten tooltip at the cursor.
 */
export function Spread3() {
  const [hover, setHover] = useState<{ slot: Slot; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const label = (slot: Slot) => {
    if (slot.state === 'open') return 'открыт     ';
    if (slot.state === 'taken') return '(занято)   ';
    const name = slot.code ?? '';
    return name.padEnd(11, ' ').slice(0, 11);
  };

  const colorFor = (slot: Slot) => {
    if (slot.state === 'done') return 'text-paper/72';
    if (slot.state === 'active') return 'text-amber/90';
    if (slot.state === 'taken') return 'text-paper/32';
    return 'text-amber slot-open';
  };

  const renderRow = (season: 'Весна' | 'Осень') => {
    const cells = YEARS.map((y) => CALENDAR.find((s) => s.year === y && s.season === season));
    return (
      <div className="flex items-stretch whitespace-pre">
        <span className="text-paper/60 select-none">
          {season.padEnd(5, ' ')} │
        </span>
        {cells.map((slot, i) => (
          <span
            key={`${season}-${i}`}
            className={`px-2 ${colorFor(slot ?? { state: 'taken' } as Slot)} cursor-default transition-colors duration-500`}
            onMouseEnter={(e) =>
              slot &&
              setHover({
                slot,
                x: e.clientX,
                y: e.clientY
              })
            }
            onMouseMove={(e) =>
              slot && setHover({ slot, x: e.clientX, y: e.clientY })
            }
            onMouseLeave={() => setHover(null)}
            onFocus={(e) => {
              const r = (e.target as HTMLSpanElement).getBoundingClientRect();
              slot && setHover({ slot, x: r.left + r.width / 2, y: r.top });
            }}
            onBlur={() => setHover(null)}
            tabIndex={slot ? 0 : -1}
            data-no-drag
          >
            {slot ? label(slot) : '           '}
            {i < YEARS.length - 1 ? ' │' : ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative h-full w-full bg-graphite text-paper">
      <div
        className="mx-auto flex h-full gap-10"
        style={{ padding: 'var(--page-margin) clamp(1.5rem, 4vw, 4rem)', maxWidth: 1440 }}
      >
        {/* Left — the argument */}
        <div
          className="flex flex-col justify-center"
          style={{ flex: '0 0 38%' }}
        >
          <Reveal as="p" className="font-mono text-[11px] tracking-[0.22em] uppercase text-amber/80 mb-10">
            02 / Почему два
          </Reveal>
          <Reveal delay={240}>
            <h2 className="font-serif font-light text-[clamp(1.9rem,3vw,2.65rem)] text-paper leading-[1.15] max-w-[18ch]">
              Архитектор работает вниманием, а не руками.
            </h2>
          </Reveal>
          <div className="mt-10 max-w-[44ch] space-y-5 text-[15.5px] leading-[1.64] text-paper/78">
            <Reveal as="p" delay={640}>
              Проект частного дома — это 300+ решений за 2–3 года. Фундамент,
              несущие, вентиляция, инсоляция, материалы, мебель, детали
              стыков, посадка окон, габариты дверей. Каждое решение требует,
              чтобы у архитектора в голове держалось{' '}
              <em className="not-italic text-paper">всё предыдущее</em>{' '}
              решение как контекст.
            </Reveal>
            <Reveal as="p" delay={960}>
              После третьего одновременного проекта внимание начинает
              распадаться. Решения делаются по шаблону. Клиент платит за
              шаблон.
            </Reveal>
            <Reveal as="p" delay={1280} className="text-paper/92">
              Два — это не маркетинговое ограничение. Это предел внимания
              одного архитектора.
            </Reveal>
          </div>
        </div>

        {/* Right — archival ledger. Overflow-x auto so narrow viewports can
            scroll horizontally; on wide desktop everything fits. */}
        <div className="flex flex-col justify-center" style={{ flex: '1 1 62%' }}>
          <Reveal delay={480}>
            <div
              className="font-mono text-[11.5px] leading-[1.95] text-paper/85 overflow-x-auto"
              style={{ maxWidth: '100%' }}
            >
              <div style={{ minWidth: 'max-content' }}>
                <div className="flex whitespace-pre text-paper/55">
                  <span>{'СЕЗОН '}│</span>
                  {YEARS.map((y, i) => (
                    <span key={y} className="px-2 relative">
                      {String(y)}
                      {y === 2027 && (
                        <span className="ml-1 text-paper/30 text-[9.5px] tracking-wide">
                          план
                        </span>
                      )}
                      {i < YEARS.length - 1 ? '│' : ''}
                    </span>
                  ))}
                </div>
                <div className="whitespace-pre text-paper/20 leading-none -mt-1">
                  {'──────┼' + YEARS.map(() => '─'.repeat(14)).join('┼')}
                </div>
                {renderRow('Весна')}
                {renderRow('Осень')}
                <div className="whitespace-pre text-paper/15 leading-none -mt-1">
                  {'──────┴' + YEARS.map(() => '─'.repeat(14)).join('┴')}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1400}>
            <p className="mt-10 font-mono text-[11px] leading-[1.8] text-paper/45 max-w-[62ch] tracking-wide">
              «Занято» — депозит подписан, fit-study прошёл. «Открыт» —
              позиция, в которую берём проект после первой встречи.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Floating archival tooltip */}
      {hover && (
        <div
          className="pointer-events-none fixed z-40 font-mono text-[11.5px] text-paper/90 bg-graphite/95 border border-amber/35 px-3 py-2 tracking-wide leading-[1.55]"
          style={{
            left: hover.x + 14,
            top: hover.y + 14,
            transition: 'opacity 180ms ease'
          }}
        >
          <div className="text-paper">
            {hover.slot.code ?? (hover.slot.state === 'open' ? 'Открытый слот' : 'Слот занят')}
          </div>
          {hover.slot.area && (
            <div className="text-paper/60">{hover.slot.area} м² · {hover.slot.location}</div>
          )}
          <div className="text-paper/40">
            {hover.slot.year} · {hover.slot.season}
          </div>
        </div>
      )}
    </div>
  );
}
