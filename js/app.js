// app.js — lesson player: syncs narration, board animation and exercises.
import { prefs } from './prefs.js';
import { Chess } from './vendor/chess.js';
import { Board } from './board.js';
import { Narrator } from './speech.js';
import { loadLesson } from './lesson-loader.js';

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fast = () => state.mode !== 'voice';
const bareSan = (san) => san.replace(/[+#]$/, '');

const board = new Board($('board'));
const narrator = new Narrator({ lang: 'en' });

const state = {
  book: null,
  order: [],         // lesson ids in book order
  cache: new Map(),  // id -> lesson
  lesson: null,
  lessonId: null,
  index: 0,
  token: 0,          // bumps on every interruption so stale async work stops
  playing: false,
  game: null,        // chess.js instance for the live position
  history: [],       // SAN moves played so far (whole lesson)
  solved: false,
  hintLevel: 0,
};

// ---------------------------------------------------------------- setup
init().catch(showError);

function showError(err) {
  console.error(err);
  $('tocView').hidden = true;
  $('lessonView').hidden = false;
  $('stepTitle').textContent = 'Could not load the lesson';
  $('narration').textContent = location.protocol === 'file:'
    ? 'Open this page through a local web server (for example: python -m http.server 8000) instead of double-clicking the file.'
    : String(err.message || err);
}

async function init() {
  const res = await fetch('book.json');
  if (!res.ok) throw new Error('Cannot load book.json');
  state.book = await res.json();
  state.order = state.book.chapters.flatMap((c) => c.sections.flatMap((s) => s.lessons));
  renderToc();
  setupSettings();
  setupControls();
  $('progress').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (b) goTo(Number(b.dataset.i), { autoplay: true });
  });
  // legacy links: ?lesson=lessons/001-rook-mate.json
  const legacy = new URLSearchParams(location.search).get('lesson');
  if (legacy && !location.hash) location.hash = '#/lesson/' + legacy.replace(/^.*\//, '').replace(/\.json$/, '');
  window.addEventListener('hashchange', () => route().catch(showError));
  await route();
}

async function route() {
  const m = location.hash.match(/^#\/lesson\/([\w-]+)/);
  if (m && state.order.includes(m[1])) return showLesson(m[1]);
  showToc();
}

function showToc() {
  interrupt();
  state.lessonId = null;
  document.body.classList.add('on-toc');
  $('tocView').hidden = false;
  $('lessonView').hidden = true;
  $('lessonSubtitle').textContent = `${state.book.author} · ${state.book.title}`;
  document.title = `${state.book.title} — Interactive Chess Book`;
  window.scrollTo(0, 0);
}

function renderToc() {
  const { book } = state;
  $('tocBody').innerHTML = book.chapters.map((c) => `
    <section class="chapter">
      <div>
        <p class="chapter-label">${escapeHtml(c.label)}</p>
        <h2 class="chapter-title">${escapeHtml(c.title)}</h2>
      </div>
      <ol class="sections">
        ${c.sections.map((s) => `
          <li class="section-row${s.lessons.length ? '' : ' soon'}">
            <span class="section-num">${escapeHtml(s.number)}</span>
            <span class="section-title">${escapeHtml(s.title)}</span>
            ${s.lessons.length ? `<div class="lesson-links">${s.lessons.map((id) => {
              const meta = book.lessons[id];
              const tag = meta.examples ? `Ex. ${meta.examples}` : `§${s.number}`;
              return `<a class="lesson-link" href="#/lesson/${id}"><span class="ex">${tag}</span>${escapeHtml(meta.title)}</a>`;
            }).join('')}</div>` : ''}
          </li>`).join('')}
      </ol>
    </section>`).join('');
}

async function getLesson(id) {
  if (!state.cache.has(id)) state.cache.set(id, await loadLesson(`lessons/${id}.json`, Chess));
  return state.cache.get(id);
}

async function showLesson(id) {
  interrupt();
  const lesson = await getLesson(id);
  state.lesson = lesson;
  state.lessonId = id;
  document.body.classList.remove('on-toc');
  $('tocView').hidden = true;
  $('lessonView').hidden = false;
  document.title = `${lesson.title} — Interactive Chess Book`;
  $('lessonSubtitle').textContent = `${lesson.title} · ${lesson.source.section.replace(/^Chapter I+V?, /, '')}`;
  $('progress').innerHTML = lesson.steps
    .map((s, i) => `<button type="button" data-i="${i}" aria-label="Step ${i + 1}: ${escapeHtml(s.title)}" title="${escapeHtml(s.title)}"></button>`)
    .join('');
  window.scrollTo(0, 0);
  goTo(0, { autoplay: false });
  $('playLabel').textContent = 'Play';
  $('playBtn').classList.add('pulse');
}

const BOARDS = [
  ['walnut', 'Walnut', '#eadbc0', '#b08a62'],
  ['blue', 'Blue', '#dee3e6', '#8ca2ad'],
  ['green', 'Green', '#ffffdd', '#86a666'],
  ['slate', 'Grey', '#d9d9d9', '#9a9a9a'],
  ['coral', 'Coral', '#f3e2d8', '#d08b73'],
  ['ice', 'Ice', '#e8f1f7', '#9fbbd1'],
];

function setupSettings() {
  const root = document.documentElement;
  const mode = $('modeSelect'), sel = $('voiceSelect'), rate = $('rate');

  // narration mode
  if (!narrator.available) mode.querySelector('[value="voice"]').disabled = true;
  mode.value = prefs.get('mode', narrator.enabled ? 'voice' : 'silent');
  if (mode.value === 'voice' && !narrator.available) mode.value = 'silent';
  state.mode = mode.value;
  const syncMode = () => {
    state.mode = mode.value;
    prefs.set('mode', mode.value);
    // without the voice, moves play faster: nobody should need to mute the sound to go quicker
    if (mode.value === 'voice') delete root.dataset.pace; else root.dataset.pace = 'fast';
    narrator.setEnabled(mode.value === 'voice');
    $('voiceField').hidden = mode.value !== 'voice';
    if (state.waiting) state.waiting();
  };
  mode.addEventListener('change', syncMode);
  syncMode();

  const fill = (voices) => {
    sel.innerHTML = voices.map((v) => `<option value="${escapeHtml(v.name)}">${escapeHtml(v.name.replace(/^Microsoft /, ''))} (${v.lang})</option>`).join('')
      || '<option>No voices found</option>';
    if (narrator.voice) sel.value = narrator.voice.name;
  };
  narrator.onVoicesChanged = fill;
  fill(narrator.voices);
  sel.addEventListener('change', () => { narrator.setVoice(sel.value); narrator.speak('This is how I sound.'); });

  rate.value = narrator.rate;
  $('rateOut').textContent = narrator.rate.toFixed(1);
  rate.addEventListener('input', () => {
    narrator.setRate(Number(rate.value));
    $('rateOut').textContent = Number(rate.value).toFixed(1);
  });

  // board colours
  const sw = $('boardSwatches');
  sw.innerHTML = BOARDS.map(([id, name, l, d]) => `
    <button type="button" class="swatch" role="radio" data-board="${id}" aria-label="${name}" title="${name}" aria-checked="${id === 'walnut'}">
      <span style="background:${l}"></span><span style="background:${d}"></span><span style="background:${d}"></span><span style="background:${l}"></span>
    </button>`).join('');
  const setBoard = (id) => {
    root.dataset.board = id;
    prefs.set('board', id);
    sw.querySelectorAll('.swatch').forEach((x) => x.setAttribute('aria-checked', String(x.dataset.board === id)));
  };
  sw.addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (b) setBoard(b.dataset.board); });
  setBoard(prefs.get('board', 'walnut'));

  // page theme
  const page = $('pageTheme');
  const setPage = (v) => {
    page.value = v;
    prefs.set('page', v);
    if (v === 'auto') delete root.dataset.theme; else root.dataset.theme = v;
  };
  page.addEventListener('change', () => setPage(page.value));
  setPage(prefs.get('page', 'auto'));

  const coords = $('coordsToggle');
  const setCoords = (on) => { coords.checked = on; prefs.set('coords', on); $('board').classList.toggle('no-coords', !on); };
  coords.addEventListener('change', () => setCoords(coords.checked));
  setCoords(prefs.get('coords', true));

  const auto = $('autoToggle');
  auto.checked = prefs.get('auto', false);
  auto.addEventListener('change', () => prefs.set('auto', auto.checked));

  // iOS/Safari only allow speech after a user gesture: prime the engine on the first tap
  const unlock = () => { narrator.unlock(); document.removeEventListener('pointerdown', unlock); };
  document.addEventListener('pointerdown', unlock);
}

