// build-chapter2.mjs — Chapter II, Further Principles in End-game Play (Examples 22–42).
//   node tools/build-chapter2.mjs
// Positions cross-checked: 1921 scan, lordlinks LaTeX edition, haussbrandt FEN list.
import { Author } from './author.mjs';

const SRC = (section, examples) => ({
  work: 'Chess Fundamentals',
  author: 'José Raúl Capablanca',
  year: 1921,
  section: `Chapter II, ${section}, Example${String(examples).includes('–') ? 's' : ''} ${examples}`,
  examples: String(examples),
  url: 'https://archive.org/details/chessfundamental00capa',
});
const OUT = new URL('../lessons/', import.meta.url).pathname;
const lesson = (id, title, subtitle, section, examples, startFen) =>
  new Author({ id, title, subtitle, source: SRC(section, examples), startFen });
const ex = (o) => ({ feedback: { '*': o.wrong || 'Not the move Capablanca shows here. Try again.' }, ...o });

// ------------------------------------------------------------------ 023  Example 22
lesson('023-unit-holds-two', 'A Unit that Holds Two', 'A cardinal principle', '§9 A Cardinal Principle', 22, '8/p5p1/7p/6k1/8/7K/PP5P/8 w - - 0 1')
  .step({
    id: 'intro', title: 'The free pawn',
    source: 'In the position shown above, White can draw by playing P - Kt 4, according to the general rule that governs such cases, i.e., to advance the Pawn that is free from opposition.',
    narration: [
      { say: 'Two pawns against one on the queen side.', highlights: ['a2', 'b2', 'a7'] },
      { say: 'White draws with b4: the rule from Chapter One, push the pawn that has no pawn opposing it.', arrows: [{ from: 'b2', to: 'b4', color: 'primary' }] },
      { say: 'But suppose White plays a4 instead.', move: 'a4' },
    ],
    exercise: ex({
      prompt: 'Black to move. Stop both white pawns with one.',
      accept: ['a5'],
      feedback: { a6: 'Close, but go further: with the pawn on a5, b4 can always be met by a capture.', '*': 'Use your a-pawn.' },
      hint: 'The black a-pawn goes two squares.',
      hintSquares: ['a5'],
      success: '1...a5. One black pawn now holds two white ones.',
      reply: 'Kg2',
    }),
  })
  .step({
    id: 'principle', title: 'One of the cardinal principles',
    source: 'Then Black can win by playing 1...P - Q R 4, applying one of the cardinal principles of the high strategy of chess: A unit that holds two. […] It constitutes one of the principal weapons in the hands of a master.',
    narration: [
      { say: 'A unit that holds two. It is one of the cardinal principles of chess strategy.', highlights: ['a5', 'a4', 'b2'] },
      { say: 'The white b-pawn can never pass freely. Now watch the main line.' },
      { say: 'The black king goes to f4. Best.', move: 'Kf4' },
      { say: 'Pawn to b4, and Black takes. Best.', moves: ['b4', 'axb4'] },
      { say: 'Both sides run: a5, b3; a6, b2; a7, b1 queen; a8 queen.', moves: ['a5', 'b3', 'a6', 'b2', 'a7', 'b1=Q', 'a8=Q'] },
    ],
    exercise: ex({
      prompt: 'Black to move. Both sides have a queen. Find the skewer.',
      accept: ['Qe4+'],
      wrong: 'Look for a check that also attacks the queen on a8, on the same line.',
      hint: 'The queen checks from e4, on the long diagonal.',
      hintSquares: ['e4'],
      success: '7...Qe4, check. The queens come off.',
      reply: 'Qxe4',
    }),
  })
  .step({
    id: 'result', title: 'A classical ending',
    source: 'This brings the game to a position which is won by Black, and which constitutes one of the classical endings of King and Pawns.',
    narration: [
      { say: 'The king takes back.', move: 'Kxe4' },
      { say: 'This king and pawn ending is won for Black. It is one of the classical endings, and it is the next lesson.', highlights: ['g7', 'h6', 'h2'] },
    ],
  })
  .save(OUT + '023-unit-holds-two.json');

