// author.mjs — small helpers for writing lessons in JavaScript and emitting lesson JSON.
// Tracks the position while you write, so zones such as "the black king's box" can be
// computed instead of typed by hand, and every move is checked as you go.
import { Chess } from '../js/vendor/chess.js';
import { writeFileSync } from 'node:fs';

export const RANK = (n) => 'abcdefgh'.split('').map((f) => f + n);
export const FILE = (f) => [1, 2, 3, 4, 5, 6, 7, 8].map((n) => f + n);

export class Author {
  constructor(meta) {
    this.meta = meta;
    this.game = new Chess(meta.startFen);
    this.steps = [];
  }

  /** Squares the side-to-move's king can reach without crossing attacked squares. */
  box(color = this.game.turn()) {
    const g = new Chess(this.game.fen());
    const enemy = color === 'w' ? 'b' : 'w';
    const board = g.board().flat().filter(Boolean);
    const king = board.find((p) => p.type === 'k' && p.color === color).square;
    // remove the king so squares "behind" it along a line count as attacked
    g.remove(king);
    const seen = new Set([king]);
    const queue = [king];
    while (queue.length) {
      const s = queue.shift();
      const f = s.charCodeAt(0), r = Number(s[1]);
      for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
        const nf = f + df, nr = r + dr;
        if (nf < 97 || nf > 104 || nr < 1 || nr > 8) continue;
        const n = String.fromCharCode(nf) + nr;
        if (seen.has(n)) continue;
        const occ = g.get(n);
        if (occ && occ.color === color) continue;
        if (g.isAttacked(n, enemy)) continue;
        seen.add(n); queue.push(n);
      }
    }
    return [...seen];
  }

  /** Squares a piece attacks/moves to (ignores whose turn it is). */
  reach(square) {
    const p = this.game.get(square);
    const parts = this.game.fen().split(' ');
    parts[1] = p.color; parts[3] = '-';
    const g = new Chess(parts.join(' '), { skipValidation: true });
    return [...new Set(g.moves({ square, verbose: true }).map((m) => m.to))];
  }

  /** Play SAN moves on the tracking board (validates them). */
  play(...sans) {
    for (const s of sans.flatMap((x) => x.split(' ')).filter(Boolean)) {
      const m = this.game.move(s);
      if (!m) throw new Error(`Illegal ${s} at ${this.game.fen()}`);
    }
    return this;
  }

  /** Add a step. `segments` is an array of functions or objects; functions receive the author. */
  step(def) {
    if (def.fen) this.game = new Chess(def.fen);
    const narration = [];
    for (const seg of def.narration) {
      const s = typeof seg === 'function' ? seg(this) : seg;
      for (const san of s.move ? [s.move] : s.moves || []) this.play(san);
      if (typeof s.zone === 'function') s.zone = s.zone(this);
      narration.push(s);
    }
    const step = { id: def.id, title: def.title };
    if (def.fen) step.fen = def.fen;
    if (def.source) step.source = def.source;
    step.narration = narration;
    if (def.exercise) {
      step.exercise = def.exercise;
      this.play(def.exercise.accept[0]);
      if (def.exercise.reply) this.play(def.exercise.reply);
    }
    this.steps.push(step);
    return this;
  }

  save(path) {
    const out = { ...this.meta, steps: this.steps };
    writeFileSync(path, JSON.stringify(out, null, 2) + '\n');
    console.log(`wrote ${path}: ${this.steps.length} steps, final ${this.game.fen()}`);
  }
}
