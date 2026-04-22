/**
 * Zero-size SVG in the root layout that hosts ink-bleed filter definitions.
 * Referenced from CSS via filter: url(#id). Must be in the same document so
 * the selector resolves on Firefox and Safari.
 */
export function InkFilters() {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        <filter id="ink-bleed" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.4"
            numOctaves="1"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="paper-ink" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.6"
            numOctaves="1"
            seed="7"
            result="noise2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise2"
            scale="0.35"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="pencil-rough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.4"
            numOctaves="2"
            seed="11"
            result="graph"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="graph"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
