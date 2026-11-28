// Slav Defense course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'Support d5 with ...c6 so your light-squared bishop can still come out to f5 or g4: the Caro-Kann idea against 1.d4. Very sound, with clear plans.',
  chapters: [
    {
      title: 'Main lines',
      about: 'The classical Slav and White\'s quieter 4.e3.',
      lines: [
        { name: 'Main line: 4.Nc3 dxc4', pgn: `{Take on c4, then get your bishop out before White's e4 arrives.}
          d4 d5 {Claim the centre.}
          c4 c6 {The Slav: hold d5 with a pawn and keep the c8 bishop's diagonal open.}
          Nf3 Nf6 {Develop and protect d5 again.}
          Nc3 dxc4 {Take the pawn: White must spend time getting it back.}
          a4 Bf5 {Develop the bishop outside the pawn chain, stopping e4.}
          e3 e6 {Now ...e6 is fine: the bishop is already out.}
          Bxc4 Bb4 {Pin the knight and keep e4 under control.}
          O-O Nbd7 {Develop and prepare to meet e4 calmly.}
          Qe2 O-O {Castle. If White plays e4, your bishop drops back to g6.}` },
        { name: 'Quiet: 4.e3', pgn: `{White protects c4 and plays slowly.}
          d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 {Bishop out first: the whole point of the Slav.}
          Nc3 e6 {Solid.}
          Nh4 Bg6 {Keep the bishop. If White takes, ...hxg6 gives you a half-open h-file.}
          Nxg6 hxg6 {Your h-file rook is now active.}
          Bd3 Nbd7 {Develop and prepare ...Bd6 and ...dxc4 or ...e5.}` },
      ],
    },
    {
      title: 'Exchange Slav',
      about: 'White swaps on d5 for a symmetrical game.',
      lines: [
        { name: 'Exchange: 3.cxd5', pgn: `{A symmetrical position. Develop actively and you're fine.}
          d4 d5 c4 c6 cxd5 cxd5 {Take back and keep a pawn on d5.} Nc3 Nf6 {Develop and protect d5.} Bf4 Nc6 {Develop and put pressure on d4.}
          e3 Bf5 {Copy White: your bishop is active outside the chain.}
          Nf3 e6 {Solid. Next ...Bd6 or ...Be7 and castle.}` },
      ],
    },
  ],
};
