// Danish Gambit course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'After 1.e4 e5 2.d4 exd4 3.c3 you offer one or two pawns for two monster bishops raking the board. Huge fun at club level. Learn the attack and Black\'s best defences.',
  chapters: [
    {
      title: 'The double gambit',
      about: 'Black takes both pawns. Develop with tempo and aim at f7 and g7.',
      lines: [
        { name: 'The attack: 5...Bb4+', pgn: `{Black grabs both pawns and checks.}
          e4 {Take the centre.} e5 d4 {Strike the centre.}
          exd4 c3 {The Danish: offer the pawn to speed up your development.}
          dxc3 Bc4 {Offer a second pawn. Your bishop goes for f7.}
          cxb2 Bxb2 {Two bishops aimed at Black's king. You're two pawns down but way ahead in development.}
          Bb4+ Nc3 {Block the check with a developing move.} Nf6 Ne2 {Develop and keep the c3 knight protected.}
          Nxe4 O-O {Castle and keep attacking: e-file and f7 are your targets.}` },
        { name: 'Black\'s best: 5...d5', pgn: `{Black gives a pawn back to free the position.}
          e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 d5 {Black returns a pawn to blunt your bishop.}
          Bxd5 {Take back with the bishop, still aiming at f7.} Nf6 Bxf7+ {Grab f7 with check.}
          Kxf7 Qxd8 {Take the queen. Black's ...Bb4+ wins yours back.} Bb4+ Qd2 {Block the check with the queen.}
          Bxd2+ Nxd2 {An endgame where your pieces are active. Roughly equal.}` },
      ],
    },
    {
      title: 'Black declines',
      about: 'Black doesn\'t take the second pawn, or hits back with ...d5.',
      lines: [
        { name: 'Declined with 3...d5', pgn: `{Black hits back in the centre.}
          e4 e5 d4 exd4 c3 d5 exd5 {Take: Black's queen has to recapture early.}
          Qxd5 cxd4 {Now you have a nice centre pawn.}
          Nc6 Nf3 {Develop and protect d4.} Bg4 Be2 {Develop calmly. A normal, equal game.}` },
        { name: 'One pawn only: 4.Nxc3', pgn: `{You take back on c3 and play a one-pawn gambit (the Göring).}
          e4 e5 d4 exd4 c3 dxc3 Nxc3 {Develop with tempo. You're a pawn down but ahead in development.}
          Nc6 Nf3 {Develop and get ready to castle.} d6 Bc4 {Aim at f7. Castle next and attack.}` },
      ],
    },
  ],
};
