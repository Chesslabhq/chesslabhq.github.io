// Videos: verified YouTube videos play right inside ChessLab; creator searches remain as a fallback.
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
const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Thumbnail tiles; clicking one plays the video in the in-site player. */
export function videoTiles(list) {
  return `<div class="vid-grid">${list.map(v => `
    <button class="vid-tile" data-video="${esc(v.id)}" data-title="${esc(v.title)}" data-channel="${esc(v.channel)}">
      <span class="vid-thumb" style="background-image:url('${thumb(v.id)}')"><span class="vid-play">▶</span></span>
      <span class="vid-title">${esc(v.title)}</span>
      <span class="vid-channel">${esc(v.channel)}</span>
    </button>`).join('')}</div>`;
}

const creatorButtons = topic => `<div class="theme-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${CHANNELS.map(c => `
  <a class="theme-btn" href="${ytUrl(`${c.query} ${topic}`)}" target="_blank" rel="noopener" style="display:block">
    <div class="tn">${c.icon} ${esc(c.name)}</div><div class="ts">${esc(c.note)}</div></a>`).join('')}</div>`;

/** Videos card for an opening/topic: playable videos first, then creator searches on YouTube. */
export function videosCard(topic, title = '🎬 Videos', list = []) {
  return `<div class="card" style="margin-top:16px" id="op-videos">
    <div class="spread"><h2>${title}</h2><a class="btn sm ghost" href="${ytUrl(topic + ' chess')}" target="_blank" rel="noopener">More on YouTube ↗</a></div>
    ${list.length
      ? `<p class="muted" style="margin-top:-6px">Click a video to watch it right here.</p>${videoTiles(list)}
         <details class="vid-more"><summary>Find more from top creators</summary>${creatorButtons(topic)}</details>`
      : `<p class="muted" style="margin-top:-6px">No videos to play here yet for the ${esc(topic)} — these open each creator's videos on YouTube.</p>${creatorButtons(topic)}`}
  </div>`;
}

// ---------------------------------------------------------------- in-site player
function openPlayer(id, title, channel) {
  closePlayer();
  const back = document.createElement('div');
  back.className = 'vid-modal';
  back.innerHTML = `<div class="vid-box" role="dialog" aria-label="${esc(title)}">
      <div class="vid-frame"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1" title="${esc(title)}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <div class="spread" style="padding:12px 14px">
        <div style="min-width:0"><b class="vid-mtitle">${esc(title)}</b><div class="muted small">${esc(channel)}</div></div>
        <div class="row"><a class="btn sm" href="https://www.youtube.com/watch?v=${encodeURIComponent(id)}" target="_blank" rel="noopener">Open on YouTube ↗</a><button class="btn sm primary" data-vid-close>✕ Close</button></div>
      </div>
    </div>`;
  back.addEventListener('click', e => { if (e.target === back || e.target.closest('[data-vid-close]')) closePlayer(); });
  document.body.appendChild(back);
  document.body.style.overflow = 'hidden';
}
function closePlayer() {
  document.querySelector('.vid-modal')?.remove(); // removing the iframe stops playback
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  const t = e.target.closest?.('[data-video]');
  if (t) openPlayer(t.dataset.video, t.dataset.title, t.dataset.channel);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePlayer(); });
addEventListener('hashchange', closePlayer);
