// Scotch Game course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '3.d4 opens the centre at once. You get active pieces and clear plans, with much less theory than the Ruy Lopez.',
  chapters: [
    {
      title: '4...Bc5: the Classical',
      about: 'Black develops the bishop with tempo on your d4 knight.',
      lines: [
        { name: '5.Nxc6 Qf6 6.Qd2', pgn: `{The modern main line: take on c6 and defend everything with the queen.}
          e4 {Take the centre.}
          e5 Nf3 {Develop and attack e5.} Nc6 d4 {The Scotch: open the centre straight away.}
          exd4 Nxd4 {The knight dominates the centre.}
          Bc5 Nxc6 {Swap before Black can pile up on d4.}
          Qf6 Qd2 {Defends against ...Qxf2+ and keeps your pieces coordinated.}
          dxc6 Nc3 {Develop and protect e4.} Be6 Na4 {Chase the strong bishop. You'll keep the bishop pair.}` },
        { name: '5.Be3', pgn: `{Defend the knight with a developing move.}
          e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 {Support the knight and challenge the bishop.}
          Qf6 c3 {Protect d4 once more and keep b2 out of danger.}
          Nge7 Bc4 {Develop with an eye on f7.}
          O-O O-O {Both sides are castled. You have more space in the centre.}` },
      ],
    },
    {
      title: 'Black\'s other fourth moves',
      about: 'The Mieses (4...Nf6), the Steinitz (4...Qh4) and 4...Nxd4.',
      lines: [
        { name: 'Mieses: 4...Nf6', pgn: `{Black hits e4. Push past and gain space.}
          e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 {Swap so Black's pawns get doubled.}
          bxc6 e5 {Kick the knight and grab space.}
          Qe7 Qe2 {Pin back: protect e5 and stop Black winning it.}
          Nd5 c4 {Kick the knight again.}
          Ba6 b3 {Defend c4. You have more space; Black has active pieces.}` },
        { name: 'Steinitz: 4...Qh4', side: true, pgn: `{Black's queen attacks e4 at once.}
          e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3 {Defend e4 and develop.}
          Bb4 Be2 {Protect the knight and prepare to castle.}
          Qxe4 Nb5 {Hit c7. Black's queen grabbed a pawn but your pieces come with tempo.}` },
        { name: '4...Nxd4', side: true, pgn: `{Black trades knights straight away.}
          e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nxd4 Qxd4 {Your queen is powerful in the centre.}
          Ne7 Bc4 {Develop and aim at f7.}
          Ng6 O-O {Castle. You have a lead in development.}` },
      ],
    },
  ],
};
