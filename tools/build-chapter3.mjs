// build-chapter3.mjs — Chapter III, Planning a Win in Middle-game Play (Examples 43–49).
//   node tools/build-chapter3.mjs
// Positions: 1921 scan + lordlinks LaTeX + haussbrandt FEN list; moves checked against the 1921 text.
import { Author } from './author.mjs';

const SRC = (section, examples) => ({
  work: 'Chess Fundamentals',
  author: 'José Raúl Capablanca',
  year: 1921,
  section: `Chapter III, ${section}, Example ${examples}`,
  examples: String(examples),
  url: 'https://archive.org/details/chessfundamental00capa',
});
const OUT = new URL('../lessons/', import.meta.url).pathname;
const lesson = (id, title, subtitle, section, examples, startFen) =>
  new Author({ id, title, subtitle, source: SRC(section, examples), startFen });
const ex = (o) => ({ feedback: { '*': o.wrong || 'Not the move Capablanca played. Try again.' }, ...o });

// ------------------------------------------------------------------ 037  Example 43
lesson('037-rooks-on-g-file', 'Doubled Rooks on the g-file', 'Attacking without knights', '§17 Attacking without the Aid of Knights', 43, '2kr4/ppp1qp2/4bQ2/8/3P2r1/N1P5/PP4P1/R1B2RK1 b - - 0 1')
  .step({
    id: 'intro', title: 'Win quickly, if at all',
    source: 'I shall now give a few winning positions taken from my own games. I have selected those that I believe can be considered as types, i.e., positions that may easily occur again in a somewhat similar form. […] It is Black\'s move, and as he is a Kt and P behind he must win quickly, if at all.',
    narration: [
      { say: 'Now some winning positions from Capablanca\'s own games: types that can easily occur again.' },
      { say: 'It is Black\'s move. He is a knight and a pawn behind, so he must win quickly, if at all.' },
      { say: 'The rook on g4 already aims at g2. Bring the other rook.', highlights: ['g4', 'g2'] },
    ],
    exercise: ex({
      prompt: 'Black to move. Double on the open file.',
      accept: ['Rdg8'],
      wrong: 'Bring the rook from d8 to the g-file.',
      hint: 'The d8 rook goes to g8.',
      hintSquares: ['g8'],
      success: '1...Rdg8! White defends g2 with Rf2.',
      reply: 'Rf2',
    }),
  })
  .step({
    id: 'why', title: 'If White takes the queen',
    narration: [
      { say: 'If White had taken the queen, Rxg2 check, Kh1, and Bd5 would soon mate.', arrows: [{ from: 'g4', to: 'g2', color: 'danger' }, { from: 'e6', to: 'd5', color: 'danger' }] },
      { say: 'Now, the attack.' },
    ],
    exercise: ex({
      prompt: 'Black to move. Break in with check.',
      accept: ['Rxg2+'],
      wrong: 'Take on g2, with check.',
      hint: 'The rook takes on g2.',
      hintSquares: ['g2'],
      success: '2...Rxg2, check. The king goes to f1.',
      reply: 'Kf1',
    }),
  })
  .step({
    id: 'deflect', title: 'Your turn: deflect the knight',
    narration: [{ say: 'The knight on a3 is the only piece that could help. Lure it away.' }],
    exercise: ex({
      prompt: 'Black to move. Check with the bishop.',
      accept: ['Bc4+'],
      wrong: 'The bishop gives check on the diagonal to f1.',
      hint: 'Bishop to c4, check.',
      hintSquares: ['c4'],
      success: '3...Bc4, check. The knight must take.',
      reply: 'Nxc4',
    }),
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'Now finish.' }],
    exercise: ex({
      prompt: 'Black to move and give checkmate in one.',
      accept: ['Rg1#'],
      wrong: 'The rook on g2 can mate, protected by the other rook.',
      hint: 'Rook to g1.',
      hintSquares: ['g1'],
      success: 'Checkmate. The queen on e7 covers e2, and the rook on g8 protects g1.',
      reply: null,
    }),
  })
  .save(OUT + '037-rooks-on-g-file.json');

