// build-chapter1.mjs — source for the Chapter I lessons (lesson 001 is hand-written JSON).
//   node tools/build-chapter1.mjs
import { Author, RANK } from './author.mjs';

const SRC = (section, example) => ({
  work: 'Chess Fundamentals',
  author: 'José Raúl Capablanca',
  year: 1921,
  section: `Chapter I, ${section}, Example ${example}`,
  examples: String(example),
  url: 'https://archive.org/details/chessfundamental00capa',
});
const OUT = new URL('../lessons/', import.meta.url).pathname;
const boxB = (color = 'warning') => (a) => ({ squares: a.box('b'), color });

// ------------------------------------------------------------------ 002
new Author({
  id: '002-rook-mate-centre', title: 'The Rook Mate from the Centre', subtitle: 'Rook and King against King, part 2',
  source: SRC('§1 Some Simple Mates', 2), startFen: '8/8/8/4k3/8/8/8/4K2R w - - 0 1',
})
  .step({
    id: 'intro', title: 'The king is in the centre',
    source: 'Since the Black King is in the centre of the board, the best way to proceed is to advance your own King.',
    narration: [
      { say: 'Same pieces as before, but now the black king stands in the middle of the board, on e5.', highlights: ['e5'] },
      { say: 'The rook cannot build a useful wall yet. The king is too free.', zone: boxB('warning') },
      { say: 'So this time the white king goes first.', highlights: ['e1'], arrows: [{ from: 'e1', to: 'e3', color: 'muted' }] },
    ],
  })
  .step({
    id: 'king-first', title: 'King to the centre, to one side',
    source: 'As the Rook has not yet come into play, it is better to advance the King straight into the centre of the board, not in front, but to one side of the other King.',
    narration: [
      { say: 'King to e2. Black comes to d5.', moves: ['Ke2', 'Kd5'], highlights: ['e2', 'd5'] },
      { say: 'King to e3. Straight into the centre.', move: 'Ke3', highlights: ['e3'] },
      { say: 'Capablanca\'s advice: not directly in front of the other king, but to one side of it.', highlights: ['e3', 'd5'] },
      { say: 'Black steps to c4.', move: 'Kc4', highlights: ['c4'] },
    ],
  })
  .step({
    id: 'rook-joins', title: 'The rook joins in',
    narration: [
      { say: 'Now the rook comes into play. Rook to h5.', move: 'Rh5', arrows: [{ from: 'h1', to: 'h5', color: 'primary' }] },
      { say: 'The fifth rank is closed. The black king cannot go back up.', zone: { squares: RANK(5), color: 'danger' } },
      { say: 'Black goes down to c3.', move: 'Kc3', zone: { squares: RANK(5), color: 'danger' } },
    ],
  })
  .step({
    id: 'shrink', title: 'Your turn: shrink the box',
    source: '…then 4 R - R 4, keeping the King confined to as few squares as possible.',
    narration: [
      { say: 'Now it is your move. Find a quiet rook move that keeps the black king confined to as few squares as possible.' },
    ],
    exercise: {
      prompt: 'Move the rook to shrink the black king\'s box.',
      accept: ['Rh4'],
      feedback: {
        Rc5: 'A check, but the black king simply walks away. Checks are not always the best moves.',
        '*': 'Look for a rook move that closes one more rank, without giving check.',
      },
      hint: 'Move the rook one square down the h-file.',
      hintSquares: ['h4'],
      success: 'Exactly: 4. Rh4. Now the black king is locked into the first three ranks. Black goes to c2.',
      reply: 'Kc2',
    },
  })
  .step({
    id: 'teamwork', title: 'King and rook work together',
    source: 'It should be noticed how often the White King has moved next to the Rook, not only to defend it, but also to reduce the mobility of the opposing King.',
    narration: [
      { say: 'Rook to c4, check. Black goes to b3.', moves: ['Rc4+', 'Kb3'], arrows: [{ from: 'h4', to: 'c4', color: 'primary' }] },
      { say: 'The king comes next to its rook, on d3. Black goes to b2.', moves: ['Kd3', 'Kb2'], highlights: ['d3', 'c4'] },
      { say: 'Rook check on b4. Black goes to a3.', moves: ['Rb4+', 'Ka3'], arrows: [{ from: 'c4', to: 'b4', color: 'primary' }] },
      { say: 'King to c3, again right next to the rook. Black goes to a2.', moves: ['Kc3', 'Ka2'], highlights: ['c3', 'b4'] },
      { say: 'Notice how often the white king stands beside its rook: it defends it, and it takes squares away.', zone: boxB('warning') },
    ],
  })
  .step({
    id: 'waiting', title: 'The waiting move',
    source: '9 R - R 4 ch, K - Kt 8; 10 R - any square on the Rook\'s file, forcing the Black King in front of the White, K - B 8; 11 R - R 1 mate.',
    narration: [
      { say: 'Rook to a4, check. The black king has to go to b1.', moves: ['Ra4+', 'Kb1'], arrows: [{ from: 'b4', to: 'a4', color: 'primary' }] },
      { say: 'Now a lovely idea. White does nothing, but stays on the a-file.' },
      { say: 'The black king will be forced in front of the white king. Make a waiting rook move.' },
    ],
    exercise: {
      prompt: 'Move the rook along the a-file, keeping it safe.',
      accept: ['Ra5', 'Ra6', 'Ra7', 'Ra8', 'Ra3'],
      feedback: {
        Ra2: 'Careful: on a2 the rook is next to the black king, who simply takes it.',
        Ra1: 'Check, but the rook is undefended on a1: the king takes it.',
        '*': 'Stay on the a-file, so that the black king can never escape to a1 or a2.',
      },
      hint: 'Any safe square on the a-file will do.',
      hintSquares: ['a5', 'a6', 'a7', 'a8'],
      success: 'Well done. The black king has only one square: c1, right in front of the white king.',
      reply: 'Kc1',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'The black king is on c1, facing your king. Finish it.', highlights: ['c1', 'c3'] }],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Ra1#'],
      feedback: { '*': 'Not mate yet. The rook should attack the whole first rank.' },
      hint: 'The rook goes to the corner.',
      hintSquares: ['a1'],
      success: 'Checkmate, in eleven moves. Capablanca says it should always be done in under twenty.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'While it may be monotonous, it is worth while for the beginner to practice such things, as it will teach him the proper handling of his pieces.',
    narration: [
      { say: 'When the enemy king is in the centre, bring your own king first.' },
      { say: 'Put it to one side of the enemy king, not directly in front.' },
      { say: 'Use quiet rook moves to shrink the box, and keep the king next to the rook.' },
      { say: 'And when the king is on the edge, a waiting move can force it into the mating square.', highlights: ['a1', 'c1'] },
    ],
  })
  .save(OUT + '002-rook-mate-centre.json');

