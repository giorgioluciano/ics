// build-chapter1-part2.mjs — Chapter I, §3–§8 (Examples 7–21 and §5).
//   node tools/build-chapter1-part2.mjs
import { Author, RANK } from './author.mjs';

const SRC = (section, example) => ({
  work: 'Chess Fundamentals',
  author: 'José Raúl Capablanca',
  year: 1921,
  section: example ? `Chapter I, ${section}, Example ${example}` : `Chapter I, ${section}`,
  examples: example ? String(example) : null,
  url: 'https://archive.org/details/chessfundamental00capa',
});
const OUT = new URL('../lessons/', import.meta.url).pathname;
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const lesson = (id, title, subtitle, section, example, startFen) =>
  new Author({ id, title, subtitle, source: SRC(section, example), startFen });

// ------------------------------------------------------------------ 007  Example 7
{
  const F = '5k2/6p1/4K1P1/5P2/8/8/8/8 w - - 0 1';
  lesson('007-two-pawns-v-one', 'Two Pawns against One', 'Pawn endings: the king leads', '§3 Pawn Endings', 7, F)
    .step({
      id: 'intro', title: 'Two pawns against one',
      source: 'I shall now give a couple of simple endings of two Pawns against one, or three against two, that the reader may see how they can be won. […] It is up to the student to work things out for himself.',
      narration: [
        { say: 'White has two pawns, Black has one. It looks easy.', highlights: ['f5', 'g6', 'g7'] },
        { say: 'But the obvious move does not win. Let us see why first.' },
      ],
    })
    .step({
      id: 'trap', title: 'The tempting push',
      source: 'In this position White cannot win by playing 1 P - B 6, because Black plays, not P x P, which would lose, but 1…K - Kt 1, and if then 2 P x P, K x P, and draws.',
      narration: [
        { say: 'Pawn to f6 looks natural.', move: 'f6', arrows: [{ from: 'f5', to: 'f6', color: 'muted' }] },
        { say: 'But Black does not take. He plays king to g8.', move: 'Kg8', highlights: ['g8'] },
        { say: 'If White now takes on g7, the black king takes back, and it is a draw.', moves: ['fxg7', 'Kxg7'], highlights: ['g7'] },
      ],
    })
    .step({
      id: 'king-first', fen: F, title: 'Your turn: the winning idea',
      narration: [
        { say: 'Back to the start. White wins, but with the king first. Your move.', highlights: ['e6'] },
      ],
      exercise: {
        prompt: 'White to move and win. Start with the king.',
        accept: ['Kd7'],
        feedback: {
          f6: 'That is the tempting push: Black answers Kg8 and draws.',
          Ke5: 'Backwards. The king should go forward, towards e7.',
          '*': 'The king heads for e7, next to the pawns and the black king.',
        },
        hint: 'The king goes round, via d7.',
        hintSquares: ['d7'],
        success: '1. Kd7. Black goes to g8.',
        reply: 'Kg8',
      },
    })
    .step({
      id: 'now-f6', title: 'Now the push works',
      narration: [
        { say: 'King to e7. Black to h8.', moves: ['Ke7', 'Kh8'], highlights: ['e7'] },
        { say: 'Now f6 works, because the white king protects f7 and f8.', move: 'f6', highlights: ['f7', 'f8'] },
        { say: 'If Black does not take, f7 and the pawn queens with mate. So Black takes.', move: 'gxf6' },
      ],
    })
    .step({
      id: 'kf7', title: 'Your turn: shut the door',
      narration: [{ say: 'The black king is in the corner. Your king can lock him in.' }],
      exercise: {
        prompt: 'White to move. Keep the black king in the corner.',
        accept: ['Kf7'],
        feedback: {
          g7: 'Check, but after Kxg7 White has nothing left. First lock the king in.',
          Kxf6: 'Kxf6 takes a pawn, but then the black king gets out of the corner.',
          '*': 'The king steps next to the g-pawn and takes g7 and g8 away.',
        },
        hint: 'The king goes to f7.',
        hintSquares: ['f7'],
        success: '4. Kf7. Black can only move his pawn: f5.',
        reply: 'f5',
      },
    })
    .step({
      id: 'queen', title: 'Promote and mate',
      source: '4 K - B 7, P - B 4; 5 P - Kt 7 ch, K - R 2; 6 P - Kt 8 (Q) ch, K - R 3; 7 Q - Kt 6 mate.',
      narration: [
        { say: 'Pawn to g7, check. Black to h7.', moves: ['g7+', 'Kh7'] },
        { say: 'The pawn becomes a queen, with check. Black to h6.', moves: ['g8=Q+', 'Kh6'], highlights: ['g8'] },
      ],
      exercise: {
        prompt: 'White to move and give checkmate in one.',
        accept: ['Qg6#'],
        feedback: { '*': 'Not mate. The queen can land next to the black king, protected by your own king.' },
        hint: 'The queen goes to g6.',
        hintSquares: ['g6'],
        success: 'Checkmate. The king did the work; the pawns only moved when it was safe.',
        reply: null,
      },
    })
    .step({
      id: 'summary', title: 'What we learned',
      narration: [
        { say: 'The obvious pawn push can throw away the win.' },
        { say: 'Bring the king up first, so that the pawns can advance under its protection.' },
      ],
    })
    .save(OUT + '007-two-pawns-v-one.json');
}