function setupControls() {
  $('prevBtn').addEventListener('click', () => goTo(state.index - 1, { autoplay: true }));
  $('nextBtn').addEventListener('click', next);
  $('playBtn').addEventListener('click', togglePlay);
  $('hintBtn').addEventListener('click', showHint);
  $('solutionBtn').addEventListener('click', showSolution);

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea') || !state.lessonId) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(state.index - 1, { autoplay: true }); }
    else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    else if (e.key.toLowerCase() === 'h') showHint();
  });
}

// ---------------------------------------------------------------- navigation
function interrupt() {
  state.token++;
  if (state.waiting) state.waiting();
  narrator.cancel();
  setPlaying(false);
}

function goTo(i, { autoplay }) {
  const { steps } = state.lesson;
  if (i < 0 || i >= steps.length) return;
  interrupt();
  state.index = i;
  const step = steps[i];

  // position at the start of this step
  state.game = new Chess(step.startFen);
  state.base = baseIndex(i);
  state.history = steps.slice(state.base, i).flatMap((s) => s.allMoves);
  state.solved = false;
  state.hintLevel = 0;
  board.disableInput();
  board.clearDecorations();
  board.setLastMove(null, null);
  board.setPosition(step.startFen);
  const last = step.fen ? null : steps[i - 1]?.lastMove;
  if (last) board.setLastMove(last.from, last.to);
  renderMoves();

  // text
  $('stepCount').textContent = `Step ${i + 1} of ${steps.length}`;
  $('stepTitle').textContent = step.title;
  $('narration').className = 'narration';
  $('narration').innerHTML = step.narration.map((s, k) => `<span class="seg" data-k="${k}">${escapeHtml(s.say)}</span>`).join(' ');

  const src = $('source');
  src.hidden = !step.source;
  $('sourceQuote').textContent = step.source || '';
  $('sourceRef').innerHTML = `${escapeHtml(state.lesson.source.author)}, <cite>${escapeHtml(state.lesson.source.work)}</cite> (${state.lesson.source.year}), ${escapeHtml(state.lesson.source.section)}.`;

  const ex = $('exercise');
  ex.hidden = true;
  ex.classList.remove('solved');
  $('exerciseFeedback').textContent = '';
  $('exerciseFeedback').className = 'exercise-feedback';

  // progress
  [...$('progress').children].forEach((b, k) => {
    b.classList.toggle('current', k === i);
    b.classList.toggle('done', k < i);
    b.setAttribute('aria-current', k === i ? 'step' : 'false');
  });
  $('prevBtn').disabled = i === 0;
  updateNextButton();

  if (autoplay) playStep();
}

