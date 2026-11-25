// Play against rating-adjustable bots, optionally starting from one of your openings.
import { state, addGames, allGames, myGames, userResult } from '../store.js';
import { Chess } from '../lib.js';
import { Board } from '../board.js';
import { BOTS, botMove, hintMove, quickEval, say } from '../bot.js';
import { CATALOG } from '../data/catalog.js';
import { ANTI } from '../data/anti.js';
import { analyzer } from '../analyzer.js';
import { $, $$, esc, toast, confirmBox } from '../ui.js';

let cleanup = [];
export function destroy() { cleanup.forEach(f => f()); cleanup = []; }

const fmtLine = moves => moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + m).join(' ');
const TCS = [['', 'No clock'], ['60+0', '1 min'], ['180+2', '3 | 2'], ['300+0', '5 min'], ['600+0', '10 min'], ['900+10', '15 | 10']];
const fmtClock = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function openingOptions() {
  const out = [];
  for (const o of CATALOG) for (const l of o.lines) out.push({ group: 'Openings', label: `${o.name} — ${l.name}`, moves: l.moves, color: o.side });
  for (const a of ANTI) for (const r of a.responses) for (const l of r.lines) out.push({ group: 'Beat an opening', label: `vs ${a.name} — ${r.name}: ${l.name}`, moves: l.moves, color: a.you });
  for (const r of Object.values(state.repertoire)) out.push({ group: 'My repertoire', label: r.name, moves: r.moves.join(' '), color: r.color });
  return out;
}

let last = { botId: 'carl', rating: 1000, color: 'w', opening: '', tc: '' };
try { last = { ...last, ...JSON.parse(localStorage.getItem('cl-bot-setup') || '{}') }; } catch { /* ignore */ }

export function render(root, params) {
  destroy();
  if (params.tab === 'board') return renderBoard(root);
  if (params.moves) { last.opening = params.moves; last.custom = ''; if (params.color) last.color = params.color; }
  renderSetup(root);
}

const botTabs = active => `<div class="tabs">${[['play', '▶ Play'], ['board', '🏆 Leaderboard']].map(([k, l]) => `<button class="${k === active ? 'active' : ''}" onclick="location.hash='#/bots${k === 'board' ? '?tab=board' : ''}'">${l}</button>`).join('')}</div>`;

// ---------------------------------------------------------------- Leaderboard
function botResults() {
  const games = allGames().filter(g => g.source === 'bot' && g.botRating).sort((a, b) => a.date - b.date);
  const real = myGames().slice(0, 30).map(g => g.userColor === 'w' ? g.whiteElo : g.blackElo).filter(Boolean).sort((a, b) => a - b);
  let elo = real.length ? real[Math.floor(real.length / 2)] : 1200;
  const startElo = elo;
  const per = {};
  let streak = 0, bestWin = null;
  for (const g of games) {
    const res = userResult(g);
    const s = res === 'win' ? 1 : res === 'draw' ? .5 : 0;
    const known = BOTS.find(b => b.id === g.botId) || (!g.botId && BOTS.find(b => b.rating === g.botRating && `${g.white} ${g.black}`.includes(b.name)));
    const key = known ? known.id : `custom-${g.botRating}`;
    const p = per[key] || (per[key] = { win: 0, draw: 0, loss: 0, rating: g.botRating, name: g.botName || `Bot ${g.botRating}` });
    if (res) p[res]++;
    // assisted games (hints/takebacks) count for less
    const k = (g.hints || g.takebacks) ? 12 : 32;
    elo += k * (s - 1 / (1 + 10 ** ((g.botRating - elo) / 400)));
    streak = res === 'win' ? streak + 1 : 0;
    if (res === 'win' && (!bestWin || g.botRating > bestWin.botRating)) bestWin = { ...g, botName: g.botName || known?.name };
  }
  return { games, elo: Math.round(elo), startElo, per, streak, bestWin };
}