// ------------------------------------------------------------------ 003
new Author({
  id: '003-two-bishops', title: 'Mate with Two Bishops', subtitle: 'Two Bishops and King against King',
  source: SRC('§1 Some Simple Mates', 3), startFen: '7k/8/8/8/8/8/8/2B1KB2 w - - 0 1',
})
  .step({
    id: 'intro', title: 'Two bishops against a lone king',
    narration: [
      { say: 'Now White has two bishops and a king. The black king is in the corner, on h8.', highlights: ['c1', 'f1', 'h8'] },
      { say: 'One bishop moves on light squares, the other on dark squares. Together they can cover every colour.', highlights: ['c1', 'f1'] },
    ],
  })
  .step({
    id: 'fence', title: 'Build a fence of diagonals',
    source: 'Since the Black King is in the corner, White can play 1 B - Q 3, K - Kt 2; 2 B - K Kt 5, K - B 2; 3 B - B 5, and already the Black King is confined to a few squares.',
    narration: [
      { say: 'Bishop to d3. Black comes out to g7.', moves: ['Bd3', 'Kg7'], arrows: [{ from: 'f1', to: 'd3', color: 'primary' }] },
      { say: 'The other bishop to g5. Black goes to f7.', moves: ['Bg5', 'Kf7'], arrows: [{ from: 'c1', to: 'g5', color: 'primary' }] },
      { say: 'Bishop to f5. The two bishops, side by side, make a fence.', move: 'Bf5', arrows: [{ from: 'd3', to: 'f5', color: 'primary' }] },
      { say: 'Already the black king is confined to a few squares.', zone: boxB('warning') },
      { say: 'Black steps back to g7.', move: 'Kg7', zone: boxB('warning') },
    ],
  })
  .step({
    id: 'king-march', title: 'The king must reach the sixth rank',
    source: 'In this ending the Black King must not only be driven to the edge of the board, but he must also be forced into a corner, and, before a mate can be given, the White King must be brought to the sixth rank and, at the same time, in one of the last two files.',
    narration: [
      { say: 'Here the black king must be driven not only to the edge, but into a corner.' },
      { say: 'And the white king must reach the sixth rank, on one of the last two files. h6 and g6 are the nearest squares.', highlights: ['h6', 'g6'] },
      { say: 'King to f2. Black to f7.', moves: ['Kf2', 'Kf7'] },
      { say: 'King to g3. Black to g7.', moves: ['Kg3', 'Kg7'] },
      { say: 'King to h4. Black to f7.', moves: ['Kh4', 'Kf7'] },
      { say: 'King to h5. Black to g7.', moves: ['Kh5', 'Kg7'], highlights: ['h5', 'h6'] },
    ],
  })
  .step({
    id: 'bishop-g6', title: 'Your turn: take away f7',
    narration: [
      { say: 'The black king keeps stepping between f7 and g7. Find a bishop move that takes away f7, and pushes him back.', highlights: ['f7'] },
    ],
    exercise: {
      prompt: 'Move a bishop to control f7.',
      accept: ['Bg6'],
      feedback: {
        Be6: 'e6 also covers f7, but it lets the king slip out to h7. Capablanca prefers g6, which covers both.',
        '*': 'Look for a light-squared bishop move that attacks f7.',
      },
      hint: 'The light-squared bishop can go to a square next to your king.',
      hintSquares: ['g6'],
      success: 'Right: 8. Bg6. It covers f7 and h7. Black must go back to g8.',
      reply: 'Kg8',
    },
  })
  .step({
    id: 'mark-time', title: 'Marking time',
    source: 'White must now mark time and move one of the Bishops, so as to force the Black King to go back.',
    narration: [
      { say: 'King to h6: the sixth rank, as planned. Black goes to f8.', moves: ['Kh6', 'Kf8'], highlights: ['h6'] },
      { say: 'Now White must mark time, moving a bishop to force the black king back.' },
      { say: 'Bishop to h5. Black returns to g8.', moves: ['Bh5', 'Kg8'], arrows: [{ from: 'g6', to: 'h5', color: 'primary' }] },
      { say: 'Bishop to e7. Black is pushed into the corner, h8.', moves: ['Be7', 'Kh8'], arrows: [{ from: 'g5', to: 'e7', color: 'primary' }], highlights: ['h8'] },
    ],
  })
  .step({
    id: 'prepare-check', title: 'Your turn: give check',
    source: 'Now the White Bishop must take up a position from which it can give check next move along the White diagonal, when the Black King moves back to Kt 1. 12 B - K Kt 4, K - Kt 1; 13 B - K 6 ch, K - R 1; 14 B - B 6 mate.',
    narration: [
      { say: 'The light bishop moves to g4, ready to give check on the light diagonal.', move: 'Bg4', arrows: [{ from: 'h5', to: 'g4', color: 'primary' }] },
      { say: 'Black goes back to g8.', move: 'Kg8' },
      { say: 'Now give check with that bishop.' },
    ],
    exercise: {
      prompt: 'Give check along the light diagonal.',
      accept: ['Be6+'],
      feedback: { '*': 'The light-squared bishop can check the king on g8 from e6.' },
      hint: 'The check comes on the a2 to g8 diagonal.',
      hintSquares: ['e6'],
      success: '13. Be6, check. Black must go to h8.',
      reply: 'Kh8',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    source: 'In all endings of this kind, care must be taken not to drift into a stale mate.',
    narration: [
      { say: 'One more bishop move gives mate. Careful: in these endings it is easy to stalemate by mistake.' },
    ],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Bf6#'],
      feedback: { '*': 'Not mate. The dark-squared bishop should check along the long diagonal.' },
      hint: 'The dark-squared bishop checks from f6.',
      hintSquares: ['f6'],
      success: 'Checkmate in fourteen moves. Capablanca says it should be done in under thirty, from any position.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'Two bishops side by side make a fence the king cannot cross.' },
      { say: 'The king must be driven to the edge, and then into a corner.' },
      { say: 'The white king comes to the sixth rank, on one of the last two files.' },
      { say: 'Use waiting bishop moves to push the king back, and always watch out for stalemate.' },
    ],
  })
  .save(OUT + '003-two-bishops.json');

