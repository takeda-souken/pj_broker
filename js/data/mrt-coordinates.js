/**
 * MRT station coordinates for all 6 lines.
 * Derived from MRT.csv grid data (user-created schematic mapping).
 * ViewBox: 750 × 520
 *
 * Interchange stations share approximate (x, y) across lines.
 * Each station: { code, name, x, y, interchange?: string[] }
 */

// ─── NS Line (Red) ── North-South Line ─────────────────────────
// Inverted-J shape: Jurong East (SW) → up to Kranji → right to Yishun → south to Marina South Pier
export const NS_COORDS = [
  { code: 'NS1', name: 'Jurong East', x: 101, y: 330, interchange: ['EW24'] },
  { code: 'NS2', name: 'Bukit Batok', x: 109, y: 277 },
  { code: 'NS3', name: 'Bukit Gombak', x: 109, y: 239 },
  { code: 'NS4', name: 'Choa Chu Kang', x: 109, y: 194 },
  { code: 'NS5', name: 'Yew Tee', x: 109, y: 149 },
  // NS6 does not exist
  { code: 'NS7', name: 'Kranji', x: 109, y: 107 },
  { code: 'NS8', name: 'Marsiling', x: 133, y: 54 },
  { code: 'NS9', name: 'Woodlands', x: 187, y: 46, interchange: ['TE2'] },
  { code: 'NS10', name: 'Admiralty', x: 233, y: 46 },
  { code: 'NS11', name: 'Sembawang', x: 268, y: 46 },
  { code: 'NS12', name: 'Canberra', x: 303, y: 46 },
  { code: 'NS13', name: 'Yishun', x: 342, y: 58 },
  { code: 'NS14', name: 'Khatib', x: 361, y: 80 },
  { code: 'NS15', name: 'Yio Chu Kang', x: 365, y: 107 },
  { code: 'NS16', name: 'Ang Mo Kio', x: 365, y: 133 },
  { code: 'NS17', name: 'Bishan', x: 365, y: 164, interchange: ['CC15'] },
  { code: 'NS18', name: 'Braddell', x: 365, y: 183 },
  { code: 'NS19', name: 'Toa Payoh', x: 365, y: 205 },
  { code: 'NS20', name: 'Novena', x: 350, y: 235 },
  { code: 'NS21', name: 'Newton', x: 327, y: 258, interchange: ['DT11'] },
  { code: 'NS22', name: 'Orchard', x: 303, y: 296, interchange: ['TE14'] },
  { code: 'NS23', name: 'Somerset', x: 338, y: 322 },
  { code: 'NS24', name: 'Dhoby Ghaut', x: 354, y: 353, interchange: ['NE6', 'CC1'] },
  { code: 'NS25', name: 'City Hall', x: 417, y: 413, interchange: ['EW13'] },
  { code: 'NS26', name: 'Raffles Place', x: 417, y: 444, interchange: ['EW14'] },
  { code: 'NS27', name: 'Marina Bay', x: 417, y: 485, interchange: ['CE2', 'TE20'] },
  { code: 'NS28', name: 'Marina South Pier', x: 451, y: 500 },
];

