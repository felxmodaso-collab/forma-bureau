'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsActive } from '@/lib/activeContext';
import { Handwritten } from '@/components/Handwritten';
import { Reveal } from '@/components/Reveal';
import clsx from 'clsx';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type Card = {
  id: string;
  name: string;
  meta: string;
  body: string;
  annotation: string;
  photo: string;
  focal?: string;
};

const CARDS: Card[] = [
  {
    id: 'ozero-I',
    name: 'Озеро-I',
    meta: 'Подмосковье · 2019 — 2022 · 380 м² · лиственница, бетон, сталь',
    body: 'Участок на берегу пруда с сильным северо-восточным ветром. Дом развёрнут к югу, защищён от ветра глухой северной стеной с минимумом проёмов. Все жилые комнаты — на юг, на солнце, на воду.',
    annotation: 'Главный ход — отрезать северную половину от непогоды',
    photo: `${BASE}/assets/forma/01-ozero.png`,
    focal: '52% 58%'
  },
  {
    id: 'dacha-II',
    name: 'Дача-II',
    meta: 'Рижское направление · 2020 — 2023 · 290 м² · реконструкция, новые пристройки',
    body: 'Дача 1938 года постройки. Клиент не хотел сносить. Мы сохранили сруб и планировку центральной части, пристроили два крыла — кухню-столовую на юг и спальни на запад. Старое и новое разделены стеклянными переходами — физически и визуально.',
    annotation: 'Сохранить историю, но не превратить её в декорацию',
    photo: `${BASE}/assets/forma/02-dacha.png`,
    focal: '50% 55%'
  },
  {
    id: 'les-III',
    name: 'Лес-III',
    meta: 'Карелия · 2021 — 2024 · 580 м² · сосна, гранит, стекло',
    body: 'Участок — редкий сосновый бор. Клиент: «чтобы с террасы были видны три конкретные сосны». Мы посадили дом между ними, не задев корни. Геометрия — длинный одноэтажный бар с прерывистым ломаным скатом.',
    annotation: 'Сосны определили план раньше нас',
    photo: `${BASE}/assets/forma/03-les.png`,
    focal: '45% 60%'
  },
  {
    id: 'residentsiya',
    name: 'Резиденция',
    meta: 'Подмосковье · 2023 — 2026 (в процессе) · 680 м² · камень, дуб, патинированная медь',
    body: 'Единственный проект, где клиент был готов к полному архитектурному контролю — от ландшафта до мебели. Три года работы. Сейчас в финальной фазе: медная кровля патинируется на глазах.',
    annotation: 'Клиент, который понимает, что архитектура — это время',
    photo: `${BASE}/assets/forma/04-residence.png`,
    focal: '50% 55%'
  }
];

/**
 * Spread 5 — selected works. Each card is one large photograph; text sits
 * in a paper-framed panel laid onto the lower-left of the image, and the
 * pencil annotation appears 1.5s after the card lands, drawn by hand.
 *
 * Horizontal drag uses inertia: on release, velocity is decayed to zero
 * over ~900ms, landing on the nearest card. No snap.
 */
