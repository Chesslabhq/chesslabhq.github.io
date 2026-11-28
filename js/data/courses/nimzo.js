// Nimzo-Indian Defense course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'After 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 you pin the knight and fight for e4 with pieces. Often you give up the bishop to double White\'s pawns. Also covers what to do when White avoids Nc3.',
  chapters: [
    {
      title: 'White plays 3.Nc3',
      about: 'The Nimzo proper. Know your answer to each of White\'s fourth moves.',
      lines: [
        { name: 'Rubinstein: 4.e3', pgn: `{White's most solid system: develop, castle, and use the centre.}
          d4 Nf6 {Develop and control e4.}
          c4 e6 {Prepare ...Bb4 or ...d5.}
          Nc3 Bb4 {The Nimzo: pin the knight that wants to support e4.}
          e3 O-O {Castle first. You keep options of ...d5, ...c5 or ...b6.}
          Bd3 d5 {Take your share of the centre.} Nf3 c5 {Strike at d4: your pieces are ready.}
          O-O Nc6 {Develop and pile up on d4.} a3 Bxc3 {Take: White gets the bishop pair but a weaker pawn structure.}
          bxc3 dxc4 {Take, so White has to spend a move recapturing.} Bxc4 Qc7 {Prepare ...e5 to hit the centre.}` },
        { name: 'Classical: 4.Qc2', pgn: `{White protects c3 with the queen to avoid doubled pawns.}
          d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O {Castle and wait to see White's plan.}
          a3 Bxc3+ {Take: White has to spend another move with the queen.} Qxc3 b6 {Fianchetto: the b7 bishop fights for e4.}
          Bg5 Bb7 {Control e4 and the long diagonal.}
          f3 h6 {Ask the bishop.}
          Bh4 d5 {Hit the centre while White's development lags.}` },
        { name: 'Sämisch: 4.a3', side: true, pgn: `{White forces the trade at once and plays for the centre.}
          d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ {Take: White's pawns are doubled.} bxc3 c5 {Fix the doubled c-pawns and press on d4.}
          e3 Nc6 {Develop and add pressure to d4.} Bd3 O-O {Castle.} Ne2 b6 {The plan: ...Ba6 to attack the weak c4 pawn.}` },
        { name: '4.f3', pgn: `{White wants e4 with pawns.}
          d4 Nf6 c4 e6 Nc3 Bb4 f3 d5 {Stop e4 directly.}
          a3 Bxc3+ {Take: White's c-pawns are doubled.} bxc3 c5 {Hit d4 and the doubled pawns.}
          cxd5 Nxd5 {Your knight is excellent on d5. A dynamic, balanced fight.}` },
        { name: 'Leningrad: 4.Bg5', side: true, pgn: `{White pins the f6 knight too.}
          d4 Nf6 c4 e6 Nc3 Bb4 Bg5 h6 {Ask the bishop: keep the pin or give it up.} Bh4 c5 {Hit d4 before White develops.}
          d5 d6 {Hold e5 and keep the centre closed.}
          e3 Bxc3+ {Double White's pawns.} bxc3 e5 {Set the pawns on dark squares, where White's bishop can't attack them.}` },
      ],
    },
    {
      title: 'White avoids the Nimzo',
      about: 'Without Nc3 there\'s nothing to pin. Play the Queen\'s Indian or a Bogo-Indian check.',
      lines: [
        { name: 'Queen\'s Indian: 3.Nf3', pgn: `{White develops the king's knight instead.}
          d4 Nf6 c4 e6 Nf3 b6 {The Queen's Indian: your bishop fights for e4 and the long diagonal.}
          g3 Ba6 {Hit the c4 pawn at once.}
          b3 Bb4+ {A useful check before retreating.}
          Bd2 Be7 {Back to safety. White's bishop on d2 is now misplaced.}` },
        { name: 'Catalan set-up: 3.g3', pgn: `{White fianchettoes and plays like a Catalan.}
          d4 Nf6 c4 e6 g3 Bb4+ {Check: White has to block in a slightly awkward way.}
          Bd2 Be7 {Retreat. The bishop on d2 blocks White's queen's knight.}
          Bg2 d5 {Take your share of the centre.} Nf3 O-O {Castle.} O-O {Both sides are safe. A solid Catalan for you.}` },
      ],
    },
  ],
};