// ------------------------------------------------------------------ 024  Example 23
lesson('024-classical-ending', 'A Classical Ending', 'Winning in three parts', '§10 A Classical Ending', 23, '8/6p1/7p/8/4k3/8/6KP/8 w - - 0 1')
  .step({
    id: 'intro', title: 'A plan in three parts',
    source: 'In this position White\'s best line of defence consists in keeping his Pawn where it stands. As soon as the Pawn is advanced it becomes easier for Black to win. On the other hand, Black\'s plan to win may be divided into three parts.',
    narration: [
      { say: 'White\'s best defence is to leave his pawn on h2.', highlights: ['h2'] },
      { say: 'Black wins with a plan in three parts. Part one: bring the king to h3, keeping the pawns where they are.', arrows: [{ from: 'e4', to: 'h3', color: 'primary' }] },
      { say: 'This is all important: at the end, Black must be able to move his rear pawn one or two squares, as needed.', highlights: ['g7'] },
    ],
  })
  .step({
    id: 'part1', title: 'Part one: the king',
    narration: [
      { say: 'King to g3, king to e3. King back to g2.', moves: ['Kg3', 'Ke3', 'Kg2'] },
      { say: 'Black goes round: f4, then g5.', moves: ['Kf4', 'Kf2', 'Kg5'] },
      { say: 'Then h4, and h3.', moves: ['Kg2', 'Kh4', 'Kg1', 'Kh3'], highlights: ['h3'] },
      { say: 'The first part is completed.' },
    ],
  })
  .step({
    id: 'part2', title: 'Part two: the h-pawn',
    narration: [
      { say: 'Part two is short: the h-pawn advances.', moves: ['Kh1', 'h5', 'Kg1', 'h4'], highlights: ['h4'] },
      { say: 'Now the third part: timing the g-pawn, so that it reaches g3 when the white king is on h1.' },
      { say: 'White plays king to h1.', move: 'Kh1' },
    ],
    exercise: ex({
      prompt: 'Black to move. One square or two?',
      accept: ['g5'],
      feedback: { g6: 'Count: after g6 the pawn reaches g3 with the white king on g1, not h1.', '*': 'Move the g-pawn.' },
      hint: 'Two squares: the pawn must arrive on g3 when the king is on h1.',
      hintSquares: ['g5'],
      success: '8...g5. Now the timing is right.',
      reply: 'Kg1',
    }),
  })
  .step({
    id: 'part3', title: 'Part three: the timing',
    narration: [
      { say: 'Pawn to g4. King to h1.', moves: ['g4', 'Kh1'] },
    ],
    exercise: ex({
      prompt: 'Black to move. The white king is on h1: strike.',
      accept: ['g3'],
      hint: 'The g-pawn moves forward.',
      hintSquares: ['g3'],
      success: '10...g3. White takes.',
      reply: 'hxg3',
    }),
  })
  .step({
    id: 'finish', title: 'And wins',
    source: 'It is in this analytical way that the student should try to learn. He will thus train his mind to follow a logical sequence in reasoning out any position.',
    narration: [
      { say: 'Black takes back. King to g1, pawn to g2.', moves: ['hxg3', 'Kg1', 'g2'] },
      { say: 'King to f2, king to h2, and the pawn queens.', moves: ['Kf2', 'Kh2'], arrows: [{ from: 'g2', to: 'g1', color: 'primary' }] },
      { say: 'Divide the ending into stages, and find the main point of each one. That is how to learn.' },
    ],
  })
  .save(OUT + '024-classical-ending.json');

// ------------------------------------------------------------------ 025  Example 24
{
  const F = '8/ppp4k/8/PPP5/8/8/8/7K w - - 0 1';
  lesson('025-passed-pawn', 'Obtaining a Passed Pawn', 'The centre pawn breaks through', '§11 Obtaining a Passed Pawn', 24, F)
    .step({
      id: 'intro', title: 'Three against three',
      source: 'When three or more Pawns are opposed to each other in some such position, there is always a chance for one side or the other of obtaining a passed Pawn. In the following position the way of obtaining a passed Pawn is to advance the centre Pawn.',
      narration: [
        { say: 'Three pawns against three, with the kings far away.', highlights: ['a5', 'b5', 'c5', 'a7', 'b7', 'c7'] },
        { say: 'White can obtain a passed pawn by advancing the centre pawn. Your move.' },
      ],
      exercise: ex({
        prompt: 'White to move. Break through with the centre pawn.',
        accept: ['b6'],
        wrong: 'Push the pawn in the middle of the three.',
        hint: 'The b-pawn goes forward.',
        hintSquares: ['b6'],
        success: '1. b6. If cxb6, then a6 and the a-pawn is through. So Black plays axb6.',
        reply: 'axb6',
      }),
    })
    .step({
      id: 'second', title: 'Your turn: the second sacrifice',
      narration: [{ say: 'Sacrifice again.' }],
      exercise: ex({
        prompt: 'White to move. Give up another pawn.',
        accept: ['c6'],
        feedback: { a6: 'Black simply takes: bxa6. First c6, to draw the black pawns away.', '*': 'The c-pawn goes forward.' },
        hint: 'The c-pawn goes to c6.',
        hintSquares: ['c6'],
        success: '2. c6. Black takes.',
        reply: 'bxc6',
      }),
    })
    .step({
      id: 'through', title: 'Your turn: the passed pawn',
      narration: [{ say: 'Now the a-pawn is free.' }],
      exercise: ex({
        prompt: 'White to move. Run.',
        accept: ['a6'],
        hint: 'The a-pawn goes to a6.',
        hintSquares: ['a6'],
        success: '3. a6. This white pawn is nearer to queening than any black pawn. White wins.',
        reply: null,
      }),
    })
    .step({
      id: 'black', fen: '8/ppp4k/8/PPP5/8/8/8/7K b - - 0 1', title: 'If Black moves first',
      source: 'It would not be advisable to try to obtain a passed Pawn because the White Pawns would be nearer to Queen than the single Black Pawn. […] The game properly played would be a draw.',
      narration: [
        { say: 'If Black has the move, he should not try the same trick: the white pawns are nearer to queening.' },
        { say: 'Instead, Black plays b6, and the pawns are exchanged.', moves: ['b6', 'cxb6', 'cxb6', 'axb6', 'axb6'] },
        { say: 'Properly played, the game is a draw.', highlights: ['b5', 'b6'] },
      ],
    })
    .save(OUT + '025-passed-pawn.json');
}

