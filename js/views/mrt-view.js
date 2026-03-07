/**
 * MRT Progress Map — SVG schematic of Singapore MRT
 * NS (Red) = BCP topics, EW (Green) = ComGI topics.
 * Stations unlock as topics are mastered.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { MRT_LINES } from '../data/mrt-lines.js';
import { RecordStore } from '../models/record-store.js';
import { HAWKER_DISHES } from '../data/hawker.js';
import { tr, trNode } from '../utils/i18n.js';

registerRoute('#mrt', (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('mrt.title', 'MRT Progress Map'));
  app.appendChild(h1);

  const topicStats = RecordStore.getTopicStats();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Legend
  const legend = el('div', { className: 'mrt-legend' });
  for (const line of MRT_LINES) {
    const item = el('div', { className: 'mrt-legend__item' });
    const color = isDark ? line.darkColor : line.color;
    item.appendChild(el('span', { className: 'mrt-legend__dot', style: `background:${color};` }));
    const completed = line.stations.filter(s => s.topic && isUnlocked(line.module, s.topic, topicStats)).length;
    const total = line.stations.filter(s => s.topic).length;
    item.appendChild(el('span', {}, `${line.name} (${line.module.toUpperCase()}) — ${completed}/${total}`));
    legend.appendChild(item);
  }
  app.appendChild(legend);

  // SVG Map
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 480 280');
  svg.setAttribute('class', 'mrt-map');

  // Draw lines (paths connecting stations)
  for (const line of MRT_LINES) {
    const color = isDark ? line.darkColor : line.color;
    const points = line.stations.map(s => `${s.x},${s.y}`).join(' ');
    const polyline = document.createElementNS(svgNS, 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', '5');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    polyline.setAttribute('opacity', '0.25');
    polyline.setAttribute('class', 'mrt-map__line');
    svg.appendChild(polyline);

    // Colored overlay for unlocked segments
    const unlockedPoints = [];
    for (const s of line.stations) {
      const unlocked = !s.topic || isUnlocked(line.module, s.topic, topicStats);
      if (unlocked || s.interchange) {
        unlockedPoints.push(`${s.x},${s.y}`);
      } else {
        if (unlockedPoints.length > 1) {
          const overlay = document.createElementNS(svgNS, 'polyline');
          overlay.setAttribute('points', unlockedPoints.join(' '));
          overlay.setAttribute('fill', 'none');
          overlay.setAttribute('stroke', color);
          overlay.setAttribute('stroke-width', '5');
          overlay.setAttribute('stroke-linecap', 'round');
          overlay.setAttribute('stroke-linejoin', 'round');
          overlay.setAttribute('opacity', '0.8');
          svg.appendChild(overlay);
        }
        unlockedPoints.length = 0;
        unlockedPoints.push(`${s.x},${s.y}`);
      }
    }
    if (unlockedPoints.length > 1) {
      const overlay = document.createElementNS(svgNS, 'polyline');
      overlay.setAttribute('points', unlockedPoints.join(' '));
      overlay.setAttribute('fill', 'none');
      overlay.setAttribute('stroke', color);
      overlay.setAttribute('stroke-width', '5');
      overlay.setAttribute('stroke-linecap', 'round');
      overlay.setAttribute('stroke-linejoin', 'round');
      overlay.setAttribute('opacity', '0.8');
      svg.appendChild(overlay);
    }
  }

  // Draw stations
  for (const line of MRT_LINES) {
    const color = isDark ? line.darkColor : line.color;
    for (const s of line.stations) {
      // Skip duplicate City Hall (drawn once)
      if (s.name === 'City Hall' && line.id === 'ew') continue;

      const unlocked = !s.topic || isUnlocked(line.module, s.topic, topicStats);
      const hasAttempts = s.topic && hasBeenAttempted(line.module, s.topic, topicStats);
      const isInterchange = !!s.interchange;

      // Station dot
      const r = isInterchange ? 7 : 5;
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', s.x);
      circle.setAttribute('cy', s.y);
      circle.setAttribute('r', r);

      if (unlocked && s.topic) {
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
      } else if (hasAttempts) {
        circle.setAttribute('fill', isDark ? '#252540' : '#fff');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2.5');
      } else {
        circle.setAttribute('fill', isDark ? '#252540' : '#eee');
        circle.setAttribute('stroke', isDark ? '#404068' : '#ccc');
        circle.setAttribute('stroke-width', '2');
      }

      if (isInterchange && !s.topic) {
        // Interchange-only station (City Hall)
        circle.setAttribute('fill', isDark ? '#252540' : '#fff');
        circle.setAttribute('stroke', isDark ? '#888' : '#666');
        circle.setAttribute('stroke-width', '2.5');
      }

      svg.appendChild(circle);

      // Station name label (#19: offset EW labels near City Hall to prevent overlap)
      const text = document.createElementNS(svgNS, 'text');
      const labelLeft = s.x < 100;
      const labelRight = s.x > 380;
      const isEwNearCH = line.id === 'ew' && s.x >= 140 && s.x <= 310 && s.name !== 'City Hall';
      const lx = s.x + (labelLeft ? -10 : labelRight ? -10 : 10);
      const ly = s.y + (isEwNearCH ? 20 : 4);
      text.setAttribute('x', lx);
      text.setAttribute('y', ly);
      text.setAttribute('text-anchor', labelLeft ? 'end' : labelRight ? 'end' : 'start');
      text.setAttribute('class', 'mrt-map__label');

      if (unlocked || !s.topic) {
        text.textContent = s.name;
        text.setAttribute('fill', isDark ? '#ccc' : '#333');
        text.setAttribute('font-weight', unlocked && s.topic ? '600' : '400');
      } else {
        text.textContent = s.code;
        text.setAttribute('fill', isDark ? '#555' : '#bbb');
        text.setAttribute('font-weight', '400');
      }

      svg.appendChild(text);

      // Topic label (small, below station name) for unlocked stations
      if (unlocked && s.topic) {
        const topicText = document.createElementNS(svgNS, 'text');
        topicText.setAttribute('x', lx);
        topicText.setAttribute('y', ly + 10);
        topicText.setAttribute('text-anchor', labelLeft ? 'end' : labelRight ? 'end' : 'start');
        topicText.setAttribute('class', 'mrt-map__topic');
        topicText.setAttribute('fill', color);
        topicText.textContent = s.topic;
        svg.appendChild(topicText);

        // Accuracy badge
        const key = `${line.module}::${s.topic}`;
        const stat = topicStats[key];
        if (stat && stat.attempts > 0) {
          const acc = Math.round((stat.correct / stat.attempts) * 100);
          const accText = document.createElementNS(svgNS, 'text');
          accText.setAttribute('x', lx);
          accText.setAttribute('y', ly + 20);
          accText.setAttribute('text-anchor', labelLeft ? 'end' : labelRight ? 'end' : 'start');
          accText.setAttribute('class', 'mrt-map__accuracy');
          accText.setAttribute('fill', acc >= 80 ? (isDark ? '#50e088' : '#28a745') : (isDark ? '#ffc840' : '#f5a623'));
          accText.textContent = `${acc}%`;
          svg.appendChild(accText);
        }
      }
    }
  }

  // Interchange label for City Hall
  const chLabel = document.createElementNS(svgNS, 'text');
  chLabel.setAttribute('x', 254);
  chLabel.setAttribute('y', 152);
  chLabel.setAttribute('text-anchor', 'start');
  chLabel.setAttribute('class', 'mrt-map__interchange-label');
  chLabel.setAttribute('fill', isDark ? '#888' : '#666');
  chLabel.textContent = 'City Hall';
  svg.appendChild(chLabel);

  const mapContainer = el('div', { className: 'mrt-map-container mt-md' });
  mapContainer.appendChild(svg);
  app.appendChild(mapContainer);

  // Stats summary
  const totalTopics = MRT_LINES.reduce((sum, l) => sum + l.stations.filter(s => s.topic).length, 0);
  const totalUnlocked = MRT_LINES.reduce((sum, l) =>
    sum + l.stations.filter(s => s.topic && isUnlocked(l.module, s.topic, topicStats)).length, 0);
  const summaryEl = el('div', { className: 'text-center text-secondary mt-md text-sm' });
  summaryEl.textContent = `${totalUnlocked} of ${totalTopics} stations unlocked \u2014 Master topics (5 correct streak) to unlock!`;
  app.appendChild(summaryEl);

  // Hawker collection (#22: unlock animation for newly collected dishes)
  app.appendChild(el('h2', { className: 'mt-lg' }, 'Hawker Collection'));
  const unlockedIds = RecordStore.getHawkerCollection();
  const seenIds = JSON.parse(sessionStorage.getItem('sg_broker_hawker_seen') || '[]');
  const grid = el('div', { className: 'hawker-grid' });
  for (const dish of HAWKER_DISHES) {
    const unlocked = unlockedIds.includes(dish.id);
    const isNew = unlocked && !seenIds.includes(dish.id);
    const cls = unlocked
      ? `hawker-item${isNew ? ' hawker-item--just-unlocked' : ''}`
      : 'hawker-item hawker-item--locked';
    const item = el('div', { className: cls });
    item.appendChild(el('span', { className: 'hawker-item__icon' }, dish.icon));
    const nameEl = el('div', { style: 'flex:1;' });
    nameEl.appendChild(el('div', {}, unlocked ? dish.name : '???'));
    if (unlocked && dish.desc) {
      nameEl.appendChild(el('div', { className: 'text-sm text-secondary', style: 'font-size:0.7rem;line-height:1.3;' }, dish.desc));
    }
    item.appendChild(nameEl);
    grid.appendChild(item);
  }
  app.appendChild(grid);
  // Mark all as seen
  sessionStorage.setItem('sg_broker_hawker_seen', JSON.stringify(unlockedIds));
});

function isUnlocked(module, topic, topicStats) {
  const key = `${module}::${topic}`;
  const stat = topicStats[key];
  return stat && stat.mastered;
}

function hasBeenAttempted(module, topic, topicStats) {
  const key = `${module}::${topic}`;
  const stat = topicStats[key];
  return stat && stat.attempts > 0;
}
