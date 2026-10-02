// build-book.mjs — refresh the lesson index in book.json from the lesson files.
//   node tools/build-book.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const book = JSON.parse(readFileSync(root + 'book.json'));
book.lessons = {};
for (const c of book.chapters) for (const s of c.sections) for (const id of s.lessons) {
  const f = `${root}lessons/${id}.json`;
  if (!existsSync(f)) throw new Error(`book.json lists ${id} but ${f} is missing`);
  const L = JSON.parse(readFileSync(f));
  book.lessons[id] = { title: L.title, subtitle: L.subtitle || '', steps: L.steps.length, examples: L.source.examples || null };
}
writeFileSync(root + 'book.json', JSON.stringify(book, null, 2) + '\n');
console.log(`book.json: ${Object.keys(book.lessons).length} lessons`);
