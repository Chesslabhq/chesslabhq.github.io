// Fried Liver Attack course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'After 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 you attack f7 at once with 4.Ng5. If Black takes back on d5 with the knight, the famous Nxf7 sacrifice follows. Learn Black\'s best defences too.',
  chapters: [
    {
      title: 'The Fried Liver sacrifice',
      about: 'Black\'s natural 5...Nxd5? lets you sacrifice on f7.',
      lines: [
        { name: 'The sacrifice: 6.Nxf7', trap: true, pgn: `{The famous line. Black recaptures on d5 with the knight and you strike.}
          e4 {Take the centre.} e5 Nf3 {Develop and attack e5.} Nc6 Bc4 {Aim at f7.}
          Nf6 Ng5 {Two pieces hit f7 at once.}
          d5 exd5 {Take: Black's knight is drawn to d5.}
          Nxd5 Nxf7 {The sacrifice: your knight takes f7, forking queen and rook.}
          Kxf7 Qf3+ {Check: hit the king and the d5 knight together.}
          Ke6 Nc3 {Pile up on the pinned d5 knight.}
          Nb4 O-O {Castle and bring the rook toward the e-file.}
          c6 d4 {Open lines toward the exposed king. You have a huge attack.}` },
      ],
    },
    {
      title: 'Black\'s best defences',
      about: 'Strong players don\'t take back on d5 with the knight. Know what to do instead.',
      lines: [
        { name: 'The main line: 5...Na5', pgn: `{Black hits your bishop instead of recapturing.}
          e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ {Check first, so Black must block.}
          c6 dxc6 {Take: you're two pawns up for now.} bxc6 Be2 {Keep the extra pawn; the bishop drops back to safety.}
          h6 Nf3 {Retreat the knight to safety.} e4 Ne5 {The knight is safe in the centre.}
          Bd6 d4 {Support the knight. You're a pawn up; Black has some activity.}` },
        { name: 'Traxler: 4...Bc5', side: true, pgn: `{Black ignores the threat and counterattacks f2.}
          e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Bxf7+ {The safe way: take with the bishop and check.}
          Ke7 Bd5 {The bishop is safe here and blocks the d-file.}
          Rf8 O-O {Castle. You're a pawn up and Black's king is stuck in the centre.}` },
        { name: 'Ulvestad: 5...b5', side: true, pgn: `{Black deflects your bishop with ...b5.}
          e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 b5 Bf1 {The best retreat: the bishop is safe and Black's queenside is loosened. Careful: with your bishop on f1 the d5 square isn't pinned any more, so Nxf7 tricks don't work here.}` },
      ],
    },
  ],
};
