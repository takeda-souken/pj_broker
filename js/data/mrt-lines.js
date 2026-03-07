/**
 * MRT map data — based on real Singapore MRT North-South and East-West lines.
 * BCP topics map to NS Line (Red), ComGI topics map to EW Line (Green).
 * City Hall is the interchange station connecting both lines.
 */

export const MRT_LINES = [
  {
    id: 'ns',
    module: 'bcp',
    name: 'North-South Line',
    color: '#e4002b',
    darkColor: '#ff4060',
    stations: [
      { code: 'NS16', name: 'Ang Mo Kio',       x: 200, y: 22,  topic: 'The Insurance Market' },
      { code: 'NS17', name: 'Bishan',            x: 200, y: 52,  topic: 'Regulatory Landscape', interchange: 'cc' },
      { code: 'NS21', name: 'Newton',            x: 212, y: 82,  topic: 'Risks & Insurance Principles' },
      { code: 'NS22', name: 'Orchard',           x: 222, y: 108, topic: 'Law of Contract & Agency' },
      { code: 'NS24', name: 'Dhoby Ghaut',       x: 232, y: 134, topic: 'Insurance Documents', interchange: 'ne' },
      { code: 'NS26', name: 'City Hall',         x: 244, y: 162, topic: null, interchange: 'ew' },
      { code: 'NS27', name: 'Raffles Place',     x: 250, y: 192, topic: 'Claims' },
      { code: 'NS27', name: 'Marina Bay',        x: 254, y: 222, topic: 'Reinsurance & Co-Insurance', interchange: 'cc' },
      { code: 'NS28', name: 'Marina South Pier', x: 256, y: 252, topic: 'Ethics & Data Protection' },
    ],
  },
  {
    id: 'ew',
    module: 'comgi',
    name: 'East-West Line',
    color: '#009645',
    darkColor: '#30c060',
    stations: [
      { code: 'EW24', name: 'Jurong East',   x: 30,  y: 202, topic: 'Group PA & Corporate Travel', interchange: 'ns' },
      { code: 'EW23', name: 'Clementi',       x: 68,  y: 192, topic: 'Foreign Worker Insurance' },
      { code: 'EW21', name: 'Buona Vista',    x: 108, y: 182, topic: 'Pecuniary Insurance', interchange: 'cc' },
      { code: 'EW16', name: 'Outram Park',    x: 152, y: 172, topic: 'Construction & Machinery Insurance', interchange: 'ne' },
      { code: 'EW15', name: 'Tanjong Pagar',  x: 196, y: 166, topic: 'Marine & Aviation Insurance' },
      { code: 'EW13', name: 'City Hall',      x: 244, y: 162, topic: null, interchange: 'ns' },
      { code: 'EW12', name: 'Bugis',          x: 296, y: 162, topic: 'Commercial Motor Insurance' },
      { code: 'EW8',  name: 'Paya Lebar',     x: 348, y: 162, topic: 'Liability & Contingency Insurance', interchange: 'cc' },
      { code: 'EW2',  name: 'Tampines',       x: 400, y: 162, topic: 'Business Interruption Insurance' },
      { code: 'EW1',  name: 'Pasir Ris',      x: 448, y: 162, topic: 'Property Insurance' },
    ],
  },
];

/**
 * Build a flat map: topic string → station info
 */
export function getTopicStationMap() {
  const map = {};
  for (const line of MRT_LINES) {
    for (const s of line.stations) {
      if (s.topic) {
        map[`${line.module}::${s.topic}`] = { ...s, lineId: line.id, lineColor: line.color };
      }
    }
  }
  return map;
}

export function getLineById(lineId) {
  return MRT_LINES.find(l => l.id === lineId);
}