// ------------------------------------------------------------------ 038  Example 44
lesson('038-mate-in-three', 'The Stronger Threat', 'Mate in three', '§17 Attacking without the Aid of Knights', 44, 'kr2r3/pRp3pp/Q1P5/5R2/Pp1q4/3pp2P/6PK/8 w - - 0 1')
  .step({
    id: 'intro', title: 'What Black feared',
    source: 'Black\'s last move was P - K 6, played with the object of stopping what he thought was White\'s threat, viz.: R - Q R 5, to which he would have answered Q - B 5 ch and drawn the game by perpetual check.',
    narration: [
      { say: 'Black\'s last move was e3. He feared Ra5, and planned to answer with Qf4 check and perpetual check.', arrows: [{ from: 'f5', to: 'a5', color: 'muted' }, { from: 'd4', to: 'f4', color: 'danger' }] },
      { say: 'But White has a more forceful move, and mates in three.' },
    ],
    exercise: ex({
      prompt: 'White to move. Mate in three: start with a sacrifice.',
      accept: ['Rxa7+'],
      wrong: 'The rook on b7 takes a pawn with check.',
      hint: 'Rook takes a7, check.',
      hintSquares: ['a7'],
      success: '1. Rxa7, check! The queen must take.',
      reply: 'Qxa7',
    }),
  })
  .step({
    id: 'ra5', title: 'Your turn: now Ra5',
    narration: [{ say: 'Now the move Black feared comes with more force.' }],
    exercise: ex({
      prompt: 'White to move. Line up against the black queen.',
      accept: ['Ra5'],
      wrong: 'The other rook goes to the a-file, behind your queen.',
      hint: 'Rook to a5.',
      hintSquares: ['a5'],
      success: '2. Ra5. Whatever Black does, White mates next move. Say Black plays Rb7.',
      reply: 'Rb7',
    }),
  })
  .step({
    id: 'mate', title: 'Find the checkmate',
    narration: [{ say: 'White mates.' }],
    exercise: ex({
      prompt: 'White to move and give checkmate in one.',
      accept: ['Qxb7#'],
      wrong: 'Capture the rook that just moved to b7.',
      hint: 'Take on b7.',
      hintSquares: ['b7'],
      success: 'Checkmate.',
      reply: null,
    }),
  })
  .save(OUT + '038-mate-in-three.json');

// ------------------------------------------------------------------ 039  Example 45
lesson('039-gain-material-first', 'Gain Material First', 'Before Black consolidates', '§17 Attacking without the Aid of Knights', 45, '3q1kn1/r5p1/1ppr1pQn/p2ppP2/P3P2R/1BPPB3/1P3PK1/7R w - - 0 1')
  .step({
    id: 'intro', title: 'A beautiful position',
    source: 'White has a beautiful position, but still he had better gain some material, if he can, before Black consolidates his defensive position.',
    narration: [
      { say: 'White has a beautiful position, with both rooks on the h-file.', highlights: ['h4', 'h1'] },
      { say: 'Still, he had better gain some material before Black consolidates.' },
    ],
    exercise: ex({
      prompt: 'White to move. Sacrifice the exchange.',
      accept: ['Rxh6'],
      wrong: 'A rook takes the knight on h6.',
      hint: 'Rook takes h6.',
      hintSquares: ['h6'],
      success: '1. Rxh6! Black takes.',
      reply: 'gxh6',
    }),
  })
  .step({
    id: 'bishop', title: 'Your turn: the bishop joins',
    narration: [{ say: 'The g-pawn has gone. Check.' }],
    exercise: ex({
      prompt: 'White to move. Check with the bishop.',
      accept: ['Bxh6+'],
      wrong: 'The bishop on e3 takes on h6 with check.',
      hint: 'Bishop takes h6, check.',
      hintSquares: ['h6'],
      success: '2. Bxh6, check. If Nxh6, Rxh6 and Black is helpless. The king goes to e7.',
      reply: 'Ke7',
    }),
  })
  .step({
    id: 'chase', title: 'Winning material',
    narration: [
      { say: 'Queen to h7, check. King to e8.', moves: ['Qh7+', 'Ke8'] },
      { say: 'Queen takes the knight on g8, check. King to d7.', moves: ['Qxg8+', 'Kd7'] },
      { say: 'Queen to h7, check, and the black queen blocks on e7.', moves: ['Qh7+', 'Qe7'] },
    ],
    exercise: ex({
      prompt: 'White to move. Attack the black queen with the bishop.',
      accept: ['Bf8'],
      wrong: 'The bishop can attack the queen on e7.',
      hint: 'Bishop to f8.',
      hintSquares: ['f8'],
      success: '6. Bf8. The queens come off.',
      reply: 'Qxh7',
    }),
  })
  .step({
    id: 'finish', title: 'Resigns',
    narration: [
      { say: 'Rook takes back, check. King to e8.', moves: ['Rxh7+', 'Ke8'] },
      { say: 'And rook takes the rook on a7. Black resigned.', move: 'Rxa7' },
      { say: 'Rooks and bishops attacked together with the queen. No knights took part.' },
    ],
  })
  .save(OUT + '039-gain-material-first.json');

