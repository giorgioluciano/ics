// check-lessons.mjs — validate every lesson and list exercise alternatives.
//   node tools/check-lessons.mjs
import { Chess } from '../js/vendor/chess.js';
import { readFileSync, readdirSync } from 'node:fs';
const dir = new URL('../lessons/', import.meta.url).pathname;
const bare = (s) => s.replace(/[+#]$/, '');
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  const L = JSON.parse(readFileSync(dir + f));
  const g = new Chess(L.startFen, { skipValidation: true });
  console.log(`\n== ${f}`);
  let g2;
  for (const st of L.steps) {
    if (st.fen) g.load(st.fen);
    for (const seg of st.narration) for (const m of seg.move ? [seg.move] : seg.moves || []) g.move(m);
    const ex = st.exercise;
    if (!ex) continue;
    const legal = g.moves();
    for (const a of ex.accept) if (!legal.map(bare).includes(bare(a))) console.log('  !! accept not legal', a);
    for (const k of Object.keys(ex.feedback || {})) if (k !== '*' && !legal.map(bare).includes(bare(k))) console.log('  !! feedback not legal', k, 'in', st.id);
    const notes = legal.map((m) => { const h = new Chess(g.fen()); h.move(m); return m + (h.isStalemate() ? '(STALEMATE)' : h.isCheckmate() ? '(MATE)' : ''); });
    console.log(`  ${st.id}: accept ${ex.accept.join(',')} | ${notes.filter((n) => n.includes('(')).join(' ') || '-'} | legal: ${legal.length}`);
    g.move(ex.accept[0]); if (ex.reply) g.move(ex.reply);
  }
}
