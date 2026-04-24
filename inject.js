/* Forma Bureau — local-only animation overlay.
 * Adds two new SVG elements to Spread 1:
 *   (a) a Palladian villa elevation with 10-sequence stroke-dashoffset draw-in
 *   (b) a skeleton-stroke title drawn glyph-by-glyph
 * Hides the original simple villa + InkedText by toggling a class on them.
 *
 * SAFE: never modifies page-built JS. Everything runs in its own namespace.
 * If injection fails or files are deleted, original hero shows unchanged.
 */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const AMBER = '#c8a878';

  /* ======================== PALLADIAN VILLA MARKUP ======================== */
  function buildVilla() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1200 420');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMax meet');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', AMBER);
    svg.setAttribute('stroke-width', '1');
    svg.setAttribute('stroke-linecap', 'square');

    svg.innerHTML = `
      <g class="seq-1" stroke-opacity="0.55">
        <line x1="20" y1="380" x2="1180" y2="380" pathLength="1"/>
      </g>
      <g class="seq-2" stroke-opacity="0.75">
        <line x1="120" y1="340" x2="1080" y2="340" pathLength="1"/>
        <line x1="120" y1="360" x2="1080" y2="360" pathLength="1" stroke-opacity="0.5"/>
        <line x1="120" y1="340" x2="120" y2="360" pathLength="1"/>
        <line x1="1080" y1="340" x2="1080" y2="360" pathLength="1"/>
        <line x1="475" y1="360" x2="725" y2="360" pathLength="1"/>
        <line x1="475" y1="360" x2="475" y2="374" pathLength="1"/>
        <line x1="725" y1="360" x2="725" y2="374" pathLength="1"/>
        <line x1="485" y1="367" x2="715" y2="367" pathLength="1" stroke-opacity="0.4"/>
        <line x1="495" y1="374" x2="705" y2="374" pathLength="1" stroke-opacity="0.4"/>
      </g>
      <g class="seq-3" stroke-opacity="0.85">
        <path d="M 120 340 L 120 165 L 440 165 L 440 340" pathLength="1"/>
        <path d="M 760 340 L 760 165 L 1080 165 L 1080 340" pathLength="1"/>
        <line x1="110" y1="160" x2="450" y2="160" pathLength="1" stroke-opacity="0.5"/>
        <line x1="750" y1="160" x2="1090" y2="160" pathLength="1" stroke-opacity="0.5"/>
      </g>
      <g class="seq-4" stroke-opacity="0.8">
        <line x1="440" y1="340" x2="760" y2="340" pathLength="1" stroke-opacity="0.5"/>
        <line x1="440" y1="165" x2="760" y2="165" pathLength="1"/>
        <line x1="438" y1="170" x2="762" y2="170" pathLength="1" stroke-opacity="0.45"/>
        ${[462, 520, 578, 622, 680, 738].map((cx) => `
          <line x1="${cx - 6}" y1="185" x2="${cx - 6}" y2="330" pathLength="1"/>
          <line x1="${cx + 6}" y1="185" x2="${cx + 6}" y2="330" pathLength="1"/>
          <line x1="${cx - 10}" y1="177" x2="${cx + 10}" y2="177" pathLength="1" stroke-opacity="0.7"/>
          <line x1="${cx - 10}" y1="182" x2="${cx + 10}" y2="182" pathLength="1" stroke-opacity="0.55"/>
          <line x1="${cx - 9}" y1="177" x2="${cx - 9}" y2="184" pathLength="1" stroke-opacity="0.45"/>
          <line x1="${cx + 9}" y1="177" x2="${cx + 9}" y2="184" pathLength="1" stroke-opacity="0.45"/>
          <line x1="${cx - 9}" y1="330" x2="${cx + 9}" y2="330" pathLength="1" stroke-opacity="0.6"/>
          <line x1="${cx - 10}" y1="335" x2="${cx + 10}" y2="335" pathLength="1" stroke-opacity="0.5"/>
          <line x1="${cx}" y1="190" x2="${cx}" y2="325" pathLength="1" stroke-opacity="0.18"/>
        `).join('')}
      </g>
      <g class="seq-5" stroke-opacity="0.75">
        <path d="M 430 160 L 600 80 L 770 160" pathLength="1"/>
        <path d="M 448 157 L 600 88 L 752 157" pathLength="1" stroke-opacity="0.4"/>
        <line x1="430" y1="160" x2="770" y2="160" pathLength="1"/>
        <circle cx="600" cy="128" r="10" pathLength="1" stroke-opacity="0.45"/>
        <circle cx="600" cy="128" r="5" pathLength="1" stroke-opacity="0.25"/>
      </g>
      <g class="seq-6" stroke-opacity="0.55">
        ${[158, 228, 298, 368].map((x) => `
          <path d="M ${x} 210 L ${x} 320 L ${x + 40} 320 L ${x + 40} 210 Z" pathLength="1"/>
          <line x1="${x + 20}" y1="210" x2="${x + 20}" y2="320" pathLength="1" stroke-opacity="0.35"/>
          <line x1="${x}" y1="260" x2="${x + 40}" y2="260" pathLength="1" stroke-opacity="0.3"/>
          <path d="M ${x} 210 Q ${x + 20} 202 ${x + 40} 210" pathLength="1" stroke-opacity="0.35"/>
        `).join('')}
        ${[782, 852, 922, 992].map((x) => `
          <path d="M ${x} 210 L ${x} 320 L ${x + 40} 320 L ${x + 40} 210 Z" pathLength="1"/>
          <line x1="${x + 20}" y1="210" x2="${x + 20}" y2="320" pathLength="1" stroke-opacity="0.35"/>
          <line x1="${x}" y1="260" x2="${x + 40}" y2="260" pathLength="1" stroke-opacity="0.3"/>
          <path d="M ${x} 210 Q ${x + 20} 202 ${x + 40} 210" pathLength="1" stroke-opacity="0.35"/>
        `).join('')}
        <path d="M 580 240 L 580 335 L 620 335 L 620 240" pathLength="1" stroke-opacity="0.75"/>
        <path d="M 580 240 Q 600 228 620 240" pathLength="1" stroke-opacity="0.55"/>
        <line x1="600" y1="240" x2="600" y2="335" pathLength="1" stroke-opacity="0.35"/>
      </g>
      <g class="seq-7" stroke-opacity="0.5">
        <line x1="120" y1="165" x2="440" y2="165" pathLength="1" stroke-opacity="0.35"/>
        <line x1="120" y1="200" x2="440" y2="200" pathLength="1" stroke-opacity="0.45"/>
        <line x1="760" y1="165" x2="1080" y2="165" pathLength="1" stroke-opacity="0.35"/>
        <line x1="760" y1="200" x2="1080" y2="200" pathLength="1" stroke-opacity="0.45"/>
        ${[168, 238, 308, 378, 792, 862, 932, 1002].map((x) => `
          <path d="M ${x} 175 L ${x} 195 L ${x + 22} 195 L ${x + 22} 175 Z" pathLength="1" stroke-opacity="0.4"/>
        `).join('')}
      </g>
      <g class="seq-8" stroke-opacity="0.6">
        <line x1="110" y1="140" x2="450" y2="140" pathLength="1"/>
        <line x1="750" y1="140" x2="1090" y2="140" pathLength="1"/>
        ${[140, 170, 200, 230, 260, 290, 320, 350, 380, 410,
           780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050].map((x) => `
          <line x1="${x}" y1="142" x2="${x}" y2="160" pathLength="1" stroke-opacity="0.3"/>
        `).join('')}
        <path d="M 220 140 L 220 90 L 252 90 L 252 140" pathLength="1"/>
        <path d="M 948 140 L 948 90 L 980 90 L 980 140" pathLength="1"/>
        <line x1="216" y1="90" x2="256" y2="90" pathLength="1" stroke-opacity="0.5"/>
        <line x1="944" y1="90" x2="984" y2="90" pathLength="1" stroke-opacity="0.5"/>
        <line x1="600" y1="70" x2="600" y2="400" pathLength="1" stroke-opacity="0.15" stroke-dasharray="3 5"/>
      </g>
      <g class="seq-9" stroke-opacity="0.3">
        <line x1="600" y1="380" x2="600" y2="412" pathLength="1" stroke-opacity="0.25"/>
        <path d="M 300 384 L 300 398 L 520 398 L 520 384 Z" pathLength="1" stroke-opacity="0.35"/>
        <path d="M 680 384 L 680 398 L 900 398 L 900 384 Z" pathLength="1" stroke-opacity="0.35"/>
        <line x1="410" y1="384" x2="410" y2="398" pathLength="1" stroke-opacity="0.2"/>
        <line x1="790" y1="384" x2="790" y2="398" pathLength="1" stroke-opacity="0.2"/>
        <line x1="300" y1="391" x2="520" y2="391" pathLength="1" stroke-opacity="0.18"/>
        <line x1="680" y1="391" x2="900" y2="391" pathLength="1" stroke-opacity="0.18"/>
        ${[30, 50, 70].map((x, i) => `
          <line x1="${x}" y1="${315 + (i % 2) * 10}" x2="${x}" y2="378" pathLength="1" stroke-opacity="0.28"/>
        `).join('')}
        ${[1130, 1150, 1170].map((x, i) => `
          <line x1="${x}" y1="${315 + (i % 2) * 10}" x2="${x}" y2="378" pathLength="1" stroke-opacity="0.28"/>
        `).join('')}
      </g>
      <g class="seq-10">
        <g stroke-opacity="0.32" stroke-width="0.7">
          <line x1="120" y1="410" x2="1080" y2="410" pathLength="1"/>
          <line x1="120" y1="405" x2="120" y2="415" pathLength="1"/>
          <line x1="1080" y1="405" x2="1080" y2="415" pathLength="1"/>
          <line x1="440" y1="407" x2="440" y2="413" pathLength="1" stroke-opacity="0.22"/>
          <line x1="760" y1="407" x2="760" y2="413" pathLength="1" stroke-opacity="0.22"/>
        </g>
        <text x="820" y="420" fill="${AMBER}" fill-opacity="0.5"
              font-family="ui-monospace, Menlo, monospace" font-size="7" letter-spacing="1.4">
          PALLADIAN VILLA · SOUTH ELEV · 1:100
        </text>
      </g>
    `;
    return svg;
  }

  /* ======================== DRAFTED TITLE GLYPHS ======================== */
  const G = {
    'Ч': { w: 110, strokes: ['M 0 0 L 0 55 L 100 55', 'M 100 0 L 100 120'] },
    'Д': {
      w: 120, descend: 15,
      strokes: [
        'M 18 0 L 82 0', 'M 82 0 L 82 120', 'M 18 0 L 18 120',
        'M 0 120 L 100 120', 'M 4 120 L 4 135', 'M 96 120 L 96 135'
      ]
    },
    'а': {
      w: 88,
      strokes: [
        'M 72 60 C 58 46 18 46 8 66 C 0 82 2 102 12 114 C 25 126 58 124 72 110',
        'M 72 50 L 72 118', 'M 68 50 L 78 50', 'M 68 118 L 78 118'
      ]
    },
    'в': {
      w: 82,
      strokes: [
        'M 4 50 L 4 120', 'M 0 50 L 12 50',
        'M 4 50 L 46 50 L 62 58 L 64 74 L 50 82 L 4 82',
        'M 4 82 L 50 82 L 68 92 L 70 108 L 54 120 L 4 120'
      ]
    },
    'г': {
      w: 78,
      strokes: [
        'M 4 50 L 4 120', 'M 0 50 L 12 50', 'M 4 50 L 60 50', 'M 2 120 L 12 120'
      ]
    },
    'д': {
      w: 92, descend: 18,
      strokes: [
        'M 22 50 L 66 50', 'M 66 50 L 66 120', 'M 22 50 L 22 120',
        'M 6 120 L 82 120', 'M 10 120 L 10 138', 'M 78 120 L 78 138'
      ]
    },
    'е': {
      w: 78,
      strokes: [
        'M 8 84 L 66 84',
        'M 68 80 C 68 58 44 48 26 54 C 4 62 0 94 6 110 C 16 126 52 124 66 112'
      ]
    },
    'к': {
      w: 78,
      strokes: [
        'M 4 50 L 4 120', 'M 0 50 L 12 50', 'M 0 120 L 12 120',
        'M 4 86 L 62 52', 'M 56 52 L 66 52', 'M 4 86 L 66 120', 'M 56 120 L 68 120'
      ]
    },
    'м': {
      w: 88,
      strokes: [
        'M 2 120 L 2 50 L 40 95 L 78 50 L 78 120',
        'M 0 120 L 12 120', 'M 66 120 L 80 120',
        'M 0 50 L 6 50', 'M 74 50 L 82 50'
      ]
    },
    'н': {
      w: 82,
      strokes: [
        'M 4 50 L 4 120', 'M 0 50 L 12 50', 'M 0 120 L 12 120',
        'M 72 50 L 72 120', 'M 66 50 L 78 50', 'M 66 120 L 78 120',
        'M 4 86 L 72 86'
      ]
    },
    'о': {
      w: 82,
      strokes: [
        'M 40 48 C 12 48 0 70 0 86 C 0 106 18 122 40 122 C 62 122 78 106 78 86 C 78 70 68 48 40 48 Z'
      ]
    },
    'п': {
      w: 82,
      strokes: [
        'M 4 50 L 4 120', 'M 0 50 L 12 50', 'M 0 120 L 12 120',
        'M 72 50 L 72 120', 'M 66 50 L 78 50', 'M 66 120 L 78 120',
        'M 4 50 L 72 50'
      ]
    },
    'р': {
      w: 82, descend: 22,
      strokes: [
        'M 4 50 L 4 142', 'M 0 50 L 12 50', 'M 0 142 L 12 142',
        'M 4 50 L 48 50 L 66 58 L 70 78 L 58 92 L 4 92'
      ]
    },
    'с': {
      w: 72,
      strokes: [
        'M 68 60 C 48 44 12 52 4 72 C -4 94 4 118 28 122 C 46 124 60 118 68 110'
      ]
    },
    'т': {
      w: 82,
      strokes: [
        'M 0 50 L 80 50', 'M 40 50 L 40 120', 'M 32 120 L 48 120'
      ]
    },
    'ы': {
      w: 110,
      strokes: [
        'M 4 50 L 4 120', 'M 0 50 L 12 50', 'M 0 120 L 12 120',
        'M 4 86 L 40 86 L 58 94 L 60 110 L 44 120 L 4 120',
        'M 88 50 L 88 120', 'M 82 50 L 94 50', 'M 82 120 L 94 120'
      ]
    },
    '.': { w: 28, strokes: ['M 8 115 L 8 120', 'M 4 117 L 12 117'] },
    ' ': { w: 38, strokes: [] }
  };

  function buildDraftedTitle(text, delay, stepMs, strokeMs) {
    const lines = text.split('\n');
    const LINE_H = 180;
    const CAP_H = 120;

    const strokes = [];
    let widest = 0, deepest = 0, order = 0;

    lines.forEach((line, li) => {
      let x = 0;
      for (const ch of line) {
        const g = G[ch] || G[' '];
        if (g.descend && g.descend > deepest) deepest = g.descend;
        g.strokes.forEach((d) => {
          strokes.push({ d, x, y: li * LINE_H, order: order++ });
        });
        x += g.w;
      }
      if (x > widest) widest = x;
    });

    const vbW = widest + 10;
    const vbH = (lines.length - 1) * LINE_H + CAP_H + Math.max(deepest, 0) + 10;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', AMBER);
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', text);

    strokes.forEach((s) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', s.d);
      p.setAttribute('pathLength', '1');
      p.setAttribute('transform', `translate(${s.x}, ${s.y})`);
      p.style.transitionDelay = `${delay + s.order * stepMs}ms`;
      p.style.transitionDuration = `${strokeMs}ms`;
      svg.appendChild(p);
    });

    return svg;
  }

  /* =================== SPREAD 3: 4 project elevations ==================== */
  function installSpread3() {
    // The 4 small project houses (Озеро-I / Дача-II / Лес-III / Резиденция)
    // all have viewBox="0 0 160 80". They sit in Spread3 above the ledger.
    const svgs = [...document.querySelectorAll('svg[viewBox="0 0 160 80"]')];
    svgs.forEach((svg) => {
      if (svg.dataset.formaSpread3) return;
      svg.dataset.formaSpread3 = '1';
      svg.classList.add('forma-inject-spread3');
      // Each stroke gets pathLength="1" + staggered transition delay so the
      // pen walks across the building.
      const drawables = svg.querySelectorAll(
        'path, line, polyline, rect, polygon, circle'
      );
      drawables.forEach((el, i) => {
        el.setAttribute('pathLength', '1');
        el.style.transitionDelay = `${i * 130}ms`;
        el.style.transitionDuration = '520ms';
      });
    });
    return svgs;
  }

  /* =============================== INSTALL =============================== */
  function install() {
    // Find the Spread 1 InkedText title
    const titleInked = document.querySelector('h1.inked')
      || document.querySelector('.inked');
    if (!titleInked) {
      console.warn('[forma-inject] .inked title not found — retrying');
      setTimeout(install, 800);
      return;
    }

    // Find original villa block (the one with "top:14vh" inline style)
    const originalVilla = [...document.querySelectorAll('div[style]')].find(
      (el) => /top:\s*14vh/.test(el.getAttribute('style') || '')
    );

    // ----- VILLA: replace the SVG inside the existing container -----
    if (originalVilla && !originalVilla.dataset.formaInjected) {
      originalVilla.dataset.formaInjected = '1';
      // Widen bbox and raise opacity per the new design
      originalVilla.setAttribute(
        'style',
        'top:12vh;left:10vw;right:24vw;height:38vh;opacity:0.24;position:absolute;pointer-events:none'
      );
      originalVilla.classList.add('forma-inject-villa');
      originalVilla.innerHTML = '';
      originalVilla.appendChild(buildVilla());
    }

    // ----- TITLE: hide original spans, overlay the drafted SVG inside .inked -----
    if (!titleInked.dataset.formaInjected) {
      titleInked.dataset.formaInjected = '1';
      // Hide inner spans (keeps .inked layout/size intact)
      [...titleInked.children].forEach((child) => {
        child.style.opacity = '0';
        child.style.visibility = 'hidden';
      });
      // Force position: relative for overlay parenting
      const cs = getComputedStyle(titleInked);
      if (cs.position === 'static') titleInked.style.position = 'relative';

      const overlay = document.createElement('div');
      overlay.className = 'forma-inject-title';
      overlay.style.cssText =
        'position:absolute;inset:0;pointer-events:none;overflow:visible';
      overlay.appendChild(
        buildDraftedTitle('Частные дома.\nДва проекта в год.', 180, 18, 140)
      );
      titleInked.appendChild(overlay);
    }

    // ----- SPREAD 3: project house elevations -----
    const spread3Svgs = installSpread3();

    // ----- ACTIVE-STATE HOOK -----
    const villaHost = originalVilla;
    const titleHost = titleInked.querySelector('.forma-inject-title');

    const currentIndex = () => {
      const d = window.__dossier;
      return d && typeof d.index === 'number' ? d.index : -1;
    };

    const apply = () => {
      const idx = currentIndex();
      const on1 = idx === 1;
      const on3 = idx === 3;
      [villaHost, titleHost].forEach((el) => {
        if (el) el.classList.toggle('drawing', on1);
      });
      spread3Svgs.forEach((svg) => svg.classList.toggle('drawing', on3));
    };

    apply();
    setInterval(apply, 250);
  }

  function boot() {
    // Let React hydrate + __dossier register + fonts settle
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(install, 1500));
    } else {
      setTimeout(install, 1500);
    }
  }
  boot();
})();
