/**
 * MRT Progress Map — all real NS/EW stations, sequential unlock from City Hall.
 * Unlock count = uniqueCorrectAnswers / totalQuestions * totalStations.
 * Stations expand outward from City Hall, alternating directions.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { MRT_LINES, CIRCLE_LINE, DECO_LINES } from '../data/mrt-lines.js';
import { RecordStore } from '../models/record-store.js';
import { HAWKER_DISHES } from '../data/hawker.js';
import { tr, trNode } from '../utils/i18n.js';
import { loadQuestions } from '../data/questions.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// --- Layout constants ---
const VIEW_W = 520;
const VIEW_H = 500;
const NS_X = 200;                       // NS line x-coordinate
const EW_Y = 310;                       // EW line y-coordinate (City Hall vertical center-ish)
const CITY_HALL = { x: NS_X, y: EW_Y }; // intersection point

// Compute station positions along each line
function computePositions(line) {
  const stations = line.stations;
  const n = stations.length;

  if (line.id === 'ns') {
    // Vertical line: NS1 at top, NS28 at bottom
    const margin = 20;
    const spacing = (VIEW_H - 2 * margin) / (n - 1);
    return stations.map((s, i) => ({
      ...s,
      x: NS_X,
      y: margin + i * spacing,
    }));
  } else {
    // Horizontal line: EW1 (east) at right, EW33 (west) at left
    // EW_STATIONS is ordered EW1→EW33 (east→west), but on map east=right.
    // So EW1 should be at the right side, EW33 at the left.
    const margin = 14;
    const spacing = (VIEW_W - 2 * margin) / (n - 1);
    return stations.map((s, i) => ({
      ...s,
      x: VIEW_W - margin - i * spacing, // EW1 at right, EW33 at left
      y: EW_Y,
    }));
  }
}

registerRoute('#mrt', async (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('mrt.title', 'MRT Progress Map'));
  app.appendChild(h1);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Load question counts per module
  const questionCounts = {};
  for (const line of MRT_LINES) {
    const questions = await loadQuestions(line.module);
    questionCounts[line.module] = questions.length;
  }

  // Compute positions for each line
  const lineLayouts = MRT_LINES.map(line => ({
    ...line,
    positioned: computePositions(line),
  }));

  // Compute unlock sets per line
  const unlockSets = {};
  for (const line of MRT_LINES) {
    const totalQ = questionCounts[line.module] || 1;
    const totalS = line.stations.length;
    const uniqueCorrect = RecordStore.getUniqueCorrectCount(line.module);
    // City Hall is always unlocked (+1), rest scales with progress
    const stationsToUnlock = Math.min(totalS, 1 + Math.floor(uniqueCorrect / totalQ * (totalS - 1)));
    // Build set of unlocked station indices
    const set = new Set();
    for (let i = 0; i < stationsToUnlock; i++) {
      set.add(line.unlockOrder[i]);
    }
    unlockSets[line.id] = set;
  }

  // Legend
  const legend = el('div', { className: 'mrt-legend' });
  for (const ll of lineLayouts) {
    const color = isDark ? ll.darkColor : ll.color;
    const unlocked = unlockSets[ll.id].size;
    const total = ll.stations.length;
    legend.appendChild(legendItem(color, `${ll.name} (${ll.module.toUpperCase()}) ${unlocked}/${total}`));
  }
  const ccColor = isDark ? CIRCLE_LINE.darkColor : CIRCLE_LINE.color;
  legend.appendChild(legendItem(ccColor, CIRCLE_LINE.name));
  for (const dl of DECO_LINES) {
    legend.appendChild(legendItem(isDark ? dl.darkColor : dl.color, dl.name));
  }
  app.appendChild(legend);

  // SVG Map
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
  svg.setAttribute('class', 'mrt-map');

  // Layer 1: Decorative background lines
  drawDecoLines(svg, lineLayouts, isDark);

  // Layer 2: Circle Line
  drawCircleLine(svg, lineLayouts, isDark, unlockSets);

  // Layer 3: Functional lines (NS, EW) with bright overlay for unlocked segments
  for (const ll of lineLayouts) {
    drawFunctionalLine(svg, ll, isDark, unlockSets[ll.id]);
  }

  // Layer 4: Station dots & labels
  for (const ll of lineLayouts) {
    drawStations(svg, ll, isDark, unlockSets[ll.id]);
  }

  // City Hall interchange label
  const chPos = getCityHallPos(lineLayouts);
  svg.appendChild(svgText(chPos.x + 10, chPos.y - 8, 'City Hall', {
    anchor: 'start',
    cls: 'mrt-map__interchange-label',
    fill: isDark ? '#aaa' : '#555',
  }));

  const mapContainer = el('div', { className: 'mrt-map-container mt-md' });
  mapContainer.appendChild(svg);
  app.appendChild(mapContainer);

  // Stats summary
  const totalStations = MRT_LINES.reduce((sum, l) => sum + l.stations.length, 0);
  const totalUnlocked = MRT_LINES.reduce((sum, l) => sum + unlockSets[l.id].size, 0);
  const summaryEl = el('div', { className: 'text-center text-secondary mt-md text-sm' });
  summaryEl.textContent = `${totalUnlocked} of ${totalStations} stations unlocked \u2014 Answer questions correctly to expand the line!`;
  app.appendChild(summaryEl);

  // Per-line progress detail
  for (const line of MRT_LINES) {
    const totalQ = questionCounts[line.module] || 0;
    const uniqueCorrect = RecordStore.getUniqueCorrectCount(line.module);
    const detail = el('div', { className: 'text-center text-secondary text-sm' });
    detail.textContent = `${line.name}: ${uniqueCorrect}/${totalQ} unique questions correct`;
    app.appendChild(detail);
  }

  // Hawker collection
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
  sessionStorage.setItem('sg_broker_hawker_seen', JSON.stringify(unlockedIds));
});

// ─── Drawing helpers ──────────────────────────────────────────────

function legendItem(color, text) {
  const item = el('div', { className: 'mrt-legend__item' });
  item.appendChild(el('span', { className: 'mrt-legend__dot', style: `background:${color};` }));
  item.appendChild(el('span', {}, text));
  return item;
}

function getCityHallPos(lineLayouts) {
  const nsLayout = lineLayouts.find(l => l.id === 'ns');
  const nsIdx = nsLayout.cityHallIndex;
  return { x: nsLayout.positioned[nsIdx].x, y: nsLayout.positioned[nsIdx].y };
}

/** Find positioned station by code across all line layouts */
function findStation(lineLayouts, code) {
  for (const ll of lineLayouts) {
    const s = ll.positioned.find(s => s.code === code);
    if (s) return s;
  }
  return null;
}