// ------------------------------------------------------------------ 008  Example 8
lesson('008-connected-pawns', 'A Harder Pawn Ending', 'Two connected pawns against one', '§3 Pawn Endings', 8, '8/6p1/3k4/8/3K1PP1/8/8/8 w - - 0 1')
  .step({
    id: 'intro', title: 'Why the pawns cannot just run',
    source: 'In the above position White can\'t win by 1 P - B 5. Black\'s best answer would be P - Kt 3 draws. […] He cannot win by 1 P - Kt 5, because P - Kt 3 draws. (This, because of the principle of the "opposition" which governs this ending.)',
    narration: [
      { say: 'Two connected pawns against one. But neither pawn can simply run.', highlights: ['f4', 'g4'] },
      { say: 'After f5 or g5, Black answers g6 and draws.', arrows: [{ from: 'g7', to: 'g6', color: 'danger' }] },
      { say: 'The reason is the opposition, which Capablanca explains later. For now: the king leads.' },
    ],
  })
  .step({
    id: 'king-first', title: 'Your turn: king first',
    narration: [{ say: 'Your move. Remember the lesson of the previous example.' }],
    exercise: {
      prompt: 'White to move. How does White start?',
      accept: ['Ke4'],
      feedback: {
        f5: 'Black answers g6, and the game is drawn.',
        g5: 'Black answers g6, and the game is drawn.',
        '*': 'Bring the king forward, next to the pawns.',
      },
      hint: 'The king steps diagonally forward, towards the pawns.',
      hintSquares: ['e4'],
      success: '1. Ke4. Black stays in front with Ke6.',
      reply: 'Ke6',
    },
  })
  .step({
    id: 'advance', title: 'The pawns advance, protected',
    source: '2 P - B 5 ch, K - B 3; 3 K - B 4, P - Kt 3. (If this Pawn is kept back we arrive at the ending shown in Example 7.)',
    narration: [
      { say: 'Pawn to f5, check. Black to f6.', moves: ['f5+', 'Kf6'] },
      { say: 'King to f4. Black plays g6. If he kept the pawn back, we would be in the previous example.', moves: ['Kf4', 'g6'] },
      { say: 'Pawn to g5, check. Black to f7.', moves: ['g5+', 'Kf7'] },
      { say: 'Pawn to f6. Black to e6.', moves: ['f6', 'Ke6'] },
      { say: 'King to e4, and Black returns to f7.', moves: ['Ke4', 'Kf7'] },
      { say: 'King to e5. Black to f8.', moves: ['Ke5', 'Kf8'], highlights: ['e5', 'f6', 'g5'] },
    ],
  })
  .step({
    id: 'give-up', title: 'Your turn: give one to take one',
    source: 'White cannot force his Bishop\'s Pawn into Q (find out why), but by giving his Pawn up he can win the other Pawn and the game.',
    narration: [
      { say: 'White cannot force the f-pawn to queen. But by giving it up, he can win the other pawn, and the game.' },
    ],
    exercise: {
      prompt: 'White to move. Give up the f-pawn in the right way.',
      accept: ['f7'],
      feedback: { '*': 'Push the f-pawn: Black must spend time taking it.' },
      hint: 'The f-pawn goes forward one more square.',
      hintSquares: ['f7'],
      success: '8. f7. Black takes it.',
      reply: 'Kxf7',
    },
  })
  .step({
    id: 'hunt', title: 'The king hunts the g-pawn',
    narration: [
      { say: 'King to d6. Black to f8.', moves: ['Kd6', 'Kf8'] },
      { say: 'King to e6. Black to g7.', moves: ['Ke6', 'Kg7'] },
      { say: 'King to e7. Black to g8.', moves: ['Ke7', 'Kg8'] },
      { say: 'King to f6. Black to h7.', moves: ['Kf6', 'Kh7'] },
      { say: 'King to f7. Black to h8.', moves: ['Kf7', 'Kh8'] },
      { say: 'And the king takes the pawn on g6. Black to g8.', moves: ['Kxg6', 'Kg8'], highlights: ['g6'] },
    ],
  })
  .step({
    id: 'kh6', title: 'Your turn: the only way',
    source: 'There is still some resistance in Black\'s position. In fact, the only way to win is the one given here. 15 K - R 6 (if K - B 6, K - R 2; and in order to win White must get back to the actual position, as against 16 P - Kt 6 ch, K - R 1 draws).',
    narration: [{ say: 'There is still some resistance. Only one move wins cleanly here.' }],
    exercise: {
      prompt: 'White to move. Find the only clean win.',
      accept: ['Kh6'],
      feedback: {
        Kf6: 'After Kf6, Black plays Kh7, and g6 check, Kh8 would be a draw. White would have to come back.',
        Kf5: 'Too far away. Stay close to the black king.',
        '*': 'Put your king where the pawn can advance with the king protecting it, and the black king cannot get in front.',
      },
      hint: 'The king goes to the edge, next to the pawn.',
      hintSquares: ['h6'],
      success: '15. Kh6. Black to h8.',
      reply: 'Kh8',
    },
  })
  .step({
    id: 'queen', title: 'The pawn gets through',
    narration: [
      { say: 'Pawn to g6. Black to g8.', moves: ['g6', 'Kg8'] },
      { say: 'Pawn to g7. Black to f7.', moves: ['g7', 'Kf7'] },
      { say: 'King to h7, and the pawn queens.', move: 'Kh7', arrows: [{ from: 'g7', to: 'g8', color: 'primary' }] },
    ],
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'This ending, apparently so simple, should show the student the enormous difficulties to be surmounted, even when there are hardly any pieces left.',
    narration: [
      { say: 'Even with very few pieces, the ending can be hard.' },
      { say: 'Sometimes you give up one pawn to win the other.' },
      { say: 'And these elementary things are the basis of true mastership in chess.' },
    ],
  })
  .save(OUT + '008-connected-pawns.json');

// ------------------------------------------------------------------ 009  Example 9
lesson('009-three-v-two', 'Three Pawns against Two', 'Push the free pawn', '§3 Pawn Endings', 9, '8/6pp/3k4/8/3K1PPP/8/8/8 w - - 0 1')
  .step({
    id: 'intro', title: 'Three pawns against two',
    source: 'White can win by advancing any of the three Pawns on the first move, but it is convenient to follow the general rule, whenever there is no good reason against it, of advancing the Pawn that has no Pawn opposing it.',
    narration: [
      { say: 'Three pawns against two, all on the same side.', highlights: ['f4', 'g4', 'h4', 'g7', 'h7'] },
      { say: 'The general rule: advance the pawn that has no pawn opposing it.' },
    ],
  })
  .step({
    id: 'free-pawn', title: 'Your turn: the free pawn',
    narration: [{ say: 'Which pawn has no black pawn in front of it? Push it.' }],
    exercise: {
      prompt: 'White to move. Push the pawn that has no opponent.',
      accept: ['f5'],
      feedback: {
        g5: 'That also wins here, but the rule says: push the pawn with no pawn opposing it.',
        h5: 'That also wins here, but the rule says: push the pawn with no pawn opposing it.',
        '*': 'Push a pawn. Which one has no black pawn on its file?',
      },
      hint: 'There is no black pawn on the f-file.',
      hintSquares: ['f5'],
      success: '1. f5. Black to e7.',
      reply: 'Ke7',
    },
  })
  .step({
    id: 'advance', title: 'King and pawns together',
    narration: [
      { say: 'King to e5. Black to f7.', moves: ['Ke5', 'Kf7'] },
      { say: 'Pawn to g5. Black to e7.', moves: ['g5', 'Ke7'] },
      { say: 'Pawn to h5. White is ready for g6.', move: 'h5', highlights: ['f5', 'g5', 'h5'] },
      { say: 'Black goes to f8. Now g6.', moves: ['Kf8', 'g6'], arrows: [{ from: 'g5', to: 'g6', color: 'primary' }] },
      { say: 'After the exchange on g6, we have the same ending as two lessons ago.', moves: ['hxg6', 'hxg6'], highlights: ['f5', 'g6', 'g7'] },
    ],
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'When there is no good reason against it, advance the pawn that has no pawn opposing it.' },
      { say: 'Then simplify into an ending you already know how to win.' },
    ],
  })
  .save(OUT + '009-three-v-two.json');

