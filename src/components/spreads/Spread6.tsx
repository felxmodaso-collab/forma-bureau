import { Reveal } from '@/components/Reveal';

/**
 * Spread 6 — the close. The cycle ends here. Gesture down from this spread
 * returns the visitor to the cover (handled by useDossier's wrap-to-1 rule).
 * No footer, no social links, no newsletter — the quiet is the answer.
 */
export function Spread6() {
  return (
    <div className="relative h-full w-full bg-graphite text-paper">
      <div
        className="mx-auto flex h-full gap-12"
        style={{ padding: 'var(--page-margin) clamp(1.5rem, 4vw, 4rem)', maxWidth: 1360 }}
      >
        <div className="flex flex-col justify-center" style={{ flex: '0 0 62%' }}>
          <Reveal as="p" className="font-mono text-[11px] tracking-[0.22em] uppercase text-amber/80 mb-10">
            04 / Если это читается вам
          </Reveal>

          <Reveal delay={280}>
            <h2 className="font-serif font-light text-[clamp(2.75rem,5.2vw,4.4rem)] leading-[1.04]">
              Напишите письмо.
            </h2>
          </Reveal>

          <div className="mt-10 max-w-[54ch] space-y-5 text-[16px] leading-[1.66] text-paper/80">
            <Reveal as="p" delay={620}>
              Коротко: о себе, об участке (если он есть), о том, что вы
              хотите — один абзац максимум. Не нужно «ТЗ», мудбордов или
              «референсов стиля».
            </Reveal>
            <Reveal as="p" delay={960}>
              Мы отвечаем в течение двух недель. Если то, что вы описали,
              резонирует — договариваемся о первой встрече. Если нет —
              отвечаем честно, почему нет. Без «возможно, позже».
            </Reveal>
            <Reveal as="p" delay={1280}>
              Мы принимаем 1–2 новых проекта в год. Если оба слота заняты,
              можем взять вас в лист ожидания на следующий сезон. Скажем
              об этом сразу.
            </Reveal>
          </div>

          <Reveal delay={1780}>
            <a
              href="mailto:hello@forma.bureau?subject=Первое%20письмо"
              className="quiet-link mt-12 inline-block font-serif font-light text-[22px]"
            >
              → Написать письмо
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col justify-end" style={{ flex: '1 1 38%' }}>
          <Reveal delay={1480}>
            <div className="font-mono text-[12px] leading-[2] text-paper/70 tracking-[0.06em]">
              <div className="text-paper">hello@forma.bureau</div>
              <div>+7 495 ХХХ ХХ ХХ</div>
              <div className="text-paper/45 mt-4">
                пн–чт, 10:00 — 17:00
                <br />
                московское
              </div>
              <div className="text-paper/45 mt-4 max-w-[24ch]">
                Басманный, Москва — адрес мастерской даётся после первого
                письма
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
