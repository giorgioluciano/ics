# Interactive Chess Book

Classic chess books, rebuilt as interactive lessons: the board moves while a voice reads the text,
arrows and coloured squares show the ideas, and you play the key moves yourself.

The book being rebuilt is **José Raúl Capablanca's _Chess Fundamentals_ (1921)**.
Done so far: Chapter I, §1 Some Simple Mates (Examples 1–4) and §2 Pawn Promotion (Examples 5–6).
Open the app to see the full table of contents; unfinished sections are marked "coming soon".

## Run it locally

ES modules and `fetch()` need a web server (double-clicking `index.html` will not work):

```bash
cd interactive-chess-book
python -m http.server 8000
```

Open <http://localhost:8000> in Chrome (the Google voices sound best).

## Project structure

```
index.html
css/style.css
js/app.js             lesson player: narration ↔ board ↔ exercises
js/board.js           board rendering, animation, arrows, zones, click & drag input
js/speech.js          narrator on top of the Web Speech API (speechSynthesis)
js/lesson-loader.js   loads a lesson JSON and validates every move with chess.js
js/vendor/chess.js    chess.js 1.4.0 (BSD-2-Clause)
book.json             table of contents: chapters → sections → lesson ids
lessons/*.json        the content — one file per lesson
tools/                authoring tools (Node.js, see below)
assets/pieces/        cburnett SVG pieces
```

## Writing a lesson

A lesson is a JSON file with a `startFen` and a list of `steps`. Each step starts where the previous one
ended, so moves are written only once. Every step has a `narration`: a list of short segments, each spoken
aloud while its visuals are shown.

```json
{
  "id": "rook-barrier",
  "title": "Build a wall with the rook",
  "source": "Original text from the book, shown under “Capablanca's original words”.",
  "narration": [
    { "say": "Watch the rook. It slides up to a7.", "move": "Ra7",
      "arrows": [{ "from": "a1", "to": "a7", "color": "primary" }] },
    { "say": "The seventh rank is now a wall.",
      "zone": { "squares": ["a7","b7","c7","d7","e7","f7","g7","h7"], "color": "danger" } },
    { "say": "King to f3, Black to e8.", "moves": ["Kf3", "Ke8"], "highlights": ["f3", "e8"] }
  ],
  "exercise": {
    "prompt": "Your move: bring the king closer.",
    "accept": ["Kg2"],
    "feedback": { "Kc6": "Specific explanation for a tempting wrong move", "*": "Generic retry text" },
    "hint": "Text hint", "hintSquares": ["g2"],
    "success": "Spoken when solved", "reply": "Kf8"
  }
}
```

Segment fields: `say` (required), `move` / `moves` (SAN), `arrows`, `highlights`, `zone`.
Colours: `primary`, `danger`, `warning`, `muted`. Load another lesson with `?lesson=lessons/002-....json`.

Illegal moves are reported in the browser console with the step id and position.

## Authoring workflow

The printed book uses English descriptive notation (`R - Q B 7`, `K - Kt 1`) and its diagrams are
images, so each example is rebuilt like this:

1. Read the diagram from the [1921 scan](https://archive.org/details/chessfundamental00capa) and write its FEN.
2. Convert the book's moves to SAN, which also validates the position:
   ```bash
   node tools/descriptive.mjs "7k/8/8/8/8/8/8/R6K w - - 0 1" "1 R - R 7, K - Kt 1; 2 K - Kt 2"
   ```
   Every move must resolve to exactly one legal move — a wrong diagram fails immediately.
3. Write the lesson in `tools/build-chapter1.mjs` (helpers in `tools/author.mjs`, e.g. `a.box('b')`
   computes the squares the black king can still reach) and run `node tools/build-chapter1.mjs`
   (§1–§2) or `node tools/build-chapter1-part2.mjs` (§3–§8). A step with its own `fen` starts a new
   position (useful for variations).
4. Add the lesson id to `book.json`, run `node tools/build-book.mjs` (refreshes the lesson index), then run `node tools/check-lessons.mjs`: it checks every move
   and lists stalemating/mating alternatives in each exercise.

## Settings

- Narration: read aloud, silent with automatic timing, or silent one sentence per tap.
- Settings are remembered between visits (a small first-party cookie; no tracking).
- Without the voice, moves and pauses run about twice as fast.
- Board colours (walnut, blue, green, grey, coral, ice), light / dark / system page theme, coordinates on or off.
- Works on phones and tablets: tap or drag the pieces; on iOS the first tap unlocks speech.

## Keyboard

`←` / `→` previous / next step · `Space` play / stop · `H` hint

## Credits and licences

- Code: MIT (see `LICENSE`).
- Source text: J. R. Capablanca, _Chess Fundamentals_ (1921), [Project Gutenberg #33870](https://www.gutenberg.org/ebooks/33870).
  Public domain in the USA; the author died in 1942, so in the EU/Italy the original text is public domain
  (70 years p.m.a.). Lesson narration is an original adaptation.
- Positions and moves cross-checked with: the 1921 scan on [Internet Archive](https://archive.org/details/chessfundamental00capa);
  the LaTeX edition by lordlinks, [Chess_Fundamentals](https://github.com/lordlinks/Chess_Fundamentals) (CC0 1.0);
  and the FEN list by haussbrandt, [chess-fundamentals-capablanca-fens](https://gist.github.com/haussbrandt/bca4acedb3991dd60ddfc8a9449d45b1).
- Rules engine: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2-Clause).
- Pieces: cburnett set by Colin M.L. Burnett, CC BY-SA 3.0 (via lichess.org).
