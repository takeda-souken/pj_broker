/**
 * Fun View — tabbed hub for MRT Progress Map and Hawker Collection.
 * Refactored from mrt-view.js: same MRT logic, Hawker split into its own tab.
 */
import { registerRoute, navigate } from '../router.js';
import { el, moduleLabel } from '../utils/dom-helpers.js';
import { MRT_LINES, BONUS_LINES, CIRCLE_LINE, DECO_LINES } from '../data/mrt-lines.js';
import {
  NS_COORDS, EW_COORDS, NE_COORDS, CC_COORDS, CE_COORDS, DT_COORDS, TE_COORDS,
  ALL_MRT_LINES,
} from '../data/mrt-coordinates.js';
import { RecordStore } from '../models/record-store.js';
import { DebugStore } from '../models/debug-store.js';
import { HAWKER_DISHES } from '../data/hawker.js';
import { triText, triContent } from '../utils/i18n.js';
import { loadQuestions } from '../data/questions.js';
import { getStationInfo } from '../data/station-info.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 750;
const VIEW_H = 520;
const MRT_PREV_STATE_KEY = 'sg_broker_mrt_prev_unlock';
const FUN_TAB_KEY = 'sg_broker_fun_tab';

// ─── Line width / dot size constants ───
const LINE_W_BASE = 5;
const LINE_W_UNLOCK = 6;
const DOT_R = 3;
const DOT_R_IC = 4.5;
const IC_RING_R = 7;

// ─── Coordinate lookup helpers ───
const ALL_STATIONS = [NS_COORDS, EW_COORDS, NE_COORDS, CC_COORDS, CE_COORDS, DT_COORDS, TE_COORDS];

function findCoord(code) {
  for (const arr of ALL_STATIONS) {
    const s = arr.find(st => st.code === code);
    if (s) return s;
  }
  return null;
}

// ─── Interchange center sharing ───
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
    ['TE2', { x: 202, y: 46 }], ['TE9', { x: 299, y: 186 }],
    ['TE14', { x: 292 }],
    ['NS25', { x: 417, y: 413 }], ['EW13', { x: 423, y: 413 }],
    ['NS26', { x: 417, y: 444 }], ['EW14', { x: 423, y: 444 }],
    ['CC4', { x: 524, y: 430 }], ['DT15', { x: 511, y: 430 }],
    ['CE1', { x: 491, y: 462 }], ['DT16', { x: 482, y: 457 }],
    ['EW8', { x: 541, y: 282 }], ['CC9', { x: 541, y: 282 }], ['EW12', { x: 455, y: 368 }],
    ['EW16', { x: 319, y: 421 }], ['NE3', { x: 332, y: 421 }], ['TE17', { x: 344, y: 421 }],
  ];
  for (const [code, vals] of fixes) {
    const s = findCoord(code);
    if (!s) continue;
    if (vals.x !== undefined) s.x = vals.x;
    if (vals.y !== undefined) s.y = vals.y;
  }
  // (NS22/NS23 vertical alignment removed — smooth curve tangent handles it now)
}

// Run once at module load
mergeInterchanges();
applyParallelOffsets();
applyFixups();

// ─── Path builders ───