// ------------------------------------------------------------------ 026  Example 25
lesson('026-counting', 'Which Pawn Queens First?', 'Learn to count', '§12 How to Find Out Which Pawn Will Be the First to Queen', 25, '8/p5kp/8/1P6/8/1K6/P7/8 w - - 0 1')
  .step({
    id: 'intro', title: 'Count',
    source: 'When two Pawns are free, or will be free, to advance to Queen, you can find out, by counting, which Pawn will be the first to succeed. In this position whoever moves first wins.',
    narration: [
      { say: 'Here, whoever moves first wins.' },
      { say: 'First, count: can either king catch the other side\'s passed pawn? No.', highlights: ['g7', 'b3'] },
      { say: 'Then count which pawn queens first. Your move.' },
    ],
    exercise: ex({
      prompt: 'White to move. Start the race.',
      accept: ['a4'],
      wrong: 'Your passed pawn will be the a-pawn, after b6.',
      hint: 'The a-pawn goes two squares.',
      hintSquares: ['a4'],
      success: '1. a4. Black runs too: h5.',
      reply: 'h5',
    }),
  })
  .step({
    id: 'race', title: 'The race',
    narration: [
      { say: 'Pawn to a5, pawn to h4.', moves: ['a5', 'h4'] },
      { say: 'Pawn to b6, and Black takes.', moves: ['b6', 'axb6'] },
      { say: 'Now a little calculation. White could take back, but should he?' },
    ],
    exercise: ex({
      prompt: 'White to move. Take, or push?',
      accept: ['a6'],
      feedback: { axb6: 'Then the new white queen appears on b8, which does not watch h1 where Black will queen.', '*': 'Look at your a-pawn.' },
      hint: 'Push the a-pawn: it will queen on a8, on the long diagonal to h1.',
      hintSquares: ['a6'],
      success: '4. a6. The queen will appear on a8, watching h1. Black runs: h3.',
      reply: 'h3',
    }),
  })
  .step({
    id: 'queen', title: 'The queen controls h1',
    narration: [
      { say: 'Pawn to a7, pawn to h2.', moves: ['a7', 'h2'] },
      { say: 'And a8 queen. When Black queens on h1, the new queen takes it.', move: 'a8=Q', arrows: [{ from: 'a8', to: 'h1', color: 'primary' }] },
      { say: 'A book cannot teach how to play by itself. It can only guide: acquire the habit of counting.' },
    ],
  })
  .save(OUT + '026-counting.json');

// ------------------------------------------------------------------ 027  Example 26
lesson('027-the-opposition', 'The Opposition', 'Kings face to face', '§13 The Opposition', 26, '8/8/4k3/1p5p/1P2K2P/8/8/8 w - - 0 1')
  .step({
    id: 'intro', title: 'Kings face to face',
    source: 'When Kings have to be moved, and one player can, by force, bring his King into a position similar to the one shown in the following diagram, so that his adversary is forced to move and make way, the player obtaining that advantage is said to have the opposition.',
    narration: [
      { say: 'The two kings face each other, with one square between them.', highlights: ['e4', 'e6'], zone: { squares: ['e5'], color: 'warning' } },
      { say: 'Whoever must move has to make way. The other player has the opposition.' },
      { say: 'Suppose White plays king to d4.', move: 'Kd4' },
      { say: 'Black can oppose the white king with Kd6, or pass with his own king to f5.', arrows: [{ from: 'e6', to: 'd6', color: 'primary' }, { from: 'e6', to: 'f5', color: 'muted' }] },
    ],
  })
  .step({
    id: 'diagonal', fen: '8/8/2k5/8/4K3/8/8/8 w - - 0 1', title: 'Diagonal opposition',
    narration: [
      { say: 'The same idea on a diagonal: the diagonal opposition.', highlights: ['e4', 'c6'], zone: { squares: ['d5'], color: 'warning' } },
    ],
  })
  .step({
    id: 'lateral', fen: '8/8/8/8/2k1K3/8/8/8 w - - 0 1', title: 'Lateral opposition',
    source: 'In practice they are all one and the same. The Kings are always on squares of the same colour, there is only one intervening square between the Kings, and the player who has moved last "has the opposition."',
    narration: [
      { say: 'And the lateral opposition.', highlights: ['e4', 'c4'], zone: { squares: ['d4'], color: 'warning' } },
      { say: 'In practice they are all the same: kings on squares of the same colour, one square between them.' },
      { say: 'And the player who moved last has the opposition.' },
    ],
  })
  .step({
    id: 'distant', fen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1', title: 'Distant opposition',
    source: 'In all simple forms of opposition, when the Kings are on the same line and the number of intervening squares between them is even, the player who has the move has the opposition.',
    narration: [
      { say: 'Move the kings back along the same line, and you have the distant opposition.', highlights: ['e1', 'e8'] },
      { say: 'The rule: when the kings are on the same line, and the number of squares between them is even, the player who has the move has the opposition.', zone: { squares: ['e2', 'e3', 'e4', 'e5', 'e6', 'e7'], color: 'warning' } },
    ],
  })
  .save(OUT + '027-the-opposition.json');

