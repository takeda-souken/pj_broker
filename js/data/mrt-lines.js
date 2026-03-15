/**
 * MRT map data — all functional lines (NS, EW, NE, DT).
 * Stations unlock sequentially from a central station outward based on study progress.
 * No topic-to-station mapping; unlock count = uniqueCorrect / totalQuestions * totalStations.
 *
 * NS Line (Red)   = BCP   — 27 stations (NS1–NS28, no NS6)
 * EW Line (Green)  = ComGI — 33 stations (EW1–EW33)
 * NE Line (Purple) = PGI   — 16 stations (NE1, NE3–NE17, no NE2)
 * DT Line (Blue)   = HI    — 32 stations (DT1–DT35, no DT4)
 *
 * CC (Orange) = Circle Line connecting interchanges across all functional lines.
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

// --- NE Line: ordered NE1 → NE17 (no NE2) ---
export const NE_STATIONS = [
  { code: 'NE1',  name: 'HarbourFront', interchange: 'cc' },
  { code: 'NE3',  name: 'Outram Park', interchange: 'ew' },
  { code: 'NE4',  name: 'Chinatown', interchange: 'dt' },
  { code: 'NE5',  name: 'Clarke Quay' },
  { code: 'NE6',  name: 'Dhoby Ghaut', interchange: 'ns' },
  { code: 'NE7',  name: 'Little India', interchange: 'dt' },
  { code: 'NE8',  name: 'Farrer Park' },
  { code: 'NE9',  name: 'Boon Keng' },
  { code: 'NE10', name: 'Potong Pasir' },
  { code: 'NE11', name: 'Woodleigh' },
  { code: 'NE12', name: 'Serangoon', interchange: 'cc' },
  { code: 'NE13', name: 'Kovan' },
  { code: 'NE14', name: 'Hougang' },
  { code: 'NE15', name: 'Buangkok' },
  { code: 'NE16', name: 'Sengkang' },
  { code: 'NE17', name: 'Punggol' },
];

// --- DT Line: ordered DT1 → DT35 (no DT4) ---
export const DT_STATIONS = [
  { code: 'DT1',  name: 'Bukit Panjang' },
  { code: 'DT2',  name: 'Cashew' },
  { code: 'DT3',  name: 'Hillview' },
  { code: 'DT5',  name: 'Beauty World' },
  { code: 'DT6',  name: 'King Albert Park' },
  { code: 'DT7',  name: 'Sixth Avenue' },
  { code: 'DT8',  name: 'Tan Kah Kee' },
  { code: 'DT9',  name: 'Botanic Gardens', interchange: 'cc' },
  { code: 'DT10', name: 'Stevens' },
  { code: 'DT11', name: 'Newton', interchange: 'ns' },
  { code: 'DT12', name: 'Little India', interchange: 'ne' },
  { code: 'DT13', name: 'Rochor' },
  { code: 'DT14', name: 'Bugis', interchange: 'ew' },
  { code: 'DT15', name: 'Promenade', interchange: 'cc' },
  { code: 'DT16', name: 'Bayfront' },
  { code: 'DT17', name: 'Downtown' },
  { code: 'DT18', name: 'Telok Ayer' },
  { code: 'DT19', name: 'Chinatown', interchange: 'ne' },
  { code: 'DT20', name: 'Fort Canning' },
  { code: 'DT21', name: 'Bencoolen' },
  { code: 'DT22', name: 'Jalan Besar' },
  { code: 'DT23', name: 'Bendemeer' },
  { code: 'DT24', name: 'Geylang Bahru' },
  { code: 'DT25', name: 'Mattar' },
  { code: 'DT26', name: 'MacPherson', interchange: 'cc' },
  { code: 'DT27', name: 'Ubi' },
  { code: 'DT28', name: 'Kaki Bukit' },
  { code: 'DT29', name: 'Bedok North' },
  { code: 'DT30', name: 'Bedok Reservoir' },
  { code: 'DT31', name: 'Tampines West' },
  { code: 'DT32', name: 'Tampines', interchange: 'ew' },
  { code: 'DT33', name: 'Tampines East' },
  { code: 'DT34', name: 'Upper Changi' },
  { code: 'DT35', name: 'Expo' },
];

// Central station indices (0-based) — unlock starts from these stations outward
export const NS_CITY_HALL = NS_STATIONS.findIndex(s => s.code === 'NS25'); // City Hall
export const EW_CITY_HALL = EW_STATIONS.findIndex(s => s.code === 'EW13'); // City Hall
export const NE_CENTER = NE_STATIONS.findIndex(s => s.code === 'NE6');     // Dhoby Ghaut
export const DT_CENTER = DT_STATIONS.findIndex(s => s.code === 'DT14');    // Bugis

/**
 * Build unlock order from a central station outward, alternating directions.
 * Central station itself is always unlocked (index 0 in the order).
 */