// ------------------------------------------------------------------ 040  Example 46
{
  const F = '4r2r/p1pb1ppk/2ppn2p/1q3N1N/4PPP1/1P2Q3/4R2P/2R3K1 w - - 0 1';
  lesson('040-knights-attack', 'Knights in the Attack', 'Two pawns down, press on', '§18 Attacking with Knights as a Prominent Force', 46, F)
    .step({
      id: 'intro', title: 'Press on',
      source: 'White is two Pawns behind. He must therefore press on his attack.',
      narration: [
        { say: 'Now the knights play a prominent part.' },
        { say: 'White is two pawns behind, so he must press on with his attack. Both knights are near the black king.', highlights: ['f5', 'h5', 'h7'] },
      ],
      exercise: ex({
        prompt: 'White to move. A knight takes a pawn.',
        accept: ['Nfxg7'],
        feedback: { Nhxg7: 'The other knight: the one on f5 takes g7.', '*': 'A knight takes the pawn on g7.' },
        hint: 'The f5 knight takes on g7.',
        hintSquares: ['g7'],
        success: '1. Nfxg7. Black plays Nc5.',
        reply: 'Nc5',
      }),
    })
    .step({
      id: 'error', title: 'Your turn: take the rook',
      source: 'Evidently an error which made the winning easier for White, as he simply took the Rook with the Knight and kept up the attack.',
      narration: [{ say: 'An error, which made things easier for White.' }],
      exercise: ex({
        prompt: 'White to move. Win the exchange and keep the attack.',
        accept: ['Nxe8'],
        wrong: 'The knight on g7 can take a rook.',
        hint: 'Knight takes e8.',
        hintSquares: ['e8'],
        success: '2. Nxe8, and White kept up the attack.',
        reply: null,
      }),
    })
    .step({
      id: 'better', fen: F, title: 'The better defence',
      narration: [
        { say: 'Black should have taken the knight.', moves: ['Nfxg7', 'Nxg7'] },
        { say: 'Knight to f6, check. King to g6.', moves: ['Nf6+', 'Kg6'] },
        { say: 'Knight takes the bishop, and f6 is best.', moves: ['Nxd7', 'f6'] },
        { say: 'Pawn to e5. King to f7.', moves: ['e5', 'Kf7'] },
        { say: 'Knight takes f6, rook to e7. Knight to e4, and Black should lose.', moves: ['Nxf6', 'Re7', 'Ne4'] },
      ],
    })
    .save(OUT + '040-knights-attack.json');
}

