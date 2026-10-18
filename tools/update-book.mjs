import { readFileSync, readdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const bookPath = process.argv[2];
if (!bookPath) throw new Error('Usage: node tools/update-book.mjs path/to/book.json');
const dir = join(process.cwd(), 'lessons');
const book = JSON.parse(readFileSync(bookPath, 'utf8').replace(/^\uFEFF/, ''));
const lessons = new Map();
for (const file of readdirSync(dir).filter(f => f.endsWith('.json'))) {
  const lesson = JSON.parse(readFileSync(join(dir, file), 'utf8').replace(/^\uFEFF/, ''));
  if (file !== lesson.id + '.json') throw new Error('ID/file mismatch: ' + file);
  if (lessons.has(lesson.id)) throw new Error('Duplicate ID: ' + lesson.id);
  lessons.set(lesson.id, lesson);
}
const groups = {
  '20': [44],
  '21': [50, 51],
  '22': [52],
  '23': [53],
  '24': [54],
  '25': [55],
  '26': [56, 57],
  '27': [58],
  '28': [59],
  '29': [60, 61],
  '30': [62],
  '31': [63, 64],
  '32': [65, 66],
  '33': [67],
};
for (let i=1;i<=14;i++) groups['G'+i]=[67+i];
const idFor = n => {
 const hits=[...lessons.keys()].filter(id=>id.startsWith(String(n).padStart(3,'0')+'-'));
 if(hits.length!==1) throw new Error('Expected one lesson for number '+n+', found '+hits.length);
 return hits[0];
};
const referenced = new Set();
for (const chapter of book.chapters) for (const section of chapter.sections) {
 if(groups[section.number]) section.lessons=groups[section.number].map(idFor);
 for(const id of section.lessons || []) {
  if(!lessons.has(id)) throw new Error('Index references missing lesson: '+id);
  referenced.add(id);
 }
}
book.lessons = Object.fromEntries([...referenced].map(id=>{
 const lesson=lessons.get(id);
 return [id,{title:lesson.title,subtitle:lesson.subtitle || '',steps:lesson.steps.length,examples:lesson.source?.examples ?? null}];
}));
const unindexed=[...lessons.keys()].filter(id=>!referenced.has(id));
if(unindexed.length) throw new Error('Unindexed lessons (no changes saved): '+unindexed.join(', '));
const backup=bookPath+'.before-052-081.bak';
if(!existsSync(backup)) copyFileSync(bookPath,backup);
writeFileSync(bookPath,JSON.stringify(book,null,2)+'\n','utf8');
console.log('Updated '+bookPath+'; indexed lessons: '+referenced.size);
for(const chapter of book.chapters) for(const section of chapter.sections) {
 if(!section.lessons?.length) console.log('EMPTY: '+chapter.label+' / '+section.number+' / '+section.title);
}
