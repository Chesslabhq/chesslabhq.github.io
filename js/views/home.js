// Start page: something different every visit — a random puzzle, a famous game replay, a chess fact and an opening.
import { Chess } from '../lib.js';
import { Board } from '../board.js';
import { loadPuzzles, pickPuzzle } from '../puzzledb.js';
import { CATALOG } from '../data/catalog.js';
import { $, esc } from '../ui.js';

let cleanup = [];
export function destroy() { cleanup.forEach(f => f()); cleanup = []; }

const FACTS = [
  'The fastest possible checkmate is Fool\'s Mate: 1.f3 e5 2.g4 Qh4# — just two moves each.',
  'After each side\'s first move there are already 400 possible positions.',
  'The number of possible chess games is estimated at around 10^120 — the "Shannon number" — far more than the atoms in the observable universe.',
  'Under the 50-move rule, the longest possible chess game is 5,949 moves.',
  'The word "checkmate" comes from the Persian "shāh māt", usually translated as "the king is helpless".',
  'The queen used to be one of the weakest pieces. Her long-range moves only arrived in Europe in the late 1400s.',
  'A pawn that reaches the last rank can become a queen, rook, bishop or knight — even if you already have one.',
  'Stalemate is a draw, not a win — even if one side has a queen and the other has only a king.',
  'An en passant capture has to be made immediately, on the very next move, or the chance is gone.',
  'Judit Polgár became a grandmaster at 15, breaking Bobby Fischer\'s record as the youngest ever at the time.',
  'Bobby Fischer won the 1972 World Championship against Boris Spassky in Reykjavík, at the height of the Cold War.',
  'IBM\'s Deep Blue beat world champion Garry Kasparov in a six-game match in 1997.',
  'Magnus Carlsen became world champion in 2013 and later reached the highest classical rating ever recorded, 2882.',
  'Gukesh Dommaraju became the youngest undisputed world champion in December 2024, at 18.',
  'Paul Morphy played his famous "Opera Game" in 1858 in a box at the Paris opera — during the performance.',
];

const FAMOUS = [
  { name: 'The Opera Game', who: 'Paul Morphy vs Duke Karl & Count Isouard', when: 'Paris, 1858', note: 'Morphy develops with tempo, sacrifices his queen and mates with a rook.',
    moves: 'e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#' },
  { name: 'The Immortal Game', who: 'Adolf Anderssen vs Lionel Kieseritzky', when: 'London, 1851', note: 'White gives up both rooks, a bishop and the queen — and still mates.',
    moves: 'e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#' },
  { name: 'Légal\'s Mate', who: 'A classic opening trap', when: '18th century', note: 'White "blunders" the queen, then mates with three minor pieces.',
    moves: 'e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1 Bxf7+ Ke7 Nd5#' },
  { name: 'Fool\'s Mate', who: 'The fastest checkmate possible', when: 'Two moves', note: 'Weakening your king with f3 and g4 is punished instantly.',
    moves: 'f3 e5 g4 Qh4#' },
];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const fmtLine = moves => moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + m).join(' ');