// ------------------------------------------------------------------ 028  Example 27
{
  const F = '4k3/8/8/1p5p/1P5P/8/8/4K3 w - - 0 1';
  lesson('028-opposition-wins', 'The Value of the Opposition', 'Whoever has the move wins', '§13 The Opposition', 27, F)
    .step({
      id: 'intro', title: 'It only looks even',
      source: 'Very little is left on the board, and the position, to a beginner, probably looks absolutely even. It is not the case, however. Whoever has the move wins.',
      narration: [
        { say: 'To a beginner this looks absolutely even. It is not: whoever has the move wins.' },
        { say: 'The kings face each other with six squares between them. Even: so the player to move has the opposition.', zone: { squares: ['e2', 'e3', 'e4', 'e5', 'e6', 'e7'], color: 'warning' } },
        { say: 'The proper way to begin is to move straight up.' },
      ],
      exercise: ex({
        prompt: 'White to move. Go straight up.',
        accept: ['Ke2'],
        wrong: 'Straight up the e-file.',
        hint: 'King to e2.',
        hintSquares: ['e2'],
        success: '1. Ke2. Black does the same: Ke7.',
        reply: 'Ke7',
      }),
    })
    .step({
      id: 'keep', title: 'Your turn: keep the opposition',
      source: 'Mere counting will show that the former course will only lead to a draw, therefore White takes the latter course.',
      narration: [
        { say: 'King to e3, king to e6. King to e4, and Black steps aside to f6.', moves: ['Ke3', 'Ke6', 'Ke4', 'Kf6'] },
        { say: 'White can pass with Kd5, or stop the black king from passing. Counting shows that passing only draws.' },
      ],
      exercise: ex({
        prompt: 'White to move. Keep the opposition.',
        accept: ['Kf4'],
        feedback: { Kd5: 'Passing: Black passes too with Kg5, and counting shows it is only a draw.', '*': 'Stand in front of the black king again.' },
        hint: 'The king goes to f4, face to face again.',
        hintSquares: ['f4'],
        success: '4. Kf4. Black goes to g6. If Ke6, then Kg5 wins.',
        reply: 'Kg6',
      }),
    })
    .step({
      id: 'win', title: 'Through on the other side',
      narration: [
        { say: 'Now White passes: king to e5. Black to g7.', moves: ['Ke5', 'Kg7'] },
        { say: 'Counting shows that White wins by taking the pawn on b5.', arrows: [{ from: 'e5', to: 'c5', color: 'primary' }, { from: 'c5', to: 'b5', color: 'primary' }], highlights: ['b5'] },
      ],
    })
    .step({
      id: 'waiting', fen: F, title: 'A waiting move',
      source: 'Therefore it is seen that in such cases when the opponent makes a so-called waiting move, you must advance, leaving a rank or file free between the Kings.',
      narration: [
        { say: 'Black has a harder defence. King to e2, and Black waits with Kd8.', moves: ['Ke2', 'Kd8'] },
        { say: 'Now Kd3 is met by Kd7, and Ke3 by Ke7: Black gets the opposition.' },
      ],
      exercise: ex({
        prompt: 'White to move. Advance, leaving a file free between the kings.',
        accept: ['Kf3'],
        feedback: { Kd3: 'Black answers Kd7 and takes the opposition.', Ke3: 'Black answers Ke7 and takes the opposition.', '*': 'There is only one other square forward.' },
        hint: 'The king goes to f3.',
        hintSquares: ['f3'],
        success: '2. Kf3. Black returns to e7.',
        reply: 'Ke7',
      }),
    })
    .step({
      id: 'back', title: 'Your turn: back to the first line',
      narration: [{ say: 'Now advancing would be bad. Play the same kind of move Black just played.' }],
      exercise: ex({
        prompt: 'White to move. Take the opposition.',
        accept: ['Ke3'],
        wrong: 'Put your king in front of the black king, on the same file.',
        hint: 'King to e3.',
        hintSquares: ['e3'],
        success: '3. Ke3. We are back in the first variation, and White wins.',
        reply: null,
      }),
    })
    .step({
      id: 'summary', title: 'What we learned',
      narration: [
        { say: 'The opposition often decides the game.' },
        { say: 'Against a waiting move, advance, leaving a rank or file free between the kings.' },
      ],
    })
    .save(OUT + '028-opposition-wins.json');
}

// ------------------------------------------------------------------ 029  Example 28
{
  const F = '8/8/8/4p1p1/8/5P2/6K1/3k4 w - - 0 1';
  lesson('029-opposition-defence', 'The Opposition in Defence', 'Drawing a pawn down', '§13 The Opposition', 28, F)
    .step({
      id: 'intro', title: 'A pawn down',
      source: 'The following position is an excellent proof of the value of the opposition as a means of defence. White is a Pawn behind and apparently lost, yet he can manage to draw.',
      narration: [
        { say: 'White is a pawn behind, and apparently lost. Yet he can draw, with the opposition.' },
        { say: 'But not the close opposition: the pawns do not allow it. White takes the distant opposition.' },
      ],
      exercise: ex({
        prompt: 'White to move. Take the distant opposition.',
        accept: ['Kh1'],
        feedback: { Kf1: 'Close opposition: Kd2, Kf2, Kd3, and your own pawn on f3 stops you keeping the lateral opposition.', '*': 'The king goes to the corner, on the same rank as the black king.' },
        hint: 'King to h1.',
        hintSquares: ['h1'],
        success: '1. Kh1! Black tries Kd2.',
        reply: 'Kd2',
      }),
    })
    .step({
      id: 'keep', title: 'Always keep the opposition',
      narration: [
        { say: 'King to h2, king to d3. King to h3!', moves: ['Kh2', 'Kd3', 'Kh3'] },
        { say: 'Black goes to e2, White to g2. King to e3, king to g3.', moves: ['Ke2', 'Kg2', 'Ke3', 'Kg3'] },
        { say: 'Black tries d4, and the king attacks the pawn: g4.', moves: ['Kd4', 'Kg4'], highlights: ['g5'] },
        { say: 'Black must return to e3, and White goes back to g3. He always keeps the opposition.' },
      ],
    })
    .step({
      id: 'push', fen: F, title: 'If Black pushes',
      narration: [
        { say: 'Back to the start. King to h1, and Black pushes g4.', moves: ['Kh1', 'g4'] },
        { say: 'White must not take: after fxg4, e4 wins.' },
      ],
      exercise: ex({
        prompt: 'White to move. Do not take.',
        accept: ['Kg2'],
        feedback: { fxg4: 'Then e4, and the black pawn cannot be stopped.', '*': 'Bring the king back towards the centre.' },
        hint: 'King to g2.',
        hintSquares: ['g2'],
        success: '2. Kg2. Black goes to d2.',
        reply: 'Kd2',
      }),
    })
    .step({
      id: 'draw', title: 'Both sides queen',
      narration: [
        { say: 'Now White takes, and Black pushes e4.', moves: ['fxg4', 'e4'] },
        { say: 'Mere counting shows that both sides queen: a draw.', arrows: [{ from: 'g4', to: 'g8', color: 'primary' }, { from: 'e4', to: 'e1', color: 'danger' }] },
        { say: 'In nearly all king and pawn endings, the opposition is of paramount importance.' },
      ],
    })
    .save(OUT + '029-opposition-defence.json');
}