function drawPolyline(svg, points, color, width, opacity) {
  const poly = document.createElementNS(SVG_NS, 'polyline');
  poly.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', color);
  poly.setAttribute('stroke-width', width);
  poly.setAttribute('stroke-linecap', 'round');
  poly.setAttribute('stroke-linejoin', 'round');
  poly.setAttribute('opacity', opacity);
  svg.appendChild(poly);
}

// --- Decorative lines: approximate paths based on real interchange positions ---
function drawDecoLines(svg, lineLayouts, isDark) {
  const bishan = findStation(lineLayouts, 'NS17');
  const newton = findStation(lineLayouts, 'NS21');
  const dhobyGhaut = findStation(lineLayouts, 'NS24');
  const outramPark = findStation(lineLayouts, 'EW16');
  const bugis = findStation(lineLayouts, 'EW12');
  const payaLebar = findStation(lineLayouts, 'EW8');
  const buonaVista = findStation(lineLayouts, 'EW21');
  const marinaBay = findStation(lineLayouts, 'NS27');

  // NE Line (Purple): Punggol → HarbourFront (diagonal)
  const neColor = isDark ? '#b850d8' : '#9016b2';
  if (dhobyGhaut && outramPark) {
    const nePath = [
      { x: VIEW_W - 30, y: 20 },  // Punggol (top-right)
      { x: bishan ? bishan.x + 80 : 320, y: bishan ? bishan.y + 20 : 100 },
      { x: dhobyGhaut.x + 40, y: dhobyGhaut.y - 20 },
      { x: dhobyGhaut.x, y: dhobyGhaut.y },
      { x: outramPark.x + 10, y: outramPark.y - 10 },
      { x: outramPark.x, y: outramPark.y },
      { x: outramPark.x - 20, y: outramPark.y + 50 },
      { x: outramPark.x - 20, y: EW_Y + 80 }, // HarbourFront
    ];
    drawPolyline(svg, nePath, neColor, 3, 0.12);
  }

  // DT Line (Blue): Bukit Panjang → Expo (diagonal)
  const dtColor = isDark ? '#4090f0' : '#005ec4';
  if (newton && bugis) {
    const dtPath = [
      { x: 30, y: 20 },           // Bukit Panjang (top-left)
      { x: buonaVista ? buonaVista.x : 80, y: newton.y - 30 },
      { x: newton.x - 20, y: newton.y - 10 },
      { x: newton.x, y: newton.y },
      { x: bugis.x - 10, y: bugis.y - 50 },
      { x: bugis.x, y: bugis.y },
      { x: payaLebar ? payaLebar.x : 350, y: payaLebar ? payaLebar.y - 30 : 280 },
      { x: marinaBay ? marinaBay.x + 60 : 290, y: marinaBay ? marinaBay.y + 10 : VIEW_H - 40 },
      { x: VIEW_W - 40, y: VIEW_H - 20 }, // Expo
    ];
    drawPolyline(svg, dtPath, dtColor, 3, 0.12);
  }
}