export function render(root) {
  destroy();
  const fact = pick(FACTS);
  const game = pick(FAMOUS);
  const opening = pick(CATALOG.filter(o => o.style !== 'tricky'));
  const trap = pick(CATALOG.filter(o => o.style === 'tricky'));
  root.innerHTML = `
  <div class="card hero home-hero">
    <div class="spread">
      <div style="min-width:0;flex:1 1 380px">
        <h1 style="font-size:34px;margin-bottom:6px">♞ ChessLab</h1>
        <p class="muted" style="margin:0 0 14px;font-size:15px">Analyse your games, train your weaknesses, and get better at chess — free.</p>
        <div class="insight" style="border:none;padding:0"><span class="ic">💡</span><span id="h-fact" style="line-height:1.55">${esc(fact)}</span></div>
      </div>
      <div class="row" style="flex:0 1 auto">
        <a class="btn primary lg" href="#/dashboard">My dashboard →</a>
        <button class="btn lg" id="h-shuffle" title="Show something new">🎲 Surprise me</button>
      </div>
    </div>
  </div>

  <div class="grid g2" style="margin-top:16px">
    <div class="card">
      <div class="spread"><h2 style="margin:0">🧩 Random puzzle</h2><span class="pill" id="h-pz-rating"></span></div>
      <p class="muted" id="h-pz-status" style="margin:8px 0 10px">Loading a puzzle…</p>
      <div id="h-pz-board" class="home-board"></div>
      <div class="row" style="margin-top:12px"><button class="btn" id="h-pz-hint">💡 Hint</button><button class="btn" id="h-pz-next">Another one ›</button><a class="btn ghost" href="#/puzzles?mode=rush">⚡ Puzzle Rush</a></div>
    </div>
    <div class="card">
      <div class="spread"><h2 style="margin:0">🏛 ${esc(game.name)}</h2><span class="pill">${esc(game.when)}</span></div>
      <p class="muted" style="margin:8px 0 10px">${esc(game.who)} — ${esc(game.note)}</p>
      <div id="h-g-board" class="home-board"></div>
      <div class="row" style="margin-top:12px"><button class="btn" id="h-g-play">⏸ Pause</button><button class="btn" id="h-g-restart">↺ Restart</button><span class="muted small" id="h-g-move" style="margin-left:auto"></span></div>
    </div>
  </div>

  <div class="grid g2" style="margin-top:16px">
    <a class="card" href="#/openings?op=${opening.id}" style="display:block;color:inherit">
      <div class="muted small" style="text-transform:uppercase;letter-spacing:.06em;font-weight:700">Opening to try</div>
      <h2 style="margin:6px 0">${esc(opening.name)}</h2>
      <p class="muted" style="margin:0 0 8px;line-height:1.5">${esc(opening.desc)}</p>
      <div class="small" style="color:var(--accent)">${esc(fmtLine(opening.lines[0].moves.split(' ').slice(0, 8)))} …</div>
    </a>
    <a class="card" href="#/openings?op=${trap.id}" style="display:block;color:inherit">
      <div class="muted small" style="text-transform:uppercase;letter-spacing:.06em;font-weight:700">Trap of the visit</div>
      <h2 style="margin:6px 0">🪤 ${esc(trap.name)}</h2>
      <p class="muted" style="margin:0 0 8px;line-height:1.5">${esc(trap.desc)}</p>
      <div class="small" style="color:var(--accent)">Learn it, then try it against a bot →</div>
    </a>
  </div>

  <div class="card" style="margin-top:16px">
    <h2>Jump in</h2>
    <div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">${[
      ['#/puzzles?mode=rush', '⚡', 'Puzzle Rush', 'Beat the clock'],
      ['#/bots', '🤖', 'Play bots', '100 to 2800'],
      ['#/puzzles?mode=rated', '🎯', 'Rated puzzles', 'Matched to you'],
      ['#/openings', '📖', 'Openings', 'Learn & drill'],
      ['#/analysis', '⚲', 'Analysis board', 'Stockfish, live'],
      ['#/import', '⇩', 'Import games', 'Chess.com & Lichess'],
    ].map(([h, i, t, s]) => `<a class="theme-btn" href="${h}" style="display:block"><div style="font-size:24px">${i}</div><div class="tn">${t}</div><div class="ts">${s}</div></a>`).join('')}</div>
  </div>`;

  $('#h-shuffle', root).onclick = () => render(root);
  startPuzzle(root);
  startReplay(root, game);
}