// ------------------------------------------------------------------ 030  Example 29
lesson('030-two-knights', 'Two Knights', 'They cannot mate alone', '§14 The Relative Value of Knight and Bishop', 29, 'k7/8/1K1NN3/8/8/8/8/8 w - - 0 1')
  .step({
    id: 'alone', title: 'Two knights cannot mate',
    source: 'Before turning our attention to this matter it is well to state now that two Knights alone cannot mate, but, under certain conditions of course, they can do so if the opponent has one or more Pawns.',
    narration: [
      { say: 'The black king is cornered. Yet two knights alone cannot give mate.', highlights: ['a8'] },
      { say: 'They can only stalemate the king.' },
    ],
  })
  .step({
    id: 'pawn', fen: 'k7/8/1K1N4/7p/7N/8/8/8 w - - 0 1', title: 'With a black pawn',
    source: 'White with the two Knights can only stalemate the King, unless Black has a Pawn which can be moved.',
    narration: [
      { say: 'Now Black has a pawn, and White wins. The pawn gives Black moves, so no stalemate.', highlights: ['h5'] },
      { say: 'Knight to g6. The pawn advances.', moves: ['Ng6', 'h4'] },
      { say: 'White must not take the pawn: that would be a draw again.' },
      { say: 'Knight to e5, h3. Knight to c6, h2.', moves: ['Ne5', 'h3', 'Nc6', 'h2'] },
      { say: 'Knight to b5, and Black queens.', moves: ['Nb5', 'h1=Q'] },
    ],
    exercise: ex({
      prompt: 'White to move and give checkmate in one.',
      accept: ['Nc7#'],
      wrong: 'One of the knights gives mate.',
      hint: 'The knight on b5 jumps to c7.',
      hintSquares: ['c7'],
      success: 'Checkmate. The pawn had to move, and that made the mate possible.',
      reply: null,
    }),
  })
  .save(OUT + '030-two-knights.json');

// ------------------------------------------------------------------ 031  Examples 30–31
lesson('031-exceptions', 'Two Exceptions', 'Bishop with the wrong pawn, knight against pawns', '§14 The Relative Value of Knight and Bishop', '30–31', '7k/8/8/6K1/8/3B4/7P/8 w - - 0 1')
  .step({
    id: 'wrong-colour', title: 'The wrong bishop',
    source: 'It is the greatest weakness of the Bishop, that when the Rook\'s Pawn Queens on a square of opposite colour and the opposing King is in front of the Pawn, the Bishop is absolutely worthless.',
    narration: [
      { say: 'White is a bishop and a pawn ahead, and cannot win.' },
      { say: 'The pawn queens on h8, a dark square. The bishop moves on light squares.', highlights: ['h8', 'd3'] },
      { say: 'All Black has to do is keep his king near the corner.', moves: ['h4', 'Kg8', 'h5', 'Kh8'] },
    ],
  })
  .step({
    id: 'knight', fen: '8/8/5Np1/8/8/7p/5K2/7k b - - 0 1', title: 'Knight against two pawns',
    narration: [
      { say: 'Here White wins, with or without the move. The most difficult line:' },
      { say: 'King to h2. Knight to g4, check. King back to h1.', moves: ['Kh2', 'Ng4+', 'Kh1'] },
      { say: 'King to f1, g5. King to f2, h2.', moves: ['Kf1', 'g5', 'Kf2', 'h2'] },
      { say: 'Knight to e3, g4. Knight to f1, and g3 check.', moves: ['Ne3', 'g4', 'Nf1', 'g3+'] },
    ],
    exercise: ex({
      prompt: 'White to move and give checkmate in one.',
      accept: ['Nxg3#'],
      wrong: 'The knight can take with mate.',
      hint: 'The knight takes on g3.',
      hintSquares: ['g3'],
      success: 'Checkmate. The black pawn on h2 blocks his own king.',
      reply: null,
    }),
  })
  .save(OUT + '031-exceptions.json');

