/**
 * Hawker collection data
 * Each dish is unlocked when a topic is mastered.
 */
export const HAWKER_DISHES = [
  { id: 'chicken-rice', name: 'Chicken Rice', nameJa: 'チキンライス', icon: '\ud83c\udf5a', topic: 'Property Insurance', desc: 'Fragrant poached chicken with seasoned rice. The national dish.', descJa: '香り高い茹で鶏と味付きご飯。シンガポールの国民食。' },
  { id: 'laksa', name: 'Laksa', nameJa: 'ラクサ', icon: '\ud83c\udf5c', topic: 'Business Interruption Insurance', desc: 'Spicy coconut curry noodle soup with prawns and fish cake.', descJa: 'エビとフィッシュケーキ入りのスパイシーなココナッツカレー麺。' },
  { id: 'chili-crab', name: 'Chili Crab', nameJa: 'チリクラブ', icon: '\ud83e\udd80', topic: 'Liability & Contingency Insurance', desc: 'Sweet-spicy tomato chili sauce with fresh mud crab. Eat with mantou buns.', descJa: '甘辛トマトチリソースで食べるマッドクラブ。揚げマントウと一緒に。' },
  { id: 'kaya-toast', name: 'Kaya Toast', nameJa: 'カヤトースト', icon: '\ud83c\udf5e', topic: 'The Insurance & Reinsurance Market', desc: 'Crispy toast with coconut egg jam & butter. The classic breakfast.', descJa: 'カリカリトーストにココナッツエッグジャムとバター。定番の朝食。' },
  { id: 'satay', name: 'Satay', nameJa: 'サテー', icon: '\ud83c\udf62', topic: 'Commercial Motor Insurance', desc: 'Grilled meat skewers with peanut sauce. Best at Lau Pa Sat.', descJa: 'ピーナッツソースで食べる焼き鳥風串焼き。ラオパサが有名。' },
  { id: 'roti-prata', name: 'Roti Prata', nameJa: 'ロティプラタ', icon: '\ud83e\udd5e', topic: 'Marine & Aviation Insurance', desc: 'Crispy flaky Indian flatbread. Perfect with curry dipping sauce.', descJa: 'サクサクのインド風フラットブレッド。カレーソースとの相性抜群。' },
  { id: 'bak-kut-teh', name: 'Bak Kut Teh', nameJa: 'バクテー（肉骨茶）', icon: '\ud83c\udf72', topic: 'Construction, Machinery & Bond Insurance', desc: 'Peppery pork rib soup with garlic and herbs. Comfort food.', descJa: '胡椒の効いた豚スペアリブスープ。にんにくとハーブの滋味深い一杯。' },
  { id: 'char-kway-teow', name: 'Char Kway Teow', nameJa: 'チャークイティオ', icon: '\ud83c\udf5d', topic: 'Pecuniary Insurance', desc: 'Wok-fried flat rice noodles with prawns, cockles, and egg.', descJa: 'エビ・赤貝・卵入りの炒め平麺。強火の鍋振りが命。' },
  { id: 'hokkien-mee', name: 'Hokkien Mee', nameJa: 'ホッケンミー（福建麺）', icon: '\ud83c\udf5c', topic: 'Foreign Worker Insurance', desc: 'Stir-fried egg noodles with prawns in rich prawn stock.', descJa: '濃厚エビ出汁で炒めた卵麺。エビの旨みが凝縮。' },
  { id: 'ice-kachang', name: 'Ice Kachang', nameJa: 'アイスカチャン', icon: '\ud83c\udf67', topic: 'Group PA & Corporate Travel', desc: 'Shaved ice mountain with red beans, jelly, and sweet syrups.', descJa: '小豆・ゼリー・甘いシロップのかき氷。南国のご褒美デザート。' },
  { id: 'nasi-lemak', name: 'Nasi Lemak', nameJa: 'ナシレマ', icon: '\ud83c\udf5b', topic: 'Risks & Insurance', desc: 'Coconut rice with sambal, fried fish, peanuts, and egg.', descJa: 'ココナッツライスにサンバル・揚げ魚・ピーナッツ・卵。' },
  { id: 'mee-goreng', name: 'Mee Goreng', nameJa: 'ミーゴレン', icon: '\ud83c\udf5d', topic: 'Regulatory Landscape & Industry Frameworks', desc: 'Spicy stir-fried Indian-style noodles with vegetables and egg.', descJa: 'スパイシーなインド風焼きそば。野菜と卵たっぷり。' },
  { id: 'fish-head-curry', name: 'Fish Head Curry', nameJa: 'フィッシュヘッドカレー', icon: '\ud83c\udf5b', topic: 'Law of Contract & Agency', desc: 'A whole red snapper head in tangy curry. Uniquely Singaporean.', descJa: '鯛の頭丸ごとの酸味カレー。シンガポールならではの名物。' },
  { id: 'carrot-cake', name: 'Carrot Cake', nameJa: 'キャロットケーキ（菜頭粿）', icon: '\ud83e\uddc0', topic: 'Insurance Documents', desc: 'Not a dessert! Stir-fried radish cake with egg. Try "black" version.', descJa: 'デザートではない！大根餅の卵炒め。「黒」バージョンもお試しを。' },
  { id: 'teh-tarik', name: 'Teh Tarik', nameJa: 'テタレ', icon: '\ud83c\udf75', topic: 'Claims', desc: '"Pulled tea" \u2014 sweet milky tea poured from a height for frothiness.', descJa: '「引っ張り紅茶」— 高い位置から注いで泡立てる甘いミルクティー。' },
  { id: 'ondeh-ondeh', name: 'Ondeh Ondeh', nameJa: 'オンデオンデ', icon: '\ud83c\udf6a', topic: 'Reinsurance & Co-Insurance', desc: 'Pandan glutinous rice balls filled with melted palm sugar.', descJa: 'パンダン風味のもち米団子。中から溶けた椰子砂糖がとろり。' },
  { id: 'kueh-lapis', name: 'Kueh Lapis', nameJa: 'クエラピス', icon: '\ud83c\udf70', topic: 'Ethics, Data Protection & Cyber Hygiene', desc: 'Colourful layered steamed cake. Each layer is painstakingly added.', descJa: 'カラフルな蒸し層ケーキ。一層一層丁寧に重ねる手間の芸術。' },
  { id: 'curry-puff', name: 'Curry Puff', nameJa: 'カレーパフ', icon: '\ud83e\udd5f', topic: 'Principles of Insurance', desc: 'Crispy deep-fried pastry filled with spiced potato and chicken curry.', descJa: 'カリカリ揚げパイの中にスパイスポテトとチキンカレー。' },

  // PGI dishes (7)
  { id: 'bak-chor-mee', name: 'Bak Chor Mee', nameJa: 'バクチョーミー（肉脞麺）', icon: '\ud83c\udf5c', topic: 'Private Motor Car Insurance', desc: 'Minced pork noodles with vinegar and chili. A hawker staple.', descJa: '酢と唐辛子で味付けた豚ひき肉麺。ホーカーの定番。' },
  { id: 'popiah', name: 'Popiah', nameJa: 'ポピア（薄餅）', icon: '\ud83c\udf2f', topic: 'Personal Property Insurance', desc: 'Fresh spring rolls packed with turnip, egg, and sweet sauce.', descJa: '大根・卵・甘いソースを包んだ生春巻き。' },
  { id: 'mee-siam', name: 'Mee Siam', nameJa: 'ミーシアム', icon: '\ud83c\udf5d', topic: 'Personal Accident Insurance', desc: 'Tangy-sweet rice vermicelli in spicy tamarind gravy.', descJa: 'タマリンドの甘酸っぱいスパイシーグレービーのビーフン。' },
  { id: 'rojak', name: 'Rojak', nameJa: 'ロジャック', icon: '\ud83e\udd57', topic: 'Travel Insurance', desc: 'A wild mix of fruits, vegetables, and dough fritters in shrimp paste.', descJa: '果物・野菜・揚げ生地をエビペーストで和えた大胆ミックス。' },
  { id: 'tau-huay', name: 'Tau Huay', nameJa: 'タウフェイ（豆花）', icon: '\ud83c\udf6e', topic: 'Personal Liability Insurance', desc: 'Silky smooth soybean pudding with sweet ginger syrup.', descJa: 'なめらかな豆腐プリンに甘い生姜シロップ。' },
  { id: 'goreng-pisang', name: 'Goreng Pisang', nameJa: 'ゴレンピサン', icon: '\ud83c\udf4c', topic: 'Critical Illness & Hospital Cash Insurance', desc: 'Deep-fried banana fritters with crispy batter. Best eaten hot.', descJa: 'サクサク衣のバナナフリッター。揚げたてが最高。' },
  { id: 'vadai', name: 'Vadai', nameJa: 'ワダイ', icon: '\ud83e\uddc6', topic: 'Foreign Domestic Worker & Golfer Insurance', desc: 'Crispy fried lentil doughnuts spiced with curry leaves and chili.', descJa: 'カレーリーフと唐辛子のスパイシーな豆ドーナツ。' },

  // HI dishes (13)
  { id: 'wanton-mee', name: 'Wanton Mee', nameJa: 'ワンタンミー（雲呑麺）', icon: '\ud83c\udf5c', topic: 'Healthcare Environment in Singapore', desc: 'Springy egg noodles with char siu pork and plump wanton dumplings.', descJa: 'チャーシューとプリプリワンタンの弾力卵麺。' },
  { id: 'thunder-tea-rice', name: 'Thunder Tea Rice', nameJa: '擂茶飯（サンダーティーライス）', icon: '\ud83c\udf3f', topic: 'Medical Expense Insurance', desc: 'Hakka Lei Cha \u2014 rice with green tea soup, veggies, and tofu. Healthy choice.', descJa: '客家の擂茶 — 緑茶スープに野菜と豆腐のヘルシーご飯。' },
  { id: 'yong-tau-foo', name: 'Yong Tau Foo', nameJa: 'ヨンタウフー（釀豆腐）', icon: '\ud83c\udf62', topic: 'Group Hospital & Surgical Insurance', desc: 'Pick your own mix of tofu, veggies, and fish paste in clear soup.', descJa: '豆腐・野菜・すり身を好きに選ぶクリアスープ。' },
  { id: 'ban-mian', name: 'Ban Mian', nameJa: 'バンミェン（板麺）', icon: '\ud83c\udf5c', topic: 'Disability Income Insurance', desc: 'Hand-torn noodles in anchovy broth with minced pork and egg.', descJa: '煮干し出汁に手ちぎり麺、豚ひき肉と卵。' },
  { id: 'soon-kueh', name: 'Soon Kueh', nameJa: 'スンクエ（筍粿）', icon: '\ud83e\udd5f', topic: 'Long-Term Care Insurance', desc: 'Steamed rice skin dumplings filled with bamboo shoot and turnip.', descJa: 'タケノコと大根入りの蒸しライスペーパー餃子。' },
  { id: 'tang-yuan', name: 'Tang Yuan', nameJa: '湯圓（タンユェン）', icon: '\ud83c\udf61', topic: 'Critical Illness Insurance', desc: 'Glutinous rice balls in sweet ginger soup. Eaten for reunion and hope.', descJa: '甘い生姜スープのもち米団子。団欒と希望の象徴。' },
  { id: 'otak-otak', name: 'Otak Otak', nameJa: 'オタオタ', icon: '\ud83d\udc1f', topic: 'Other Types of Health Insurance', desc: 'Grilled spiced fish paste wrapped in banana leaf. Fragrant and smoky.', descJa: 'バナナの葉で包んだスパイス魚すり身の炭火焼き。' },
  { id: 'chwee-kueh', name: 'Chwee Kueh', nameJa: 'チュイクエ（水粿）', icon: '\ud83e\uddc1', topic: 'Managed Healthcare', desc: 'Steamed rice cakes topped with preserved radish. Simple and satisfying.', descJa: '漬け大根をのせた蒸しライスケーキ。素朴で満足感あり。' },
  { id: 'mee-rebus', name: 'Mee Rebus', nameJa: 'ミーレブス', icon: '\ud83c\udf5d', topic: 'Healthcare Financing', desc: 'Yellow noodles in thick potato-based gravy with egg and lime.', descJa: 'ポテトベースの濃厚グレービーの黄色い麺。卵とライム添え。' },
  { id: 'nasi-biryani', name: 'Nasi Biryani', nameJa: 'ナシビリヤニ', icon: '\ud83c\udf5b', topic: 'Common Policy Provisions', desc: 'Fragrant spiced basmati rice with tender mutton. A Kampong Glam classic.', descJa: 'スパイス香るバスマティライスと柔らかマトン。カンポングラムの名物。' },
  { id: 'putu-piring', name: 'Putu Piring', nameJa: 'プトゥピリン', icon: '\ud83c\udf68', topic: 'Health Insurance Pricing', desc: 'Steamed rice flour cake with melted palm sugar centre. Warm and sweet.', descJa: '溶けた椰子砂糖入りの蒸し米粉ケーキ。温かく甘い。' },
  { id: 'murtabak', name: 'Murtabak', nameJa: 'ムルタバ', icon: '\ud83e\udd5e', topic: 'Health Insurance Underwriting', desc: 'Pan-fried stuffed flatbread with spiced mutton, egg, and onion.', descJa: 'スパイスマトン・卵・玉ねぎを包んだ焼きフラットブレッド。' },
  { id: 'prata-kosong', name: 'Teh Halia', nameJa: 'テハリア', icon: '\ud83c\udf75', topic: 'MAS 120 Disclosure & Advisory Process', desc: 'Ginger-infused milk tea. Warming, soothing, and perfectly balanced.', descJa: '生姜入りミルクティー。体が温まる、やさしいバランスの一杯。' },
  { id: 'kueh-dadar', name: 'Kueh Dadar', nameJa: 'クエダダール', icon: '\ud83e\uddc2', topic: 'Financial Needs Analysis', desc: 'Pandan crepe rolls filled with sweet grated coconut. Green and gorgeous.', descJa: 'パンダンクレープに甘いココナッツフレーク。緑色が鮮やか。' },
];

export function getDishForTopic(topic) {
  return HAWKER_DISHES.find(d => d.topic === topic) || null;
}

export function getUnlockedDishes(masteredTopics) {
  return HAWKER_DISHES.filter(d => masteredTopics.includes(d.topic));
}
