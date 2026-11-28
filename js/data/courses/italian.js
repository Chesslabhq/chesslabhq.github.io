// Italian Game course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'Bc4 aims at f7 from move three. Learn the slow, modern Italian (c3, d3, Re1, Nbd2-f1-g3), the sharp d4 main line, and how to handle Black\'s tricky third moves.',
  chapters: [
    {
      title: 'Giuoco Piano: 3...Bc5',
      about: 'Black mirrors you with ...Bc5. Choose the slow build-up or open the centre with d4.',
      lines: [
        { name: 'Slow Italian (Giuoco Pianissimo)', pgn: `{The modern main line: you keep the tension and build up slowly, like the top players do.}
          e4 {Take the centre and open lines for your queen and light-squared bishop.}
          e5 Nf3 {Develop with tempo: the knight attacks e5.}
          Nc6 Bc4 {The Italian bishop aims straight at f7, the weakest square in Black's camp.}
          Bc5 c3 {Prepare d4 and give your bishop a retreat square on c2 later.}
          Nf6 d3 {The calm approach: protect e4 and keep the tension. You can still break with d4 later.}
          d6 O-O {King safety first.}
          O-O Re1 {The rook supports e4 and backs up a future d4.}
          a6 Bb3 {Step back before ...b5 or ...d5 can hit the bishop. It still eyes f7.}
          Ba7 Nbd2 {The knight is heading for f1 and g3, the classic Italian route toward Black's king.}` },
        { name: 'Main line with d4', pgn: `{The direct approach: build a big centre straight away.}
          e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 {Strike in the centre now that c3 supports it.}
          exd4 cxd4 {A big pawn centre. Black must challenge it at once.}
          Bb4+ Bd2 {Block the check and offer to trade dark-squared bishops.}
          Bxd2+ Nbxd2 {Take back with the knight so d4 stays protected.}
          d5 exd5 {Take. Your pieces will be the more active ones.}
          Nxd5 Qb3 {Pressure on d5 and b7. Black has to defend carefully.}
          Nce7 O-O {Castle. You have an isolated d-pawn, but active pieces and an open e-file for your rook.}` },
      ],
    },
    {
      title: 'Two Knights: 3...Nf6',
      about: 'Black counterattacks e4. Defend it calmly with d3, or go for the Fried Liver (see that course).',
      lines: [
        { name: 'Quiet d3', pgn: `{Black's knight hits e4. The simple d3 keeps everything protected and avoids sharp theory.}
          e4 e5 Nf3 Nc6 Bc4 Nf6 d3 {Protect e4 calmly. Black's most aggressive ideas are now off the table.}
          Be7 O-O {Castle before doing anything in the centre.} O-O Re1 {Support e4, the pawn Black's pieces are pressing on.}
          d6 c3 {Prepare d4 and a retreat square for the bishop, just like the Pianissimo.}
          Na5 Bb5 {Keep the bishop alive: on b5 it pins nothing yet but it avoids being swapped off by the knight.}` },
        { name: '...Bc5 with d3', pgn: `{Black plays ...Nf6 and ...Bc5. It usually turns into the slow Italian.}
          e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 c3 {Prepare d4, and give the bishop a home on c2.}
          d6 O-O O-O Bb3 {Tuck the bishop away before Black can hit it with ...Na5 or ...d5.}` },
      ],
    },
    {
      title: 'Black\'s other third moves',
      about: 'Be ready for the quiet ...Be7 and the trappy ...Nd4.',
      lines: [
        { name: '...Be7 (Hungarian Defence)', side: true, pgn: `{A passive set-up: Black just wants a solid position.}
          e4 e5 Nf3 Nc6 Bc4 Be7 d4 {Against a passive move, take the centre at once.}
          d6 d5 {Gain space and kick the knight away from the centre.}
          Nb8 Bd3 {Keep e4 protected and get ready for c4, with lots of space for you.}` },
        { name: '...Nd4: don\'t take the bait', side: true, pgn: `{The Blackburne Shilling trap: Black leaves e5 hanging on purpose.}
          e4 e5 Nf3 Nc6 Bc4 Nd4 Nxd4 {Swap the knights. Never 4.Nxe5? Qg5!, hitting e5 and g2 at once.}
          exd4 O-O {Castle first. Black has wasted time with the knight, and next you hit the d4 pawn with c3 or go for e5 with Re1.}` },
      ],
    },
  ],
};
