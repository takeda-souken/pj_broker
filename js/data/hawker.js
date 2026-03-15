/**
 * Hawker collection data
 * Each dish is unlocked when a topic is mastered.
 */
export const HAWKER_DISHES = [
  { id: 'chicken-rice', name: 'Chicken Rice', icon: '\ud83c\udf5a', topic: 'Property Insurance', desc: 'Fragrant poached chicken with seasoned rice. The national dish.' },
  { id: 'laksa', name: 'Laksa', icon: '\ud83c\udf5c', topic: 'Business Interruption Insurance', desc: 'Spicy coconut curry noodle soup with prawns and fish cake.' },
  { id: 'chili-crab', name: 'Chili Crab', icon: '\ud83e\udd80', topic: 'Liability & Contingency Insurance', desc: 'Sweet-spicy tomato chili sauce with fresh mud crab. Eat with mantou buns.' },
  { id: 'kaya-toast', name: 'Kaya Toast', icon: '\ud83c\udf5e', topic: 'The Insurance & Reinsurance Market', desc: 'Crispy toast with coconut egg jam & butter. The classic breakfast.' },
  { id: 'satay', name: 'Satay', icon: '\ud83c\udf62', topic: 'Commercial Motor Insurance', desc: 'Grilled meat skewers with peanut sauce. Best at Lau Pa Sat.' },
  { id: 'roti-prata', name: 'Roti Prata', icon: '\ud83e\udd5e', topic: 'Marine & Aviation Insurance', desc: 'Crispy flaky Indian flatbread. Perfect with curry dipping sauce.' },
  { id: 'bak-kut-teh', name: 'Bak Kut Teh', icon: '\ud83c\udf72', topic: 'Construction, Machinery & Bond Insurance', desc: 'Peppery pork rib soup with garlic and herbs. Comfort food.' },
  { id: 'char-kway-teow', name: 'Char Kway Teow', icon: '\ud83c\udf5d', topic: 'Pecuniary Insurance', desc: 'Wok-fried flat rice noodles with prawns, cockles, and egg.' },
  { id: 'hokkien-mee', name: 'Hokkien Mee', icon: '\ud83c\udf5c', topic: 'Foreign Worker Insurance', desc: 'Stir-fried egg noodles with prawns in rich prawn stock.' },
  { id: 'ice-kachang', name: 'Ice Kachang', icon: '\ud83c\udf67', topic: 'Group PA & Corporate Travel', desc: 'Shaved ice mountain with red beans, jelly, and sweet syrups.' },
  { id: 'nasi-lemak', name: 'Nasi Lemak', icon: '\ud83c\udf5b', topic: 'Risks & Insurance', desc: 'Coconut rice with sambal, fried fish, peanuts, and egg.' },
  { id: 'mee-goreng', name: 'Mee Goreng', icon: '\ud83c\udf5d', topic: 'Regulatory Landscape & Industry Frameworks', desc: 'Spicy stir-fried Indian-style noodles with vegetables and egg.' },
  { id: 'fish-head-curry', name: 'Fish Head Curry', icon: '\ud83c\udf5b', topic: 'Law of Contract & Agency', desc: 'A whole red snapper head in tangy curry. Uniquely Singaporean.' },
  { id: 'carrot-cake', name: 'Carrot Cake', icon: '\ud83e\uddc0', topic: 'Insurance Documents', desc: 'Not a dessert! Stir-fried radish cake with egg. Try "black" version.' },
  { id: 'teh-tarik', name: 'Teh Tarik', icon: '\ud83c\udf75', topic: 'Claims', desc: '"Pulled tea" \u2014 sweet milky tea poured from a height for frothiness.' },
  { id: 'ondeh-ondeh', name: 'Ondeh Ondeh', icon: '\ud83c\udf6a', topic: 'Reinsurance & Co-Insurance', desc: 'Pandan glutinous rice balls filled with melted palm sugar.' },
  { id: 'kueh-lapis', name: 'Kueh Lapis', icon: '\ud83c\udf70', topic: 'Ethics, Data Protection & Cyber Hygiene', desc: 'Colourful layered steamed cake. Each layer is painstakingly added.' },
  { id: 'curry-puff', name: 'Curry Puff', icon: '\ud83e\udd5f', topic: 'Principles of Insurance', desc: 'Crispy deep-fried pastry filled with spiced potato and chicken curry.' },

  // PGI dishes (7)
  { id: 'bak-chor-mee', name: 'Bak Chor Mee', icon: '\ud83c\udf5c', topic: 'Private Motor Car Insurance', desc: 'Minced pork noodles with vinegar and chili. A hawker staple.' },
  { id: 'popiah', name: 'Popiah', icon: '\ud83c\udf2f', topic: 'Personal Property Insurance', desc: 'Fresh spring rolls packed with turnip, egg, and sweet sauce.' },
  { id: 'mee-siam', name: 'Mee Siam', icon: '\ud83c\udf5d', topic: 'Personal Accident Insurance', desc: 'Tangy-sweet rice vermicelli in spicy tamarind gravy.' },
  { id: 'rojak', name: 'Rojak', icon: '\ud83e\udd57', topic: 'Travel Insurance', desc: 'A wild mix of fruits, vegetables, and dough fritters in shrimp paste.' },
  { id: 'tau-huay', name: 'Tau Huay', icon: '\ud83c\udf6e', topic: 'Personal Liability Insurance', desc: 'Silky smooth soybean pudding with sweet ginger syrup.' },
  { id: 'goreng-pisang', name: 'Goreng Pisang', icon: '\ud83c\udf4c', topic: 'Critical Illness & Hospital Cash Insurance', desc: 'Deep-fried banana fritters with crispy batter. Best eaten hot.' },
  { id: 'vadai', name: 'Vadai', icon: '\ud83e\uddc6', topic: 'Foreign Domestic Worker & Golfer Insurance', desc: 'Crispy fried lentil doughnuts spiced with curry leaves and chili.' },

  // HI dishes (13)
  { id: 'wanton-mee', name: 'Wanton Mee', icon: '\ud83c\udf5c', topic: 'Healthcare Environment in Singapore', desc: 'Springy egg noodles with char siu pork and plump wanton dumplings.' },
  { id: 'thunder-tea-rice', name: 'Thunder Tea Rice', icon: '\ud83c\udf3f', topic: 'Medical Expense Insurance', desc: 'Hakka Lei Cha \u2014 rice with green tea soup, veggies, and tofu. Healthy choice.' },
  { id: 'yong-tau-foo', name: 'Yong Tau Foo', icon: '\ud83c\udf62', topic: 'Group Hospital & Surgical Insurance', desc: 'Pick your own mix of tofu, veggies, and fish paste in clear soup.' },
  { id: 'ban-mian', name: 'Ban Mian', icon: '\ud83c\udf5c', topic: 'Disability Income Insurance', desc: 'Hand-torn noodles in anchovy broth with minced pork and egg.' },
  { id: 'soon-kueh', name: 'Soon Kueh', icon: '\ud83e\udd5f', topic: 'Long-Term Care Insurance', desc: 'Steamed rice skin dumplings filled with bamboo shoot and turnip.' },
  { id: 'tang-yuan', name: 'Tang Yuan', icon: '\ud83c\udf61', topic: 'Critical Illness Insurance', desc: 'Glutinous rice balls in sweet ginger soup. Eaten for reunion and hope.' },
  { id: 'otak-otak', name: 'Otak Otak', icon: '\ud83d\udc1f', topic: 'Other Types of Health Insurance', desc: 'Grilled spiced fish paste wrapped in banana leaf. Fragrant and smoky.' },
  { id: 'chwee-kueh', name: 'Chwee Kueh', icon: '\ud83e\uddc1', topic: 'Managed Healthcare', desc: 'Steamed rice cakes topped with preserved radish. Simple and satisfying.' },
  { id: 'mee-rebus', name: 'Mee Rebus', icon: '\ud83c\udf5d', topic: 'Healthcare Financing', desc: 'Yellow noodles in thick potato-based gravy with egg and lime.' },
  { id: 'nasi-biryani', name: 'Nasi Biryani', icon: '\ud83c\udf5b', topic: 'Common Policy Provisions', desc: 'Fragrant spiced basmati rice with tender mutton. A Kampong Glam classic.' },
  { id: 'putu-piring', name: 'Putu Piring', icon: '\ud83c\udf68', topic: 'Health Insurance Pricing', desc: 'Steamed rice flour cake with melted palm sugar centre. Warm and sweet.' },
  { id: 'murtabak', name: 'Murtabak', icon: '\ud83e\udd5e', topic: 'Health Insurance Underwriting', desc: 'Pan-fried stuffed flatbread with spiced mutton, egg, and onion.' },
  { id: 'prata-kosong', name: 'Teh Halia', icon: '\ud83c\udf75', topic: 'MAS 120 Disclosure & Advisory Process', desc: 'Ginger-infused milk tea. Warming, soothing, and perfectly balanced.' },
  { id: 'kueh-dadar', name: 'Kueh Dadar', icon: '\ud83e\uddc2', topic: 'Financial Needs Analysis', desc: 'Pandan crepe rolls filled with sweet grated coconut. Green and gorgeous.' },
];

export function getDishForTopic(topic) {
  return HAWKER_DISHES.find(d => d.topic === topic) || null;
}

export function getUnlockedDishes(masteredTopics) {
  return HAWKER_DISHES.filter(d => masteredTopics.includes(d.topic));
}