function renderBoard(root) {
  const R = botResults();
  const rows = BOTS.map(b => ({ type: 'bot', name: b.name, avatar: b.avatar, rating: b.rating, rec: R.per[b.id], id: b.id }));
  for (const [k, p] of Object.entries(R.per)) if (k.startsWith('custom-')) rows.push({ type: 'bot', name: p.name, avatar: '🤖', rating: p.rating, rec: p, custom: true });
  if (R.games.length) rows.push({ type: 'you', name: 'You', avatar: '🙂', rating: R.elo });
  rows.sort((a, b) => b.rating - a.rating || (a.type === 'you' ? -1 : 1));
  const youRank = rows.findIndex(r => r.type === 'you') + 1;
  const above = rows[youRank - 2], below = rows[youRank];
  const wins = R.games.filter(g => userResult(g) === 'win').length;
  const nextTarget = BOTS.filter(b => !(R.per[b.id]?.win)).sort((a, b) => a.rating - b.rating)[0];
  root.innerHTML = `
  <div class="page-head"><div><h1>🏆 Bot leaderboard</h1><p>Climb the ladder by beating stronger bots. Your bot rating moves with every game.</p></div></div>
  ${botTabs('board')}
  ${R.games.length ? `
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><span class="l">Your bot rating</span><span class="v" style="color:var(--accent)">${R.elo}</span><span class="d">${R.elo >= R.startElo ? '▲' : '▼'} ${Math.abs(R.elo - R.startElo)} since your first bot game</span></div>
    <div class="card kpi"><span class="l">Rank</span><span class="v">#${youRank}</span><span class="d">${above ? `${above.avatar} ${esc(above.name)} is next above you` : 'Top of the ladder!'}</span></div>
    <div class="card kpi"><span class="l">Record</span><span class="v">${wins}/${R.games.length}</span><span class="d">wins · 🔥 ${R.streak} win streak</span></div>
    <div class="card kpi"><span class="l">Best win</span><span class="v">${R.bestWin ? R.bestWin.botRating : '—'}</span><span class="d">${R.bestWin ? esc(R.bestWin.botName || 'bot') : 'No wins yet'}</span></div>
  </div>` : `<div class="card hero" style="margin-bottom:16px"><p style="margin:0">Play your first bot game to get your own spot on the ladder.</p></div>`}
  <div class="card" style="padding:0"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>#</th><th>Player</th><th>Rating</th><th>Your record vs them</th><th>Status</th><th></th></tr></thead>
    <tbody>${rows.map((r, i) => r.type === 'you' ? `
      <tr style="background:#17335c"><td><b>${i + 1}</b></td><td style="font-size:16px"><b>🙂 You</b></td><td><b style="font-size:16px;color:var(--accent)">${r.rating}</b></td><td class="muted">${R.games.length} games</td><td>${below ? `Ahead of ${below.avatar} ${esc(below.name)}` : ''}</td><td></td></tr>` : `
      <tr><td class="muted">${i + 1}</td><td><span style="font-size:20px">${r.avatar}</span> ${esc(r.name)}${r.custom ? ' <span class="muted small">(custom)</span>' : ''}</td><td>${r.rating}</td>
        <td>${r.rec ? `<span style="color:#a7dc75">${r.rec.win}W</span> · ${r.rec.draw}D · <span style="color:#f08a7c">${r.rec.loss}L</span>` : '<span class="muted">Not played</span>'}</td>
        <td>${r.rec?.win ? '<span class="pill win">Beaten ✓</span>' : r.rec ? '<span class="pill loss">Unbeaten</span>' : ''}</td>
        <td>${r.custom ? '' : `<button class="btn sm ${nextTarget && nextTarget.id === r.id ? 'primary' : ''}" data-play="${r.id}">${nextTarget && nextTarget.id === r.id ? 'Next challenge ▶' : 'Play'}</button>`}</td></tr>`).join('')}
    </tbody></table></div></div>
  <p class="muted small" style="margin-top:10px">Your bot rating starts from your real online rating and changes after each bot game (games where you used hints or takebacks count less). This ladder is personal — it's saved in your browser only.</p>`;
  root.querySelectorAll('[data-play]').forEach(b => b.onclick = () => {
    const bot = BOTS.find(x => x.id === b.dataset.play);
    last.botId = bot.id; last.rating = bot.rating;
    location.hash = '#/bots';
  });
}