// ------------------------------------------------------------------ 032  Examples 32–33
{
  const a = lesson('032-bishop-or-knight', 'Bishop or Knight?', 'The bishop is usually better', '§14 The Relative Value of Knight and Bishop', '32–33', '7k/8/8/N2b4/8/8/7K/8 w - - 0 1');
  a.step({
    id: 'colours', title: 'One colour at a time',
    source: 'It is generally thought by amateurs that the Knight is the more valuable piece of the two, the chief reason being that, unlike the Bishop, the Knight can command both White and Black squares. However, the fact is generally overlooked that the Knight, at any one time, has the choice of one colour only.',
    narration: [
      { say: 'Amateurs usually think the knight is more valuable: it reaches both colours.' },
      { say: 'But at any one time, a knight can only choose squares of one colour.', highlights: a.reach('a5') },
      { say: 'It is slow to cross the board. And a bishop can stalemate a knight.' },
      { say: 'Every square the knight could go to is covered by the bishop.', zone: { squares: a.reach('a5'), color: 'danger' }, arrows: [{ from: 'd5', to: 'b7', color: 'danger' }, { from: 'd5', to: 'b3', color: 'danger' }] },
      { say: 'A compliment the knight is unable to return.' },
    ],
  });
  a.step({
    id: 'block', fen: '4k3/3n4/2p5/1pPp4/pP1P4/P7/8/2B1K3 w - - 0 1', title: 'When the knight is better',
    source: 'This is about the only case when the Knight is more valuable than the Bishop. It is what is called a "block position," and all the Pawns are on one side of the board.',
    narration: [
      { say: 'About the only case where the knight is better: a block position, all pawns on one side.' },
      { say: 'The white pawns stand on dark squares, the same colour as White\'s bishop. The bishop has nothing to attack.', highlights: ['a3', 'b4', 'c5', 'd4', 'c1'] },
      { say: 'Black has excellent chances of winning.' },
    ],
  });
  a.step({
    id: 'rules', title: 'Two rules about pawns',
    source: 'When the opponent has a Bishop, keep your Pawns on squares of the same colour as your opponent\'s Bishop. Whenever you have a Bishop, whether the opponent has also one or not, keep your Pawns on squares of the opposite colour to that of your own Bishop.',
    narration: [
      { say: 'Whenever you have a bishop, keep your pawns on squares of the opposite colour.' },
      { say: 'When the opponent has a bishop, keep your pawns on squares of the same colour as his bishop.' },
      { say: 'Naturally, these rules sometimes have to be modified to suit the position.' },
    ],
  });
  a.save(OUT + '032-bishop-or-knight.json');
}

// ------------------------------------------------------------------ 033  Examples 34–38
lesson('033-minor-piece-endings', 'Knight against Bishop with Pawns', 'Where the pawns stand decides', '§14 The Relative Value of Knight and Bishop', '34–38', '4k3/3n1ppp/8/8/8/8/5PPP/2B1K3 w - - 0 1')
  .step({
    id: 'one-side', title: 'Pawns on one side',
    narration: [
      { say: 'Pawns on one side only: there is no advantage in having either piece. A draw.', highlights: ['f2', 'g2', 'h2', 'f7', 'g7', 'h7'] },
    ],
  })
  .step({
    id: 'both-sides', fen: '4k3/pppn1ppp/8/8/8/8/PPP2PPP/2B1K3 w - - 0 1', title: 'Pawns on both sides',
    source: 'The advantage of having the Bishop lies as much in its ability to command, at long range, both sides of the board from a central position as in its ability to move quickly from one side of the board to the other.',
    narration: [
      { say: 'Add three pawns each on the other wing. Now the bishop is preferable, though it should still be a draw.' },
      { say: 'From the centre, the bishop commands both sides of the board at long range, and it moves quickly from one side to the other.', highlights: ['e3', 'b6', 'g5'], arrows: [{ from: 'c1', to: 'h6', color: 'primary' }] },
    ],
  })
  .step({
    id: 'unbalanced', fen: '4k3/pppn1pp1/8/8/8/8/1PP2PPP/2B1K3 w - - 0 1', title: 'Unbalanced pawns',
    narration: [
      { say: 'Same number of pawns, but not balanced: three to two for White on the king side, three to two for Black on the queen side.', highlights: ['f2', 'g2', 'h2', 'a7', 'b7', 'c7'] },
      { say: 'The bishop is unquestionably an advantage. With proper play still a draw, but White has better chances.' },
    ],
  })
  .step({
    id: 'passed', fen: '4k3/pppn1p2/8/8/8/8/2P2PPP/2B1K3 w - - 0 1', title: 'Passed pawns',
    narration: [
      { say: 'Now each side has passed pawns: g and h for White, a and b for Black.', highlights: ['g2', 'h2', 'a7', 'b7'] },
      { say: 'The bishop is a decided advantage. Black would have extreme difficulty drawing.' },
    ],
  })
  .step({
    id: 'again', fen: '4k3/p1pn1p2/8/8/8/8/2P2P1P/2B1K3 w - - 0 1', title: 'Again',
    source: 'The proper course in these endings, as in all similar endings, is: Advance of the King to the centre of the board or towards the passed Pawns, or Pawns that are susceptible of being attacked, and rapid advance of the passed Pawn or Pawns as far as is consistent with their safety.',
    narration: [
      { say: 'Again, Black would have great difficulty drawing.' },
      { say: 'The method: bring the king to the centre, or towards the passed pawns or the weak ones.', arrows: [{ from: 'e1', to: 'e4', color: 'primary' }] },
      { say: 'And advance your passed pawns rapidly, as far as is safe.' },
      { say: 'No fixed line of play: calculation, visualising the future positions, is what counts.' },
    ],
  })
  .save(OUT + '033-minor-piece-endings.json');

