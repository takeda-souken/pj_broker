/**
 * Hawker collection data
 * Each dish is unlocked when a topic is mastered.
 */
export const HAWKER_DISHES = [
  { id: 'chicken-rice', name: 'Chicken Rice', icon: '\ud83c\udf5a', topic: 'Property Insurance', desc: 'Fragrant poached chicken with seasoned rice. The national dish.' },
  { id: 'laksa', name: 'Laksa', icon: '\ud83c\udf5c', topic: 'Business Interruption Insurance', desc: 'Spicy coconut curry noodle soup with prawns and fish cake.' },
  { id: 'chili-crab', name: 'Chili Crab', icon: '\ud83e\udd80', topic: 'Liability & Contingency Insurance', desc: 'Sweet-spicy tomato chili sauce with fresh mud crab. Eat with mantou buns.' },
  { id: 'kaya-toast', name: 'Kaya Toast', icon: '\ud83c\udf5e', topic: 'The Insurance Market', desc: 'Crispy toast with coconut egg jam & butter. The classic breakfast.' },
  { id: 'satay', name: 'Satay', icon: '\ud83c\udf62', topic: 'Commercial Motor Insurance', desc: 'Grilled meat skewers with peanut sauce. Best at Lau Pa Sat.' },
  { id: 'roti-prata', name: 'Roti Prata', icon: '\ud83e\udd5e', topic: 'Marine & Aviation Insurance', desc: 'Crispy flaky Indian flatbread. Perfect with curry dipping sauce.' },
  { id: 'bak-kut-teh', name: 'Bak Kut Teh', icon: '\ud83c\udf72', topic: 'Construction & Machinery Insurance', desc: 'Peppery pork rib soup with garlic and herbs. Comfort food.' },
  { id: 'char-kway-teow', name: 'Char Kway Teow', icon: '\ud83c\udf5d', topic: 'Pecuniary Insurance', desc: 'Wok-fried flat rice noodles with prawns, cockles, and egg.' },
  { id: 'hokkien-mee', name: 'Hokkien Mee', icon: '\ud83c\udf5c', topic: 'Foreign Worker Insurance', desc: 'Stir-fried egg noodles with prawns in rich prawn stock.' },
  { id: 'ice-kachang', name: 'Ice Kachang', icon: '\ud83c\udf67', topic: 'Group PA & Corporate Travel', desc: 'Shaved ice mountain with red beans, jelly, and sweet syrups.' },
  { id: 'nasi-lemak', name: 'Nasi Lemak', icon: '\ud83c\udf5b', topic: 'Risks & Insurance Principles', desc: 'Coconut rice with sambal, fried fish, peanuts, and egg.' },
  { id: 'mee-goreng', name: 'Mee Goreng', icon: '\ud83c\udf5d', topic: 'Regulatory Landscape', desc: 'Spicy stir-fried Indian-style noodles with vegetables and egg.' },
  { id: 'fish-head-curry', name: 'Fish Head Curry', icon: '\ud83c\udf5b', topic: 'Law of Contract & Agency', desc: 'A whole red snapper head in tangy curry. Uniquely Singaporean.' },
  { id: 'carrot-cake', name: 'Carrot Cake', icon: '\ud83e\uddc0', topic: 'Insurance Documents', desc: 'Not a dessert! Stir-fried radish cake with egg. Try "black" version.' },
  { id: 'teh-tarik', name: 'Teh Tarik', icon: '\ud83c\udf75', topic: 'Claims', desc: '"Pulled tea" \u2014 sweet milky tea poured from a height for frothiness.' },
  { id: 'ondeh-ondeh', name: 'Ondeh Ondeh', icon: '\ud83c\udf6a', topic: 'Reinsurance & Co-Insurance', desc: 'Pandan glutinous rice balls filled with melted palm sugar.' },
  { id: 'kueh-lapis', name: 'Kueh Lapis', icon: '\ud83c\udf70', topic: 'Ethics & Data Protection', desc: 'Colourful layered steamed cake. Each layer is painstakingly added.' },
];

export function getDishForTopic(topic) {
  return HAWKER_DISHES.find(d => d.topic === topic) || null;
}

export function getUnlockedDishes(masteredTopics) {
  return HAWKER_DISHES.filter(d => masteredTopics.includes(d.topic));
}
