// descriptive.mjs — convert old English descriptive notation (as in Capablanca's
// Chess Fundamentals) into SAN, resolving ambiguity with the legal moves of the position.
//
//   node tools/descriptive.mjs "<FEN>" "1 R - R 7, K - Kt 1; 2 K - Kt 2 ..."
//
// Prints the SAN line, or reports the first move that cannot be resolved uniquely.
import { Chess } from '../js/vendor/chess.js';

const FILES = { QR: 'a', QKt: 'b', QN: 'b', QB: 'c', Q: 'd', K: 'e', KB: 'f', KKt: 'g', KN: 'g', KR: 'h' };
const SHORT = { R: ['a', 'h'], Kt: ['b', 'g'], N: ['b', 'g'], B: ['c', 'f'], Q: ['d'], K: ['e'] };
const PIECE = { K: 'k', Q: 'q', R: 'r', B: 'b', Kt: 'n', N: 'n', P: 'p' };

/** Descriptive square ("K Kt 5", "R 7", "Q 4") -> list of candidate algebraic squares. */
export function squares(desc, color) {
  const m = desc.replace(/\s+/g, ' ').trim().match(/^(Q|K)?\s?(R|Kt|N|B|Q|K)\s?(\d)$/);
  if (!m) return null;
  const [, side, piece, n] = m;
  const rank = color === 'w' ? Number(n) : 9 - Number(n);
  const files = side ? [FILES[side + piece]] : SHORT[piece];
  return files.map((f) => f + rank);
}

/** Descriptive file of a pawn ("KP", "QBP", "BP", "P") -> candidate files, or null = any. */
function pawnFiles(tag) {
  const t = tag.replace(/\s|P$/g, '');
  if (!t) return null;
  if (FILES[t]) return [FILES[t]];
  if (SHORT[t]) return SHORT[t];
  return null;
}

/** Parse a piece token like "Kt", "QKt", "KR", "P", "KBP" -> {type, files|null}. */
function pieceToken(tok) {
  tok = tok.replace(/\s+/g, '');
  if (/P$/.test(tok)) return { type: 'p', files: pawnFiles(tok) };
  const m = tok.match(/^(Q|K)?(R|Kt|N|B|Q|K)$/);
  if (!m) return null;
  if (!m[1]) return { type: PIECE[m[2]], files: null };
  if (m[2] === 'Q' || m[2] === 'K') return { type: PIECE[m[2]], files: null }; // "QK" never used
  return { type: PIECE[m[2]], files: [FILES[m[1] + m[2]]] }; // e.g. QKt = knight that started on b-file (approximate: filter by current file is wrong), handled below
}

export function resolve(game, text) {
  const color = game.turn();
  const moves = game.moves({ verbose: true });
  let t = text.trim().replace(/\s*(ch|mate|dis\.? ch|\(?!+\)?|\(?\?+\)?)\s*$/i, '').replace(/[!?]+$/, '').trim();

  if (/^castles?/i.test(t) || /^O-O/.test(t)) {
    const q = /Q|O-O-O/.test(t.replace(/^castles/i, ''));
    return moves.filter((m) => m.flags.includes(q ? 'q' : 'k'));
  }

  let promo = null;
  const pm = t.match(/\(?\s*(?:=|queens?|becomes?)\s*(Q|R|B|Kt|N)?\)?\s*$/i);
  const pq = t.match(/\s*(=\s*)?\(?(Q|R|B|Kt|N)\)?$/);
  if (pm) { promo = PIECE[pm[1] || 'Q']; t = t.slice(0, pm.index).trim(); }

  // capture: "P x P", "Kt x B", "Q x Kt ch", "P x P e.p."
  let m = t.match(/^([QK]?\s?(?:R|Kt|N|B|Q|K)?\s?P?|[QK]?\s?(?:R|Kt|N|B|Q|K))\s*x\s*([QK]?\s?(?:R|Kt|N|B|Q|K)?\s?P?|[QK]?\s?(?:R|Kt|N|B|Q|K))(?:\s*\(?(\w+\s?\w*\s?\d)\)?)?(\s*e\.?\s?p\.?)?$/i);
  if (m) {
    const who = pieceToken(m[1]);
    const what = pieceToken(m[2]);
    return moves.filter((mv) =>
      mv.captured && who && what && mv.piece === who.type && mv.captured === what.type &&
      (!who.files || who.type !== 'p' || who.files.includes(mv.from[0])) &&
      (!what.files || what.type !== 'p' || what.files.includes(mv.to[0])) &&
      (!promo || mv.promotion === promo));
  }

  // quiet move: "Kt - K B 3", "P - K 4", "QR - Q 1", "R (R 1) - Q 1"
  m = t.match(/^(.+?)\s*-\s*(.+)$/);
  if (m) {
    const who = pieceToken(m[1].replace(/\(.*\)/, ''));
    let dest = m[2];
    const pr = dest.match(/^(.*\d)\s*\(?=?\s*(Q|R|B|Kt|N)\)?$/);
    if (pr) { dest = pr[1]; promo = PIECE[pr[2]]; }
    const to = squares(dest, color);
    if (!who || !to) return [];
    return moves.filter((mv) => mv.piece === who.type && to.includes(mv.to) && !mv.captured &&
      (!who.files || who.type !== 'p' || who.files.includes(mv.from[0])) &&
      (!mv.promotion || mv.promotion === (promo || 'q')));
  }
  return [];
}

/** Split "1 R - R 7, K - Kt 1; 2 K - Kt 2. 2...K - B 1" into move texts. */
export function tokenize(line) {
  return line
    .replace(/\{\d+\}/g, ' ')
    .replace(/\d+\s*\.\.\.\s*/g, ';')
    .split(/[;,]/)
    .map((s) => s.replace(/^\s*\d+\s+/, '').replace(/\.$/, '').trim())
    .filter(Boolean);
}

export function convert(fen, line) {
  const game = new Chess(fen);
  const out = [];
  for (const tok of tokenize(line)) {
    let cands = resolve(game, tok);
    const wantCheck = /\bch\b/i.test(tok), wantMate = /\bmate\b/i.test(tok);
    if (cands.length > 1 && (wantCheck || wantMate)) cands = cands.filter((c) => (wantMate ? c.san.includes('#') : /[+#]/.test(c.san)));
    if (cands.length > 1 && !wantCheck && !wantMate) {
      const quiet = cands.filter((c) => !/[+#]/.test(c.san));
      if (quiet.length === 1) cands = quiet;
    }
    if (cands.length !== 1) {
      return { ok: false, san: out, error: `"${tok}" -> ${cands.length ? cands.map((c) => c.san).join(' / ') : 'no legal match'}`, fen: game.fen() };
    }
    out.push(game.move(cands[0]).san);
  }
  return { ok: true, san: out, fen: game.fen() };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [fen, line] = process.argv.slice(2);
  const r = convert(fen, line);
  console.log(r.ok ? 'OK ' : 'FAIL ', r.san.join(' '), r.ok ? '' : '\n  ' + r.error + '\n  at ' + r.fen);
  if (r.ok) console.log('  final', r.fen);
}
