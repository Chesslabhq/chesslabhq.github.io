// "What rating did I actually play at?" — estimated from engine accuracy, plus brutally honest verdicts.
import { parseGame, moverWin } from './analysis.js';

// How it works: accuracy alone can't tell players apart — measured on real games, a 1250 blitz game scored 82.6%
// while a Magnus Carlsen blitz game scored 78%, because strong opponents create harder positions. So the estimate
// starts from the opponent's rating and moves it by how much more (or less) accurately you played than they did,
// plus a little for the result. The fixed accuracy curve below is only a fallback when there's no opponent rating.
const POINTS_PER_ACC = 22;   // rating points per accuracy point of difference
const MAX_SWING = 600;       // a single game can't move the estimate more than this from the opponent's rating
const RESULT_ADJ = { win: 60, draw: 0, loss: -60 };

// Fallback calibration of single-game accuracy -> playing strength.
const CURVE = [[40, 200], [55, 500], [65, 800], [72, 1000], [78, 1200], [83, 1450], [88, 1750], [92, 2100], [95, 2450], [98, 2850]];
function fromAccuracy(acc) {
  if (acc <= CURVE[0][0]) return CURVE[0][1];
  for (let i = 1; i < CURVE.length; i++) {
    const [a1, r1] = CURVE[i - 1], [a2, r2] = CURVE[i];
    if (acc <= a2) return r1 + ((acc - a1) / (a2 - a1)) * (r2 - r1);
  }
  return CURVE.at(-1)[1];
}

const round25 = x => Math.round(x / 25) * 25;

/** Estimated rating you played at in one analysed game, with the facts behind it. */
export function playedRating(g) {
  return g.userColor ? playedRatingFor(g, g.userColor) : null;
}

/** The same estimate for your opponent. */
export function opponentPlayedRating(g) {
  return g.userColor ? playedRatingFor(g, g.userColor === 'w' ? 'b' : 'w') : null;
}

const resultFor = (g, color) => g.result === '1/2-1/2' ? 'draw'
  : g.result === '1-0' ? (color === 'w' ? 'win' : 'loss')
  : g.result === '0-1' ? (color === 'b' ? 'win' : 'loss') : null;

/** Estimated rating one side (color 'w' or 'b') played at. */
export function playedRatingFor(g, color) {
  const A = g.analysis;
  if (!A || !color) return null;
  const me = color;
  const oppColor = me === 'w' ? 'b' : 'w';
  const realMoves = color => A.moves.filter(m => m.color === color && m.cls !== 'book' && m.cls !== 'forced');
  const accOf = list => {
    if (!list.length) return null;
    const mean = list.reduce((s, m) => s + m.acc, 0) / list.length;
    const harm = list.length / list.reduce((s, m) => s + 1 / Math.max(m.acc, 5), 0);
    return +((mean + harm) / 2).toFixed(1);
  };
  const nonBook = realMoves(me);
  if (nonBook.length < 5) return null;
  const acc = accOf(nonBook);
  const oppAcc = accOf(realMoves(oppColor));
  const c = A.counts[me] || {};
  const blunders = c.blunder || 0, mistakes = (c.mistake || 0) + (c.miss || 0);
  const wasWinning = A.positions.some(p => moverWin(p.eval, me) >= 85);
  const res = resultFor(g, me);
  const threw = wasWinning && res !== 'win';
  const oppRating = me === 'w' ? g.blackElo : g.whiteElo;
  let est;
  if (oppRating && oppAcc != null) {
    const swing = Math.max(-MAX_SWING, Math.min(MAX_SWING, POINTS_PER_ACC * (acc - oppAcc)));
    est = oppRating + swing + (RESULT_ADJ[res] || 0);
    if (threw) est -= 50;
  } else {
    // no opponent rating (e.g. a pasted PGN): fall back to accuracy alone
    est = fromAccuracy(acc) - Math.min(450, blunders * 75 + mistakes * 30);
    if (!blunders && !mistakes && nonBook.length >= 15) est += 75;
    if (threw) est -= 100;
  }
  let spent = [];
  try { const P = parseGame(g.pgn); spent = P.moves.map((m, i) => m.color === me ? P.spent[i] : null); } catch { /* ignore */ }
  const rushedBlunders = A.moves.filter((m, i) => m.color === me && m.cls === 'blunder' && spent[i] != null && spent[i] < 4).length;
  const actual = me === 'w' ? g.whiteElo : g.blackElo;
  const opp = oppRating;
  const rating = Math.max(100, Math.min(3500, round25(est)));
  return {
    rating, actual, opp, delta: actual ? rating - actual : null, acc, oppAcc, blunders, mistakes, threw, rushedBlunders, res,
    lowConfidence: nonBook.length < 12,
    timeLoss: res === 'loss' && /time/i.test(g.termination || ''),
  };
}