// ------------------------------------------------------------------ 010  Example 10
lesson('010-both-wings', 'Pawns on Both Wings', 'Act where you are stronger', '§3 Pawn Endings', 10, '8/p6p/4k3/8/4K3/8/P5PP/8 w - - 0 1')
  .step({
    id: 'intro', title: 'Act where you are stronger',
    source: 'In these cases the general rule is to act immediately on the side where you have the superior forces.',
    narration: [
      { say: 'Now there are pawns on both sides of the board.' },
      { say: 'On the queen side, one pawn each.', highlights: ['a2', 'a7'] },
      { say: 'On the king side, White has two pawns against one. That is where White must act, immediately.', highlights: ['g2', 'h2', 'h7'] },
    ],
  })
  .step({
    id: 'g4', title: 'Your turn: the first push',
    source: 'It is generally advisable to advance the Pawn that is free from opposition.',
    narration: [{ say: 'Your move. Remember the rule about the free pawn.' }],
    exercise: {
      prompt: 'White to move. Start the king-side advance.',
      accept: ['g4'],
      feedback: {
        h4: 'The h-pawn has a black pawn in front of it. Push the free one.',
        h3: 'The h-pawn has a black pawn in front of it. Push the free one.',
        g3: 'Right pawn, but take two steps: there is no time to waste.',
        '*': 'Act on the king side, where you are stronger.',
      },
      hint: 'The g-pawn has no black pawn in front of it.',
      hintSquares: ['g4'],
      success: '1. g4. Black advances on the other side: a5.',
      reply: 'a5',
    },
  })
  .step({
    id: 'stop', title: 'Stop the other pawn?',
    source: 'In this case either way wins, but generally the advance should be stopped when the opposing King is far away.',
    narration: [
      { say: 'Should White stop the black pawn? Here either way wins.' },
      { say: 'But generally, stop the advance when the opposing king is far away. Your move.' },
    ],
    exercise: {
      prompt: 'White to move. Stop the black a-pawn.',
      accept: ['a4'],
      feedback: { '*': 'Block the black pawn with your own a-pawn.' },
      hint: 'Your a-pawn goes two squares.',
      hintSquares: ['a4'],
      success: '2. a4. Black goes to f6.',
      reply: 'Kf6',
    },
  })
  .step({
    id: 'plan', title: 'The winning plan',
    source: 'Now it is time to go to the other side with the King, win the Black Pawn and Queen the single Pawn. This is typical of all such endings.',
    narration: [
      { say: 'Pawn to h4. Black to e6.', moves: ['h4', 'Ke6'] },
      { say: 'Pawn to g5. Black to f7.', moves: ['g5', 'Kf7'] },
      { say: 'King to f5. Black to g7.', moves: ['Kf5', 'Kg7'] },
      { say: 'Pawn to h5. Black to f7.', moves: ['h5', 'Kf7'], highlights: ['g5', 'h5'] },
      { say: 'King to e5. Now the two pawns defend each other, and the king is free.', move: 'Ke5' },
      { say: 'It goes to the other side, wins the pawn on a5, and queens the a-pawn.', arrows: [{ from: 'e5', to: 'b6', color: 'primary' }, { from: 'b6', to: 'a5', color: 'primary' }], highlights: ['a5'] },
    ],
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'With pawns on both wings, act immediately where you have more pawns.' },
      { say: 'Stop the enemy pawn when his king is far away.' },
      { say: 'Then use your king to win on the other side.' },
    ],
  })
  .save(OUT + '010-both-wings.json');

// ------------------------------------------------------------------ 011  Example 11
lesson('011-hidden-threat', 'The Hidden Threat', 'A queen sacrifice on h7', '§4 Some Winning Positions in the Middle-game', 11, '5rk1/1b3p1p/ppq3p1/2p5/8/1P1P1R1Q/PBP3PP/7K b - - 0 1')
  .step({
    id: 'intro', title: 'Now with all the pieces',
    source: 'Before considering the openings, we shall devote a little time to some combinations that often arise during the game, and which will give the reader some idea of the beauty of the game.',
    narration: [
      { say: 'Now a real middle-game position. It is Black\'s move.' },
      { say: 'White seems to threaten queen to h6, and mate on g7 with the help of the bishop.', arrows: [{ from: 'h3', to: 'h6', color: 'danger' }, { from: 'b2', to: 'g7', color: 'danger' }] },
    ],
  })
  .step({
    id: 'counter', title: 'Black counterattacks',
    narration: [
      { say: 'Black thinks that is the only threat, and plays rook to e8, threatening mate on e1.', move: 'Re8', arrows: [{ from: 'e8', to: 'e1', color: 'danger' }] },
      { say: 'But White has a much stronger threat. Can you find it?' },
    ],
    exercise: {
      prompt: 'White to move. Find the hidden threat.',
      accept: ['Qxh7+'],
      feedback: {
        Qh6: 'Too slow: Black mates first with Re1 check.',
        '*': 'Look for a sacrifice that opens the h-file for the rook.',
      },
      hint: 'The queen takes a pawn, with check.',
      hintSquares: ['h7'],
      success: '2. Qxh7, check! The black king must take.',
      reply: 'Kxh7',
    },
  })
  .step({
    id: 'rook-check', title: 'Your turn: the rook joins',
    narration: [{ say: 'The h-file is open. Bring the rook.' }],
    exercise: {
      prompt: 'White to move. Check with the rook.',
      accept: ['Rh3+'],
      feedback: { '*': 'The rook swings to the h-file with check.' },
      hint: 'The rook moves along the third rank.',
      hintSquares: ['h3'],
      success: '3. Rh3, check. Black goes back to g8.',
      reply: 'Kg8',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'One more rook move.' }],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Rh8#'],
      feedback: { '*': 'The rook goes all the way up the h-file.' },
      hint: 'The rook reaches the eighth rank.',
      hintSquares: ['h8'],
      success: 'Checkmate. The bishop on b2 controls g7, so the king has no escape.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'Before answering a threat, look for the opponent\'s real, most effective threat.' },
      { say: 'Here the bishop on the long diagonal and the rook on the h-file worked together against the king.', arrows: [{ from: 'b2', to: 'g7', color: 'primary' }] },
    ],
  })
  .save(OUT + '011-hidden-threat.json');

