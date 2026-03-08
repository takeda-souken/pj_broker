/**
 * MRT map data — all real stations on NS and EW lines.
 * Stations unlock sequentially from City Hall outward based on study progress.
 * No topic-to-station mapping; unlock count = uniqueCorrect / totalQuestions * totalStations.
 *
 * NS Line: 27 stations (NS1–NS28, no NS6)
 * EW Line: 33 stations (EW1–EW33)
 * CC (Orange) = Circle Line geometric loop connecting interchanges.
 * NE (Purple) and DT (Blue) are decorative background lines.
 */

// --- NS Line: ordered NS1 (top) → NS28 (bottom) ---
export const NS_STATIONS = [
  { code: 'NS1',  name: 'Jurong East' },
  { code: 'NS2',  name: 'Bukit Batok' },
  { code: 'NS3',  name: 'Bukit Gombak' },
  { code: 'NS4',  name: 'Choa Chu Kang' },
  { code: 'NS5',  name: 'Yew Tee' },
  { code: 'NS7',  name: 'Kranji' },
  { code: 'NS8',  name: 'Marsiling' },
  { code: 'NS9',  name: 'Woodlands' },
  { code: 'NS10', name: 'Admiralty' },
  { code: 'NS11', name: 'Sembawang' },
  { code: 'NS12', name: 'Canberra' },
  { code: 'NS13', name: 'Yishun' },
  { code: 'NS14', name: 'Khatib' },
  { code: 'NS15', name: 'Yio Chu Kang' },
  { code: 'NS16', name: 'Ang Mo Kio' },
  { code: 'NS17', name: 'Bishan', interchange: 'cc' },
  { code: 'NS18', name: 'Braddell' },
  { code: 'NS19', name: 'Toa Payoh' },
  { code: 'NS20', name: 'Novena' },
  { code: 'NS21', name: 'Newton', interchange: 'dt' },
  { code: 'NS22', name: 'Orchard' },
  { code: 'NS23', name: 'Somerset' },
  { code: 'NS24', name: 'Dhoby Ghaut', interchange: 'ne' },
  { code: 'NS25', name: 'City Hall', interchange: 'ew' },
  { code: 'NS26', name: 'Raffles Place', interchange: 'ew' },
  { code: 'NS27', name: 'Marina Bay', interchange: 'cc' },
  { code: 'NS28', name: 'Marina South Pier' },
];

// --- EW Line: ordered EW1 (right/east) → EW33 (left/west) ---
export const EW_STATIONS = [
  { code: 'EW1',  name: 'Pasir Ris' },
  { code: 'EW2',  name: 'Tampines' },
  { code: 'EW3',  name: 'Simei' },
  { code: 'EW4',  name: 'Tanah Merah' },
  { code: 'EW5',  name: 'Bedok' },
  { code: 'EW6',  name: 'Kembangan' },
  { code: 'EW7',  name: 'Eunos' },
  { code: 'EW8',  name: 'Paya Lebar', interchange: 'cc' },
  { code: 'EW9',  name: 'Aljunied' },
  { code: 'EW10', name: 'Kallang' },
  { code: 'EW11', name: 'Lavender' },
  { code: 'EW12', name: 'Bugis', interchange: 'dt' },
  { code: 'EW13', name: 'City Hall', interchange: 'ns' },
  { code: 'EW14', name: 'Raffles Place', interchange: 'ns' },
  { code: 'EW15', name: 'Tanjong Pagar' },
  { code: 'EW16', name: 'Outram Park', interchange: 'ne' },
  { code: 'EW17', name: 'Tiong Bahru' },
  { code: 'EW18', name: 'Redhill' },
  { code: 'EW19', name: 'Queenstown' },
  { code: 'EW20', name: 'Commonwealth' },
  { code: 'EW21', name: 'Buona Vista', interchange: 'cc' },
  { code: 'EW22', name: 'Dover' },
  { code: 'EW23', name: 'Clementi' },
  { code: 'EW24', name: 'Jurong East', interchange: 'ns' },
  { code: 'EW25', name: 'Chinese Garden' },
  { code: 'EW26', name: 'Lakeside' },
  { code: 'EW27', name: 'Boon Lay' },
  { code: 'EW28', name: 'Pioneer' },
  { code: 'EW29', name: 'Joo Koon' },
  { code: 'EW30', name: 'Gul Circle' },
  { code: 'EW31', name: 'Tuas Crescent' },
  { code: 'EW32', name: 'Tuas West Road' },
  { code: 'EW33', name: 'Tuas Link' },
];

// City Hall indices (0-based)
export const NS_CITY_HALL = NS_STATIONS.findIndex(s => s.code === 'NS25'); // 23
export const EW_CITY_HALL = EW_STATIONS.findIndex(s => s.code === 'EW13'); // 12

/**
 * Build unlock order from City Hall outward, alternating directions.
 * NS: up (toward NS1) first, then down (toward NS28), alternating.
 * EW: east/right (toward EW1) first, then west/left (toward EW33), alternating.
 * City Hall itself is always unlocked (index 0 in the order).
 */
export function buildUnlockOrder(stations, cityHallIndex) {
  const order = [cityHallIndex];
  let up = cityHallIndex - 1;   // toward index 0
  let down = cityHallIndex + 1; // toward end
  let goUp = true;

  while (up >= 0 || down < stations.length) {
    if (goUp && up >= 0) {
      order.push(up--);
    } else if (!goUp && down < stations.length) {
      order.push(down++);
    } else if (up >= 0) {
      order.push(up--);
    } else if (down < stations.length) {
      order.push(down++);
    }
    goUp = !goUp;
  }
  return order;
}

// Pre-computed unlock orders
export const NS_UNLOCK_ORDER = buildUnlockOrder(NS_STATIONS, NS_CITY_HALL);
export const EW_UNLOCK_ORDER = buildUnlockOrder(EW_STATIONS, EW_CITY_HALL);

/**
 * MRT_LINES — used by mrt-view for rendering.
 * module field links to question bank for progress calculation.
 */
export const MRT_LINES = [
  {
    id: 'ns',
    module: 'bcp',
    name: 'North-South Line',
    color: '#e4002b',
    darkColor: '#ff4060',
    stations: NS_STATIONS,
    cityHallIndex: NS_CITY_HALL,
    unlockOrder: NS_UNLOCK_ORDER,
  },
  {
    id: 'ew',
    module: 'comgi',
    name: 'East-West Line',
    color: '#009645',
    darkColor: '#30c060',
    stations: EW_STATIONS,
    cityHallIndex: EW_CITY_HALL,
    unlockOrder: EW_UNLOCK_ORDER,
  },
];

/**
 * Circle Line — geometric loop connecting NS and EW at interchange stations.
 * Interchange rings light up when the corresponding NS/EW station is unlocked.
 */
export const CIRCLE_LINE = {
  id: 'cc',
  name: 'Circle Line',
  color: '#fa9e0d',
  darkColor: '#ffc040',
  loop: true,
  // Interchange station codes on NS/EW that CC connects to
  interchanges: ['NS17', 'EW21', 'EW8', 'NS27'],
};

/** Decorative lines — drawn in background for atmosphere, no functional tracking */
export const DECO_LINES = [
  {
    id: 'ne',
    name: 'North-East Line',
    color: '#9016b2',
    darkColor: '#b850d8',
  },
  {
    id: 'dt',
    name: 'Downtown Line',
    color: '#005ec4',
    darkColor: '#4090f0',
  },
];