const pick = (arr, seed) => arr[Math.abs(seed) % arr.length];

/** A short, brutally honest verdict for one game. */
export function verdict(p, seed = 0) {
  if (!p) return '';
  const lines = [];
  const d = p.delta;
  if (d == null) lines.push(`You played like a ${p.rating}.`);
  else if (d >= 300) lines.push(pick([`You played ${d} points above your rating. Frame this one — it won't happen often.`, `A ${p.rating} showed up today. Who was that?`, `Genuinely strong. Now do it again, because one game is a fluke.`], seed));
  else if (d >= 100) lines.push(pick([`Solid — ${d} points above your rating. Don't let it go to your head.`, `Above your level. This is the bar now.`], seed));
  else if (d > -100) lines.push(pick([`You played exactly like your rating. Nothing more, nothing less.`, `Perfectly average for you. That's the problem.`, `Rating-accurate chess. Your rating isn't lying.`], seed));
  else if (d > -300) lines.push(pick([`You played ${-d} points below your rating. Sloppy.`, `That was a ${p.rating}'s game wearing a ${p.actual} badge.`, `${-d} points of strength left on the table.`], seed));
  else if (d > -600) lines.push(pick([`You played like a ${p.rating}. Your opponent should've been embarrassed to lose — if they did.`, `${-d} points below your rating. This wasn't chess, it was a donation.`, `A ${p.rating} performance. Your rating is currently writing cheques your moves can't cash.`], seed));
  else lines.push(pick([`You played like a ${p.rating}. Did you play this one with your eyes closed?`, `${-d} points below your rating. Delete this game from your memory, then study it twice.`, `That's a beginner's game. No excuses.`], seed));

  if (p.threw) lines.push(pick(['You were completely winning and still didn\'t win. That\'s the most expensive habit in chess.', 'Had it won. Gave it back. Classic.'], seed));
  if (p.blunders >= 3) lines.push(`${p.blunders} blunders. That's not bad luck, that's not checking your moves.`);
  else if (p.blunders === 2) lines.push('Two blunders in one game — one is a mistake, two is a pattern.');
  if (p.rushedBlunders) lines.push(`${p.rushedBlunders} of those blunders took you under 4 seconds. Slow down.`);
  if (p.timeLoss) lines.push('And you lost on time. The clock is part of the game.');
  if (p.res === 'win' && d != null && d < -200) lines.push('You won, but don\'t confuse a win with good chess — your opponent just blundered last.');
  if (p.res === 'loss' && d != null && d >= 100) lines.push('Unlucky — you played well and still lost. Find the one moment that decided it.');
  if (p.lowConfidence) lines.push('(Short game — take this estimate with a grain of salt.)');
  return lines.join(' ');
}

/** Overall verdict across many games. */
export function overallVerdict(avgPlayed, avgActual, spread, below) {
  const d = Math.round(avgPlayed - avgActual);
  let s;
  if (d >= 150) s = `On average you play like a ${avgPlayed}, ${d} points above your rating. You're underrated — go prove it.`;
  else if (d >= 50) s = `You're playing slightly above your rating (${avgPlayed} vs ${avgActual}). Expect it to climb — if you stay consistent.`;
  else if (d > -50) s = `You play like a ${avgPlayed}. Your rating is ${avgActual}. It's accurate. If you want it higher, your chess has to get better — there's no shortcut.`;
  else if (d > -200) s = `You average a ${avgPlayed} performance on a ${avgActual} rating. You're living on borrowed points — your blunders are dragging you down.`;
  else s = `Brutal truth: you're playing like a ${avgPlayed}, ${-d} points below your ${avgActual} rating. Your results are better than your moves, and that never lasts.`;
  if (spread >= 350) s += ` Your level swings wildly (±${spread}) — one game a ${avgPlayed + spread}, the next a ${Math.max(100, avgPlayed - spread)}. Consistency is your real problem.`;
  if (below >= 60) s += ` ${below}% of your games are played below your rating.`;
  return s;
}