// ------------------------------------------------------------------ 012  Example 12
lesson('012-win-back-piece', 'Winning the Piece Back', 'The same idea in a harder position', '§4 Some Winning Positions in the Middle-game', 12, '5rk1/1bq1bp1p/p1n3p1/1p6/3N4/1P1PR2Q/PBP3PP/7K w - - 0 1')
  .step({
    id: 'intro', title: 'A piece behind',
    source: 'White is a piece behind, and unless he can win it back quickly he will lose.',
    narration: [
      { say: 'White is a piece behind. Unless he wins it back quickly, he will lose.' },
      { say: 'Notice the same pattern as before: queen on h3, bishop on b2, black pawn on g6.', highlights: ['h3', 'b2', 'g6'] },
    ],
  })
  .step({
    id: 'nxc6', title: 'Your turn: start with a capture',
    narration: [{ say: 'Your move. Start by taking something.' }],
    exercise: {
      prompt: 'White to move. Take a black piece.',
      accept: ['Nxc6'],
      feedback: { '*': 'The knight on d4 can take a black knight.' },
      hint: 'The knight takes on c6.',
      hintSquares: ['c6'],
      success: '1. Nxc6. Black does not take back: he plays Bg5, attacking the rook.',
      reply: 'Bg5',
    },
  })
  .step({
    id: 'why-not', title: 'Why Black cannot take',
    source: 'He cannot take the Kt because White threatens mate by Q x P ch followed by R - R 3 ch.',
    narration: [
      { say: 'Why did Black not take the knight? Because of the idea from the last lesson.' },
      { say: 'Queen takes h7, check, then rook to h3, check, and mate.', arrows: [{ from: 'h3', to: 'h7', color: 'danger' }, { from: 'e3', to: 'h3', color: 'danger' }] },
      { say: 'Now Black\'s bishop attacks the rook on e3. White has a strong reply.', arrows: [{ from: 'g5', to: 'e3', color: 'warning' }] },
    ],
    exercise: {
      prompt: 'White to move. Use the knight with check.',
      accept: ['Ne7+'],
      feedback: { '*': 'The knight gives check.' },
      hint: 'The knight jumps to e7.',
      hintSquares: ['e7'],
      success: '2. Ne7, check. Black takes with the queen.',
      reply: 'Qxe7',
    },
  })
  .step({
    id: 'fork', title: 'Your turn: the double attack',
    source: '3 R x Q, B x R; 4 Q - Q 7 and White wins one of the two Bishops.',
    narration: [
      { say: 'Rook takes the queen, bishop takes the rook.', moves: ['Rxe7', 'Bxe7'] },
      { say: 'Now one queen move attacks both black bishops.', highlights: ['b7', 'e7'] },
    ],
    exercise: {
      prompt: 'White to move. Attack both bishops at once.',
      accept: ['Qd7'],
      feedback: { '*': 'Find a square from which the queen attacks b7 and e7.' },
      hint: 'The queen goes to the seventh rank.',
      hintSquares: ['d7'],
      success: '4. Qd7. White wins a bishop, and with queen and bishop against rook and bishop he should win easily.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'These two examples show the danger of advancing the K Kt P one square, after having Castled on that side.',
    narration: [
      { say: 'These two examples show a danger: after castling, advancing the knight\'s pawn one square weakens the king.', highlights: ['g6', 'g7', 'h7'] },
      { say: 'A threat of mate can be used to win material.' },
    ],
  })
  .save(OUT + '012-win-back-piece.json');

// ------------------------------------------------------------------ 013  Example 13
lesson('013-knight-check-f6', 'The Knight Check on f6', 'Opening the king with a sacrifice', '§4 Some Winning Positions in the Middle-game', 13, '2q2rk1/1b3ppp/pp6/2p5/2P1N3/PP1Q4/1B3PPP/6K1 w - - 0 1')
  .step({
    id: 'intro', title: 'Compensation, immediately',
    source: 'Black has a R for a Kt and should therefore win, unless White is able to obtain some compensation immediately. White, in fact, mates in a few moves.',
    narration: [
      { say: 'Black is a rook for a knight ahead, and should win.' },
      { say: 'Unless White can do something right now. Look at the bishop on b2, aiming at the black king.', arrows: [{ from: 'b2', to: 'g7', color: 'primary' }] },
    ],
  })
  .step({
    id: 'nf6', title: 'Your turn: the knight check',
    narration: [{ say: 'Your move. Give check with the knight.' }],
    exercise: {
      prompt: 'White to move. Give a knight check.',
      accept: ['Nf6+'],
      feedback: { '*': 'The knight can give check from f6.' },
      hint: 'The knight goes to f6.',
      hintSquares: ['f6'],
      success: '1. Nf6, check. Black must take.',
      reply: 'gxf6',
    },
  })
  .step({
    id: 'qg3', title: 'Your turn: the open file',
    source: 'Forced, otherwise Q x P mates.',
    narration: [
      { say: 'The capture was forced: otherwise queen takes h7 mates.' },
      { say: 'Now the g-file is open. Check the king.', highlights: ['g7', 'g8'] },
    ],
    exercise: {
      prompt: 'White to move. Check along the g-file.',
      accept: ['Qg3+'],
      feedback: { '*': 'The queen can check on the g-file.' },
      hint: 'The queen goes to g3.',
      hintSquares: ['g3'],
      success: '2. Qg3, check. Black goes to h8.',
      reply: 'Kh8',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'The bishop finishes it.' }],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Bxf6#'],
      feedback: { '*': 'The bishop on the long diagonal can take with check.' },
      hint: 'The bishop takes on f6.',
      hintSquares: ['f6'],
      success: 'Checkmate. Queen on the g-file, bishop on the long diagonal.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'A knight check on f6 can tear open the king\'s position.' },
      { say: 'Then queen and bishop combine along the open file and the long diagonal.' },
    ],
  })
  .save(OUT + '013-knight-check-f6.json');

// ------------------------------------------------------------------ 014  Example 14
lesson('014-knight-f6-again', 'The Knight Check, Again', 'Removing a defender first', '§4 Some Winning Positions in the Middle-game', 14, '2q1rrk1/1bpn1ppp/pp1p4/1B6/4N3/1P1QR3/PBP2PPP/6K1 w - - 0 1')
  .step({
    id: 'intro', title: 'The same idea, better hidden',
    narration: [
      { say: 'The same type of combination, in a more complicated form.' },
      { say: 'The knight wants to go to f6, but the black knight on d7 guards that square.', highlights: ['f6', 'd7'] },
    ],
  })
  .step({
    id: 'remove', title: 'Your turn: remove the guard',
    source: '1. B x Kt, Q x B. If …B x Kt; Q - B 3 threatens mate, and therefore wins the Q, which is already attacked.',
    narration: [{ say: 'Your move. Get rid of the defender of f6.' }],
    exercise: {
      prompt: 'White to move. Remove the knight that guards f6.',
      accept: ['Bxd7'],
      feedback: { '*': 'The bishop on b5 can take the knight on d7.' },
      hint: 'The bishop takes on d7.',
      hintSquares: ['d7'],
      success: '1. Bxd7. Black takes back with the queen.',
      reply: 'Qxd7',
    },
  })
  .step({
    id: 'why', title: 'Why not the other capture?',
    narration: [
      { say: 'If Black had taken the knight on e4 instead, queen to c3 would threaten mate on g7.', arrows: [{ from: 'd3', to: 'c3', color: 'muted' }, { from: 'c3', to: 'g7', color: 'danger' }] },
      { say: 'And the black queen was already attacked, so Black would lose it.' },
      { say: 'Now, the knight check.' },
    ],
    exercise: {
      prompt: 'White to move. Give the knight check.',
      accept: ['Nf6+'],
      feedback: { '*': 'Now nothing guards f6.' },
      hint: 'The knight goes to f6.',
      hintSquares: ['f6'],
      success: '2. Nf6, check. Black must take.',
      reply: 'gxf6',
    },
  })
  .step({
    id: 'rook', title: 'Your turn: the rook check',
    narration: [{ say: 'This time it is the rook that uses the open g-file.' }],
    exercise: {
      prompt: 'White to move. Check along the g-file.',
      accept: ['Rg3+'],
      feedback: { '*': 'The rook swings to the g-file with check.' },
      hint: 'The rook goes to g3.',
      hintSquares: ['g3'],
      success: '3. Rg3, check. Black goes to h8.',
      reply: 'Kh8',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'And the bishop mates.' }],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Bxf6#'],
      feedback: { '*': 'The bishop on b2 takes with check.' },
      hint: 'The bishop takes on f6.',
      hintSquares: ['f6'],
      success: 'Checkmate.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'When a key square is guarded, first remove the guard.' },
      { say: 'Recognising a pattern lets you find combinations in more complicated positions.' },
    ],
  })
  .save(OUT + '014-knight-f6-again.json');