// ---------------------------------------------------------------- random puzzle (casual, doesn't touch your rating)
function startPuzzle(root) {
  let pz = null, chess = null, step = 0, busy = false, done = false, alive = true;
  cleanup.push(() => { alive = false; });
  const status = (t, color = '') => { const s = $('#h-pz-status', root); if (s) { s.textContent = t; s.style.color = color; } };
  const board = new Board($('#h-pz-board', root), {
    dests: sq => (!chess || busy || done) ? [] : chess.moves({ square: sq, verbose: true }).map(m => m.to),
    inCheck: f => new Chess(f).inCheck(),
    movable: c => !!pz && c === pz.solver && !busy && !done,
    onMove: (from, to, promo) => {
      const before = chess.fen();
      let m;
      try { m = chess.move({ from, to, promotion: promo || 'q' }); } catch { board.render(); return; }
      const uci = m.from + m.to + (m.promotion || '');
      if (uci === pz.solution[step] || chess.isCheckmate()) {
        step++;
        board.set({ fen: chess.fen(), lastMove: [from, to], marks: { [to]: 'right' }, arrows: [] });
        if (chess.isCheckmate() || step >= pz.solution.length) { done = true; status('✅ Solved! Hit "Another one" for a new puzzle.', 'var(--accent)'); return; }
        busy = true;
        setTimeout(() => {
          if (!alive) return;
          const u = pz.solution[step];
          const r = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
          step++;
          busy = false;
          board.set({ fen: chess.fen(), lastMove: [r.from, r.to], marks: {} });
          status('👍 Good — keep going!');
        }, 400);
      } else {
        busy = true;
        board.set({ fen: chess.fen(), lastMove: [from, to], marks: { [to]: 'wrong' } });
        status(`✗ ${m.san} isn't it — try again.`, 'var(--red)');
        setTimeout(() => { if (!alive) return; chess.load(before); busy = false; board.set({ fen: before, lastMove: pz.lastMove, marks: {} }); }, 700);
      }
    },
  });
  const load = async () => {
    try { await loadPuzzles(); } catch { status('Puzzles couldn\'t load — check your connection.', 'var(--red)'); return; }
    if (!alive) return;
    const p = pickPuzzle(700 + Math.floor(Math.random() * 1000));
    if (!p) return;
    pz = { ...p, solver: p.fen.split(' ')[1] };
    chess = new Chess(p.fen);
    step = 0; busy = false; done = false;
    board.set({ fen: p.fen, lastMove: p.lastMove, orientation: pz.solver, marks: {}, arrows: [] });
    $('#h-pz-rating', root).textContent = `Rated ${p.rating}`;
    status(`${pz.solver === 'w' ? 'White' : 'Black'} to move — find the best move.`);
  };
  $('#h-pz-next', root).onclick = load;
  $('#h-pz-hint', root).onclick = () => { if (pz && !done) board.set({ marks: { [pz.solution[step].slice(0, 2)]: 'hint' } }); };
  load();
}

// ---------------------------------------------------------------- famous game replay
function startReplay(root, game) {
  const moves = game.moves.split(' ');
  const board = new Board($('#h-g-board', root), { movable: () => false, inCheck: f => new Chess(f).inCheck() });
  let i = 0, playing = true, timer = null;
  const c = new Chess();
  const show = () => {
    const h = c.history({ verbose: true });
    const last = h[h.length - 1];
    board.set({ fen: c.fen(), lastMove: last ? [last.from, last.to] : null });
    const el = $('#h-g-move', root);
    if (el) el.textContent = i ? `${Math.ceil(i / 2)}${i % 2 ? '.' : '...'} ${moves[i - 1]}${i === moves.length ? ' — checkmate!' : ''}` : 'Starting position';
  };
  const stepOnce = () => {
    if (i >= moves.length) { playing = false; $('#h-g-play', root).textContent = '▶ Play'; return; }
    c.move(moves[i++]);
    show();
  };
  const run = () => { clearInterval(timer); timer = setInterval(() => { if (playing) stepOnce(); }, 1100); };
  cleanup.push(() => clearInterval(timer));
  $('#h-g-play', root).onclick = e => {
    if (i >= moves.length) { c.reset(); i = 0; show(); }
    playing = !playing;
    e.target.textContent = playing ? '⏸ Pause' : '▶ Play';
  };
  $('#h-g-restart', root).onclick = () => { c.reset(); i = 0; playing = true; $('#h-g-play', root).textContent = '⏸ Pause'; show(); };
  show();
  run();
}