export function Spread5() {
  const active = useIsActive();
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState<Card | null>(null);
  const [offset, setOffset] = useState(0);
  const dragRef = useRef<{ x: number; id: number; startIdx: number } | null>(null);
  const widthRef = useRef(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      widthRef.current = trackRef.current?.parentElement?.offsetWidth ?? 1200;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!active) {
      setIdx(0);
      setOpen(null);
      setOffset(0);
    }
  }, [active]);

  const inertiaTo = (startOffset: number, velocity: number, targetIdx: number) => {
    cancelAnimationFrame(rafRef.current);
    const W = widthRef.current;
    const endOffset = -targetIdx * W;
    const total = endOffset - startOffset;
    const base = 980;
    const absV = Math.abs(velocity);
    const duration = Math.max(620, base - absV * 180);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setOffset(startOffset + total * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIdx(targetIdx);
        setOffset(endOffset);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const velRef = useRef({ v: 0, t: 0, x: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-card-button]')) return;
    const W = widthRef.current;
    dragRef.current = { x: e.clientX, id: e.pointerId, startIdx: idx };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    cancelAnimationFrame(rafRef.current);
    setOffset(-idx * W);
    // Seed velocity tracking so the first motion sample is meaningful
    velRef.current = { v: 0, t: performance.now(), x: e.clientX };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const base = -dragRef.current.startIdx * widthRef.current;
    setOffset(base + dx);
    const now = performance.now();
    const dt = Math.max(1, now - velRef.current.t);
    velRef.current.v = (e.clientX - velRef.current.x) / dt;
    velRef.current.x = e.clientX;
    velRef.current.t = now;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const W = widthRef.current;
    const dx = e.clientX - d.x;
    const v = velRef.current.v;
    dragRef.current = null;
    // Carousel commit: either the drag covered ≥18% of the card width OR
    // release velocity was ≥0.45 px/ms. One threshold per gesture advances
    // by a single card; anything less snaps back to the starting card.
    const COMMIT_DIST = W * 0.18;
    const COMMIT_VEL = 0.45;
    let target = d.startIdx;
    if (dx < -COMMIT_DIST || v < -COMMIT_VEL) {
      target = Math.min(CARDS.length - 1, d.startIdx + 1);
    } else if (dx > COMMIT_DIST || v > COMMIT_VEL) {
      target = Math.max(0, d.startIdx - 1);
    }
    inertiaTo(-d.startIdx * W + dx, v, target);
  };

  // Horizontal wheel / trackpad. Accumulates into an offset; after 180ms of
  // silence, coasts to the nearest card with inertia.
  const wheelAccumRef = useRef(0);
  const wheelLastRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);
  const onWheel = (e: React.WheelEvent) => {
    // Horizontal wheel dominates vertical? — then this is a trackpad swipe
    // we should consume. Otherwise let useDossier handle vertical.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    e.stopPropagation();
    cancelAnimationFrame(rafRef.current);
    if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
    wheelAccumRef.current += e.deltaX;
    wheelLastRef.current = performance.now();
    const W = widthRef.current;
    setOffset(-idx * W - wheelAccumRef.current);
    wheelTimerRef.current = window.setTimeout(() => {
      if (performance.now() - wheelLastRef.current < 160) return;
      const acc = wheelAccumRef.current;
      wheelAccumRef.current = 0;
      const projectedIdx = idx + Math.round(acc / (W * 0.35));
      const target = Math.max(0, Math.min(CARDS.length - 1, projectedIdx));
      const virtualVelocity = Math.sign(acc) * 0.7;
      inertiaTo(-idx * W - acc, virtualVelocity, target);
    }, 220);
  };

  const cur = CARDS[idx];

  return (
    <div className="relative h-full w-full bg-graphite text-paper overflow-hidden">
      {/* Header — only the section mark. No counter, no "swipe hint". */}
      <header
        className="absolute top-0 left-0 right-0 flex items-start"
        style={{ padding: 'var(--page-margin) clamp(1.5rem, 4vw, 4rem) 0' }}
      >
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-amber/80">
            04 / Избранные работы
          </p>
        </Reveal>
      </header>

      {/* Card track */}
      <div
        className="absolute inset-0 flex items-stretch"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        style={{ cursor: dragRef.current ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
        data-no-drag
        data-current-idx={idx}
        data-offset={Math.round(offset)}
      >
        <div
          ref={trackRef}
          className="flex items-stretch h-full w-full will-change-transform"
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition: dragRef.current ? 'none' : 'none'
          }}
        >
          {CARDS.map((c, i) => (
            <article
              key={c.id}
              aria-hidden={i !== idx}
              className="relative h-full w-full shrink-0"
              style={{
                padding:
                  'calc(var(--page-margin) + 48px) clamp(1.5rem, 4vw, 4rem) var(--page-margin)'
              }}
            >
              {/* Full-bleed photograph — IS the card */}
              <div className="relative h-full w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover"
                  style={{
                    backgroundImage: `url(${c.photo})`,
                    backgroundPosition: c.focal ?? '50% 50%',
                    filter:
                      'brightness(0.78) contrast(1.04) saturate(0.78) sepia(0.14)'
                  }}
                  aria-label={c.name}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(18,18,22,0.72) 0%, rgba(18,18,22,0.35) 40%, rgba(18,18,22,0.1) 70%, rgba(18,18,22,0.5) 100%)'
                  }}
                  aria-hidden="true"
                />

                {/* Title plaque — amber-framed, anchored lower-left */}
                <div className="absolute left-[4%] bottom-[6%] max-w-[56%]">
                  <div className="border-l border-amber/75 pl-5">
                    <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-amber/85">
                      {c.id.toUpperCase()}
                    </div>
                    <h3 className="mt-2 font-serif font-light text-[clamp(2.5rem,5.2vw,4.2rem)] leading-[1] text-paper">
                      {c.name}
                    </h3>
                    <div className="mt-4 font-mono text-[11px] tracking-[0.12em] text-paper/75 leading-[1.7]">
                      {c.meta}
                    </div>
                    <p className="mt-6 max-w-[46ch] text-[15.5px] leading-[1.6] text-paper/85">
                      {c.body}
                    </p>
                    <div className="mt-8">
                      <Handwritten
                        text={c.annotation}
                        seed={11 + i * 5}
                        width={480}
                        size={22}
                        baseline={32}
                        height={56}
                        delay={i === idx ? 1500 : 4000}
                      />
                    </div>
                    <button
                      data-card-button
                      onClick={() => setOpen(c)}
                      className="mt-8 font-mono text-[10.5px] tracking-[0.22em] uppercase text-taupe hover:text-amber transition-colors duration-700 ease-dossier pb-1 border-b border-taupe/55 hover:border-amber"
                    >
                      развернуть запись
                    </button>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      </div>

      {open && <CardOverlay card={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function CardOverlay({ card, onClose }: { card: Card; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/95 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={card.name}
    >
      <div
        className="relative w-[min(92vw,820px)] bg-graphite border border-paper/12"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 'clamp(1.5rem,3vw,2.4rem)' }}
      >
        <button
          data-card-button
          onClick={onClose}
          className="absolute top-4 right-5 font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/55 hover:text-paper transition-colors"
        >
          закрыть
        </button>
        <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-amber/75">
          {card.id.toUpperCase()}
        </div>
        <h3 className="mt-2 font-serif font-light text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.05]">
          {card.name}
        </h3>
        <div className="mt-2 font-mono text-[11px] tracking-[0.12em] text-paper/55">
          {card.meta}
        </div>
        {/* Three stills — main + two secondaries, archival grid */}
        <div className="mt-6 grid grid-cols-3 gap-2 h-[300px]">
          <div
            className="col-span-2 row-span-2 bg-cool-shadow/40 bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.photo})`,
              backgroundPosition: card.focal ?? '50% 50%',
              filter: 'brightness(0.84) contrast(1.04) saturate(0.82) sepia(0.1)'
            }}
            aria-hidden="true"
          />
          <div
            className="bg-cool-shadow/40 bg-cover"
            style={{
              backgroundImage: `url(${card.photo})`,
              backgroundPosition: '20% 65%',
              filter: 'brightness(0.82) contrast(1.05) saturate(0.78) sepia(0.12)'
            }}
            aria-hidden="true"
          />
          <div
            className="bg-cool-shadow/40 bg-cover"
            style={{
              backgroundImage: `url(${card.photo})`,
              backgroundPosition: '80% 35%',
              filter: 'brightness(0.74) contrast(1.08) saturate(0.72) sepia(0.15)'
            }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-6 max-w-[62ch] text-[15.5px] leading-[1.62] text-paper/80">
          {card.body}
        </p>
        <div className="mt-6 max-w-[48ch]">
          <Handwritten text={card.annotation} seed={31} width={460} size={22} />
        </div>
      </div>
    </div>
  );
}
