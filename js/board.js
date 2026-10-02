// board.js — a small SVG/CSS chess board with animation, arrows, zones and input.
// No dependencies: positions come in as FEN, moves as chess.js verbose move objects.

const FILES = 'abcdefgh';
const SVG_NS = 'http://www.w3.org/2000/svg';
const PIECE_PATH = 'assets/pieces/';

const sqToXY = (sq) => ({ x: FILES.indexOf(sq[0]), y: 8 - Number(sq[1]) });
const xyToSq = (x, y) => FILES[x] + (8 - y);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function parseFen(fen) {
  const map = {};
  const rows = fen.split(' ')[0].split('/');
  rows.forEach((row, y) => {
    let x = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { x += Number(ch); continue; }
      const color = ch === ch.toUpperCase() ? 'w' : 'b';
      map[xyToSq(x, y)] = color + ch.toUpperCase();
      x++;
    }
  });
  return map;
}

export class Board {
  constructor(root) {
    this.root = root;
    this.pieces = {};          // square -> element
    this.interactive = null;   // { legalMoves(sq) -> [{to, captured}], onMove(from, to) }
    this.selected = null;
    this.drag = null;
    this.build();
  }

  build() {
    this.root.innerHTML = '';
    this.squaresEl = document.createElement('div');
    this.squaresEl.className = 'squares';
    this.sqEls = {};
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const sq = xyToSq(x, y);
        const d = document.createElement('div');
        d.className = 'sq ' + ((x + y) % 2 === 0 ? 'light' : 'dark');
        d.dataset.square = sq;
        if (x === 0) d.insertAdjacentHTML('beforeend', `<span class="coord rank">${8 - y}</span>`);
        if (y === 7) d.insertAdjacentHTML('beforeend', `<span class="coord file">${FILES[x]}</span>`);
        this.squaresEl.appendChild(d);
        this.sqEls[sq] = d;
      }
    }
    this.piecesEl = document.createElement('div');
    this.piecesEl.className = 'pieces';

    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.setAttribute('class', 'overlay');
    this.svg.setAttribute('viewBox', '0 0 8 8');
    this.svg.innerHTML = `
      <defs>
        ${['primary', 'danger', 'warning', 'muted'].map((c) => `
          <marker id="head-${c}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--arrow-${c})"/>
          </marker>`).join('')}
      </defs>
      <g class="arrows"></g>`;
    this.arrowsG = this.svg.querySelector('.arrows');

    // zones sit under the pieces, arrows above them
    this.zoneSvg = document.createElementNS(SVG_NS, 'svg');
    this.zoneSvg.setAttribute('class', 'overlay zones-layer');
    this.zoneSvg.setAttribute('viewBox', '0 0 8 8');
    this.zonesG = document.createElementNS(SVG_NS, 'g');
    this.zoneSvg.appendChild(this.zonesG);

    this.root.append(this.squaresEl, this.zoneSvg, this.piecesEl, this.svg);
    this.bindInput();
  }

  // ---------- Pieces ----------
  placeEl(el, sq) {
    const { x, y } = sqToXY(sq);
    el.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
  }

  makePiece(code, sq) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.dataset.piece = code;
    el.innerHTML = `<img src="${PIECE_PATH}${code}.svg" alt="" draggable="false">`;
    this.placeEl(el, sq);
    this.piecesEl.appendChild(el);
    this.pieces[sq] = el;
    return el;
  }

  /** Reconcile the board with a FEN, without animation. */
  setPosition(fen) {
    const want = parseFen(fen);
    for (const [sq, el] of Object.entries(this.pieces)) {
      if (want[sq] !== el.dataset.piece) { el.remove(); delete this.pieces[sq]; }
    }
    for (const [sq, code] of Object.entries(want)) {
      if (!this.pieces[sq]) this.makePiece(code, sq);
      else this.placeEl(this.pieces[sq], sq);
    }
  }

  /** Animate a chess.js verbose move, then reconcile to the resulting FEN. */
  async animateMove(move, fenAfter, { instant = false } = {}) {
    const el = this.pieces[move.from];
    const victimSq = move.flags?.includes('e') ? move.to[0] + move.from[1] : move.to;
    const victim = this.pieces[victimSq];
    if (victim && victim !== el) {
      victim.classList.add('fading');
      delete this.pieces[victimSq];
      setTimeout(() => victim.remove(), 260);
    }
    if (el) {
      delete this.pieces[move.from];
      this.pieces[move.to] = el;
      if (instant) el.style.transition = 'none';
      this.placeEl(el, move.to);
      if (instant) { el.offsetWidth; el.style.transition = ''; }
    }
    // castling: move the rook too
    if (move.flags?.includes('k') || move.flags?.includes('q')) {
      const rank = move.from[1];
      const [rf, rt] = move.flags.includes('k') ? ['h', 'f'] : ['a', 'd'];
      const rook = this.pieces[rf + rank];
      if (rook) { delete this.pieces[rf + rank]; this.pieces[rt + rank] = rook; this.placeEl(rook, rt + rank); }
    }
    this.setLastMove(move.from, move.to);
    if (!instant) await wait(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--move-ms')) || 0);
    this.setPosition(fenAfter);
  }

  // ---------- Decorations ----------
  clearClass(cls) { for (const el of Object.values(this.sqEls)) el.classList.remove(cls); }

  setLastMove(from, to) {
    this.clearClass('last');
    if (from) this.sqEls[from].classList.add('last');
    if (to) this.sqEls[to].classList.add('last');
  }

  setHighlights(squares = []) {
    this.clearClass('hl');
    squares.forEach((s) => this.sqEls[s]?.classList.add('hl'));
  }

  setHints(squares = []) {
    this.clearClass('hint');
    squares.forEach((s) => this.sqEls[s]?.classList.add('hint'));
  }

  flashWrong(sq) {
    const el = this.sqEls[sq];
    if (!el) return;
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 700);
  }

  setZone(zone) {
    this.zonesG.innerHTML = '';
    if (!zone) return;
    for (const sq of zone.squares) {
      const { x, y } = sqToXY(sq);
      const r = document.createElementNS(SVG_NS, 'rect');
      Object.entries({ x, y, width: 1, height: 1, class: 'zone', fill: `var(--zone-${zone.color || 'danger'})` })
        .forEach(([k, v]) => r.setAttribute(k, v));
      this.zonesG.appendChild(r);
    }
  }

  setArrows(arrows = []) {
    this.arrowsG.innerHTML = '';
    for (const a of arrows) {
      const f = sqToXY(a.from), t = sqToXY(a.to);
      const x1 = f.x + 0.5, y1 = f.y + 0.5, x2 = t.x + 0.5, y2 = t.y + 0.5;
      const len = Math.hypot(x2 - x1, y2 - y1);
      const shorten = 0.32; // stop before centre so the head stays on the square
      const ex = x2 - ((x2 - x1) / len) * shorten, ey = y2 - ((y2 - y1) / len) * shorten;
      const color = a.color || 'primary';
      const line = document.createElementNS(SVG_NS, 'line');
      Object.entries({
        x1, y1, x2: ex, y2: ey, class: 'arrow',
        stroke: `var(--arrow-${color})`, 'stroke-width': 0.16, 'stroke-linecap': 'round',
        'marker-end': `url(#head-${color})`,
      }).forEach(([k, v]) => line.setAttribute(k, v));
      this.arrowsG.appendChild(line);
    }
  }

  clearDecorations() {
    this.setArrows([]); this.setZone(null); this.setHighlights([]); this.setHints([]);
    this.clearSelection();
  }

  // ---------- Input ----------
  enableInput(handlers) { this.interactive = handlers; this.root.classList.add('interactive'); }
  disableInput() { this.interactive = null; this.root.classList.remove('interactive'); this.clearSelection(); }

  clearSelection() {
    this.selected = null;
    this.clearClass('selected'); this.clearClass('target'); this.clearClass('capture');
  }

  select(sq) {
    this.clearSelection();
    const targets = this.interactive.legalMoves(sq);
    if (!targets.length) return false;
    this.selected = { sq, targets };
    this.sqEls[sq].classList.add('selected');
    targets.forEach((m) => {
      this.sqEls[m.to].classList.add('target');
      if (m.captured) this.sqEls[m.to].classList.add('capture');
    });
    return true;
  }

  squareAt(evt) {
    const r = this.root.getBoundingClientRect();
    const x = Math.floor(((evt.clientX - r.left) / r.width) * 8);
    const y = Math.floor(((evt.clientY - r.top) / r.height) * 8);
    if (x < 0 || x > 7 || y < 0 || y > 7) return null;
    return xyToSq(x, y);
  }

  bindInput() {
    this.root.addEventListener('pointerdown', (e) => {
      if (!this.interactive) return;
      const sq = this.squareAt(e);
      if (!sq) return;
      if (this.selected && this.selected.targets.some((m) => m.to === sq)) {
        const from = this.selected.sq;
        this.clearSelection();
        this.interactive.onMove(from, sq, false);
        return;
      }
      if (this.pieces[sq] && this.select(sq)) {
        const el = this.pieces[sq];
        const r = this.root.getBoundingClientRect();
        this.drag = { sq, el, r, moved: false, sx: e.clientX, sy: e.clientY };
        this.root.setPointerCapture(e.pointerId);
      } else {
        this.clearSelection();
      }
    });

    this.root.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 4) return;
      d.moved = true;
      d.el.classList.add('dragging');
      const size = d.r.width / 8;
      const px = e.clientX - d.r.left - size / 2, py = e.clientY - d.r.top - size / 2;
      d.el.style.transform = `translate(${(px / size) * 100}%, ${(py / size) * 100}%)`;
    });

    const end = (e) => {
      const d = this.drag;
      if (!d) return;
      this.drag = null;
      d.el.classList.remove('dragging');
      if (!d.moved) return; // plain click: keep selection for click-to-move
      const sq = this.squareAt(e);
      if (sq && sq !== d.sq && this.selected?.targets.some((m) => m.to === sq)) {
        this.clearSelection();
        this.interactive?.onMove(d.sq, sq, true);
      } else {
        this.placeEl(d.el, d.sq);
      }
    };
    this.root.addEventListener('pointerup', end);
    this.root.addEventListener('pointercancel', end);
  }
}