function nextLessonId() {
  const k = state.order.indexOf(state.lessonId);
  return state.order[k + 1] || null;
}

function next() {
  if (state.index < state.lesson.steps.length - 1) return goTo(state.index + 1, { autoplay: true });
  const id = nextLessonId();
  location.hash = id ? '#/lesson/' + id : '#/';
}

function updateNextButton() {
  const last = state.index === state.lesson.steps.length - 1;
  $('nextLabel').textContent = last ? (nextLessonId() ? 'Next lesson' : 'Contents') : 'Next';
  $('nextBtn').disabled = false;
}

function togglePlay() {
  $('playBtn').classList.remove('pulse');
  if (state.waiting) { state.waiting(); return; }
  if (state.playing) {
    interrupt();
    finishInstantly();
  } else {
    goTo(state.index, { autoplay: true });
  }
}

function setPlaying(on) {
  state.playing = on;
  $('playBtn').classList.toggle('playing', on);
  $('playLabel').textContent = on ? 'Stop' : 'Replay';
}

// ---------------------------------------------------------------- playback
async function playStep() {
  const token = ++state.token;
  const alive = () => token === state.token;
  const step = state.lesson.steps[state.index];
  setPlaying(true);
  $('playBtn').classList.remove('pulse');

  const segEls = [...$('narration').querySelectorAll('.seg')];
  for (let k = 0; k < step.narration.length; k++) {
    if (!alive()) return;
    const seg = step.narration[k];
    segEls.forEach((el, j) => { el.classList.toggle('active', j === k); el.classList.toggle('spoken', j < k); });
    const hasMoves = !!(seg.move || seg.moves?.length);
    board.setArrows(seg.arrows || []);
    if (hasMoves) { board.setZone(null); board.setHighlights([]); } else applyVisuals(seg);
    const speech = state.mode === 'manual' ? wait(400) : narrator.speak(seg.say);
    const moves = playMoves(seg, alive).then(() => { if (alive() && hasMoves) applyVisuals(seg); });
    await Promise.all([speech, moves]);
    if (!alive()) return;
    if (state.mode === 'manual' && k < step.narration.length - 1) {
      await waitForContinue();
      if (!alive()) return;
    } else await wait(fast() ? 100 : 250);
  }
  if (!alive()) return;
  segEls.forEach((el) => { el.classList.remove('active'); el.classList.add('spoken'); });
  setPlaying(false);

  if (step.exercise) startExercise(step);
  else maybeAutoAdvance(token);
}

