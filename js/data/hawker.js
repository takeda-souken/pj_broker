/**
 * Hawker collection data
 * Each dish is unlocked when a topic is mastered.
 */
export const HAWKER_DISHES = [
  { id: 'chicken-rice', name: 'Chicken Rice', icon: '\ud83c\udf5a', topic: 'Property Insurance' },
  { id: 'laksa', name: 'Laksa', icon: '\ud83c\udf5c', topic: 'Business Interruption Insurance' },
  { id: 'chili-crab', name: 'Chili Crab', icon: '\ud83e\udd80', topic: 'Liability & Contingency Insurance' },
  { id: 'kaya-toast', name: 'Kaya Toast', icon: '\ud83c\udf5e', topic: 'The Insurance Market' },
  { id: 'satay', name: 'Satay', icon: '\ud83c\udf62', topic: 'Commercial Motor Insurance' },
  { id: 'roti-prata', name: 'Roti Prata', icon: '\ud83e\udd5e', topic: 'Marine & Aviation Insurance' },
  { id: 'bak-kut-teh', name: 'Bak Kut Teh', icon: '\ud83c\udf72', topic: 'Construction & Machinery Insurance' },
  { id: 'char-kway-teow', name: 'Char Kway Teow', icon: '\ud83c\udf5d', topic: 'Pecuniary Insurance' },
  { id: 'hokkien-mee', name: 'Hokkien Mee', icon: '\ud83c\udf5c', topic: 'Foreign Worker Insurance' },
  { id: 'ice-kachang', name: 'Ice Kachang', icon: '\ud83c\udf67', topic: 'Group PA & Corporate Travel' },
  { id: 'nasi-lemak', name: 'Nasi Lemak', icon: '\ud83c\udf5b', topic: 'Risks & Insurance Principles' },
  { id: 'mee-goreng', name: 'Mee Goreng', icon: '\ud83c\udf5d', topic: 'Regulatory Landscape' },
  { id: 'fish-head-curry', name: 'Fish Head Curry', icon: '\ud83c\udf5b', topic: 'Law of Contract & Agency' },
  { id: 'carrot-cake', name: 'Carrot Cake', icon: '\ud83e\uddc0', topic: 'Insurance Documents' },
  { id: 'teh-tarik', name: 'Teh Tarik', icon: '\ud83c\udf75', topic: 'Claims' },
  { id: 'ondeh-ondeh', name: 'Ondeh Ondeh', icon: '\ud83c\udf6a', topic: 'Reinsurance & Co-Insurance' },
  { id: 'kueh-lapis', name: 'Kueh Lapis', icon: '\ud83c\udf70', topic: 'Ethics & Data Protection' },
];

export function getDishForTopic(topic) {
  return HAWKER_DISHES.find(d => d.topic === topic) || null;
}

export function getUnlockedDishes(masteredTopics) {
  return HAWKER_DISHES.filter(d => masteredTopics.includes(d.topic));
}