// --- Circle Line: geometric loop through interchange stations ---
function drawCircleLine(svg, lineLayouts, isDark, unlockSets) {
  const color = isDark ? CIRCLE_LINE.darkColor : CIRCLE_LINE.color;

  // Build CC path through interchange positions + extra points for the loop
  const bishan = findStation(lineLayouts, 'NS17');
  const buonaVista = findStation(lineLayouts, 'EW21');
  const payaLebar = findStation(lineLayouts, 'EW8');
  const marinaBay = findStation(lineLayouts, 'NS27');
  const dhobyGhaut = findStation(lineLayouts, 'NS24');

  if (!bishan || !buonaVista || !payaLebar || !marinaBay || !dhobyGhaut) return;

  const ccPath = [
    { x: dhobyGhaut.x, y: dhobyGhaut.y },
    { x: dhobyGhaut.x + 50, y: dhobyGhaut.y },
    { x: payaLebar.x, y: payaLebar.y - 40 },
    { x: payaLebar.x, y: payaLebar.y },
    { x: payaLebar.x + 30, y: payaLebar.y - 50 },
    { x: payaLebar.x + 30, y: bishan.y + 20 },
    { x: bishan.x + 40, y: bishan.y },
    { x: bishan.x, y: bishan.y },
    { x: bishan.x - 40, y: bishan.y + 15 },
    { x: buonaVista.x - 10, y: dhobyGhaut.y - 20 },
    { x: buonaVista.x - 10, y: buonaVista.y },
    { x: buonaVista.x, y: buonaVista.y },
    { x: buonaVista.x - 10, y: buonaVista.y + 40 },
    { x: marinaBay.x - 40, y: marinaBay.y + 15 },
    { x: marinaBay.x, y: marinaBay.y },
    { x: marinaBay.x - 25, y: dhobyGhaut.y + 30 },
    { x: dhobyGhaut.x - 20, y: dhobyGhaut.y + 15 },
  ];

  // Draw faint loop
  const allPoints = ccPath.map(p => `${p.x},${p.y}`);
  allPoints.push(`${ccPath[0].x},${ccPath[0].y}`); // close loop
  const poly = document.createElementNS(SVG_NS, 'polyline');
  poly.setAttribute('points', allPoints.join(' '));
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', color);
  poly.setAttribute('stroke-width', '3');
  poly.setAttribute('stroke-linecap', 'round');
  poly.setAttribute('stroke-linejoin', 'round');
  poly.setAttribute('opacity', '0.15');
  svg.appendChild(poly);

  // Draw interchange rings on CC interchange stations
  for (const code of CIRCLE_LINE.interchanges) {
    const station = findStation(lineLayouts, code);
    if (!station) continue;

    // Check if this station is unlocked on its parent line
    const parentLine = lineLayouts.find(ll =>
      ll.positioned.some(s => s.code === code)
    );
    const idx = parentLine.stations.findIndex(s => s.code === code);
    const unlocked = unlockSets[parentLine.id].has(idx);

    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', station.x);
    ring.setAttribute('cy', station.y);
    ring.setAttribute('r', '6');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', color);
    ring.setAttribute('stroke-width', unlocked ? '2' : '1.2');
    ring.setAttribute('opacity', unlocked ? '0.85' : '0.2');
    ring.setAttribute('class', 'mrt-map__cc-ring');
    svg.appendChild(ring);
  }
}

