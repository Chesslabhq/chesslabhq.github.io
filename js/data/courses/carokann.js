// Caro-Kann Defense course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: '1...c6 prepares ...d5 with rock-solid support. The golden rule: get your light-squared bishop out (to f5 or g4) before you play ...e6.',
  chapters: [
    {
      title: 'Advance Variation: 3.e5',
      about: 'White grabs space. Develop the bishop to f5, then hit the pawn chain with ...c5.',
      lines: [
        { name: 'Short system: 4.Nf3 and 5.Be2', pgn: `{The modern, quiet way to play the Advance.}
          e4 c6 {Prepare ...d5 with a pawn behind it.}
          d4 d5 {Challenge e4 straight away.}
          e5 Bf5 {Out goes the bishop before ...e6 can shut it in. That's the Caro-Kann's main idea.}
          Nf3 e6 {Now ...e6 is fine: the bishop is already outside the pawn chain.}
          Be2 c5 {Hit the base of White's pawn chain. This break is your main counterplay.}
          O-O Nc6 {Pile up on d4.}
          c3 cxd4 {Swap pawns to open the c-file for your rook.} cxd4 Nge7 {The knight heads for f5 (once the bishop moves) or c6, adding even more pressure on d4.}` },
        { name: 'Short system: 6.Be3', pgn: `{The masters' favourite: White adds a defender to d4 before castling.}
          e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3 cxd4 {Swap now: White has to recapture with a piece, and the d4 knight becomes a target.}
          Nxd4 Ne7 {Heads for c6, where it hits the d4 knight and the e5 pawn.}` },
        { name: 'Sharp 4.Nc3 and g4', pgn: `{White chases your bishop with kingside pawns.}
          e4 c6 d4 d5 e5 Bf5 Nc3 e6 {Calm: free your dark-squared bishop and protect d5.}
          g4 Bg6 {The bishop drops back but stays active on the long diagonal.}
          Nge2 c5 {Counterattack in the centre: when White pushes on the wing, hit back in the middle.}
          h4 h5 {Stop h5 from trapping your bishop.}
          Nf4 Bh7 {The bishop is safe on h7 and still aims at White's queenside.}` },
        { name: 'Tal\'s 4.h4', pgn: `{White wants to trap your bishop with h4-h5 and g4.}
          e4 c6 d4 d5 e5 Bf5 h4 h5 {Stop h4-h5 in its tracks.}
          c4 e6 {Solid. Protect d5 and get your pieces out.}
          Nc3 Ne7 {Heads for f5 or g6 and supports ...dxc4 later.}` },
      ],
    },
    {
      title: 'Classical: 3.Nc3 dxe4 4.Nxe4 Bf5',
      about: 'The main line. Your bishop comes to f5 and then g6 and h7 as White chases it.',
      lines: [
        { name: 'Main line with h4', pgn: `{White's knight hops around to chase your bishop. Stay calm and keep it alive.}
          e4 c6 d4 d5 Nc3 {Protect e4 with a knight.}
          dxe4 {Take: you give up the centre for free, easy development.} Nxe4 Bf5 {Develop with tempo: the bishop hits the e4 knight.}
          Ng3 Bg6 {Retreat but stay on the same diagonal.}
          h4 h6 {Make room so h4-h5 doesn't trap the bishop.}
          Nf3 Nd7 {Stops Ne5 from attacking your bishop.}
          h5 Bh7 {The bishop is safe on h7 and still aims at White's queenside.}
          Bd3 Bxd3 {Swap off White's best attacking piece.}
          Qxd3 e6 {Now the pawn goes to e6 with your bishop already traded off. Solid and comfortable.}` },
      ],
    },
    {
      title: 'Exchange and Panov',
      about: 'White swaps on d5. Develop actively and fight for the light squares.',
      lines: [
        { name: 'Exchange: 4.Bd3', pgn: `{White plays for a quiet game with a symmetrical structure.}
          e4 c6 d4 d5 exd5 cxd5 {Take back with the c-pawn and keep a pawn on d5.} Bd3 {White aims the bishop at h7.}
          Nc6 {Develop and press on d4.} c3 Nf6 {Develop and keep e4 under control.} Bf4 Bg4 {Get the bishop out actively. It pins the knight once it comes to f3.}
          Qb3 Qd7 {Protect b7 calmly. Your queen also supports ...Bf5 ideas.}
          Nd2 e6 {Now ...e6 is fine: your light-squared bishop is already outside.}
          Ngf3 Bxf3 {Swap off the knight so White can't use e5.}
          Nxf3 Bd6 {Challenge White's best bishop. You have a comfortable, equal game.}` },
        { name: 'Panov-Botvinnik: 4.c4', pgn: `{White plays c4 and gets an isolated d-pawn with active pieces.}
          e4 c6 d4 d5 exd5 cxd5 c4 {White attacks d5 again.}
          Nf6 {Develop and add a second defender to d5.} Nc3 e6 {Solid: d5 is protected and your bishop on f8 can come out.}
          Nf3 Bb4 {Pin the knight that guards d5.}
          cxd5 Nxd5 {Your knight lands on a great square in front of the isolated pawn.}
          Bd2 Nc6 {Develop and attack d4.} Bd3 O-O {Castle. Your king is safe before the middlegame starts.} O-O Be7 {Safe and solid. Blockade the d-pawn and aim at it later.}` },
      ],
    },
    {
      title: 'White\'s sidelines',
      about: 'The Two Knights and the Fantasy Variation.',
      lines: [
        { name: 'Two Knights: 2.Nc3 3.Nf3', pgn: `{White develops knights first and keeps d4 in reserve.}
          e4 c6 Nc3 d5 {Challenge e4, as always in the Caro-Kann.} Nf3 Bg4 {Pin the knight before playing ...e6.}
          h3 Bxf3 {Take the knight: you keep a solid pawn structure and get your pieces out quickly.}
          Qxf3 e6 {Now everything is protected and your pawns are solid.}
          d3 Nf6 {Develop. You'll follow with ...Nbd7 and ...Be7 or ...Bc5.}` },
        { name: 'Fantasy: 3.f3', side: true, pgn: `{White supports e4 with the f-pawn.}
          e4 c6 d4 d5 f3 e6 {Solid. Your bishop on f8 can come out to b4 or d6.}
          Nc3 Bb4 {Pin the knight and press on e4.}
          Bf4 Nf6 {Develop and add pressure to e4.}` },
      ],
    },
  ],
};