// ------------------------------------------------------------------ 015  Example 15
{
  const F = 'r3qrk1/1pp2ppp/p1np4/3Q4/8/P2B1N2/1PP2PPP/3R2K1 w - - 0 1';
  lesson('015-bishop-sacrifice-h7', 'The Bishop Sacrifice on h7', 'A very frequent combination', '§4 Some Winning Positions in the Middle-game', 15, F)
    .step({
      id: 'intro', title: 'A very frequent combination',
      source: 'A very frequent type of combination is shown in the following position. Here White is the exchange and a Pawn behind, but he can win quickly.',
      narration: [
        { say: 'A very frequent type of combination.' },
        { say: 'White is the exchange and a pawn behind. But look at the bishop on d3, aiming at h7.', arrows: [{ from: 'd3', to: 'h7', color: 'primary' }] },
      ],
    })
    .step({
      id: 'sac', title: 'Your turn: the sacrifice',
      narration: [{ say: 'Your move. Sacrifice the bishop.' }],
      exercise: {
        prompt: 'White to move. Sacrifice the bishop with check.',
        accept: ['Bxh7+'],
        feedback: { '*': 'The bishop takes the pawn in front of the king.' },
        hint: 'The bishop takes on h7.',
        hintSquares: ['h7'],
        success: '1. Bxh7, check. Black takes.',
        reply: 'Kxh7',
      },
    })
    .step({
      id: 'qh5', title: 'Your turn: the queen check',
      narration: [{ say: 'Now bring the queen with check.' }],
      exercise: {
        prompt: 'White to move. Check with the queen.',
        accept: ['Qh5+'],
        feedback: { '*': 'The queen checks on the h-file.' },
        hint: 'The queen goes to h5.',
        hintSquares: ['h5'],
        success: '2. Qh5, check. Black goes back to g8.',
        reply: 'Kg8',
      },
    })
    .step({
      id: 'ng5', title: 'Your turn: the knight joins',
      source: '3 Kt - Kt 5, and Black cannot stop mate at K R 7 except by sacrificing the Queen by Q - K 5, which would leave White with a Q for a R.',
      narration: [{ say: 'Queen on h5. One more piece, and h7 falls.' }],
      exercise: {
        prompt: 'White to move. Bring the knight to support the queen.',
        accept: ['Ng5'],
        feedback: { '*': 'The knight goes where it supports h7.' },
        hint: 'The knight jumps to g5.',
        hintSquares: ['g5'],
        success: '3. Ng5. Black cannot stop mate on h7, except by giving up his queen with Qe4.',
        reply: 'Qe4',
      },
    })
    .step({
      id: 'result', title: 'A queen for a rook',
      narration: [
        { say: 'The knight takes the queen.', move: 'Nxe4', highlights: ['e4'] },
        { say: 'White now has a queen against a rook, and should win easily.' },
      ],
    })
    .step({
      id: 'variation', fen: F, title: 'If Black does not take',
      source: '(If 1…K - R 1; 2 Q - K R 5, P - K Kt 3; 3 Q - R 6, and wins.)',
      narration: [
        { say: 'And if Black does not take the bishop?', move: 'Bxh7+' },
        { say: 'King to h8. Then queen to h5.', moves: ['Kh8', 'Qh5'] },
        { say: 'Black blocks with g6, and queen to h6 wins.', moves: ['g6', 'Qh6'], highlights: ['h6', 'h7', 'g6'] },
      ],
    })
    .step({
      id: 'summary', title: 'What we learned',
      narration: [
        { say: 'Bishop takes h7 check, queen to h5 check, knight to g5: remember this pattern.' },
        { say: 'It works when the bishop, queen and knight can all reach the king\'s side quickly.' },
      ],
    })
    .save(OUT + '015-bishop-sacrifice-h7.json');
}

// ------------------------------------------------------------------ 016  Example 16
lesson('016-long-attack', 'A Long Attack', 'The bishop sacrifice, more complicated', '§4 Some Winning Positions in the Middle-game', 16, '2nb1rk1/1pqrnppp/p2p4/2pQ1N2/6P1/1P1B1N1P/P3RP2/3R2K1 w - - 0 1')
  .step({
    id: 'intro', title: 'The same pattern, well hidden',
    narration: [
      { say: 'The same type of combination, in a more complicated form.' },
      { say: 'The bishop on d3 aims at h7, but the knight on f5 is in the way.', arrows: [{ from: 'd3', to: 'h7', color: 'muted' }], highlights: ['f5'] },
    ],
  })
  .step({
    id: 'clear', title: 'Clearing the line',
    source: '1 Kt x Kt ch (this clears the line for the B); B x Kt (to stop the Kt from moving to Kt 5 after the sacrifice of the B).',
    narration: [
      { say: 'Knight takes on e7, check. This clears the line for the bishop.', move: 'Nxe7+', arrows: [{ from: 'd3', to: 'h7', color: 'primary' }] },
      { say: 'Bishop takes back. It will stop the other knight from going to g5 later.', move: 'Bxe7', highlights: ['g5'] },
    ],
    exercise: {
      prompt: 'White to move. Remove the bishop that guards g5.',
      accept: ['Rxe7'],
      feedback: { '*': 'The rook on e2 can take the bishop.' },
      hint: 'The rook takes on e7.',
      hintSquares: ['e7'],
      success: '2. Rxe7. Black\'s best is to take with the knight.',
      reply: 'Nxe7',
    },
  })
  .step({
    id: 'sac', title: 'Your turn: the sacrifice',
    narration: [{ say: 'Now the familiar sacrifice.' }],
    exercise: {
      prompt: 'White to move. Sacrifice the bishop.',
      accept: ['Bxh7+'],
      feedback: { '*': 'The bishop takes on h7 with check.' },
      hint: 'The bishop takes on h7.',
      hintSquares: ['h7'],
      success: '3. Bxh7, check. Black takes.',
      reply: 'Kxh7',
    },
  })
  .step({
    id: 'qh5', title: 'Your turn: queen check',
    narration: [{ say: 'The queen comes in, with check.' }],
    exercise: {
      prompt: 'White to move. Check with the queen.',
      accept: ['Qh5+'],
      feedback: { '*': 'The queen checks on the h-file.' },
      hint: 'The queen goes to h5.',
      hintSquares: ['h5'],
      success: '4. Qh5, check. Black goes to g8.',
      reply: 'Kg8',
    },
  })
  .step({
    id: 'ng5', title: 'Your turn: the knight',
    narration: [{ say: 'And the knight joins, threatening mate on h7.' }],
    exercise: {
      prompt: 'White to move. Threaten mate on h7.',
      accept: ['Ng5'],
      feedback: { '*': 'The knight supports the queen on h7.' },
      hint: 'The knight jumps to g5.',
      hintSquares: ['g5'],
      success: '5. Ng5. Black moves his rook to c8, to make room for the king on f8.',
      reply: 'Rc8',
    },
  })
  .step({
    id: 'chase', title: 'The king hunt',
    narration: [
      { say: 'Queen to h7, check. The king runs to f8.', moves: ['Qh7+', 'Kf8'] },
      { say: 'Queen to h8, check. The knight blocks on g8.', moves: ['Qh8+', 'Ng8'] },
      { say: 'Knight to h7, check. The king goes to e7.', moves: ['Nh7+', 'Ke7'] },
      { say: 'Rook to e1, check. The king goes to d8.', moves: ['Re1+', 'Kd8'] },
    ],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Qxg8#'],
      feedback: { '*': 'The queen can take a piece with mate.' },
      hint: 'The queen takes the knight on g8.',
      hintSquares: ['g8'],
      success: 'Checkmate, in ten moves.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'It will be seen that all the combinations shown have for a foundation the proper co-ordination of the pieces, which have all been brought to bear against a weak point.',
    narration: [
      { say: 'This combination is long, and a beginner could hardly calculate it all.' },
      { say: 'But knowing the type of combination, you might find a brilliant attack you would otherwise never think of.' },
      { say: 'All these combinations rest on the co-ordination of the pieces against a weak point.' },
    ],
  })
  .save(OUT + '016-long-attack.json');

