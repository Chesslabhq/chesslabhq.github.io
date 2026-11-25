// Puzzle leaderboard: your Puzzle Rush hall of fame, rated-puzzle records, and rank tiers.
// Personal for now — a shared leaderboard needs an online database (planned with accounts).
import { state } from '../store.js';
import { rushData, MODES, RUSH_TIERS, rushTier } from './rush.js';
import { esc, fmtDate } from '../ui.js';

const RATING_TIERS = [
  { min: 0, name: 'Beginner', icon: '🌱' }, { min: 800, name: 'Novice', icon: '♟' }, { min: 1200, name: 'Intermediate', icon: '♞' },
  { min: 1600, name: 'Advanced', icon: '♝' }, { min: 2000, name: 'Expert', icon: '♜' }, { min: 2400, name: 'Master', icon: '♛' },
  { min: 2700, name: 'Grandmaster', icon: '👑' },
];
const tierOf = (tiers, v) => [...tiers].reverse().find(t => v >= t.min);
const nextOf = (tiers, v) => tiers.find(t => t.min > v);

function ratedStats() {
  const h = state.pstats.history.filter(x => x.src === 'lichess');
  let best = 0, cur = 0;
  for (const x of h) { cur = x.ok ? cur + 1 : 0; best = Math.max(best, cur); }
  const solvedRated = h.filter(x => x.ok && x.pr).sort((a, b) => b.pr - a.pr);
  return {
    played: h.length, solved: h.filter(x => x.ok).length,
    peak: h.length ? Math.max(state.pstats.rating, ...h.map(x => x.r)) : state.pstats.rating,
    streak: best, current: cur, hardest: solvedRated.slice(0, 10),
  };
}

function ladder(tiers, value, unit) {
  const me = tierOf(tiers, value), next = nextOf(tiers, value);
  const span = next ? next.min - me.min : 1;
  const p = next ? Math.round(((value - me.min) / span) * 100) : 100;
  return `<div class="pz-ladder">${tiers.map(t => `<div class="pz-step ${t === me ? 'on' : value >= t.min ? 'done' : ''}" title="${t.min}+"><span>${t.icon}</span><b>${t.name}</b><small>${t.min}+</small></div>`).join('')}</div>
    <div class="spread" style="margin-top:12px"><span>${me.icon} <b>${me.name}</b></span><span class="muted small">${next ? `${next.min - value} ${unit} to ${next.icon} ${next.name}` : 'Top tier reached!'}</span></div>
    <div class="bar" style="margin-top:6px"><i style="width:${p}%"></i></div>`;
}

export function renderPuzzleBoard(root, tabs, params = {}) {
  const d = rushData();
  const R = ratedStats();
  const modeKey = MODES[params.rush] ? params.rush : '3';
  const runs = d.runs.filter(r => r.mode === modeKey).sort((a, b) => b.score - a.score || b.top - a.top);
  const bestEver = Math.max(0, ...Object.values(d.best));
  const medal = i => ['🥇', '🥈', '🥉'][i] || `#${i + 1}`;

  root.innerHTML = `
  <div class="page-head"><div><h1>🏆 Puzzle leaderboard</h1><p>Your best Puzzle Rush runs and rated-puzzle records. Beat your own top scores to climb.</p></div></div>
  ${tabs}
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><span class="l">Puzzle rating</span><span class="v" style="color:var(--accent)">${state.pstats.rating}</span><span class="d">Peak ${R.peak}</span></div>
    <div class="card kpi"><span class="l">Best Rush score</span><span class="v">${bestEver || '—'}</span><span class="d">${bestEver ? `${rushTier(bestEver).icon} ${rushTier(bestEver).name} tier` : 'Play a run to get on the board'}</span></div>
    <div class="card kpi"><span class="l">Best solve streak</span><span class="v">🔥 ${R.streak}</span><span class="d">rated puzzles in a row · now ${R.current}</span></div>
    <div class="card kpi"><span class="l">Hardest solved</span><span class="v">${R.hardest[0]?.pr ?? '—'}</span><span class="d">${R.solved} of ${R.played} rated puzzles solved</span></div>
  </div>

  <div class="grid g2">
    <div class="card">
      <div class="spread"><h2 style="margin:0">⚡ Puzzle Rush hall of fame</h2><a class="btn sm primary" href="#/puzzles?mode=rush">Play Rush</a></div>
      <div class="tabs" style="margin:12px 0 8px">${Object.entries(MODES).map(([k, m]) => `<button class="${k === modeKey ? 'active' : ''}" onclick="location.hash='#/puzzles?mode=board&rush=${k}'">${m.icon} ${m.name} <span class="muted small">${d.best[k] ?? ''}</span></button>`).join('')}</div>
      ${runs.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Rank</th><th>Score</th><th>Tier</th><th>Hardest</th><th>Date</th></tr></thead><tbody>
        ${runs.slice(0, 10).map((r, i) => `<tr${i === 0 ? ' style="background:rgba(78,161,255,.1)"' : ''}><td style="font-size:${i < 3 ? 18 : 13}px">${medal(i)}</td><td><b style="font-size:17px">${r.score}</b></td><td>${rushTier(r.score).icon} ${rushTier(r.score).name}</td><td class="muted">${r.top || '—'}</td><td class="muted">${fmtDate(r.t)}</td></tr>`).join('')}
      </tbody></table></div>${runs.length > 10 ? `<p class="muted small" style="margin:8px 0 0">Showing your top 10 of ${runs.length} runs.</p>` : ''}`
        : `<div class="empty"><div class="big">⚡</div><p>No ${esc(MODES[modeKey].name)} runs yet.</p></div>`}
    </div>
    <div class="card">
      <div class="spread"><h2 style="margin:0">🎯 Hardest puzzles you solved</h2><a class="btn sm primary" href="#/puzzles?mode=rated">Rated puzzles</a></div>
      ${R.hardest.length ? `<div class="table-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>#</th><th>Puzzle rating</th><th>Your rating then</th><th>Date</th></tr></thead><tbody>
        ${R.hardest.map((x, i) => `<tr><td>${medal(i)}</td><td><b>${x.pr}</b></td><td class="muted">${x.r}</td><td class="muted">${fmtDate(x.t)}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty"><div class="big">🎯</div><p>Solve rated puzzles to fill this list.</p></div>'}
    </div>
  </div>

  <div class="grid g2" style="margin-top:16px">
    <div class="card"><h2>Rating tier</h2>${ladder(RATING_TIERS, state.pstats.rating, 'points')}</div>
    <div class="card"><h2>Rush tier <span class="muted small">(best score)</span></h2>${ladder(RUSH_TIERS, bestEver, bestEver === 1 ? 'puzzle' : 'puzzles')}</div>
  </div>
  <p class="muted small" style="margin-top:10px">This leaderboard is yours — it's saved in this browser. A global leaderboard against other players needs accounts and an online database, which can be added later.</p>`;
}
