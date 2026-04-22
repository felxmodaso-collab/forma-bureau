import { InkedText } from '@/components/InkedText';

/**
 * Spread 1 — the cover. 80vh of empty field above. Bottom sixth holds the
 * logo (left) and contacts (right) in small monospace. Centred display
 * sentence carries the amber letterpress impression. Page is otherwise
 * completely still — per spec, "Никакого другого движения".
 */
export function Spread1() {
  return (
    <div className="relative h-full w-full bg-graphite text-paper">
      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: 'var(--page-margin) clamp(1.5rem, 4vw, 4rem)' }}
      >
        {/* Top: the 80vh of quiet the spec calls for, left entirely alone.
            Display sits below it, anchored via flex-grow: 0. Logo and
            contacts occupy the bottom-third band. */}
        <div className="flex-[5]" />

        <div className="flex-[2] flex items-start">
          <div className="pl-[8%] pr-[6%]" style={{ whiteSpace: 'pre-line' }}>
            <InkedText
              as="h1"
              className="font-serif font-light text-[72pt] leading-[1.05]"
              delay={340}
            >
              {'Частные дома.\nДва проекта в год.'}
            </InkedText>
          </div>
        </div>

        <div className="flex-[1]" />

        {/* Bottom imprint — plate typed at the foot of a title page */}
        <footer className="flex items-end justify-between gap-6 font-mono text-[11px] tracking-[0.18em] text-paper/65 uppercase shrink-0">
          <div className="leading-[2]">
            <div className="text-paper">Форма</div>
            <div>Архитектурное бюро</div>
            <div className="text-paper/50">Москва · 2013 — 2026</div>
          </div>
          <div className="text-right leading-[2] tracking-[0.12em]">
            <div className="text-paper normal-case">forma.bureau</div>
            <div className="text-paper/55 normal-case">hello@forma.bureau</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