// ---------------------------------------------------------------- Setup
function renderSetup(root) {
  const opts = openingOptions();
  const groups = [...new Set(opts.map(o => o.group))];
  if (last.opening && !opts.some(o => o.moves === last.opening)) opts.unshift({ group: 'Openings', label: fmtLine(last.opening.split(' ')), moves: last.opening, color: last.color });
  root.innerHTML = `
  <div class="page-head"><div><h1>🤖 Play bots</h1><p>Pick an opponent, set the rating, and start from any opening to practise attacking with it.</p></div></div>
  ${botTabs('play')}
  <div class="grid bots-grid">
    <div class="card">
      <h2>Choose your opponent</h2>
      <div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))" id="bt-bots">${BOTS.map(b => `
        <button class="theme-btn" data-bot="${b.id}" style="text-align:center;${b.id === last.botId ? 'border-color:var(--accent);background:#17335c' : ''}">
          <div style="font-size:34px">${b.avatar}</div><div class="tn">${esc(b.name)}</div><div class="ts"><b>${b.rating}</b></div></button>`).join('')}</div>
      <p class="muted" id="bt-style" style="margin:12px 0 0;line-height:1.5"></p>
    </div>
    <div class="card stack">
      <h2>Game settings</h2>
      <label class="field">Bot rating: <b id="bt-rval" style="font-size:20px;color:var(--accent)">${last.rating}</b>
        <input type="range" id="bt-rating" min="100" max="2800" step="50" value="${last.rating}" style="padding:0">
        <span class="hint">Drag to any strength from 100 to 2800.</span></label>
      <div class="field">I play as
        <div class="row" id="bt-color">${[['w', '⚪ White'], ['r', '🎲 Random'], ['b', '⚫ Black']].map(([v, l]) => `<button class="btn ${last.color === v ? 'primary' : ''}" data-c="${v}">${l}</button>`).join('')}</div></div>
      <label class="field">Start from
        <select id="bt-open"><option value="">Normal starting position</option>${groups.map(g => `<optgroup label="${esc(g)}">${opts.filter(o => o.group === g).map(o => `<option value="${esc(o.moves)}" data-color="${o.color}" ${o.moves === last.opening ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</optgroup>`).join('')}</select>
        <span class="hint" id="bt-open-hint"></span></label>
      <label class="field">…or choose the first moves yourself
        <input id="bt-custom" placeholder="e.g.  d4   or   e4 c5   or   1.d4 Nf6 2.c4" value="${esc(last.custom || '')}" autocomplete="off" spellcheck="false">
        <span class="hint" id="bt-custom-hint">After these moves the bot plays normally.</span></label>
      <div class="row" id="bt-chips">${[['d4', 'b', 'They play 1.d4'], ['e4', 'b', 'They play 1.e4'], ['c4', 'b', 'They play 1.c4'], ['Nf3', 'b', 'They play 1.Nf3'], ['d4', 'w', 'I play 1.d4'], ['e4', 'w', 'I play 1.e4']].map(([m, c, l]) => `<button class="btn sm" data-m="${m}" data-col="${c}">${l}</button>`).join('')}</div>
      <label class="field">Clock<select id="bt-tc">${TCS.map(([v, l]) => `<option value="${v}" ${v === last.tc ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <button class="btn primary lg" id="bt-play">▶ Play</button>
    </div>
  </div>`;

  const showBot = () => {
    const b = BOTS.find(x => x.id === last.botId);
    $('#bt-style', root).innerHTML = b ? `${b.avatar} <b>${esc(b.name)}</b> — ${esc(b.style)}${last.rating !== b.rating ? ` <span class="muted">(playing at ${last.rating})</span>` : ''}` : `Custom bot at ${last.rating}`;
  };
  const showOpen = () => {
    const sel = $('#bt-open', root);
    $('#bt-open-hint', root).textContent = sel.value ? `The game starts after: ${fmtLine(sel.value.split(' '))}` : '';
  };
  $('#bt-bots', root).onclick = e => {
    const b = e.target.closest('[data-bot]');
    if (!b) return;
    const bot = BOTS.find(x => x.id === b.dataset.bot);
    last.botId = bot.id; last.rating = bot.rating;
    $$('[data-bot]', root).forEach(x => { const on = x === b; x.style.borderColor = on ? 'var(--accent)' : ''; x.style.background = on ? '#17335c' : ''; });
    $('#bt-rating', root).value = bot.rating; $('#bt-rval', root).textContent = bot.rating;
    showBot();
  };
  $('#bt-rating', root).oninput = e => { last.rating = +e.target.value; $('#bt-rval', root).textContent = last.rating; showBot(); };
  $('#bt-color', root).onclick = e => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    last.color = b.dataset.c;
    $$('[data-c]', root).forEach(x => x.classList.toggle('primary', x === b));
  };
  const setColor = c => { last.color = c; $$('[data-c]', root).forEach(x => x.classList.toggle('primary', x.dataset.c === c)); };
  $('#bt-open', root).onchange = e => {
    const o = e.target.selectedOptions[0];
    if (o?.dataset.color) setColor(o.dataset.color);
    if (e.target.value) { $('#bt-custom', root).value = ''; showCustom(); }
    showOpen();
  };
  const showCustom = () => {
    const txt = $('#bt-custom', root).value;
    const h = $('#bt-custom-hint', root);
    if (!txt.trim()) { h.textContent = 'After these moves the bot plays normally.'; h.style.color = ''; return null; }
    const r = parseMoves(txt);
    if (r.error) { h.textContent = r.error; h.style.color = 'var(--red)'; return null; }
    h.textContent = `Starts after ${fmtLine(r.moves)} — then it's ${r.moves.length % 2 === 0 ? 'White' : 'Black'} to move and the bot plays normally.`;
    h.style.color = 'var(--accent)';
    if ($('#bt-open', root).value) { $('#bt-open', root).value = ''; showOpen(); }
    return r.moves;
  };
  $('#bt-custom', root).oninput = showCustom;
  $('#bt-chips', root).onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    $('#bt-custom', root).value = b.dataset.m;
    setColor(b.dataset.col);
    showCustom();
  };
  $('#bt-play', root).onclick = () => {
    const custom = $('#bt-custom', root).value.trim();
    if (custom) {
      const moves = showCustom();
      if (!moves) return toast('Those moves aren\'t legal — check the spelling (e.g. d4 Nf6 c4).', 'error');
      last.opening = moves.join(' ');
    } else last.opening = $('#bt-open', root).value;
    last.custom = custom;
    last.tc = $('#bt-tc', root).value;
    try { localStorage.setItem('cl-bot-setup', JSON.stringify(last)); } catch { /* ignore */ }
    const color = last.color === 'r' ? (Math.random() < .5 ? 'w' : 'b') : last.color;
    const base = BOTS.find(x => x.id === last.botId);
    const bot = base && base.rating === last.rating ? base : { id: 'custom', name: `Bot ${last.rating}`, avatar: '🤖', rating: last.rating, hello: 'Ready when you are.' };
    playGame(root, { bot, color, opening: last.opening, tc: last.tc });
  };
  showBot(); showOpen(); showCustom();
}

