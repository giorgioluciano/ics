// lesson-loader.js — loads a lesson JSON and precomputes the position at every step.
// Each step starts where the previous one ended, so moves only need to be written once.
// Every move is validated with chess.js: a typo in a lesson fails loudly here.

export async function loadLesson(url, Chess) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cannot load ${url} (${res.status})`);
  const lesson = await res.json();

  let game = new Chess(lesson.startFen);
  let lastMove = null;
  for (const step of lesson.steps) {
    if (step.fen) { game = new Chess(step.fen); lastMove = null; }
    step.startFen = game.fen();
    step.allMoves = [];
    const play = (san, where) => {
      let m;
      try { m = game.move(san); } catch { m = null; }
      if (!m) throw new Error(`Illegal move "${san}" in step "${step.id}" (${where}) at ${game.fen()}`);
      step.allMoves.push(m.san);
      lastMove = m;
    };
    for (const seg of step.narration) {
      for (const san of seg.move ? [seg.move] : seg.moves || []) play(san, 'narration');
    }
    if (step.exercise) {
      play(step.exercise.accept[0], 'exercise');
      if (step.exercise.reply) play(step.exercise.reply, 'reply');
    }
    step.endFen = game.fen();
    step.lastMove = lastMove;
  }
  return lesson;
}
