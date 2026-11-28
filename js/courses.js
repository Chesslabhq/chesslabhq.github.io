// Opening courses: chapters of explained lines (js/data/courses/<id>.js), merged into one move tree.
// Progress uses the spaced-repetition repertoire (a learned line is a repertoire entry), and practice
// sessions against the course bot are kept per course.
import { Chess } from './lib.js';
import { state, save, myGames, userResult } from './store.js';
import { parseGame } from './analysis.js';
import { CATALOG, byId } from './data/catalog.js';

export const DAY = 86400000;
export const INTERVALS = [0, 1, 3, 7, 14, 30, 60]; // days until the next review, by box
export const MASTERED_BOX = 3;                     // reviewed correctly 3 times in a row (a week apart)
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

export const lineKey = (moves, color) => color + ':' + moves.join(' '); // same id as the repertoire uses
export const moveLabel = (ply, san) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '...' : '.'} ${san}`;

/** "e4 {why} e5 Nf3 {why} …" -> moves, the note after each move, and an optional {intro} before the first move. */
export function parsePgn(pgn) {
  const moves = [], notes = [];
  let intro = null;
  for (const m of pgn.matchAll(/\{([^}]*)\}|(\S+)/g)) {
    if (m[1] !== undefined) {
      const t = m[1].trim().replace(/\s+/g, ' ');
      if (moves.length) notes[moves.length - 1] = t; else intro = t;
    } else { moves.push(m[2]); notes.push(null); }
  }
  return { moves, notes, intro };
}

const cache = {};
/** Load and build a course (null if this opening has no course yet). */
export async function loadCourse(id) {
  if (cache[id]) return cache[id];
  const o = byId(id);
  if (!o) return null;
  let data;
  try { data = (await import(`./data/courses/${id}.js`)).default; } catch { return null; }
  const color = o.side;
  const root = { kids: new Map(), note: null, lines: [], ply: 0 };
  const lines = [];
  const byPos = new Map(); // "position|move" -> note, so a move reached by another move order keeps its explanation
  const posKey = (fen, san) => fen.split(' ').slice(0, 4).join(' ') + '|' + san;
  data.chapters.forEach((ch, ci) => ch.lines.forEach(l => {
    const { moves, notes, intro } = parsePgn(l.pgn);
    const c = new Chess(), keys = [];
    for (let i = 0; i < moves.length; i++) {
      const before = c.fen();
      try { moves[i] = c.move(moves[i]).san; } catch { console.warn(`Course ${id}, "${l.name}": illegal move ${moves[i]}`); moves.length = i; break; }
      keys.push(posKey(before, moves[i]));
      if (notes[i] && !byPos.has(keys[i])) byPos.set(keys[i], notes[i]);
    }
    notes.length = moves.length;
    lines.push({ key: lineKey(moves, color), course: id, chapter: ci, index: lines.length, name: l.name, intro, moves, notes, keys, color, fen: c.fen() });
  }));
  for (const line of lines) line.notes = line.moves.map((_, i) => line.notes[i] || byPos.get(line.keys[i]) || null);
  // one tree for the whole course: explanations written once are shown wherever that move appears
  for (const line of lines) {
    let node = root;
    line.moves.forEach((mv, i) => {
      let k = node.kids.get(mv);
      if (!k) { k = { kids: new Map(), note: null, lines: [], san: mv, ply: i + 1 }; node.kids.set(mv, k); }
      if (!k.note && line.notes[i]) k.note = line.notes[i];
      k.lines.push(line.index);
      node = k;
    });
  }
  for (const line of lines) {
    let node = root;
    line.notes = line.moves.map(mv => (node = node.kids.get(mv)).note);
  }
  const chapters = data.chapters.map((ch, ci) => ({ index: ci, title: ch.title, about: ch.about || '', lines: lines.filter(l => l.chapter === ci) }));
  return (cache[id] = { id, o, color, intro: data.intro || '', chapters, lines, root });
}

/** Every course that exists, in catalog order. */
export async function loadAllCourses() {
  const all = await Promise.all(CATALOG.map(o => loadCourse(o.id)));
  return all.filter(Boolean);
}

/** Walk the tree along a list of moves (null if they leave the course). */
export function nodeAt(course, moves) {
  let node = course.root;
  for (const mv of moves) { node = node.kids.get(mv); if (!node) return null; }
  return node;
}

// ---------------------------------------------------------------- Progress (spaced repetition)
export function lineStatus(line) {
  const r = state.repertoire[line.key];
  if (!r) return 'new';
  if (r.due <= Date.now()) return 'due';
  return r.box >= MASTERED_BOX ? 'mastered' : 'learning';
}
export function progress(lines) {
  const p = { total: lines.length, new: 0, learning: 0, due: 0, mastered: 0 };
  for (const l of lines) p[lineStatus(l)]++;
  p.learned = p.total - p.new;
  return p;
}
function repName(line) { return `${byId(line.course)?.name || 'Course'} — ${line.name}`; }

/** You've been taught this line: it joins your repertoire and comes back for a first review soon. */
export function markLearned(line) {
  if (state.repertoire[line.key]) return;
  state.repertoire[line.key] = { id: line.key, name: repName(line), moves: line.moves, color: line.color, course: line.course, box: 0, due: Date.now() + 10 * 60000, reps: 0, fails: 0, added: Date.now() };
  save('repertoire');
}
/** A line played from memory: perfect moves it up a box (longer gap), any slip sends it back to the start. */
export function gradeLine(line, perfect) {
  let r = state.repertoire[line.key];
  if (!r) { markLearned(line); r = state.repertoire[line.key]; }
  if (perfect) { r.reps++; r.box = Math.min(INTERVALS.length - 1, r.box + 1); r.due = Date.now() + INTERVALS[r.box] * DAY; }
  else { r.fails++; r.box = 0; r.due = Date.now() + 10 * 60000; }
  save('repertoire');
}
export function dueLines(course) { return course.lines.filter(l => lineStatus(l) === 'due'); }

// ---------------------------------------------------------------- Practice sessions
export function courseStats(id) { return state.courses[id] || { sessions: [] }; }
export function saveSession(id, s) {
  const c = state.courses[id] || (state.courses[id] = { sessions: [] });
  c.sessions.push(s);
  if (c.sessions.length > 50) c.sessions.splice(0, c.sessions.length - 50);
  save('courses');
}

/** Pick the bot's reply: any course move from here, more likely where the course has more lines. */
export function botMove(node, rand = Math.random) {
  const kids = [...node.kids.values()];
  if (!kids.length) return null;
  let r = rand() * kids.reduce((s, k) => s + k.lines.length, 0);
  for (const k of kids) { r -= k.lines.length; if (r < 0) return k; }
  return kids[kids.length - 1];
}

// ---------------------------------------------------------------- Your real games against the course
/**
 * For every imported game where you played this opening (your first three moves are the course's),
 * how far you stayed in the course, where you left it, and where your opponents did.
 */
export function gamesVsCourse(course) {
  const out = { games: 0, plies: 0, completed: 0, you: {}, opp: {}, stayed: { n: 0, pts: 0 }, left: { n: 0, pts: 0 } };
  const pts = g => ({ win: 1, draw: 0.5 }[userResult(g)] || 0);
  for (const g of myGames()) {
    if (g.userColor !== course.color) continue;
    let P;
    try { P = parseGame(g.pgn); } catch { continue; }
    if (P.start.split(' ')[0] !== START || !P.moves.length) continue;
    let node = course.root, i = 0, mine = 0;
    while (i < P.moves.length && node.kids.has(P.moves[i].san)) {
      if (P.moves[i].color === course.color) mine++;
      node = node.kids.get(P.moves[i].san);
      i++;
    }
    const next = P.moves[i];
    const yoursNext = next && next.color === course.color;
    if (yoursNext && mine < 3) continue; // you were playing a different opening
    if (!next && mine < 3) continue;
    out.games++;
    out.plies += i;
    if (!next || !node.kids.size) { out.completed++; out.stayed.n++; out.stayed.pts += pts(g); continue; }
    const expected = [...node.kids.keys()];
    const key = `${i}|${next.san}`;
    if (yoursNext) {
      const d = out.you[key] || (out.you[key] = { ply: i, played: next.san, expected, count: 0, games: [] });
      d.count++; d.games.push(g.id);
      out.left.n++; out.left.pts += pts(g);
    } else {
      const d = out.opp[key] || (out.opp[key] = { ply: i, played: next.san, before: P.moves.slice(0, i).map(m => m.san), count: 0, games: [] });
      d.count++; d.games.push(g.id);
      out.stayed.n++; out.stayed.pts += pts(g);
    }
  }
  const sortDev = o => Object.values(o).sort((a, b) => b.count - a.count || a.ply - b.ply);
  return { ...out, you: sortDev(out.you), opp: sortDev(out.opp), avgMoves: out.games ? out.plies / out.games / 2 : 0 };
}
