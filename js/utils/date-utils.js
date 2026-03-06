/**
 * Date utilities
 */
export function isoNow() {
  return new Date().toISOString();
}

export function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' });
}
