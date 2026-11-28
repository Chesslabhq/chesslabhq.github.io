// 1...e5 (Open Games) course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'Meet 1.e4 with 1...e5 and fight for the centre the classical way. This course covers the Italian, the Ruy Lopez, the Scotch and White\'s other 1.e4 e5 tries.',
  chapters: [
    {
      title: 'Against the Italian',
      about: 'White plays Bc4. Develop with ...Nf6 and ...Bc5 and know the Ng5 attack.',
      lines: [
        { name: 'Slow Italian', pgn: `{The most common line today: White builds slowly with c3 and d3.}
          e4 e5 {Take your share of the centre.}
          Nf3 Nc6 {Defend e5 and develop.}
          Bc4 Nf6 {Develop and hit e4.}
          d3 Bc5 {Your bishop's most active square, aiming at f2.}
          c3 d6 {Solid: protect e5 and open a path for the c8 bishop.}
          O-O O-O {Castle. Your king is safe and your rook can come to e8.} Re1 a6 {Give the bishop a retreat square on a7 in advance.}
          Bb3 Ba7 {Safe from ...d4 or b4 tricks, and still aiming at f2.}
          h3 h6 {Stop Bg5 and Ng5. Copying White here is perfectly fine.}` },
        { name: 'The Ng5 attack: 4.Ng5', pgn: `{White attacks f7 at once. You give a pawn and get great development.}
          e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 {Block the bishop's attack on f7.}
          exd5 Na5 {The best move: hit the bishop instead of taking back on d5 (which allows the Fried Liver).}
          Bb5+ c6 {Block the check and hit the d5 pawn.} dxc6 bxc6 {You're a pawn down but your pieces fly out.}
          Be2 h6 {Kick the knight away.}
          Nf3 e4 {Kick it again! White's pieces keep losing time.}
          Ne5 Bd6 {Develop and challenge the e5 knight. Black has full compensation for the pawn.}` },
      ],
    },
    {
      title: 'Against the Ruy Lopez',
      about: 'White plays Bb5. The Closed Ruy and the Exchange Variation.',
      lines: [
        { name: 'Closed: the Chigorin', pgn: `{The classical main line of the Spanish.}
          e4 e5 Nf3 Nc6 Bb5 a6 {Ask the bishop a question straight away.}
          Ba4 Nf6 {Develop and hit e4.}
          O-O Be7 {Calm: protect your king and prepare ...b5 and ...d6.}
          Re1 b5 {Kick the bishop off the a4-e8 diagonal for good.}
          Bb3 d6 {Hold e5 and free your light-squared bishop.}
          c3 O-O {Castle first, then decide on the queenside plan.} h3 Na5 {Swap off White's dangerous light-squared bishop or push it back to c2.}
          Bc2 c5 {Grab space on the queenside.}
          d4 Qc7 {Hold e5 firmly. A rich, balanced position.}` },
        { name: 'Exchange Variation', pgn: `{White gives up the bishop to damage your pawns.}
          e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 {Take toward the centre: your bishops get open lines.}
          O-O f6 {Protect e5 solidly.}
          d4 exd4 {Swap in the centre.} Nxd4 c5 {Kick the knight from the centre.}
          Nb3 Qxd1 {Trade queens: with the bishop pair, the endgame is fine for you.} Rxd1 Bg4 {Develop with tempo, hitting the rook.}
          f3 Be6 {You have the bishop pair to make up for the doubled pawns.}` },
      ],
    },
    {
      title: 'Against the Scotch',
      about: 'White opens the centre with 3.d4.',
      lines: [
        { name: 'Mieses: 4...Nf6', pgn: `{Develop with tempo against the centralised knight.}
          e4 e5 Nf3 Nc6 d4 exd4 {Take: you can't keep e5 anyway.}
          Nxd4 Nf6 {Hit e4 and develop.}
          Nxc6 bxc6 {Take toward the centre. The b-file opens for your rook.}
          e5 Qe7 {Pin the e5 pawn against White's king.}
          Qe2 Nd5 {The knight is safe here and blocks the d-file.}
          c4 Ba6 {Pin the c4 pawn against White's queen.}
          b3 g6 {Your bishop goes to g7 to attack e5.}` },
      ],
    },
    {
      title: 'White\'s other 1.e4 e5 openings',
      about: 'The Vienna, King\'s Gambit, Four Knights and Bishop\'s Opening.',
      lines: [
        { name: 'Vienna Gambit', side: true, pgn: `{White plays Nc3 and f4.}
          e4 e5 Nc3 Nf6 {Develop and hit e4.} f4 d5 {Hit back in the centre: the best answer to the gambit.}
          fxe5 Nxe4 {Your knight jumps into the centre.} Nf3 Be7 {Develop and prepare to castle.} d4 O-O {Castle. Your king is safe before White's attack starts.} Bd3 f5 {Support the e4 knight. Your pieces are well placed.}` },
        { name: 'Vienna Gambit: 6.Qe2', side: true, pgn: `{The most popular way to play it: White's queen pins your e4 knight.}
          e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7 Qe2 Nxc3 {Swap off the pinned knight before White can win it.}
          dxc3 c5 {Grab space and keep White out of d4. Then ...Nc6 and ...Be6.}` },
        { name: 'King\'s Gambit', side: true, pgn: `{White offers the f-pawn to open the f-file.}
          e4 e5 f4 exf4 {Take: the gambit pawn is yours.}
          Nf3 d5 {Strike back in the centre at once.}
          exd5 Nf6 {Develop and hit d5.} Bc4 Nxd5 {Your knight is strong in the centre.}
          O-O Be7 {Calm development. You keep the extra pawn for now.}` },
        { name: 'Four Knights', pgn: `{A symmetrical, classical opening.}
          e4 e5 Nf3 Nc6 Nc3 Nf6 {Develop and hit e4.} Bb5 Bb4 {Copy White: solid and fully equal.}
          O-O O-O {Castle.} d3 d6 {Protect e5 and open a path for your light-squared bishop.} Bg5 Bxc3 {Take before Nd5 becomes strong.}
          bxc3 Qe7 {Break the pin with ...Nd8-e6 next.}` },
        { name: 'Bishop\'s Opening', side: true, pgn: `{White plays Bc4 before Nf3.}
          e4 e5 Bc4 Nf6 {Develop and hit e4.}
          d3 c6 {Prepare ...d5 to take the centre.}
          Nf3 d5 {Grab the centre.} Bb3 Bd6 {Protect e5. You have a fine share of the centre.}` },
      ],
    },
  ],
};