// ------------------------------------------------------------------ 034  Example 39
lesson('034-knight-bishop-mate', 'Mate with Knight and Bishop', 'The laborious mate', '§15 How to Mate with Knight and Bishop', 39, '4k3/8/8/8/8/8/8/2B1K1N1 w - - 0 1')
  .step({
    id: 'intro', title: 'The right corner',
    source: 'With a Knight and a Bishop the mate can only be given in the corners of the same colour as the Bishop.',
    narration: [
      { say: 'With knight and bishop, mate can only be given in a corner of the bishop\'s colour.' },
      { say: 'This bishop runs on dark squares, so the mate must be on a1 or h8.', highlights: ['a1', 'h8'] },
      { say: 'Part one: drive the black king to the edge. First, the king to the centre.' },
    ],
  })
  .step({
    id: 'part1', title: 'Part one: to the edge',
    narration: [
      { say: 'King to e2. Black heads for the light corner, to make it harder.', moves: ['Ke2', 'Kd7', 'Kd3', 'Kc6'] },
      { say: 'Bishop to f4, knight to e2, knight to c3.', moves: ['Bf4', 'Kd5', 'Ne2', 'Kc5', 'Nc3', 'Kb4'] },
      { say: 'The king follows closely.', moves: ['Kd4', 'Ka5', 'Kc5', 'Ka6', 'Kc6', 'Ka7'] },
      { say: 'Knight to d5, and Black is in the light corner.', moves: ['Nd5', 'Ka8'], highlights: ['a8'] },
      { say: 'Part two: drive him from a8 towards a1.', arrows: [{ from: 'a8', to: 'a1', color: 'primary' }] },
    ],
  })
  .step({
    id: 'part2', title: 'Part two: along the edge',
    source: 'White has two ways to prevent that, one by 14 B - K 5, and the other which I give as the text, and which I consider better for the student to learn, because it is more methodical and more in accord with the spirit of all these endings, by using the King as much as possible.',
    narration: [
      { say: 'Knight to b6, check. Bishop to c7, then b8.', moves: ['Nb6+', 'Ka7', 'Bc7', 'Ka6', 'Bb8', 'Ka5'] },
      { say: 'Knight to d5. Black tries to escape along the edge.', moves: ['Nd5', 'Ka4'] },
    ],
    exercise: ex({
      prompt: 'White to move. Use the king to cut off the escape.',
      accept: ['Kc5'],
      feedback: { Be5: 'Also possible, with Kb3 and Ne3, but the king move is more methodical: use the king as much as possible.', '*': 'Bring the king closer.' },
      hint: 'King to c5.',
      hintSquares: ['c5'],
      success: '14. Kc5! Black goes to b3.',
      reply: 'Kb3',
    }),
  })
  .step({
    id: 'net', title: 'Closing the net',
    narration: [
      { say: 'Knight to b4. Bishop to f4, then e5.', moves: ['Nb4', 'Kc3', 'Bf4', 'Kb3', 'Be5', 'Ka4'] },
      { say: 'King to c4. Bishop to c7, check.', moves: ['Kc4', 'Ka5', 'Bc7+', 'Ka4'] },
      { say: 'Knight to d3. Bishop to b6. Knight to b2, check.', moves: ['Nd3', 'Ka3', 'Bb6', 'Ka4', 'Nb2+', 'Ka3'] },
      { say: 'The king follows: c3, c2.', moves: ['Kc3', 'Ka2', 'Kc2', 'Ka3'] },
      { say: 'Bishop to c5, check. Knight to d3. Bishop to b4.', moves: ['Bc5+', 'Ka2', 'Nd3', 'Ka1', 'Bb4', 'Ka2'] },
      { say: 'Knight to c1, check.', moves: ['Nc1+', 'Ka1'] },
    ],
    exercise: ex({
      prompt: 'White to move and give checkmate in one.',
      accept: ['Bc3#'],
      wrong: 'The bishop gives mate on the long diagonal.',
      hint: 'Bishop to c3.',
      hintSquares: ['c3'],
      success: 'Checkmate, on move 29.',
      reply: null,
    }),
  })
  .step({
    id: 'summary', title: 'What we learned',
    source: 'There are two outstanding features: the close following by the King, and the controlling of the squares of opposite colour to the Bishop by the combined action of the Knight and King.',
    narration: [
      { say: 'Two outstanding features: the king follows closely.' },
      { say: 'And knight and king together control the squares the bishop cannot reach.' },
      { say: 'Practise it: the mate must come within the fifty moves allowed by the rules.' },
    ],
  })
  .save(OUT + '034-knight-bishop-mate.json');

// ------------------------------------------------------------------ 035  Examples 40–41
lesson('035-queen-v-rook', 'Queen against Rook', 'Separate the rook from the king', '§16 Queen against Rook', '40–41', '1k6/1r6/2K5/Q7/8/8/8/8 w - - 0 1')
  .step({
    id: 'intro', title: 'A standard position',
    source: 'If it were Black\'s move it would be simple, as he would have to move his Rook away from the King, and then the Rook would be comparatively easy to win. […] We must bring about the position in the diagram with Black to move.',
    narration: [
      { say: 'One of the most difficult endings without pawns. This is a standard defensive position.' },
      { say: 'If it were Black to move, the rook would have to leave the king, and would soon be lost.', highlights: ['b7', 'b8'] },
      { say: 'So the plan: reach this same position, with Black to move. Your move.' },
    ],
    exercise: ex({
      prompt: 'White to move. Start with a check.',
      accept: ['Qe5+'],
      feedback: { Qa6: 'The trap every beginner falls into: Rc7 check, Kb6, Rc6 check, and Kxc6 is stalemate.', '*': 'Check from the long diagonal.' },
      hint: 'Queen to e5, check.',
      hintSquares: ['e5'],
      success: '1. Qe5, check. Black goes to a7.',
      reply: 'Ka7',
    }),
  })
  .step({
    id: 'triangle', title: 'Losing a move',
    narration: [
      { say: 'Queen to a1, check. Black returns to b8.', moves: ['Qa1+', 'Kb8'] },
    ],
    exercise: ex({
      prompt: 'White to move. Return to the starting position.',
      accept: ['Qa5'],
      wrong: 'Put the queen back where it was at the start.',
      hint: 'Queen to a5.',
      hintSquares: ['a5'],
      success: '3. Qa5. The same position, with Black to move. The rook must leave. It can only go to a light square, or a check wins it.',
      reply: 'Rb3',
    }),
  })
  .step({
    id: 'mate', title: 'Part two: the mate',
    narration: [
      { say: 'Queen to e5, check. Black goes to a8, best.', moves: ['Qe5+', 'Ka8'] },
      { say: 'Queen to h8, check; and g7, check.', moves: ['Qh8+', 'Ka7', 'Qg7+', 'Ka8'] },
      { say: 'Queen to g8, check. The rook must block on b8.', moves: ['Qg8+', 'Rb8'] },
    ],
    exercise: ex({
      prompt: 'White to move and give checkmate in one.',
      accept: ['Qa2#'],
      wrong: 'The rook has left the b3 square. Use the diagonal.',
      hint: 'Queen to a2.',
      hintSquares: ['a2'],
      success: 'Checkmate. The long-range diagonal checks did the work.',
      reply: null,
    }),
  })
  .step({
    id: 'ex41', fen: '8/k7/2K5/4Q3/8/8/8/1r6 w - - 0 1', title: 'A similar position',
    source: 'The procedure here is very similar. The things to bear in mind are that the Rook must be prevented from interposing at Kt 1 because of an immediate mate, and in the same way the King must be prevented from going either to R 3 or B 1.',
    narration: [
      { say: 'Here the procedure is very similar.' },
      { say: 'Keep the rook from blocking on b8, because of an immediate mate.', highlights: ['b8'] },
      { say: 'And keep the black king away from a6 and c8.', zone: { squares: ['a6', 'c8'], color: 'danger' } },
      { say: 'Try it yourself on a board.' },
    ],
  })
  .save(OUT + '035-queen-v-rook.json');