// --- Functional line with bright overlay for unlocked segments ---
function drawFunctionalLine(svg, ll, isDark, unlockSet) {
  const color = isDark ? ll.darkColor : ll.color;
  const pts = ll.positioned;

  // Faint full line
  drawPolyline(svg, pts, color, 4, 0.2);

  // Bright overlay: find contiguous unlocked ranges
  // Since unlock is from City Hall outward, unlocked stations form a contiguous block
  // around City Hall. Collect them in index order.
  const unlockedIndices = [...unlockSet].sort((a, b) => a - b);
  if (unlockedIndices.length > 1) {
    const brightPts = unlockedIndices.map(i => pts[i]);
    drawPolyline(svg, brightPts, color, 4, 0.8);
  }
}

// --- Station dots & labels ---
function drawStations(svg, ll, isDark, unlockSet) {
  const color = isDark ? ll.darkColor : ll.color;
  const isNS = ll.id === 'ns';
  const pts = ll.positioned;
  const totalStations = pts.length;

  pts.forEach((s, idx) => {
    const unlocked = unlockSet.has(idx);
    const isCityHall = s.name === 'City Hall';
    const isInterchange = !!s.interchange;

    // Station dot
    const r = isCityHall ? 4.5 : isInterchange ? 3.5 : 2.5;
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', s.x);
    circle.setAttribute('cy', s.y);
    circle.setAttribute('r', r);

    if (isCityHall) {
      // City Hall always prominent
      circle.setAttribute('fill', isDark ? '#fff' : '#333');
      circle.setAttribute('stroke', isDark ? '#888' : '#666');
      circle.setAttribute('stroke-width', '1.5');
    } else if (unlocked) {
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', isDark ? '#1a1a2e' : '#fff');
      circle.setAttribute('stroke-width', '1');
    } else {
      circle.setAttribute('fill', isDark ? '#252540' : '#e8e8e8');
      circle.setAttribute('stroke', isDark ? '#353560' : '#ccc');
      circle.setAttribute('stroke-width', '0.8');
    }

    svg.appendChild(circle);

    // Skip City Hall labels for EW (drawn once from NS)
    if (isCityHall && !isNS) return;

    // Label: show name for unlocked + key stations; show code for locked
    const showLabel = unlocked || isCityHall || isInterchange;

    let lx, ly, anchor;
    if (isNS) {
      lx = s.x + 8;
      ly = s.y + 2.5;
      anchor = 'start';
    } else {
      // EW: alternate label position above/below to reduce overlap
      const stagger = idx % 2 === 0 ? -8 : 10;
      lx = s.x;
      ly = s.y + stagger;
      anchor = 'middle';
    }

    if (showLabel) {
      svg.appendChild(svgText(lx, ly, s.name, {
        anchor,
        cls: 'mrt-map__label',
        fill: unlocked ? (isDark ? '#ccc' : '#333') : (isDark ? '#666' : '#aaa'),
        weight: unlocked ? '600' : '400',
      }));
    } else {
      // Locked non-interchange: show station code only
      svg.appendChild(svgText(lx, ly, s.code, {
        anchor,
        cls: 'mrt-map__label',
        fill: isDark ? '#444' : '#ccc',
      }));
    }
  });
}

function svgText(x, y, content, opts = {}) {
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('text-anchor', opts.anchor || 'start');
  if (opts.cls) text.setAttribute('class', opts.cls);
  if (opts.fill) text.setAttribute('fill', opts.fill);
  if (opts.weight) text.setAttribute('font-weight', opts.weight);
  text.textContent = content;
  return text;
}