// ------------------------------------------------------------------ 004
new Author({
  id: '004-queen-mate', title: 'The Queen Mate', subtitle: 'Queen and King against King',
  source: SRC('§1 Some Simple Mates', 4), startFen: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1',
})
  .step({
    id: 'intro', title: 'The easiest mate of all',
    source: 'As the Queen combines the power of the Rook and the Bishop, it is the easiest mate of all and should always be accomplished in under ten moves.',
    narration: [
      { say: 'The queen combines the power of the rook and the bishop.', highlights: ['h1'] },
      { say: 'That makes this the easiest mate of all. It should always take fewer than ten moves.', highlights: ['e5'] },
    ],
  })
  .step({
    id: 'queen-first', title: 'Start with the queen',
    source: 'A good way to begin is to make the first move with the Queen, trying to limit the Black King\'s mobility as much as possible.',
    narration: [
      { say: 'A good start is a queen move that limits the black king as much as possible.' },
      { say: 'Queen to c6.', move: 'Qc6', arrows: [{ from: 'h1', to: 'c6', color: 'primary' }] },
      { say: 'Black goes to d4.', move: 'Kd4', zone: boxB('warning') },
      { say: 'King to d2. Look: the black king has only one square left.', move: 'Kd2', zone: boxB('warning') },
      { say: 'He goes to e5.', move: 'Ke5' },
    ],
  })
  .step({
    id: 'squeeze', title: 'Squeeze towards the edge',
    narration: [
      { say: 'King to e3. Black to f5.', moves: ['Ke3', 'Kf5'] },
      { say: 'Queen to d6. Black to g5.', moves: ['Qd6', 'Kg5'], arrows: [{ from: 'c6', to: 'd6', color: 'primary' }] },
      { say: 'Queen to e6. Black runs to the edge, on h4.', moves: ['Qe6', 'Kh4'], arrows: [{ from: 'd6', to: 'e6', color: 'primary' }], zone: boxB('warning') },
    ],
  })
  .step({
    id: 'cage', title: 'Your turn: close the cage',
    narration: [
      { say: 'The black king is on the h-file. Find a quiet queen move that keeps him trapped there.', zone: { squares: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'], color: 'warning' } },
    ],
    exercise: {
      prompt: 'A quiet queen move that locks the king on the edge.',
      accept: ['Qg6'],
      feedback: {
        Qh6: 'Check, but the king escapes to g4. No hurry: take squares away instead.',
        '*': 'Put the queen on the g-file, a knight\'s jump away from the king.',
      },
      hint: 'The queen goes one file away from the king, on the g-file.',
      hintSquares: ['g6'],
      success: 'Right: 6. Qg6. The black king can only go to h3.',
      reply: 'Kh3',
    },
  })
  .step({
    id: 'king-helps', title: 'Your turn: bring the king',
    source: 'In each case the co-operation of the King is needed.',
    narration: [
      { say: 'The queen alone cannot mate. The white king must come closer. Your move.' },
    ],
    exercise: {
      prompt: 'Bring the white king closer. Watch out for stalemate.',
      accept: ['Kf3'],
      feedback: {
        '*': 'Step the king towards the black king, to f3.',
      },
      hint: 'The king goes diagonally towards the black king.',
      hintSquares: ['f3'],
      success: '7. Kf3. Black has to move, and goes to h2.',
      reply: 'Kh2',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'The queen mates next move. Find it.' }],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Qg2#'],
      feedback: { '*': 'Not mate. The queen should go right next to the black king, protected by your king.' },
      hint: 'The queen lands next to the black king, defended by the white king.',
      hintSquares: ['g2'],
      success: 'Checkmate in eight moves.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'The three elementary endings',
    source: 'These are the three elementary endings and in all of these the principle is the same. In each case the co-operation of the King is needed. In order to force a mate without the aid of the King, at least two Rooks are required.',
    narration: [
      { say: 'Rook, two bishops, queen: these are the three elementary endings.' },
      { say: 'The principle is always the same: drive the enemy king to the edge of the board.' },
      { say: 'And in each case the king must help. Without the king, you need at least two rooks to force mate.' },
    ],
  })
  .save(OUT + '004-queen-mate.json');

// ------------------------------------------------------------------ 005
new Author({
  id: '005-pawn-draw', title: 'Defending against a Pawn', subtitle: 'Pawn promotion: the drawn position',
  source: SRC('§2 Pawn Promotion', 5), startFen: '8/8/8/8/4k3/8/3KP3/8 w - - 0 1',
})
  .step({
    id: 'intro', title: 'One pawn can be enough',
    source: 'The gain of a Pawn is the smallest material advantage that can be obtained in a game; and it often is sufficient to win, even when the Pawn is the only remaining unit, apart from the Kings.',
    narration: [
      { say: 'A single extra pawn is the smallest advantage in chess. Yet it is often enough to win.', highlights: ['e2'] },
      { say: 'The rule: the king should be in front of its pawn, with at least one square in between.' },
      { say: 'But if the enemy king stands directly in front of the pawn, the game cannot be won.' },
      { say: 'In this lesson you defend with Black.', highlights: ['e4'] },
    ],
  })
  .step({
    id: 'in-front', title: 'Stay in front',
    source: 'The way to proceed is for Black to keep the King always directly in front of the Pawn, and when it cannot be done […] then the Black King must be kept in front of the White King.',
    narration: [
      { say: 'Pawn to e3. The black king goes straight in front of it, to e5.', moves: ['e3', 'Ke5'], highlights: ['e3', 'e5'] },
      { say: 'King to d3. Now Black cannot stay close to the pawn.', move: 'Kd3', highlights: ['d3'] },
      { say: 'So the black king must stand in front of the white king instead. You are Black. Your move.' },
    ],
    exercise: {
      prompt: 'Black to move. Where must the black king go?',
      accept: ['Kd5'],
      feedback: {
        Ke6: 'Too far back. Capablanca: any other move but Kd5 loses.',
        Kf5: 'That is not in front of the white king. Now White\'s king goes ahead.',
        Kf6: 'Too far back. Bring the king as far forward as possible.',
        Kd6: 'Too far back. Bring the king as far forward as possible, in front of the white king.',
        '*': 'Stand as far forward as possible, and directly in front of the white king.',
      },
      hint: 'The white king is on d3. Stand in front of it.',
      hintSquares: ['d5'],
      success: 'Yes: 2... Kd5. A very important move. Any other move would lose. White pushes the pawn with check.',
      reply: 'e4+',
    },
  })
  .step({
    id: 'dance', title: 'The dance of the kings',
    source: 'As the White King comes up, the Black King must be kept in front of it, since it cannot be brought up to the Pawn.',
    narration: [
      { say: 'Black returns in front of the pawn, to e5.', move: 'Ke5', highlights: ['e5'] },
      { say: 'King to e3. Black to e6.', moves: ['Ke3', 'Ke6'] },
      { say: 'King to f4. Black to f6, again in front of the white king.', moves: ['Kf4', 'Kf6'], highlights: ['f4', 'f6'] },
      { say: 'Pawn to e5, check. Black to e6.', moves: ['e5+', 'Ke6'] },
      { say: 'King to e4. Black to e7.', moves: ['Ke4', 'Ke7'] },
      { say: 'King to d5. Black to d7.', moves: ['Kd5', 'Kd7'], highlights: ['d5', 'd7'] },
      { say: 'Pawn to e6, check. Black to e7.', moves: ['e6+', 'Ke7'] },
      { say: 'King to e5. Black to e8.', moves: ['Ke5', 'Ke8'] },
      { say: 'King to d6. Your move again.', move: 'Kd6', highlights: ['d6'] },
    ],
    exercise: {
      prompt: 'Black to move. Keep the draw.',
      accept: ['Kd8'],
      feedback: {
        Kf8: 'After Kf8, White plays Kd7 and the pawn runs to e8. Stand in front of the white king.',
        '*': 'Stand directly in front of the white king.',
      },
      hint: 'The white king is on d6.',
      hintSquares: ['d8'],
      success: 'Correct: 11... Kd8. Black is in front of the white king. The draw is safe.',
      reply: null,
    },
  })
  .step({
    id: 'stalemate', title: 'Why it is a draw',
    source: 'If now White advances the Pawn, the Black King gets in front of it and White must either give up the Pawn or play K - K 6, and a stale mate results.',
    narration: [
      { say: 'If White pushes the pawn to e7, check, the black king steps in front of it.', moves: ['e7+', 'Ke8'], highlights: ['e8'] },
      { say: 'Now White must either give up the pawn, or play king to e6.', highlights: ['e6'] },
      { say: 'King to e6: Black has no legal move, but is not in check. Stalemate. A draw.', move: 'Ke6', zone: { squares: ['d7', 'd8', 'f7', 'f8'], color: 'danger' } },
    ],
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'The whole mode of procedure is very important and the student should become thoroughly conversant with its details.',
    narration: [
      { say: 'The defender keeps his king directly in front of the pawn.' },
      { say: 'When that is not possible, he keeps it in front of the enemy king, as far forward as possible.' },
      { say: 'Capablanca could not stress it enough: many beginners have lost identical positions.' },
    ],
  })
  .save(OUT + '005-pawn-draw.json');

// ------------------------------------------------------------------ 006
new Author({
  id: '006-pawn-win', title: 'Winning with a Pawn', subtitle: 'Pawn promotion: the winning method',
  source: SRC('§2 Pawn Promotion', 6), startFen: '8/8/5k2/8/5K2/8/4P3/8 w - - 0 1',
})
  .step({
    id: 'intro', title: 'King in front of the pawn',
    source: 'In this position White wins, as the King is in front of his Pawn and there is one intervening square.',
    narration: [
      { say: 'Here White wins: the king is in front of its pawn, with a square in between.', highlights: ['f4', 'e2'] },
      { say: 'The method: advance the king as far as the safety of the pawn allows.' },
      { say: 'And never push the pawn until its own safety requires it.' },
    ],
  })
  .step({
    id: 'king-first', title: 'Your turn: king first',
    source: 'The method to follow is to advance the King as far as is compatible with the safety of the Pawn and never to advance the Pawn until it is essential to its own safety.',
    narration: [{ say: 'Your move. Remember the method.' }],
    exercise: {
      prompt: 'White to move. King or pawn?',
      accept: ['Ke4'],
      feedback: {
        e4: 'Not yet. Never push the pawn until it is essential to its safety. King first.',
        e3: 'Not yet. Never push the pawn until it is essential to its safety. King first.',
        '*': 'Advance the king, as far forward as you can.',
      },
      hint: 'The king goes forward, in front of the pawn.',
      hintSquares: ['e4'],
      success: '1. Ke4. Black blocks the way with Ke6.',
      reply: 'Ke6',
    },
  })
  .step({
    id: 'forced-pawn', title: 'Now the pawn must move',
    source: 'Black does not allow the White King to advance, therefore White is now compelled to advance his Pawn so as to force Black to move away. He is then able to advance his own King.',
    narration: [
      { say: 'Black does not let the white king advance.', highlights: ['e4', 'e6'] },
      { say: 'So now White is compelled to push the pawn, to force Black to move away.', move: 'e3' },
      { say: 'Black steps aside, to f6.', move: 'Kf6' },
      { say: 'Now the white king can go forward, to d5. Black goes to e7.', moves: ['Kd5', 'Ke7'], highlights: ['d5'] },
    ],
  })
  .step({
    id: 'still-king', title: 'Your turn: pawn or king?',
    source: 'It is better for White not to advance the Pawn yet, since its own safety does not require it, but to try to bring the King still further forward.',
    narration: [{ say: 'The pawn is safe. So what does the method say?' }],
    exercise: {
      prompt: 'White to move. Bring the king further forward.',
      accept: ['Ke5'],
      feedback: {
        e4: 'The pawn is not in danger, so its safety does not require this. Bring the king further forward.',
        '*': 'Move the king forward, staying close to the pawn.',
      },
      hint: 'The king steps diagonally forward.',
      hintSquares: ['e5'],
      success: '4. Ke5. Black goes to d7.',
      reply: 'Kd7',
    },
  })
  .step({
    id: 'bring-pawn', title: 'Bring the pawn up',
    source: 'Now the White Pawn is too far back and it may be brought up within protection of the King.',
    narration: [
      { say: 'King to f6. Black goes to e8.', moves: ['Kf6', 'Ke8'], highlights: ['f6'] },
      { say: 'Now the pawn is too far back. Bring it up, within protection of the king.', move: 'e4', arrows: [{ from: 'e3', to: 'e4', color: 'primary' }] },
      { say: 'Black to d7.', move: 'Kd7' },
      { say: 'Not king to f7, because Black would attack the pawn from d6. So the pawn goes on, to e5.', move: 'e5', highlights: ['e5', 'f6'] },
      { say: 'Black goes back to e8, in front.', move: 'Ke8' },
    ],
  })
  .step({
    id: 'key-move', title: 'Your turn: the key move',
    source: 'P - K 6 would make it a draw, as Black would then play K - B, and we would have a position similar to the one explained in connection with Example 5.',
    narration: [{ say: 'White must force the black king away, while keeping his own king in front of the pawn. Careful: one pawn push here throws away the win.' }],
    exercise: {
      prompt: 'White to move and keep the win.',
      accept: ['Ke6'],
      feedback: {
        e6: 'That is the draw from the previous lesson: Black answers Kf8 and holds.',
        Kf5: 'Backwards. Keep your king in front of the pawn.',
        '*': 'Keep your king in front of the pawn, and take the opposition.',
      },
      hint: 'The king steps in front of the pawn, facing the black king.',
      hintSquares: ['e6'],
      success: '8. Ke6. Black must give way: Kf8.',
      reply: 'Kf8',
    },
  })
  .step({
    id: 'last-step', title: 'Your turn: control the path',
    narration: [{ say: 'One more king move controls every square the pawn needs.' }],
    exercise: {
      prompt: 'White to move. Control e7 and e8.',
      accept: ['Kd7'],
      feedback: {
        Kf6: 'Now Black comes back with Ke8.',
        '*': 'Put the king next to the pawn\'s path, where it controls e7 and e8.',
      },
      hint: 'The king goes beside the e-file.',
      hintSquares: ['d7'],
      success: '9. Kd7. Nothing can stop the pawn now.',
      reply: 'Kg7',
    },
  })
  .step({
    id: 'queen', title: 'A new queen',
    source: 'King moves and the White Pawn advances to K 8, becomes a Queen, and it is all over.',
    narration: [
      { say: 'The pawn marches to e6.', moves: ['e6', 'Kf6'], arrows: [{ from: 'e5', to: 'e8', color: 'primary' }] },
      { say: 'To e7, protected by the king.', moves: ['e7', 'Kf7'] },
      { say: 'And to e8, where it becomes a queen. It is all over.', move: 'e8=Q+', highlights: ['e8'] },
    ],
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'This ending is like the previous one, and for the same reasons should be thoroughly understood before proceeding any further.',
    narration: [
      { say: 'The king goes in front of the pawn, as far as the pawn\'s safety allows.' },
      { say: 'The pawn moves only when it must: to stay safe, or to force the enemy king to give way.' },
      { say: 'And in the critical moment, a king move, not a pawn move, wins the game.' },
    ],
  })
  .save(OUT + '006-pawn-win.json');