const SMOOTH_PAIRS = {
  'NS7→NS8':1,'NS8→NS9':1,
  'NS12→NS13':1,'NS13→NS14':1,'NS14→NS15':1,
  'TE1→TE2':1,'TE2→TE3':1,'TE3→TE4':1,'TE4→TE5':1,
  'TE5→TE6':1,'TE6→TE7':1,
  'NE1→NE3':1,'NE3→NE4':1,'NE4→NE5':1,'NE5→NE6':1,
  'CC2→CC3':1,'CC8→CC9':1,'CC9→CC10':1,'NE6→NE7':1,'NE9→NE10':1,'NE10→NE11':1,'NE11→NE12':1,'NE12→NE13':1,
  'NE13→NE14':1,'NE14→NE15':1,'NE15→NE16':1,'NE16→NE17':1,
  'EW11→EW12':1,'EW15→EW16':1,'EW16→EW17':1,'EW17→EW18':1,'EW18→EW19':1,
  'EW19→EW20':1,
  'EW2→EW3':1,'EW3→EW4':1,
  'EW6→EW7':1,'EW7→EW8':1,'EW8→EW9':1,'EW9→EW10':1,'EW10→EW11':1,
  'DT21→DT22':1,'DT22→DT23':1,'DT23→DT24':1,'DT24→DT25':1,'DT25→DT26':1,'DT26→DT27':1,
  'DT27→DT28':1,'DT28→DT29':1,'DT29→DT30':1,
  'NS19→NS20':1,'NS20→NS21':1,'NS21→NS22':1,'NS22→NS23':1,'NS23→NS24':1,
  'TE17→TE18':1,'TE18→TE19':1,
  'DT10→DT11':1,'DT11→DT12':1,'DT12→DT13':1,'DT13→DT14':1,'DT14→DT15':1,'DT15→DT16':1,'DT16→DT17':1,'DT17→DT18':1,'DT18→DT19':1,'DT19→DT20':1,
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
    // ─── Custom two-line + rounded corner segments ───
    if (fromCode === 'EW5' && toCode === 'EW6') {
      // EW5 →水平←→ R →45度↘→ EW6 (line y=-x+839)
      const cornerX = 839 - cy, cornerY = cy; // 45° line at EW6.y... no
      // Corner: 45° line meets horizontal y=EW5.y. y=-x+839, at y=py: x=839-py
      const cX = 823 - py, cY = py;
      const r = 8;
      const bx = Math.round(cX - 0.7071 * r), by = Math.round(cY + 0.7071 * r);
      d += ` H ${cX + r} Q ${cX} ${cY}, ${bx} ${by} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'EW12' && toCode === 'EW13') {
      // EW12 →45度↘→ R →垂直↓→ EW13 (line y=-x+839)
      const cX = cx, cY = 823 - cx; // 45° line at EW13.x
      const r = 8;
      const ax = Math.round(cX + 0.7071 * r), ay = Math.round(cY - 0.7071 * r);
      d += ` L ${ax} ${ay} Q ${cX} ${cY}, ${cX} ${cY + r} V ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'EW20' && toCode === 'EW21') {
      // EW20 →45度↖→ R →水平←→ EW21 (array order: going west)
      const cornerX = cy - 102, cornerY = cy; // 45° line meets horizontal y=EW21.y
      const r = 8;
      const ax = Math.round(cornerX + 0.7071 * r), ay = Math.round(cornerY + 0.7071 * r);
      d += ` L ${ax} ${ay} Q ${cornerX} ${cornerY}, ${cornerX - r} ${cornerY} H ${cx}`;
      prevDir = 'h'; continue;
    }
    if (fromCode === 'NS24' && toCode === 'NS25') {
      // NS24 →45度↘→ R →垂直↓→ NS25
      const cornerX = cx, cornerY = cx - 16; // 45° line y=x-16 at NS25.x
      const r = 8;
      const ax = Math.round(cornerX - 0.7071 * r), ay = Math.round(cornerY - 0.7071 * r);
      d += ` L ${ax} ${ay} Q ${cornerX} ${cornerY}, ${cornerX} ${cornerY + r} V ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'TE7' && toCode === 'TE8') {
      // TE7 →45度↘→ R →垂直↓→ TE8
      const cornerX = cx, cornerY = cx - 156; // 45° line y=x-156 at TE8.x
      const r = 8;
      const ax = Math.round(cornerX - 0.7071 * r), ay = Math.round(cornerY - 0.7071 * r);
      d += ` L ${ax} ${ay} Q ${cornerX} ${cornerY}, ${cornerX} ${cornerY + r} V ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'TE16' && toCode === 'TE17') {
      // TE16 →垂直↓→ R →45度↘→ TE17
      const cornerX = px, cornerY = px + (cy - cx); // vertical x meets 45° line y=x+77
      const r = 8;
      const bx = Math.round(cornerX + 0.7071 * r), by = Math.round(cornerY + 0.7071 * r);
      d += ` V ${cornerY - r} Q ${cornerX} ${cornerY}, ${bx} ${by} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'TE19' && toCode === 'TE20') {
      // TE19 →45度↘→ R →水平→ TE20
      const cornerX = cy - (py - px), cornerY = cy; // 45° line meets horizontal y=TE20.y
      const r = 8;
      const ax = Math.round(cornerX - 0.7071 * r), ay = Math.round(cornerY - 0.7071 * r);
      d += ` L ${ax} ${ay} Q ${cornerX} ${cornerY}, ${cornerX + r} ${cornerY} L ${cx} ${cy}`;
      prevDir = 'h'; continue;
    }
    if (fromCode === 'EW14' && toCode === 'EW15') {
      // EW14 →垂直↓→ R →水平←→ R →45度↗→ EW15
      const dip = 15;
      const h = py + dip; // horizontal y
      const c1x = cx + (h - cy), c1y = h; // 45° from EW15 meets horizontal
      const c2x = px, c2y = h;             // vertical from EW14 meets horizontal
      const r = 8;
      // From EW14: vertical down to near corner2, R, horizontal left to near corner1, R, diagonal to EW15
      const b2x = c2x, b2y = c2y - r;     // before corner2 on vertical
      const a2x = c2x - r, a2y = c2y;     // after corner2 on horizontal
      const b1x = c1x + r, b1y = c1y;     // before corner1 on horizontal
      const a1x = Math.round(c1x - 0.7071 * r), a1y = Math.round(c1y - 0.7071 * r); // after corner1 on diagonal
      d += ` V ${b2y} Q ${c2x} ${c2y}, ${a2x} ${a2y} H ${b1x} Q ${c1x} ${c1y}, ${a1x} ${a1y} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'CC1' && toCode === 'CC2') {
      // CC1 →水平右→ →↖45度(CC2方向)→ CC2
      const cornerX = cx - (cy - py), cornerY = py;
      const r = 8;
      const bx = Math.round(cornerX + 0.7071 * r), by = Math.round(cornerY + 0.7071 * r);
      d += ` H ${cornerX - r} Q ${cornerX} ${cornerY}, ${bx} ${by} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'CC3' && toCode === 'CC4') {
      // CC3 →45度↘→ →45度↙(CC4方向)→ CC4
      const cornerX = Math.round((cx + cy + px - py) / 2);
      const cornerY = cornerX - px + py;
      const r = 20;
      const ax = Math.round(cornerX - 0.7071 * r), ay = Math.round(cornerY - 0.7071 * r);
      const bx = Math.round(cornerX + 0.7071 * r), by = Math.round(cornerY - 0.7071 * r);
      d += ` L ${ax} ${ay} Q ${cornerX} ${cornerY}, ${bx} ${by} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'DT20' && toCode === 'DT21') {
      // DT20 →水平右→ →DT22-DT21延長→ DT21
      const p3 = stations[Math.min(stations.length - 1, i + 1)];
      const dx22 = p3.x - cx, dy22 = p3.y - cy;
      const t = (py - cy) / dy22;
      const cornerX = Math.round(cx + dx22 * t), cornerY = py;
      const r = 8;
      const diagLen = Math.hypot(cx - cornerX, cy - cornerY);
      const nx = (cx - cornerX) / diagLen, ny = (cy - cornerY) / diagLen;
      const bx = Math.round(cornerX + nx * r), by = Math.round(cornerY + ny * r);
      d += ` H ${cornerX - r} Q ${cornerX} ${cornerY}, ${bx} ${by} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
    if (fromCode === 'TE20' && toCode === 'TE22') {
      // TE20 →水平右→ →45度↗→ TE22
      const cornerX = cx - Math.abs(cy - py), cornerY = py; // 45° line from TE22 meets horizontal
      const r = 8;
      const nx = 0.7071, ny = -0.7071; // 45° upper-right
      const bx = Math.round(cornerX + nx * r), by = Math.round(cornerY + ny * r);
      d += ` H ${cornerX - r} Q ${cornerX} ${cornerY}, ${bx} ${by} L ${cx} ${cy}`;
      prevDir = 'v'; continue;
    }
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
      // NS19: vertical departure (down)
      if (fromCode === 'NS19') cp1x = p1.x;
      // NS22: vertical arrival (from above) & vertical departure (down)
      // NS22→NS23, NS23→NS24: straight lines (45° line y=x-16)
      if (fromCode === 'NS22' || fromCode === 'NS23') {
        cp1x = Math.round(p1.x + (p2.x - p1.x) / 3);
        cp1y = Math.round(p1.y + (p2.y - p1.y) / 3);
        cp2x = Math.round(p1.x + (p2.x - p1.x) * 2 / 3);
        cp2y = Math.round(p1.y + (p2.y - p1.y) * 2 / 3);
      }
      // NE1→NE3, NE10→...→NE17: straight lines
      if (fromCode === 'NE1' || fromCode === 'NE10' || fromCode === 'NE11' || fromCode === 'NE12' || fromCode === 'NE13' || fromCode === 'NE14' || fromCode === 'NE15' || fromCode === 'NE16') {
        cp1x = Math.round(p1.x + (p2.x - p1.x) / 3);
        cp1y = Math.round(p1.y + (p2.y - p1.y) / 3);
        cp2x = Math.round(p1.x + (p2.x - p1.x) * 2 / 3);
        cp2y = Math.round(p1.y + (p2.y - p1.y) * 2 / 3);
      }
      // NE7: vertical arrival (from below, toward NE6)
      if (toCode === 'NE7') cp2x = p2.x;
      // CC2→CC3: straight line
      if (fromCode === 'CC2') {
        cp1x = Math.round(p1.x + (p2.x - p1.x) / 3);
        cp1y = Math.round(p1.y + (p2.y - p1.y) / 3);
        cp2x = Math.round(p1.x + (p2.x - p1.x) * 2 / 3);
        cp2y = Math.round(p1.y + (p2.y - p1.y) * 2 / 3);
      }
      // (EW14→EW15 handled by custom path)
      // EW6→...→EW20: straight lines (EW6-EW12 on y=-x+839, EW15-EW20 on y=x+102)
      if (fromCode === 'CC8' || fromCode === 'CC9' || fromCode === 'EW6' || fromCode === 'EW7' || fromCode === 'EW8' || fromCode === 'EW9' || fromCode === 'EW10' || fromCode === 'EW11' || fromCode === 'EW15' || fromCode === 'EW16' || fromCode === 'EW17' || fromCode === 'EW18' || fromCode === 'EW19') {
        cp1x = Math.round(p1.x + (p2.x - p1.x) / 3);
        cp1y = Math.round(p1.y + (p2.y - p1.y) / 3);
        cp2x = Math.round(p1.x + (p2.x - p1.x) * 2 / 3);
        cp2y = Math.round(p1.y + (p2.y - p1.y) * 2 / 3);
      }
      // (TE16→TE17 and TE19→TE20 handled by custom paths)
      // TE17→TE18, TE18→TE19: straight lines (degenerate Bezier)
      if (fromCode === 'TE1' || fromCode === 'TE2' || fromCode === 'TE3' || fromCode === 'TE4' || fromCode === 'TE5' || fromCode === 'TE6' || fromCode === 'TE17' || fromCode === 'TE18') {
        cp1x = Math.round(p1.x + (p2.x - p1.x) / 3);
        cp1y = Math.round(p1.y + (p2.y - p1.y) / 3);
        cp2x = Math.round(p1.x + (p2.x - p1.x) * 2 / 3);
        cp2y = Math.round(p1.y + (p2.y - p1.y) * 2 / 3);
      }
      // (TE20 arrival handled by custom path)
      // DT10: horizontal departure (right)
      if (fromCode === 'DT10') cp1y = p1.y;
      // (DT20→DT21 handled above as custom path, not here)
      // DT21: arrive matching DT21→DT22 direction
      if (toCode === 'DT21') {
        cp2x = Math.round(p2.x - (p3.x - p2.x) / tension);
        cp2y = Math.round(p2.y - (p3.y - p2.y) / tension);
      }
      // DT15→DT16, DT22→DT23: straight line
      if (fromCode === 'DT15' || fromCode === 'DT21' || fromCode === 'DT22') {
        cp1x = Math.round(p1.x + (p2.x - p1.x) / 3);
        cp1y = Math.round(p1.y + (p2.y - p1.y) / 3);
        cp2x = Math.round(p1.x + (p2.x - p1.x) * 2 / 3);
        cp2y = Math.round(p1.y + (p2.y - p1.y) * 2 / 3);
      }
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

registerRoute('#fun', async (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.appendChild(document.createTextNode('\u25C0 '));
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('fun.title', 'Fun'));
  app.appendChild(h1);

  // ─── Tab bar ───
  const tabBar = el('div', { className: 'seg-control mt-sm' });
  const mrtTab = el('button', { className: 'seg-control__item' });
  mrtTab.appendChild(triContent('\uD83D\uDE87 MRT', '\uD83D\uDE87 MRT'));
  const hawkerTab = el('button', { className: 'seg-control__item' });
  hawkerTab.appendChild(triContent('\uD83C\uDF5C Hawker', '\uD83C\uDF5C Hawker'));
  tabBar.appendChild(mrtTab);
  tabBar.appendChild(hawkerTab);
  app.appendChild(tabBar);

  // ─── Content container ───
  const content = el('div', { className: 'fun-tab-content' });
  app.appendChild(content);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // ─── Shared data loading ───
  const questionCounts = {};
  const topicQuestionCounts = {};
  for (const line of MRT_LINES) {
    const questions = await loadQuestions(line.module);
    questionCounts[line.module] = questions.length;
    for (const q of questions) {
      const key = `${line.module}::${q.topic}`;
      topicQuestionCounts[key] = (topicQuestionCounts[key] || 0) + 1;
    }
  }

  const debugBonus = DebugStore.isActive() ? (DebugStore.get('mrtBonus') || {}) : {};

  const unlockSets = {};
  for (const line of MRT_LINES) {
    const totalQ = questionCounts[line.module] || 1;
    const totalS = line.stations.length;
    const uniqueCorrect = RecordStore.getUniqueCorrectCount(line.module);
    const ratio = uniqueCorrect / totalQ;
    const curved = Math.sqrt(ratio);
    const bonus = debugBonus[line.id] || 0;
    const stationsToUnlock = Math.min(totalS, bonus + 1 + Math.floor(curved * (totalS - 1)));
    const set = new Set();
    for (let i = 0; i < stationsToUnlock; i++) set.add(line.unlockOrder[i]);
    unlockSets[line.id] = set;
  }

  const totalQAll = Object.values(questionCounts).reduce((s, v) => s + v, 0) || 1;
  const totalUniqueAll = MRT_LINES.reduce((s, l) => s + RecordStore.getUniqueCorrectCount(l.module), 0);
  const allLines = [...MRT_LINES, ...BONUS_LINES];
  for (const line of BONUS_LINES) {
    const totalS = line.stations.length;
    const ratio = totalUniqueAll / totalQAll;
    const curved = Math.sqrt(ratio);
    const bonus = debugBonus[line.id] || 0;
    const stationsToUnlock = Math.min(totalS, bonus + 1 + Math.floor(curved * (totalS - 1)));
    const set = new Set();
    for (let i = 0; i < stationsToUnlock; i++) set.add(line.unlockOrder[i]);
    unlockSets[line.id] = set;
  }

  let prevUnlockSets = {};
  try {
    prevUnlockSets = JSON.parse(localStorage.getItem(MRT_PREV_STATE_KEY) || '{}');
  } catch { /* ignore */ }
  const newStations = {};
  for (const line of allLines) {
    const prevSet = new Set(prevUnlockSets[line.id] || []);
    const curSet = unlockSets[line.id];
    newStations[line.id] = new Set([...curSet].filter(i => !prevSet.has(i)));
  }
  const stateToSave = {};
  for (const line of allLines) {
    stateToSave[line.id] = [...unlockSets[line.id]];
  }
  localStorage.setItem(MRT_PREV_STATE_KEY, JSON.stringify(stateToSave));

  // Shared context for both tabs
  const ctx = {
    isDark, questionCounts, topicQuestionCounts, unlockSets,
    newStations, allLines, totalQAll, totalUniqueAll,
  };

  // ─── Tab switching ───
  let activeTab = sessionStorage.getItem(FUN_TAB_KEY) || 'mrt';

  function switchTab(tab) {
    activeTab = tab;
    sessionStorage.setItem(FUN_TAB_KEY, tab);
    mrtTab.classList.toggle('seg-control__item--active', tab === 'mrt');
    hawkerTab.classList.toggle('seg-control__item--active', tab === 'hawker');
    content.innerHTML = '';
    const appEl = document.getElementById('app');
    if (tab === 'mrt') {
      renderMrtContent(content, ctx);
    } else {
      appEl.classList.remove('mrt-wide');
      renderHawkerContent(content, ctx);
    }
  }

  mrtTab.addEventListener('click', () => switchTab('mrt'));
  hawkerTab.addEventListener('click', () => switchTab('hawker'));
  switchTab(activeTab);

  // Cleanup: remove wide class when leaving this route
  return () => {
    document.getElementById('app').classList.remove('mrt-wide');
  };
});

// ─── MRT Tab Content ───

function renderMrtContent(container, ctx) {
  const { isDark, questionCounts, unlockSets, newStations, allLines, totalQAll, totalUniqueAll } = ctx;

  // ─── Two-column layout: map (left) + sidebar (right on PC, below on mobile) ───
  const layout = el('div', { className: 'mrt-layout mt-md' });
  const mapCol = el('div', { className: 'mrt-layout__map' });
  const sidebar = el('div', { className: 'mrt-layout__sidebar' });

  // Widen #app for this view
  const appEl = document.getElementById('app');
  appEl.classList.add('mrt-wide');

  // Sidebar: line rows with stats
  for (const ll of MRT_LINES) {
    const color = isDark ? ll.darkColor : ll.color;
    const unlocked = unlockSets[ll.id].size;
    const totalQ = questionCounts[ll.module] || 0;
    const uniqueCorrect = RecordStore.getUniqueCorrectCount(ll.module);
    sidebar.appendChild(lineRow(color, ll, unlocked, totalQ, uniqueCorrect, false));
  }
  for (const ll of BONUS_LINES) {
    const color = isDark ? ll.darkColor : ll.color;
    const unlocked = unlockSets[ll.id].size;
    sidebar.appendChild(lineRow(color, ll, unlocked, totalQAll, totalUniqueAll, true));
  }

  // SVG
  const svg = svgEl('svg', { viewBox: `0 0 ${VIEW_W} ${VIEW_H}`, class: 'mrt-map' });

  // Glow filters
  const defs = svgEl('defs', {});
  for (const line of allLines) {
    const color = isDark ? line.darkColor : line.color;
    const filter = svgEl('filter', { id: `glow-${line.id}`, x: '-50%', y: '-50%', width: '200%', height: '200%' });
    const flood = svgEl('feFlood', { 'flood-color': color, 'flood-opacity': '1', result: 'glowColor' });
    const comp = svgEl('feComposite', { in: 'glowColor', in2: 'SourceGraphic', operator: 'in', result: 'colored' });
    const blur = svgEl('feGaussianBlur', { in: 'colored', stdDeviation: '3', result: 'blur' });
    const merge = svgEl('feMerge', {});
    merge.appendChild(svgEl('feMergeNode', { in: 'blur' }));
    merge.appendChild(svgEl('feMergeNode', { in: 'blur' }));
    merge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
    filter.appendChild(flood);
    filter.appendChild(comp);
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
  }
  svg.appendChild(defs);

  // Layer 1: All line paths
  for (const ml of ALL_MRT_LINES) {
    const color = isDark ? ml.darkColor : ml.color;
    const coords = ml.stations;
    const hasUnlock = allLines.some(l => l.id === ml.id);
    const baseOpacity = hasUnlock ? 0.25 : 0.15;
    let pathD;
    if (ml.id === 'cc') {
      // CC1→CC4: custom buildPath, CC4→CC29: smooth
      const cc4Idx = coords.findIndex(s => s.code === 'CC4');
      const ccHead = coords.slice(0, cc4Idx + 1);  // CC1→CC2→CC3→CC4
      const ccTailAll = coords.slice(cc4Idx);
      // Split at CC8 and CC10 so CC9 sits exactly on the arc-line intersection
      const cc8Idx = ccTailAll.findIndex(s => s.code === 'CC8');
      const cc10Idx = ccTailAll.findIndex(s => s.code === 'CC10');
      const ccMid = ccTailAll.slice(0, cc8Idx + 1);    // CC4→...→CC8 (smooth)
      const ccBridge2 = ccTailAll.slice(cc8Idx, cc10Idx + 1); // CC8→CC9→CC10 (buildPath straight)
      const ccEnd = ccTailAll.slice(cc10Idx);            // CC10→...→CC29 (smooth)
      drawSvgPath(svg, buildSmoothPath(ccMid, false), color, LINE_W_BASE, baseOpacity);
      drawSvgPath(svg, buildPath(ccBridge2), color, LINE_W_BASE, baseOpacity);
      const ccTail = ccEnd;
      drawSvgPath(svg, buildPath(ccHead), color, LINE_W_BASE, baseOpacity);
      pathD = buildSmoothPath(ccTail, false);
    } else {
      pathD = buildPath(coords);
    }
    drawSvgPath(svg, pathD, color, LINE_W_BASE, baseOpacity);
    if (ml.extension) {
      const prom = coords.find(s => s.code === 'CC4');
      if (prom) {
        const ceStations = [prom, ...ml.extension];
        drawSvgPath(svg, buildSmoothPath(ceStations, false), color, LINE_W_BASE, baseOpacity);
      }
    }
  }

  // Layer 2: Bright overlay for unlocked segments
  for (const line of allLines) {
    const color = isDark ? line.darkColor : line.color;
    const coords = getCoordArray(line.id);
    const unlockSet = unlockSets[line.id];
    const newSet = newStations[line.id];
    const hasNew = newSet.size > 0;
    const unlockedIndices = [...unlockSet].sort((a, b) => a - b);
    const useSmooth = line.id === 'cc';
    const pathFn = useSmooth ? (s) => buildSmoothPath(s, false) : buildPath;
    if (unlockedIndices.length > 1) {
      if (hasNew) {
        const prevIndices = unlockedIndices.filter(i => !newSet.has(i));
        if (prevIndices.length > 1) {
          const prevStations = prevIndices.map(i => ({
            ...line.stations[i], x: coords[i].x, y: coords[i].y, code: coords[i].code,
          }));
          drawSvgPath(svg, pathFn(prevStations), color, LINE_W_UNLOCK, 0.8);
        }
        const allStns = unlockedIndices.map(i => ({
          ...line.stations[i], x: coords[i].x, y: coords[i].y, code: coords[i].code,
        }));
        const newPath = svgEl('path', {
          d: pathFn(allStns), fill: 'none', stroke: color,
          'stroke-width': String(LINE_W_UNLOCK), 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          filter: `url(#glow-${line.id})`,
          class: 'mrt-new-segment',
        });
        svg.appendChild(newPath);
      } else {
        const unlockStations = unlockedIndices.map(i => ({
          ...line.stations[i], x: coords[i].x, y: coords[i].y, code: coords[i].code,
        }));
        drawSvgPath(svg, pathFn(unlockStations), color, LINE_W_UNLOCK, 0.8);
      }
    }
  }

  // Layer 3: Interchange markers
  drawInterchangeMarkers(svg, isDark);

  // Layer 4: Station dots & labels
  for (const ml of ALL_MRT_LINES) {
    const color = isDark ? ml.darkColor : ml.color;
    const coords = ml.stations;
    const hasUnlock = allLines.some(l => l.id === ml.id);
    const unlockSet = hasUnlock ? unlockSets[ml.id] : null;
    const newSet = hasUnlock ? newStations[ml.id] : null;
    coords.forEach((s, idx) => {
      const unlocked = unlockSet ? unlockSet.has(idx) : false;
      const isNew = newSet ? newSet.has(idx) : false;
      const isIc = !!s.interchange;
      const r = isIc ? DOT_R_IC : DOT_R;
      const attrs = {
        cx: s.x, cy: s.y, r,
        fill: (hasUnlock && unlocked) ? color : (hasUnlock ? (isDark ? '#252540' : '#e8e8e8') : color),
        stroke: isDark ? '#1a1a2e' : '#fff',
        'stroke-width': hasUnlock ? (unlocked ? '1' : '0.8') : '0.5',
        opacity: hasUnlock ? (unlocked ? '1' : '0.4') : '0.5',
      };
      if (isNew) {
        attrs.filter = `url(#glow-${ml.id})`;
        attrs.class = 'mrt-new-station';
        delete attrs.opacity;
      }
      const circle = svgEl('circle', attrs);
      svg.appendChild(circle);
    });
    // (labels removed — shown via hover badge tooltip instead)
    if (ml.extension) {
      ml.extension.forEach(s => {
        svg.appendChild(svgEl('circle', {
          cx: s.x, cy: s.y, r: s.interchange ? DOT_R_IC : DOT_R,
          fill: color, stroke: isDark ? '#1a1a2e' : '#fff',
          'stroke-width': '0.5', opacity: '0.5',
        }));
      });
    }
  }

  // Build set of unlocked station names (for bottom sheet content gating)
  const unlockedStationNames = new Set();
  for (const ml of ALL_MRT_LINES) {
    const unlockSet = unlockSets[ml.id];
    if (!unlockSet) continue;
    ml.stations.forEach((s, idx) => {
      if (unlockSet.has(idx)) unlockedStationNames.add(s.name);
    });
  }

  // Layer 5: Hit areas + hover badge tooltip
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
      const stationUnlocked = unlockedStationNames.has(s.name);
      hit.addEventListener('click', (e) => {
        e.stopPropagation();
        pinStationBadge(s, mapContainer);
        openStationSheet(s, isDark, stationUnlocked);
      });
      // Hover/touch: show code badges near station
      hit.addEventListener('mouseenter', () => showStationBadge(s, mapContainer));
      hit.addEventListener('mouseleave', () => { if (!badgePinned) hideStationBadge(); });
      svg.appendChild(hit);
    });
  }

  const mapContainer = el('div', { className: 'mrt-map-container' });
  mapContainer.appendChild(svg);
  // Disclaimer overlay
  const disclaimer = el('div', { className: 'mrt-disclaimer' });
  const disclaimerInner = el('span', { className: 'mrt-disclaimer__inner' }, '⚠ 路線図は一部修正予定');
  disclaimer.appendChild(disclaimerInner);
  mapContainer.appendChild(disclaimer);
  mapCol.appendChild(mapContainer);

  // Stats summary above layout (centered, full width)
  const totalStations = allLines.reduce((sum, l) => sum + l.stations.length, 0);
  const totalUnlocked = allLines.reduce((sum, l) => sum + unlockSets[l.id].size, 0);
  const summaryEl = el('div', { className: 'text-center text-secondary text-sm', style: 'margin-bottom:var(--sp-xs);' });
  summaryEl.appendChild(triText('mrt.stationsUnlocked',
    `${totalUnlocked} of ${totalStations} stations unlocked`,
    totalUnlocked, totalStations));
  container.appendChild(summaryEl);

  layout.appendChild(mapCol);
  layout.appendChild(sidebar);
  container.appendChild(layout);
}

