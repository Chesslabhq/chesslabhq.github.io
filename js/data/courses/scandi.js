// Scandinavian Defense course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '1...d5 hits e4 at once, so you decide the game from move one. After 2.exd5 Qxd5 3.Nc3 the queen goes to a5 and you build a solid ...c6, ...Bf5, ...e6 set-up.',
  chapters: [
    {
      title: 'Main line: 3.Nc3 Qa5',
      about: 'The classical Scandinavian. Your queen is safe on a5 and your set-up is easy to learn.',
      lines: [
        { name: 'Main line with Bd2', pgn: `{The most common way to play it: White develops and tries to chase your queen.}
          e4 d5 {Hit e4 straight away.}
          exd5 Qxd5 {Take back. The queen will move again, but White's knight is the only piece that can chase it.}
          Nc3 Qa5 {Out of the way, pinning the knight against the king.}
          d4 Nf6 {Develop and keep an eye on e4.}
          Nf3 c6 {A safe retreat square for the queen on c7, and protection for b5 and d5.}
          Bc4 Bf5 {Develop the bishop outside the pawn chain before ...e6.}
          Bd2 e6 {Solid. Now watch for Nd5 tricks: your queen is on a5 facing the d2 bishop.}
          Nd5 Qd8 {Step back. Taking on d5 would lose material to Bxa5.}
          Nxf6+ Qxf6 {Equal: your pieces are active and your structure is healthy.}` },
        { name: 'White plays Bc4 and d3', pgn: `{A quieter set-up: White doesn't play d4.}
          e4 d5 exd5 Qxd5 Nc3 Qa5 Bc4 Nf6 {Develop and keep an eye on e4.} d3 c6 {Give the queen a retreat on c7 and control d5 and b5.} Bd2 Bf5 {The same set-up: ...c6, ...Bf5 and ...e6. Easy to remember.}` },
      ],
    },
    {
      title: 'White avoids 3.Nc3',
      about: 'When White doesn\'t hit your queen with Nc3, your queen stays active.',
      lines: [
        { name: '3.Nf3', pgn: `{White develops first and keeps c3 open for the pawn.}
          e4 d5 exd5 Qxd5 Nf3 Bg4 {Pin the knight while your queen is still centralised.}
          Be2 Nc6 {Develop and add pressure to d4.}
          d4 O-O-O {Castle long: your rook lands on d8 facing the d4 pawn. Sharp and fun.}` },
        { name: '3.d4', side: true, pgn: `{White takes the centre before developing.}
          e4 d5 exd5 Qxd5 d4 Nf6 {Develop first. Your queen is fine in the centre for now.} Nf3 Bg4 {Pin the knight and put pressure on d4.} Be2 e6 {Solid: your bishop is out, so ...e6 is fine.}
          O-O Nc6 {Pressure on d4. Next ...O-O-O or ...Be7.}` },
      ],
    },
    {
      title: 'White doesn\'t take on d5',
      about: 'Against 2.e5 and 2.Nc3, play like a good Caro-Kann or French.',
      lines: [
        { name: 'Advance: 2.e5', side: true, pgn: `{White pushes past you, like the Advance Caro-Kann.}
          e4 d5 e5 Bf5 {Get the bishop out before ...e6.}
          d4 e6 {Now ...e6 is fine: your bishop is already outside the pawn chain.} Nf3 c5 {Hit the base of White's pawn chain.}
          c3 Nc6 {Pile up on d4. A healthy French-style position with your bishop outside the chain.}` },
        { name: '2.Nc3', side: true, pgn: `{White protects e4 instead of taking.}
          e4 d5 Nc3 d4 {Grab space and kick the knight.}
          Nce2 e5 {Take the centre. Your pawns on d4 and e5 cramp White.}
          Ng3 Be6 {Develop and keep d4 protected.}` },
      ],
    },
  ],
};
