// King's Indian Attack course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'One set-up against almost anything: Nf3, g3, Bg2, castle, d3, then e4. Push e5 and attack the king, or use the Nc3 and f4 pawn storm.',
  chapters: [
    {
      title: 'The set-up against ...d5',
      about: 'Start with 1.Nf3 and build the same position every game.',
      lines: [
        { name: 'Main set-up', pgn: `{Black plays ...d5, ...c5 and ...e6, the most common way to meet the King's Indian Attack.}
          Nf3 {Develop first and keep your options open.}
          d5 g3 {Prepare the fianchetto.}
          c5 Bg2 {The bishop on g2 will rule the long diagonal.}
          Nf6 O-O {King safety first.}
          e6 d3 {Prepare e4. Your pawns build a King's Indian Defence shape, with an extra move.}
          Nc6 Nbd2 {The knight supports e4.}
          Be7 e4 {The key break: fight for the centre.}
          O-O Re1 {Support e4, and later the e5 push.}` },
        { name: 'vs ...c6 and ...Bg4', pgn: `{Black pins your knight and builds a solid centre with ...c6, ...Nbd7 and ...e5.}
          Nf3 Nf6 g3 d5 Bg2 c6 O-O Bg4 d3 {Same set-up: get ready for e4.}
          Nbd7 Nbd2 {Support e4 with the knight.}
          e5 e4 {The key break. You challenge Black's centre and your g2 bishop comes to life.}` },
        { name: 'vs ...Bf5: hunt the bishop', pgn: `{Black develops the bishop to f5 before ...e6.}
          Nf3 Nf6 g3 {Prepare the fianchetto.} d5 Bg2 {The bishop on g2 rules the long diagonal.} c6 O-O {Castle.} Bf5 d3 {Prepare e4 and free the c1 bishop.} e6 Nh4 {Hunt the bishop: you will win the bishop pair.}
          Bg4 h3 {Ask it again.}
          Bh5 g4 {Chase it once more.}
          Bg6 Nxg6 {Take: the bishop pair is yours.}
          hxg6 Nd2 {Develop. Your next goal is e4.}` },
      ],
    },
    {
      title: 'Against the French and the Sicilian',
      about: 'Start with 1.e4 and reach the same set-up with the e5 attack.',
      lines: [
        { name: 'vs the French: the e5 attack', pgn: `{After 1.e4 e6 you play d3 and reach the classic King's Indian Attack.}
          e4 {Take the centre.}
          e6 d3 {The King's Indian Attack set-up.}
          d5 Nd2 {Support e4 with the knight.} Nf6 Ngf3 {Develop and control e5.} c5 g3 {Prepare the fianchetto.} Nc6 Bg2 {The bishop backs up e4.} Be7 O-O {Castle.} O-O Re1 {Support e4 and get ready for e5.}
          b5 e5 {Gain space and kick the f6 knight away from Black's king.}
          Nd7 Nf1 {Heads for h2 and g4, or e3, toward the kingside.}
          a5 h4 {The attack begins: h5 and Bf4 come next.}` },
        { name: 'vs the Sicilian', pgn: `{After 1.e4 c5 2.Nf3 e6 you play d3 and the same set-up.}
          e4 c5 Nf3 {Develop.} e6 d3 {Keep it flexible: the same King's Indian Attack set-up.}
          Nc6 g3 {Prepare the fianchetto.} d5 Nbd2 {Support e4 with the knight.} Nf6 Bg2 Be7 O-O O-O Re1 {Everything is in place. Next e5 or exd5.}` },
      ],
    },
    {
      title: 'Against ...g6 and the pawn storm',
      about: 'Black\'s King\'s Indian set-up, and the aggressive Nc3 and f4 plan.',
      lines: [
        { name: 'vs a big centre: ...e5', pgn: `{Black grabs the whole centre with ...d5, ...c5, ...Nc6 and ...e5.}
          Nf3 d5 g3 c5 Bg2 Nc6 O-O e5 d3 {Calm: you'll attack Black's big centre from the side.}
          Nf6 Nbd2 {Support e4, the move that hits Black's centre.}
          Be7 e4 {Strike! Black has to decide what to do about d5, and your pieces get active.}` },
        { name: 'vs ...g6 set-ups', pgn: `{Black copies your fianchetto.}
          Nf3 Nf6 g3 g6 Bg2 {Fianchetto.} Bg7 O-O {Castle.} O-O d3 {Prepare e4.} d5 Nbd2 {Support e4 with the knight.} c5 e4 {Your usual break.}
          Nc6 Re1 {Support e4 and keep the centre flexible.}` },
        { name: 'Nc3 and the f4 pawn storm', pgn: `{A different plan: the knight goes to c3, and later the f-pawn storms forward.}
          Nf3 d5 g3 c5 Bg2 Nc6 O-O {Castle.} e6 d3 {Prepare e4.} Nf6 Nc3 {Develop the knight to c3 instead of d2.}
          Be7 e4 {Hit the centre.}
          d4 Ne2 {If Black pushes past, the knight drops back and heads for the kingside.}
          e5 Ne1 {Clear the way for the f-pawn.}
          O-O f4 {Storm! The King's Indian Defence attack, with an extra move.}` },
      ],
    },
  ],
};
