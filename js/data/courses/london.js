// London System course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'The same set-up in almost every game: d4, Bf4, e3, Nf3, c3, Nd2, Bd3 and castle. Learn the set-up once, then the handful of tricks Black tries against it.',
  chapters: [
    {
      title: 'Black plays ...d5 and ...e6',
      about: 'The classical reply. Build the set-up, keep your dark-squared bishop, and aim at Black\'s king.',
      lines: [
        { name: 'Main line: ...e6 and ...Bd6', pgn: `{Black builds a solid centre and tries to swap off your best bishop with ...Bd6.}
          d4 {Claim the centre. In the London you build the same structure whatever Black does.}
          d5 Bf4 {The signature move: the dark-squared bishop comes out before e3 can lock it in.}
          Nf6 e3 {Supports d4 and opens a path for the light-squared bishop.}
          e6 Nf3 {Develop, and control e5, the square your knight will use later.}
          Bd6 Bg3 {Don't trade on d6. On g3 the bishop stays on the same diagonal, and if Black takes it, your h-pawn opens the h-file.}
          O-O Nbd2 {On d2 the knight supports a later e4 and doesn't block your c-pawn.}
          c5 c3 {Hold d4 with a pawn. If Black ever takes on d4, you take back and keep a solid centre.}
          Nc6 Bd3 {The bishop aims at h7, the classic target once Black has castled short.}
          b6 Qe2 {Covers a6, so Black's ...Ba6 to swap off your best bishop doesn't work. Next: castle, then Ne5 or e4.}` },
        { name: '...c5 first, then ...e6', pgn: `{The most popular reply in master games: Black hits d4 at once and keeps ...e6 or ...Bf5 in reserve.}
          d4 d5 Bf4 Nf6 e3 c5 c3 {Keep d4 supported. You don't need to take on c5.}
          Nc6 Nd2 {The knight goes to d2 before f3, so a queen check on a5 or b6 never catches you unprepared.}
          e6 Ngf3 {Now the other knight comes out. It controls e5, and your set-up is almost complete.}
          Bd6 Bg3 {Same idea as always: keep the bishop, and keep it pointing at Black's queenside.}
          O-O Bd3 {Everything is in place. Plans: Ne5 with f4, or Qe2 and e4 to open the centre.}` },
        { name: '...c5 and ...Bf5', pgn: `{Black develops the light-squared bishop before ...e6.}
          d4 d5 Bf4 Nf6 e3 c5 c3 Nc6 Nd2 Bf5 Qb3 {With the bishop gone from c8, b7 has no defender. Hit it right away.}
          Qd7 Ngf3 {Black has defended, but the queen on d7 blocks the bishop's way back. Develop and keep up the pressure.}` },
      ],
    },
    {
      title: 'Black attacks b2 with ...Qb6',
      about: 'An early ...Qb6 is the most annoying try. Offer a queen trade and know the trap.',
      lines: [
        { name: '...Qb6, then ...e5', pgn: `{Black's queen hits b2 straight away. You don't need a passive defence.}
          d4 d5 Bf4 c5 e3 {Back up d4 and free your light-squared bishop.}
          Nc6 c3 {Keep d4 supported, and take the b4 square away from Black's pieces.}
          Qb6 Qb3 {Offer the queen trade. If Black takes, axb3 opens the a-file for your rook and your pawns are fine.}
          c4 Qc2 {Retreat. The queen still guards b2 from c2.}
          e5 dxe5 {Take the pawn. Black gets active pieces for it, so keep calm and finish developing.}
          Bf5 Qc1 {The only good square: the queen keeps b2 covered and gets out of the bishop's line.}` },
        { name: 'The ...Bf5 gambit: take it!', pgn: `{Many players try ...Bf5 here, hitting your queen. The bishop is loose, so take it.}
          d4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4 Qc2 Bf5 Qxf5 {Grab the bishop. Black hopes to win your rook in the corner, but you come out ahead.}
          Qxb2 Qxd5 {Another pawn, and now your queen eyes f7 and the c4 pawn.}
          Qxa1 Qb5 {Defends your b1-knight and hits b7. Black's queen is stuck in the corner while you develop around it: you're better.}` },
      ],
    },
    {
      title: 'Black plays ...g6',
      about: 'The King\'s Indian set-up. Keep your bishop safe and stay flexible.',
      lines: [
        { name: 'King\'s Indian set-up with ...c5', pgn: `{Against the fianchetto Black aims for ...c5 or ...e5. Your bishop on f4 is the piece to look after.}
          d4 Nf6 Bf4 {Same move against ...Nf6: the bishop comes out before e3.}
          g6 e3 {Solid: d4 is supported and your f1-bishop can come out.}
          Bg7 Nf3 {Develop, and keep an eye on e5 and g5.}
          O-O Be2 {Against ...g6 the bishop goes to e2: it covers g4 and h5, so Black's knights can't chase your f4-bishop.}
          d6 h3 {Makes a safe home on h2 for the bishop if Black plays ...Nh5 or ...e5.}
          c5 c3 {Keep d4 solid. Taking on c5 would only help Black develop.}
          Nc6 O-O {Castle. Typical plans: Nbd2, a4 to gain space, and Bh2 when Black plays ...e5.}` },
        { name: 'Black prepares ...e5', pgn: `{Black gets ready to push ...e5 and hit your bishop with tempo.}
          d4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3 Nbd7 O-O {Castle first. You don't need to stop ...e5.}
          Qe8 Bh2 {Step back before ...e5 arrives. On h2 the bishop still presses on e5 and can't be hit.}
          e5 c4 {Grab space in the centre. Your pieces are safe and you have the freer game.}` },
      ],
    },
    {
      title: 'Black plays an early ...c5',
      about: 'Black hits d4 before playing ...d5. Develop fast and use your lead.',
      lines: [
        { name: '...Qb6 and the b2-pawn', pgn: `{Black's queen comes out to attack b2 at once.}
          d4 Nf6 Bf4 c5 e3 {Calmly support d4. Taking on c5 would let Black develop with tempo.}
          Qb6 Nc3 {Develop and ignore b2: if Black takes it, your pieces get busy.}
          Qxb2 Nb5 {Threatens Nc7+, forking the king and the rook. Black must deal with it right away.}
          Nd5 Rb1 {Kick the queen. Your rook takes the open b-file and Black's queen is running out of squares.}` },
        { name: '...Qb6 and ...d6', pgn: `{Black defends c7 in advance before thinking about b2.}
          d4 Nf6 Bf4 c5 e3 Qb6 Nc3 d6 Bb5+ {Check first and develop. Black has to block, and you castle next.}` },
        { name: 'Early ...cxd4', pgn: `{Black swaps on d4 at once.}
          d4 Nf6 Bf4 c5 e3 cxd4 exd4 {Take back with the e-pawn: the e-file opens for your rook and d4 stays strong.}
          d5 c3 {Support d4 and give your queen the b3 square.}
          Nc6 Bd3 {The bishop's best square, pointing at h7.}
          Bg4 Qb3 {Hit b7, the pawn Black's bishop just stopped guarding.}
          Qd7 Nd2 {Develop and get ready to meet ...Bxf3 by taking back with the knight.}
          e6 Ngf3 {Your set-up is complete. Castle next, then press on the queenside or play Ne5.}` },
      ],
    },
  ],
};
