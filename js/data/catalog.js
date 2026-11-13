// Curated repertoire catalog: popular openings plus the ones GothamChess (Levy Rozman) is known for teaching.
// Descriptions are our own summaries. Not affiliated with GothamChess.
// side: which colour plays it · vs: the first move it answers (Black only) · first: White's first move
// style: aggressive | solid | tricky · theory: 1 (little) – 3 (lots) · pop: popularity rank (1 = most popular)

export const CATALOG = [
  // ---------------------------------------------------------------- White
  {
    id: 'london', name: 'London System', side: 'w', first: 'd4', style: 'solid', theory: 1, pop: 3, gotham: true,
    desc: 'A set-up you can play against almost anything: pawns on d4-e3-c3, bishop out to f4 before e3. Very little theory, safe positions, and easy plans.',
    ideas: ['Develop Bf4 before playing e3 so the bishop isn\'t locked in.', 'Typical set-up: d4, Bf4, e3, Nf3, c3, Nbd2, Bd3, O-O.', 'Kingside attack with Ne5, Qf3 or h4 when Black castles short.', 'Meet ...c5 calmly with c3 — your centre holds.'],
    lines: [
      { name: 'vs ...d5', moves: 'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3' },
      { name: 'vs King\'s Indian set-up', moves: 'd4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3' },
    ],
  },
  {
    id: 'jobava', name: 'Jobava London', side: 'w', first: 'd4', style: 'aggressive', theory: 1, pop: 18, gotham: true,
    desc: 'The London\'s wild cousin: Nc3 instead of c3. You aim Nb5 at c7 and often attack with h4 or long castling.',
    ideas: ['Nb5 hits c7 — Black must react immediately.', 'Bf4 + Nb5 is a common double attack on c7.', 'Consider queenside castling and a kingside pawn storm.'],
    lines: [
      { name: 'Main idea Nb5', moves: 'd4 d5 Nc3 Nf6 Bf4 e6 Nb5 Na6 e3 Be7 Nf3 O-O' },
      { name: 'vs ...c5', moves: 'd4 Nf6 Nc3 d5 Bf4 c5 e3 Nc6 Nb5' },
    ],
  },
  {
    id: 'vienna', name: 'Vienna Game', side: 'w', first: 'e4', style: 'aggressive', theory: 2, pop: 12, gotham: true,
    desc: 'After 1.e4 e5, play Nc3 and often f4 — a fast attack on the f-file that club players rarely know well.',
    ideas: ['f4 opens the f-file for your rook and attacks e5.', 'Against ...Nc6, Bc4 + f4 builds pressure on f7.', 'The "Copycat" line sets a nasty Qg4 trap.'],
    lines: [
      { name: 'Vienna Gambit', moves: 'e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7 d4 O-O Bd3' },
      { name: 'vs ...Nc6', moves: 'e4 e5 Nc3 Nc6 Bc4 Nf6 d3 Bc5 f4' },
      { name: 'Copycat trap (Qg4)', moves: 'e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4' },
    ],
  },
  {
    id: 'italian', name: 'Italian Game', side: 'w', first: 'e4', style: 'solid', theory: 2, pop: 2,
    desc: 'The classic: Bc4 aims at f7. Flexible, sound, and played at every level from beginners to world champions.',
    ideas: ['c3 + d4 to build a big centre.', 'Slow version: d3, O-O, Re1, Nbd2-f1-g3.', 'Watch for Ng5 ideas against f7.'],
    lines: [
      { name: 'Giuoco Pianissimo', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3' },
      { name: 'Two Knights (quiet)', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6 c3' },
    ],
  },
  {
    id: 'friedliver', name: 'Fried Liver Attack', side: 'w', first: 'e4', style: 'tricky', theory: 2, pop: 20, gotham: true,
    desc: 'A sharp knight sacrifice on f7 against the Two Knights Defence. Deadly if Black recaptures the wrong way.',
    ideas: ['Only works after 4...d5 5.exd5 Nxd5?! — know Black\'s better 5...Na5.', 'After Nxf7 Kxf7 Qf3+, bring every piece at the exposed king.'],
    lines: [{ name: 'The sacrifice', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3' }],
  },
  {
    id: 'scotch', name: 'Scotch Game', side: 'w', first: 'e4', style: 'aggressive', theory: 2, pop: 9,
    desc: 'Open the centre immediately with 3.d4. Active pieces and clear plans, with less theory than the Ruy Lopez.',
    ideas: ['Trade on d4 and get quick development.', 'Be3 + c3 supports the d4 knight.'],
    lines: [{ name: 'Main line ...Bc5', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bc4' }],
  },
  {
    id: 'ruy', name: 'Ruy Lopez', side: 'w', first: 'e4', style: 'solid', theory: 3, pop: 5,
    desc: 'The Spanish Opening: Bb5 pressures the knight defending e5. Deep strategic play — lots of theory, lots of reward.',
    ideas: ['Long-term pressure on e5.', 'Classic plan: c3, d4, Nbd2-f1-g3.'],
    lines: [{ name: 'Closed main line', moves: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3' }],
  },
  {
    id: 'qg', name: 'Queen\'s Gambit', side: 'w', first: 'd4', style: 'solid', theory: 2, pop: 4,
    desc: 'Offer the c-pawn to undermine Black\'s centre. Rock-solid and principled.',
    ideas: ['c4 challenges d5 — the "gambit" pawn is usually won back.', 'Bg5 pins the f6 knight; play for the minority attack later.'],
    lines: [
      { name: 'vs QGD', moves: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4' },
      { name: 'Queen\'s Gambit Accepted', moves: 'd4 d5 c4 dxc4 e3 Nf6 Bxc4 e6 Nf3 c5 O-O' },
    ],
  },
  {
    id: 'danish', name: 'Danish Gambit', side: 'w', first: 'e4', style: 'tricky', theory: 1, pop: 25, gotham: true,
    desc: 'Give up two pawns for two monster bishops raking the board. Huge fun at club level.',
    ideas: ['Bc4 + Bb2 aim straight at f7 and g7.', 'Develop fast — your lead in development is the compensation.'],
    lines: [{ name: 'Double gambit', moves: 'e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2' }],
  },
  {
    id: 'english', name: 'English Opening', side: 'w', first: 'c4', style: 'solid', theory: 2, pop: 8,
    desc: 'Start with 1.c4 and play a reversed Sicilian. Flexible and positional.',
    ideas: ['Fianchetto with g3 + Bg2 to control the long diagonal.', 'Fight for d5.'],
    lines: [{ name: 'vs ...e5', moves: 'c4 e5 Nc3 Nf6 g3 d5 cxd5 Nxd5 Bg2 Nb6 Nf3 Nc6 O-O' }],
  },

  // ---------------------------------------------------------------- Black vs 1.e4
  {
    id: 'carokann', name: 'Caro-Kann Defense', side: 'b', vs: 'e4', style: 'solid', theory: 2, pop: 6, gotham: true,
    desc: 'Support ...d5 with ...c6. Super solid, and your light-squared bishop gets out before ...e6.',
    ideas: ['Develop the c8-bishop to f5 or g4 BEFORE playing ...e6.', 'Against the Advance (e5), hit back with ...c5.', 'Endgames tend to favour Black\'s healthy structure.'],
    lines: [
      { name: 'Classical', moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7' },
      { name: 'Advance', moves: 'e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 O-O Nc6' },
      { name: 'Exchange', moves: 'e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4' },
    ],
  },
  {
    id: 'najdorf', name: 'Sicilian Defense (Najdorf)', side: 'b', vs: 'e4', style: 'aggressive', theory: 3, pop: 1,
    desc: 'The most popular reply to 1.e4. Unbalanced, double-edged positions where Black plays to win.',
    ideas: ['...a6 controls b5 and prepares ...e5 or ...b5.', 'Counterplay on the c-file and with ...b5-b4.'],
    lines: [
      { name: 'English Attack (6.Be3)', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6' },
      { name: 'vs Alapin (2.c3)', moves: 'e4 c5 c3 d5 exd5 Qxd5 d4 Nf6 Nf3 e6' },
    ],
  },
  {
    id: 'french', name: 'French Defense', side: 'b', vs: 'e4', style: 'solid', theory: 2, pop: 7,
    desc: 'Answer 1.e4 with ...e6 and ...d5. A tough pawn chain and counterattacks with ...c5 and ...f6.',
    ideas: ['Attack the base of White\'s pawn chain with ...c5.', 'The c8-bishop is your problem piece — plan its route.'],
    lines: [
      { name: 'Winawer', moves: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7' },
      { name: 'Advance', moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3' },
    ],
  },
  {
    id: 'scandi', name: 'Scandinavian Defense', side: 'b', vs: 'e4', style: 'solid', theory: 1, pop: 10, gotham: true,
    desc: 'Hit e4 immediately with 1...d5. You choose the game from move one, with simple development.',
    ideas: ['Queen to a5 after Nc3 — out of the way and pinning.', 'Set-up: ...Nf6, ...c6, ...Bf5, ...e6.'],
    lines: [{ name: 'Main line ...Qa5', moves: 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Bd2 e6' }],
  },
  {
    id: 'e5', name: '1...e5 (Open Games)', side: 'b', vs: 'e4', style: 'solid', theory: 2, pop: 2,
    desc: 'The classical reply: mirror White and fight for the centre. Teaches every core principle.',
    ideas: ['Develop knights before bishops, castle early.', 'Against the Italian, ...Nf6 and ...Bc5 or ...Be7.'],
    lines: [{ name: 'vs Italian', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 c3 d6 O-O O-O' }],
  },
  {
    id: 'stafford', name: 'Stafford Gambit', side: 'b', vs: 'e4', style: 'tricky', theory: 1, pop: 30, gotham: true,
    desc: 'A trappy pawn sacrifice against the Petrov line. Objectively dubious, but full of quick knockouts at club level.',
    ideas: ['Give up e5 for fast development and traps around e4/f2.', 'Know the refutations — strong players will be ready.'],
    lines: [{ name: 'The famous trap', moves: 'e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 d3 Bc5 Bg5 Nxe4 Bxd8 Bxf2+ Ke2 Bg4#' }],
  },

  // ---------------------------------------------------------------- Black vs 1.d4
  {
    id: 'qgd', name: 'Queen\'s Gambit Declined', side: 'b', vs: 'd4', style: 'solid', theory: 2, pop: 4,
    desc: 'Hold the centre with ...d5 and ...e6. One of the most respected defences in chess.',
    ideas: ['Solid centre; free your game later with ...c5 or ...e5.', 'Against the London: ...c5, ...Nc6, ...e6, ...Bd6.'],
    lines: [
      { name: 'Classical', moves: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6' },
      { name: 'vs London', moves: 'd4 d5 Bf4 Nf6 e3 c5 c3 Nc6 Nd2 e6 Ngf3 Bd6' },
    ],
  },
  {
    id: 'kid', name: 'King\'s Indian Defense', side: 'b', vs: 'd4', style: 'aggressive', theory: 3, pop: 5,
    desc: 'Let White take the centre, then strike back with ...e5 and a kingside pawn storm.',
    ideas: ['Fianchetto with ...g6/...Bg7, then ...e5.', 'Once the centre closes: ...Ne8, ...f5, ...f4, ...g5.'],
    lines: [{ name: 'Classical', moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7' }],
  },
  {
    id: 'slav', name: 'Slav Defense', side: 'b', vs: 'd4', style: 'solid', theory: 2, pop: 8,
    desc: 'Support d5 with ...c6 — the Caro-Kann idea against 1.d4. Very sound with active bishops.',
    ideas: ['Bishop to f5 or g4 before ...e6.', 'Grab c4 when it\'s safe to hold.'],
    lines: [{ name: 'Main line', moves: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4' }],
  },
  {
    id: 'nimzo', name: 'Nimzo-Indian Defense', side: 'b', vs: 'd4', style: 'solid', theory: 3, pop: 9,
    desc: 'Pin the c3 knight with ...Bb4 and fight for e4. A top-level favourite.',
    ideas: ['Control e4 with pieces, not pawns.', 'Often give the bishop for the knight to double White\'s pawns.'],
    lines: [{ name: 'Rubinstein (4.e3)', moves: 'd4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O' }],
  },
  {
    id: 'englund', name: 'Englund Gambit', side: 'b', vs: 'd4', style: 'tricky', theory: 1, pop: 35, gotham: true,
    desc: 'Answer 1.d4 with 1...e5!? — a cheeky gambit with a famous queen trap. A surprise weapon for blitz.',
    ideas: ['...Nc6 and ...Qe7 to win e5 back.', 'The trap: if White plays Bf4 and Bc3 carelessly, ...Qc1# lands.'],
    lines: [{ name: 'The famous trap', moves: 'd4 e5 dxe5 Nc6 Nf3 Qe7 Bf4 Qb4+ Bd2 Qxb2 Bc3 Bb4 Qd2 Bxc3 Qxc3 Qc1#' }],
  },
];

export const byId = id => CATALOG.find(o => o.id === id);
export const ytSearch = name => `https://www.youtube.com/results?search_query=${encodeURIComponent('GothamChess ' + name)}`;
