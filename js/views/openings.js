// Openings: learn lines from the Lichess opening library, see the repertoire you actually play,
// and drill lines from memory with spaced repetition.
import { state, save, myGames, userResult, openingName } from '../store.js';
import { Chess } from '../lib.js';
import { Board } from '../board.js';
import { parseGame } from '../analysis.js';
import { loadBook, inBook, openingOf } from '../openings.js';
import { $, esc, toast, pct, fmtDate, clsIcon, CLS } from '../ui.js';
import { CATALOG, byId, ytSearch } from '../data/catalog.js';
import { recommend, openingProfile } from '../recommend.js';
import { ANTI, antiById } from '../data/anti.js';
import { videosCard } from '../videos.js';

let cleanup = [];
export function destroy() { cleanup.forEach(f => f()); cleanup = []; }

const DAY = 86400000;
const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
let LINES = null;
async function loadLines() {
  if (!LINES) LINES = await fetch(new URL('../data/opening-lines.json', import.meta.url)).then(r => r.json());
  return LINES;
}
const family = name => name.split(':')[0].trim();
const sideFor = name => /Defen[cs]e|Counter|Gambit Declined|Black/i.test(family(name)) ? 'b' : 'w';
const lineId = (moves, color) => color + ':' + moves.join(' ');
const fmtLine = moves => moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + m).join(' ');

function tabs(active) {
  const t = [['foryou', '✨ Suggested for me'], ['anti', '🛡 Beat an opening'], ['videos', '🎬 Videos'], ['popular', '🔥 Most popular'], ['gotham', '♟ GothamChess favourites'], ['mine', 'From my games'], ['library', 'Opening library'], ['rep', 'My repertoire']];
  return `<div class="tabs">${t.map(([k, l]) => `<button class="${k === active ? 'active' : ''}" onclick="location.hash='#/openings?tab=${k}'">${l}</button>`).join('')}</div>`;
}

export async function render(root, params) {
  destroy();
  if (params.train) return renderTrainer(root, params);
  if (params.op) return renderOpening(root, params.op);
  if (params.anti) return renderAntiPage(root, params.anti);
  const tab = params.tab || 'foryou';
  const due = Object.values(state.repertoire).filter(r => r.due <= Date.now()).length;
  root.innerHTML = `
    <div class="page-head"><div><h1>Openings</h1><p>Learn openings, see what you really play, and drill your lines until they're second nature.</p></div>
      <div class="row">${Object.keys(state.repertoire).length ? `<a class="btn primary" href="#/openings?train=due">▶ Drill ${due ? `${due} due line${due > 1 ? 's' : ''}` : 'my repertoire'}</a>` : ''}</div></div>
    ${tabs(tab)}<div id="op-body"><p class="muted">Loading…</p></div>`;
  const body = $('#op-body', root);
  if (tab === 'library') return renderLibrary(body, params);
  if (tab === 'rep') return renderRep(body);
  if (tab === 'foryou') return renderForYou(body);
  if (tab === 'anti') return renderAnti(body);
  if (tab === 'videos') return renderVideos(body);
  if (tab === 'popular') return renderPopular(body);
  if (tab === 'gotham') return renderGotham(body);
  return renderMine(body);
}

// ---------------------------------------------------------------- Catalog helpers
const sideLabel = o => o.side === 'w' ? '⚪ White' : `⚫ Black vs 1.${o.vs}`;
const STYLE = { aggressive: '⚔ Aggressive', solid: '🛡 Solid', tricky: '🪤 Tricky' };
const THEORY = ['', 'Little theory', 'Some theory', 'Lots of theory'];
const trainUrl = (o, l, mode = '') => `#/openings?train=line${mode ? '&mode=' + mode : ''}&color=${o.side}&moves=${encodeURIComponent(l.moves)}&name=${encodeURIComponent(`${o.name} — ${l.name}`)}`;

function opCard(o, extra = '') {
  return `<a class="theme-btn" href="#/openings?op=${o.id}" style="display:block">
    <div class="spread"><span class="tn">${esc(o.name)}</span>${o.gotham ? '<span class="pill" title="GothamChess favourite">♟ Gotham</span>' : ''}</div>
    <div class="ts">${sideLabel(o)} · ${STYLE[o.style]} · ${THEORY[o.theory]}</div>
    <div class="ts" style="margin-top:6px;line-height:1.45">${esc(o.desc)}</div>${extra}</a>`;
}

