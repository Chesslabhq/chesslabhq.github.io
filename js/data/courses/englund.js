// Englund Gambit course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'Answer 1.d4 with 1...e5!? A cheeky gambit with a famous queen trap. Objectively risky, so use it as a surprise weapon in blitz.',
  chapters: [
    {
      title: 'The trap',
      about: 'The line that makes the Englund famous.',
      lines: [
        { name: 'The famous trap: ...Qc1#', pgn: `{White grabs the b-pawn's neighbour and walks into mate.}
          d4 e5 {The Englund Gambit: offer the e-pawn.}
          dxe5 Nc6 {Attack e5 straight away.}
          Nf3 Qe7 {Pile up on e5, and set the trap.}
          Bf4 Qb4+ {Check, and the b2 pawn is attacked.}
          Bd2 Qxb2 {Grab b2: the rook on a1 is hanging.}
          Bc3 Bb4 {Pin the bishop to the queen!}
          Qd2 Bxc3 {Take the bishop: the queen can't take back.}
          Qxc3 Qc1# {Checkmate.}`, trap: true },
      ],
    },
    {
      title: 'When White plays well',
      about: 'Get your pawn back with good development.',
      lines: [
        { name: '4.Nc3', pgn: `{White develops and protects nothing directly.}
          d4 e5 dxe5 Nc6 Nf3 Qe7 Nc3 Nxe5 {Win the pawn back.}
          Nd5 Nxf3+ {Swap the knights.}
          gxf3 Qd8 {Step back: your king is safe and material is level.}` },
        { name: '4.Bg5', side: true, pgn: `{White hits your queen.}
          d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 f6 {Block and challenge the e5 pawn.}
          exf6 Nxf6 {Development for the pawn: open lines for your pieces.}` },
      ],
    },
  ],
};
