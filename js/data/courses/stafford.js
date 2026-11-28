// Stafford Gambit course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'A trappy pawn sacrifice from the Petrov: 1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6!?. Objectively risky, but full of quick knockouts. Learn the traps and what to do when White plays well.',
  chapters: [
    {
      title: 'The famous traps',
      about: 'The lines that make the Stafford famous. Opponents fall for these all the time.',
      lines: [
        { name: 'Queen trap and mate: 5.d3 Bc5 6.Bg5?', pgn: `{White grabs your queen and walks into mate.}
          e4 e5 {Meet 1.e4 with 1...e5, the way into the Stafford.} Nf3 Nf6 {The Petrov: hit e4 instead of defending e5.}
          Nxe5 Nc6 {The Stafford: offer the e5 knight a trade and the pawn as a gift.}
          Nxc6 dxc6 {Take toward the centre: your bishops and queen get open lines.}
          d3 Bc5 {Aim at f2, White's weak spot.}
          Bg5 Nxe4 {Leave your queen hanging! Taking it loses.}
          Bxd8 Bxf2+ {Check, driving the king forward.}
          Ke2 Bg4# {Checkmate.}`, trap: true },
        { name: 'Queen trap: 5.e5 Ne4 6.d3?', pgn: `{White kicks your knight and then tries to win it.}
          e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 e5 Ne4 {The knight is safe for now and eyes f2.}
          d3 Bc5 {Leave the knight: if White takes it, f2 falls.}
          dxe4 Bxf2+ {Check, pulling the king out.}
          Ke2 Bg4+ {Another check, and now the queen on d1 hangs.}
          Kxf2 Qxd1 {You win the queen.}`, trap: true },
      ],
    },
    {
      title: 'When White plays well',
      about: 'Strong opponents avoid the traps. Know your plan when they do.',
      lines: [
        { name: '5.Nc3: develop and attack', pgn: `{White develops sensibly.}
          e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 Nc3 Bc5 {Aim at f2.}
          Be2 h5 {The Stafford idea: ...Ng4 comes next, and the h-pawn supports it.}
          d3 Ng4 {Hit f2 and h2. White must defend carefully.}` },
        { name: 'White declines with 4.Nf3', pgn: `{White retreats instead of taking on c6.}
          e4 e5 Nf3 Nf6 Nxe5 Nc6 Nf3 Nxe4 {You win the pawn back at once: an equal game.}` },
      ],
    },
  ],
};
