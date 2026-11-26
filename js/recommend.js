// Suggest a repertoire (White, Black vs 1.e4, Black vs 1.d4) from how you actually play.
import { myGames, userResult, openingName } from './store.js';
import { coachReport, mistakeStats, analyzedMine } from './stats.js';
import { openingFamily } from './importers.js';
import { CATALOG } from './data/catalog.js';

// Which of your games count as playing each catalog opening (matched on the Lichess opening name).
const MATCH = {
  london: n => /London System/.test(n) && !/Jobava/.test(n),
  jobava: n => /Jobava/.test(n),
  vienna: n => /Vienna/.test(n),
  italian: n => /Italian Game|Giuoco|Two Knights/.test(n) && !/Fried Liver/.test(n),
  friedliver: n => /Fried Liver/.test(n),
  scotch: n => /Scotch/.test(n),
  ruy: n => /Ruy Lopez/.test(n),
  qg: n => /Queen's Gambit/.test(n),
  danish: n => /Danish/.test(n),
  english: n => /English Opening/.test(n),
  kia: n => /King'?s Indian Attack/i.test(n),
  carokann: n => /Caro-Kann/.test(n),
  najdorf: n => /Sicilian/.test(n),
  french: n => /French/.test(n),
  scandi: n => /Scandinavian/.test(n),
  e5: n => /Italian|Giuoco|Two Knights|Ruy Lopez|Scotch|Four Knights|Three Knights|Petrov|Philidor|King's Pawn Game|Vienna|King's Gambit|Bishop's Opening|Ponziani|Center Game/.test(n) && !/Stafford/.test(n),
  stafford: n => /Stafford/.test(n),
  qgd: n => /Queen's Gambit Declined|London System|Queen's Pawn Game|Colle/.test(n),
  kid: n => /King's Indian/.test(n) && !/King'?s Indian Attack/i.test(n),
  slav: n => /Slav/.test(n),
  nimzo: n => /Nimzo-Indian/.test(n),
  englund: n => /Englund/.test(n),
};

const firstMoves = g => {
  const body = g.pgn.replace(/\[[^\]]*\]/g, ' ').replace(/\{[^}]*\}/g, ' ');
  const m = body.match(/(?:^|\s)1\.\s*([^\s.]+)\s+(?:1\.\.\.\s*)?([^\s.]+)?/);
  return m ? [m[1], m[2] || null] : [null, null];
};
const scoreOf = list => list.length ? Math.round(list.reduce((s, g) => s + ({ win: 1, draw: .5 }[userResult(g)] || 0), 0) / list.length * 100) : null;

/** Everything we know about your opening habits. */
export function openingProfile() {
  const games = myGames();
  const white = games.filter(g => g.userColor === 'w');
  const black = games.filter(g => g.userColor === 'b');
  const count = (arr, key) => arr.reduce((m, x) => { const k = key(x); if (k) m[k] = (m[k] || 0) + 1; return m; }, {});
  const whiteFirst = count(white, g => firstMoves(g)[0]);
  const oppFirst = count(black, g => firstMoves(g)[0]);
  const topFirst = Object.entries(whiteFirst).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // your record with each catalog opening
  const mine = {};
  for (const o of CATALOG) {
    const pool = (o.side === 'w' ? white : black).filter(g => {
      const n = openingName(g) || '';
      if (o.side === 'b' && o.vs && firstMoves(g)[0] !== o.vs) return false;
      return MATCH[o.id]?.(n);
    });
    mine[o.id] = { games: pool.length, score: scoreOf(pool) };
  }

  const rep = coachReport();
  const ms = analyzedMine().length ? mistakeStats(analyzedMine().slice(0, 30)) : null;
  const tc = count(games, g => g.timeClass);
  const fast = ((tc.bullet || 0) + (tc.blitz || 0)) / (games.length || 1) >= 0.6;
  const ratings = games.slice(0, 40).map(g => g.userColor === 'w' ? g.whiteElo : g.blackElo).filter(Boolean).sort((a, b) => a - b);
  const rating = ratings.length ? ratings[Math.floor(ratings.length / 2)] : null;

  // opponents' choices against you
  const vsYouAsWhite = count(white, g => openingFamily(openingName(g)));
  const vsYouAsBlack = count(black, g => openingFamily(openingName(g)));

  return {
    games: games.length, rating, white: white.length, black: black.length, whiteFirst, oppFirst, topFirst, mine, fast,
    tactics: rep?.scores.tactics ?? null, openingsScore: rep?.scores.openings ?? null,
    blundersPerGame: ms ? ms.perGame.blunders : null, analysed: analyzedMine().length,
    vsYouAsWhite, vsYouAsBlack, whiteScore: scoreOf(white), blackScore: scoreOf(black),
  };
}

