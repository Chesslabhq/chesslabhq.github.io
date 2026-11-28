// Jobava London course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'The London\'s wild cousin: d4, Nc3 and Bf4. The knight jumps to b5 to hit c7, and you often castle long and attack with h4 and g4.',
  chapters: [
    {
      title: 'Black plays ...d5',
      about: 'The main set-up. Nb5 is your key idea.',
      lines: [
        { name: '...e6: the Nb5 jump', pgn: `{Black plays solidly. Your knight goes straight for c7.}
          d4 {Take the centre.}
          d5 Nc3 {The Jobava: the knight comes out before c3, eyeing b5 and e4.}
          Nf6 Bf4 {The bishop teams up with the knight to hit c7.}
          e6 Nb5 {Threatens Nxc7+. Black has to react at once.}
          Na6 e3 {Calm: protect d4 and free the light-squared bishop. The pressure stays.}
          Be7 Nf3 {Develop and protect d4.} O-O c3 {Give the b5 knight a retreat on a3 and support d4.}` },
        { name: '...c5', pgn: `{Black hits d4 straight away.}
          d4 Nf6 Nc3 {The Jobava knight comes out early.} d5 Bf4 c5 e3 {Hold the centre and get ready for Nb5.}
          cxd4 exd4 {Take back toward the centre: the e-file opens and your d4 pawn stays strong.}
          a6 Nf3 {Black has stopped Nb5, so simply develop. Next Bd3 or Be2 and castle.}` },
        { name: '...Bf5: the f3 and g4 attack', pgn: `{Black copies your bishop development.}
          d4 d5 Nc3 Nf6 Bf4 Bf5 f3 {Prepare e4 or g4 to chase the bishop.}
          e6 g4 {Kick the bishop and grab kingside space.}
          Bg6 h4 {Keep going: h5 will trap or chase the bishop again.}
          h6 e3 {Solid. You have lots of space on the kingside.}` },
      ],
    },
    {
      title: 'Black plays ...g6',
      about: 'Against the King\'s Indian set-up, go for a direct attack.',
      lines: [
        { name: 'e4, Qd2 and castle long', side: true, pgn: `{Turn it into a Pirc-style attack: Qd2, Bh6 and h4.}
          d4 Nf6 Nc3 g6 Bf4 {Develop the bishop before e4.} Bg7 e4 {Grab the centre: now it's a 150 Attack-style set-up.}
          d6 Qd2 {Prepare Bh6 to swap off Black's best defender.}
          O-O O-O-O {Castle long and get ready to storm the kingside.}
          c6 Bh6 {Trade off the g7 bishop. Then h4-h5 opens lines toward Black's king.}` },
      ],
    },
  ],
};
