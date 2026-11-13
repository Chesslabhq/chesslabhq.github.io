// Chess YouTube creators: one-click searches for a creator's videos on a given opening.
import { esc } from './ui.js';

export const CHANNELS = [
  { name: 'GothamChess', icon: '♟', query: 'GothamChess', note: 'Fun, practical openings and traps' },
  { name: 'Chesspage1', icon: '📄', query: 'chesspage1', note: 'Opening traps and tricks' },
  { name: 'Hanging Pawns', icon: '📚', query: 'Hanging Pawns', note: 'Deep, structured repertoires' },
  { name: 'Daniel Naroditsky', icon: '🎓', query: 'Daniel Naroditsky', note: 'Speedruns that explain every move' },
  { name: 'Eric Rosen', icon: '🪤', query: 'Eric Rosen', note: 'Traps and offbeat weapons' },
  { name: 'Saint Louis Chess Club', icon: '🏛', query: 'Saint Louis Chess Club', note: 'GM lectures' },
  { name: 'Remote Chess Academy', icon: '🧠', query: 'Remote Chess Academy', note: 'Plans and ideas for club players' },
  { name: 'Chess Vibes', icon: '🎵', query: 'ChessVibes', note: 'Clear opening explainers' },
];

export const ytUrl = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

/** A card of creator buttons for one opening/topic. */
export function videosCard(topic, title = '🎬 Videos') {
  return `<div class="card" style="margin-top:16px" id="op-videos">
    <div class="spread"><h2>${title}</h2><a class="btn sm ghost" href="${ytUrl(topic + ' chess')}" target="_blank" rel="noopener">All YouTube results ↗</a></div>
    <p class="muted" style="margin-top:-6px">Watch top chess creators explain the ${esc(topic)}. Opens YouTube in a new tab.</p>
    <div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${CHANNELS.map(c => `
      <a class="theme-btn" href="${ytUrl(`${c.query} ${topic}`)}" target="_blank" rel="noopener" style="display:block">
        <div class="tn">${c.icon} ${esc(c.name)}</div><div class="ts">${esc(c.note)}</div></a>`).join('')}</div>
  </div>`;
}