// ------------------------------------------------------------------ 017  §5 Relative value
{
  const a = new Author({
    id: '017-relative-value', title: 'The Value of the Pieces', subtitle: 'Comparing the pieces',
    source: SRC('§5 Relative Value of the Pieces', null), startFen: '7k/8/8/3n4/8/2B5/8/K7 w - - 0 1',
  });
  a.step({
    id: 'bn', title: 'Bishop and knight',
    source: 'For all general theoretical purposes the Bishop and the Knight have to be considered as of the same value, though it is my opinion that the Bishop will prove the more valuable piece in most cases.',
    narration: [
      { say: 'In theory, the bishop and the knight are worth the same.' },
      { say: 'The bishop sweeps long diagonals.', highlights: a.reach('c3') },
      { say: 'The knight jumps to a few nearby squares.', highlights: a.reach('d5') },
      { say: 'Capablanca\'s opinion: in most cases the bishop proves more valuable.' },
    ],
  });
  a.step({
    id: 'two-bishops', fen: '1n4nk/8/8/8/8/8/8/K1B2B2 w - - 0 1', title: 'Two bishops',
    source: 'It is well known that two Bishops are almost always better than two Knights.',
    narration: [
      { say: 'Two bishops are almost always better than two knights.', highlights: ['c1', 'f1', 'b8', 'g8'] },
      { say: 'Together they cover both colours, from far away.' },
    ],
  });
  a.step({
    id: 'pawns', fen: '7k/8/8/1pp5/8/5B2/8/K7 w - - 0 1', title: 'Against pawns',
    source: 'The Bishop will be stronger against Pawns than the Knight. […] A Bishop will often be worth more than three Pawns, but a Knight very seldom so.',
    narration: [
      { say: 'Against pawns, the bishop is stronger than the knight: it can stop them from a distance.', arrows: [{ from: 'f3', to: 'c6', color: 'primary' }], highlights: ['b5', 'c5'] },
      { say: 'A bishop is often worth more than three pawns. A knight very seldom.' },
    ],
  });
  a.step({
    id: 'rook', fen: '7k/8/8/8/8/8/1ppn4/K6R w - - 0 1', title: 'The rook',
    source: 'A Rook will be worth a Knight and two Pawns, or a Bishop and two Pawns.',
    narration: [
      { say: 'A rook is worth a knight and two pawns, or a bishop and two pawns.', highlights: ['h1', 'b2', 'c2', 'd2'] },
      { say: 'Two rooks are slightly stronger than a queen.' },
      { say: 'And the rook grows stronger as pieces are exchanged, while the knight grows weaker.' },
    ],
  });
  a.step({
    id: 'king', fen: '8/8/3k4/8/4K3/8/8/8 w - - 0 1', title: 'The king changes role',
    source: 'The King, a purely defensive piece throughout the middle-game, becomes an offensive piece once all the pieces are off the board. […] The handling of the King becomes of paramount importance once the end-game stage is reached.',
    narration: [
      { say: 'In the middle-game, the king is a purely defensive piece.' },
      { say: 'In the ending, it becomes an attacking piece. You saw it in every pawn ending so far.', highlights: ['e4', 'd6'] },
      { say: 'Its handling becomes of paramount importance once the ending is reached.' },
    ],
  });
  a.save(OUT + '017-relative-value.json');
}

// ------------------------------------------------------------------ 018  Example 17
lesson('018-develop-quickly', 'Develop Quickly', 'General strategy of the opening', '§6 General Strategy of the Opening', 17, START)
  .step({
    id: 'intro', title: 'The main thing',
    source: 'The main thing is to develop the pieces quickly. Get them into play as fast as you can. From the outset two moves, 1 P - K 4 or 1 P - Q 4, open up lines for the Queen and a Bishop.',
    narration: [
      { say: 'The main thing in the opening is to develop the pieces quickly.' },
      { say: 'Two first moves, e4 and d4, open lines for the queen and a bishop at once.', highlights: ['e2', 'd2'] },
      { say: 'Your move. Play e4.' },
    ],
    exercise: {
      prompt: 'White to move. Open lines for the queen and the king\'s bishop.',
      accept: ['e4'],
      feedback: {
        d4: 'Just as good in principle, but this example follows e4.',
        e3: 'That opens lines too, but e4 also takes the centre.',
        '*': 'Push the king\'s pawn two squares.',
      },
      hint: 'The pawn in front of the king goes two squares.',
      hintSquares: ['e4'],
      success: '1. e4. Black answers e5.',
      reply: 'e5',
    },
  })
  .step({
    id: 'knights', title: 'Knights out',
    narration: [
      { say: 'Knight to f3: both an attacking and a developing move. It attacks e5.', move: 'Nf3', arrows: [{ from: 'f3', to: 'e5', color: 'danger' }] },
      { say: 'Knight to c6 develops, and at the same time defends the pawn.', move: 'Nc6', arrows: [{ from: 'c6', to: 'e5', color: 'primary' }] },
      { say: 'Knight to c3, knight to f6: purely developing moves.', moves: ['Nc3', 'Nf6'] },
    ],
  })
  .step({
    id: 'bishop', title: 'Your turn: develop and attack',
    source: 'It is generally advisable not to bring this Bishop out until one Knight is out, preferably the King\'s Knight. The Bishop could also have been played to B 4, but it is advisable whenever possible to combine development and attack.',
    narration: [{ say: 'Now a bishop. Whenever possible, combine development with attack.' }],
    exercise: {
      prompt: 'White to move. Develop the king\'s bishop with an attack.',
      accept: ['Bb5'],
      feedback: {
        Bc4: 'A good developing move, but b5 also attacks the knight that defends e5.',
        '*': 'Develop the bishop so that it attacks something.',
      },
      hint: 'The bishop attacks the knight on c6.',
      hintSquares: ['b5'],
      success: '4. Bb5. Black does the same: Bb4.',
      reply: 'Bb4',
    },
  })
  .step({
    id: 'castle', title: 'Castling brings the rook in',
    source: '5 O - O, an indirect way of preventing 5…B x Kt. […] At the same time the Rook is brought into action in the centre, a very important point.',
    narration: [
      { say: 'White castles. This indirectly prevents Bxc3, and brings the rook into the centre.', move: 'O-O', highlights: ['f1', 'g1'] },
      { say: 'Black follows the same reasoning.', move: 'O-O' },
      { say: 'Pawn to d3, pawn to d6: they protect the e-pawns and open the diagonals for the queen\'s bishops.', moves: ['d3', 'd6'], arrows: [{ from: 'c1', to: 'g5', color: 'primary' }] },
    ],
  })
  .step({
    id: 'bg5', title: 'Your turn: a very powerful move',
    narration: [{ say: 'Develop the last minor piece, with a pin.' }],
    exercise: {
      prompt: 'White to move. Develop the queen\'s bishop with a pin.',
      accept: ['Bg5'],
      feedback: { '*': 'The bishop on c1 can pin the knight on f6.' },
      hint: 'The bishop goes to g5.',
      hintSquares: ['g5'],
      success: '7. Bg5. A very powerful move: White already threatens Nd5. Black is forced to take on c3.',
      reply: 'Bxc3',
    },
  })
  .step({
    id: 'result', title: 'Seven moves of development',
    source: 'First, the complete development of the opening has taken only seven moves. […] Third, White by the exchange brings up a Pawn to control the square Q 4, puts Black on the defensive, and thus keeps the initiative.',
    narration: [
      { say: 'The complete development has taken only seven moves.' },
      { say: 'White takes back towards the centre. The doubled pawn is no problem this early.', move: 'bxc3', highlights: ['c3', 'd4'] },
      { say: 'The new pawn controls d4, Black is on the defensive, and White keeps the initiative.' },
    ],
  })
  .step({
    id: 'summary', title: 'Principles of the opening',
    source: 'Before development has been completed no piece should be moved more than once, unless it is essential in order to obtain either material advantage or to secure freedom of action.',
    narration: [
      { say: 'Develop the pieces quickly.' },
      { say: 'Bring out the knights before the bishops.' },
      { say: 'And before development is complete, do not move a piece twice, unless you win material or need freedom of action.' },
    ],
  })
  .save(OUT + '018-develop-quickly.json');