// ------------------------------------------------------------------ 041  Example 47
lesson('041-bishop-sac-typical', 'The Typical Bishop Sacrifice', 'Bxh7 in a real game', '§18 Attacking with Knights as a Prominent Force', 47, 'r1bq1rk1/pp2nppp/4p3/2n5/8/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 1')
  .step({
    id: 'intro', title: 'A typical sacrifice',
    source: 'The student should carefully examine the position, as the sacrifice of the Bishop in similar situations is typical, and the chance for it is of frequent occurrence in actual play.',
    narration: [
      { say: 'The sacrifice of the bishop in positions like this is typical, and the chance occurs often.' },
      { say: 'You met it in Chapter One. Your move.', arrows: [{ from: 'd3', to: 'h7', color: 'primary' }] },
    ],
    exercise: ex({
      prompt: 'White to move. The typical sacrifice.',
      accept: ['Bxh7+'],
      wrong: 'The bishop takes on h7.',
      hint: 'Bishop takes h7, check.',
      hintSquares: ['h7'],
      success: '1. Bxh7, check. Black takes.',
      reply: 'Kxh7',
    }),
  })
  .step({
    id: 'ng5', title: 'Your turn: the knight check',
    narration: [{ say: 'Now the knight, with check.' }],
    exercise: ex({
      prompt: 'White to move. Check with the knight.',
      accept: ['Ng5+'],
      wrong: 'The knight on f3 checks from g5.',
      hint: 'Knight to g5, check.',
      hintSquares: ['g5'],
      success: '2. Ng5, check. Kg6 is best.',
      reply: 'Kg6',
    }),
  })
  .step({
    id: 'others', title: 'The other king moves',
    narration: [
      { say: 'If Kh6, knight takes f7 with check, and wins the queen.', arrows: [{ from: 'g5', to: 'f7', color: 'danger' }] },
      { say: 'If Kg8, queen to h5, with an irresistible attack.', arrows: [{ from: 'd1', to: 'h5', color: 'danger' }] },
    ],
    exercise: ex({
      prompt: 'White to move. Bring the queen with a threat.',
      accept: ['Qg4'],
      wrong: 'The queen joins the attack on the g-file.',
      hint: 'Queen to g4.',
      hintSquares: ['g4'],
      success: '3. Qg4. Black plays f5.',
      reply: 'f5',
    }),
  })
  .step({
    id: 'end', title: 'White won in the end',
    narration: [
      { say: 'Queen to g3, and the king goes to h6.', moves: ['Qg3', 'Kh6'] },
      { say: 'White ultimately won the game. We will look at this attack again in the next chapter.' },
    ],
  })
  .save(OUT + '041-bishop-sac-typical.json');

// ------------------------------------------------------------------ 042  Example 48
lesson('042-coordination', 'Co-ordination of the Pieces', 'Winning back a pawn, and more', '§19 Winning by Indirect Attack', 48, '2r1r1k1/2p2pbp/2ppq1p1/8/2n1P3/2N2P2/PPPBQ1PP/1R3RK1 b - - 0 1')
  .step({
    id: 'intro', title: 'A pawn is a lot',
    source: 'The winning of a Pawn among good players of even strength often means the winning of the game. […] Black is a Pawn behind, and there is no violent direct attack against White\'s King. Black\'s pieces, however, are very well placed and free to act.',
    narration: [
      { say: 'Attacks are not only against the king. Among good players, winning a pawn often means winning the game.' },
      { say: 'Black is a pawn behind. No direct attack, but his pieces are very well placed and free to act.', highlights: ['c4', 'g7', 'e6'] },
      { say: 'Watch how they co-ordinate. First, the rook to the a-file.', move: 'Ra8' },
      { say: 'White plays a4. His best was b3, but then Black would win the a-pawn anyway.', move: 'a4', highlights: ['a4'] },
    ],
    exercise: ex({
      prompt: 'Black to move. Exchange the knight for the bishop.',
      accept: ['Nxd2'],
      wrong: 'The knight on c4 takes a piece.',
      hint: 'Knight takes d2.',
      hintSquares: ['d2'],
      success: '2...Nxd2. The queen takes back.',
      reply: 'Qxd2',
    }),
  })
  .step({
    id: 'pressure', title: 'Increase the pressure',
    source: 'Black could have regained the Pawn by playing B x Kt, but he sees that there is more to be had, and therefore increases the pressure against White\'s Queen side.',
    narration: [
      { say: 'Queen to c4. White\'s rook goes to d1.', moves: ['Qc4', 'Rfd1'] },
      { say: 'Black could win the pawn back now with Bxc3. But there is more to be had.' },
    ],
    exercise: ex({
      prompt: 'Black to move. Bring the other rook against the queen side.',
      accept: ['Reb8'],
      wrong: 'The rook on e8 goes to the open b-file.',
      hint: 'Rook e8 to b8.',
      hintSquares: ['b8'],
      success: '4...Reb8. Black threatens Rxb2, among other things.',
      reply: 'Qe3',
    }),
  })
  .step({
    id: 'threats', title: 'Threat after threat',
    narration: [
      { say: 'Rook to b4, threatening Bd4 and winning the exchange. Queen to g5.', moves: ['Rb4', 'Qg5'] },
      { say: 'Bishop to d4, check. King to h1.', moves: ['Bd4+', 'Kh1'] },
      { say: 'And the other rook: a8 to b8. This threatens to win the knight.', move: 'Rab8', arrows: [{ from: 'b4', to: 'b2', color: 'danger' }] },
      { say: 'White must give up the exchange.', moves: ['Rxd4', 'Qxd4'] },
      { say: 'Rook to d1, queen back to c4. Black will recover his pawn, with the better game.', moves: ['Rd1', 'Qc4'], highlights: ['a4', 'b2'] },
    ],
  })
  .save(OUT + '042-coordination.json');

