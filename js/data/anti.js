// "How do I play against…?" — practical counter-plans for openings club players run into.
// you: the colour YOU play against it · match: tests the Lichess opening name of your games
// Each plan offers simple responses with key lines to learn and drill (all lines checked for legality).

export const ANTI = [
  // ================================================================ You are White
  {
    id: 'sicilian', name: 'Sicilian Defense', you: 'w', first: '1.e4 c5', match: n => /Sicilian/.test(n),
    plan: 'The Sicilian is Black\'s most ambitious reply. You don\'t need 20 moves of Open Sicilian theory — the Alapin (2.c3) builds a big centre with d4 and keeps things simple, while the Smith-Morra gambits a pawn for fast, attacking development.',
    avoid: ['Don\'t open the centre with d4 early unless you know the theory — Black\'s counterplay on the c-file is fast.', 'In the Alapin, after ...d5 exd5 Qxd5, develop with d4 and Nf3 — don\'t chase the queen with Nc3 too early.', 'Watch the a7-g1 diagonal: ...Qb6 often hits b2 and f2 at once.'],
    responses: [
      { name: 'Alapin (2.c3)', style: 'solid', theory: 1, desc: 'Prepare d4 with c3 so you can recapture with a pawn and keep a big centre.', lines: [
        { name: 'vs 2...d5', moves: 'e4 c5 c3 d5 exd5 Qxd5 d4 Nf6 Nf3 e6 Be2 Nc6 O-O' },
        { name: 'vs 2...Nf6', moves: 'e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3 Nc6 cxd4 d6 Bc4' },
      ] },
      { name: 'Smith-Morra Gambit', style: 'aggressive', theory: 2, desc: 'Give a pawn for a lead in development, open files and pressure on d6 and f7.', lines: [
        { name: 'Main line', moves: 'e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 e6 O-O Nf6 Qe2 Be7 Rd1' },
      ] },
    ],
  },
  {
    id: 'french', name: 'French Defense', you: 'w', first: '1.e4 e6', match: n => /French/.test(n),
    plan: 'The French locks the centre. Grab space with the Advance (3.e5) and support your d4 pawn — Black\'s light-squared bishop will struggle for the rest of the game.',
    avoid: ['After e5, protect d4: Black hits it with ...c5, ...Nc6 and ...Qb6.', 'Don\'t let Black play ...f6 and break your centre for free — keep pieces ready to recapture on e5.'],
    responses: [
      { name: 'Advance Variation', style: 'aggressive', theory: 2, desc: 'Push e5, support d4 with c3 and Nf3, and attack on the kingside.', lines: [
        { name: 'Main line', moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 c4 Nbd2' },
      ] },
      { name: 'Exchange Variation', style: 'solid', theory: 1, desc: 'Trade on d5 for a symmetrical, easy-to-play position.', lines: [
        { name: 'Simple set-up', moves: 'e4 e6 d4 d5 exd5 exd5 Bd3 Nc6 c3 Bd6 Nf3' },
      ] },
    ],
  },
  {
    id: 'carokann', name: 'Caro-Kann Defense', you: 'w', first: '1.e4 c6', match: n => /Caro-Kann/.test(n),
    plan: 'The Caro-Kann is super solid. The Advance (3.e5) gains space and fights Black\'s bishop on f5 — chase it with g4 or quietly develop and squeeze.',
    avoid: ['Don\'t trade into a dull endgame — Black\'s structure is better.', 'After ...Bf5, watch your b2 pawn: ...Qb6 ideas come up a lot.'],
    responses: [
      { name: 'Advance Variation', style: 'aggressive', theory: 2, desc: 'Space with e5, then develop and attack the f5-bishop.', lines: [
        { name: 'Short system', moves: 'e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3' },
      ] },
      { name: 'Two Knights', style: 'solid', theory: 1, desc: 'Develop knights first and pick up the bishop pair after ...Bg4.', lines: [
        { name: 'vs ...Bg4', moves: 'e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6 d4' },
      ] },
    ],
  },
  {
    id: 'scandi', name: 'Scandinavian Defense', you: 'w', first: '1.e4 d5', match: n => /Scandinavian/.test(n),
    plan: 'Take on d5 and develop with tempo against Black\'s queen. Nc3 gains time, then d4, Nf3, Bc4 and quick castling.',
    avoid: ['Don\'t try to win the queen by force — just develop with tempo.', 'Watch for ...Bg4 pinning your f3 knight.'],
    responses: [
      { name: 'Main line 3.Nc3', style: 'solid', theory: 1, desc: 'Hit the queen, then develop naturally.', lines: [
        { name: 'vs ...Qa5', moves: 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Bd2 e6 Qe2' },
        { name: 'vs 2...Nf6', moves: 'e4 d5 exd5 Nf6 d4 Nxd5 Nf3 Bg4 Be2 e6 O-O' },
      ] },
    ],
  },
  {
    id: 'pirc', name: 'Pirc / Modern Defense', you: 'w', first: '1.e4 d6 / 1.e4 g6', match: n => /Pirc|Modern Defense|Robatsch/.test(n),
    plan: 'Black gives you the centre. Take it, then launch the "150 Attack": Be3, Qd2, castle long and storm with h4-h5 to trade off the g7 bishop.',
    avoid: ['Don\'t overextend with f4 too early if you\'re not ready.', 'Remember Black\'s counter: ...c5 or ...e5 to hit your centre.'],
    responses: [
      { name: '150 Attack', style: 'aggressive', theory: 1, desc: 'Be3 + Qd2, aiming Bh6 to trade the fianchettoed bishop.', lines: [
        { name: 'Main plan', moves: 'e4 d6 d4 Nf6 Nc3 g6 Be3 Bg7 Qd2 O-O f3 c6 O-O-O' },
      ] },
    ],
  },
  {
    id: 'stafford', name: 'Stafford Gambit', you: 'w', first: '1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6', match: n => /Stafford/.test(n),
    plan: 'The Stafford is a trap-based gambit. Take the pawn, then play safe developing moves. The key move is Be2 — it covers g4 and h5 and kills most tricks.',
    avoid: ['NEVER play Bg5 attacking the queen — ...Nxe4! wins and can end in mate.', 'Don\'t grab more material with e5 early.', 'Castle quickly and keep your f2 square protected.'],
    responses: [
      { name: 'Safe line with Be2', style: 'solid', theory: 1, desc: 'd3, Be2, Nc3, O-O — boring, safe, and you\'re just a pawn up.', lines: [
        { name: 'Refutation idea', moves: 'e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 d3 Bc5 Be2 h5 Nc3' },
      ] },
    ],
  },
  {
    id: 'englund', name: 'Englund Gambit', you: 'w', first: '1.d4 e5', match: n => /Englund/.test(n),
    plan: 'Take the pawn and develop. Nc3 defends b2-c3 tricks, and simple moves keep the extra pawn safely.',
    avoid: ['Avoid Bf4 + Bd2 + Bc3 — that\'s exactly the famous ...Qc1# trap.', 'Keep your b2 pawn covered when Black\'s queen comes to b4.'],
    responses: [
      { name: 'Develop with Nc3', style: 'solid', theory: 1, desc: 'Return nothing, just develop.', lines: [
        { name: 'Safe set-up', moves: 'd4 e5 dxe5 Nc6 Nf3 Qe7 Nc3 Nxe5 e4' },
      ] },
    ],
  },
  {
    id: 'kidw', name: 'King\'s Indian Defense', you: 'w', first: '1.d4 Nf6 … g6', match: n => /King's Indian Defense/.test(n),
    plan: 'Against the King\'s Indian, a London set-up avoids Black\'s sharpest attacking lines and gives you an easy plan.',
    avoid: ['If you allow ...e5 and a closed centre, expect a kingside pawn storm — know where your king is safe.'],
    responses: [
      { name: 'London set-up', style: 'solid', theory: 1, desc: 'Bf4, e3, Nf3, Be2, h3 — sidestep the theory.', lines: [
        { name: 'Main plan', moves: 'd4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3 c5 c3' },
      ] },
    ],
  },

  // ================================================================ You are Black
  {
    id: 'london', name: 'London System', you: 'b', first: '1.d4 … Bf4', match: n => /London System/.test(n),
    plan: 'The London is slow and solid. Hit it early with ...c5 and ...Qb6 — the b2 pawn is the London\'s weak spot once the bishop leaves c1.',
    avoid: ['Don\'t play passively — let the London set up and it gets a free kingside attack.', 'Watch for Nb5 ideas if White plays Nc3 (Jobava).'],
    responses: [
      { name: '...c5 & ...Qb6', style: 'aggressive', theory: 1, desc: 'Attack b2 straight away and gain space with ...c4.', lines: [
        { name: 'Main idea', moves: 'd4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4 Qc2 Bf5 Qc1 e6' },
      ] },
    ],
  },
  {
    id: 'jobava', name: 'Jobava London', you: 'b', first: '1.d4 … Nc3 & Bf4', match: n => /Jobava/.test(n),
    plan: 'White wants Nb5 hitting c7. A simple ...a6 takes that square away for good, then develop calmly.',
    avoid: ['Don\'t allow Nb5 + Bxc7 forks — check c7 every move until ...a6.'],
    responses: [
      { name: '...a6 set-up', style: 'solid', theory: 1, desc: 'Stop Nb5, then ...e6, ...Bd6 and castle.', lines: [
        { name: 'Simple plan', moves: 'd4 Nf6 Nc3 d5 Bf4 a6 e3 e6' },
      ] },
    ],
  },
  {
    id: 'italian', name: 'Italian Game & Fried Liver', you: 'b', first: '1.e4 e5 2.Nf3 Nc6 3.Bc4', match: n => /Italian|Giuoco|Two Knights|Fried Liver/.test(n),
    plan: 'Play the Two Knights (3...Nf6). Against quiet d3 just develop. If White goes for Ng5 hitting f7, the right reply is ...d5 and then ...Na5! — NOT ...Nxd5, which walks into the Fried Liver.',
    avoid: ['After 4.Ng5 d5 5.exd5, never play 5...Nxd5 — Nxf7! is the Fried Liver attack.', 'Don\'t ignore f7 — it\'s only defended by your king early on.'],
    responses: [
      { name: 'Two Knights (quiet)', style: 'solid', theory: 1, desc: 'Develop, castle, play ...d6 and ...Be7.', lines: [
        { name: 'vs d3', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6 c3' },
      ] },
      { name: 'vs Ng5 (anti-Fried Liver)', style: 'aggressive', theory: 2, desc: '...d5 and ...Na5 — you give a pawn but get great play.', lines: [
        { name: 'Main line 5...Na5', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5' },
      ] },
    ],
  },
  {
    id: 'ruy', name: 'Ruy Lopez', you: 'b', first: '1.e4 e5 2.Nf3 Nc6 3.Bb5', match: n => /Ruy Lopez/.test(n),
    plan: 'The Berlin Defence is the most solid answer — it heads into a queenless middlegame where White has no easy attack.',
    avoid: ['Don\'t panic about "losing castling" in the Berlin endgame — your king is safe without queens.'],
    responses: [
      { name: 'Berlin Defence', style: 'solid', theory: 2, desc: 'Trade queens early and defend a very solid position.', lines: [
        { name: 'Berlin endgame', moves: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8' },
      ] },
    ],
  },
  {
    id: 'scotch', name: 'Scotch Game', you: 'b', first: '1.e4 e5 2.Nf3 Nc6 3.d4', match: n => /Scotch/.test(n),
    plan: 'Take on d4 and play ...Nf6. After Nxc6 bxc6 e5, the queen move ...Qe7 pins the e5 pawn and gives you active play.',
    avoid: ['After e5, don\'t let your f6 knight get stuck — ...Qe7 and ...Nd5 are the way.'],
    responses: [
      { name: 'Mieses line', style: 'solid', theory: 2, desc: 'Standard, reliable reply.', lines: [
        { name: 'Main line', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4' },
      ] },
    ],
  },
  {
    id: 'vienna', name: 'Vienna Game', you: 'b', first: '1.e4 e5 2.Nc3', match: n => /Vienna/.test(n),
    plan: 'Meet the Vienna with ...Nf6. If White plays f4, strike in the centre with ...d5 — opening the position favours you.',
    avoid: ['Against the "Copycat" (...Nc6, ...Bc5 vs Bc4), watch Qg4 hitting g7 — have ...Kf8 or ...Qf6 ready.'],
    responses: [
      { name: '...Nf6 and ...d5', style: 'solid', theory: 1, desc: 'Central counter-strike against the gambit.', lines: [
        { name: 'vs Vienna Gambit', moves: 'e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7' },
      ] },
    ],
  },
  {
    id: 'qg', name: 'Queen\'s Gambit', you: 'b', first: '1.d4 d5 2.c4', match: n => /Queen's Gambit/.test(n),
    plan: 'Decline with ...e6 (QGD) or ...c6 (Slav). Hold d5, develop, castle, and free your position later with ...c5 or ...e5.',
    avoid: ['If you take on c4, don\'t try to hold the pawn with ...b5 — it usually backfires.'],
    responses: [
      { name: 'Queen\'s Gambit Declined', style: 'solid', theory: 2, desc: 'The classic, rock-solid set-up.', lines: [
        { name: 'Classical', moves: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6' },
      ] },
      { name: 'Slav', style: 'solid', theory: 2, desc: 'Support d5 with ...c6 and develop the bishop to f5.', lines: [
        { name: 'Main line', moves: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4' },
      ] },
    ],
  },
  {
    id: 'english', name: 'English Opening', you: 'b', first: '1.c4', match: n => /English Opening/.test(n),
    plan: 'Play 1...e5 — a reversed Sicilian. Take central space and develop naturally.',
    avoid: ['Don\'t let White\'s g2 bishop dominate the long diagonal — challenge it or block it with ...c6.'],
    responses: [
      { name: 'Reversed Sicilian', style: 'solid', theory: 2, desc: '...e5, ...Nf6, ...d5 and a free game.', lines: [
        { name: 'Main line', moves: 'c4 e5 Nc3 Nf6 g3 d5 cxd5 Nxd5 Bg2 Nb6 Nf3 Nc6 O-O Be7' },
      ] },
    ],
  },
  {
    id: 'kingsgambit', name: 'King\'s Gambit', you: 'b', first: '1.e4 e5 2.f4', match: n => /King's Gambit/.test(n),
    plan: 'You don\'t have to take the pawn. The Classical Decline (2...Bc5) stops White castling and keeps a healthy game.',
    avoid: ['If you accept with ...exf4, don\'t cling to the extra pawn at the cost of development.'],
    responses: [
      { name: 'Classical Decline', style: 'solid', theory: 1, desc: '...Bc5 on the a7-g1 diagonal stops White castling.', lines: [
        { name: 'Main idea', moves: 'e4 e5 f4 Bc5 Nf3 d6 c3 Nf6 d4 exd4 cxd4 Bb4+' },
      ] },
    ],
  },
  {
    id: 'wayward', name: 'Early Queen Attack (Qh5 / Scholar\'s Mate)', you: 'b', first: '1.e4 e5 2.Qh5', match: n => /Wayward Queen|Parham|Danvers|King's Pawn Game: Napoleon/.test(n),
    plan: 'Very common at club level. Defend e5 with ...Nc6, block the f7 attack with ...g6, then develop with tempo by kicking the queen.',
    avoid: ['Never play ...Nf6?? while the queen and bishop both hit f7 — Qxf7 is mate.', 'Don\'t panic — the early queen is a target, not a threat, once f7 is covered.'],
    responses: [
      { name: '...Nc6, ...g6, ...Nf6', style: 'solid', theory: 1, desc: 'Cover f7, then chase the queen while developing.', lines: [
        { name: 'Safe defence', moves: 'e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6 Ne2 Bg7' },
      ] },
    ],
  },
];

export const antiById = id => ANTI.find(a => a.id === id);
