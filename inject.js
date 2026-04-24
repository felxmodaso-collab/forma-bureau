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

  /* =================== SPREAD 0: lock halo + unlock-flash fix ================ */
  function installSpread0Halo() {
    if (document.body.dataset.formaHalo) return;
    document.body.dataset.formaHalo = '1';

    // Remove the static SVG-internal glow circle entirely — its blur lives
    // inside a 460×320 SVG box and gets clipped by SVG bounds.
    const glowCircle = document.querySelector('circle[filter="url(#lock-glow)"]');
    if (glowCircle && glowCircle.parentNode) {
      glowCircle.parentNode.removeChild(glowCircle);
    }

    // Body-level CSS halo (the always-on ambient glow behind the lock)
    const halo = document.createElement('div');
    halo.className = 'forma-lock-halo';
    document.body.appendChild(halo);

    // ---------- UNLOCK-FLASH PATCH ----------
    // React renders a transient flash div when the user engages:
    //   <div style="width:460; height:320;
    //               background: radial-gradient(circle at 43% 55%,
    //                           rgba(200,168,120,0.55) 0%, transparent 55%)">
    // That div is only 460×320, so the gradient is PHYSICALLY clipped by the
    // div's own box — the flash glow can't exist beyond 460×320. Observe
    // DOM mutations and, as soon as React inserts this div, resize it and
    // recenter the gradient so it has room to bloom.
    const flashSignature = /radial-gradient\(circle at 43% 55%,\s*rgba\(200,\s*168,\s*120,\s*0\.55\)/;

    const patchFlash = (el) => {
      if (!el || el.nodeType !== 1) return;
      if (el.dataset && el.dataset.formaFlashPatched) return;
      const bg = el.style && el.style.background;
      if (!bg || !flashSignature.test(bg)) return;
      el.dataset.formaFlashPatched = '1';
      // Expand the box so the gradient has room; recenter gradient too
      el.style.width = '1600px';
      el.style.height = '1600px';
      el.style.background =
        'radial-gradient(circle at 50% 50%, rgba(200,168,120,0.55) 0%, rgba(200,168,120,0.22) 22%, transparent 52%)';
    };

    const scanTree = (root) => {
      if (!root) return;
      if (root.nodeType === 1) {
        patchFlash(root);
        // Also walk descendants
        if (root.querySelectorAll) {
          root.querySelectorAll('div[style*="radial-gradient"]').forEach(patchFlash);
        }
      }
    };

    // Patch any already-mounted flash first
    scanTree(document.body);

    // Observe subsequent insertions
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach(scanTree);
        // Also catch style-attribute mutations (React might swap a class/style)
        if (m.type === 'attributes' && m.attributeName === 'style') {
          patchFlash(m.target);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }

  /* =============== Smooth commit/snap transition toggle =============== */
  function installTransitionSmoothing() {
    // Poll dossier phase. During 'committing' / 'snapback', body gets a
    // class that enables a CSS transition on .dossier-sheet transforms.
    // During 'dragging' the class is off so drag stays 1:1 with pointer.
    setInterval(() => {
      const phase = window.__dossier?.phase;
      const smooth = phase === 'committing' || phase === 'snapback';
      document.body.classList.toggle('forma-phase-smooth', smooth);
    }, 33);
  }

  /* ======== SPREAD 4: uniform archival paper frame on all 6 phases ========
     Replace all 6 different clip-path shapes (trapezoid/circle/arch/etc.)
     with a single architectural-plate look — paper-cream background,
     4 corner registration marks, thin amber border inside, "SEC · NN" top
     label, "ARCH · NN" bottom-right, small N-compass, archive plate bottom-
     left. Photo is recoloured to match aged-blueprint aesthetic. */
  function installPhaseFrames() {
    const svgs = [...document.querySelectorAll('svg[viewBox="0 0 380 285"]')];
    if (svgs.length === 0) return;
    const PAPER = '#e6dbc2';
    const AMBER_STROKE = '#c8a878';

    svgs.forEach((svg, i) => {
      if (svg.dataset.formaPhase) return;
      svg.dataset.formaPhase = '1';
      svg.classList.add('forma-phase-frame');

      // Normalize clip to full rectangle so the image fills the plate
      svg.querySelectorAll('clipPath').forEach((cp) => {
        cp.innerHTML = '<rect x="10" y="10" width="360" height="265"/>';
      });

      // Kill decorative outer polygon/circle/path frames (direct SVG children)
      [...svg.children].forEach((el) => {
        const t = el.tagName.toLowerCase();
        if (t === 'polygon' || t === 'circle' || t === 'path' || t === 'ellipse') {
          el.remove();
        }
      });

      // Recolor the dark backdrop to paper cream
      const bgRect = svg.querySelector('g > rect');
      if (bgRect) {
        bgRect.setAttribute('fill', PAPER);
        bgRect.setAttribute('x', '10');
        bgRect.setAttribute('y', '10');
        bgRect.setAttribute('width', '360');
        bgRect.setAttribute('height', '265');
      }

      // Phase 3 (index 2) had no <image> — give it the scale-model photo
      let image = svg.querySelector('image');
      if (!image && i === 2) {
        const g = svg.querySelector('g');
        if (g) {
          image = document.createElementNS(NS, 'image');
          image.setAttribute('href', '/forma-bureau/assets/forma/scale-model.png');
          image.setAttribute('x', '10');
          image.setAttribute('y', '10');
          image.setAttribute('width', '360');
          image.setAttribute('height', '265');
          image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
          // Clear any stray conceptual drawing leftovers (keep only bg rect)
          [...g.children].forEach((el) => {
            if (el !== bgRect) el.remove();
          });
          g.appendChild(image);
        }
      }

      // Keep the photo's original filter/color as v20 shipped. Just inset
      // it from the viewBox edges so the paper mat shows around it.
      if (image) {
        image.setAttribute('x', '22');
        image.setAttribute('y', '22');
        image.setAttribute('width', '336');
        image.setAttribute('height', '241');
        image.removeAttribute('style');
      }

      // --- Decorative frame elements ---
      const num = String(i + 1).padStart(2, '0');
      const PLATE_CHAR = String.fromCharCode(64 + i + 1); // A,B,C,D,E,F

      // Corner marks (L-shapes) just outside the inner border
      const CS = 9;
      const markD = [
        `M 3 ${3 + CS} L 3 3 L ${3 + CS} 3`,
        `M ${380 - 3 - CS} 3 L ${380 - 3} 3 L ${380 - 3} ${3 + CS}`,
        `M 3 ${285 - 3 - CS} L 3 ${285 - 3} L ${3 + CS} ${285 - 3}`,
        `M ${380 - 3 - CS} ${285 - 3} L ${380 - 3} ${285 - 3} L ${380 - 3} ${285 - 3 - CS}`
      ];
      markD.forEach((d) => {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', AMBER_STROKE);
        p.setAttribute('stroke-opacity', '0.85');
        p.setAttribute('stroke-width', '1.1');
        svg.appendChild(p);
      });

      // Inner border rectangle (inside the corner marks)
      const border = document.createElementNS(NS, 'rect');
      border.setAttribute('x', '10');
      border.setAttribute('y', '10');
      border.setAttribute('width', '360');
      border.setAttribute('height', '265');
      border.setAttribute('fill', 'none');
      border.setAttribute('stroke', AMBER_STROKE);
      border.setAttribute('stroke-opacity', '0.4');
      border.setAttribute('stroke-width', '0.6');
      svg.appendChild(border);

      // Top-center "SEC · NN"
      const top = document.createElementNS(NS, 'text');
      top.setAttribute('x', '190');
      top.setAttribute('y', '8');
      top.setAttribute('text-anchor', 'middle');
      top.setAttribute('fill', AMBER_STROKE);
      top.setAttribute('fill-opacity', '0.68');
      top.setAttribute('font-family', 'ui-monospace, Menlo, monospace');
      top.setAttribute('font-size', '5.5');
      top.setAttribute('letter-spacing', '2.6');
      top.textContent = `SEC · ${num}`;
      svg.appendChild(top);

      // Bottom-right "ARCH · NN"
      const br = document.createElementNS(NS, 'text');
      br.setAttribute('x', '370');
      br.setAttribute('y', '283');
      br.setAttribute('text-anchor', 'end');
      br.setAttribute('fill', AMBER_STROKE);
      br.setAttribute('fill-opacity', '0.6');
      br.setAttribute('font-family', 'ui-monospace, Menlo, monospace');
      br.setAttribute('font-size', '5');
      br.setAttribute('letter-spacing', '2.2');
      br.textContent = `ARCH · ${num}`;
      svg.appendChild(br);

      // Archive plate bottom-left
      const plate = document.createElementNS(NS, 'g');
      plate.setAttribute('transform', 'translate(18, 242)');
      plate.innerHTML = `
        <rect x="0" y="0" width="116" height="26" fill="${PAPER}" stroke="${AMBER_STROKE}" stroke-opacity="0.65" stroke-width="0.55"/>
        <text x="6" y="8.5" font-family="ui-monospace, Menlo, monospace" font-size="4.8" letter-spacing="0.8" fill="#524735">FORMA · BUREAU</text>
        <text x="6" y="16.5" font-family="ui-monospace, Menlo, monospace" font-size="5.6" letter-spacing="0.9" fill="#38311e" font-weight="600">CROSS-SECTION A-A</text>
        <text x="6" y="23" font-family="ui-monospace, Menlo, monospace" font-size="4.6" letter-spacing="0.8" fill="#6d5f44">ARCHIVE NO. 45-${PLATE_CHAR}</text>
      `;
      svg.appendChild(plate);

      // Small N-compass bottom-right (above ARCH label)
      const compass = document.createElementNS(NS, 'g');
      compass.setAttribute('transform', 'translate(345, 252)');
      compass.innerHTML = `
        <circle cx="0" cy="0" r="8" fill="${PAPER}" stroke="${AMBER_STROKE}" stroke-opacity="0.55" stroke-width="0.5"/>
        <line x1="0" y1="-8" x2="0" y2="8" stroke="${AMBER_STROKE}" stroke-opacity="0.3" stroke-width="0.35"/>
        <line x1="-8" y1="0" x2="8" y2="0" stroke="${AMBER_STROKE}" stroke-opacity="0.3" stroke-width="0.35"/>
        <path d="M 0 -10 L -2 -5 L 2 -5 Z" fill="${AMBER_STROKE}" fill-opacity="0.8"/>
        <text x="0" y="-11.5" font-family="ui-monospace, Menlo, monospace" font-size="3.5" text-anchor="middle" fill="${AMBER_STROKE}" fill-opacity="0.6">N</text>
      `;
      svg.appendChild(compass);
    });
  }

  /* ========== SPREAD 4: Architectural diary — 4 plates on rotation ==========
     Four classical architectural plates cycle in sequence:
       1. Ionic column (with fluting, volutes, entablature, stylobate)
       2. Palladian villa facade (portico, wings, dome with lantern)
       3. Villa Rotonda plan (square-inscribed-circle + 4 porticos)
       4. Dome cross-section (drum on columns, coffered vault, oculus)
     Each plate: draws in ~2s → holds ~1.8s (with gentle rotateY sway) →
     erases in ~1.2s → next plate. Full cycle ~20s. */
  function installSpread4Rotator() {
    if (document.body.dataset.formaRotator) return;
    document.body.dataset.formaRotator = '1';

    const wrap = document.createElement('div');
    wrap.className = 'forma-rotator-wrap';
    wrap.innerHTML = `
      <div class="forma-plate-stack">
        <!-- PLATE 1: Ionic column ===================================== -->
        <svg class="forma-plate plate-col" viewBox="0 0 240 320"
             xmlns="http://www.w3.org/2000/svg" fill="none"
             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <!-- Architrave + frieze + cornice (entablature) -->
          <path d="M 60 42 L 180 42 L 180 48 L 60 48 Z"/>
          <path d="M 58 48 L 182 48 L 182 70 L 58 70 Z"/>
          <path d="M 56 70 L 184 70 L 184 78 L 56 78 Z"/>
          <!-- Triglyphs (Doric-style grooves in frieze) -->
          <path d="M 72 66 L 72 52 M 76 66 L 76 52 M 80 66 L 80 52"/>
          <path d="M 96 66 L 96 52 M 100 66 L 100 52 M 104 66 L 104 52"/>
          <path d="M 118 66 L 118 52 M 122 66 L 122 52 M 126 66 L 126 52"/>
          <path d="M 140 66 L 140 52 M 144 66 L 144 52 M 148 66 L 148 52"/>
          <path d="M 162 66 L 162 52 M 166 66 L 166 52 M 170 66 L 170 52"/>
          <!-- Abacus (square top of capital) -->
          <path d="M 74 82 L 166 82 L 166 92 L 74 92 Z"/>
          <!-- Ionic capital: echinus band under abacus -->
          <path d="M 80 92 L 160 92 L 158 100 L 82 100 Z"/>
          <!-- Left volute (spiral) -->
          <path d="M 78 94 Q 68 96 66 104 Q 64 112 72 114 Q 80 114 80 106 Q 80 100 74 100 Q 70 100 72 104"/>
          <!-- Right volute -->
          <path d="M 162 94 Q 172 96 174 104 Q 176 112 168 114 Q 160 114 160 106 Q 160 100 166 100 Q 170 100 168 104"/>
          <!-- Necking (ring between capital and shaft) -->
          <path d="M 86 116 L 154 116"/>
          <path d="M 86 120 L 154 120"/>
          <!-- Shaft outline (vertical column) -->
          <path d="M 88 120 L 88 244"/>
          <path d="M 152 120 L 152 244"/>
          <!-- Flutes: 9 vertical grooves inside shaft -->
          <path d="M 94 124 L 94 242"/>
          <path d="M 102 124 L 102 242"/>
          <path d="M 110 124 L 110 242"/>
          <path d="M 118 124 L 118 242"/>
          <path d="M 126 124 L 126 242"/>
          <path d="M 134 124 L 134 242"/>
          <path d="M 142 124 L 142 242"/>
          <path d="M 146 124 L 146 242"/>
          <path d="M 98 124 L 98 242"/>
          <!-- Base: upper torus (fat convex ring) -->
          <path d="M 84 244 L 156 244 L 154 254 L 86 254 Z"/>
          <!-- Base: scotia (concave groove) -->
          <path d="M 84 254 L 156 254"/>
          <path d="M 86 254 L 88 262 L 152 262 L 154 254"/>
          <!-- Base: lower torus -->
          <path d="M 82 262 L 158 262 L 156 272 L 84 272 Z"/>
          <!-- Plinth (square base block) -->
          <path d="M 74 272 L 166 272 L 166 286 L 74 286 Z"/>
          <!-- Stylobate step (platform) -->
          <path d="M 50 286 L 190 286 L 190 298 L 50 298 Z"/>
          <path d="M 40 298 L 200 298 L 200 306 L 40 306 Z"/>
        </svg>

        <!-- PLATE 2: Palladian villa facade =========================== -->
        <svg class="forma-plate plate-villa" viewBox="0 0 240 320"
             xmlns="http://www.w3.org/2000/svg" fill="none"
             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <!-- Ground line -->
          <path d="M 10 276 L 230 276"/>
          <!-- Dome silhouette (behind pediment) -->
          <path d="M 100 108 Q 120 58 140 108"/>
          <path d="M 100 108 L 140 108"/>
          <!-- Lantern on dome -->
          <path d="M 115 70 L 115 60 L 125 60 L 125 70"/>
          <path d="M 113 60 L 127 60"/>
          <path d="M 117 60 L 117 52 L 123 52 L 123 60"/>
          <path d="M 120 52 L 120 44"/>
          <path d="M 117 48 L 123 48"/>
          <!-- Oculus on dome -->
          <circle cx="120" cy="95" r="3.5"/>
          <!-- Pediment (triangular front) -->
          <path d="M 78 140 L 120 100 L 162 140"/>
          <!-- Cornice below pediment -->
          <path d="M 76 140 L 164 140 L 164 148 L 76 148 Z"/>
          <!-- Entablature (architrave + frieze) -->
          <path d="M 74 148 L 166 148 L 166 164 L 74 164 Z"/>
          <!-- Small decorative in pediment -->
          <circle cx="120" cy="128" r="5"/>
          <path d="M 115 128 L 125 128 M 120 123 L 120 133"/>
          <!-- 4 columns of front portico -->
          <path d="M 84 164 L 84 244 L 92 244 L 92 164"/>
          <path d="M 84 166 L 92 166 M 82 244 L 94 244"/>
          <path d="M 85 170 L 85 240 M 87 170 L 87 240 M 89 170 L 89 240 M 91 170 L 91 240"/>

          <path d="M 104 164 L 104 244 L 112 244 L 112 164"/>
          <path d="M 104 166 L 112 166 M 102 244 L 114 244"/>
          <path d="M 105 170 L 105 240 M 107 170 L 107 240 M 109 170 L 109 240 M 111 170 L 111 240"/>

          <path d="M 128 164 L 128 244 L 136 244 L 136 164"/>
          <path d="M 128 166 L 136 166 M 126 244 L 138 244"/>
          <path d="M 129 170 L 129 240 M 131 170 L 131 240 M 133 170 L 133 240 M 135 170 L 135 240"/>

          <path d="M 148 164 L 148 244 L 156 244 L 156 164"/>
          <path d="M 148 166 L 156 166 M 146 244 L 158 244"/>
          <path d="M 149 170 L 149 240 M 151 170 L 151 240 M 153 170 L 153 240 M 155 170 L 155 240"/>
          <!-- Podium with two-step base -->
          <path d="M 68 246 L 172 246 L 172 276 L 68 276 Z"/>
          <path d="M 68 258 L 172 258 M 68 267 L 172 267"/>
          <!-- Left wing (side building) -->
          <path d="M 10 185 L 74 185 L 74 276 L 10 276 Z"/>
          <path d="M 10 185 L 20 170 L 74 170"/>
          <!-- Left wing 3 arched windows -->
          <path d="M 18 220 L 18 200 L 24 194 L 30 200 L 30 220 Z"/>
          <path d="M 24 194 L 24 220"/>
          <path d="M 36 220 L 36 200 L 42 194 L 48 200 L 48 220 Z"/>
          <path d="M 42 194 L 42 220"/>
          <path d="M 54 220 L 54 200 L 60 194 L 66 200 L 66 220 Z"/>
          <path d="M 60 194 L 60 220"/>
          <!-- Right wing -->
          <path d="M 166 185 L 230 185 L 230 276 L 166 276 Z"/>
          <path d="M 166 185 L 220 170 L 230 185"/>
          <!-- Right wing windows -->
          <path d="M 174 220 L 174 200 L 180 194 L 186 200 L 186 220 Z"/>
          <path d="M 180 194 L 180 220"/>
          <path d="M 192 220 L 192 200 L 198 194 L 204 200 L 204 220 Z"/>
          <path d="M 198 194 L 198 220"/>
          <path d="M 210 220 L 210 200 L 216 194 L 222 200 L 222 220 Z"/>
          <path d="M 216 194 L 216 220"/>
          <!-- Steps in front of portico -->
          <path d="M 76 276 L 164 276 L 164 282 L 76 282 Z"/>
          <path d="M 74 282 L 166 282 L 166 288 L 74 288 Z"/>
          <path d="M 72 288 L 168 288 L 168 294 L 72 294 Z"/>
        </svg>

        <!-- PLATE 3: Villa Rotonda plan =============================== -->
        <svg class="forma-plate plate-plan" viewBox="0 0 240 320"
             xmlns="http://www.w3.org/2000/svg" fill="none"
             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <!-- Main square block -->
          <path d="M 70 95 L 170 95 L 170 195 L 70 195 Z"/>
          <!-- Inner walls (rooms) -->
          <path d="M 70 125 L 170 125"/>
          <path d="M 70 165 L 170 165"/>
          <path d="M 100 95 L 100 195"/>
          <path d="M 140 95 L 140 195"/>
          <!-- Central circle: domed rotunda hall -->
          <circle cx="120" cy="145" r="30"/>
          <circle cx="120" cy="145" r="22"/>
          <!-- Cross-axial lines through rotunda -->
          <path d="M 120 113 L 120 177"/>
          <path d="M 88 145 L 152 145"/>
          <!-- Rotunda center point -->
          <path d="M 117 145 L 123 145 M 120 142 L 120 148"/>
          <!-- North portico (top) -->
          <path d="M 100 70 L 140 70 L 140 95 L 100 95 Z"/>
          <path d="M 104 75 L 106 75 L 106 92 L 104 92 Z"/>
          <path d="M 112 75 L 114 75 L 114 92 L 112 92 Z"/>
          <path d="M 120 75 L 122 75 L 122 92 L 120 92 Z"/>
          <path d="M 128 75 L 130 75 L 130 92 L 128 92 Z"/>
          <path d="M 134 75 L 136 75 L 136 92 L 134 92 Z"/>
          <!-- North steps -->
          <path d="M 95 70 L 145 70 L 145 65 L 95 65"/>
          <path d="M 92 65 L 148 65 L 148 60 L 92 60"/>
          <!-- South portico (bottom) -->
          <path d="M 100 195 L 140 195 L 140 220 L 100 220 Z"/>
          <path d="M 104 198 L 106 198 L 106 215 L 104 215 Z"/>
          <path d="M 112 198 L 114 198 L 114 215 L 112 215 Z"/>
          <path d="M 120 198 L 122 198 L 122 215 L 120 215 Z"/>
          <path d="M 128 198 L 130 198 L 130 215 L 128 215 Z"/>
          <path d="M 134 198 L 136 198 L 136 215 L 134 215 Z"/>
          <path d="M 95 220 L 145 220 L 145 225 L 95 225"/>
          <path d="M 92 225 L 148 225 L 148 230 L 92 230"/>
          <!-- West portico (left) -->
          <path d="M 45 125 L 70 125 L 70 165 L 45 165 Z"/>
          <path d="M 50 129 L 65 129 L 65 131 L 50 131 Z"/>
          <path d="M 50 137 L 65 137 L 65 139 L 50 139 Z"/>
          <path d="M 50 145 L 65 145 L 65 147 L 50 147 Z"/>
          <path d="M 50 153 L 65 153 L 65 155 L 50 155 Z"/>
          <path d="M 50 161 L 65 161 L 65 163 L 50 163 Z"/>
          <path d="M 45 130 L 40 130 L 40 160 L 45 160"/>
          <path d="M 40 130 L 35 130 L 35 160 L 40 160"/>
          <!-- East portico (right) -->
          <path d="M 170 125 L 195 125 L 195 165 L 170 165 Z"/>
          <path d="M 175 129 L 190 129 L 190 131 L 175 131 Z"/>
          <path d="M 175 137 L 190 137 L 190 139 L 175 139 Z"/>
          <path d="M 175 145 L 190 145 L 190 147 L 175 147 Z"/>
          <path d="M 175 153 L 190 153 L 190 155 L 175 155 Z"/>
          <path d="M 175 161 L 190 161 L 190 163 L 175 163 Z"/>
          <path d="M 195 130 L 200 130 L 200 160 L 195 160"/>
          <path d="M 200 130 L 205 130 L 205 160 L 200 160"/>
          <!-- Compass rose (top-right corner) -->
          <circle cx="212" cy="38" r="12"/>
          <path d="M 212 26 L 212 50 M 200 38 L 224 38"/>
          <path d="M 212 26 L 209 32 L 215 32 Z"/>
          <path d="M 207 28 L 212 38 L 217 28"/>
          <!-- Scale bar (bottom) -->
          <path d="M 75 258 L 165 258"/>
          <path d="M 75 256 L 75 260 M 97 256 L 97 260 M 120 256 L 120 260 M 142 256 L 142 260 M 165 256 L 165 260"/>
          <path d="M 75 264 L 165 264"/>
          <!-- Dimension lines -->
          <path d="M 50 280 L 190 280"/>
          <path d="M 50 276 L 50 284 M 190 276 L 190 284"/>
          <path d="M 115 276 L 120 280 L 125 276"/>
          <!-- Scale ticks at intervals -->
          <path d="M 50 290 L 55 290 M 60 290 L 70 290 M 80 290 L 85 290"/>
          <path d="M 155 290 L 160 290 M 170 290 L 180 290 M 185 290 L 190 290"/>
        </svg>

        <!-- PLATE 4: Dome cross-section with oculus =================== -->
        <svg class="forma-plate plate-dome" viewBox="0 0 240 320"
             xmlns="http://www.w3.org/2000/svg" fill="none"
             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <!-- Floor line (datum) -->
          <path d="M 10 276 L 230 276"/>
          <path d="M 10 280 L 230 280" stroke-dasharray="3 2"/>
          <!-- Drum wall (circular drum supporting dome) -->
          <path d="M 50 160 L 50 276"/>
          <path d="M 190 160 L 190 276"/>
          <!-- Drum entablature -->
          <path d="M 46 152 L 194 152 L 194 160 L 46 160 Z"/>
          <path d="M 46 144 L 194 144 L 194 152 L 46 152 Z"/>
          <!-- Dome curve (hemispherical) -->
          <path d="M 50 144 Q 120 32 190 144"/>
          <!-- Interior dome curve (thickness) -->
          <path d="M 58 144 Q 120 48 182 144"/>
          <!-- Coffering: radial lines from center up to dome -->
          <path d="M 120 144 L 66 138"/>
          <path d="M 120 144 L 78 112"/>
          <path d="M 120 144 L 96 82"/>
          <path d="M 120 144 L 120 58"/>
          <path d="M 120 144 L 144 82"/>
          <path d="M 120 144 L 162 112"/>
          <path d="M 120 144 L 174 138"/>
          <!-- Coffering: horizontal bands of coffers -->
          <path d="M 66 128 Q 120 82 174 128"/>
          <path d="M 78 108 Q 120 70 162 108"/>
          <path d="M 92 90 Q 120 62 148 90"/>
          <!-- Oculus (hole at apex) -->
          <path d="M 108 58 L 132 58"/>
          <path d="M 108 52 L 132 52"/>
          <path d="M 108 52 L 108 58"/>
          <path d="M 132 52 L 132 58"/>
          <!-- Light rays from oculus to floor -->
          <path d="M 111 60 L 90 276" stroke-dasharray="4 3"/>
          <path d="M 116 60 L 108 276" stroke-dasharray="4 3"/>
          <path d="M 120 60 L 120 276" stroke-dasharray="4 3"/>
          <path d="M 124 60 L 132 276" stroke-dasharray="4 3"/>
          <path d="M 129 60 L 150 276" stroke-dasharray="4 3"/>
          <!-- Columns at drum base (portico / peristyle) -->
          <path d="M 50 160 L 50 276"/>
          <path d="M 70 164 L 70 272 L 78 272 L 78 164 L 70 164 Z"/>
          <path d="M 72 168 L 72 268 M 74 168 L 74 268 M 76 168 L 76 268"/>
          <path d="M 94 164 L 94 272 L 102 272 L 102 164 L 94 164 Z"/>
          <path d="M 96 168 L 96 268 M 98 168 L 98 268 M 100 168 L 100 268"/>
          <path d="M 138 164 L 138 272 L 146 272 L 146 164 L 138 164 Z"/>
          <path d="M 140 168 L 140 268 M 142 168 L 142 268 M 144 168 L 144 268"/>
          <path d="M 162 164 L 162 272 L 170 272 L 170 164 L 162 164 Z"/>
          <path d="M 164 168 L 164 268 M 166 168 L 166 268 M 168 168 L 168 268"/>
          <!-- Central door in drum -->
          <path d="M 108 276 L 108 220 L 120 206 L 132 220 L 132 276"/>
          <path d="M 120 206 L 120 276"/>
          <!-- Steps in front -->
          <path d="M 30 280 L 210 280 L 210 286 L 30 286 Z"/>
          <path d="M 20 286 L 220 286 L 220 292 L 20 292 Z"/>
          <!-- Dimension line + arrow -->
          <path d="M 40 310 L 200 310"/>
          <path d="M 40 306 L 40 314 M 200 306 L 200 314"/>
          <path d="M 115 306 L 120 310 L 125 306"/>
        </svg>
      </div>
      <div class="forma-rotator-caption" data-caption></div>
    `;
    document.body.appendChild(wrap);

    // pathLength="1" lets us stroke-dashoffset-animate any path/circle as if length=1
    // Per-plate: set --d (forward draw delay) and --dr (reverse erase delay) so
    // the pen walks each plate from first element to last when drawing, and
    // erases last → first.
    wrap.querySelectorAll('.forma-plate').forEach((plate) => {
      const strokes = [...plate.querySelectorAll('path, circle')];
      const n = strokes.length;
      strokes.forEach((s, i) => {
        s.setAttribute('pathLength', '1');
        // Cap total draw stagger at ~900ms so the full draw finishes in
        // ~1.8s (delay + 900ms transition). Max stagger = min(900, n*38).
        const step = Math.min(38, Math.floor(900 / Math.max(1, n - 1)));
        s.style.setProperty('--d',  `${i * step}ms`);
        s.style.setProperty('--dr', `${(n - 1 - i) * Math.min(20, Math.floor(600 / Math.max(1, n-1)))}ms`);
      });
    });

    const plates = [...wrap.querySelectorAll('.forma-plate')];
    const captionEl = wrap.querySelector('[data-caption]');
    const labels = [
      'Колонна · Ионический ордер',
      'Вилла · Палладианский фасад',
      'Ротонда · План',
      'Купол · Разрез',
    ];
    const DRAW_MS  = 2000;  // 900ms stagger + 900ms transition + buffer
    const HOLD_MS  = 1800;
    const ERASE_MS = 1350;  // 600ms stagger + 650ms transition + buffer
    let cycleIdx = 0;
    let cycleTimer = null;
    let running = false;

    function advance() {
      const plate = plates[cycleIdx];
      plate.classList.add('drawing');
      if (captionEl) captionEl.textContent = labels[cycleIdx];
      // After draw completes → enter hold
      cycleTimer = window.setTimeout(() => {
        plate.classList.remove('drawing');
        plate.classList.add('held');
        // After hold → erase
        cycleTimer = window.setTimeout(() => {
          plate.classList.remove('held');
          plate.classList.add('erasing');
          cycleTimer = window.setTimeout(() => {
            plate.classList.remove('erasing');
            cycleIdx = (cycleIdx + 1) % plates.length;
            if (running) advance();
          }, ERASE_MS);
        }, HOLD_MS);
      }, DRAW_MS);
    }

    function start() {
      if (running) return;
      running = true;
      cycleIdx = 0;
      advance();
    }
    function stop() {
      running = false;
      if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
      plates.forEach((p) => p.classList.remove('drawing', 'held', 'erasing'));
      if (captionEl) captionEl.textContent = '';
    }

    // Show only while Spread 4 is in viewport — IntersectionObserver is
    // more reliable than __dossier.index in the v20 scroll-snap build.
    const s4 = document.querySelector('section[data-index="4"]');
    if (s4) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              wrap.classList.add('visible');
              start();
            } else {
              wrap.classList.remove('visible');
              stop();
            }
          });
        },
        { threshold: 0.05 }
      );
      io.observe(s4);
    }
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

  /* ========== SPREAD 6: pigeon picks up letter, flies toward email ==========
     Scene draws itself in the top-right empty zone of the contact spread.
     Sequence (JS orchestrates phase classes, CSS handles visuals):
       1. Envelope strokes draw in  (~1.2s)
       2. Pigeon strokes draw in, pigeon fades from upper-right  (~1.1s)
       3. Pigeon descends onto envelope (pickup pause)  (~0.6s)
       4. Pigeon+envelope translate together toward email (down-left)  (~2.2s)
       5. Fade out  (~0.5s)
       6. Pause, then loop (~2s)
     Total: ~7.6s per cycle. */
  function installSpread6Pigeon() {
    const s6 = document.querySelector('section[data-index="6"]');
    if (!s6 || s6.dataset.formaPigeon) return;
    s6.dataset.formaPigeon = '1';

    const host = document.createElement('div');
    host.className = 'forma-pigeon-host';
    // Winged-envelope concept: envelope draws in, wings sprout from its
    // sides, the whole thing flaps and flies in an arc toward the email.
    host.innerHTML = `
      <svg class="forma-pigeon-svg" viewBox="0 0 500 380"
           xmlns="http://www.w3.org/2000/svg" fill="none"
           stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <g class="pg-stage">
          <!-- Envelope body, centered at (260, 207) -->
          <g class="pg-env">
            <path class="e-seq" d="M 220 180 L 300 180 L 300 234 L 220 234 Z"/>
            <path class="e-seq" d="M 220 180 L 260 210 L 300 180"/>
            <path class="e-seq" d="M 220 234 L 260 210"/>
            <path class="e-seq" d="M 300 234 L 260 210"/>
            <path class="e-seq" d="M 232 198 L 252 198"/>
            <path class="e-seq" d="M 232 204 L 248 204"/>
            <circle class="e-seq" cx="260" cy="222" r="2.8"/>
            <path class="e-seq" d="M 258 222 L 262 222 M 260 220 L 260 224"/>
          </g>
          <!-- Left wing — flat coords; rotation animated via JS setting
               SVG transform="rotate(angle cx cy)" around pivot (220,207). -->
          <g class="pg-wing pg-wing-l" data-pivot-x="220" data-pivot-y="207">
            <path class="w-seq" d="M 220 195 Q 190 172 148 188 Q 158 210 170 222 Q 196 222 220 215 Z"/>
            <path class="w-seq" d="M 210 200 L 178 180"/>
            <path class="w-seq" d="M 202 206 L 168 192"/>
            <path class="w-seq" d="M 196 212 L 160 208"/>
          </g>
          <!-- Right wing — pivot (300,207). -->
          <g class="pg-wing pg-wing-r" data-pivot-x="300" data-pivot-y="207">
            <path class="w-seq" d="M 300 195 Q 330 172 372 188 Q 362 210 350 222 Q 324 222 300 215 Z"/>
            <path class="w-seq" d="M 310 200 L 342 180"/>
            <path class="w-seq" d="M 318 206 L 352 192"/>
            <path class="w-seq" d="M 324 212 L 360 208"/>
          </g>
        </g>
      </svg>
    `;
    s6.appendChild(host);

    // pathLength="1" on every stroke for dashoffset animation
    host.querySelectorAll('.e-seq, .w-seq').forEach((p) => {
      p.setAttribute('pathLength', '1');
    });

    let timer = null;
    let running = false;

    // JS-driven wing flap — sets SVG transform="rotate(angle cx cy)" each frame.
    const wingL = host.querySelector('.pg-wing-l');
    const wingR = host.querySelector('.pg-wing-r');
    const pivotLX = +wingL.dataset.pivotX, pivotLY = +wingL.dataset.pivotY;
    const pivotRX = +wingR.dataset.pivotX, pivotRY = +wingR.dataset.pivotY;
    let flapStart = 0;
    let flapRaf = 0;
    let flapFast = false;
    function flap(ts) {
      if (!flapStart) flapStart = ts;
      const dt = ts - flapStart;
      const period = flapFast ? 280 : 420;
      // sine oscillation in [-20, +20] deg for left, [+20, -20] for right
      const phase = (dt / period) * Math.PI;
      const angle = Math.sin(phase) * 22;
      wingL.setAttribute('transform', `rotate(${-angle} ${pivotLX} ${pivotLY})`);
      wingR.setAttribute('transform', `rotate(${ angle} ${pivotRX} ${pivotRY})`);
      flapRaf = requestAnimationFrame(flap);
    }
    function startFlap(fast) {
      flapFast = !!fast;
      flapStart = 0;
      if (!flapRaf) flapRaf = requestAnimationFrame(flap);
    }
    function stopFlap() {
      if (flapRaf) { cancelAnimationFrame(flapRaf); flapRaf = 0; }
      wingL.removeAttribute('transform');
      wingR.removeAttribute('transform');
    }

    const stage = host.querySelector('.pg-stage');

    function clear() {
      host.classList.remove('ph-envDraw', 'ph-wingsDraw', 'ph-fly', 'ph-done');
      stopFlap();
      // Force-reset the stage transform — CSS animation with forwards fill
      // mode may otherwise leak the final-frame transform into the next cycle.
      if (stage) {
        stage.style.animation = 'none';
        stage.style.transform = 'translate(0, 0) rotate(0deg)';
        // reflow so the style reset is committed before we re-enable animation
        void stage.offsetWidth;
        stage.style.animation = '';
        stage.style.transform = '';
      }
    }

    function cycle() {
      if (!running) return;
      clear();
      // Phase 1: envelope draws (1.2s)
      host.classList.add('ph-envDraw');
      timer = window.setTimeout(() => {
        // Phase 2: wings sprout + start flapping (0.9s)
        host.classList.add('ph-wingsDraw');
        startFlap(false);
        timer = window.setTimeout(() => {
          // Phase 3: fly away along arc toward email (2.4s)
          host.classList.add('ph-fly');
          startFlap(true);  // faster flap
          timer = window.setTimeout(() => {
            // Phase 4: fade out (0.5s)
            host.classList.add('ph-done');
            timer = window.setTimeout(() => {
              if (running) cycle();
            }, 1800);    // pause before re-draw
          }, 2400);      // flight duration
        }, 900);         // wings draw
      }, 1200);          // envelope draw
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!running) {
              running = true;
              cycle();
            }
          } else {
            running = false;
            if (timer) { clearTimeout(timer); timer = null; }
            clear();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(s6);
  }

  /* ========== SMOOTH SCROLL: intercept wheel, lerp scrollTop ==========
     The v20 dossier build's wheel handling feels steppy — wheel ticks
     jump the scroll position in discrete chunks. We override this by
     capturing wheel events before they reach the dossier handler and
     driving scrollTop ourselves via a rAF lerp loop. Dossier still
     listens to the native `scroll` event, so __dossier.index stays
     in sync as scrollTop animates. */
  function installSmoothScroll() {
    const sc = document.querySelector('.dossier-scroll');
    if (!sc || sc.dataset.formaSmooth) return;
    sc.dataset.formaSmooth = '1';

    let targetY = sc.scrollTop;
    let running = false;
    const LERP = 0.14;       // higher = snappier, lower = floatier
    const WHEEL_GAIN = 1.1;  // slight boost so one notch travels comfortably

    function animate() {
      const cur = sc.scrollTop;
      const diff = targetY - cur;
      if (Math.abs(diff) < 0.4) {
        sc.scrollTop = targetY;
        running = false;
        return;
      }
      sc.scrollTop = cur + diff * LERP;
      requestAnimationFrame(animate);
    }

    // The v20 dossier build catches wheel on window/document before they
    // reach .dossier-scroll. Attach at window level in capture phase so we
    // run before dossier's handler (if it uses capture) or at the same
    // level — then preventDefault + stopImmediatePropagation take over.
    window.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        // Sync target to current scroll before first delta of a new stream
        if (!running) targetY = sc.scrollTop;
        e.preventDefault();
        e.stopImmediatePropagation();
        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 16;
        else if (e.deltaMode === 2) dy *= sc.clientHeight;
        dy *= WHEEL_GAIN;
        const max = sc.scrollHeight - sc.clientHeight;
        targetY = Math.max(0, Math.min(max, targetY + dy));
        if (!running) {
          running = true;
          requestAnimationFrame(animate);
        }
      },
      { capture: true, passive: false }
    );

    // Sync target when another source moves the scroll (keyboard, jumpTo, etc.)
    sc.addEventListener('scroll', () => {
      if (!running) targetY = sc.scrollTop;
    });

    // Keyboard paging: PageUp/Down, Home/End, arrows
    window.addEventListener('keydown', (e) => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      const vh = sc.clientHeight;
      let delta = 0;
      if (e.key === 'PageDown' || e.key === ' ') delta = vh * 0.9;
      else if (e.key === 'PageUp') delta = -vh * 0.9;
      else if (e.key === 'ArrowDown') delta = 80;
      else if (e.key === 'ArrowUp') delta = -80;
      else if (e.key === 'Home') { targetY = 0; }
      else if (e.key === 'End') { targetY = sc.scrollHeight - vh; }
      else return;
      e.preventDefault();
      if (delta) {
        const max = sc.scrollHeight - vh;
        targetY = Math.max(0, Math.min(max, targetY + delta));
      }
      if (!running) { running = true; requestAnimationFrame(animate); }
    });
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
        'top:12vh;left:10vw;right:24vw;height:38vh;opacity:0.42;position:absolute;pointer-events:none'
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

    // ----- SPREAD 0: body-level lock halo -----
    installSpread0Halo();

    // ----- SMOOTH SPREAD COMMIT/SNAPBACK -----
    installTransitionSmoothing();

    // ----- Halo visibility: on only while Spread0 active + not unlocked -----
    const halo = document.querySelector('.forma-lock-halo');
    const scroll = document.querySelector('.dossier-scroll');
    const updateHalo = () => {
      if (!halo) return;
      const locked = scroll && scroll.getAttribute('data-unlocked') === 'false';
      halo.classList.toggle('visible', !!locked);
    };
    updateHalo();
    setInterval(updateHalo, 200);

    // ----- SPREAD 3: project house elevations -----
    const spread3Svgs = installSpread3();

    // ----- SPREAD 4: uniform phase frames + rotator -----
    installPhaseFrames();
    installSpread4Rotator();

    // ----- SPREAD 6: pigeon carrying a letter toward the email -----
    installSpread6Pigeon();

    // ----- SMOOTH SCROLL overlay -----
    installSmoothScroll();

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
      spread3Svgs.forEach((svg) => {
        const was = svg.classList.contains('drawing');
        svg.classList.toggle('drawing', on3);
        if (on3 && !was) {
          window.setTimeout(() => {
            if (svg.classList.contains('drawing')) svg.classList.add('drawn');
          }, 2000);
        }
        if (!on3) svg.classList.remove('drawn');
      });
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