function applyVisuals(seg) {
  board.setArrows(seg.arrows || []);
  board.setZone(seg.zone || null);
  board.setHighlights(seg.highlights || []);
}

async function playMoves(seg, alive) {
  const list = seg.move ? [seg.move] : seg.moves || [];
  for (let n = 0; n < list.length; n++) {
    if (!alive()) return;
    if (n > 0 || list.length > 1) await wait(fast() ? (n === 0 ? 60 : 280) : (n === 0 ? 150 : 650));
    if (!alive()) return;
    await playSan(list[n]);
  }
}

async function playSan(san, opts) {
  const move = state.game.move(san);
  state.history.push(move.san);
  renderMoves();
  await board.animateMove(move, state.game.fen(), opts);
  return move;
}

/** Jump to the end of the current step's narration (used by Stop). */
function finishInstantly() {
  const step = state.lesson.steps[state.index];
  state.game = new Chess(step.startFen);
  state.history = state.lesson.steps.slice(state.base, state.index).flatMap((s) => s.allMoves);
  let lastMove = null;
  for (const seg of step.narration) {
    for (const san of seg.move ? [seg.move] : seg.moves || []) {
      lastMove = state.game.move(san);
      state.history.push(lastMove.san);
    }
  }
  board.setPosition(state.game.fen());
  if (lastMove) board.setLastMove(lastMove.from, lastMove.to);
  const lastSeg = step.narration[step.narration.length - 1];
  applyVisuals(lastSeg);
  renderMoves();
  $('narration').classList.add('static');
  $('narration').querySelectorAll('.seg').forEach((el) => el.classList.remove('active'));
  if (step.exercise) startExercise(step);
}

function waitForContinue() {
  const btn = $('playBtn');
  $('playLabel').textContent = 'Continue';
  btn.classList.add('waiting');
  btn.classList.remove('playing');
  return new Promise((resolve) => {
    state.waiting = () => {
      state.waiting = null;
      btn.classList.remove('waiting');
      btn.classList.toggle('playing', state.playing);
      $('playLabel').textContent = state.playing ? 'Stop' : 'Replay';
      resolve();
    };
  });
}

async function maybeAutoAdvance(token) {
  if (!$('autoToggle').checked) { nudgeNext(); return; }
  await wait(fast() ? 450 : 900);
  if (token === state.token && state.index < state.lesson.steps.length - 1) goTo(state.index + 1, { autoplay: true });
}

function nudgeNext() {
  const btn = $('nextBtn');
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 2800);
}

