// English Opening course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '1.c4 controls d5 from the side. Play it like a reversed Sicilian: Nc3, g3, Bg2 and fight for the light squares, with b4 for space on the queenside.',
  chapters: [
    {
      title: 'Against 1...e5',
      about: 'The Reversed Sicilian: you are a Sicilian player with an extra move.',
      lines: [
        { name: '...Nf6 and ...d5', pgn: `{Black plays an Open Sicilian with colours reversed.}
          c4 {Control d5 from the side.}
          e5 Nc3 {Add control of d5.}
          Nf6 g3 {Prepare the fianchetto: the g2 bishop will rule the long diagonal.}
          d5 cxd5 {Take: Black's knight will be exposed in the centre.} Nxd5 Bg2 {Hit the d5 knight along the diagonal.}
          Nb6 Nf3 {Develop and hit e5.} Nc6 O-O {Castle.} Be7 {Black develops; you're ready to expand.}
          d3 {Solid: open the way for your c1 bishop.} O-O a3 {Prepare b4 to gain space on the queenside.}
          Be6 b4 {Grab space and hit the c5 square.}` },
        { name: '...Bb4 pins the knight', pgn: `{Black pins your c3 knight, Nimzo-Indian style.}
          c4 e5 Nc3 Nf6 g3 Bb4 Bg2 {Finish the fianchetto: the g2 bishop is your best piece.}
          O-O Nf3 {Develop and hit e5. Next castle, and push e4 or Nd5 when it helps.}` },
        { name: 'Closed: ...Nc6 and ...g6', pgn: `{Black copies your fianchetto. Play on the queenside.}
          c4 e5 Nc3 Nc6 g3 {Prepare the fianchetto.} g6 Bg2 {Your bishop rules the long diagonal.} Bg7 Rb1 {Prepare b4: your play is on the queenside.}
          a5 a3 {Support b4.}
          Nge7 b4 {Open the b-file for your rook.}
          axb4 axb4 {Take back: the a-file is open for your rook.} d6 d3 {Solid. Next b5 to kick the c6 knight.}` },
      ],
    },
    {
      title: 'Against 1...c5',
      about: 'The Symmetrical English.',
      lines: [
        { name: 'Symmetrical with d4', pgn: `{Both sides fianchetto. You open the centre with d4.}
          c4 c5 Nc3 {Develop and control d5.} Nc6 g3 {Prepare the fianchetto.} g6 Bg2 {Your bishop rules the long diagonal.} Bg7 Nf3 {Develop and prepare d4.} Nf6 O-O {Castle before opening the centre.} O-O d4 {Break the symmetry and open the centre.}
          cxd4 Nxd4 {Take back toward the centre.} Nxd4 Qxd4 {Your queen is strong in the centre.}
          d6 Qd3 {Step back before ...Ng4 or ...Be6 hits it. You have a little more space.}` },
      ],
    },
    {
      title: 'Against 1...Nf6',
      about: 'Black keeps options open. Transpose to good structures.',
      lines: [
        { name: '...e6 and ...d5', pgn: `{Black plays a Queen's Gambit set-up.}
          c4 Nf6 Nc3 {Develop and control e4 and d5.} e6 Nf3 {Develop and get ready for d4.} d5 d4 {Transpose to a Queen's Gambit Declined on your terms.}
          Be7 Bf4 {The modern way: the bishop goes to f4.}
          O-O e3 {Solid: protect d4 and free your bishop.} c5 dxc5 {Take: Black has to spend a move recapturing.} Bxc5 {A balanced game where you have the easier plans.}` },
        { name: 'King\'s Indian set-up', pgn: `{Black fianchettoes and plays ...d6 and ...e5.}
          c4 Nf6 Nc3 g6 g3 {Prepare the fianchetto.} Bg7 Bg2 {Your bishop rules the long diagonal.} O-O Nf3 {Develop.} d6 O-O {Castle.} e5 d3 {Keep the centre closed and play on the queenside.}
          Nc6 Rb1 {Prepare b4.}
          a5 a3 {Support b4: open the queenside where you're stronger.}` },
      ],
    },
  ],
};
