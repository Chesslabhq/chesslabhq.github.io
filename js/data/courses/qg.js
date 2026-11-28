// Queen's Gambit course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '2.c4 attacks Black\'s centre from the side. Learn how to meet the Declined, the Accepted and the Slav, plus the Albin, Tarrasch and Chigorin surprises.',
  chapters: [
    {
      title: 'Queen\'s Gambit Declined: 2...e6',
      about: 'Black holds d5 with a pawn. Pin the knight with Bg5, or swap on d5 for the Carlsbad structure.',
      lines: [
        { name: 'Classical with Bg5', pgn: `{The oldest main line: you develop naturally and pin Black's best defender.}
          d4 {Take the centre and free your dark-squared bishop.}
          d5 c4 {The Queen's Gambit. You offer the c-pawn to pull Black's d-pawn away from the centre.}
          e6 Nc3 {Add pressure to d5.}
          Nf6 Bg5 {Pin the knight that defends d5.}
          Be7 e3 {Solid: free your light-squared bishop and protect d4.}
          O-O Nf3 {Develop your last minor piece. It covers d4 and e5.} h6 Bh4 {Keep the pin. Giving up the bishop would release the pressure on d5.}
          b6 cxd5 {Release the tension at the right moment, before ...Bb7 fights for the centre.}
          Nxd5 Bxe7 {Trade bishops first, then swap knights on d5.} Qxe7 Nxd5 {Swap knights so Black ends up with a pawn on d5 that can become a target.}
          exd5 Rc1 {Take the open c-file. Black's c-pawn is backward and your rook will press on it.}` },
        { name: 'Exchange variation', pgn: `{Swap on d5 early and play against Black's queenside: the famous minority attack.}
          d4 d5 c4 e6 Nc3 Nf6 cxd5 {Fix the pawn structure now, before Black can play ...dxc4 or ...c5.}
          exd5 Bg5 {Pin the knight and develop.}
          c6 e3 {Solid, and it opens the way for your light-squared bishop.}
          Be7 Bd3 {The bishop's best square, aiming at h7.}
          Nbd7 Qc2 {Stops ...Ne4 and connects with the bishop toward h7.}
          O-O Nge2 {The knight goes to e2 so it can head for g3 or f4, and f2-f3 with e4 stays possible.}` },
        { name: '...Nbd7 and the Elephant Trap', pgn: `{Careful here: d5 looks like it can be won, but it's a trap.}
          d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 {Don't fall for 5.cxd5 exd5 6.Nxd5?? Nxd5! 7.Bxd8 Bb4+, and Black wins back the queen with a piece extra.}
          c6 Nf3 {Develop calmly. Your position is easy to play.}
          Qa5 Nd2 {The Cambridge Springs: Black pins your c3 knight. Nd2 protects it and stops ...Ne4.}
          Bb4 Qc2 {Defend c3 again and keep your centre solid.}` },
      ],
    },
    {
      title: 'Queen\'s Gambit Accepted: 2...dxc4',
      about: 'Black takes the pawn. You will win it back; use the time to build a strong centre.',
      lines: [
        { name: 'Classical with e3', pgn: `{Black takes c4 and plans to strike back with ...c5.}
          d4 d5 c4 dxc4 e3 {Open the way for your bishop to recapture on c4.}
          Nf6 Bxc4 {Pawn back, and the bishop sits on an active diagonal.}
          e6 Nf3 {Develop the knight and get ready to castle.} c5 O-O {Castle before opening the centre.}
          a6 Bb3 {Step back before ...b5 hits the bishop.}
          cxd4 exd4 {Recapture toward the centre. You get an isolated d-pawn with active pieces.}
          Nc6 Nc3 {Develop and support a later d5 push.}` },
        { name: 'Take the centre with e4', pgn: `{The ambitious way: grab the whole centre at once.}
          d4 d5 c4 dxc4 e4 {Two big centre pawns. The c4 pawn can wait.}
          e5 Nf3 {Develop and hit e5.}
          exd4 Bxc4 {Win back the pawn with an active bishop aimed at f7.}
          Nc6 O-O {Castle first. You will win back the d4 pawn too.}` },
      ],
    },
    {
      title: 'The Slav: 2...c6',
      about: 'Black supports d5 with the c-pawn. Know the main line and a simple exchange system.',
      lines: [
        { name: 'Main line with a4', pgn: `{Black takes on c4 and tries to hold the pawn with ...b5. You stop that with a4.}
          d4 d5 c4 c6 Nf3 {Develop and protect d4 before choosing your plan.} Nf6 Nc3 {Develop and add pressure to d5.} dxc4 a4 {Stop ...b5, so Black can't keep the extra pawn.}
          Bf5 e3 {Prepare to take back on c4 with the bishop.}
          e6 Bxc4 {Pawn regained, and the bishop is active.}
          Bb4 O-O {Castle. Your plan is Qe2 and e4 to take over the centre.}
          O-O Qe2 {Prepare e4, the key central break.}` },
        { name: 'Exchange Slav', pgn: `{A simple, safe system: swap on d5 and develop easily.}
          d4 d5 c4 c6 cxd5 {A symmetrical pawn structure where you keep the first move.}
          cxd5 Nc3 {Develop and pile up on the d5 pawn.} Nf6 Bf4 {Develop the bishop outside the pawn chain before e3.}
          Nc6 e3 {Solid: protect d4 and free your light-squared bishop.} Bf5 Nf3 {Simple development. Next Bb5 or Qb3 to press on the queenside.}` },
      ],
    },
    {
      title: 'Other defences',
      about: 'Three sharp answers to 1.d4 d5 2.c4. Simple, safe ways to meet each.',
      lines: [
        { name: 'Albin Countergambit: 2...e5', side: true, pgn: `{Black gives up a pawn for a cramping pawn on d4.}
          d4 d5 c4 e5 dxe5 {Take the pawn. Black gets a pawn on d4 in return.}
          d4 Nf3 {Develop and prepare to fianchetto. Careful: never e3?? here because of ...Bb4+ and ...dxe3 tricks.}
          Nc6 g3 {The bishop goes to g2, where it attacks the d4 pawn from afar.}
          Be6 Nbd2 {Heads for b3 to attack d4 again.}
          Qd7 Bg2 {Finish developing and castle next. You keep your extra pawn.}` },
        { name: 'Tarrasch: 2...e6 and ...c5', pgn: `{Black accepts an isolated pawn for active pieces.}
          d4 d5 c4 e6 Nc3 c5 cxd5 {Swap on d5 to give Black an isolated pawn.}
          exd5 Nf3 {Develop and keep an eye on d4.} Nc6 g3 {The classic set-up: the g2 bishop will pressure d5 for the rest of the game.}
          Nf6 Bg2 {The bishop now stares straight at the d5 pawn.} Be7 O-O {Castle before going after d5.} O-O {Both sides castle. Your plan: dxc5 or Bg5 to win the d5 pawn.}` },
        { name: 'Chigorin: 2...Nc6', side: true, pgn: `{Black blocks the c-pawn with a knight and plays for piece activity.}
          d4 d5 c4 Nc6 Nc3 {Develop and add pressure to d5.}
          dxc4 Nf3 {Develop first; the c4 pawn won't run away.}
          Nf6 e4 {Take the whole centre.}
          Bg4 d5 {Gain space and push the knight away.}
          Ne5 Bf4 {Hit the knight on e5 while developing.}` },
      ],
    },
  ],
};