// ------------------------------------------------------------------ 043  Example 49
lesson('043-indirect-attack', 'The Indirect Attack', 'A move that upsets everything', '§19 Winning by Indirect Attack', 49, 'r4rk1/p3q1pp/1pb5/2pn1p2/8/3BPN2/PP2QPPP/2RR2K1 w - - 0 1')
  .step({
    id: 'intro', title: 'Two courses',
    source: 'An examination of this position will show that Black\'s main weakness lies in the exposed position of his King, and in the fact that his Q R has not yet come into the game.',
    narration: [
      { say: 'Black\'s weaknesses: the exposed king, and the rook on a8 not yet in play.', highlights: ['g8', 'a8'] },
      { say: 'If it were Black\'s move, he might even be better: three pawns to two on the queen side, and the bishop on the long diagonal.', arrows: [{ from: 'c6', to: 'g2', color: 'muted' }] },
      { say: 'The obvious move, Bc4, might be good enough. But another move upsets Black\'s position completely.' },
    ],
    exercise: ex({
      prompt: 'White to move. Find the move that wins a pawn.',
      accept: ['Nd4'],
      feedback: { Bc4: 'The obvious move: good enough, after Rad8 and b4. But there is a stronger one.', '*': 'A knight move, into the centre.' },
      hint: 'Knight to d4.',
      hintSquares: ['d4'],
      success: '1. Nd4! Black takes.',
      reply: 'cxd4',
    }),
  })
  .step({
    id: 'rxc6', title: 'Your turn: take the bishop',
    narration: [{ say: 'The bishop on c6 is now undefended.' }],
    exercise: ex({
      prompt: 'White to move. Take the bishop.',
      accept: ['Rxc6'],
      wrong: 'The rook on c1 takes on c6.',
      hint: 'Rook takes c6.',
      hintSquares: ['c6'],
      success: '2. Rxc6. Black plays Nb4: nothing better, because White threatened Bc4.',
      reply: 'Nb4',
    }),
  })
  .step({
    id: 'finish', title: 'A pawn ahead',
    narration: [
      { say: 'Bishop to c4, check. King to h8.', moves: ['Bc4+', 'Kh8'] },
      { say: 'Rook to e6, attacking the queen. Pawn to d3.', moves: ['Re6', 'd3'] },
      { say: 'Rook takes d3. White is a pawn ahead, with the better position.', move: 'Rxd3' },
    ],
  })
  .step({
    id: 'summary', title: 'All the pieces together',
    source: 'Once the opportunity is offered, all the pieces are thrown into action "en masse" when necessary; and all the pieces smoothly co-ordinate their action with machine-like precision.',
    narration: [
      { say: 'These positions show different types of combination, and train the imagination.' },
      { say: 'Once the opportunity is offered, all the pieces are thrown into action, en masse.' },
      { say: 'And they co-ordinate with machine-like precision.' },
    ],
  })
  .save(OUT + '043-indirect-attack.json');