// ─── EW Line (Green) ── East-West Line ─────────────────────────
// Pasir Ris (E) → diagonal SW to City Hall → south dip → west to Jurong East → SW to Tuas Link
export const EW_COORDS = [
  { code: 'EW1', name: 'Pasir Ris', x: 701, y: 164 },
  { code: 'EW2', name: 'Tampines', x: 701, y: 194, interchange: ['DT32'] },
  { code: 'EW3', name: 'Simei', x: 697, y: 211 },
  { code: 'EW4', name: 'Tanah Merah', x: 680, y: 224 },
  { code: 'EW5', name: 'Bedok', x: 633, y: 224 },
  { code: 'EW6', name: 'Kembangan', x: 576, y: 247 },
  { code: 'EW7', name: 'Eunos', x: 554, y: 269 },
  { code: 'EW8', name: 'Paya Lebar', x: 527, y: 296, interchange: ['CC9'] },
  { code: 'EW9', name: 'Aljunied', x: 508, y: 315 },
  { code: 'EW10', name: 'Kallang', x: 489, y: 334 },
  { code: 'EW11', name: 'Lavender', x: 470, y: 353 },
  { code: 'EW12', name: 'Bugis', x: 455, y: 368, interchange: ['DT14'] },
  { code: 'EW13', name: 'City Hall', x: 423, y: 413, interchange: ['NS25'] },
  { code: 'EW14', name: 'Raffles Place', x: 423, y: 444, interchange: ['NS26'] },
  { code: 'EW15', name: 'Tanjong Pagar', x: 342, y: 444 },
  { code: 'EW16', name: 'Outram Park', x: 313, y: 421, interchange: ['NE3', 'TE17'] },
  { code: 'EW17', name: 'Tiong Bahru', x: 296, y: 398 },
  { code: 'EW18', name: 'Redhill', x: 277, y: 379 },
  { code: 'EW19', name: 'Queenstown', x: 258, y: 360 },
  { code: 'EW20', name: 'Commonwealth', x: 243, y: 345 },
  { code: 'EW21', name: 'Buona Vista', x: 214, y: 330, interchange: ['CC22'] },
  { code: 'EW22', name: 'Dover', x: 175, y: 330 },
  { code: 'EW23', name: 'Clementi', x: 148, y: 330 },
  { code: 'EW24', name: 'Jurong East', x: 117, y: 330, interchange: ['NS1'] },
  { code: 'EW25', name: 'Chinese Garden', x: 78, y: 330 },
  { code: 'EW26', name: 'Lakeside', x: 47, y: 330 },
  { code: 'EW27', name: 'Boon Lay', x: 20, y: 300 },
  { code: 'EW28', name: 'Pioneer', x: 20, y: 277 },
  { code: 'EW29', name: 'Joo Koon', x: 20, y: 254 },
  { code: 'EW30', name: 'Gul Circle', x: 20, y: 232 },
  { code: 'EW31', name: 'Tuas Crescent', x: 20, y: 209 },
  { code: 'EW32', name: 'Tuas West Road', x: 20, y: 186 },
  { code: 'EW33', name: 'Tuas Link', x: 20, y: 164 },
];

// ─── NE Line (Purple) ── North East Line ───────────────────────
// HarbourFront (S) → diagonal NE to Punggol
export const NE_COORDS = [
  { code: 'NE1', name: 'HarbourFront', x: 332, y: 481, interchange: ['CC29'] },
  { code: 'NE3', name: 'Outram Park', x: 313, y: 421, interchange: ['EW16', 'TE17'] },
  { code: 'NE4', name: 'Chinatown', x: 350, y: 394, interchange: ['DT19'] },
  { code: 'NE5', name: 'Clarke Quay', x: 358, y: 379 },
  { code: 'NE6', name: 'Dhoby Ghaut', x: 369, y: 353, interchange: ['NS24', 'CC1'] },
  { code: 'NE7', name: 'Little India', x: 392, y: 303, interchange: ['DT12'] },
  { code: 'NE8', name: 'Farrer Park', x: 392, y: 277 },
  { code: 'NE9', name: 'Boon Keng', x: 392, y: 254 },
  { code: 'NE10', name: 'Potong Pasir', x: 406, y: 228 },
  { code: 'NE11', name: 'Woodleigh', x: 429, y: 205 },
  { code: 'NE12', name: 'Serangoon', x: 451, y: 183, interchange: ['CC13'] },
  { code: 'NE13', name: 'Kovan', x: 470, y: 164 },
  { code: 'NE14', name: 'Hougang', x: 489, y: 145 },
  { code: 'NE15', name: 'Buangkok', x: 508, y: 126 },
  { code: 'NE16', name: 'Sengkang', x: 523, y: 111 },
  { code: 'NE17', name: 'Punggol', x: 538, y: 96 },
];

