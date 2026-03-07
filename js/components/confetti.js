/**
 * Confetti celebration — shows for perfect scores (#6)
 */
const COLORS = ['#e4002b', '#009cde', '#28a745', '#f5a623', '#9e28b4', '#ffc107'];
const PIECE_COUNT = 60;
const DURATION = 2500;

export function showConfetti() {
  const overlay = document.createElement('div');
  overlay.className = 'confetti-overlay';

  for (let i = 0; i < PIECE_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.width = `${6 + Math.random() * 6}px`;
    piece.style.height = `${8 + Math.random() * 8}px`;
    overlay.appendChild(piece);
  }

  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, DURATION);
}
