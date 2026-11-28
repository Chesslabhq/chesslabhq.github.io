// Opening courses: the course list, a course's page, and its trainer —
// Learn (every move explained), Drill (from memory, spaced repetition) and Practice (a bot plays the course at random).
import { state, myGames } from '../store.js';
import { Chess } from '../lib.js';
import { Board } from '../board.js';
import { $, esc, pct, CLS, clsIcon } from '../ui.js';
import { getEngine } from '../engine.js';
import { loadBook, inBook, openingOf } from '../openings.js';
import { moverWin, fmtEval } from '../analysis.js';
import { openingProfile } from '../recommend.js';
import { videosCard } from '../videos.js';
import { learnVideos } from '../data/videos.js';
import {
  loadCourse, loadAllCourses, progress, lineStatus, dueLines, markLearned, gradeLine,
  courseStats, saveSession, botMove, gamesVsCourse, moveLabel, MASTERED_BOX,
} from '../courses.js';

const sideLabel = o => o.side === 'w' ? '⚪ White' : `⚫ Black vs 1.${o.vs}`;
const STYLE = { aggressive: '⚔ Aggressive', solid: '🛡 Solid', tricky: '🪤 Tricky' };
const THEORY = ['', 'Little theory', 'Some theory', 'Lots of theory'];
const STATUS = { new: ['New', 'st-new'], learning: ['Learning', 'st-learning'], due: ['Review due', 'st-due'], mastered: ['Mastered', 'st-mastered'] };
const statusPill = l => { const [t, c] = STATUS[lineStatus(l)]; return `<span class="pill ${c}">${t}</span>`; };
export const courseUrl = (id, mode, extra = {}) => '#/openings?' + new URLSearchParams({ course: id, mode, ...extra }).toString();
const fmtMoves = moves => moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + m).join(' ');
const ago = ms => { const d = Math.floor((Date.now() - ms) / 86400000); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const PRACTICE_ROUNDS = 5;

// ---------------------------------------------------------------- Grading moves that aren't the course move
const GOOD = ['best', 'excellent', 'good', 'book'];
const VERDICT = {
  best: 'The engine\'s top choice here.',
  excellent: 'The engine rates it about as highly as its top choice.',
  good: 'Only a little weaker than the engine\'s top choice.',
  book: 'A well-known opening move.',
  inaccuracy: 'Playable, but it gives away part of your position.',
  mistake: 'This loses ground. Compare it with the course move below.',
  blunder: 'This loses material or the position. Look at the course move below.',
};
/** An engine line as numbered moves, e.g. "3...e6 4.Nf3 c5". */
function pvText(fen, pv, ply, n = 6) {
  const c = new Chess(fen), out = [];
  for (const u of (pv || []).slice(0, n)) {
    let m;
    try { m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    const p = ply + out.length;
    out.push((p % 2 === 0 ? `${p / 2 + 1}.` : out.length === 0 ? `${Math.floor(p / 2) + 1}...` : '') + m.san);
  }
  return out.join(' ');
}
/**
 * How good is a move that isn't the course move? Same scale as game reviews (win-chance lost vs the engine's best),
 * plus how the game would go on after it.
 */
async function gradeMove(fenBefore, san, playedBefore) {
  await loadBook();
  const c = new Chess(fenBefore);
  const mv = c.move(san);
  const fenAfter = c.fen(), uci = mv.from + mv.to + (mv.promotion || '');
  const eng = getEngine('coach');
  const r1 = await eng.analyze(fenBefore, { depth: 13, multipv: 3, movetime: 4000 });
  if (!r1?.lines?.length) return null;
  const best = r1.lines[0];
  const mine = r1.lines.find(l => l.pv[0] === uci);
  let score = mine?.score, cont = mine ? mine.pv.slice(1) : null;
  if (!mine) {
    const r2 = await eng.analyze(fenAfter, { depth: 13, movetime: 4000 });
    if (!r2?.lines?.length) return null;
    score = r2.lines[0].score; cont = r2.lines[0].pv;
  }
  const loss = Math.max(0, moverWin(best.score, mv.color) - moverWin(score, mv.color));
  let cls = loss < 1 ? (best.pv[0] === uci ? 'best' : 'excellent') : loss < 2.5 ? 'excellent' : loss < 5 ? 'good' : loss < 10 ? 'inaccuracy' : loss < 20 ? 'mistake' : 'blunder';
  const book = inBook(fenAfter);
  if (book && loss < 10) cls = 'book';
  let opening = null;
  if (book) {
    const g = new Chess(), fens = [g.fen()];
    for (const p of [...playedBefore, mv.san]) { g.move(p); fens.push(g.fen()); }
    opening = openingOf(fens);
  }
  return { cls, score, fenAfter, cont, opening };
}

// ---------------------------------------------------------------- Course list
export async function renderCoursesTab(body) {
  const courses = await loadAllCourses();
  const all = courses.flatMap(c => c.lines);
  const P = progress(all);
  const card = c => {
    const p = progress(c.lines);
    const badge = p.due ? `<span class="pill st-due">${p.due} due</span>` : p.total && p.mastered === p.total ? '<span class="pill st-mastered">Mastered</span>' : c.o.gotham ? '<span class="pill">♟ Gotham</span>' : '';
    return `<a class="theme-btn" href="#/openings?op=${c.id}" style="display:block">
      <div class="spread"><span class="tn">${esc(c.o.name)}</span>${badge}</div>
      <div class="ts">${sideLabel(c.o)} · ${STYLE[c.o.style]} · ${c.lines.length} lines · ${c.chapters.length} chapters</div>
      <div class="bar duo" style="margin-top:10px"><i style="width:${pct(p.learned, p.total)}%"></i><b style="width:${pct(p.mastered, p.total)}%"></b></div>
      <div class="ts" style="margin-top:6px">${p.learned ? `${p.learned}/${p.total} learned · ${p.mastered} mastered` : 'Not started'}</div></a>`;
  };
  const group = (title, f) => { const list = courses.filter(f); return list.length ? `<div class="card"><h2>${title}</h2><div class="theme-grid course-grid">${list.map(card).join('')}</div></div>` : ''; };
  const started = courses.filter(c => progress(c.lines).learned > 0).sort((a, b) => progress(b.lines).due - progress(a.lines).due);
  body.innerHTML = `
    <div class="card hero">
      <h2>📘 Opening courses</h2>
      <p class="muted" style="margin-top:-6px;line-height:1.55;max-width:760px">Every line is explained move by move, in plain words. <b>Learn</b> a line, <b>drill</b> it from memory until it sticks (each perfect review pushes the next one further away), then <b>practise</b> against a bot that plays the course's lines at random and tells you exactly where you slipped.</p>
      <div class="row" style="margin-top:14px;gap:28px">
        <div class="kpi"><span class="v">${courses.length}</span><span class="l">courses</span></div>
        <div class="kpi"><span class="v">${all.length}</span><span class="l">explained lines</span></div>
        <div class="kpi"><span class="v">${P.learned}</span><span class="l">you've learned</span></div>
        <div class="kpi"><span class="v" style="${P.due ? 'color:var(--orange)' : ''}">${P.due}</span><span class="l">reviews due</span></div>
      </div>
      ${started.length ? `<h3 style="margin-top:18px">Continue where you left off</h3><div class="theme-grid course-grid">${started.slice(0, 6).map(card).join('')}</div>` : ''}
    </div>
    ${group('As White', c => c.color === 'w')}
    ${group('As Black against 1.e4', c => c.o.vs === 'e4')}
    ${group('As Black against 1.d4', c => c.o.vs === 'd4')}`;
}

// ---------------------------------------------------------------- Course page
/** Returns false when this opening has no course (the caller shows the plain opening page instead). */
export async function renderCoursePage(root, id) {
  const course = await loadCourse(id);
  if (!course) return false;
  const o = course.o;
  const p = progress(course.lines);
  const due = dueLines(course);
  const next = course.lines.find(l => lineStatus(l) === 'new');
  const st = courseStats(id);
  const last = st.sessions[st.sessions.length - 1];
  const my = openingProfile().mine[id] || { games: 0 };
  const chapter = ch => {
    const cp = progress(ch.lines);
    return `<div class="card course-ch">
      <div class="spread"><div><h2 style="margin:0">${ch.index + 1}. ${esc(ch.title)}</h2>${ch.about ? `<p class="muted" style="margin:4px 0 0;line-height:1.5">${esc(ch.about)}</p>` : ''}</div>
        <div class="row"><span class="muted small">${cp.learned}/${cp.total} learned</span>
          <a class="btn sm" href="${courseUrl(id, 'learn', { ch: ch.index })}">📖 Learn</a>
          <a class="btn sm" href="${courseUrl(id, 'drill', { ch: ch.index })}">🧠 Drill</a>
          <a class="btn sm" href="${courseUrl(id, 'practice', { ch: ch.index })}">🤖 Practice</a></div></div>
      <div class="table-wrap" style="margin-top:10px"><table class="tbl"><tbody>${ch.lines.map(l => `<tr>
        <td style="width:30px" class="muted">${l.index + 1}</td>
        <td><b>${esc(l.name)}</b><div class="muted small" style="margin-top:2px">${esc(fmtMoves(l.moves))}</div></td>
        <td style="width:110px">${statusPill(l)}</td>
        <td style="white-space:nowrap;text-align:right;width:1%"><a class="btn sm" href="${courseUrl(id, 'learn', { line: l.index })}">📖 Learn</a>
          <a class="btn sm primary" href="${courseUrl(id, 'drill', { line: l.index })}">🧠 Drill</a>
          <a class="btn sm" title="Play on from the end of this line against a bot" href="#/bots?color=${course.color}&moves=${encodeURIComponent(l.moves.join(' '))}">🤖</a></td></tr>`).join('')}</tbody></table></div>
    </div>`;
  };
  root.innerHTML = `
    <div class="page-head"><div><h1>${esc(o.name)}</h1><p>${sideLabel(o)} · ${STYLE[o.style]} · ${THEORY[o.theory]} · ${course.lines.length} lines in ${course.chapters.length} chapters${o.gotham ? ' · ♟ GothamChess favourite' : ''}</p></div>
      <div class="row">
        ${next ? `<a class="btn primary" href="${courseUrl(id, 'learn', { line: next.index })}">📖 ${p.learned ? 'Continue learning' : 'Start learning'}</a>` : ''}
        <a class="btn ${next ? '' : 'primary'}" href="${courseUrl(id, 'drill')}">🧠 Drill${due.length ? ` · ${due.length} due` : ''}</a>
        <a class="btn" href="${courseUrl(id, 'practice')}">🤖 Practice vs bot</a>
        <a class="btn" href="#/openings?tab=courses">← Courses</a>
      </div></div>
    <div class="grid g2">
      <div class="card stack">
        <p style="font-size:15px;line-height:1.6;margin:0">${esc(o.desc)}</p>
        ${course.intro ? `<p style="line-height:1.6;margin:0" class="muted">${esc(course.intro)}</p>` : ''}
        <div><h3>Key ideas</h3><ul style="line-height:1.7;margin:0;padding-left:20px">${o.ideas.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      </div>
      <div class="card stack">
        <h2>Your progress</h2>
        <div class="row" style="gap:26px">
          <div class="kpi"><span class="v">${p.learned}<span class="muted" style="font-size:16px">/${p.total}</span></span><span class="l">learned</span></div>
          <div class="kpi"><span class="v" style="color:#a7dc75">${p.mastered}</span><span class="l">mastered</span></div>
          <div class="kpi"><span class="v" style="${p.due ? 'color:var(--orange)' : ''}">${p.due}</span><span class="l">reviews due</span></div>
        </div>
        <div class="bar duo"><i style="width:${pct(p.learned, p.total)}%"></i><b style="width:${pct(p.mastered, p.total)}%"></b></div>
        <p class="muted small" style="line-height:1.55;margin:0"><b>How it works:</b> Learn a line and it joins your reviews. Drill it from memory: every perfect run pushes the next review further away (1, 3, 7, 14, 30 days) and a slip brings it back soon. Three perfect reviews in a row and the line is mastered.</p>
        ${last ? `<div class="insight"><span class="ic">🤖</span><span>Last practice ${ago(last.at)}: <b>${last.correct}/${last.total}</b> moves right first time (${pct(last.correct, last.total)}%) over ${plural(last.lines, 'line')}.${st.sessions.length > 1 ? ` Best: ${Math.max(...st.sessions.map(s => pct(s.correct, s.total)))}%.` : ''}</span></div>`
          : `<div class="insight"><span class="ic">🤖</span><span>Once you've learned a few lines, <b>practise vs the bot</b>: it plays the course's moves at random and grades every move you make.</span></div>`}
        ${my.games ? `<div class="insight"><span class="ic">📊</span><span>You've played this opening in <b>${my.games}</b> imported games and score <b>${my.score}%</b>.</span></div>` : ''}
      </div>
    </div>
    ${course.chapters.map(chapter).join('')}
    <div class="card" id="cv-games" style="margin-top:16px"><h2>📊 Your games vs this course</h2><p class="muted">Checking your games…</p></div>
    ${videosCard(o.name, '🎬 Videos', learnVideos(o.id))}`;
  setTimeout(() => { const el = $('#cv-games', root); if (el) gamesCard(el, course); }, 30);
  return true;
}

function gamesCard(el, course) {
  const r = gamesVsCourse(course);
  const head = '<h2>📊 Your games vs this course</h2>';
  if (!r.games) {
    el.innerHTML = `${head}<p class="muted" style="margin:0;line-height:1.5">${myGames().length ? `None of your imported games as ${course.color === 'w' ? 'White' : 'Black'} follow this opening yet. Learn a few lines and use them in your next games — I'll show where you and your opponents leave the course.` : 'Import your games and I\'ll show exactly where you — and your opponents — leave this course.'}</p>${myGames().length ? '' : '<a class="btn primary" href="#/import" style="margin-top:10px">Import games</a>'}`;
    return;
  }
  const sc = b => b.n ? `${Math.round((b.pts / b.n) * 100)}%` : '—';
  const fenAfter = moves => { const c = new Chess(); for (const m of moves) c.move(m); return c.fen(); };
  el.innerHTML = `${head}
    <div class="row" style="gap:28px">
      <div class="kpi"><span class="v">${r.games}</span><span class="l">games in this opening</span></div>
      <div class="kpi"><span class="v">${r.avgMoves.toFixed(1)}</span><span class="l">moves in the course, on average</span></div>
      <div class="kpi"><span class="v">${sc(r.stayed)}</span><span class="l">score when you stayed in it</span></div>
      <div class="kpi"><span class="v">${sc(r.left)}</span><span class="l">score when you left it first</span></div>
    </div>
    <div class="grid g2" style="margin-top:14px">
      <div><h3>Where you left the course</h3>${r.you.length ? r.you.slice(0, 8).map(d => `<div class="insight"><span class="ic">⚠️</span><span><b>${esc(moveLabel(d.ply, d.played))}</b> in ${plural(d.count, 'game')}: the course plays <b>${d.expected.map(e => esc(moveLabel(d.ply, e))).join(' or ')}</b>.
        <a href="#/review/${encodeURIComponent(d.games[0])}?ply=${d.ply + 1}">Review the game</a></span></div>`).join('')
        : '<p class="muted">You never left the course before your opponent did. 👏</p>'}</div>
      <div><h3>Where opponents surprised you</h3>${r.opp.length ? r.opp.slice(0, 8).map(d => `<div class="insight"><span class="ic">❓</span><span><b>${esc(moveLabel(d.ply, d.played))}</b> in ${plural(d.count, 'game')}: a move this course doesn't cover.
        <a href="#/analysis?fen=${encodeURIComponent(fenAfter([...d.before, d.played]))}">Find a plan</a></span></div>`).join('')
        : '<p class="muted">Your opponents always stayed inside the course.</p>'}</div>
    </div>`;
}

// ---------------------------------------------------------------- Trainer
export async function renderCourseTrainer(root, params) {
  const course = await loadCourse(params.course);
  if (!course) { root.innerHTML = `<div class="card empty"><p>Course not found.</p><a class="btn" href="#/openings?tab=courses">Back</a></div>`; return; }
  const id = course.id, color = course.color;
  const mode = ['learn', 'drill', 'practice'].includes(params.mode) ? params.mode : 'learn';
  const ch = params.ch !== undefined && params.ch !== '' && course.chapters[+params.ch] ? course.chapters[+params.ch] : null;
  const scope = ch ? ch.lines : course.lines;
  const one = params.line !== undefined && params.line !== '' ? course.lines[+params.line] || null : null;

  // what to study
  let queue = [];
  if (mode === 'learn') {
    if (one) queue = [one, ...course.lines.filter(l => l.index > one.index && lineStatus(l) === 'new')];
    else { queue = scope.filter(l => lineStatus(l) === 'new'); if (!queue.length) queue = [...scope]; }
  } else if (mode === 'drill') {
    if (one) queue = [one];
    else {
      const rep = l => state.repertoire[l.key];
      queue = scope.filter(l => lineStatus(l) === 'due');
      if (!queue.length) queue = scope.filter(l => rep(l)).sort((a, b) => rep(a).box - rep(b).box || rep(a).due - rep(b).due).slice(0, 10);
      if (!queue.length) queue = scope.slice(0, 10);
    }
  }
  if (mode !== 'practice' && !queue.length) { root.innerHTML = `<div class="card empty"><p>Nothing to study here.</p><a class="btn" href="#/openings?op=${id}">Back</a></div>`; return; }

  const where = ch ? `Chapter ${ch.index + 1}: ${ch.title}` : 'Whole course';
  const TITLES = { learn: '📖 Learn', drill: '🧠 Drill', practice: '🤖 Practice vs bot' };
  root.innerHTML = `
    <div class="page-head"><div><h1 id="tr-title"></h1><p id="tr-sub" class="muted"></p></div>
      <div class="row"><div class="tabs" style="margin:0;border:none">${Object.entries(TITLES).map(([m, t]) => `<button data-m="${m}" class="${m === mode ? 'active' : ''}">${t}</button>`).join('')}</div>
        <a class="btn" href="#/openings?op=${id}">← ${esc(course.o.name)}</a></div></div>
    <div class="board-layout">
      <div class="board-col"><div id="tr-board"></div></div>
      <div class="side-panel">
        <div class="sec"><div class="puz-status turn" id="tr-status"></div></div>
        <div class="sec"><div class="coach" id="tr-note"></div></div>
        <div class="sec"><div class="movelist" id="tr-moves" style="max-height:none"></div></div>
        <div class="sec"><div class="row">
          <button class="btn" id="tr-hint">💡 Hint</button>
          <button class="btn" id="tr-restart">↺ Restart line</button>
          <button class="btn primary" id="tr-next" style="margin-left:auto">Next ›</button>
        </div></div>
        <div class="sec" id="tr-after" style="display:none"></div>
      </div>
    </div>`;
  root.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
    const extra = { ...(ch ? { ch: ch.index } : {}), ...(one && b.dataset.m !== 'practice' ? { line: one.index } : {}) };
    location.hash = courseUrl(id, b.dataset.m, extra);
  });

  let chess, node, played, line, slips, busy = false, done = false, qi = 0;
  let wrongHere = false;            // already slipped in this position (it counts once)
  let gen = 0;                      // bumps on every (re)start, so delayed moves from an old line are dropped
  const coach = { mine: null, opp: null };
  const session = { rounds: 0, total: 0, correct: 0, mistakes: [], alternatives: [], lines: new Set() };
  const inScope = new Set(scope.map(l => l.index));
  const alive = () => root.isConnected;

  const board = new Board($('#tr-board', root), {
    orientation: color,
    dests: sq => busy || done ? [] : chess.moves({ square: sq, verbose: true }).map(m => m.to),
    movable: c => c === color && !busy && !done,
    inCheck: f => new Chess(f).inCheck(),
    onMove: (f, t, p) => onMove(f, t, p),
  });
  const status = (cls, html) => { const s = $('#tr-status', root); s.className = 'puz-status ' + cls; s.innerHTML = html; };
  const showNotes = extra => {
    const items = [coach.mine, coach.opp, extra].filter(Boolean);
    $('#tr-note', root).innerHTML = items.map(i => `<div class="cn ${i.cls || ''}"><b>${esc(i.title)}</b>${i.text ? `<span>${esc(i.text)}</span>` : ''}</div>`).join('')
      || `<div class="muted small">${mode === 'learn' ? 'Explanations appear here as you play.' : 'Play from memory — each move is explained once you play it.'}</div>`;
  };
  const arrowFor = san => { const c = new Chess(chess.fen()); const m = c.move(san); return [{ from: m.from, to: m.to, color: 'rgba(92,139,176,.85)' }]; };
  const turnDot = `<span class="turn-dot" style="background:${color === 'w' ? '#fff' : '#000'}"></span>`;
  const expected = () => mode === 'practice' ? [...node.kids.keys()] : [line.moves[played.length]];
  const atEnd = () => mode === 'practice' ? !node.kids.size : played.length >= line.moves.length;
  const sub = () => mode === 'practice'
    ? `${where} · line ${Math.min(session.rounds + 1, PRACTICE_ROUNDS)} of ${PRACTICE_ROUNDS} · ${session.correct}/${session.total} moves right first time`
    : `${course.chapters[line.chapter].title} · you play ${color === 'w' ? 'White' : 'Black'}${queue.length > 1 ? ` · line ${qi + 1} of ${queue.length}` : ''}`;

  function drawMoves() {
    const moves = mode === 'practice' ? played : line.moves;
    const step = played.length;
    $('#tr-moves', root).innerHTML = `<div class="small" style="line-height:1.9">${moves.map((m, i) => {
      const shown = mode === 'practice' || i < step || (mode === 'learn' && i === step);
      const cur = mode !== 'practice' && i === step && !done;
      return `${i % 2 === 0 ? `<span class="muted">${i / 2 + 1}.</span> ` : ''}<span style="${cur ? 'background:#24406e;padding:1px 4px;border-radius:4px' : ''}">${shown ? esc(m) : '?'}</span> `;
    }).join('') || '<span class="muted">The line starts from the first move.</span>'}</div>`;
  }

  function startLine() {
    if (mode !== 'practice') line = queue[qi];
    gen++;
    chess = new Chess(); node = course.root; played = []; slips = 0; wrongHere = false; done = false; busy = false;
    coach.mine = mode !== 'practice' && line.intro ? { title: 'About this line', text: line.intro, cls: 'intro' } : null;
    coach.opp = null;
    $('#tr-after', root).style.display = 'none';
    $('#tr-title', root).textContent = mode === 'practice' ? `${course.o.name}: practice` : line.name;
    board.set({ fen: chess.fen(), orientation: color, lastMove: null, arrows: [], marks: {} });
    advance();
  }

  function playMove(san) {
    const k = node.kids.get(san);
    const m = chess.move(san);
    played.push(m.san);
    if (k) node = k;
    return { m, k };
  }

  // the bot's reply in practice: prefer lines not yet played this session
  function pickBot() {
    const fresh = new Set([...inScope].filter(i => !session.lines.has(i)));
    const kids = [...node.kids.values()];
    const pick = pool => kids.filter(k => k.lines.some(i => pool.has(i)));
    const list = (fresh.size && pick(fresh).length ? pick(fresh) : pick(inScope).length ? pick(inScope) : kids);
    return botMove({ kids: new Map(list.map(k => [k.san, k])) });
  }

  function advance() {
    if (!alive()) return;
    drawMoves();
    $('#tr-sub', root).textContent = sub();
    if (atEnd()) return finishLine();
    if (chess.turn() !== color) {
      busy = true;
      status('turn', 'Opponent is moving…');
      const g = gen;
      setTimeout(() => {
        if (!alive() || g !== gen) return;
        const san = mode === 'practice' ? pickBot().san : line.moves[played.length];
        const { m, k } = playMove(san);
        busy = false;
        board.set({ fen: chess.fen(), lastMove: [m.from, m.to], arrows: [], marks: {} });
        coach.opp = k?.note ? { title: moveLabel(played.length - 1, m.san), text: k.note, cls: 'opp' } : null;
        advance();
      }, mode === 'learn' ? 650 : 450);
      return;
    }
    wrongHere = false;
    const exp = expected();
    if (mode === 'learn') {
      status('turn', `${turnDot} Play <b>${esc(exp[0])}</b> (follow the arrow)`);
      showNotes({ title: `Your move: ${moveLabel(played.length, exp[0])}`, text: node.kids.get(exp[0])?.note || '', cls: 'you' });
      board.set({ arrows: arrowFor(exp[0]) });
    } else {
      status('turn', `${turnDot} ${mode === 'practice' ? 'Your move: what does the course play here?' : 'Your move: what comes next in this line?'}`);
      showNotes();
      board.set({ arrows: [] });
    }
  }

  function slip(playedSan, cls = null) {
    slips++;
    if (wrongHere) return;
    wrongHere = true;
    if (mode === 'practice') {
      session.total++;
      const exp = expected();
      session.mistakes.push({ played: playedSan, cls, expected: exp, before: [...played], note: node.kids.get(exp[0])?.note || '' });
      $('#tr-sub', root).textContent = sub();
    }
  }

  // the course's next few moves after `san` (the most-played branch of the course)
  function courseNext(san, n = 4) {
    if (mode !== 'practice') return line.moves.slice(played.length + 1, played.length + 1 + n);
    const out = [];
    let k = node.kids.get(san);
    while (k && k.kids.size && out.length < n) { k = [...k.kids.values()].sort((a, b) => b.lines.length - a.lines.length)[0]; out.push(k.san); }
    return out;
  }
  const numbered = (moves, ply) => moves.map((m, i) => { const p = ply + i; return (p % 2 === 0 ? `${p / 2 + 1}.` : i === 0 ? `${Math.floor(p / 2) + 1}...` : '') + m; }).join(' ');

  // You played something other than the course move: say how good it is, how the game goes on, and what the course plays.
  async function showAlternative(m, before, exp) {
    busy = true;
    const g = gen, ply = played.length;
    const shown = new Chess(before);
    shown.move(m.san);
    board.set({ fen: shown.fen(), lastMove: [m.from, m.to], arrows: [], marks: {} });
    status('turn', `Checking ${esc(moveLabel(ply, m.san))}…`);
    let r = null;
    try { r = await gradeMove(before, m.san, played); } catch (e) { console.warn('grading failed', e); }
    if (!alive() || g !== gen) return;
    const good = !!r && GOOD.includes(r.cls);
    if (mode !== 'learn') { if (good) { if (mode === 'practice') session.alternatives.push({ played: m.san, cls: r.cls, expected: exp, before: [...played] }); } else slip(m.san, r?.cls); }
    const label = moveLabel(ply, m.san);
    const name = r ? (r.cls === 'book' ? 'Book move' : CLS[r.cls].label + (GOOD.includes(r.cls) ? ' move' : '')) : 'Not the course move';
    status(good ? 'ok' : r ? 'bad' : 'done', `${r ? clsIcon(r.cls) : ''}<span><b>${esc(name)}</b>: ${esc(label)}</span>`);
    const next = courseNext(exp[0]);
    const items = [
      { title: `${name}: ${label}`, text: r ? `${VERDICT[r.cls]}${r.cls === 'book' && r.opening ? ` (${r.opening.name})` : ''} Engine after your move: ${fmtEval(r.score)}.` : 'The engine couldn\'t check this move right now.', cls: good ? 'ok' : 'bad' },
      r?.cont?.length ? { title: `How to continue after ${m.san}`, text: `Stockfish suggests: ${pvText(r.fenAfter, r.cont, ply + 1)}`, cls: 'intro' } : null,
      { title: `The course plays ${moveLabel(ply, exp[0])}${exp.length > 1 ? ` (or ${exp.slice(1).join(', ')})` : ''}`, text: `${node.kids.get(exp[0])?.note || ''}${next.length ? ` The course continues: ${numbered(next, ply + 1)}.` : ''}`, cls: 'you' },
    ].filter(Boolean);
    $('#tr-note', root).innerHTML = items.map(i => `<div class="cn ${i.cls}"><b>${esc(i.title)}</b><span>${esc(i.text)}</span></div>`).join('');
    const after = $('#tr-after', root);
    after.style.display = '';
    after.innerHTML = `<div class="row"><button class="btn primary" id="tr-back">↩ Play the course move</button>
      <a class="btn" href="#/bots?color=${color}&moves=${encodeURIComponent([...played, m.san].join(' '))}">▶ Keep ${esc(m.san)} and play on vs bot</a></div>`;
    $('#tr-back', root).onclick = () => {
      if (g !== gen) return;
      after.style.display = 'none';
      busy = false;
      board.set({ fen: chess.fen(), lastMove: null, arrows: arrowFor(exp[0]), marks: {} });
      status('turn', `${turnDot} Play the course move <b>${esc(exp[0])}</b> to carry on with the course.`);
    };
  }

  function onMove(from, to, promo) {
    const before = chess.fen();
    let m;
    try { m = chess.move({ from, to, promotion: promo || 'q' }); } catch { board.render(); return; }
    chess.load(before);
    const exp = expected();
    if (exp.includes(m.san)) {
      if (mode === 'practice' && !wrongHere) { session.total++; session.correct++; }
      const { m: mv, k } = playMove(m.san);
      board.set({ fen: chess.fen(), lastMove: [mv.from, mv.to], marks: { [mv.to]: 'right' }, arrows: [] });
      coach.mine = { title: `✓ Course move: ${moveLabel(played.length - 1, mv.san)}`, text: k?.note || '', cls: 'ok' };
      coach.opp = null;
      $('#tr-after', root).style.display = 'none';
      advance();
      return;
    }
    if (mode === 'drill' && node.kids.has(m.san)) { // a move from a different line of this course
      busy = true;
      board.set({ marks: { [to]: 'right' }, arrows: [] });
      status('ok', `✓ ${esc(m.san)} is a course move too, from another line. In <b>${esc(line.name)}</b> the course plays something else here: try again.`);
      const g0 = gen;
      setTimeout(() => { if (alive() && g0 === gen) { busy = false; board.set({ fen: chess.fen(), marks: {} }); } }, 1400);
      return;
    }
    showAlternative(m, before, exp);
  }

  // At the end of a line: how the game goes on from here.
  async function continuationHint() {
    const g = gen, fen = chess.fen(), ply = played.length;
    let r = null;
    try { r = await getEngine('coach').analyze(fen, { depth: 13, movetime: 3000 }); } catch { /* engine unavailable */ }
    if (!alive() || g !== gen || !r?.lines?.length) return;
    const text = pvText(fen, r.lines[0].pv, ply);
    if (!text) return;
    $('#tr-note', root).insertAdjacentHTML('beforeend', `<div class="cn intro"><b>How to continue the opening</b><span>Stockfish suggests: ${esc(text)} (engine ${esc(fmtEval(r.lines[0].score))}).</span></div>`);
  }

  function finishLine() {
    done = true;
    drawMoves();
    showNotes();
    continuationHint();
    const after = $('#tr-after', root);
    after.style.display = '';
    const botLink = `<a class="btn" href="#/bots?color=${color}&moves=${encodeURIComponent(played.join(' '))}">🤖 Play on vs engine bot</a>`;
    if (mode === 'learn') {
      markLearned(line);
      status('done', '📖 Line learned. It\'s in your reviews now.');
      after.innerHTML = `<div class="row">${qi < queue.length - 1 ? '<button class="btn primary" id="tr-go">Next line ›</button>' : `<a class="btn primary" href="${courseUrl(id, 'drill', { line: line.index })}">🧠 Drill it now</a>`}
        <button class="btn" id="tr-again">↺ See it again</button>${botLink}</div>`;
    } else if (mode === 'drill') {
      const perfect = slips === 0;
      gradeLine(line, perfect);
      const r = state.repertoire[line.key];
      const days = Math.round((r.due - Date.now()) / 86400000);
      status(perfect ? 'ok' : 'done', perfect ? `✅ Perfect from memory! Next review in ${plural(days, 'day')}${r.box >= MASTERED_BOX ? '. Mastered' : ''}.` : `✔ Done with ${plural(slips, 'slip')}. This line comes back in 10 minutes.`);
      after.innerHTML = `<div class="row">${qi < queue.length - 1 ? '<button class="btn primary" id="tr-go">Next line ›</button>' : `<a class="btn primary" href="#/openings?op=${id}">Back to the course</a>`}
        <button class="btn" id="tr-again">↺ Again</button>${botLink}</div>`;
    } else {
      const li = node.lines.find(i => inScope.has(i)) ?? node.lines[0];
      const pl = course.lines[li];
      session.lines.add(li);
      session.rounds++;
      gradeLine(pl, slips === 0);
      status(slips ? 'done' : 'ok', slips ? `✔ End of “${esc(pl.name)}” with ${plural(slips, 'slip')}.` : `✅ “${esc(pl.name)}” played perfectly!`);
      if (session.rounds >= PRACTICE_ROUNDS) return report();
      after.innerHTML = `<div class="row"><button class="btn primary" id="tr-go">Next line ›</button>${botLink}<button class="btn ghost" id="tr-stop">Finish session</button></div>`;
      $('#tr-stop', root).onclick = report;
    }
    $('#tr-go', root)?.addEventListener('click', () => { if (mode !== 'practice') qi++; startLine(); });
    $('#tr-again', root)?.addEventListener('click', startLine);
  }

  function report() {
    done = true;
    if (session.total) saveSession(id, { at: Date.now(), lines: session.rounds, total: session.total, correct: session.correct, mistakes: session.mistakes.length, chapter: ch ? ch.index : null });
    const acc = pct(session.correct, session.total);
    const verdict = !session.total ? 'No moves played yet.' : acc >= 95 ? 'Excellent: you know these lines cold.' : acc >= 80 ? 'Solid. A few spots to tidy up.' : acc >= 60 ? 'Getting there. Drill the spots below.' : 'These lines need more work. Go through them in Learn mode, then drill.';
    status(acc >= 80 ? 'ok' : 'done', `📋 Session report: ${session.correct}/${session.total} moves right first time (${acc}%)`);
    $('#tr-sub', root).textContent = `${where} · ${plural(session.rounds, 'line')} practised`;
    const after = $('#tr-after', root);
    after.style.display = '';
    after.innerHTML = `
      <p style="margin:0 0 8px"><b>${verdict}</b>${session.mistakes.length ? ` ${plural(session.mistakes.length, 'move')} to fix:` : ''}</p>
      ${session.mistakes.map(x => `<div class="insight"><span class="ic">${x.cls ? clsIcon(x.cls) : '💡'}</span><span>${x.before.length ? `After <span class="muted">${esc(fmtMoves(x.before).split(' ').slice(-3).join(' '))}</span>` : 'On move 1'} you played <b>${esc(x.played)}</b>${x.cls ? ` (${esc(CLS[x.cls].label.toLowerCase())})` : ''}; the course plays <b>${esc(x.expected.join(' or '))}</b>.${x.note ? ` <span class="muted">${esc(x.note)}</span>` : ''}</span></div>`).join('')}
      ${session.alternatives.length ? `<p style="margin:12px 0 4px"><b>Good alternatives you found</b> <span class="muted">(no penalty)</span></p>
      ${session.alternatives.map(x => `<div class="insight"><span class="ic">${clsIcon(x.cls)}</span><span>${x.before.length ? `After <span class="muted">${esc(fmtMoves(x.before).split(' ').slice(-3).join(' '))}</span>` : 'On move 1'}, <b>${esc(x.played)}</b> is ${x.cls === 'book' ? 'a book move' : `${CLS[x.cls].label === 'Best' ? 'the best move' : `a${x.cls === 'excellent' ? 'n' : ''} ${CLS[x.cls].label.toLowerCase()} move`}`}; the course plays <b>${esc(x.expected.join(' or '))}</b>.</span></div>`).join('')}` : ''}
      <div class="row" style="margin-top:10px"><button class="btn primary" id="tr-again2">↺ Practice again</button>
        ${session.mistakes.length ? `<a class="btn" href="${courseUrl(id, 'drill', ch ? { ch: ch.index } : {})}">🧠 Drill the lines you missed</a>` : ''}
        <a class="btn" href="#/openings?op=${id}">Back to the course</a></div>`;
    $('#tr-again2', root).onclick = () => { Object.assign(session, { rounds: 0, total: 0, correct: 0, mistakes: [], alternatives: [], lines: new Set() }); startLine(); };
  }

  $('#tr-hint', root).onclick = () => {
    if (done || busy || chess.turn() !== color) return;
    const exp = expected();
    if (mode !== 'learn') slip('(asked for a hint)');
    board.set({ arrows: arrowFor(exp[0]) });
    showNotes({ title: `Hint: ${moveLabel(played.length, exp[0])}`, text: node.kids.get(exp[0])?.note || '', cls: 'you' });
  };
  $('#tr-restart', root).onclick = startLine;
  $('#tr-next', root).onclick = () => {
    if (mode === 'practice') { if (!done && played.length) session.rounds++; if (session.rounds >= PRACTICE_ROUNDS) report(); else startLine(); return; }
    if (qi < queue.length - 1) { qi++; startLine(); } else location.hash = `#/openings?op=${id}`;
  };
  startLine();
}