export function buildUnlockOrder(stations, centerIndex) {
  const order = [centerIndex];
  let up = centerIndex - 1;   // toward index 0
  let down = centerIndex + 1; // toward end
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
export const NE_UNLOCK_ORDER = buildUnlockOrder(NE_STATIONS, NE_CENTER);
export const DT_UNLOCK_ORDER = buildUnlockOrder(DT_STATIONS, DT_CENTER);

/**
 * MRT_LINES — used by mrt-view for rendering.
 * module field links to question bank for progress calculation.
 */
export const MRT_LINES = [
  {
    id: 'ns',
    module: 'bcp',
    name: 'North-South Line',
    nameJa: '南北線（NS）',
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
    nameJa: '東西線（EW）',
    color: '#009645',
    darkColor: '#30c060',
    stations: EW_STATIONS,
    cityHallIndex: EW_CITY_HALL,
    unlockOrder: EW_UNLOCK_ORDER,
  },
  {
    id: 'ne',
    module: 'pgi',
    name: 'North-East Line',
    nameJa: '北東線（NE）',
    color: '#9016b2',
    darkColor: '#b850d8',
    stations: NE_STATIONS,
    cityHallIndex: NE_CENTER,
    unlockOrder: NE_UNLOCK_ORDER,
  },
  {
    id: 'dt',
    module: 'hi',
    name: 'Downtown Line',
    nameJa: 'ダウンタウン線（DT）',
    color: '#005ec4',
    darkColor: '#4090f0',
    stations: DT_STATIONS,
    cityHallIndex: DT_CENTER,
    unlockOrder: DT_UNLOCK_ORDER,
  },
];

// --- CC Line: ordered CC1 → CC29 (no CC18) ---
export const CC_STATIONS = [
  { code: 'CC1',  name: 'Dhoby Ghaut', interchange: 'ns' },
  { code: 'CC2',  name: 'Bras Basah' },
  { code: 'CC3',  name: 'Esplanade' },
  { code: 'CC4',  name: 'Promenade', interchange: 'dt' },
  { code: 'CC5',  name: 'Nicoll Highway' },
  { code: 'CC6',  name: 'Stadium' },
  { code: 'CC7',  name: 'Mountbatten' },
  { code: 'CC8',  name: 'Dakota' },
  { code: 'CC9',  name: 'Paya Lebar', interchange: 'ew' },
  { code: 'CC10', name: 'MacPherson', interchange: 'dt' },
  { code: 'CC11', name: 'Tai Seng' },
  { code: 'CC12', name: 'Bartley' },
  { code: 'CC13', name: 'Serangoon', interchange: 'ne' },
  { code: 'CC14', name: 'Lorong Chuan' },
  { code: 'CC15', name: 'Bishan', interchange: 'ns' },
  { code: 'CC16', name: 'Marymount' },
  { code: 'CC17', name: 'Caldecott', interchange: 'te' },
  // CC18 (Bukit Brown) — not built
  { code: 'CC19', name: 'Botanic Gardens', interchange: 'dt' },
  { code: 'CC20', name: 'Farrer Road' },
  { code: 'CC21', name: 'Holland Village' },
  { code: 'CC22', name: 'Buona Vista', interchange: 'ew' },
  { code: 'CC23', name: 'one-north' },
  { code: 'CC24', name: 'Kent Ridge' },
  { code: 'CC25', name: 'Haw Par Villa' },
  { code: 'CC26', name: 'Pasir Panjang' },
  { code: 'CC27', name: 'Labrador Park' },
  { code: 'CC28', name: 'Telok Blangah' },
  { code: 'CC29', name: 'HarbourFront', interchange: 'ne' },
];

// --- TE Line: ordered TE1 → TE22 (no TE10, TE21) ---
export const TE_STATIONS = [
  { code: 'TE1',  name: 'Woodlands North' },
  { code: 'TE2',  name: 'Woodlands', interchange: 'ns' },
  { code: 'TE3',  name: 'Woodlands South' },
  { code: 'TE4',  name: 'Springleaf' },
  { code: 'TE5',  name: 'Lentor' },
  { code: 'TE6',  name: 'Mayflower' },
  { code: 'TE7',  name: 'Bright Hill' },
  { code: 'TE8',  name: 'Upper Thomson' },
  { code: 'TE9',  name: 'Caldecott', interchange: 'cc' },
  { code: 'TE11', name: 'Stevens', interchange: 'dt' },
  { code: 'TE12', name: 'Napier' },
  { code: 'TE13', name: 'Orchard Boulevard' },
  { code: 'TE14', name: 'Orchard', interchange: 'ns' },
  { code: 'TE15', name: 'Great World' },
  { code: 'TE16', name: 'Havelock' },
  { code: 'TE17', name: 'Outram Park', interchange: 'ew' },
  { code: 'TE18', name: 'Maxwell' },
  { code: 'TE19', name: 'Shenton Way' },
  { code: 'TE20', name: 'Marina Bay', interchange: 'ns' },
  { code: 'TE22', name: 'Gardens by the Bay' },
];

export const CC_CENTER = CC_STATIONS.findIndex(s => s.code === 'CC13');  // Serangoon
export const TE_CENTER = TE_STATIONS.findIndex(s => s.code === 'TE14'); // Orchard

export const CC_UNLOCK_ORDER = buildUnlockOrder(CC_STATIONS, CC_CENTER);
export const TE_UNLOCK_ORDER = buildUnlockOrder(TE_STATIONS, TE_CENTER);

/**
 * Circle Line — geometric loop connecting interchanges across all functional lines.
 * Interchange rings light up when the corresponding station is unlocked.
 */
export const CIRCLE_LINE = {
  id: 'cc',
  name: 'Circle Line',
  nameJa: '環状線（CC）',
  color: '#fa9e0d',
  darkColor: '#ffc040',
  loop: true,
  interchanges: ['NS17', 'EW21', 'EW8', 'NS27', 'NE1', 'NE12', 'DT9', 'DT15', 'DT26'],
};

/**
 * BONUS_LINES — CC and TE unlock based on aggregate progress across all 4 modules.
 * Uses sqrt curve for front-loaded early progress.
 */
export const BONUS_LINES = [
  {
    id: 'cc',
    name: 'Circle Line',
    nameJa: '環状線（CC）',
    color: '#fa9e0d',
    darkColor: '#ffc040',
    stations: CC_STATIONS,
    unlockOrder: CC_UNLOCK_ORDER,
  },
  {
    id: 'te',
    name: 'Thomson-East Coast Line',
    nameJa: 'トムソン・イーストコースト線（TE）',
    color: '#9d5b25',
    darkColor: '#c88040',
    stations: TE_STATIONS,
    unlockOrder: TE_UNLOCK_ORDER,
  },
];

/** Decorative lines — drawn in background for atmosphere, no functional tracking */
export const DECO_LINES = [];
