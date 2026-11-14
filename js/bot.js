// Rating-adjustable bot built on Stockfish: weaker settings + human-like mistakes at lower ratings.
import { Chess } from './lib.js';
import { getEngine } from './engine.js';
import { evalCp } from './analysis.js';

export const BOTS = [
  { id: 'pip', name: 'Pip', avatar: '🐣', rating: 250, style: 'Just learned how the pieces move.', hello: 'Hi! Is the horsey the one that jumps?' },
  { id: 'rosa', name: 'Rosa', avatar: '🌹', rating: 600, style: 'Likes to attack early — and hangs pieces.', hello: 'I love bringing my queen out early!' },
  { id: 'carl', name: 'Club Carl', avatar: '🧢', rating: 1000, style: 'A typical club player. Sound-ish, but blunders under pressure.', hello: 'Good luck, have fun!' },
  { id: 'tara', name: 'Tricky Tara', avatar: '🦊', rating: 1300, style: 'Sets traps and punishes careless moves.', hello: 'Watch your f7 square…' },
  { id: 'ari', name: 'Attacking Ari', avatar: '🔥', rating: 1600, style: 'Strong tactician. Will punish loose pieces.', hello: 'Let\'s have a sharp game.' },
  { id: 'max', name: 'Master Max', avatar: '🎓', rating: 2000, style: 'Expert-level. Few mistakes, solid technique.', hello: 'Show me what you\'ve prepared.' },
  { id: 'grace', name: 'GM Grace', avatar: '👑', rating: 2500, style: 'Grandmaster strength. Good luck.', hello: 'Let\'s begin.' },
  { id: 'fish', name: 'Stockfish', avatar: '🐟', rating: 2800, style: 'Full-strength engine (in your browser).', hello: '…' },
];

/** Engine settings and human-like error rates for a rating. */
export function botConfig(rating) {
  const r = Math.max(100, Math.min(2800, rating));
  return {
    depth: Math.max(1, Math.min(18, Math.round(1 + (r - 200) / 150))),
    skill: Math.max(0, Math.min(20, Math.round((r - 600) / 100))),
    multipv: r >= 2400 ? 1 : 4,
    // chance of not playing the engine's top choice
    inaccuracy: Math.max(0.03, Math.min(0.75, (2300 - r) / 2400)),
    // chance of a completely random legal move (beginner blunders)
    randomMove: r < 500 ? 0.3 : r < 800 ? 0.14 : r < 1100 ? 0.05 : r < 1400 ? 0.015 : 0,
    // the worst move (in centipawns vs best) the bot is willing to choose when "slipping"
    maxLoss: r >= 2000 ? 60 : r >= 1600 ? 120 : r >= 1200 ? 250 : r >= 900 ? 450 : 2000,
    // how often a missed mate-in-1/free capture is spotted anyway
    thinkMs: [350, 1300],
  };
}

const rnd = (a, b) => a + Math.random() * (b - a);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Pick the bot's move for the position. Returns a UCI string. */
export async function botMove(fen, rating) {
  const cfg = botConfig(rating);
  const c = new Chess(fen);
  const legal = c.moves({ verbose: true });
  if (legal.length === 1) { await sleep(400); return toUci(legal[0]); }
  const started = Date.now();
  if (Math.random() < cfg.randomMove) {
    await sleep(rnd(...cfg.thinkMs));
    return toUci(legal[Math.floor(Math.random() * legal.length)]);
  }
  const res = await getEngine('bot').analyze(fen, { depth: cfg.depth, multipv: Math.min(cfg.multipv, legal.length), skill: cfg.skill });
  let move = res?.bestmove;
  const lines = (res?.lines || []).filter(l => l.pv?.length);
  if (lines.length > 1 && Math.random() < cfg.inaccuracy) {
    const turn = fen.split(' ')[1];
    const sc = l => (turn === 'w' ? 1 : -1) * evalCp(l.score);
    const best = sc(lines[0]);
    const ok = lines.slice(1).filter(l => best - sc(l) <= cfg.maxLoss);
    if (ok.length) move = ok[Math.floor(Math.random() * ok.length)].pv[0];
  }
  const wait = rnd(...cfg.thinkMs) - (Date.now() - started);
  if (wait > 0) await sleep(wait);
  return move || toUci(legal[0]);
}

/** Best move for a hint (full strength, quick). */
export async function hintMove(fen) {
  const res = await getEngine('bot').analyze(fen, { depth: 12, multipv: 1, skill: 20 });
  return res?.bestmove;
}

/** Engine evaluation (White's view) for draw offers / eval bar. */
export async function quickEval(fen) {
  const res = await getEngine('bot').analyze(fen, { depth: 10, multipv: 1, skill: 20 });
  return res?.lines?.[0]?.score || { cp: 0 };
}

const toUci = m => m.from + m.to + (m.promotion || '');

const LINES = {
  capture: ['Ouch.', 'I needed that piece!', 'Hmm, didn\'t see that.', 'Nice one.'],
  check: ['Check!', 'Watch your king.', 'Check — your move.'],
  win: ['Good game! Better luck next time.', 'Checkmate! That was fun.', 'GG!'],
  lose: ['Well played — you got me!', 'GG, you deserved that.', 'Wow, nicely done.'],
  draw: ['A draw — fair result.', 'Peace treaty signed. GG.'],
};
export const say = kind => LINES[kind][Math.floor(Math.random() * LINES[kind].length)];
