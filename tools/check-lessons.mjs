// Validate every lesson and report errors with position context.
// Run: node tools/check-lessons.mjs

import { fileURLToPath } from 'node:url';
import { Chess } from '../js/vendor/chess.js';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = fileURLToPath(new URL('../lessons/', import.meta.url));
const bare = (s) => s.replace(/[+#]$/, '');

let passed = 0;
let failed = 0;
let warnings = 0;

for (const file of readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()) {

  console.log(`\n== ${file}`);

  let game;
  let stepId = '(initialization)';
  let context = 'read lesson';
  let attemptedMove = null;

  function play(move, label) {
    context = label;
    attemptedMove = move;
    game.move(move);
    attemptedMove = null;
  }

  try {
    const lesson = JSON.parse(
      readFileSync(join(dir, file), 'utf8')
    );

    game = new Chess(lesson.startFen);

    for (const step of lesson.steps) {
      stepId = step.id;
      attemptedMove = null;

      if (step.fen) {
        context = 'load step FEN';
        game.load(step.fen);
      }

      for (const [index, segment] of
        (step.narration || []).entries()) {

        const moves = segment.move
          ? [segment.move]
          : segment.moves || [];

        for (const move of moves) {
          play(move, `narration segment ${index + 1}`);
        }
      }

      const exercise = step.exercise;
      if (!exercise) continue;

      context = 'validate exercise';
      const legal = game.moves();
      const legalBare = legal.map(bare);

      if (!Array.isArray(exercise.accept) ||
          exercise.accept.length === 0) {
        throw new Error('Exercise has no accepted moves');
      }

      for (const accepted of exercise.accept) {
        if (!legalBare.includes(bare(accepted))) {
          warnings++;
          console.log(
            `  WARNING: accept not legal: ${accepted}`
          );
        }
      }

      for (const key of
        Object.keys(exercise.feedback || {})) {
        if (key !== '*' &&
            !legalBare.includes(bare(key))) {
          warnings++;
          console.log(
            `  WARNING: feedback not legal: ${key}`
          );
        }
      }

      const notes = legal.map((move) => {
        const copy = new Chess(game.fen());
        copy.move(move);

        const suffix = copy.isStalemate()
          ? ' (STALEMATE)'
          : copy.isCheckmate()
            ? ' (MATE)'
            : '';

        return move + suffix;
      });

      console.log(
        `  ${step.id}: accept ${exercise.accept.join(', ')}`
        + ` | legal: ${legal.length}`
        + ` | ${notes.filter((n) =>
          n.includes('(')).join(' ') || '-'}`
      );

      play(exercise.accept[0], 'exercise.accept[0]');

      if (exercise.reply) {
        play(exercise.reply, 'exercise.reply');
      }
    }

    passed++;
    console.log('  PASS');
  } catch (error) {
    failed++;

    console.log('  FAIL');
    console.log(`  File: ${file}`);
    console.log(`  Step: ${stepId}`);
    console.log(`  Context: ${context}`);

    if (attemptedMove !== null) {
      console.log(`  Attempted move: ${attemptedMove}`);
    }

    console.log(`  Error: ${error.message}`);

    if (game) {
      console.log(`  FEN: ${game.fen()}`);
      console.log(`  Turn: ${game.turn()}`);
      console.log(
        `  Legal moves: ${game.moves().join(', ')}`
      );
    }
  }
}

console.log('\n== SUMMARY');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Warnings: ${warnings}`);

process.exitCode = failed || warnings ? 1 : 0;