// ---------------------------------------------------------------- exercises
function startExercise(step) {
  const ex = step.exercise;
  $('exercise').hidden = false;
  $('exercisePrompt').textContent = ex.prompt;
  $('hintBtn').disabled = false;
  $('solutionBtn').disabled = false;
  board.setArrows([]); board.setZone(null);

  board.enableInput({
    legalMoves: (sq) => {
      const p = state.game.get(sq);
      if (!p || p.color !== state.game.turn()) return [];
      return state.game.moves({ square: sq, verbose: true });
    },
    onMove: (from, to) => tryMove(step, from, to),
  });
}

async function tryMove(step, from, to) {
  const ex = step.exercise;
  const token = state.token;
  const move = state.game.move({ from, to, promotion: 'q' });
  if (!move) return;
  board.disableInput();
  await board.animateMove(move, state.game.fen());
  if (token !== state.token) return;

  const ok = ex.accept.map(bareSan).includes(bareSan(move.san));
  if (ok) {
    state.history.push(move.san);
    renderMoves();
    return solved(step, token);
  }

  // wrong: explain, then take the move back
  const fb = state.game.isStalemate()
    ? 'Stalemate! Black has no legal move but is not in check, so the game is a draw. Try again.'
    : ex.feedback?.[bareSan(move.san)] || ex.feedback?.['*'] || 'Not quite. Try again.';
  setFeedback(fb, 'bad');
  board.flashWrong(move.to);
  narrator.speak(fb);
  await wait(fast() ? 450 : 900);
  if (token !== state.token) return;
  state.game.undo();
  board.setPosition(state.game.fen());
  board.setLastMove(null, null);
  startExercise(step);
}

async function solved(step, token) {
  const ex = step.exercise;
  state.solved = true;
  $('exercise').classList.add('solved');
  $('hintBtn').disabled = true;
  $('solutionBtn').disabled = true;
  board.setHints([]);
  board.setHighlights([]);
  setFeedback(ex.success, 'ok');
  setPlaying(true);
  if (state.mode === 'manual') await wait(1200); else await narrator.speak(ex.success);
  if (token !== state.token) return;
  if (ex.reply) {
    await playSan(ex.reply);
    if (token !== state.token) return;
  }
  setPlaying(false);
  maybeAutoAdvance(token);
}

function showHint() {
  const step = state.lesson.steps[state.index];
  if (!step.exercise || state.solved || $('exercise').hidden) return;
  state.hintLevel++;
  setFeedback(step.exercise.hint, '');
  if (state.hintLevel >= 2) board.setHints(step.exercise.hintSquares || []);
  else {
    // first hint: point at the piece that should move
    const m = new Chess(state.game.fen()).move(step.exercise.accept[0]);
    board.setHints([m.from]);
  }
  narrator.speak(step.exercise.hint);
}

async function showSolution() {
  const step = state.lesson.steps[state.index];
  if (!step.exercise || state.solved) return;
  const token = state.token;
  board.disableInput();
  board.setHints([]);
  await playSan(step.exercise.accept[0]);
  if (token !== state.token) return;
  solved(step, token);
}

function setFeedback(text, kind) {
  const el = $('exerciseFeedback');
  el.textContent = text;
  el.className = 'exercise-feedback' + (kind ? ' ' + kind : '');
}

// ---------------------------------------------------------------- helpers
/** First step of the current "game": the last step at or before i that sets its own position. */
function baseIndex(i) {
  for (let k = i; k > 0; k--) if (state.lesson.steps[k].fen) return k;
  return 0;
}

function renderMoves() {
  const h = state.history;
  const [, turn, , , , full] = state.lesson.steps[state.base].startFen.split(' ');
  let num = Number(full) || 1;
  const items = [];
  let p = 0;
  const san = (k) => `<span class="san${k === h.length - 1 ? ' latest' : ''}">${h[k]}</span>`;
  if (turn === 'b' && h.length) { items.push(`<li><span class="num">${num}...</span>${san(0)}</li>`); p = 1; num++; }
  for (; p < h.length; p += 2, num++) {
    items.push(`<li><span class="num">${num}.</span>${san(p)}${h[p + 1] ? ' ' + san(p + 1) : ''}</li>`);
  }
  $('moves').innerHTML = items.join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
