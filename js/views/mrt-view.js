/**
 * MRT Progress view — visualize study progress as MRT line map
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { MRT_LINES } from '../data/mrt-lines.js';
import { RecordStore } from '../models/record-store.js';
import { getUnlockedDishes } from '../data/hawker.js';
import { HAWKER_DISHES } from '../data/hawker.js';

registerRoute('#mrt', (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, 'MRT Progress Map'));

  const topicStats = RecordStore.getTopicStats();
  const masteredTopics = Object.values(topicStats).filter(s => s.mastered).map(s => s.topic);

  for (const line of MRT_LINES) {
    const lineEl = el('div', { className: 'mrt-line' });

    // Header
    const completedCount = line.stations.filter(s => masteredTopics.includes(s.topic)).length;
    const header = el('div', { className: 'mrt-line__header' });
    header.appendChild(el('div', { className: 'mrt-line__color', style: `background:${line.color};` }));
    header.appendChild(el('div', { className: 'mrt-line__name' }, line.name));
    header.appendChild(el('div', { className: 'mrt-line__progress' }, `${completedCount}/${line.stations.length}`));
    lineEl.appendChild(header);

    // Stations
    const stationsEl = el('div', { className: 'mrt-stations mrt-stations--vertical' });

    // Track line
    const track = el('div', { className: 'mrt-track' });
    const trackFill = el('div', { className: 'mrt-track__fill' });
    trackFill.style.background = line.color;
    trackFill.style.height = line.stations.length > 0 ? `${(completedCount / line.stations.length) * 100}%` : '0%';
    track.appendChild(trackFill);
    stationsEl.appendChild(track);

    for (const station of line.stations) {
      const key = `${line.id}::${station.topic}`;
      const stat = topicStats[key];
      const isMastered = stat && stat.mastered;
      const hasAttempts = stat && stat.attempts > 0;
      const accuracy = stat ? Math.round((stat.correct / stat.attempts) * 100) : 0;

      const stationClass = isMastered ? 'mrt-station mrt-station--completed'
        : hasAttempts ? 'mrt-station mrt-station--current'
        : 'mrt-station mrt-station--locked';

      const stationEl = el('div', { className: stationClass, style: `color:${line.color};` });
      stationEl.appendChild(el('div', { className: 'mrt-station__dot' }));
      stationEl.appendChild(el('span', { className: 'mrt-station__name' },
        `${station.code} ${station.topic}${isMastered ? ' \u2605' : ''}`));
      if (hasAttempts) {
        stationEl.appendChild(el('span', { className: 'mrt-station__accuracy' }, `${accuracy}%`));
      }
      stationsEl.appendChild(stationEl);
    }

    lineEl.appendChild(stationsEl);
    app.appendChild(lineEl);
  }

  // Hawker collection
  app.appendChild(el('h2', { className: 'mt-lg' }, 'Hawker Collection'));
  const unlockedIds = RecordStore.getHawkerCollection();
  const grid = el('div', { className: 'hawker-grid' });
  for (const dish of HAWKER_DISHES) {
    const unlocked = unlockedIds.includes(dish.id);
    const item = el('div', { className: `hawker-item${unlocked ? '' : ' hawker-item--locked'}` });
    item.appendChild(el('span', { className: 'hawker-item__icon' }, dish.icon));
    item.appendChild(el('span', {}, unlocked ? dish.name : '???'));
    grid.appendChild(item);
  }
  app.appendChild(grid);
});