// ---------------------------------------------------------------- Suggested for me
function renderForYou(body) {
  const R = recommend();
  const P = R.P;
  if (!P.games) {
    body.innerHTML = `<div class="card empty"><div class="big">✨</div><p>Import your games and I'll suggest openings that fit how you play.</p><a class="btn primary" href="#/import">Import games</a></div>`;
    return;
  }
  const facts = [
    P.topFirst ? `As White you usually open <b>1.${esc(P.topFirst)}</b> and score <b>${P.whiteScore}%</b>.` : '',
    P.black ? `As Black you score <b>${P.blackScore}%</b>. Opponents play 1.e4 in ${P.oppFirst.e4 || 0} and 1.d4 in ${P.oppFirst.d4 || 0} of your Black games.` : '',
    P.tactics != null ? `Coach scores: tactics <b>${P.tactics}</b>/100, openings <b>${P.openingsScore}</b>/100.` : `<span class="muted">Analyse some games for sharper suggestions — right now I'm only using results.</span>`,
    P.fast ? 'You mostly play blitz/bullet, so low-theory and trappy openings get a bonus.' : '',
  ].filter(Boolean);
  const bucket = (title, sub, B) => `
    <div class="card">
      <h2>${title}</h2><p class="muted" style="margin-top:-6px">${sub}</p>
      ${B.now ? `<div class="insight"><span class="ic">📌</span><span>Right now you mostly play <b>${esc(B.now.o.name)}</b> — ${B.now.my.games} games, ${B.now.my.score}% score. ${B.now.my.score >= 55 ? '<b style="color:#a7dc75">Keep it.</b>' : B.now.my.score <= 40 ? '<b style="color:#f08a7c">Time for a change.</b>' : 'Decent, but there may be a better fit.'}</span></div>` : ''}
      <div class="grid g3" style="margin-top:10px">${B.picks.map((r, i) => `
        <div class="card" style="background:var(--bg2)">
          <div class="spread"><b style="font-size:16px">${i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 '}${esc(r.o.name)}</b>${r.o.gotham ? '<span class="pill">♟ Gotham</span>' : ''}</div>
          <div class="muted small" style="margin:4px 0 8px">${STYLE[r.o.style]} · ${THEORY[r.o.theory]}</div>
          <ul style="margin:0 0 10px;padding-left:18px;line-height:1.5" class="small">${r.why.slice(0, 4).map(w => `<li>${esc(w)}</li>`).join('')}</ul>
          <div class="row"><a class="btn sm primary" href="#/openings?op=${r.o.id}">Learn it</a><a class="btn sm" href="${trainUrl(r.o, r.o.lines[0], 'learn')}">▶ First line</a></div>
        </div>`).join('')}</div>
    </div>`;
  body.innerHTML = `
    <div class="card hero"><h2>🧠 What I see in your games</h2>${facts.map(f => `<p style="margin:6px 0;line-height:1.5">${f}</p>`).join('')}</div>
    ${bucket('As White', 'Your main weapon with the white pieces.', R.white)}
    ${bucket('As Black vs 1.e4', `Faced in ${R.vsE4.current} of your Black games.`, R.vsE4)}
    ${bucket('As Black vs 1.d4', `Faced in ${R.vsD4.current} of your Black games.`, R.vsD4)}`;
}

// ---------------------------------------------------------------- Beat an opening
function antiStats(a) {
  const games = myGames().filter(g => g.userColor === a.you && a.match(openingName(g) || ''));
  const res = { win: 0, draw: 0, loss: 0 };
  games.forEach(g => { const r = userResult(g); if (r) res[r]++; });
  const score = games.length ? Math.round(((res.win + res.draw / 2) / games.length) * 100) : null;
  let openMistakes = 0, analysed = 0;
  for (const g of games) {
    if (!g.analysis) continue;
    analysed++;
    openMistakes += g.analysis.moves.filter(m => m.color === g.userColor && m.phase === 'opening' && ['mistake', 'blunder', 'miss'].includes(m.cls)).length;
  }
  return { games, ...res, score, openMistakes, analysed };
}
const scoreColor = s => s == null ? 'var(--muted)' : s >= 55 ? '#a7dc75' : s < 45 ? '#f08a7c' : 'var(--text)';

function renderAnti(body) {
  const all = ANTI.map(a => ({ a, s: antiStats(a) }));
  const struggles = all.filter(x => x.s.games.length >= 3 && x.s.score < 50).sort((x, y) => x.s.score - y.s.score || y.s.games.length - x.s.games.length);
  const card = ({ a, s }) => `<a class="theme-btn" href="#/openings?anti=${a.id}" style="display:block">
    <div class="tn">${esc(a.name)}</div><div class="ts">${esc(a.first)}</div>
    <div class="ts" style="margin-top:6px">${s.games.length ? `You: <b style="color:${scoreColor(s.score)}">${s.score}%</b> in ${s.games.length} game${s.games.length > 1 ? 's' : ''} (${s.win}W ${s.draw}D ${s.loss}L)` : 'No games against it yet'}</div></a>`;
  body.innerHTML = `
    <div class="card hero">
      <h2>🛡 Which opening gives you trouble?</h2>
      <p class="muted" style="margin-top:-6px">Pick one and get a simple game plan, the traps to avoid, and lines to learn and drill.</p>
      ${struggles.length ? `<h3 style="margin-top:14px">You struggle most against</h3><div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${struggles.slice(0, 4).map(card).join('')}</div>`
        : '<p class="muted">Import more games and I\'ll spot which openings you score worst against.</p>'}
    </div>
    <div class="card"><h2>When I'm White and they play…</h2><div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${all.filter(x => x.a.you === 'w').map(card).join('')}</div></div>
    <div class="card"><h2>When I'm Black and they play…</h2><div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${all.filter(x => x.a.you === 'b').map(card).join('')}</div></div>`;
}

function renderAntiPage(root, id) {
  const a = antiById(id);
  if (!a) { root.innerHTML = `<div class="card empty"><p>Opening not found.</p><a class="btn" href="#/openings?tab=anti">Back</a></div>`; return; }
  const s = antiStats(a);
  const lossList = s.games.filter(g => userResult(g) === 'loss').slice(0, 6);
  const url = (r, l, mode = '') => `#/openings?train=line${mode ? '&mode=' + mode : ''}&color=${a.you}&moves=${encodeURIComponent(l.moves)}&name=${encodeURIComponent(`vs ${a.name} — ${r.name}: ${l.name}`)}`;
  const verdict = s.games.length < 3 ? '' : s.score < 40 ? 'This is a real problem opening for you — fix it first.' : s.score < 50 ? 'You\'re losing more than you win against it.' : s.score >= 60 ? 'You already handle it well.' : 'About even — a clear plan will tip it your way.';
  root.innerHTML = `
    <div class="page-head"><div><h1>How to beat the ${esc(a.name)}</h1><p>You play ${a.you === 'w' ? 'White' : 'Black'} · ${esc(a.first)}</p></div>
      <div class="row"><a class="btn" href="#op-videos" onclick="document.getElementById('op-videos').scrollIntoView({behavior:'smooth'});return false">🎬 Videos</a><a class="btn" href="#/openings?tab=anti">← All openings</a></div></div>
    <div class="grid g2">
      <div class="card stack">
        <h2>📊 Your record</h2>
        ${s.games.length ? `<div class="row" style="gap:24px"><div class="kpi"><span class="v" style="color:${scoreColor(s.score)}">${s.score}%</span><span class="l">score</span></div>
          <div class="kpi"><span class="v">${s.games.length}</span><span class="l">games</span></div><div class="kpi"><span class="v">${s.win}/${s.draw}/${s.loss}</span><span class="l">W / D / L</span></div></div>
          ${verdict ? `<p style="margin:0"><b>${verdict}</b></p>` : ''}
          ${s.analysed ? `<p class="muted" style="margin:0">${s.openMistakes} opening mistake${s.openMistakes === 1 ? '' : 's'} in ${s.analysed} analysed game${s.analysed > 1 ? 's' : ''} against it.</p>` : ''}
          ${lossList.length ? `<div><h3>Your losses against it</h3>${lossList.map(g => `<div class="insight" style="cursor:pointer;padding:6px 0" onclick="location.hash='#/review/${encodeURIComponent(g.id)}'"><span class="ic">💀</span><span>vs ${esc(a.you === 'w' ? g.black : g.white)} <span class="muted">· ${fmtDate(g.date)} · ${esc(openingName(g) || '')}</span></span></div>`).join('')}</div>` : ''}`
          : '<p class="muted">You haven\'t faced it in your imported games yet — but here\'s how to be ready.</p>'}
      </div>
      <div class="card stack">
        <h2>🧭 Game plan</h2>
        <p style="line-height:1.6;margin:0">${esc(a.plan)}</p>
        <div><h3>⚠ Mistakes to avoid</h3><ul style="line-height:1.7;margin:0;padding-left:20px">${a.avoid.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="spread"><h2>♟ How to play it</h2><button class="btn sm primary" id="anti-add">＋ Add all lines to my repertoire</button></div>
      <div class="grid g2">${a.responses.map(r => `<div class="card" style="background:var(--bg2)">
        <div class="spread"><b style="font-size:16px">${esc(r.name)}</b><span class="muted small">${STYLE[r.style]} · ${THEORY[r.theory]}</span></div>
        <p class="muted" style="margin:6px 0 10px">${esc(r.desc)}</p>
        ${r.lines.map(l => `<div style="padding:8px 0;border-top:1px solid #33302c"><b>${esc(l.name)}</b><div class="muted small" style="margin:4px 0 8px">${esc(fmtLine(l.moves.split(' ')))}</div>
          <a class="btn sm" href="${url(r, l, 'learn')}">📖 Learn</a> <a class="btn sm primary" href="${url(r, l)}">🧠 Drill</a></div>`).join('')}
      </div>`).join('')}</div>
    </div>
    ${videosCard(`how to beat the ${a.name}`, '🎬 Videos: how to beat it')}`;
  $('#anti-add', root).onclick = () => {
    let n = 0;
    for (const r of a.responses) for (const l of r.lines) {
      const moves = l.moves.split(' ');
      const lid = lineId(moves, a.you);
      if (state.repertoire[lid]) continue;
      state.repertoire[lid] = { id: lid, name: `vs ${a.name} — ${r.name}: ${l.name}`, moves, color: a.you, box: 0, due: Date.now(), reps: 0, fails: 0, added: Date.now() };
      n++;
    }
    save('repertoire');
    toast(n ? `Added ${n} line${n > 1 ? 's' : ''} — drill them from "My repertoire".` : 'Already in your repertoire', 'success');
  };
}

// ---------------------------------------------------------------- Videos
function renderVideos(body) {
  const topics = [...new Set([...CATALOG.map(o => o.name), ...ANTI.map(a => a.name)])].sort();
  const general = ['Opening principles', 'Opening traps', 'Beginner opening repertoire', 'How to study openings'];
  let topic = 'Sicilian Defense';
  try { topic = localStorage.getItem('cl-video-topic') || topic; } catch { /* ignore */ }
  body.innerHTML = `
    <div class="card">
      <h2>🎬 Opening videos</h2>
      <p class="muted" style="margin-top:-6px">Pick an opening (or type anything) and jump straight to videos from top chess creators.</p>
      <div class="row">
        <input id="vid-q" list="vid-topics" value="${esc(topic)}" placeholder="e.g. Caro-Kann, Vienna Gambit, Stafford trap…" style="flex:1;min-width:240px">
        <datalist id="vid-topics">${topics.map(t => `<option value="${esc(t)}">`).join('')}</datalist>
        <button class="btn primary" id="vid-go">Show videos</button>
      </div>
      <div class="row" style="margin-top:10px">${[...general, 'Sicilian Defense', 'Caro-Kann Defense', 'London System', 'Italian Game', 'Vienna Game'].map(t => `<button class="btn sm" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    </div>
    <div id="vid-out"></div>`;
  const show = t => {
    t = t.trim();
    if (!t) return;
    try { localStorage.setItem('cl-video-topic', t); } catch { /* ignore */ }
    $('#vid-q', body).value = t;
    $('#vid-out', body).innerHTML = videosCard(t, `🎬 ${esc(t)}`);
  };
  $('#vid-go', body).onclick = () => show($('#vid-q', body).value);
  $('#vid-q', body).onkeydown = e => { if (e.key === 'Enter') show(e.target.value); };
  body.querySelectorAll('[data-t]').forEach(b => b.onclick = () => show(b.dataset.t));
  show(topic);
}

// ---------------------------------------------------------------- Most popular
function renderPopular(body) {
  const P = openingProfile();
  const list = [...CATALOG].filter(o => o.style !== 'tricky').sort((a, b) => a.pop - b.pop);
  const top = obj => Object.entries(obj).filter(([k]) => k !== 'Unknown').sort((a, b) => b[1] - a[1]).slice(0, 6);
  const oppTable = (rows, total) => rows.length ? `<table class="tbl"><tbody>${rows.map(([n, c]) => `<tr><td>${esc(n)}</td><td style="width:45%"><div class="bar"><i style="width:${Math.round(c / rows[0][1] * 100)}%"></i></div></td><td class="muted">${c} (${pct(c, total)}%)</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Not enough games yet.</p>';
  body.innerHTML = `
    <div class="card"><h2>Most popular openings</h2><p class="muted" style="margin-top:-6px">The openings you'll meet most at club and master level, ranked by how often they're played.</p>
      <div class="table-wrap"><table class="tbl"><tbody>${list.map((o, i) => `<tr class="click" onclick="location.hash='#/openings?op=${o.id}'">
        <td style="width:36px;font-weight:800;color:var(--muted)">#${i + 1}</td>
        <td><b>${esc(o.name)}</b>${o.gotham ? ' <span class="pill">♟ Gotham</span>' : ''}<div class="muted small">${esc(fmtLine(o.lines[0].moves.split(' ').slice(0, 6)))}</div></td>
        <td class="small">${sideLabel(o)}</td><td class="small">${STYLE[o.style]}</td><td class="small muted">${THEORY[o.theory]}</td>
        <td>${P.mine[o.id].games ? `<span class="small">You: ${P.mine[o.id].games} games, ${P.mine[o.id].score}%</span>` : ''}</td></tr>`).join('')}</tbody></table></div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card"><h2>What opponents play against your White</h2>${oppTable(top(P.vsYouAsWhite), P.white)}</div>
      <div class="card"><h2>What opponents play against your Black</h2>${oppTable(top(P.vsYouAsBlack), P.black)}</div>
    </div>`;
}

// ---------------------------------------------------------------- GothamChess favourites
function renderGotham(body) {
  const list = CATALOG.filter(o => o.gotham);
  const group = (title, f) => `<h3 style="margin-top:18px">${title}</h3><div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${list.filter(f).map(o => opCard(o)).join('')}</div>`;
  body.innerHTML = `<div class="card">
    <h2>♟ GothamChess favourites</h2>
    <p class="muted" style="margin-top:-6px;line-height:1.5">Openings that IM Levy Rozman (GothamChess) is known for teaching — practical, fun, and full of traps for club players. Each one has key lines you can learn and drill here, plus a link to find his videos. ChessLab isn't affiliated with GothamChess.</p>
    ${group('As White', o => o.side === 'w')}
    ${group('As Black vs 1.e4', o => o.vs === 'e4')}
    ${group('As Black vs 1.d4', o => o.vs === 'd4')}</div>`;
}

// ---------------------------------------------------------------- Opening page
function renderOpening(root, id) {
  const o = byId(id);
  if (!o) { root.innerHTML = `<div class="card empty"><p>Opening not found.</p><a class="btn" href="#/openings">Back</a></div>`; return; }
  const my = openingProfile().mine[o.id];
  root.innerHTML = `
    <div class="page-head"><div><h1>${esc(o.name)}</h1><p>${sideLabel(o)} · ${STYLE[o.style]} · ${THEORY[o.theory]}${o.gotham ? ' · ♟ GothamChess favourite' : ''}</p></div>
      <div class="row"><a class="btn" href="#op-videos" onclick="document.getElementById('op-videos').scrollIntoView({behavior:'smooth'});return false">🎬 Videos</a><a class="btn" href="#/openings">← Openings</a></div></div>
    <div class="grid g2">
      <div class="card stack">
        <p style="font-size:15px;line-height:1.6;margin:0">${esc(o.desc)}</p>
        <div><h3>Key ideas</h3><ul style="line-height:1.7;margin:0;padding-left:20px">${o.ideas.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
        ${my.games ? `<div class="insight"><span class="ic">📊</span><span>You've played this in <b>${my.games}</b> games and score <b>${my.score}%</b>.</span></div>` : ''}
      </div>
      <div class="card">
        <div class="spread"><h2>Lines to learn</h2><button class="btn sm primary" id="op-addall">＋ Add all to my repertoire</button></div>
        ${o.lines.map(l => `<div class="insight"><span class="ic">♟</span><span style="flex:1"><b>${esc(l.name)}</b><div class="muted small" style="margin:4px 0 8px">${esc(fmtLine(l.moves.split(' ')))}</div>
          <a class="btn sm" href="${trainUrl(o, l, 'learn')}">📖 Learn</a> <a class="btn sm primary" href="${trainUrl(o, l)}">🧠 Drill</a></span></div>`).join('')}
      </div>
    </div>
    ${videosCard(o.name)}`;
  $('#op-addall', root).onclick = () => {
    let n = 0;
    for (const l of o.lines) {
      const moves = l.moves.split(' ');
      const lid = lineId(moves, o.side);
      if (state.repertoire[lid]) continue;
      state.repertoire[lid] = { id: lid, name: `${o.name} — ${l.name}`, moves, color: o.side, box: 0, due: Date.now(), reps: 0, fails: 0, added: Date.now() };
      n++;
    }
    save('repertoire');
    toast(n ? `Added ${n} line${n > 1 ? 's' : ''} — drill them from "My repertoire".` : 'Already in your repertoire', 'success');
  };
}

// ---------------------------------------------------------------- From my games
async function renderMine(body) {
  await loadBook();
  const games = myGames();
  if (!games.length) { body.innerHTML = `<div class="card empty"><p>Import some games first.</p><a class="btn primary" href="#/import">Import games</a></div>`; return; }
  const agg = { w: {}, b: {} };
  const leaks = [];
  for (const g of games) {
    let P; try { P = parseGame(g.pgn); } catch { continue; }
    if (P.start.split(' ')[0] !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') continue;
    let k = 0;
    while (k < P.moves.length && k < 30 && inBook(P.moves[k].fenAfter)) k++;
    const bookMoves = P.moves.slice(0, k).map(m => m.san);
    const key = bookMoves.join(' ');
    const r = agg[g.userColor][key] || (agg[g.userColor][key] = { moves: bookMoves, games: 0, win: 0, draw: 0, loss: 0, opening: openingOf(P.fens), exits: {}, ids: [] });
    r.games++;
    const res = userResult(g); if (res) r[res]++;
    r.ids.push(g.id);
    const exit = P.moves[k];
    if (exit) {
      const who = exit.color === g.userColor ? 'you' : 'opp';
      const ek = `${who}|${exit.san}`;
      r.exits[ek] = (r.exits[ek] || 0) + 1;
    }
    // opening mistakes by you
    if (g.analysis) {
      g.analysis.moves.forEach((rec, i) => {
        if (rec.color === g.userColor && rec.phase === 'opening' && ['mistake', 'blunder', 'miss', 'inaccuracy'].includes(rec.cls) && i < 30)
          leaks.push({ g, i, rec, san: P.moves[i].san });
      });
    }
  }
  const section = c => {
    const rows = Object.values(agg[c]).filter(r => r.moves.length >= 2).sort((a, b) => b.games - a.games).slice(0, 10);
    if (!rows.length) return `<p class="muted">Not enough games as ${c === 'w' ? 'White' : 'Black'}.</p>`;
    return `<table class="tbl"><thead><tr><th>Line you play</th><th>Games</th><th>Score</th><th>Then usually…</th><th></th></tr></thead><tbody>${rows.map(r => {
      const sc = pct(r.win + r.draw / 2, r.games);
      const ex = Object.entries(r.exits).sort((a, b) => b[1] - a[1])[0];
      const exTxt = ex ? `${ex[0].startsWith('you') ? 'you' : 'they'} leave theory with <b>${esc(ex[0].split('|')[1])}</b>` : '—';
      return `<tr><td><b>${esc(r.opening?.name || 'Unnamed line')}</b><div class="muted small">${esc(fmtLine(r.moves))}</div></td><td>${r.games}</td>
        <td><span style="color:${sc >= 55 ? '#a7dc75' : sc < 45 ? '#f08a7c' : 'inherit'}">${sc}%</span></td><td class="small">${exTxt}</td>
        <td><a class="btn sm primary" href="#/openings?train=line&color=${c}&moves=${encodeURIComponent(r.moves.join(' '))}&name=${encodeURIComponent(r.opening?.name || 'My line')}">Drill</a></td></tr>`;
    }).join('')}</tbody></table>`;
  };
  leaks.sort((a, b) => b.rec.loss - a.rec.loss);
  body.innerHTML = `
    <div class="card"><h2>As White</h2>${section('w')}</div>
    <div class="card"><h2>As Black</h2>${section('b')}</div>
    <div class="card"><h2>Where your openings go wrong</h2>
      <p class="muted">Your biggest mistakes in the first ~15 moves of analysed games.</p>
      ${leaks.length ? leaks.slice(0, 12).map(l => `<div class="insight" style="cursor:pointer" onclick="location.hash='#/review/${encodeURIComponent(l.g.id)}?ply=${l.i + 1}'">${clsIcon(l.rec.cls)}<span><b>${Math.floor(l.i / 2) + 1}${l.i % 2 ? '...' : '.'} ${esc(l.san)}</b> — ${CLS[l.rec.cls].label.toLowerCase()} in the ${esc(l.g.openingBook?.name || l.g.opening || 'opening')} <span class="muted">vs ${esc(l.g.userColor === 'w' ? l.g.black : l.g.white)}, ${fmtDate(l.g.date)}</span></span></div>`).join('')
        : '<p class="muted">No opening mistakes found yet — analyse more games.</p>'}
    </div>`;
}

// ---------------------------------------------------------------- Library
async function renderLibrary(body, params) {
  const lines = await loadLines();
  const fams = {};
  lines.forEach((l, i) => { const f = family(l[1]); (fams[f] = fams[f] || []).push(i); });
  const POPULAR = ['Sicilian Defense', 'French Defense', 'Caro-Kann Defense', 'Italian Game', 'Ruy Lopez', "Queen's Gambit Declined", "Queen's Gambit Accepted", 'Slav Defense', "King's Indian Defense", 'London System', 'English Opening', 'Scandinavian Defense', 'Pirc Defense', 'Nimzo-Indian Defense', 'Scotch Game', 'Vienna Game', 'Dutch Defense', 'Grünfeld Defense'];
  const draw = q => {
    const ql = q.toLowerCase();
    if (params.family && !q) {
      const f = params.family;
      body.innerHTML = `<div class="card"><div class="spread"><h2>${esc(f)}</h2><a class="btn sm" href="#/openings?tab=library">← All openings</a></div>
        <table class="tbl"><tbody>${(fams[f] || []).map(i => lineRow(lines, i)).join('')}</tbody></table></div>`;
      return;
    }
    const names = Object.keys(fams).filter(f => !ql || f.toLowerCase().includes(ql) || fams[f].some(i => lines[i][1].toLowerCase().includes(ql)));
    names.sort((a, b) => (POPULAR.indexOf(b) + 1 ? 1000 - POPULAR.indexOf(b) : 0) - (POPULAR.indexOf(a) + 1 ? 1000 - POPULAR.indexOf(a) : 0) || fams[b].length - fams[a].length);
    $('#lib-list', body).innerHTML = names.slice(0, 120).map(f => `<button class="theme-btn" onclick="location.hash='#/openings?tab=library&family=${encodeURIComponent(f)}'">
      <div class="tn">${esc(f)}</div><div class="ts">${fams[f].length} line${fams[f].length > 1 ? 's' : ''} · ${esc(lines[fams[f][0]][2].split(' ').slice(0, 4).join(' '))}</div></button>`).join('') || '<p class="muted">No openings match.</p>';
  };
  if (params.family) { draw(''); return; }
  body.innerHTML = `<div class="card"><input id="lib-q" placeholder="Search 3,800+ opening lines… (e.g. Najdorf, London, Caro)" style="width:100%;margin-bottom:14px"><div class="theme-grid" id="lib-list"></div></div>`;
  $('#lib-q', body).oninput = e => draw(e.target.value);
  draw('');
}
function lineRow(lines, i) {
  const [eco, name, mv] = lines[i];
  const moves = mv.split(' ');
  const c = sideFor(name);
  return `<tr><td><span class="pill">${eco}</span></td><td><b>${esc(name.split(':').slice(1).join(':').trim() || name)}</b><div class="muted small">${esc(fmtLine(moves))}</div></td>
    <td style="white-space:nowrap"><a class="btn sm" href="#/openings?train=line&mode=learn&color=${c}&moves=${encodeURIComponent(mv)}&name=${encodeURIComponent(name)}">Learn</a>
    <a class="btn sm primary" href="#/openings?train=line&color=${c}&moves=${encodeURIComponent(mv)}&name=${encodeURIComponent(name)}">Drill</a></td></tr>`;
}

// ---------------------------------------------------------------- Repertoire
function renderRep(body) {
  const reps = Object.values(state.repertoire).sort((a, b) => a.due - b.due);
  body.innerHTML = `<div class="card" style="padding:0">${reps.length ? `<table class="tbl"><thead><tr><th>Line</th><th>Side</th><th>Record</th><th>Next review</th><th></th></tr></thead><tbody>${reps.map(r => `<tr>
      <td><b>${esc(r.name)}</b><div class="muted small">${esc(fmtLine(r.moves))}</div></td><td>${r.color === 'w' ? '⚪ White' : '⚫ Black'}</td>
      <td class="muted">${r.reps}✓ ${r.fails}✗ · box ${r.box}</td>
      <td>${r.due <= Date.now() ? '<b style="color:var(--orange)">Due now</b>' : fmtDate(r.due)}</td>
      <td style="white-space:nowrap"><a class="btn sm primary" href="#/openings?train=rep&id=${encodeURIComponent(r.id)}">Drill</a> <button class="btn sm ghost" data-del="${esc(r.id)}">✕</button></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty"><div class="big">📚</div><p>Your repertoire is empty. Drill a line from your games or the library and add it.</p><a class="btn primary" href="#/openings?tab=library">Browse openings</a></div>`}</div>`;
  body.onclick = e => {
    const d = e.target.closest('[data-del]');
    if (d) { delete state.repertoire[d.dataset.del]; save('repertoire'); renderRep(body); }
  };
}

// ---------------------------------------------------------------- Trainer
function renderTrainer(root, params) {
  let queue = [];
  if (params.train === 'due') {
    const all = Object.values(state.repertoire);
    queue = all.filter(r => r.due <= Date.now()).sort((a, b) => a.due - b.due);
    if (!queue.length) queue = [...all].sort((a, b) => a.box - b.box || a.due - b.due).slice(0, 10);
  } else if (params.train === 'rep') {
    const r = state.repertoire[params.id];
    if (r) queue = [r];
  } else {
    const moves = (params.moves || '').split(' ').filter(Boolean);
    const color = params.color || 'w';
    queue = [state.repertoire[lineId(moves, color)] || { id: lineId(moves, color), name: params.name || 'Opening line', moves, color, temp: true }];
  }
  if (!queue.length) { root.innerHTML = `<div class="card empty"><p>Nothing to drill.</p><a class="btn" href="#/openings">Back</a></div>`; return; }

  let qi = 0, line, color, step, fails, mode = params.mode === 'learn' ? 'learn' : 'drill', chess, busy = false, done = false;
  root.innerHTML = `
    <div class="page-head"><div><h1 id="tr-title"></h1><p id="tr-sub" class="muted"></p></div>
      <div class="row"><div class="tabs" style="margin:0;border:none"><button data-m="learn">📖 Learn</button><button data-m="drill">🧠 Drill</button></div><a class="btn" href="#/openings">← Openings</a></div></div>
    <div class="board-layout">
      <div class="board-col"><div id="tr-board"></div></div>
      <div class="side-panel">
        <div class="sec"><div class="puz-status turn" id="tr-status"></div></div>
        <div class="sec"><div class="movelist" id="tr-moves" style="max-height:none"></div></div>
        <div class="sec"><div class="row">
          <button class="btn" id="tr-hint">💡 Show move</button>
          <button class="btn" id="tr-color">⇅ Play other side</button>
          <button class="btn" id="tr-restart">↺ Restart</button>
          <button class="btn primary" id="tr-next" style="margin-left:auto">Next ›</button>
        </div></div>
        <div class="sec" id="tr-after"></div>
      </div>
    </div>`;

  const board = new Board($('#tr-board', root), {
    dests: sq => busy || done ? [] : chess.moves({ square: sq, verbose: true }).map(m => m.to),
    movable: c => c === color && !busy && !done,
    inCheck: f => new Chess(f).inCheck(),
    onMove: (f, t, p) => onMove(f, t, p),
  });
  const status = (cls, html) => { const s = $('#tr-status', root); s.className = 'puz-status ' + cls; s.innerHTML = html; };
  const expectedArrow = () => {
    const c = new Chess(chess.fen());
    const m = c.move(line.moves[step]);
    return [{ from: m.from, to: m.to, color: 'rgba(92,139,176,.85)' }];
  };
  function drawMoves() {
    $('#tr-moves', root).innerHTML = `<div class="small" style="line-height:1.9">${line.moves.map((m, i) => {
      const shown = i < step || (mode === 'learn' && i === step);
      return `${i % 2 === 0 ? `<span class="muted">${i / 2 + 1}.</span> ` : ''}<span style="${i === step ? 'background:#45413b;padding:1px 4px;border-radius:4px' : ''}">${shown ? esc(m) : '?'}</span> `;
    }).join('')}</div>`;
  }
  function start() {
    line = queue[qi];
    color = line.color;
    step = 0; fails = 0; done = false; busy = false;
    chess = new Chess();
    $('#tr-title', root).textContent = line.name;
    $('#tr-sub', root).textContent = `${line.moves.length} moves · you play ${color === 'w' ? 'White' : 'Black'}${queue.length > 1 ? ` · line ${qi + 1} of ${queue.length}` : ''}`;
    root.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('active', b.dataset.m === mode));
    $('#tr-after', root).innerHTML = '';
    board.set({ fen: chess.fen(), orientation: color, lastMove: null, arrows: [], marks: {} });
    advance();
  }
  function advance() {
    drawMoves();
    if (step >= line.moves.length) return finish();
    if (chess.turn() !== color) {
      busy = true;
      status('turn', 'Opponent is moving…');
      setTimeout(() => {
        const m = chess.move(line.moves[step]);
        step++;
        busy = false;
        board.set({ fen: chess.fen(), lastMove: [m.from, m.to], arrows: [], marks: {} });
        advance();
      }, 450);
      return;
    }
    status('turn', `<span class="turn-dot" style="background:${color === 'w' ? '#fff' : '#000'}"></span> ${mode === 'learn' ? `Play <b>${esc(line.moves[step])}</b> (follow the arrow)` : 'Your move — what comes next in this line?'}`);
    board.set({ arrows: mode === 'learn' ? expectedArrow() : [] });
  }
  function onMove(from, to, promo) {
    const before = chess.fen();
    let m;
    try { m = chess.move({ from, to, promotion: promo || 'q' }); } catch { board.render(); return; }
    if (m.san === line.moves[step]) {
      step++;
      board.set({ fen: chess.fen(), lastMove: [from, to], marks: { [to]: 'right' }, arrows: [] });
      advance();
    } else {
      fails++;
      chess.load(before);
      busy = true;
      board.set({ fen: chess.fen(), lastMove: null, marks: { [to]: 'wrong' }, arrows: expectedArrow() });
      status('bad', `✗ ${esc(m.san)} isn't the book move here — it's <b>${esc(line.moves[step])}</b>. Try it.`);
      setTimeout(() => { busy = false; board.set({ marks: {} }); }, 700);
    }
  }
  function finish() {
    done = true;
    const perfect = fails === 0 && mode === 'drill';
    status(perfect ? 'ok' : 'done', perfect ? '✅ Perfect — line played from memory!' : mode === 'learn' ? '📖 Line complete. Now try it in Drill mode!' : `✔ Line complete with ${fails} slip${fails === 1 ? '' : 's'}. It'll come back sooner.`);
    const inRep = !!state.repertoire[line.id];
    if (inRep && mode === 'drill') {
      const r = state.repertoire[line.id];
      if (perfect) { r.reps++; r.box = Math.min(INTERVALS.length - 1, r.box + 1); r.due = Date.now() + INTERVALS[r.box] * DAY; }
      else { r.fails++; r.box = 0; r.due = Date.now() + 10 * 60000; }
      save('repertoire');
    }
    $('#tr-after', root).innerHTML = `<div class="row">
      ${!inRep ? `<button class="btn primary" id="tr-add">＋ Add to my repertoire</button>` : '<span class="muted">In your repertoire ✓</span>'}
      ${mode === 'learn' ? `<button class="btn" id="tr-drill">🧠 Drill it now</button>` : ''}
      <a class="btn ghost" href="#/analysis?fen=${encodeURIComponent(chess.fen())}">Analyse final position</a></div>`;
    $('#tr-add', root)?.addEventListener('click', () => {
      const { temp, ...rest } = line;
      state.repertoire[line.id] = { ...rest, box: perfect ? 1 : 0, due: Date.now() + (perfect ? DAY : 10 * 60000), reps: perfect ? 1 : 0, fails: perfect ? 0 : 1, added: Date.now() };
      save('repertoire');
      toast('Added to your repertoire — it will come back for review.', 'success');
      $('#tr-add', root).outerHTML = '<span class="muted">In your repertoire ✓</span>';
    });
    $('#tr-drill', root)?.addEventListener('click', () => { mode = 'drill'; start(); });
  }

  root.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mode = b.dataset.m; start(); });
  $('#tr-hint', root).onclick = () => { if (!done && chess.turn() === color) { fails++; board.set({ arrows: expectedArrow() }); } };
  $('#tr-color', root).onclick = () => {
    const c = line.color === 'w' ? 'b' : 'w';
    queue[qi] = state.repertoire[lineId(line.moves, c)] || { id: lineId(line.moves, c), name: line.name, moves: line.moves, color: c, temp: true };
    start();
  };
  $('#tr-restart', root).onclick = start;
  $('#tr-next', root).onclick = () => { if (qi < queue.length - 1) { qi++; start(); } else location.hash = '#/openings?tab=rep'; };
  start();
}