// ─── CC Line (Orange) ── Circle Line ───────────────────────────
// Dhoby Ghaut → clockwise → Promenade → Paya Lebar → Serangoon →
//       Bishan → Botanic Gardens → Buona Vista → HarbourFront (no loop)
export const CC_COORDS = [
  { code: 'CC1', name: 'Dhoby Ghaut', x: 385, y: 353, interchange: ['NS24', 'NE6'] },
  { code: 'CC2', name: 'Bras Basah', x: 423, y: 379 },
  { code: 'CC3', name: 'Esplanade', x: 462, y: 417 },
  { code: 'CC4', name: 'Promenade', x: 516, y: 430, interchange: ['DT15'] },
  { code: 'CC5', name: 'Nicoll Highway', x: 536, y: 402 },
  { code: 'CC6', name: 'Stadium', x: 544, y: 379 },
  { code: 'CC7', name: 'Mountbatten', x: 548, y: 353 },
  { code: 'CC8', name: 'Dakota', x: 548, y: 326 },
  { code: 'CC9', name: 'Paya Lebar', x: 527, y: 296, interchange: ['EW8'] },
  { code: 'CC10', name: 'MacPherson', x: 540, y: 258, interchange: ['DT26'] },
  { code: 'CC11', name: 'Tai Seng', x: 513, y: 228 },
  { code: 'CC12', name: 'Bartley', x: 489, y: 204 },
  { code: 'CC13', name: 'Serangoon', x: 457, y: 182, interchange: ['NE12'] },
  { code: 'CC14', name: 'Lorong Chuan', x: 416, y: 167 },
  { code: 'CC15', name: 'Bishan', x: 365, y: 164, interchange: ['NS17'] },
  { code: 'CC16', name: 'Marymount', x: 324, y: 172 },
  { code: 'CC17', name: 'Caldecott', x: 284, y: 186, interchange: ['TE9'] },
  // CC18 (Bukit Brown) — not built
  { code: 'CC19', name: 'Botanic Gardens', x: 230, y: 232, interchange: ['DT9'] },
  { code: 'CC20', name: 'Farrer Road', x: 217, y: 264 },
  { code: 'CC21', name: 'Holland Village', x: 209, y: 292 },
  { code: 'CC22', name: 'Buona Vista', x: 198, y: 330, interchange: ['EW21'] },
  { code: 'CC23', name: 'one-north', x: 206, y: 354 },
  { code: 'CC24', name: 'Kent Ridge', x: 212, y: 377 },
  { code: 'CC25', name: 'Haw Par Villa', x: 221, y: 399 },
  { code: 'CC26', name: 'Pasir Panjang', x: 233, y: 421 },
  { code: 'CC27', name: 'Labrador Park', x: 252, y: 443 },
  { code: 'CC28', name: 'Telok Blangah', x: 285, y: 465 },
  { code: 'CC29', name: 'HarbourFront', x: 332, y: 481, interchange: ['NE1'] },
];

// Circle Extension (CE): branches from Promenade (CC4)
export const CE_COORDS = [
  { code: 'CE1', name: 'Bayfront', x: 495, y: 457, interchange: ['DT16'] },
  { code: 'CE2', name: 'Marina Bay', x: 417, y: 485, interchange: ['NS27', 'TE20'] },
];

// ─── DT Line (Blue) ── Downtown Line ───────────────────────────
// Bukit Panjang (NW) → SE through center → downtown loop → NE to MacPherson → E to Expo
export const DT_COORDS = [
  { code: 'DT1', name: 'Bukit Panjang', x: 171, y: 118 },
  { code: 'DT2', name: 'Cashew', x: 171, y: 137 },
  { code: 'DT3', name: 'Hillview', x: 171, y: 156 },
  // DT4 does not exist
  { code: 'DT5', name: 'Beauty World', x: 171, y: 175 },
  { code: 'DT6', name: 'King Albert Park', x: 171, y: 194 },
  { code: 'DT7', name: 'Sixth Avenue', x: 171, y: 213 },
  { code: 'DT8', name: 'Tan Kah Kee', x: 195, y: 232 },
  { code: 'DT9', name: 'Botanic Gardens', x: 245, y: 232, interchange: ['CC19'] },
  { code: 'DT10', name: 'Stevens', x: 284, y: 232, interchange: ['TE11'] },
  { code: 'DT11', name: 'Newton', x: 346, y: 258, interchange: ['NS21'] },
  { code: 'DT12', name: 'Little India', x: 392, y: 303, interchange: ['NE7'] },
  { code: 'DT13', name: 'Rochor', x: 420, y: 326 },
  { code: 'DT14', name: 'Bugis', x: 471, y: 368, interchange: ['EW12'] },
  { code: 'DT15', name: 'Promenade', x: 511, y: 430, interchange: ['CC4'] },
  { code: 'DT16', name: 'Bayfront', x: 482, y: 457, interchange: ['CE1'] },
  { code: 'DT17', name: 'Downtown', x: 443, y: 470 },
  { code: 'DT18', name: 'Telok Ayer', x: 396, y: 440 },
  { code: 'DT19', name: 'Chinatown', x: 350, y: 394, interchange: ['NE4'] },
  { code: 'DT20', name: 'Fort Canning', x: 342, y: 364 },
  { code: 'DT21', name: 'Bencoolen', x: 431, y: 356 },
  { code: 'DT22', name: 'Jalan Besar', x: 455, y: 334 },
  { code: 'DT23', name: 'Bendemeer', x: 478, y: 311 },
  { code: 'DT24', name: 'Geylang Bahru', x: 497, y: 292 },
  { code: 'DT25', name: 'Mattar', x: 517, y: 273 },
  { code: 'DT26', name: 'MacPherson', x: 524, y: 258, interchange: ['CC10'] },
  { code: 'DT27', name: 'Ubi', x: 555, y: 235 },
  { code: 'DT28', name: 'Kaki Bukit', x: 575, y: 217 },
  { code: 'DT29', name: 'Bedok North', x: 594, y: 198 },
  { code: 'DT30', name: 'Bedok Reservoir', x: 629, y: 194 },
  { code: 'DT31', name: 'Tampines West', x: 664, y: 194 },
  { code: 'DT32', name: 'Tampines', x: 701, y: 194, interchange: ['EW2'] },
  { code: 'DT33', name: 'Tampines East', x: 730, y: 209 },
  { code: 'DT34', name: 'Upper Changi', x: 730, y: 224 },
  { code: 'DT35', name: 'Expo', x: 730, y: 251 },
];

