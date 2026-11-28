// King's Indian Defense course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'Let White build a big centre, then strike back with ...e5 and, once the centre is closed, a kingside pawn storm: ...Ne8 or ...Nd7, ...f5, ...f4, ...g5. The same plan works against nearly every White set-up.',
  chapters: [
    {
      title: 'Classical: 5.Nf3 and 6.Be2',
      about: 'The main line. Learn the famous Mar del Plata race: White attacks on the queenside, you attack the king.',
      lines: [
        { name: 'Mar del Plata: 9.Ne1', pgn: `{The most famous King's Indian line. Both sides attack on opposite wings.}
          d4 Nf6 {Develop and control e4 without committing a pawn.}
          c4 g6 {Prepare the fianchetto.}
          Nc3 Bg7 {The bishop on g7 is the soul of the King's Indian: it bites on the long diagonal.}
          e4 d6 {Hold e5 so White can't push e5 and kick your knight.}
          Nf3 O-O {King safety first.}
          Be2 e5 {Strike the centre. This is the key King's Indian break.}
          O-O Nc6 {Pile up on d4. White usually answers by closing the centre.}
          d5 Ne7 {The knight heads toward the kingside to support ...f5.}
          Ne1 Nd7 {Clear the f-pawn's path and keep c5 covered.}
          Nd3 f5 {Here comes the attack. Your f-pawn storms toward White's king.}` },
        { name: 'Bayonet: 9.b4', pgn: `{White rushes the queenside pawns to open lines fast.}
          d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 b4 Nh5 {Clear the way for ...f5 and eye f4.}
          Re1 f5 {Attack! The kingside is where your play is.}
          Ng5 Nf6 {Bring the knight back to defend and fight for e4.}` },
      ],
    },
    {
      title: 'White\'s other systems',
      about: 'The Sämisch, Four Pawns, Averbakh and Fianchetto. One plan for each.',
      lines: [
        { name: 'Sämisch: 5.f3 (Panno)', pgn: `{White supports e4 with f3 and often castles long.}
          d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O {Castle first: your king is safe before the fight starts.} Be3 Nc6 {The Panno: you'll hit back on the queenside with ...a6 and ...b5.}
          Nge2 a6 {Prepare ...b5 to open lines.}
          Qd2 Rb8 {Support ...b5. Play on the side where White's king is heading.}` },
        { name: 'Four Pawns: 5.f4', pgn: `{White grabs maximum space. Undermine the pawns quickly.}
          d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O {Castle before striking at the centre.} Nf3 c5 {Hit d4 at once, before White can consolidate.}
          d5 e6 {Open the e-file against White's king.}
          Be2 exd5 {Open the e-file.} cxd5 Bg4 {Swap off the f3 knight, a key defender of e5.}
          O-O Nbd7 {Fight for e5. White's big centre has become a target.}` },
        { name: 'Averbakh: 6.Bg5', pgn: `{White pins with Bg5 to stop ...e5.}
          d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O {Castle first.} Bg5 c5 {Strike the centre from the other side.}
          d5 h6 {Ask the bishop to decide.}
          Be3 e6 {Open lines in the centre while White's king is still in the middle.}` },
        { name: 'Fianchetto: 3.g3', pgn: `{White fianchettoes too. A quieter, positional game.}
          d4 Nf6 c4 g6 Nf3 Bg7 {The King's Indian bishop: it bites on the long diagonal.} g3 O-O {Castle.} Bg2 d6 {Keep e5 under control and get ready for ...Nc6.} O-O Nc6 {Pressure on d4 and get ready for ...e5 or ...a6 and ...Rb8.}
          Nc3 a6 {The Panno idea: ...Rb8 and ...b5 open the queenside.}` },
        { name: 'vs the London', side: true, pgn: `{White plays Bf4, e3 and h3. Prepare ...e5 to gain space.}
          d4 Nf6 Bf4 g6 {Prepare the fianchetto.} e3 Bg7 {Your bishop bites on the long diagonal.} Nf3 O-O {Castle.} Be2 d6 {Prepare ...e5, your key break.} h3 Nbd7 {Support ...e5.}
          O-O Qe8 {Unpin in advance and back up ...e5.}
          Bh2 e5 {You get your favourite King's Indian structure.}` },
      ],
    },
  ],
};
