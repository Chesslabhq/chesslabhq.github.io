// Bundled puzzles from the Lichess puzzle database (CC0), sorted by rating, so they load instantly with no rate limits.
// Row: [id, fen (after the opponent's setup move), setup move, solution, rating, themes]
import { state, save, myGames } from './store.js';

let DB = null, loading = null;

export function loadPuzzles() {
  if (DB) return Promise.resolve(DB);
  if (!loading) loading = fetch(new URL('./data/puzzles.json', import.meta.url)).then(r => {
    if (!r.ok) throw new Error('Could not load puzzles');
    return r.json();
  }).then(d => (DB = d)).catch(e => { loading = null; throw e; });
  return loading;
}

const toPuzzle = ([id, fen, last, sol, rating, themes]) => ({
  id: 'lp_' + id, source: 'lichess', fen, solution: sol.split(' '), alts: [], rating,
  themes: themes ? themes.split(' ') : [], lastMove: [last.slice(0, 2), last.slice(2, 4)],
  url: `https://lichess.org/training/${id}`,
});

/** A random puzzle close to the target rating, skipping ids in `seen`; widens the search if needed. */
export function pickPuzzle(target, seen = new Set()) {
  if (!DB) return null;
  for (const spread of [60, 120, 250, 500, 3000]) {
    const pool = [];
    for (const row of DB) {
      if (row[4] > target + spread) break;
      if (row[4] >= target - spread && !seen.has('lp_' + row[0])) pool.push(row);
    }
    if (pool.length) return toPuzzle(pool[Math.floor(Math.random() * pool.length)]);
  }
  return null;
}

/** Start your puzzle rating from your real game rating the first time you play rated puzzles. */
export function seedPuzzleRating() {
  const p = state.pstats;
  if (p.seeded || p.history.some(h => h.src === 'lichess')) return;
  const r = myGames().slice(0, 30).map(g => g.userColor === 'w' ? g.whiteElo : g.blackElo).filter(Boolean).sort((a, b) => a - b);
  if (r.length) p.rating = r[Math.floor(r.length / 2)];
  p.seeded = true;
  save('pstats');
}
