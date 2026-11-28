// French Defense course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '1...e6 and 2...d5: a tough pawn chain and counterattacks with ...c5 and ...f6. Your light-squared bishop is the problem piece, so always plan its future.',
  chapters: [
    {
      title: 'Advance: 3.e5',
      about: 'White locks the centre. Attack the base of the pawn chain with ...c5, ...Nc6 and ...Qb6.',
      lines: [
        { name: 'Main line with a3', pgn: `{White's chain d4-e5 is strong. You pile up on d4, its base.}
          e4 e6 {Prepare ...d5 with a pawn behind it.}
          d4 d5 {Challenge e4 straight away.}
          e5 c5 {Hit the base of the chain at once. This is the key French counterattack.}
          c3 Nc6 {Pile up on d4.}
          Nf3 Qb6 {A third attacker on d4, and the queen eyes b2 as well.}
          a3 c4 {Grab space on the queenside and stop b4 for good.}
          Nbd2 Na5 {The knight heads for b3, a hole in White's position.}` },
        { name: 'Milner-Barry gambit: 6.Bd3', pgn: `{White sacrifices d4 for quick development.}
          e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 {Swap first, then decide whether to take more.}
          cxd4 Bd7 {Prepare to take d4 safely. Don't take with the knight yet.}
          O-O Nxd4 {Take the pawn: after Nxd4 Qxd4 you are a pawn up.} Nxd4 Qxd4 {Grab the pawn. White has some development for it, but you are a pawn up.}
          Nc3 a6 {Stop Nb5, which would hit your queen and c7.}` },
      ],
    },
    {
      title: 'Winawer: 3.Nc3 Bb4',
      about: 'Pin the knight, double White\'s pawns, and counterattack with ...c5.',
      lines: [
        { name: 'Main line with Qg4', pgn: `{The sharpest French. You give up your bishop to wreck White's queenside pawns.}
          e4 e6 d4 d5 Nc3 Bb4 {Pin the knight that defends e4.}
          e5 c5 {Hit the base of the chain right away.}
          a3 Bxc3+ {Take, doubling White's pawns.}
          bxc3 Ne7 {Defend g7 in advance and head for f5 or c6.}
          Qg4 O-O {Castle: your king is safe enough and you keep all your pawns.}
          Bd3 Nbc6 {Develop and pile up on d4. Your counterplay comes on the queenside.}` },
      ],
    },
    {
      title: 'Tarrasch: 3.Nd2',
      about: 'White avoids the pin. Strike with ...c5 and play with active pieces.',
      lines: [
        { name: '3...c5 main line', pgn: `{Open the position before White is fully developed.}
          e4 e6 d4 d5 Nd2 c5 {Hit the centre at once.}
          exd5 Qxd5 {Take back with the queen: it's safe in the centre for now.}
          Ngf3 cxd4 {Swap a wing pawn for a centre pawn.} Bc4 Qd6 {A good square for the queen: it watches d4 and stays out of trouble.}
          O-O Nf6 {Develop and get ready to castle.} Nb3 Nc6 {Defend your d4 pawn with pieces.}
          Nbxd4 Nxd4 {Swap knights to ease your position.} Nxd4 a6 {Stop Nb5 and prepare ...Qc7 and ...Be7. A solid, equal game.}` },
        { name: 'Tarrasch: 4.Ngf3', pgn: `{White keeps the tension instead of taking on d5.}
          e4 e6 d4 d5 Nd2 c5 Ngf3 cxd4 {Release the tension: White has to decide how to take back.}
          Nxd4 Nf6 {Develop and add pressure to e4.}
          exd5 Nxd5 {Take back with the knight: a free, active position with no weak pawns.}` },
      ],
    },
    {
      title: 'White\'s other tries',
      about: 'The Exchange Variation and the King\'s Indian Attack.',
      lines: [
        { name: 'Exchange: 3.exd5', pgn: `{White swaps pawns for a quiet, symmetrical game.}
          e4 e6 d4 d5 exd5 exd5 {Now your light-squared bishop is free: the French's usual problem is gone.}
          Nf3 Nf6 {Develop and control e4.} Bd3 Bd6 {Develop the bishop to its best square, aiming at h2.} O-O O-O {Castle and develop. Your bishops are just as good as White's.}
          Bg5 Bg4 {Copy the pin. Nothing to fear: the position is equal.}` },
        { name: 'King\'s Indian Attack: 2.d3', pgn: `{White plays a system with d3, Nd2, g3 and Bg2.}
          e4 e6 d3 d5 {Take the centre anyway: d3 is a slow move.} Nd2 Nf6 {Develop and add pressure to e4.} Ngf3 c5 {Take space in the centre.}
          g3 Nc6 {Develop and control d4.} Bg2 Be7 {Develop and get ready to castle.} O-O O-O {Castle. Now your plan is ...b5 on the queenside.} Re1 b5 {Attack on the queenside: that's where your play is, while White attacks your king.}` },
      ],
    },
  ],
};