/** "1.d4 Nf6 2.c4" / "d4 nf6 c4" -> legal SAN list, or an error message. */
function parseMoves(text) {
  const toks = text.replace(/\d+\.(\.\.)?/g, ' ').replace(/[,;]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const c = new Chess();
  for (const t of toks) {
    let m = null;
    for (const cand of [t, t.replace(/^[nbrqk]/, x => x.toUpperCase()), t.toLowerCase()]) {
      try { m = c.move(cand); break; } catch { /* try next spelling */ }
    }
    if (!m) return { error: `"${t}" isn't a legal move there.` };
  }
  return { moves: c.history() };
}

// ---------------------------------------------------------------- Game
function playGame(root, { bot, color, opening, tc }) {
  destroy();
  const chess = new Chess();
  const openMoves = opening ? opening.split(' ') : [];
  for (const s of openMoves) chess.move(s);
  const bookPlies = chess.history().length;
  const [baseS, incS] = tc ? tc.split('+').map(Number) : [0, 0];
  const clock = tc ? { w: baseS * 1000, b: baseS * 1000, inc: incS * 1000, turnStart: null } : null;
  let over = null, thinking = false, hints = 0, takebacks = 0, alive = true;
  const botColor = color === 'w' ? 'b' : 'w';
  cleanup.push(() => { alive = false; });

  root.innerHTML = `
  <div class="page-head"><div><h1>${bot.avatar} vs ${esc(bot.name)} (${bot.rating})</h1><p>You play ${color === 'w' ? 'White' : 'Black'}${opening ? ` · from ${esc(fmtLine(openMoves))}` : ''}${tc ? ` · ${(TCS.find(t => t[0] === tc) || [, tc])[1]}` : ''}</p></div>
    <div class="row"><button class="btn" id="g-new">← New game</button></div></div>
  <div class="board-layout">
    <div class="board-col">
      <div class="player-strip"><span>${bot.avatar} ${esc(bot.name)} <span class="elo">(${bot.rating})</span></span>${clock ? `<span class="clk" id="clk-${botColor}"></span>` : ''}</div>
      <div id="g-board"></div>
      <div class="player-strip"><span>🙂 You</span>${clock ? `<span class="clk" id="clk-${color}"></span>` : ''}</div>
    </div>
    <div class="side-panel">
      <div class="sec"><div class="comment"><span style="font-size:30px">${bot.avatar}</span><div class="txt" id="g-chat" style="background:var(--bg2);padding:10px 12px;border-radius:10px">${esc(bot.hello)}</div></div></div>
      <div class="sec"><div class="puz-status turn" id="g-status"></div></div>
      <div class="sec movelist" id="g-moves" style="max-height:260px"></div>
      <div class="sec"><div class="row">
        <button class="btn" id="g-hint">💡 Hint</button>
        <button class="btn" id="g-undo">↶ Takeback</button>
        <button class="btn" id="g-flip">⇅</button>
        <button class="btn" id="g-draw">½ Offer draw</button>
        <button class="btn danger" id="g-resign">🏳 Resign</button>
      </div></div>
      <div class="sec" id="g-after"></div>
    </div>
  </div>`;

  const board = new Board($('#g-board', root), {
    orientation: color,
    dests: sq => over || thinking ? [] : chess.moves({ square: sq, verbose: true }).map(m => m.to),
    movable: c => c === color && !over && !thinking,
    inCheck: f => new Chess(f).inCheck(),
    onMove: (from, to, promo) => {
      let m;
      try { m = chess.move({ from, to, promotion: promo || 'q' }); } catch { board.render(); return; }
      afterMove(m);
    },
  });
  const chat = t => { $('#g-chat', root).textContent = t; };
  const status = (cls, html) => { const s = $('#g-status', root); s.className = 'puz-status ' + cls; s.innerHTML = html; };

  function drawMoves() {
    const h = chess.history();
    let html = '';
    for (let i = 0; i < h.length; i += 2) {
      const cell = j => j < h.length ? `<span class="mv ${j === h.length - 1 ? 'cur' : ''}" style="${j < bookPlies ? 'opacity:.6' : ''}">${h[j]}</span>` : '<span></span>';
      html += `<div class="mrow"><span class="mn">${i / 2 + 1}.</span>${cell(i)}${cell(i + 1)}</div>`;
    }
    const el = $('#g-moves', root);
    el.innerHTML = html || '<p class="muted small">No moves yet.</p>';
    el.scrollTop = el.scrollHeight;
  }
  function sync() {
    const hv = chess.history({ verbose: true });
    const lm = hv[hv.length - 1];
    board.set({ fen: chess.fen(), lastMove: lm ? [lm.from, lm.to] : null, arrows: [], marks: {} });
    drawMoves();
    drawClocks();
  }
  function drawClocks() {
    if (!clock) return;
    for (const c of ['w', 'b']) {
      let ms = clock[c];
      if (!over && clock.turnStart && chess.turn() === c) ms -= Date.now() - clock.turnStart;
      const el = $('#clk-' + c, root);
      if (el) { el.textContent = fmtClock(ms); el.style.background = chess.turn() === c && !over ? '#24406e' : ''; el.style.color = ms < 20000 ? 'var(--red)' : ''; }
      if (!over && ms <= 0 && clock.turnStart) finish(c === color ? 'loss' : 'win', 'on time');
    }
  }
  if (clock) {
    const t = setInterval(drawClocks, 200);
    cleanup.push(() => clearInterval(t));
  }
  function switchClock(mover) {
    if (!clock) return;
    if (clock.turnStart) clock[mover] -= Date.now() - clock.turnStart;
    clock[mover] += clock.inc;
    clock.turnStart = Date.now();
  }

  function checkEnd() {
    if (chess.isCheckmate()) return finish(chess.turn() === color ? 'loss' : 'win', 'by checkmate');
    if (chess.isStalemate()) return finish('draw', 'by stalemate');
    if (chess.isInsufficientMaterial()) return finish('draw', 'by insufficient material');
    if (chess.isThreefoldRepetition()) return finish('draw', 'by repetition');
    if (chess.isDraw()) return finish('draw', 'by the 50-move rule');
    return false;
  }

  function afterMove(m) {
    switchClock(m.color);
    sync();
    if (checkEnd()) return;
    if (m.color === color) {
      if (m.captured && Math.random() < .4) chat(say('capture'));
      thinkAndMove();
    } else {
      if (m.san.includes('+') && Math.random() < .5) chat(say('check'));
      status('turn', '<span class="turn-dot" style="background:' + (color === 'w' ? '#fff' : '#000') + '"></span> Your move');
    }
  }

  async function thinkAndMove() {
    thinking = true;
    status('turn', `${bot.avatar} ${esc(bot.name)} is thinking…`);
    const fen = chess.fen();
    const uci = await botMove(fen, bot.rating);
    if (!alive || over || chess.fen() !== fen) return;
    thinking = false;
    let m;
    try { m = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q' }); }
    catch { const any = chess.moves({ verbose: true })[0]; m = chess.move(any); }
    afterMove(m);
  }

  function finish(result, how) {
    if (over) return true;
    over = { result, how };
    thinking = false;
    if (clock?.turnStart) { clock[chess.turn()] -= Date.now() - clock.turnStart; clock.turnStart = null; }
    drawClocks();
    const label = result === 'win' ? '🏆 You won' : result === 'loss' ? `${bot.avatar} ${esc(bot.name)} won` : '½ Draw';
    status(result === 'win' ? 'ok' : result === 'loss' ? 'bad' : 'done', `${label} ${esc(how)}`);
    chat(say(result === 'win' ? 'lose' : result === 'loss' ? 'win' : 'draw'));
    const before = botResults().elo;
    const id = saveGame(result, how);
    const R = botResults();
    const diff = R.games.length > 1 ? R.elo - before : 0;
    $('#g-after', root).innerHTML = `<p style="margin:0 0 10px">🏆 Bot rating: <b style="font-size:18px">${R.elo}</b> ${diff ? `<b style="color:${diff > 0 ? '#a7dc75' : '#f08a7c'}">${diff > 0 ? '+' : ''}${diff}</b>` : ''} · <a href="#/bots?tab=board">Leaderboard →</a></p>
      <div class="row">
      <button class="btn primary" id="g-review">⚡ Analyse & review</button>
      <button class="btn" id="g-rematch">↻ Rematch</button>
      <button class="btn" id="g-new2">New bot</button></div>
      <p class="muted small" style="margin:8px 0 0">Saved to My Games${hints || takebacks ? ` · ${hints} hint${hints === 1 ? '' : 's'}, ${takebacks} takeback${takebacks === 1 ? '' : 's'}` : ''}. Bot games don't count towards your stats.</p>`;
    $('#g-review', root).onclick = () => { analyzer.add([id], true); location.hash = '#/review/' + encodeURIComponent(id); };
    // Rematch: swap colours, unless you're practising a specific opening line
    $('#g-rematch', root).onclick = () => playGame(root, { bot, color: opening ? color : botColor, opening, tc });
    $('#g-new2', root).onclick = () => renderSetup(root);
    return true;
  }

  function saveGame(result, how) {
    const resStr = result === 'draw' ? '1/2-1/2' : (result === 'win') === (color === 'w') ? '1-0' : '0-1';
    const names = { w: color === 'w' ? 'You' : `${bot.name} (bot)`, b: color === 'b' ? 'You' : `${bot.name} (bot)` };
    const d = new Date();
    const pgnGame = new Chess();
    chess.history().forEach(s => pgnGame.move(s));
    const hdr = { Event: 'ChessLab bot game', Site: 'ChessLab', Date: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`, White: names.w, Black: names.b, Result: resStr, TimeControl: tc || '-', Termination: how };
    if (color === 'w') hdr.BlackElo = String(bot.rating); else hdr.WhiteElo = String(bot.rating);
    for (const [k, v] of Object.entries(hdr)) pgnGame.header(k, v);
    const id = 'bot_' + Date.now();
    addGames([{
      id, source: 'bot', url: null, pgn: pgnGame.pgn(), white: names.w, black: names.b,
      whiteElo: color === 'b' ? bot.rating : null, blackElo: color === 'w' ? bot.rating : null,
      result: resStr, date: Date.now(), timeClass: 'bot', timeControl: tc || '-', rated: false,
      opening: null, eco: null, userColor: color, termination: how, botRating: bot.rating, botId: bot.id, botName: bot.name,
      hints, takebacks,
    }]);
    return id;
  }

  // ---- controls
  $('#g-hint', root).onclick = async () => {
    if (over || thinking || chess.turn() !== color) return;
    hints++;
    status('turn', '💡 Thinking of a hint…');
    const fen = chess.fen();
    const u = await hintMove(fen);
    if (!alive || chess.fen() !== fen || !u) return;
    board.set({ arrows: [{ from: u.slice(0, 2), to: u.slice(2, 4), color: 'rgba(92,139,176,.85)' }] });
    status('turn', '💡 Try the blue arrow.');
  };
  $('#g-undo', root).onclick = () => {
    if (over || thinking) return;
    let undone = 0;
    while (chess.history().length > bookPlies && (undone === 0 || chess.turn() !== color)) { chess.undo(); undone++; }
    if (!undone) return;
    takebacks++;
    sync();
    if (chess.turn() !== color) thinkAndMove();
    else status('turn', '↶ Taken back — your move');
  };
  $('#g-flip', root).onclick = () => board.flip();
  $('#g-draw', root).onclick = async () => {
    if (over || thinking) return;
    if (chess.history().length - bookPlies < 20) { chat('It\'s too early for a draw — let\'s play on!'); return; }
    const ev = await quickEval(chess.fen());
    const botView = (botColor === 'w' ? 1 : -1) * (ev.mate != null ? (ev.mate > 0 ? 1000 : -1000) : ev.cp);
    if (botView < 60) finish('draw', 'by agreement'); else chat('No thanks, I like my position.');
  };
  $('#g-resign', root).onclick = async () => {
    if (over) return;
    if (await confirmBox('Resign this game?', 'Resign')) finish('loss', 'by resignation');
  };
  $('#g-new', root).onclick = () => renderSetup(root);

  // ---- start
  sync();
  if (chess.turn() === color) { status('turn', '<span class="turn-dot" style="background:' + (color === 'w' ? '#fff' : '#000') + '"></span> Your move'); if (clock) clock.turnStart = Date.now(); }
  else { if (clock) clock.turnStart = Date.now(); thinkAndMove(); }
}