function judge(o, P) {
  let s = 10 - o.pop * 0.12;
  const why = [];
  const sharp = P.tactics != null ? P.tactics >= 65 : null;
  const lowRated = P.rating != null && P.rating < 1500;
  const keepSimple = P.openingsScore != null ? P.openingsScore < 55 : lowRated;
  const simpleWhy = P.openingsScore != null ? `your openings score is ${P.openingsScore}/100` : `at ~${P.rating} rating, ideas matter more than memorised moves`;
  const my = P.mine[o.id];

  if (o.side === 'w' && P.topFirst) {
    if (o.first === P.topFirst) { s += 4; why.push(`Starts with 1.${o.first} like you already do — no new first move to learn.`); }
    else s -= 1.5;
  }
  if (sharp === true && o.style === 'aggressive') { s += 3; why.push(`Aggressive — suits your tactics score of ${P.tactics}/100.`); }
  if (sharp === false && o.style === 'solid') { s += 3; why.push(`Solid and simple — fewer chances to blunder${P.blundersPerGame != null ? ` (you average ${P.blundersPerGame.toFixed(1)} blunders a game)` : ''}.`); }
  if (keepSimple) {
    s += (3 - o.theory) * 1.5;
    if (o.theory === 1) why.push(`Very little theory — ${simpleWhy}.`);
    if (o.theory === 3) { s -= 1.5; why.push('Heavy theory — only if you\'re ready to study.'); }
  } else if (o.theory === 1) why.push('Very little theory to memorise.');
  if (o.style === 'tricky') {
    if (P.fast) { s += 1; why.push('Trappy — great in blitz and bullet, which is most of what you play.'); }
    else s -= 2;
    why.push('Objectively risky — a surprise weapon, not a main repertoire.');
    s -= 1.5;
  }
  if (my.games >= 4) {
    if (my.score >= 55) { s += 4; why.unshift(`You already score ${my.score}% in ${my.games} games with it — keep it.`); }
    else if (my.score <= 40) { s -= 5; why.unshift(`You only score ${my.score}% in ${my.games} games with it.`); }
    else why.unshift(`You've played it ${my.games} times (${my.score}%).`);
  }
  if (o.pop <= 5) why.push('One of the most popular openings in chess — tons of material to learn from.');
  if (o.gotham) why.push('A GothamChess favourite.');
  if (why.length < 2) why.push(o.style === 'aggressive' ? 'Leads to sharp, attacking positions.' : o.style === 'solid' ? 'Sound structure with clear, easy-to-follow plans.' : 'Sets practical traps for unprepared opponents.');
  return { o, s, why, my };
}

/** Top suggestions per bucket, plus what you play now. */
export function recommend() {
  const P = openingProfile();
  const bucket = (filter, current) => {
    const ranked = CATALOG.filter(filter).map(o => judge(o, P)).sort((a, b) => b.s - a.s);
    const now = ranked.filter(r => r.my.games > 0).sort((a, b) => b.my.games - a.my.games)[0] || null;
    return { picks: ranked.slice(0, 3), now, current };
  };
  const eCount = P.oppFirst.e4 || 0, dCount = P.oppFirst.d4 || 0;
  return {
    P,
    white: bucket(o => o.side === 'w'),
    vsE4: bucket(o => o.side === 'b' && o.vs === 'e4', eCount),
    vsD4: bucket(o => o.side === 'b' && o.vs === 'd4', dCount),
  };
}