// ─── TE Line (Brown) ── Thomson-East Coast Line ────────────────
// Woodlands North (N) → south through center → Orchard → Marina Bay → east coast
export const TE_COORDS = [
  { code: 'TE1', name: 'Woodlands North', x: 176, y: 20 },
  { code: 'TE2', name: 'Woodlands', x: 202, y: 46, interchange: ['NS9'] },
  { code: 'TE3', name: 'Woodlands South', x: 221, y: 65 },
  { code: 'TE4', name: 'Springleaf', x: 236, y: 80 },
  { code: 'TE5', name: 'Lentor', x: 251, y: 95 },
  { code: 'TE6', name: 'Mayflower', x: 267, y: 111 },
  { code: 'TE7', name: 'Bright Hill', x: 285, y: 129 },
  { code: 'TE8', name: 'Upper Thomson', x: 299, y: 160 },
  { code: 'TE9', name: 'Caldecott', x: 299, y: 186, interchange: ['CC17'] },
  // TE10 (Mount Pleasant) — not yet built
  { code: 'TE11', name: 'Stevens', x: 299, y: 232, interchange: ['DT10'] },
  { code: 'TE12', name: 'Napier', x: 292, y: 254 },
  { code: 'TE13', name: 'Orchard Boulevard', x: 292, y: 273 },
  { code: 'TE14', name: 'Orchard', x: 292, y: 296, interchange: ['NS22'] },
  { code: 'TE15', name: 'Great World', x: 292, y: 319 },
  { code: 'TE16', name: 'Havelock', x: 292, y: 341 },
  { code: 'TE17', name: 'Outram Park', x: 313, y: 421, interchange: ['EW16', 'NE3'] },
  { code: 'TE18', name: 'Maxwell', x: 367, y: 444 },
  { code: 'TE19', name: 'Shenton Way', x: 389, y: 466 },
  { code: 'TE20', name: 'Marina Bay', x: 417, y: 485, interchange: ['NS27', 'CE2'] },
  // TE21 does not exist
  { code: 'TE22', name: 'Gardens by the Bay', x: 540, y: 458 },
];

// ─── Line metadata ─────────────────────────────────────────────
export const ALL_MRT_LINES = [
  {
    id: 'ns',
    name: 'North-South Line',
    nameJa: '南北線（NS）',
    color: '#e4002b',
    darkColor: '#ff4060',
    stations: NS_COORDS,
  },
  {
    id: 'ew',
    name: 'East-West Line',
    nameJa: '東西線（EW）',
    color: '#009645',
    darkColor: '#30c060',
    stations: EW_COORDS,
  },
  {
    id: 'ne',
    name: 'North East Line',
    nameJa: '北東線（NE）',
    color: '#9016b2',
    darkColor: '#b850d8',
    stations: NE_COORDS,
  },
  {
    id: 'cc',
    name: 'Circle Line',
    nameJa: '環状線（CC）',
    color: '#fa9e0d',
    darkColor: '#ffc040',
    stations: CC_COORDS,
    extension: CE_COORDS,  // CE branch from Promenade
    loop: false,
  },
  {
    id: 'dt',
    name: 'Downtown Line',
    nameJa: 'ダウンタウン線（DT）',
    color: '#005ec4',
    darkColor: '#4090f0',
    stations: DT_COORDS,
  },
  {
    id: 'te',
    name: 'Thomson-East Coast Line',
    nameJa: 'トムソン・イーストコースト線（TE）',
    color: '#9d5b25',
    darkColor: '#c88040',
    stations: TE_COORDS,
  },
];

// ─── Summary ───────────────────────────────────────────────────
// NS: 27 stations (NS1–NS28, no NS6)
// EW: 33 stations (EW1–EW33)
// NE: 16 stations (NE1, NE3–NE17, no NE2)
// CC: 28 stations (CC1–CC29, no CC18) + 2 CE extension
// DT: 34 stations (DT1–DT35, no DT4)
// TE: 20 stations (TE1–TE22, no TE10, TE21; TE23–TE29 not shown)
// Total: 160 stations (many shared via interchange)
