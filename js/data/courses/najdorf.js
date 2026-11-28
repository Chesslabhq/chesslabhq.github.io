// Sicilian Najdorf course. Explanations are ChessLab's own; move choices checked against master games and deep engine analysis.
export default {
  intro: 'The fighting answer to 1.e4. After 5...a6 you keep options open: ...e5 to grab the centre or ...e6 for a flexible Scheveningen set-up. Plus simple answers to White\'s anti-Sicilians.',
  chapters: [
    {
      title: 'Open Sicilian: the main lines',
      about: 'After 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 White picks a set-up. Learn your answer to each.',
      lines: [
        { name: 'English Attack: 6.Be3', pgn: `{White plans f3, Qd2, castling long and a kingside pawn storm.}
          e4 c5 {The Sicilian: fight for d4 from the side and unbalance the game.}
          Nf3 d6 {Control e5 and prepare ...Nf6.}
          d4 cxd4 {Swap a wing pawn for a centre pawn.}
          Nxd4 Nf6 {Hit e4 with tempo.}
          Nc3 a6 {The Najdorf. It controls b5 and prepares ...e5 or ...b5.}
          Be3 e5 {Grab the centre and kick the d4 knight.}
          Nb3 Be6 {Develop and fight for d5, the key square in this structure.}
          f3 Be7 {Develop and get ready to castle.} Qd2 O-O {Castle short: your king's defenders are all in place.} O-O-O Nbd7 {Support ...b5 and keep d5 under control.}
          g4 b5 {Race! White attacks your king, you attack theirs. Your pawns roll first.}` },
        { name: 'Classical: 6.Bg5', pgn: `{White pins the knight and prepares f4.}
          e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 {Solid: break the pin later with ...Be7.}
          f4 Be7 {Break the pin and get ready to castle.}
          Qf3 Qc7 {Central queen, watching e5 and c-file.}
          O-O-O Nbd7 {Support ...b5 and keep e5 covered.}` },
        { name: 'Opocensky: 6.Be2', pgn: `{A quieter set-up: White castles short and plays positionally.}
          e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 {Grab the centre while White's set-up is slow.}
          Nb3 Be7 {Develop and prepare to castle.} O-O O-O {Castle, then fight for d5.} Be3 Be6 {Develop and fight for d5. A healthy position.}` },
        { name: 'Fischer-Sozin: 6.Bc4', pgn: `{White aims the bishop at e6 and f7.}
          e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bc4 e6 {Blunt the bishop: now it hits a wall on e6.}
          Bb3 b5 {Gain space and threaten ...b4.}
          O-O Be7 {Develop and get ready to castle.} Qf3 Qc7 {Defend a8 and get ready to castle.}` },
        { name: 'Aggressive: 6.f4', side: true, pgn: `{White plans e5 or f5.}
          e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 f4 e5 {Hit the d4 knight and fight for the dark squares.}
          Nf3 Nbd7 {Hold e5 firmly.}
          a4 Be7 {Develop and get ready to castle.}` },
      ],
    },
    {
      title: 'Anti-Sicilians',
      about: 'Lots of players avoid the Open Sicilian. Simple, sound answers to each.',
      lines: [
        { name: 'Alapin: 2.c3', pgn: `{White wants d4 with a pawn recapture.}
          e4 c5 c3 d5 {Hit e4 right away, before d4 arrives.}
          exd5 Qxd5 {The queen is safe in the centre: White's c3 has taken the c3 square from the knight.}
          d4 Nf6 {Develop and protect your queen.} Nf3 e6 {Solid: open the way for your dark-squared bishop.} Bd3 Nc6 {Develop and pile up on d4.} O-O cxd4 {Swap to give White an isolated d-pawn.} cxd4 Be7 {Develop calmly and castle. You'll attack d4 with ...Nb4 or ...Rd8.}
          Nc3 Qd6 {Step back before Nb5 or Nc3 tempos land. A solid, equal game.}` },
        { name: 'Moscow: 3.Bb5+', pgn: `{White checks to trade off pieces and avoid theory.}
          e4 c5 Nf3 d6 Bb5+ Bd7 {Block and offer the swap.}
          Bxd7+ Qxd7 {Take back with the queen so your knight can still go to c6.} c4 Nc6 {Develop and fight for d4.} Nc3 Nf6 {Develop and hit e4.} d4 cxd4 {Swap a wing pawn for a centre pawn.} Nxd4 g6 {A dragon-style set-up: your bishop on g7 bites on the long diagonal.}` },
        { name: 'Closed / Grand Prix: 2.Nc3', pgn: `{White plans f4 and a kingside attack.}
          e4 c5 Nc3 d6 {Control e5 and keep the centre flexible.} f4 Nc6 {Develop and control d4.} Nf3 g6 {Fianchetto: your bishop watches the long diagonal and protects your king.}
          Bb5 Bd7 {Block the pin with a developing move.} O-O Bg7 {Finish the fianchetto.} d3 a6 {Ask the bishop: take or retreat.} Bxc6 Bxc6 {You have the bishop pair. Castle and play ...b5 on the queenside.}` },
        { name: 'Smith-Morra Gambit: 2.d4 3.c3', side: true, pgn: `{White offers a pawn for quick development.}
          e4 c5 d4 cxd4 {Take: now White decides whether to gambit.} c3 Nf6 {Decline politely: hit e4 instead of taking.}
          e5 Nd5 {The knight is well placed in the centre.} Nf3 Nc6 {Develop and put pressure on e5 and d4.} cxd4 d6 {Challenge the e5 pawn.}
          Bc4 Nb6 {Step back with tempo on the bishop.} Bb5 dxe5 {Take: White's centre is gone.} Nxe5 Bd7 {Equal: White's attack is gone and you have a solid game.}` },
      ],
    },
  ],
};