// ------------------------------------------------------------------ 019  Example 18
lesson('019-control-centre', 'Control of the Centre', 'Pieces before pawns', '§7 Control of the Centre', 18, START)
  .step({
    id: 'intro', title: 'The four centre squares',
    source: 'The four squares, K 4 and Q 4 on each side respectively, are the centre squares, and control of these squares is called control of the centre. The control of the centre is of great importance.',
    narration: [
      { say: 'These four squares are the centre.', zone: { squares: ['d4', 'e4', 'd5', 'e5'], color: 'primary' } },
      { say: 'No violent attack can succeed without controlling at least two of them.', zone: { squares: ['d4', 'e4', 'd5', 'e5'], color: 'primary' } },
    ],
  })
  .step({
    id: 'timid', title: 'A timid move',
    source: 'A timid move. Black assumes a defensive attitude at once. On principle the move is wrong. In the openings, whenever possible, pieces should be moved in preference to Pawns.',
    narration: [
      { say: 'Pawn to e4, pawn to e5. Knight to f3.', moves: ['e4', 'e5', 'Nf3'] },
      { say: 'Black plays d6. A timid move: in the opening, pieces should be moved in preference to pawns.', move: 'd6' },
    ],
    exercise: {
      prompt: 'White to move. Take the offensive in the centre.',
      accept: ['d4'],
      feedback: { '*': 'Strike in the centre with a pawn.' },
      hint: 'The queen\'s pawn goes two squares.',
      hintSquares: ['d4'],
      success: '3. d4. White strives to control the centre. Black defends e5 with Nd7.',
      reply: 'Nd7',
    },
  })
  .step({
    id: 'cramped', title: 'A cramped position',
    source: 'On principle the move is wrong, because it blocks the action of the Queen\'s Bishop, and instead of facilitating the action of Black\'s pieces, tends, on the contrary, to cramp them.',
    narration: [
      { say: 'The knight on d7 blocks Black\'s own bishop.', highlights: ['d7', 'c8'] },
      { say: 'Bishop to c4. White threatens knight to g5, attacking f7.', move: 'Bc4', arrows: [{ from: 'f3', to: 'g5', color: 'danger' }, { from: 'c4', to: 'f7', color: 'danger' }] },
      { say: 'Black must play h6, paying the penalty for his previous move.', move: 'h6' },
    ],
  })
  .step({
    id: 'deploy', title: 'Deploy first, castle later',
    source: 'It should be noticed that White does not Castle yet. The reason is that he wants to deploy his forces first.',
    narration: [
      { say: 'Knights out on both sides.', moves: ['Nc3', 'Ngf6'] },
      { say: 'Bishop to e3, bishop to e7.', moves: ['Be3', 'Be7'] },
      { say: 'Queen to e2. White does not castle yet: he wants to deploy his forces first.', move: 'Qe2' },
      { say: 'Black makes room for his queen with c6. Rook to d1, queen to c7.', moves: ['c6', 'Rd1', 'Qc7'], highlights: ['d1'] },
    ],
  })
  .step({
    id: 'castle', title: 'Your turn: complete development',
    narration: [{ say: 'One move completes White\'s development.' }],
    exercise: {
      prompt: 'White to move. Complete your development.',
      accept: ['O-O'],
      feedback: { '*': 'The king is still in the centre.' },
      hint: 'Castle. Drag the king two squares to the right.',
      hintSquares: ['g1'],
      success: '9. O-O. White\'s position is unassailable: no weak spots, and every piece ready for action.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'The student should carefully study this example. It will show him that it is sometimes convenient to delay Castling.',
    narration: [
      { say: 'Control of the centre ensures the initiative.' },
      { say: 'Move pieces in preference to pawns, and do not block your own pieces.' },
      { say: 'And sometimes it is convenient to delay castling.' },
    ],
  })
  .save(OUT + '019-control-centre.json');

// ------------------------------------------------------------------ 020  Example 19
lesson('020-early-bishop', 'An Early Bishop Move', 'Knights before bishops', '§7 Control of the Centre', 19, START)
  .step({
    id: 'bad', title: 'A bad move',
    source: 'A bad move, which violates one of the principles set down, according to which at least one Knight should be developed before the Bishops are brought out, and also because it exchanges a Bishop for a Knight, which in the opening is generally bad, unless there is some compensation.',
    narration: [
      { say: 'e4, e5. Knight to f3, pawn to d6. Pawn to d4.', moves: ['e4', 'e5', 'Nf3', 'd6', 'd4'] },
      { say: 'Black plays bishop to g4: a bad move. No knight is out yet.', move: 'Bg4', highlights: ['b8', 'g8'] },
    ],
    exercise: {
      prompt: 'White to move. Open the centre.',
      accept: ['dxe5'],
      feedback: { '*': 'Take a pawn in the centre.' },
      hint: 'The d-pawn takes.',
      hintSquares: ['e5'],
      success: '4. dxe5. If Black takes back with the pawn, he loses a pawn. So Bxf3.',
      reply: 'Bxf3',
    },
  })
  .step({
    id: 'recapture', title: 'Your turn: recapture',
    narration: [{ say: 'Take back. Choose the capture that also develops a piece.' }],
    exercise: {
      prompt: 'White to move. Recapture on f3.',
      accept: ['Qxf3'],
      feedback: { gxf3: 'That ruins your pawns. Recapture with a piece that gets developed.', '*': 'Take back on f3.' },
      hint: 'The queen takes.',
      hintSquares: ['f3'],
      success: '5. Qxf3. Black takes on e5.',
      reply: 'dxe5',
    },
  })
  .step({
    id: 'pressure', title: 'White is ahead in development',
    source: 'Black, however, has no pieces out except his Queen, and White, with a Bishop and a Knight already developed, has a chance of obtaining an advantage quickly by playing Kt - Q 5 anyway.',
    narration: [
      { say: 'Bishop to c4, aiming at f7. Black defends with Qf6.', moves: ['Bc4', 'Qf6'], arrows: [{ from: 'c4', to: 'f7', color: 'danger' }] },
      { say: 'Queen to b3, double attack on b7 and f7. Black plays b6.', moves: ['Qb3', 'b6'], arrows: [{ from: 'b3', to: 'b7', color: 'danger' }, { from: 'b3', to: 'f7', color: 'danger' }] },
      { say: 'Knight to c3. Black plays c6, to prevent Nd5.', moves: ['Nc3', 'c6'] },
      { say: 'Black has only his queen out. White can already think about Nd5 anyway.', arrows: [{ from: 'c3', to: 'd5', color: 'primary' }], highlights: ['b8', 'g8', 'f8'] },
    ],
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'The student is warned against playing Pawns in preference to pieces at the beginning of the game, especially P - K R 3 and P - Q R 3, which are moves very commonly indulged in by beginners.',
    narration: [
      { say: 'Develop at least one knight before the bishops.' },
      { say: 'Do not exchange a bishop for a knight early without compensation.' },
      { say: 'And avoid pawn moves like h3 and a3 at the beginning, so common among beginners.' },
    ],
  })
  .save(OUT + '020-early-bishop.json');

// ------------------------------------------------------------------ 021  Example 20
lesson('021-trap-queen-sac', 'A Classic Trap', 'The pinned knight that is not pinned', '§8 Traps', 20, 'r2qkbnr/ppp2pp1/2np3p/4p3/2BPP1b1/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 1')
  .step({
    id: 'intro', title: 'Traps in the opening',
    source: 'I shall now give a few positions or traps to be avoided in the openings, and in which (practice has shown) beginners are often caught.',
    narration: [
      { say: 'Now some traps that beginners often fall into.' },
      { say: 'The black bishop on g4 pins the knight on f3 to the white queen. Or does it?', arrows: [{ from: 'g4', to: 'd1', color: 'danger' }] },
    ],
    exercise: {
      prompt: 'White to move. Start by taking in the centre.',
      accept: ['dxe5'],
      feedback: { '*': 'Take the pawn on e5.' },
      hint: 'The d-pawn takes.',
      hintSquares: ['e5'],
      success: '1. dxe5. Black takes back with the knight. He should have taken with the pawn.',
      reply: 'Nxe5',
    },
  })
  .step({
    id: 'sac', title: 'Your turn: give up the queen',
    narration: [{ say: 'The knight on f3 is pinned to the queen. Move it anyway.' }],
    exercise: {
      prompt: 'White to move. Ignore the pin.',
      accept: ['Nxe5'],
      feedback: { '*': 'The "pinned" knight can take on e5.' },
      hint: 'The f3 knight takes the knight on e5.',
      hintSquares: ['e5'],
      success: '2. Nxe5! Black takes the queen.',
      reply: 'Bxd1',
    },
  })
  .step({
    id: 'check', title: 'Your turn: check',
    narration: [{ say: 'Now punish Black.' }],
    exercise: {
      prompt: 'White to move. Check with the bishop.',
      accept: ['Bxf7+'],
      feedback: { '*': 'The bishop on c4 can take on f7 with check.' },
      hint: 'The bishop takes on f7.',
      hintSquares: ['f7'],
      success: '3. Bxf7, check. Black must go to e7.',
      reply: 'Ke7',
    },
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'The last knight finishes it.' }],
    exercise: {
      prompt: 'White to move and give checkmate in one.',
      accept: ['Nd5#'],
      feedback: { '*': 'The knight on c3 can give mate.' },
      hint: 'The knight jumps to d5.',
      hintSquares: ['d5'],
      success: 'Checkmate, with three minor pieces against the whole black army.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    narration: [
      { say: 'A pin to the queen is not absolute: the pinned piece can still move.' },
      { say: 'Black should have recaptured with the pawn.' },
    ],
  })
  .save(OUT + '021-trap-queen-sac.json');