// ------------------------------------------------------------------ 036  Example 42
{
  const F = '8/5rk1/8/5Q1K/8/8/8/8 w - - 0 1';
  lesson('036-queen-v-rook-hard', 'Queen against Rook, Harder', 'The obvious move is not the best', '§16 Queen against Rook', 42, F)
    .step({
      id: 'deceptive', title: 'The obvious check',
      source: 'Many players would be deceived by this position. The most likely looking move is not the best.',
      narration: [
        { say: 'Many players would be deceived here. The most likely looking move is not the best.' },
        { say: 'Suppose queen to e5, check, and king to g6.', moves: ['Qe5+', 'Kf8', 'Kg6'] },
        { say: 'The only defence, but a very effective one: rook to d7.', move: 'Rd7' },
        { say: 'Now Qe6 fails to Rg7 check, Kf6, Rg6 check: a draw. White has made no progress.' },
      ],
    })
    .step({
      id: 'best', fen: F, title: 'Your turn: the best move',
      narration: [{ say: 'Back to the start. Find a better check.' }],
      exercise: ex({
        prompt: 'White to move. The best check.',
        accept: ['Qg5+'],
        feedback: { 'Qe5+': 'That is the deceptive move: after Kf8, Kg6, Rd7, White makes slow progress.', '*': 'Check on the g-file.' },
        hint: 'Queen to g5, check.',
        hintSquares: ['g5'],
        success: '1. Qg5! If Kh7, then Qg6 check, Kh8, and Kh6 wins. Black plays Kh8.',
        reply: 'Kh8',
      }),
    })
    .step({
      id: 'line1', title: 'Back to Example 40',
      narration: [
        { say: 'Queen to e5, check. King to h7, best.', moves: ['Qe5+', 'Kh7'] },
        { say: 'King to g5. Black plays rook to a7, best.', moves: ['Kg5', 'Ra7'] },
        { say: 'Queen to e4, check, and c4, check.', moves: ['Qe4+', 'Kg8', 'Qc4+', 'Kh7'] },
        { say: 'King to f6. The rook comes back to g7.', moves: ['Kf6', 'Rg7'] },
        { say: 'Queen to h4, check, and queen to h5.', moves: ['Qh4+', 'Kg8', 'Qh5'] },
        { say: 'This is the position of Example 40, with Black to move.', highlights: ['g7', 'g8'] },
      ],
    })
    .step({
      id: 'line2', fen: F, title: 'Another defence',
      narration: [
        { say: 'Once more from the start. Queen to g5, check, and king to f8.', moves: ['Qg5+', 'Kf8'] },
        { say: 'Queen to d8, check. King to g7.', moves: ['Qd8+', 'Kg7'] },
        { say: 'King to g5. The best square for the rook, away from the king: f3.', moves: ['Kg5', 'Rf3'] },
        { say: 'Queen to d4, check, and king to g6. White threatens mate on d8.', moves: ['Qd4+', 'Kf8', 'Kg6'], arrows: [{ from: 'd4', to: 'd8', color: 'danger' }] },
        { say: 'Rook checks: g3, then f3. The king steps to e6.', moves: ['Rg3+', 'Kf6', 'Rf3+', 'Ke6'] },
        { say: 'Black must stop mate on h8 with rook to h3.', move: 'Rh3', arrows: [{ from: 'd4', to: 'h8', color: 'danger' }] },
      ],
      exercise: ex({
        prompt: 'White to move. Check, and the rook is lost.',
        accept: ['Qf4+'],
        wrong: 'Check on the f-file.',
        hint: 'Queen to f4, check.',
        hintSquares: ['f4'],
        success: '8. Qf4, check, and the rook is lost.',
        reply: null,
      }),
    })
    .step({
      id: 'summary', title: 'What we learned',
      source: 'Note, in these examples, that the checks at long range along the diagonals have often been the key to all the winning manoeuvres. Also that the Queen and King are often kept on different lines.',
      narration: [
        { say: 'Long-range checks along the diagonals are the key to the winning manoeuvres.' },
        { say: 'And the queen and the king are often kept on different lines.' },
        { say: 'Before going further, go through everything once more.' },
      ],
    })
    .save(OUT + '036-queen-v-rook-hard.json');
}
