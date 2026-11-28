// Vienna Game course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'After 1.e4 e5 2.Nc3 you keep f4 in reserve. Against ...Nf6 you play the Vienna Gambit; against ...Nc6 or ...Bc5 you develop with Bc4 and still hit with f4.',
  chapters: [
    {
      title: 'The Vienna Gambit: 2...Nf6 3.f4',
      about: 'The main battleground. Know the 3...d5 main line and what to do if Black takes on f4.',
      lines: [
        { name: 'Main line 3...d5', pgn: `{Black's best answer: hit back in the centre right away.}
          e4 {Take the centre.}
          e5 Nc3 {The Vienna: develop and keep the f-pawn free to advance.}
          Nf6 f4 {The gambit. You hit e5 and want to open the f-file for your rook.}
          d5 fxe5 {Take, gaining space. Your e5 pawn chases the f6 knight away.}
          Nxe4 Nf3 {Develop and protect e5. Black's knight on e4 looks strong but can be challenged.}
          Be7 d4 {Build a strong centre and open the way for your dark-squared bishop.}
          O-O Bd3 {Challenge the e4 knight and aim at h7.}
          f5 exf6 {Take en passant to open the f-file for your rook.}
          Bxf6 O-O {Castle. Your rook lands on the half-open f-file and your pieces are active.}` },
        { name: 'Black takes: 3...exf4', side: true, pgn: `{Black grabs the pawn. Push past the knight and get your pawn back later.}
          e4 e5 Nc3 Nf6 f4 exf4 e5 {Kick the knight away from its best square.}
          Ng8 Nf3 {Develop, and stop ...Qh4+.}
          d6 d4 {Take the centre. The f4 pawn will drop off later.}
          dxe5 Qe2 {Pin the e5 pawn and get ready to recapture it with good development.}` },
      ],
    },
    {
      title: 'Black plays 2...Nc6',
      about: 'Develop with Bc4, keep d3 solid, and use f4 when the time is right.',
      lines: [
        { name: 'Bc4 and f4', pgn: `{Black's most solid reply. Develop the bishop first and keep f4 as your weapon.}
          e4 e5 Nc3 Nc6 Bc4 {Aim at f7. Your f-pawn is still free to advance later.}
          Nf6 d3 {Protect e4 so Black's ...Nxe4 tricks don't work.}
          Bc5 f4 {Now the f-pawn goes: you hit e5 and want to open the f-file toward Black's king.}
          d6 Nf3 {Develop and support the f4 pawn. Castling short comes next.}` },
        { name: '...Na5 hits the bishop', pgn: `{Black's most popular answer: chase your bishop off its diagonal.}
          e4 e5 Nc3 Nc6 Bc4 Nf6 d3 Na5 Nge2 {Develop. If Black takes on c4, you take back with the pawn and keep a solid centre.}
          Nxc4 dxc4 {Take back toward the centre. The d-file opens for your queen and the c4 pawn controls d5.}` },
        { name: 'The Copycat trap', trap: true, pgn: `{When Black copies you with ...Bc5, the queen jumps out and hits g7 and f7.}
          e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4 {Hits g7 and gets ready for Qxg7 or, after ...Qf6, the deadly Nd5.}
          g6 Qf3 {Now the target is f7. Black must defend it again.}
          Nf6 Nge2 {Develop and keep the f-pawn free. Next d3, and you can still push f4.}` },
        { name: 'Copycat trap: ...Qf6? loses', pgn: `{The most natural defence of g7 walks into a knight jump.}
          e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4 Qf6 Nd5 {Hits the queen and c7, and Nxc7+ is coming.}
          Qxf2+ Kd1 {Black grabbed a pawn with check, but now your threats come first.}
          Kf8 Nh3 {Kick the queen away. Black's king is stuck and you'll win material.}`, trap: true },
      ],
    },
    {
      title: 'Black plays 2...Bc5',
      about: 'Claim the bishop pair and the centre.',
      lines: [
        { name: 'Na4 grabs the bishop pair', side: true, pgn: `{Black develops the bishop to its best diagonal straight away.}
          e4 e5 Nc3 Bc5 Nf3 {Develop and attack e5.}
          d6 Na4 {Chase the bishop. You'll swap your knight for it and keep the bishop pair.}
          Bb6 Nxb6 {Take it: two bishops are an advantage for the rest of the game.}
          axb6 d4 {Open the centre for your bishops.}` },
      ],
    },
  ],
};
