/**
 * MRT line definitions for progress visualization.
 * Each "station" = a topic in BCP or ComGI.
 * Line colors match actual Singapore MRT lines.
 */
export const MRT_LINES = [
  {
    id: 'bcp',
    name: 'BCP Line',
    color: 'var(--mrt-blue)',
    colorHex: '#005da2',
    stations: [
      { id: 'bcp-market', topic: 'The Insurance Market', code: 'BP1' },
      { id: 'bcp-regulatory', topic: 'Regulatory Landscape', code: 'BP2' },
      { id: 'bcp-risks', topic: 'Risks & Insurance Principles', code: 'BP3' },
      { id: 'bcp-contract', topic: 'Law of Contract & Agency', code: 'BP4' },
      { id: 'bcp-documents', topic: 'Insurance Documents', code: 'BP5' },
      { id: 'bcp-claims', topic: 'Claims', code: 'BP6' },
      { id: 'bcp-reinsurance', topic: 'Reinsurance & Co-Insurance', code: 'BP7' },
      { id: 'bcp-ethics', topic: 'Ethics & Data Protection', code: 'BP8' },
    ],
  },
  {
    id: 'comgi',
    name: 'ComGI Line',
    color: 'var(--mrt-red)',
    colorHex: '#e4002b',
    stations: [
      { id: 'comgi-property', topic: 'Property Insurance', code: 'CG1' },
      { id: 'comgi-bi', topic: 'Business Interruption Insurance', code: 'CG2' },
      { id: 'comgi-liability', topic: 'Liability & Contingency Insurance', code: 'CG3' },
      { id: 'comgi-motor', topic: 'Commercial Motor Insurance', code: 'CG4' },
      { id: 'comgi-marine', topic: 'Marine & Aviation Insurance', code: 'CG5' },
      { id: 'comgi-construction', topic: 'Construction & Machinery Insurance', code: 'CG6' },
      { id: 'comgi-pecuniary', topic: 'Pecuniary Insurance', code: 'CG7' },
      { id: 'comgi-worker', topic: 'Foreign Worker Insurance', code: 'CG8' },
      { id: 'comgi-pa', topic: 'Group PA & Corporate Travel', code: 'CG9' },
    ],
  },
];

export function getLineById(lineId) {
  return MRT_LINES.find(l => l.id === lineId);
}
