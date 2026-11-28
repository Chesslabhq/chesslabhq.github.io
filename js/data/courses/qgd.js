// Queen's Gambit Declined course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'Hold d5 with ...e6 and develop solidly: ...Nf6, ...Be7, castle, then free your game with ...c5 or ...b6 and ...Bb7. This course also covers the Catalan, the London and the Colle.',
  chapters: [
    {
      title: 'The Queen\'s Gambit: 1.d4 d5 2.c4 e6',
      about: 'White\'s main tries against the Declined.',
      lines: [
        { name: 'Classical: 4.Bg5 (Tartakower)', pgn: `{White pins your knight. You break the pin, then set up ...b6 and ...Bb7.}
          d4 d5 {Claim your share of the centre.}
          c4 e6 {Hold d5 with a pawn. Solid and classical.}
          Nc3 Nf6 {Develop and add a defender to d5.}
          Bg5 Be7 {Break the pin calmly.}
          e3 O-O {Castle first. Your king is safe before anything happens in the centre.}
          Nf3 h6 {Ask the bishop: take or retreat?}
          Bh4 b6 {The Tartakower: your light-squared bishop goes to b7, its best diagonal.}
          cxd5 Nxd5 {Recapture with the knight to trade pieces and free your game.}
          Bxe7 Qxe7 {Take back with the queen. It's well placed on e7.} Nxd5 exd5 {Your pawn on d5 is now supported and your c8 bishop has an open diagonal.}
          Rc1 Be6 {Protect c7's neighbour and get ready for ...c5. Solid and equal.}` },
        { name: 'Exchange Variation', pgn: `{White swaps on d5 and plans a minority attack on your queenside.}
          d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 {Take back toward the centre: your c8 bishop is free now.}
          Bg5 c6 {Solid: protect d5 and give your queen the c7 or b6 square.}
          e3 Be7 {Develop and break the pin.} Bd3 Nbd7 {Heads for f8 and g6 or e6, a classic regrouping.}
          Qc2 O-O {Castle. Your king is safe and the rook can come to e8.} Nge2 Re8 {Prepare ...Nf8 and play against White's king later.}
          O-O Nf8 {The knight defends h7 and will come to g6 or e6.}` },
        { name: '5.Bf4', pgn: `{White develops the bishop to f4 instead of pinning.}
          d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 {Develop and get ready to castle.} Bf4 O-O {Castle first, then strike with ...c5.} e3 c5 {Strike the centre straight away.}
          dxc5 Bxc5 {Recapture with a developing move.}
          a3 Nc6 {Develop and add pressure to d4 and e5.} Qc2 Qa5 {Pin the knight and press on the queenside. A sharp, balanced game.}` },
      ],
    },
    {
      title: 'Against the Catalan: g3',
      about: 'White fianchettoes the bishop to g2. Take on c4 and hold or return the pawn at the right moment.',
      lines: [
        { name: 'Open Catalan', pgn: `{White's bishop on g2 presses on your queenside from afar.}
          d4 Nf6 {Develop and control e4.} c4 e6 {Prepare ...d5 and open the way for your dark-squared bishop.} g3 d5 {Take your share of the centre.} Bg2 Be7 {Develop and get ready to castle.} Nf3 O-O {Castle before taking on c4.} O-O dxc4 {Take the pawn: White has to spend time winning it back.}
          Qc2 a6 {Support ...b5 and keep the pawn as long as it's safe.}
          Qxc4 b5 {Gain space with tempo on the queen.}
          Qc2 Bb7 {Fight the g2 bishop on the long diagonal. A comfortable game.}` },
      ],
    },
    {
      title: 'Against the London and the Colle',
      about: 'White plays a system. Hit the centre with ...c5.',
      lines: [
        { name: 'vs the London', side: true, pgn: `{White plays Bf4, e3 and c3.}
          d4 d5 Bf4 Nf6 {Develop and control e4.} e3 c5 {Strike at d4 right away.}
          c3 Nc6 {Develop and pile up on d4.} Nd2 e6 {Solid: protect d5 and free your dark-squared bishop.} Ngf3 Bd6 {Challenge the f4 bishop.}
          Bg3 O-O {Castle. Your king is safe.} Bd3 b6 {The bishop goes to b7. Your plan: ...Ne7 or ...Qc7 and ...e5 later.}` },
        { name: 'vs the Colle', pgn: `{White plays e3, Bd3 and aims for e4.}
          d4 d5 Nf3 Nf6 {Develop and control e4, the square White wants.} e3 e6 {Solid: protect d5 and open a path for your bishop.} Bd3 c5 {Counterattack on d4 before White gets e4 in.}
          c3 Nc6 {Develop and add pressure on d4.} Nbd2 Bd6 {Develop the bishop to its most active square.} O-O O-O {Everything is ready. Meet e4 with ...dxe4, Nxe4 and ...Nxe4.}` },
      ],
    },
  ],
};
