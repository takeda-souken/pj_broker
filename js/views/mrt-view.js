/**
 * MRT Progress Map — full 6-line schematic with coordinate-based rendering.
 * NS (Red) = BCP, EW (Green) = ComGI — unlock from City Hall outward.
 * CC, CE, NE, DT, TE drawn as decorative/atmosphere lines.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { MRT_LINES, CIRCLE_LINE, DECO_LINES } from '../data/mrt-lines.js';
import {
  NS_COORDS, EW_COORDS, NE_COORDS, CC_COORDS, CE_COORDS, DT_COORDS, TE_COORDS,
  ALL_MRT_LINES,
} from '../data/mrt-coordinates.js';
import { RecordStore } from '../models/record-store.js';
import { HAWKER_DISHES } from '../data/hawker.js';
import { tr, trNode } from '../utils/i18n.js';
import { loadQuestions } from '../data/questions.js';
import { getStationInfo } from '../data/station-info.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 750;
const VIEW_H = 520;

// ─── Coordinate lookup helpers ───
const ALL_STATIONS = [NS_COORDS, EW_COORDS, NE_COORDS, CC_COORDS, CE_COORDS, DT_COORDS, TE_COORDS];

function findCoord(code) {
  for (const arr of ALL_STATIONS) {
    const s = arr.find(st => st.code === code);
    if (s) return s;
  }
  return null;
}

// ─── Interchange center sharing (same as preview) ───
function mergeInterchanges() {
  const groups = {};
  for (const arr of ALL_STATIONS) {
    for (const s of arr) {
      if (!groups[s.name]) groups[s.name] = [];
      groups[s.name].push(s);
    }
  }
  for (const name of Object.keys(groups)) {
    const g = groups[name];
    if (g.length < 2) continue;
    let maxDist = 0;
    for (let a = 0; a < g.length; a++) {
      for (let b = a + 1; b < g.length; b++) {
        const d = Math.hypot(g[a].x - g[b].x, g[a].y - g[b].y);
        if (d > maxDist) maxDist = d;
      }
    }
    if (maxDist > 50) continue;
    const cx = Math.round(g.reduce((s, st) => s + st.x, 0) / g.length);
    const cy = Math.round(g.reduce((s, st) => s + st.y, 0) / g.length);
    g.forEach(s => { s.x = cx; s.y = cy; });
  }
}

// ─── Parallel offset at shared stations ───
function applyParallelOffsets() {
  const hw = 3;

  // Newton: NS21/DT11
  const ns21 = findCoord('NS21'), dt11 = findCoord('DT11');
  if (ns21 && dt11) {
    const ns20 = findCoord('NS20'), ns22 = findCoord('NS22');
    const nsDx = ns22.x - ns20.x, nsDy = ns22.y - ns20.y;
    const nsLen = Math.hypot(nsDx, nsDy);
    ns21.x = Math.round(ns21.x + (-nsDy / nsLen) * hw);
    ns21.y = Math.round(ns21.y + (nsDx / nsLen) * hw);

    const dt10 = findCoord('DT10'), dt12 = findCoord('DT12');
    const dtDx = dt12.x - dt10.x, dtDy = dt12.y - dt10.y;
    const dtLen = Math.hypot(dtDx, dtDy);
    dt11.x = Math.round(dt11.x - (-dtDy / dtLen) * hw);
    dt11.y = Math.round(dt11.y - (dtDx / dtLen) * hw);
  }

  // City Hall (NS25/EW13) and Raffles Place (NS26/EW14)
  function offsetPair(nsCode, ewCode, nsPrev, nsNext, ewPrev, ewNext) {
    const nsS = findCoord(nsCode), ewS = findCoord(ewCode);
    if (!nsS || !ewS) return;
    const np = findCoord(nsPrev), nn = findCoord(nsNext);
    const ndx = nn.x - np.x, ndy = nn.y - np.y, nl = Math.hypot(ndx, ndy);
    nsS.x = Math.round(nsS.x + (-ndy / nl) * hw);
    nsS.y = Math.round(nsS.y + (ndx / nl) * hw);
    const ep = findCoord(ewPrev), en = findCoord(ewNext);
    const edx = en.x - ep.x, edy = en.y - ep.y, eln = Math.hypot(edx, edy);
    ewS.x = Math.round(ewS.x - (-edy / eln) * hw);
    ewS.y = Math.round(ewS.y - (edx / eln) * hw);
  }
  offsetPair('NS25', 'EW13', 'NS24', 'NS26', 'EW12', 'EW14');
  offsetPair('NS26', 'EW14', 'NS25', 'NS27', 'EW13', 'EW15');
}

// ─── Post-merge coordinate fixups ───
function applyFixups() {
  const fixes = [
    ['NS17', { x: 365 }], ['CC15', { x: 365 }],
    ['NE7', { x: 392 }], ['DT12', { x: 392 }],
    ['TE14', { x: 292 }],
    ['NS25', { x: 417, y: 413 }], ['EW13', { x: 423, y: 413 }],
    ['NS26', { x: 417, y: 444 }], ['EW14', { x: 423, y: 444 }],
  ];
  for (const [code, vals] of fixes) {
    const s = findCoord(code);
    if (!s) continue;
    if (vals.x !== undefined) s.x = vals.x;
    if (vals.y !== undefined) s.y = vals.y;
  }
  // NS22/NS23 align vertically with NS21
  const ns21 = findCoord('NS21'), ns22 = findCoord('NS22'), ns23 = findCoord('NS23');
  if (ns21 && ns22) ns22.x = ns21.x;
  if (ns21 && ns23) ns23.x = ns21.x;
}

// Run once at module load
mergeInterchanges();
applyParallelOffsets();
applyFixups();

// ─── Path builders (from preview) ───

const SMOOTH_PAIRS = {
  'NS7→NS8':1,'NS8→NS9':1,
  'NS12→NS13':1,'NS13→NS14':1,'NS14→NS15':1,
  'TE1→TE2':1,'TE2→TE3':1,'TE3→TE4':1,'TE4→TE5':1,
  'TE5→TE6':1,'TE6→TE7':1,'TE7→TE8':1,'TE8→TE9':1,
  'NE1→NE3':1,'NE3→NE4':1,'NE4→NE5':1,'NE5→NE6':1,
  'NE9→NE10':1,'NE10→NE11':1,'NE11→NE12':1,'NE12→NE13':1,
  'NE13→NE14':1,'NE14→NE15':1,'NE15→NE16':1,'NE16→NE17':1,
  'EW15→EW16':1,'EW16→EW17':1,'EW17→EW18':1,'EW18→EW19':1,
  'EW19→EW20':1,'EW20→EW21':1,
  'EW2→EW3':1,'EW3→EW4':1,'EW5→EW6':1,
  'EW6→EW7':1,'EW7→EW8':1,'EW8→EW9':1,'EW9→EW10':1,'EW10→EW11':1,
  'DT23→DT24':1,'DT24→DT25':1,'DT25→DT26':1,'DT26→DT27':1,
  'DT27→DT28':1,'DT28→DT29':1,'DT29→DT30':1,
};

function buildPath(stations) {
  if (stations.length < 2) return '';
  let d = `M ${stations[0].x} ${stations[0].y}`;
  const dx0 = Math.abs(stations[1].x - stations[0].x);
  const dy0 = Math.abs(stations[1].y - stations[0].y);
  let prevDir = dx0 > dy0 ? 'h' : 'v';

  for (let i = 1; i < stations.length; i++) {
    const px = stations[i - 1].x, py = stations[i - 1].y;
    const cx = stations[i].x, cy = stations[i].y;
    const adx = Math.abs(cx - px), ady = Math.abs(cy - py);
    if (adx === 0 && ady === 0) { d += ` L ${cx} ${cy}`; continue; }
    const angle = Math.atan2(ady, adx) * 180 / Math.PI;

    const fromCode = stations[i - 1].code, toCode = stations[i].code;
    if (SMOOTH_PAIRS[`${fromCode}→${toCode}`]) {
      const tension = 5;
      const p0 = stations[Math.max(0, i - 2)];
      const p1 = stations[i - 1];
      const p2 = stations[i];
      const p3 = stations[Math.min(stations.length - 1, i + 1)];
      let cp1x = Math.round(p1.x + (p2.x - p0.x) / tension);
      let cp1y = Math.round(p1.y + (p2.y - p0.y) / tension);
      let cp2x = Math.round(p2.x - (p3.x - p1.x) / tension);
      let cp2y = Math.round(p2.y - (p3.y - p1.y) / tension);
      if (fromCode === 'NS7') cp1x = p1.x;
      if (fromCode === 'NS12') cp1y = p1.y;
      if (toCode === 'NS15') { cp2x = p2.x; cp2y = Math.round(p2.y + (p2.y - p1.y) * 0.15); }
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      prevDir = Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y) ? 'h' : 'v';
      continue;
    }

    if (adx === 0) {
      d += ` V ${cy}`; prevDir = 'v';
    } else if (ady === 0) {
      d += ` H ${cx}`; prevDir = 'h';
    } else if (angle <= 20) {
      d += ` H ${cx} V ${cy}`; prevDir = 'h';
    } else if (angle >= 70) {
      d += ` V ${cy} H ${cx}`; prevDir = 'v';
    } else {
      const r = Math.round(Math.min(adx, ady) * 0.5);
      const sx = cx > px ? 1 : -1, sy = cy > py ? 1 : -1;
      if (prevDir === 'h') {
        const bx = cx - sx * r, by = py + sy * r;
        d += ` H ${bx} Q ${cx} ${py}, ${cx} ${by} V ${cy}`;
        prevDir = 'v';
      } else {
        const bx = px + sx * r, by = cy - sy * r;
        d += ` V ${by} Q ${px} ${cy}, ${bx} ${cy} H ${cx}`;
        prevDir = 'h';
      }
    }
  }
  return d;
}

function buildSmoothPath(stations, isLoop) {
  if (stations.length < 2) return '';
  const n = stations.length;
  let d = `M ${stations[0].x} ${stations[0].y}`;
  const tension = 5;
  for (let i = 1; i < n; i++) {
    const p0 = stations[isLoop ? ((i - 2 + n) % n) : Math.max(0, i - 2)];
    const p1 = stations[i - 1];
    const p2 = stations[i];
    const p3 = stations[isLoop ? ((i + 1) % n) : Math.min(n - 1, i + 1)];
    const cp1x = Math.round(p1.x + (p2.x - p0.x) / tension);
    const cp1y = Math.round(p1.y + (p2.y - p0.y) / tension);
    const cp2x = Math.round(p2.x - (p3.x - p1.x) / tension);
    const cp2y = Math.round(p2.y - (p3.y - p1.y) / tension);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  if (isLoop) {
    const p0 = stations[n - 2], p1 = stations[n - 1], p2 = stations[0], p3 = stations[1];
    const cp1x = Math.round(p1.x + (p2.x - p0.x) / tension);
    const cp1y = Math.round(p1.y + (p2.y - p0.y) / tension);
    const cp2x = Math.round(p2.x - (p3.x - p1.x) / tension);
    const cp2y = Math.round(p2.y - (p3.y - p1.y) / tension);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// ─── Map between mrt-lines station data and coordinate data ───
function getCoordArray(lineId) {
  switch (lineId) {
    case 'ns': return NS_COORDS;
    case 'ew': return EW_COORDS;
    case 'ne': return NE_COORDS;
    case 'cc': return CC_COORDS;
    case 'ce': return CE_COORDS;
    case 'dt': return DT_COORDS;
    case 'te': return TE_COORDS;
    default: return [];
  }
}

// ─── SVG helpers ───
function svgEl(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function drawSvgPath(svg, d, color, width, opacity) {
  svg.appendChild(svgEl('path', {
    d, fill: 'none', stroke: color,
    'stroke-width': width, 'stroke-linecap': 'round',
    'stroke-linejoin': 'round', opacity,
  }));
}

// ─── Route ───

registerRoute('#mrt', async (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('mrt.title', 'MRT Progress Map'));
  app.appendChild(h1);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Load question counts
  const questionCounts = {};
  for (const line of MRT_LINES) {
    const questions = await loadQuestions(line.module);
    questionCounts[line.module] = questions.length;
  }

  // Compute unlock sets for functional lines (NS=bcp, EW=comgi)
  const unlockSets = {};
  for (const line of MRT_LINES) {
    const totalQ = questionCounts[line.module] || 1;
    const totalS = line.stations.length;
    const uniqueCorrect = RecordStore.getUniqueCorrectCount(line.module);
    const stationsToUnlock = Math.min(totalS, 1 + Math.floor(uniqueCorrect / totalQ * (totalS - 1)));
    const set = new Set();
    for (let i = 0; i < stationsToUnlock; i++) set.add(line.unlockOrder[i]);
    unlockSets[line.id] = set;
  }

  // Legend
  const legend = el('div', { className: 'mrt-legend' });
  for (const ll of MRT_LINES) {
    const color = isDark ? ll.darkColor : ll.color;
    const unlocked = unlockSets[ll.id].size;
    legend.appendChild(legendItem(color, `${ll.name} (${ll.module.toUpperCase()}) ${unlocked}/${ll.stations.length}`));
  }
  for (const ml of ALL_MRT_LINES) {
    if (ml.id === 'ns' || ml.id === 'ew') continue;
    const color = isDark ? ml.darkColor : ml.color;
    legend.appendChild(legendItem(color, ml.name));
  }
  app.appendChild(legend);

  // SVG
  const svg = svgEl('svg', { viewBox: `0 0 ${VIEW_W} ${VIEW_H}`, class: 'mrt-map' });

  // Layer 1: All line paths
  for (const ml of ALL_MRT_LINES) {
    const color = isDark ? ml.darkColor : ml.color;
    const coords = ml.stations;
    const isFunctional = MRT_LINES.some(l => l.id === ml.id);
    const baseOpacity = isFunctional ? 0.25 : 0.15;

    let pathD;
    if (ml.id === 'cc') {
      pathD = buildSmoothPath(coords, false);
    } else {
      pathD = buildPath(coords);
    }
    drawSvgPath(svg, pathD, color, 3, baseOpacity);

    // CE extension
    if (ml.extension) {
      const prom = coords.find(s => s.code === 'CC4');
      if (prom) {
        const ceStations = [prom, ...ml.extension];
        drawSvgPath(svg, buildSmoothPath(ceStations, false), color, 3, baseOpacity);
      }
    }
  }

  // Layer 2: Bright overlay for unlocked segments on functional lines
  for (const line of MRT_LINES) {
    const color = isDark ? line.darkColor : line.color;
    const coords = getCoordArray(line.id);
    const unlockSet = unlockSets[line.id];
    const unlockedIndices = [...unlockSet].sort((a, b) => a - b);
    if (unlockedIndices.length > 1) {
      // Build unlocked stations as coordinate array for path
      const unlockStations = unlockedIndices.map(i => ({
        ...line.stations[i],
        x: coords[i].x,
        y: coords[i].y,
        code: coords[i].code,
      }));
      drawSvgPath(svg, buildPath(unlockStations), color, 3.5, 0.8);
    }
  }

  // Layer 3: Interchange markers
  drawInterchangeMarkers(svg, isDark);

  // Layer 4: Station dots & labels
  for (const ml of ALL_MRT_LINES) {
    const color = isDark ? ml.darkColor : ml.color;
    const coords = ml.stations;
    const isFunctional = MRT_LINES.some(l => l.id === ml.id);
    const funcLine = MRT_LINES.find(l => l.id === ml.id);
    const unlockSet = isFunctional ? unlockSets[ml.id] : null;

    coords.forEach((s, idx) => {
      const unlocked = unlockSet ? unlockSet.has(idx) : false;
      const isIc = !!s.interchange;
      const r = isIc ? 3 : 2;

      const circle = svgEl('circle', {
        cx: s.x, cy: s.y, r,
        fill: (isFunctional && unlocked) ? color : (isFunctional ? (isDark ? '#252540' : '#e8e8e8') : color),
        stroke: isDark ? '#1a1a2e' : '#fff',
        'stroke-width': isFunctional ? (unlocked ? '1' : '0.8') : '0.5',
        opacity: isFunctional ? (unlocked ? '1' : '0.4') : '0.5',
      });
      svg.appendChild(circle);
    });

    // Labels for functional lines only
    if (isFunctional) {
      coords.forEach((s, idx) => {
        const unlocked = unlockSet.has(idx);
        const showLabel = unlocked || !!s.interchange;
        if (!showLabel) return;
        const label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('x', s.x + 6);
        label.setAttribute('y', s.y - 4);
        label.setAttribute('fill', isDark ? '#aaa' : '#555');
        label.setAttribute('font-size', '5');
        label.setAttribute('font-family', 'system-ui');
        label.setAttribute('class', 'mrt-map__label');
        label.textContent = s.code;
        svg.appendChild(label);
      });
    }

    // CE extension dots
    if (ml.extension) {
      ml.extension.forEach(s => {
        svg.appendChild(svgEl('circle', {
          cx: s.x, cy: s.y, r: s.interchange ? 3 : 2,
          fill: color, stroke: isDark ? '#1a1a2e' : '#fff',
          'stroke-width': '0.5', opacity: '0.5',
        }));
      });
    }
  }

  // Layer 5: Invisible hit areas for tap interaction (all lines)
  const drawnHits = new Set();
  for (const ml of ALL_MRT_LINES) {
    const allCoords = ml.extension ? [...ml.stations, ...ml.extension] : ml.stations;
    allCoords.forEach(s => {
      const k = `${s.x},${s.y}`;
      if (drawnHits.has(k)) return;
      drawnHits.add(k);
      const hit = svgEl('circle', {
        cx: s.x, cy: s.y, r: 8,
        fill: 'transparent', cursor: 'pointer',
      });
      hit.addEventListener('click', (e) => {
        e.stopPropagation();
        openStationSheet(s, isDark);
      });
      svg.appendChild(hit);
    });
  }

  const mapContainer = el('div', { className: 'mrt-map-container mt-md' });
  mapContainer.appendChild(svg);
  app.appendChild(mapContainer);

  // Stats summary
  const totalStations = MRT_LINES.reduce((sum, l) => sum + l.stations.length, 0);
  const totalUnlocked = MRT_LINES.reduce((sum, l) => sum + unlockSets[l.id].size, 0);
  const summaryEl = el('div', { className: 'text-center text-secondary mt-md text-sm' });
  summaryEl.textContent = `${totalUnlocked} of ${totalStations} stations unlocked — Answer questions correctly to expand the line!`;
  app.appendChild(summaryEl);

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

// ─── Interchange markers (capsule for offset pairs, rings for same-position) ───

function drawInterchangeMarkers(svg, isDark) {
  const icGroups = {};
  for (const arr of ALL_STATIONS) {
    for (const s of arr) {
      if (!s.interchange) continue;
      if (!icGroups[s.name]) icGroups[s.name] = [];
      icGroups[s.name].push(s);
    }
  }

  for (const name of Object.keys(icGroups)) {
    const g = icGroups[name];
    if (g.length < 2) continue;

    let maxD = 0, p1 = g[0], p2 = g[0];
    for (let a = 0; a < g.length; a++) {
      for (let b = a + 1; b < g.length; b++) {
        const dd = Math.hypot(g[a].x - g[b].x, g[a].y - g[b].y);
        if (dd > maxD) { maxD = dd; p1 = g[a]; p2 = g[b]; }
      }
    }

    if (maxD > 15) {
      // Too far apart — individual rings
      const done = new Set();
      g.forEach(s => {
        const k = `${s.x},${s.y}`;
        if (done.has(k)) return;
        done.add(k);
        svg.appendChild(svgEl('circle', {
          cx: s.x, cy: s.y, r: '5.5',
          fill: 'none', stroke: '#fff',
          'stroke-width': '1.5', opacity: '0.6',
        }));
      });
    } else if (maxD > 0) {
      // Small offset — capsule outline
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len, ny = dx / len;
      const r = 5.5;
      const ax = p1.x + nx * r, ay = p1.y + ny * r;
      const bx = p2.x + nx * r, by = p2.y + ny * r;
      const cx = p2.x - nx * r, cy = p2.y - ny * r;
      const ddx = p1.x - nx * r, ddy = p1.y - ny * r;
      const pd = `M ${ax} ${ay} L ${bx} ${by} A ${r} ${r} 0 1 0 ${cx} ${cy} L ${ddx} ${ddy} A ${r} ${r} 0 1 0 ${ax} ${ay} Z`;
      svg.appendChild(svgEl('path', {
        d: pd, fill: 'none', stroke: '#fff',
        'stroke-width': '1.5', opacity: '0.6',
      }));
    } else {
      // Same position — normal ring
      svg.appendChild(svgEl('circle', {
        cx: g[0].x, cy: g[0].y, r: '5.5',
        fill: 'none', stroke: '#fff',
        'stroke-width': '1.5', opacity: '0.6',
      }));
    }
  }
}

function legendItem(color, text) {
  const item = el('div', { className: 'mrt-legend__item' });
  item.appendChild(el('span', { className: 'mrt-legend__dot', style: `background:${color};` }));
  item.appendChild(el('span', {}, text));
  return item;
}

// ─── Station Info Bottom Sheet ───

// Line color map for code badges
const LINE_COLORS = {};
for (const ml of ALL_MRT_LINES) {
  for (const s of ml.stations) LINE_COLORS[s.code] = ml.color;
  if (ml.extension) for (const s of ml.extension) LINE_COLORS[s.code] = ml.color;
}

let sheetEl = null;
let backdropEl = null;

function ensureSheetDOM() {
  if (sheetEl) return;
  backdropEl = el('div', { className: 'station-sheet-backdrop' });
  backdropEl.addEventListener('click', closeStationSheet);
  document.body.appendChild(backdropEl);

  sheetEl = el('div', { className: 'station-sheet' });
  sheetEl.innerHTML = `
    <div class="station-sheet__handle"></div>
    <div class="station-sheet__header">
      <div class="station-sheet__codes" id="ss-codes"></div>
      <div class="station-sheet__name" id="ss-name"></div>
      <div class="station-sheet__tagline" id="ss-tagline"></div>
    </div>
    <div class="station-sheet__body" id="ss-body"></div>
    <ul class="station-sheet__spots" id="ss-spots"></ul>
    <div id="ss-map-link"></div>
    <div class="station-sheet__placeholder" id="ss-placeholder"></div>
  `;
  document.body.appendChild(sheetEl);

  // Swipe-down to close
  let startY = 0;
  sheetEl.querySelector('.station-sheet__handle').addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });
  sheetEl.querySelector('.station-sheet__handle').addEventListener('touchmove', (e) => {
    const dy = e.touches[0].clientY - startY;
    if (dy > 60) closeStationSheet();
  });
}

function openStationSheet(station, isDark) {
  ensureSheetDOM();

  // Collect all codes for this station name across all lines
  const codes = [];
  for (const arr of ALL_STATIONS) {
    for (const s of arr) {
      if (s.name === station.name && !codes.includes(s.code)) codes.push(s.code);
    }
  }

  // Header: code badges
  const codesEl = sheetEl.querySelector('#ss-codes');
  codesEl.innerHTML = '';
  for (const code of codes) {
    const badge = el('span', { className: 'station-sheet__code' });
    badge.style.background = LINE_COLORS[code] || '#666';
    badge.textContent = code;
    codesEl.appendChild(badge);
  }

  // Name
  sheetEl.querySelector('#ss-name').textContent = station.name;

  // Station info
  const info = getStationInfo(station.name);
  const taglineEl = sheetEl.querySelector('#ss-tagline');
  const bodyEl = sheetEl.querySelector('#ss-body');
  const spotsEl = sheetEl.querySelector('#ss-spots');
  const mapLinkEl = sheetEl.querySelector('#ss-map-link');
  const placeholderEl = sheetEl.querySelector('#ss-placeholder');

  if (info && info.tagline) {
    taglineEl.textContent = info.tagline;
    taglineEl.style.display = '';
  } else {
    taglineEl.style.display = 'none';
  }

  if (info && info.body) {
    bodyEl.innerHTML = info.body;
    bodyEl.style.display = '';
  } else {
    bodyEl.style.display = 'none';
  }

  // Spots
  spotsEl.innerHTML = '';
  if (info && info.spots && info.spots.length) {
    spotsEl.style.display = '';
    for (const spot of info.spots) {
      const li = el('li', { className: 'station-sheet__spot' });
      li.appendChild(el('span', { className: 'station-sheet__spot-icon' }, spot.icon || '📍'));
      const nameSpan = el('span', { className: 'station-sheet__spot-name' });
      if (spot.url) {
        const a = el('a', { href: spot.url, target: '_blank', rel: 'noopener' });
        a.textContent = spot.name;
        nameSpan.appendChild(a);
      } else {
        nameSpan.textContent = spot.name;
      }
      li.appendChild(nameSpan);
      if (spot.desc) li.appendChild(el('span', { className: 'station-sheet__spot-desc' }, ` — ${spot.desc}`));
      spotsEl.appendChild(li);
    }
  } else {
    spotsEl.style.display = 'none';
  }

  // Google Maps link
  mapLinkEl.innerHTML = '';
  const mapQuery = (info && info.mapQuery) || `${station.name}+MRT+Station+Singapore`;
  const mapA = el('a', {
    className: 'station-sheet__map-link',
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery.replace(/\+/g, ' '))}`,
    target: '_blank',
    rel: 'noopener',
  });
  mapA.textContent = '📍 Google Maps で見る';
  mapLinkEl.appendChild(mapA);

  // Placeholder for stations without detailed info
  if (!info || !info.body) {
    placeholderEl.textContent = 'Coming soon...';
    placeholderEl.style.display = '';
  } else {
    placeholderEl.style.display = 'none';
  }

  // Show
  backdropEl.classList.add('is-open');
  sheetEl.classList.add('is-open');
}

function closeStationSheet() {
  if (sheetEl) sheetEl.classList.remove('is-open');
  if (backdropEl) backdropEl.classList.remove('is-open');
}