// ------------------------------------------------------------------ 022  Example 21
lesson('022-trap-f7', 'The Weak Point f7', 'Take the material', '§8 Traps', 21, 'rn1qkbnr/ppp1pppp/8/8/2B3b1/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 0 1')
  .step({
    id: 'intro', title: 'Black should play e6',
    source: 'Black, having the move, should play P - K 3. But suppose he plays Kt - K B 3 instead.',
    narration: [
      { say: 'Black to move. He should play e6, protecting f7 and freeing his bishop.', highlights: ['e7', 'f7'] },
      { say: 'Suppose he plays knight to f6 instead.', move: 'Nf6' },
    ],
    exercise: {
      prompt: 'White to move. Win material at once.',
      accept: ['Bxf7+'],
      feedback: {
        Ne5: 'Ne5 also gives White the advantage, but Bxf7 wins material immediately.',
        '*': 'f7 is only defended by the king.',
      },
      hint: 'The bishop takes on f7.',
      hintSquares: ['f7'],
      success: '1. Bxf7, check. Black takes.',
      reply: 'Kxf7',
    },
  })
  .step({
    id: 'fork', title: 'Your turn: the knight check',
    narration: [{ say: 'Now a knight check that also attacks the bishop on g4.' }],
    exercise: {
      prompt: 'White to move. Check, and attack the bishop.',
      accept: ['Ne5+'],
      feedback: { '*': 'The knight on f3 can give check.' },
      hint: 'The knight jumps to e5.',
      hintSquares: ['e5'],
      success: '2. Ne5, check. The king moves.',
      reply: 'Ke8',
    },
  })
  .step({
    id: 'take', title: 'Your turn: collect',
    narration: [{ say: 'Take what you attacked.' }],
    exercise: {
      prompt: 'White to move. Win the bishop back.',
      accept: ['Nxg4'],
      feedback: { '*': 'The knight takes the bishop on g4.' },
      hint: 'The knight takes on g4.',
      hintSquares: ['g4'],
      success: '3. Nxg4. White has won a pawn, and has the better position.',
      reply: null,
    },
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'The beginner at any rate should never miss such an opportunity for the sake of a speculative advantage in position.',
    narration: [
      { say: 'f7 is the weakest point in the black camp at the start of the game.' },
      { say: 'A beginner should never miss a sure material gain for the sake of a speculative advantage.' },
    ],
  })
  .save(OUT + '022-trap-f7.json');
