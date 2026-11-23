// Puzzle Rush: solve as many puzzles as you can. They get harder as you go; three wrong answers ends the run.
import { state, save, bump } from '../store.js';
import { Chess } from '../lib.js';
import { Board } from '../board.js';
import { loadPuzzles, pickPuzzle } from '../puzzledb.js';
import { $, esc, fmtDate } from '../ui.js';

const MODES = {
  3: { name: '3 Minutes', icon: '⚡', ms: 180000, desc: 'Fast and furious. 3 strikes and you\'re out.' },
  5: { name: '5 Minutes', icon: '⏱', ms: 300000, desc: 'A little more time to think. 3 strikes.' },
  survival: { name: 'Survival', icon: '🛡', ms: null, desc: 'No clock. Keep going until your 3rd strike.' },
};
const START = 500, STEP = 55, MAX_TARGET = 2850, STRIKES = 3;

let stop = null;
export function destroyRush() { stop?.(); stop = null; }

const rushData = () => state.pstats.rush || (state.pstats.rush = { best: {}, runs: [] });
const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

export function renderRush(root, tabs) {
  destroyRush();
  const d = rushData();
  root.innerHTML = `
  <div class="page-head"><div><h1>⚡ Puzzle Rush</h1><p>Puzzles start easy and get harder. Solve as many as you can — three wrong answers ends your run.</p></div></div>
  ${tabs}
  <div class="grid g3">${Object.entries(MODES).map(([k, m]) => `
    <div class="card" style="text-align:center">
      <div style="font-size:38px">${m.icon}</div><h2 style="margin:6px 0">${m.name}</h2>
      <p class="muted" style="min-height:38px">${m.desc}</p>
      <div class="kpi" style="align-items:center;margin-bottom:12px"><span class="l">Your best</span><span class="v">${d.best[k] ?? '—'}</span></div>
      <button class="btn primary lg" style="width:100%" data-rush="${k}">▶ Start</button>
    </div>`).join('')}</div>
  <div class="card" style="margin-top:16px"><h2>Recent runs</h2>${d.runs.length ? `<table class="tbl"><tbody>${d.runs.slice(0, 8).map(r => `<tr><td>${MODES[r.mode]?.icon || ''} ${MODES[r.mode]?.name || esc(r.mode)}</td><td><b>${r.score}</b> solved</td><td class="muted">hardest ${r.top || '—'}</td><td class="muted">${fmtDate(r.t)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No runs yet. Your scores will show up here.</p>'}</div>`;
  root.querySelectorAll('[data-rush]').forEach(b => b.onclick = async () => {
    b.disabled = true; b.textContent = 'Loading…';
    try { await loadPuzzles(); play(root, b.dataset.rush, tabs); }
    catch (e) { b.disabled = false; b.textContent = '▶ Start'; root.querySelector('.page-head p').textContent = e.message; }
  });
}

function play(root, modeKey, tabs) {
  destroyRush();
  const mode = MODES[modeKey];
  const seen = new Set();
  const results = [];   // { ok, rating, puzzle }
  let pz = null, chess = null, step = 0, busy = false, over = false, timer = null;
  const timeouts = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timeouts.delete(t); if (!over) fn(); }, ms); timeouts.add(t); };
  const endAt = mode.ms ? Date.now() + mode.ms : null;
  stop = () => { over = true; clearInterval(timer); timeouts.forEach(clearTimeout); };

  root.innerHTML = `
  <div class="page-head"><div><h1>${mode.icon} Puzzle Rush: ${mode.name}</h1><p id="rs-turn"></p></div>
    <div class="row"><button class="btn danger" id="rs-quit">End run</button></div></div>
  <div class="board-layout">
    <div class="board-col"><div id="rs-board"></div></div>
    <div class="side-panel">
      <div class="sec" style="text-align:center">
        <div class="spread">
          <div class="kpi"><span class="l">Score</span><span class="v" id="rs-score" style="font-size:42px;color:var(--accent)">0</span></div>
          ${mode.ms ? '<div class="kpi"><span class="l">Time</span><span class="v" id="rs-time" style="font-size:42px"></span></div>' : ''}
          <div class="kpi"><span class="l">Strikes</span><span class="v" id="rs-strikes" style="letter-spacing:2px"></span></div>
        </div>
      </div>
      <div class="sec"><div class="puz-status turn" id="rs-status">Find the best move</div></div>
      <div class="sec"><div class="muted small" style="margin-bottom:6px">Puzzle rating: <b id="rs-rating"></b></div><div id="rs-trail" style="display:flex;flex-wrap:wrap;gap:4px"></div></div>
    </div>
  </div>`;

  const board = new Board($('#rs-board', root), {
    dests: sq => (!chess || busy || over) ? [] : chess.moves({ square: sq, verbose: true }).map(m => m.to),
    inCheck: f => new Chess(f).inCheck(),
    movable: c => !!pz && c === pz.solver && !busy && !over,
    onMove: (f, t, p) => onMove(f, t, p),
  });
  const status = (cls, txt) => { const s = $('#rs-status', root); s.className = 'puz-status ' + cls; s.textContent = txt; };
  const solved = () => results.filter(r => r.ok).length;
  const misses = () => results.length - solved();

  function drawStats() {
    $('#rs-score', root).textContent = solved();
    $('#rs-strikes', root).textContent = '❌'.repeat(misses()) + '▫️'.repeat(Math.max(0, STRIKES - misses()));
    $('#rs-trail', root).innerHTML = results.map(r => `<span title="${r.rating}" style="min-width:34px;text-align:center;padding:2px 4px;border-radius:4px;font-size:11px;font-weight:700;color:#fff;background:${r.ok ? 'var(--accent2)' : 'var(--red)'}">${r.rating}</span>`).join('');
  }
  function next() {
    const target = Math.min(MAX_TARGET, START + results.length * STEP);
    const p = pickPuzzle(target, seen);
    if (!p) return end();
    seen.add(p.id);
    pz = { ...p, solver: p.fen.split(' ')[1] };
    chess = new Chess(p.fen);
    step = 0; busy = false;
    board.set({ fen: p.fen, lastMove: p.lastMove, orientation: pz.solver, arrows: [], marks: {}, badge: null });
    $('#rs-turn', root).textContent = `${pz.solver === 'w' ? 'White' : 'Black'} to move`;
    $('#rs-rating', root).textContent = p.rating;
    status('turn', `Find the best move for ${pz.solver === 'w' ? 'White' : 'Black'}`);
  }
  function result(ok) {
    results.push({ ok, rating: pz.rating, puzzle: pz });
    bump('puzzles');
    if (ok) bump('solved');
    drawStats();
    if (misses() >= STRIKES) { busy = true; later(end, ok ? 0 : 500); return; }
    busy = true;
    later(next, ok ? 220 : 550);
  }
  function onMove(from, to, promo) {
    if (over || busy) return;
    let m;
    try { m = chess.move({ from, to, promotion: promo || 'q' }); } catch { board.render(); return; }
    const uci = m.from + m.to + (m.promotion || '');
    if (uci === pz.solution[step] || chess.isCheckmate()) {
      step++;
      board.set({ fen: chess.fen(), lastMove: [from, to], marks: { [to]: 'right' }, arrows: [] });
      if (chess.isCheckmate() || step >= pz.solution.length) { status('ok', '✅ Solved!'); return result(true); }
      busy = true;
      later(() => {
        const u = pz.solution[step];
        const r = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
        step++;
        board.set({ fen: chess.fen(), lastMove: [r.from, r.to], marks: {}, arrows: [] });
        busy = false;
        status('turn', '👍 Keep going!');
      }, 220);
    } else {
      board.set({ fen: chess.fen(), lastMove: [from, to], marks: { [to]: 'wrong' }, arrows: [] });
      status('bad', `✗ ${m.san} — strike!`);
      result(false);
    }
  }
  function end() {
    if (over) return;
    stop();
    const score = solved();
    const d = rushData();
    const oldBest = d.best[modeKey] ?? 0;
    const isBest = score > oldBest;
    if (isBest) d.best[modeKey] = score;
    const top = Math.max(0, ...results.filter(r => r.ok).map(r => r.rating));
    d.runs.unshift({ mode: modeKey, score, top, t: Date.now() });
    d.runs.length = Math.min(d.runs.length, 50);
    save('pstats');
    const missed = results.filter(r => !r.ok);
    root.innerHTML = `
    <div class="page-head"><div><h1>${mode.icon} Run over</h1><p>${mode.name}</p></div></div>
    <div class="card hero" style="text-align:center">
      <div class="muted">You solved</div><div style="font-size:64px;font-weight:800;color:var(--accent);line-height:1.1">${score}</div>
      <p style="font-size:16px;margin:6px 0">${isBest && score ? '🏆 New personal best!' : `Your best: ${d.best[modeKey] ?? 0}`}</p>
      <p class="muted">Hardest puzzle solved: ${top || '—'}</p>
      <div class="row" style="justify-content:center"><button class="btn primary lg" id="rs-again">↻ Play again</button><button class="btn lg" id="rs-menu">All modes</button></div>
    </div>
    ${missed.length ? `<div class="card"><h2>Puzzles you missed</h2>${missed.map(r => `<div class="insight"><span class="ic">❌</span><span style="flex:1">Rated <b>${r.rating}</b> · ${r.puzzle.solver === 'w' ? 'White' : 'Black'} to move</span><a class="btn sm" href="#/analysis?fen=${encodeURIComponent(r.puzzle.fen)}">Analyse</a> <a class="btn sm ghost" href="${r.puzzle.url}" target="_blank" rel="noopener">Lichess ↗</a></div>`).join('')}</div>` : ''}`;
    $('#rs-again', root).onclick = () => play(root, modeKey, tabs);
    $('#rs-menu', root).onclick = () => renderRush(root, tabs);
  }

  $('#rs-quit', root).onclick = end;
  if (endAt) {
    const tick = () => {
      const left = endAt - Date.now();
      const el = $('#rs-time', root);
      if (el) { el.textContent = fmt(left); el.style.color = left < 20000 ? 'var(--red)' : ''; }
      if (left <= 0) end();
    };
    timer = setInterval(tick, 200);
    tick();
  }
  drawStats();
  next();
}