// ─── Hawker Tab Content ───

function renderHawkerContent(container, ctx) {
  const { topicQuestionCounts } = ctx;

  // Progress summary
  const unlockedIds = RecordStore.getHawkerCollection();
  const total = HAWKER_DISHES.length;
  const unlocked = unlockedIds.length;
  const progressEl = el('div', { className: 'text-center mt-md mb-sm' });
  const progressBar = el('div', { className: 'hawker-progress' });
  const progressFill = el('div', { className: 'hawker-progress__fill' });
  progressFill.style.width = `${total ? Math.round(unlocked / total * 100) : 0}%`;
  progressBar.appendChild(progressFill);
  progressEl.appendChild(progressBar);
  const progressLabel = el('div', { className: 'text-sm text-secondary mt-xs' });
  progressLabel.appendChild(triContent(
    `${unlocked} / ${total} dishes collected`,
    `${unlocked} / ${total} 品コレクト済み`,
  ));
  progressEl.appendChild(progressLabel);
  container.appendChild(progressEl);

  // Grid
  const seenIds = JSON.parse(sessionStorage.getItem('sg_broker_hawker_seen') || '[]');
  const topicStats = RecordStore.getTopicStats();
  const grid = el('div', { className: 'hawker-grid' });
  for (const dish of HAWKER_DISHES) {
    const isUnlocked = unlockedIds.includes(dish.id);
    const isNew = isUnlocked && !seenIds.includes(dish.id);
    const cls = isUnlocked
      ? `hawker-item${isNew ? ' hawker-item--just-unlocked' : ''}`
      : 'hawker-item hawker-item--locked';
    const item = el('div', { className: cls });
    if (isUnlocked) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(dish.name + ' Singapore hawker')}`, '_blank', 'noopener');
      });
    } else {
      item.setAttribute('tabindex', '0');
    }
    item.appendChild(el('span', { className: 'hawker-item__icon' }, dish.icon));
    const nameEl = el('div', { style: 'flex:1;' });
    if (isUnlocked) {
      const dishNameWrap = el('div');
      dishNameWrap.appendChild(triContent(dish.name, dish.nameJa));
      nameEl.appendChild(dishNameWrap);
    } else {
      nameEl.appendChild(el('div', {}, '???'));
      const hintEl = el('div', { className: 'hawker-unlock-hint' });
      const topicKey = Object.keys(topicQuestionCounts).find(k => k.endsWith(`::${dish.topic}`));
      const totalForTopic = topicKey ? topicQuestionCounts[topicKey] : 0;
      const stats = topicKey ? topicStats[topicKey] : null;
      const uc = stats ? (stats.uniqueCorrect || 0) : 0;
      const enHint = `Master "${dish.topic}" — ${uc}/${totalForTopic} unique correct`;
      const jaHint = `「${dish.topic}」全問正解で解放 — ${uc}/${totalForTopic}問`;
      hintEl.appendChild(triContent(enHint, jaHint));
      nameEl.appendChild(hintEl);
    }
    if (isUnlocked && dish.desc) {
      const descWrap = el('div', { className: 'text-sm text-secondary', style: 'font-size:0.7rem;line-height:1.3;' });
      descWrap.appendChild(triContent(dish.desc, dish.descJa));
      nameEl.appendChild(descWrap);
    }
    item.appendChild(nameEl);
    grid.appendChild(item);
  }
  container.appendChild(grid);
  sessionStorage.setItem('sg_broker_hawker_seen', JSON.stringify(unlockedIds));
}

// ─── Interchange markers ───

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
      const done = new Set();
      g.forEach(s => {
        const k = `${s.x},${s.y}`;
        if (done.has(k)) return;
        done.add(k);
        svg.appendChild(svgEl('circle', {
          cx: s.x, cy: s.y, r: String(IC_RING_R),
          fill: 'none', stroke: '#fff',
          'stroke-width': '1.5', opacity: '0.6',
        }));
      });
    } else if (maxD > 0) {
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len, ny = dx / len;
      const r = IC_RING_R;
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
      svg.appendChild(svgEl('circle', {
        cx: g[0].x, cy: g[0].y, r: String(IC_RING_R),
        fill: 'none', stroke: '#fff',
        'stroke-width': '1.5', opacity: '0.6',
      }));
    }
  }
}

function lineRow(color, line, unlockedStations, totalQ, uniqueCorrect, isBonus) {
  const row = el('div', { className: 'mrt-line-row' });
  const header = el('div', { className: 'mrt-line-row__header' });
  header.appendChild(el('span', { className: 'mrt-line-row__dot', style: `background:${color};` }));
  const nameSpan = el('span', { className: 'mrt-line-row__name' });
  const enName = isBonus ? line.name : `${line.name} (${moduleLabel(line.module)})`;
  const jaName = isBonus ? (line.nameJa || line.name) : `${line.nameJa || line.name} (${moduleLabel(line.module)})`;
  nameSpan.appendChild(triContent(enName, jaName));
  header.appendChild(nameSpan);
  row.appendChild(header);
  const stats = el('div', { className: 'mrt-line-row__stats' });
  const stPct = line.stations.length ? Math.round(unlockedStations / line.stations.length * 100) : 0;
  const stationStat = el('span');
  stationStat.textContent = `🚉 ${unlockedStations}/${line.stations.length} (${stPct}%)`;
  stats.appendChild(stationStat);
  const qPct = totalQ ? Math.round(uniqueCorrect / totalQ * 100) : 0;
  const qStat = el('span');
  qStat.textContent = `✅ ${uniqueCorrect}/${totalQ} (${qPct}%)`;
  stats.appendChild(qStat);
  row.appendChild(stats);
  return row;
}

// ─── Station Info Bottom Sheet ───

const LINE_COLORS = {};
for (const ml of ALL_MRT_LINES) {
  for (const s of ml.stations) LINE_COLORS[s.code] = ml.color;
  if (ml.extension) for (const s of ml.extension) LINE_COLORS[s.code] = ml.color;
}

// ─── Hover badge tooltip ───
let badgeEl = null;
let badgePinned = false;

function showStationBadge(station, mapContainer) {
  if (badgePinned) return;  // don't replace pinned badge on hover
  _renderBadge(station, mapContainer);
}

function pinStationBadge(station, mapContainer) {
  // If badge already showing for this station, just pin it — no re-render flicker
  if (badgeEl && badgeEl._stationName === station.name) {
    badgePinned = true;
    return;
  }
  _renderBadge(station, mapContainer);
  badgePinned = true;
}

function unpinStationBadge() {
  badgePinned = false;
  hideStationBadge();
}

function _renderBadge(station, mapContainer) {
  if (badgeEl && badgeEl._stationName === station.name) return;  // already showing
  if (badgeEl) { badgeEl.remove(); badgeEl = null; }
  const codes = [];
  for (const arr of ALL_STATIONS) {
    for (const s of arr) {
      if (s.name === station.name && !codes.includes(s.code)) codes.push(s.code);
    }
  }
  codes.sort((a, b) => (findCoord(a)?.x || 0) - (findCoord(b)?.x || 0));
  if (!codes.length) return;

  badgeEl = el('div', { className: 'mrt-hover-badge' });
  badgeEl._stationName = station.name;
  for (const code of codes) {
    const badge = el('span', { className: 'station-sheet__code' });
    badge.style.background = LINE_COLORS[code] || '#666';
    badge.textContent = code;
    badgeEl.appendChild(badge);
  }

  const svgNode = mapContainer.querySelector('svg');
  if (!svgNode) return;
  const svgRect = svgNode.getBoundingClientRect();
  const containerRect = mapContainer.getBoundingClientRect();
  const offsetX = svgRect.left - containerRect.left;
  const offsetY = svgRect.top - containerRect.top;
  const scaleX = svgRect.width / VIEW_W;
  const scaleY = svgRect.height / VIEW_H;
  badgeEl.style.left = `${offsetX + station.x * scaleX}px`;
  badgeEl.style.top = `${offsetY + station.y * scaleY - 4}px`;
  mapContainer.appendChild(badgeEl);
}

function hideStationBadge() {
  if (badgeEl) { badgeEl.remove(); badgeEl = null; }
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
  let startY = 0;
  sheetEl.querySelector('.station-sheet__handle').addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });
  sheetEl.querySelector('.station-sheet__handle').addEventListener('touchmove', (e) => {
    const dy = e.touches[0].clientY - startY;
    if (dy > 60) closeStationSheet();
  });
}

function openStationSheet(station, isDark, isUnlocked = true) {
  ensureSheetDOM();
  const codes = [];
  for (const arr of ALL_STATIONS) {
    for (const s of arr) {
      if (s.name === station.name && !codes.includes(s.code)) codes.push(s.code);
    }
  }
  codes.sort((a, b) => (findCoord(a)?.x || 0) - (findCoord(b)?.x || 0));
  const codesEl = sheetEl.querySelector('#ss-codes');
  codesEl.innerHTML = '';
  for (const code of codes) {
    const badge = el('span', { className: 'station-sheet__code' });
    badge.style.background = LINE_COLORS[code] || '#666';
    badge.textContent = code;
    codesEl.appendChild(badge);
  }
  sheetEl.querySelector('#ss-name').textContent = station.name;
  const info = getStationInfo(station.name);
  const taglineEl = sheetEl.querySelector('#ss-tagline');
  const bodyEl = sheetEl.querySelector('#ss-body');
  const spotsEl = sheetEl.querySelector('#ss-spots');
  const mapLinkEl = sheetEl.querySelector('#ss-map-link');
  const placeholderEl = sheetEl.querySelector('#ss-placeholder');

  // Locked stations: show only name + Google Maps link
  if (!isUnlocked) {
    taglineEl.style.display = 'none';
    bodyEl.style.display = 'none';
    spotsEl.style.display = 'none';
    spotsEl.innerHTML = '';
    placeholderEl.textContent = '🔒 駅をアンロックすると詳細が表示されます';
    placeholderEl.style.display = '';
  } else {
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
    if (!info || !info.body) {
      placeholderEl.textContent = 'Coming soon...';
      placeholderEl.style.display = '';
    } else {
      placeholderEl.style.display = 'none';
    }
  }

  // Google Maps link (always shown)
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

  backdropEl.classList.add('is-open');
  sheetEl.classList.add('is-open');
}

function closeStationSheet() {
  if (sheetEl) sheetEl.classList.remove('is-open');
  if (backdropEl) backdropEl.classList.remove('is-open');
  unpinStationBadge();
}
