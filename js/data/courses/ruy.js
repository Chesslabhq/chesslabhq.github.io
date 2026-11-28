// Ruy Lopez course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '3.Bb5 puts lasting pressure on the knight that defends e5. The classic plan: castle, Re1, c3 and d4, then Nbd2-f1-g3. This course covers the Closed Ruy, the Berlin, the Open, the Marshall and Black\'s sharp sidelines.',
  chapters: [
    {
      title: 'Closed Ruy Lopez',
      about: 'The main road: 3...a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3.',
      lines: [
        { name: 'Chigorin: 9...Na5', pgn: `{The classical main line. Black swaps off or pushes back your Spanish bishop.}
          e4 {Take the centre.}
          e5 Nf3 {Attack e5.}
          Nc6 Bb5 {The Spanish bishop: it attacks the defender of e5.}
          a6 Ba4 {Keep the pin. Taking on c6 now gives nothing because e5 is still defended.}
          Nf6 O-O {Castle. e4 is "hanging" but ...Nxe4 runs into Re1 and d4.}
          Be7 Re1 {Protect e4 for good.}
          b5 Bb3 {The bishop moves to its best diagonal, aiming at f7.}
          d6 c3 {Prepare d4 and give the bishop a retreat square on c2.}
          O-O h3 {Stop ...Bg4 pinning your f3 knight before you play d4.}
          Na5 Bc2 {Keep the bishop: on c2 it still aims at Black's kingside.}
          c5 d4 {Strike in the centre now that everything is ready.}
          Qc7 Nbd2 {The knight heads for f1 and g3, the classic Spanish manoeuvre.}` },
        { name: 'Breyer: 9...Nb8', pgn: `{Black reroutes the knight to d7.}
          e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 {The Breyer: the knight goes to d7 to support e5.}
          d4 {Take the centre while Black's knight is on the move.} Nbd7 Nbd2 {Develop the knight. It will head for f1 and g3.} Bb7 Bc2 {Keep the bishop safe from ...Na5 or ...c5-c4.}
          Re8 Nf1 {On its way to g3.} Bf8 Ng3 {The knight reaches g3, eyeing f5 and h5. Classic Spanish pressure.}` },
      ],
    },
    {
      title: 'Black\'s solid defences',
      about: 'The Berlin and the Open Ruy.',
      lines: [
        { name: 'Anti-Berlin: 4.d3', pgn: `{Against the Berlin, protect e4 with d3 and avoid the famous endgame.}
          e4 e5 Nf3 Nc6 Bb5 Nf6 {The Berlin: hit e4 at once.}
          d3 {Protect e4 calmly. You keep more pieces on the board.}
          Bc5 c3 {Prepare d4 and a retreat for the bishop.}
          O-O O-O {Castle.} d6 h3 {Stop ...Bg4.}
          a6 Ba4 {Keep the bishop. It will come back to c2 or b3.}
          Ba7 Re1 {Build up slowly. A rich middlegame with chances for both sides.}` },
        { name: 'Open Ruy: 5...Nxe4', pgn: `{Black grabs the e4 pawn to free their game.}
          e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 {Open the centre while Black's king is still in the middle.}
          b5 Bb3 {Keep the bishop aimed at f7.} d5 dxe5 {Gain space; the e5 pawn cramps Black.}
          Be6 Nbd2 {Challenge the e4 knight.}
          Nc5 c3 {Keep the bishop and prepare to meet ...d4.}
          d4 Ng5 {A typical tactic: the knight jumps in and hits Black's knight and bishop.}` },
      ],
    },
    {
      title: 'Marshall Attack',
      about: 'Black gives a pawn for a fierce attack. Know the main line and how to survive.',
      lines: [
        { name: 'Marshall main line', pgn: `{After 8...d5 Black sacrifices a pawn to throw pieces at your king.}
          e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 {Prepare d4. This is the moment Black can play the Marshall gambit.} d5 {The Marshall gambit.}
          exd5 {Accept the pawn.} Nxd5 Nxe5 {Take a second pawn.} Nxe5 Rxe5 {Recapture. Your rook is active on e5.} c6 {Black's pieces flood toward your kingside.}
          d4 {Support the rook and open the c1 bishop's diagonal.}
          Bd6 Re1 {Bring the rook back to defend your king.} Qh4 g3 {Block the queen's attack on h2.}
          Qh3 Be3 {Develop and cover the dark squares.}
          Bg4 Qd3 {Defend f1 and the light squares around your king.}
          Rae8 Nd2 {Finish development. You're a pawn up: survive the pressure and it counts.}` },
      ],
    },
    {
      title: 'Sharp sidelines',
      about: 'The Schliemann and the Steinitz.',
      lines: [
        { name: 'Schliemann: 3...f5', side: true, pgn: `{Black counterattacks e4 with the f-pawn.}
          e4 e5 Nf3 Nc6 Bb5 f5 d3 {The calm answer: protect e4 and keep it simple.}
          fxe4 dxe4 {Take back. Your centre is solid.} Nf6 O-O {Castle.} Bc5 Nc3 {Develop. Black's kingside is a little loose after ...f5.}
          d6 Bc4 {Aim at g8 and stop Black castling comfortably.}` },
        { name: 'Steinitz Defence: 3...d6', side: true, pgn: `{A solid but passive defence of e5.}
          e4 e5 Nf3 Nc6 Bb5 d6 d4 {Hit e5 again: Black has to give up the centre.}
          Bd7 Nc3 {Develop and add pressure to the centre.} Nf6 O-O {Castle.} Be7 Re1 {Support e4 and keep the tension.} exd4 Nxd4 {You have more space and freer pieces.}
          O-O Bf1 {Keep the bishop: trading would free Black's game.}` },
      ],
    },
  ],
};
