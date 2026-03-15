/**
 * Station area guide data — "What's around this station?"
 * Shown in bottom sheet when user taps a station on the MRT map.
 *
 * Each entry is keyed by station name (shared across interchange lines).
 * Fields:
 *   tagline  — one-line catchphrase: 「〇〇」の街
 *   body     — 3-5 lines of area description (plain text)
 *   spots    — notable places / food (icon + name + desc, optional url)
 *   mapQuery — Google Maps search query (no API key needed)
 */

export const STATION_INFO = {
  'Newton': {
    tagline: '「ホーカー聖地」の街',
    body: `Newton Food Centre（1971年〜）が駅の顔。映画『Crazy Rich Asians』のロケ地にもなったオープンエアの屋台街。83店以上が軒を連ね、夜が本番——サテーと炭火の煙に街が包まれる。Orchard Roadまで徒歩圏で、駐在員の居住エリアとしても人気。`,
    spots: [
      { icon: '🦀', name: 'Alliance Seafood', desc: 'チリクラブ（Michelin Bib Gourmand）', url: 'https://www.google.com/search?q=Alliance+Seafood+Newton+Singapore' },
      { icon: '🐟', name: 'Kwang Kee', desc: '潮州フィッシュスープ・60年の老舗', url: 'https://www.google.com/search?q=Kwang+Kee+Teochew+Fish+Porridge+Newton' },
      { icon: '🥚', name: 'Hup Kee', desc: 'オイスターオムレツ（蚵仔煎）', url: 'https://www.google.com/search?q=Hup+Kee+Oyster+Omelette+Newton+Singapore' },
    ],
    mapQuery: 'Newton+MRT+Station+Singapore',
  },

  'Jurong East': {
    tagline: '「西のメガモール＆日本庭園」の街',
    body: `シンガポール西部の一大ショッピングハブ。JEM・Westgate・IMMの3モールが駅直結で繋がり、IMMはシンガポール最大のアウトレットモール。JEMにはシンガポール最大のドンキホーテ（2フロア）があり、日本食材や日用品の調達に便利。2024年9月にリニューアルオープンしたJurong Lake Gardens内の日本庭園は、昭和天皇が植樹したソテツが今も残り、150種以上の睡蓮コレクションは圧巻。週末の散歩やピクニックに最適で、来客を連れて行くと喜ばれるスポット。`,
    spots: [
      { icon: '🛍', name: 'JEM & Don Don Donki', desc: 'シンガポール最大のドンキ。日本食材・生鮮・コスメが2フロア', url: 'https://www.google.com/search?q=JEM+Don+Don+Donki+Jurong+East+Singapore' },
      { icon: '🌸', name: 'Japanese Garden (Jurong Lake Gardens)', desc: '2024年再開。睡蓮の庭・沈床庭園が美しい無料の国立庭園', url: 'https://www.google.com/search?q=Japanese+Garden+Jurong+Lake+Gardens+Singapore' },
      { icon: '🏷', name: 'IMM Outlet Mall', desc: 'アウトレット90店舗以上。Adidas・Calvin Klein等が年中最大80%OFF', url: 'https://www.google.com/search?q=IMM+Outlet+Mall+Jurong+East+Singapore' },
    ],
    mapQuery: 'Jurong+East+MRT+Station+Singapore',
  },

  'Bishan': {
    tagline: '「緑と家族の憩い」の街',
    body: `シンガポール中央部のファミリータウン。62ヘクタールのBishan-Ang Mo Kio Parkはカラン川が流れる広大な緑地で、遊具広場・水遊び場・ドッグラン・バタフライガーデン・足つぼ散策路（シンガポール最大級）と、休日を丸一日過ごせる充実ぶり。駅前のJunction 8は映画館・スーパー・レストランが揃う便利なハートランドモール。落ち着いた住宅街で、日本人駐在員のファミリー層にも人気のエリア。`,
    spots: [
      { icon: '🌳', name: 'Bishan-Ang Mo Kio Park', desc: '62haの巨大公園。水遊び場・バタフライ園・足つぼ路あり', url: 'https://www.google.com/search?q=Bishan+Ang+Mo+Kio+Park+Singapore' },
      { icon: '🍽', name: 'Grub', desc: '公園内の人気カフェ。緑に囲まれたテラスでバーガー＆ブランチ', url: 'https://www.google.com/search?q=Grub+Bishan+Park+Singapore' },
      { icon: '🛒', name: 'Junction 8', desc: '駅直結のハートランドモール。映画館・スーパー・フードコート完備', url: 'https://www.google.com/search?q=Junction+8+Bishan+Singapore' },
    ],
    mapQuery: 'Bishan+MRT+Station+Singapore',
  },

  'Woodlands': {
    tagline: '「マレーシア国境の玄関口」の街',
    body: `シンガポール最北端、ジョホール海峡を挟んでマレーシアのJB（ジョホールバル）を望むボーダータウン。Woodlands Checkpointから徒歩・バス・KTM鉄道でJBへ渡れるため、週末のJBグルメ＆買い出しツアーの拠点になる。Woodlands Waterfront Parkには400mの旧海軍桟橋があり、対岸JBの夜景が美しい。駅前のCauseway Pointは映画館・フードコート完備の大型モール。子連れならFu Shan Gardenの恐竜遊具がおすすめ。`,
    spots: [
      { icon: '🌊', name: 'Woodlands Waterfront Park', desc: '海沿い1.5kmの遊歩道。桟橋レストランでJBの夜景を眺めながら食事', url: 'https://www.google.com/search?q=Woodlands+Waterfront+Park+Singapore' },
      { icon: '🛍', name: 'Causeway Point', desc: '駅前の大型モール。映画館・ゲーセン・スーパー揃い', url: 'https://www.google.com/search?q=Causeway+Point+Woodlands+Singapore' },
      { icon: '🚂', name: 'JBへの国境越え', desc: 'バス・KTM鉄道・徒歩で対岸JBへ。週末グルメ遠征に', url: 'https://www.google.com/search?q=Woodlands+Checkpoint+to+Johor+Bahru+Singapore' },
    ],
    mapQuery: 'Woodlands+MRT+Station+Singapore',
  },

  'Orchard': {
    tagline: '「アジア屈指のショッピング天国」の街',
    body: `言わずと知れたシンガポールのメインストリート。全長2.2kmの大通りに10以上の巨大モールが並ぶアジア最大級のショッピングエリア。ION Orchardは駅直結で、56階の展望台から市街を一望できる。高島屋が入るNgee Ann City、ラグジュアリーブランドが集まるParagonなど、買い物好きなら一日では回りきれない。日本からのゲストを案内するなら、まずここ。ION地下のFood Operaは80軒以上の屋台が集まるフードコートで、ローカルグルメの入門にも最適。`,
    spots: [
      { icon: '🏙', name: 'ION Orchard', desc: '駅直結。300ブランド＋56階展望台＋地下フードコート', url: 'https://www.google.com/search?q=ION+Orchard+Singapore' },
      { icon: '🏬', name: 'Ngee Ann City（高島屋）', desc: '日本でおなじみの高島屋。紀伊國屋書店も入居', url: 'https://www.google.com/search?q=Ngee+Ann+City+Takashimaya+Singapore' },
      { icon: '🎨', name: 'Design Orchard', desc: 'シンガポール発のデザイナーズブランドが集まるショーケース', url: 'https://www.google.com/search?q=Design+Orchard+Singapore' },
    ],
    mapQuery: 'Orchard+MRT+Station+Singapore',
  },

  'Dhoby Ghaut': {
    tagline: '「3路線交差のカルチャー拠点」の街',
    body: `NS・NE・CCの3路線が交わるシンガポール最大級のインターチェンジ駅。駅名はマレー語で「洗濯人の井戸」の意味で、かつてインド人洗濯職人が集まった歴史に由来する。駅直結のPlaza Singapuraは200以上のショップとフードコートを持つ庶民派モール。目の前のIstana（大統領官邸）は年5回の一般公開日に入場でき、40ヘクタールの緑豊かな敷地を散策できる。Orchard Roadの東端に位置し、National Museum of Singaporeも徒歩圏内。`,
    spots: [
      { icon: '🏛', name: 'National Museum of Singapore', desc: 'シンガポール最古の博物館。歴史展示が充実、日本占領期の資料も', url: 'https://www.google.com/search?q=National+Museum+of+Singapore' },
      { icon: '🌿', name: 'Istana Park & The Istana', desc: '大統領官邸前の公園。年5回の公開日には敷地内を散策可能', url: 'https://www.google.com/search?q=The+Istana+Singapore+open+house' },
      { icon: '🛒', name: 'Plaza Singapura', desc: '駅直結の庶民派モール。Uniqlo・H&M・フードコート完備', url: 'https://www.google.com/search?q=Plaza+Singapura+Singapore' },
    ],
    mapQuery: 'Dhoby+Ghaut+MRT+Station+Singapore',
  },

  'City Hall': {
    tagline: '「歴史と芸術のシビック地区」の街',
    body: `シンガポールの歴史が凝縮されたシビック地区の中心駅。旧最高裁判所と旧市庁舎を改装したNational Gallery Singaporeは東南アジア最大級の美術館で、64,000㎡の空間に圧倒的な作品群が並ぶ。隣接するVictoria TheatreやAsian Civilisations Museum、セント・アンドリュース大聖堂など、徒歩圏内に主要文化施設が密集。毎年1月のLight to Night Festivalでは建物がライトアップされ幻想的な夜景に。来客の「シンガポールらしい写真スポット」としても鉄板。`,
    spots: [
      { icon: '🖼', name: 'National Gallery Singapore', desc: '東南アジア最大級の美術館。旧市庁舎＆最高裁を改装した壮大な建築', url: 'https://www.google.com/search?q=National+Gallery+Singapore' },
      { icon: '🏛', name: 'Asian Civilisations Museum', desc: 'アジア各地の文明を横断展示。シンガポール川沿いの美しい建物', url: 'https://www.google.com/search?q=Asian+Civilisations+Museum+Singapore' },
      { icon: '⛪', name: "St Andrew's Cathedral", desc: '白亜のゴシック建築。1838年創建のシンガポール最大の大聖堂', url: 'https://www.google.com/search?q=St+Andrews+Cathedral+Singapore' },
    ],
    mapQuery: 'City+Hall+MRT+Station+Singapore',
  },

  'Raffles Place': {
    tagline: '「摩天楼とサテーの金融街」の街',
    body: `シンガポールのウォール街。UOB Plaza・Republic Plaza・OCBC Centreなどの超高層ビルが林立するCBD（中心業務地区）の心臓部。平日昼はビジネスパーソンで溢れるが、週末は静かで散策向き。駅から徒歩5分のLau Pa Satは1894年築のヴィクトリア様式ホーカーセンター。夕方になるとBoon Tat Streetが歩行者天国になり、サテー屋台がずらりと並ぶ「サテーストリート」は必食。Boat Quayのリバーサイドバー群も徒歩圏内。`,
    spots: [
      { icon: '🍢', name: 'Lau Pa Sat & Satay Street', desc: '1894年築の国定文化財ホーカー。夕方からサテー屋台が並ぶ名物通り', url: 'https://www.google.com/search?q=Lau+Pa+Sat+Satay+Street+Singapore' },
      { icon: '🍻', name: 'Boat Quay', desc: 'シンガポール川沿いのバー＆レストラン街。夜景が美しい', url: 'https://www.google.com/search?q=Boat+Quay+Singapore' },
      { icon: '🏙', name: 'UOB Plaza展望フロア', desc: '28階の展望室から川沿いのコロニアル建築群を一望（無料）', url: 'https://www.google.com/search?q=UOB+Plaza+observation+deck+Singapore' },
    ],
    mapQuery: 'Raffles+Place+MRT+Station+Singapore',
  },

  'Marina Bay': {
    tagline: '「近未来ウォーターフロント」の街',
    body: `シンガポールの象徴的スカイラインが広がるウォーターフロント。Marina Bay Sandsの屋上プール（宿泊者限定）やSkyPark展望台、世界最大の温室Flower Domeを擁するGardens by the Bayなど、シンガポールを代表する観光スポットが集中する。毎晩19:45と20:45のSupertree光と音のショーは無料で鑑賞でき、来客案内の定番。Merlion Parkも徒歩圏内で、一帯を歩くだけで「シンガポールに来た！」感を満喫できるエリア。`,
    spots: [
      { icon: '🌳', name: 'Gardens by the Bay', desc: 'Supertreeの光のショー（毎晩無料）。Flower Dome＆Cloud Forestは有料', url: 'https://www.google.com/search?q=Gardens+by+the+Bay+Singapore' },
      { icon: '🏨', name: 'Marina Bay Sands SkyPark', desc: '57階展望台からの360度パノラマ。宿泊者はインフィニティプールも', url: 'https://www.google.com/search?q=Marina+Bay+Sands+SkyPark+Singapore' },
      { icon: '🧪', name: 'ArtScience Museum', desc: '蓮の花型の外観が印象的。teamLabの常設展が人気', url: 'https://www.google.com/search?q=ArtScience+Museum+Marina+Bay+Sands+Singapore' },
    ],
    mapQuery: 'Marina+Bay+MRT+Station+Singapore',
  },

  'Bugis': {
    tagline: '「異国情緒」の街',
    body: `アラブストリート＆カンポングラム——黄金のサルタンモスクを中心に、ペルシャ絨毯店、アラビックカフェ、テキスタイルショップが並ぶエキゾチックなエリア。Haji Laneはカラフルな壁画とインディーショップが集まるフォトスポット。Bugis Junctionでは近代的なショッピングも楽しめ、観音堂（Kwan Im Thong Hood Cho Temple）には地元の人も多く参拝に訪れる。日本からのゲストを連れて行くと「ここ本当にシンガポール？」と驚かれる、多文化の凝縮エリア。`,
    spots: [
      { icon: '🕌', name: 'Sultan Mosque', desc: '黄金のドームが圧巻。10-12時・14-16時に無料見学可（金曜除く）', url: 'https://www.google.com/search?q=Sultan+Mosque+Singapore' },
      { icon: '🎨', name: 'Haji Lane', desc: 'ウォールアートとインディーショップが並ぶ映えストリート', url: 'https://www.google.com/search?q=Haji+Lane+Singapore' },
      { icon: '🛕', name: 'Kwan Im Thong Hood Cho Temple', desc: '観音菩薩を祀る人気寺院。おみくじ体験もできる', url: 'https://www.google.com/search?q=Kwan+Im+Thong+Hood+Cho+Temple+Singapore' },
    ],
    mapQuery: 'Bugis+MRT+Station+Singapore',
  },

  'Paya Lebar': {
    tagline: '「マレー文化」の街',
    body: `ゲイランセライ（Geylang Serai）を中心としたマレー文化の拠点。ウェットマーケットではスパイスや食材が山積みで、併設ホーカーではナシパダン、ナシレマ、ビリヤニなど本格マレー＆インド系ムスリム料理が格安で楽しめる。ラマダン時期（3〜4月頃）にはGeylang Seraiバザールが開催され、夜市のような賑わいに。Wisma Geylang Seraiではマレー文化の展示やイベントも。バジュクルン（マレー伝統衣装）のショップ巡りも楽しいエリア。`,
    spots: [
      { icon: '🍛', name: 'Geylang Serai Market & Food Centre', desc: 'ナシパダン・ナシレマの名店が集まるマレー系ホーカー', url: 'https://www.google.com/search?q=Geylang+Serai+Market+Food+Centre+Singapore' },
      { icon: '🏛', name: 'Wisma Geylang Serai', desc: 'マレー文化のコミュニティセンター。展示やイベントあり', url: 'https://www.google.com/search?q=Wisma+Geylang+Serai+Singapore' },
      { icon: '🥘', name: 'Haig Road Market & Food Centre', desc: '地元民御用達。多国籍な屋台飯がリーズナブル', url: 'https://www.google.com/search?q=Haig+Road+Market+Food+Centre+Singapore' },
    ],
    mapQuery: 'Paya+Lebar+MRT+Station+Singapore',
  },

  'Outram Park': {
    tagline: '「老舗グルメ」の街',
    body: `チャイナタウンの南端に位置し、Keong Saik Road沿いにはリノベーションされたショップハウスにおしゃれなカフェやバーが並ぶ。Maxwell Food Centreには行列必至の天天海南鶏飯（ミシュラン・ビブグルマン）があり、シンガポール屈指のホーカー激戦区。Pearl's Hill City Parkは竹林の中を散歩できる隠れた癒しスポット。Hong Lim Food Centreも徒歩圏内で、一日でホーカー2〜3軒はしごも可能。NEL・EWL・TELの3路線が交わる交通の要衝でもある。`,
    spots: [
      { icon: '🍗', name: 'Maxwell Food Centre', desc: '天天海南鶏飯で有名。100以上の屋台が集まるホーカーの聖地', url: 'https://www.google.com/search?q=Maxwell+Food+Centre+Singapore' },
      { icon: '☕', name: 'Keong Saik Road', desc: 'レトロなショップハウス街。カヤトーストの老舗Tong Ahも', url: 'https://www.google.com/search?q=Keong+Saik+Road+Singapore' },
      { icon: '🌿', name: "Pearl's Hill City Park", desc: '竹林と貯水池のある都心の隠れ公園。散歩・読書に最適', url: 'https://www.google.com/search?q=Pearls+Hill+City+Park+Singapore' },
    ],
    mapQuery: 'Outram+Park+MRT+Station+Singapore',
  },

  'Serangoon': {
    tagline: '「家族でおでかけ」の街',
    body: `NEXモール直結のファミリー向けエリア。NEXはシンガポール北東部最大級のモールで、日本食レストラン街があり焼肉・しゃぶしゃぶ・ラーメンなど和食が充実。屋上にはSky Gardenと水遊び場があり、子連れに人気。少し足を延ばせばSerangoon Gardensエリアに、シンガポール人が愛するChomp Chomp Food Centre（夜のホーカー）がある。サテー、ホッケンミー、BBQチキンウィングの名店が集まり、夕方5時半からの営業で深夜まで賑わう。`,
    spots: [
      { icon: '🏬', name: 'NEX Mall', desc: 'MRT直結の巨大モール。日本食街・屋上水遊び場あり', url: 'https://www.google.com/search?q=NEX+Mall+Serangoon+Singapore' },
      { icon: '🍢', name: 'Chomp Chomp Food Centre', desc: '夜限定の伝説的ホーカー。サテーとホッケンミーは必食', url: 'https://www.google.com/search?q=Chomp+Chomp+Food+Centre+Singapore' },
      { icon: '🌳', name: 'Serangoon Gardens', desc: '緑豊かな住宅街。週末の散歩やカフェ巡りに', url: 'https://www.google.com/search?q=Serangoon+Gardens+Singapore' },
    ],
    mapQuery: 'Serangoon+MRT+Station+Singapore',
  },

  'Little India': {
    tagline: '「スパイス＆カラー」の街',
    body: `MRT駅を出た瞬間からスパイスの香りと極彩色の世界。駅直上のTekka Centreはインド料理ホーカーの最高峰で、フィッシュヘッドカレー、ドーサイ（南インドのクレープ）、ビリヤニが格安で味わえる。24時間営業のMustafa Centreは「何でもある」巨大ディスカウントストア。Sri Veeramakaliamman Templeの精緻な彫刻は一見の価値あり。ディーパバリ（10〜11月）の時期はライトアップが圧巻で、ゲストを連れて行くなら夕方がベスト。`,
    spots: [
      { icon: '🍛', name: 'Tekka Centre', desc: '駅直上のホーカー。フィッシュヘッドカレーとドーサイが絶品', url: 'https://www.google.com/search?q=Tekka+Centre+Singapore' },
      { icon: '🛍', name: 'Mustafa Centre', desc: '24時間営業の巨大ストア。お土産探しにも最適', url: 'https://www.google.com/search?q=Mustafa+Centre+Singapore' },
      { icon: '🛕', name: 'Sri Veeramakaliamman Temple', desc: 'カーリー女神を祀る極彩色のヒンドゥー寺院', url: 'https://www.google.com/search?q=Sri+Veeramakaliamman+Temple+Singapore' },
    ],
    mapQuery: 'Little+India+MRT+Station+Singapore',
  },

  'Chinatown': {
    tagline: '「歴史と味」の街',
    body: `シンガポールの華人文化の中心地。Pagoda Street沿いのショップハウスにはお土産店やお茶屋が並び、MRT出口Aを出ればすぐ。Buddha Tooth Relic Templeは4階に仏牙を安置する壮麗な寺院で、無料で見学可能。Chinatown Heritage Centreでは1950年代の移民の暮らしを追体験でき、Yip Yew Chongのウォールアートも見逃せない。Chinatown Complexのホーカーは200以上の屋台があり、点心・粥・ローカルスイーツの宝庫。半日あればたっぷり楽しめる。`,
    spots: [
      { icon: '🏛', name: 'Buddha Tooth Relic Temple', desc: '仏牙を安置する壮麗な寺院。入場無料・屋上庭園も', url: 'https://www.google.com/search?q=Buddha+Tooth+Relic+Temple+Singapore' },
      { icon: '🥟', name: 'Chinatown Complex Food Centre', desc: '200以上の屋台。点心・粥・ローカル料理の宝庫', url: 'https://www.google.com/search?q=Chinatown+Complex+Food+Centre+Singapore' },
      { icon: '🎭', name: 'Chinatown Heritage Centre', desc: '移民の暮らしを追体験。ショップハウス内の体験型博物館', url: 'https://www.google.com/search?q=Chinatown+Heritage+Centre+Singapore' },
    ],
    mapQuery: 'Chinatown+MRT+Station+Singapore',
  },

  'HarbourFront': {
    tagline: '「島遊び」の街',
    body: `セントーサ島への玄関口。VivoCity（シンガポール最大級のモール、300店舗以上）を経由してSentosa Expressモノレールに乗り換えるのが定番ルート。ユニバーサルスタジオ、S.E.A. Aquarium、ビーチなどセントーサの全アトラクションへのアクセス拠点。ケーブルカーでマウントフェーバーからの眺望も楽しめる。VivoCity自体にもレストランやフードコートが充実しており、セントーサに渡らなくても一日楽しめる規模。Seah Im Food Centreはローカル度高めの穴場ホーカー。`,
    spots: [
      { icon: '🎢', name: 'Sentosa Island', desc: 'USS・水族館・ビーチ。モノレールで3分', url: 'https://www.google.com/search?q=Sentosa+Island+Singapore' },
      { icon: '🛒', name: 'VivoCity', desc: 'シンガポール最大級モール。映画館・屋上プールも', url: 'https://www.google.com/search?q=VivoCity+Singapore' },
      { icon: '🚡', name: 'Mount Faber Cable Car', desc: 'ケーブルカーで山頂へ。夕暮れ時の眺望が絶景', url: 'https://www.google.com/search?q=Mount+Faber+Cable+Car+Singapore' },
    ],
    mapQuery: 'HarbourFront+MRT+Station+Singapore',
  },

  'Buona Vista': {
    tagline: '「知と緑」の街',
    body: `one-northテクノロジーパークを中心としたR&D・スタートアップの集積地。Biopolis（バイオ研究）、Fusionopolis（IT・メディア）など先端施設が並び、平日はテック系ワーカーで賑わう。Rochester Parkにはコロニアル様式の白黒バンガローを改装したレストランが点在し、週末のブランチに最適。Timbre+ One Northはフードコートとライブ音楽を融合させたユニークな食の空間。Star Vistaモール内にはパフォーミングアーツセンターもあり、週末のコンサートやショーも楽しめる。`,
    spots: [
      { icon: '🍻', name: 'Timbre+ One North', desc: 'ライブ音楽付きの都市型フードパーク。ビールも充実', url: 'https://www.google.com/search?q=Timbre+Plus+One+North+Singapore' },
      { icon: '🏘', name: 'Rochester Park', desc: 'コロニアル白黒バンガローのレストラン街。週末ブランチに', url: 'https://www.google.com/search?q=Rochester+Park+Singapore' },
      { icon: '🎵', name: 'The Star Vista', desc: 'モール＋劇場。週末のライブやショーをチェック', url: 'https://www.google.com/search?q=Star+Vista+Singapore' },
    ],
    mapQuery: 'Buona+Vista+MRT+Station+Singapore',
  },

  'Tampines': {
    tagline: '「東のオーチャード」の街',
    body: `シンガポール東部最大の生活拠点。Tampines Mall・Century Square・Tampines 1の3モールが駅周辺に集まり、Our Tampines Hubはホーカー・プール・図書館・体育館が一体化した巨大コミュニティ施設。Tampines Round Market & Food Centreでは朝からエビ麺やフィッシュスープが味わえる。少し足を延ばせば日本人学校（クレメンティ校以外の東部校）も近く、東部在住の駐在員ファミリーの生活圏。Jewel Changiへも2駅で行ける好立地。`,
    spots: [
      { icon: '🏊', name: 'Our Tampines Hub', desc: 'ホーカー・プール・図書館が一体化した巨大コミュニティ施設', url: 'https://www.google.com/search?q=Our+Tampines+Hub+Singapore' },
      { icon: '🍜', name: 'Tampines Round Market', desc: '朝から賑わうローカルホーカー。エビ麺・フィッシュスープの名店', url: 'https://www.google.com/search?q=Tampines+Round+Market+Food+Centre+Singapore' },
      { icon: '💎', name: 'Jewel Changi Airport', desc: '2駅で到着。Rain Vortex・ショッピング・映画館が楽しめる', url: 'https://www.google.com/search?q=Jewel+Changi+Airport+Singapore' },
    ],
    mapQuery: 'Tampines+MRT+Station+Singapore',
  },

  'Botanic Gardens': {
    tagline: '「世界遺産の緑」の街',
    body: `2015年にシンガポール初のUNESCO世界遺産に登録されたSingapore Botanic Gardens（1859年創設）の最寄り駅。74ヘクタールの敷地にNational Orchid Garden（1,000種以上のラン）、Swan Lake、Rain Forestなどが点在し、入園無料（Orchid Gardenのみ有料）。早朝のジョギングや週末の家族散歩の定番。駅周辺はBukit Timah Roadの高級住宅街で、Serene Centreや6th Avenue沿いにはおしゃれなカフェやベーカリーが並ぶ。`,
    spots: [
      { icon: '🌺', name: 'National Orchid Garden', desc: '1,000種以上のラン。VIP Orchid Gardenには各国首脳の名前のランも', url: 'https://www.google.com/search?q=National+Orchid+Garden+Singapore' },
      { icon: '🦢', name: 'Swan Lake & Rain Forest', desc: '白鳥が泳ぐ湖と原始の熱帯雨林。どちらも入場無料', url: 'https://www.google.com/search?q=Singapore+Botanic+Gardens+Swan+Lake' },
      { icon: '☕', name: 'Bee\'s Knees at The Garage', desc: '園内のカフェ。散策後のブランチに最適', url: 'https://www.google.com/search?q=Bees+Knees+Botanic+Gardens+Singapore' },
    ],
    mapQuery: 'Botanic+Gardens+MRT+Station+Singapore',
  },

  'Bayfront': {
    tagline: '「湾岸のスーパーツリー」の街',
    body: `Gardens by the Bayへの最寄り駅（Marina Bay駅からも行けるが、こちらの方が近い）。駅を出ると目の前にSupertree Groveが広がり、毎晩19:45と20:45のGarden Rhapsody（光と音のショー）は必見の無料イベント。Cloud Forest（高さ35mの滝がある温室）とFlower Dome（地中海〜砂漠の植物園）の2大温室は有料だが訪れる価値あり。Marina Bay Sandsの地下にはフードコートやThe Shoppes（高級ショッピング）が直結。`,
    spots: [
      { icon: '🌳', name: 'Supertree Grove', desc: '高さ50mのスーパーツリー。OCBCスカイウェイからの眺望は圧巻', url: 'https://www.google.com/search?q=Supertree+Grove+Gardens+by+the+Bay+Singapore' },
      { icon: '🌧', name: 'Cloud Forest', desc: '高さ35mの室内滝。霧の中の空中散策は異世界体験', url: 'https://www.google.com/search?q=Cloud+Forest+Gardens+by+the+Bay+Singapore' },
      { icon: '🛍', name: 'The Shoppes at MBS', desc: 'MBS地下直結の高級モール。運河でゴンドラにも乗れる', url: 'https://www.google.com/search?q=The+Shoppes+Marina+Bay+Sands+Singapore' },
    ],
    mapQuery: 'Bayfront+MRT+Station+Singapore',
  },

  'Caldecott': {
    tagline: '「メディアと閑静な丘」の街',
    body: `シンガポールの放送局Mediacorp本社の最寄り駅。周辺はMacRitchie Reservoir Parkへのアクセスルートの一つで、TreeTop Walkは森の上を渡る吊り橋（地上25m・全長250m）として人気のトレッキングスポット。住宅街は閑静で緑が多く、Andrew Road沿いにはGood Class Bungalow（シンガポール最高級住宅地）が点在する。カフェ好きならToa Payoh方面に足を延ばせばKim's Place Seafoodなど老舗ローカル食堂も。`,
    spots: [
      { icon: '🌿', name: 'TreeTop Walk (MacRitchie)', desc: '森の上の吊り橋（25m×250m）。週末のトレッキングに', url: 'https://www.google.com/search?q=TreeTop+Walk+MacRitchie+Reservoir+Singapore' },
      { icon: '📺', name: 'Mediacorp Campus', desc: 'シンガポールの放送局本社。敷地内にカフェや公開スタジオも', url: 'https://www.google.com/search?q=Mediacorp+Campus+Singapore' },
      { icon: '🍜', name: 'Whampoa Makan Place', desc: '近隣のレトロホーカー。炒粿條（チャークイティオ）が評判', url: 'https://www.google.com/search?q=Whampoa+Makan+Place+Singapore' },
    ],
    mapQuery: 'Caldecott+MRT+Station+Singapore',
  },

  'Stevens': {
    tagline: '「高級住宅街の隠れ家」の街',
    body: `Orchard Road北側に広がる高級住宅エリアの最寄り駅。駅周辺は静かなGood Class Bungalow地帯で、各国大使館も点在する国際色豊かな一角。Stevens Road沿いにはローカルに愛されるAdam Road Food Centre（ナシレマの名店Selera Rasaで有名）があり、高級住宅街とホーカー文化が共存する面白いエリア。Orchard方面へも徒歩15分程度で、週末のブランチ散歩には最適の起点。`,
    spots: [
      { icon: '🍚', name: 'Adam Road Food Centre', desc: 'ナシレマの名店Selera Rasa。駐在員にもファンが多い', url: 'https://www.google.com/search?q=Adam+Road+Food+Centre+Singapore' },
      { icon: '🏘', name: 'Good Class Bungalow Area', desc: 'シンガポール最高級住宅地。各国大使館も点在する静かな並木道', url: 'https://www.google.com/search?q=Stevens+Road+Good+Class+Bungalow+Singapore' },
      { icon: '🎾', name: 'Singapore Tennis Centre', desc: '一般利用可のテニスコート。駐在員のスポーツ拠点', url: 'https://www.google.com/search?q=Singapore+Tennis+Centre+Stevens+Road' },
    ],
    mapQuery: 'Stevens+MRT+Station+Singapore',
  },

  'MacPherson': {
    tagline: '「工場街のリノベカフェ」の街',
    body: `かつての工業地帯が、クリエイティブなカフェやスタジオにリノベーションされつつあるエリア。Tai Seng周辺のフラットファクトリーにはベーカリーカフェやデザインスタジオが入居し、週末のカフェ巡りスポットとして注目を集めている。Circuit Road沿いにはレトロなHDB（公営住宅）団地とホーカーがあり、Paya Lebar方面のGeylang Seraiとも徒歩圏。飾らないローカル感と新しいクリエイティブシーンが混在する穴場エリア。`,
    spots: [
      { icon: '☕', name: 'Tai Seng Industrial Cafes', desc: '工場リノベのカフェ群。Baker & Cook, Penny Universityなど', url: 'https://www.google.com/search?q=Tai+Seng+cafe+Singapore' },
      { icon: '🍜', name: 'Circuit Road Food Centre', desc: 'レトロHDB団地内のホーカー。ワンタンミーが評判', url: 'https://www.google.com/search?q=Circuit+Road+Food+Centre+Singapore' },
      { icon: '🏭', name: 'Goodman Arts Centre', desc: '旧英軍施設をアート拠点に改装。ギャラリーやワークショップも', url: 'https://www.google.com/search?q=Goodman+Arts+Centre+Singapore' },
    ],
    mapQuery: 'MacPherson+MRT+Station+Singapore',
  },

  'Promenade': {
    tagline: '「マリーナの文化拠点」の街',
    body: `マリーナ地区の文化・エンタメの中心。Esplanade – Theatres on the Bayは「ドリアン」の愛称で親しまれる国立舞台芸術センターで、無料の屋外コンサートも頻繁に開催される。F1シーズン（9月頃）にはMarina Bay Street Circuitのコースが駅周辺を走り、街が興奮に包まれる。Millenia WalkやSuntec City Mallが直結で、週末のシネマやショッピングにも便利。Helix Bridgeを渡ればMarina Bay Sandsへも歩いてすぐ。`,
    spots: [
      { icon: '🎭', name: 'Esplanade – Theatres on the Bay', desc: '「ドリアン」の愛称。無料の屋外コンサートを頻繁に開催', url: 'https://www.google.com/search?q=Esplanade+Theatres+on+the+Bay+Singapore' },
      { icon: '🏎', name: 'Marina Bay Street Circuit', desc: 'F1シンガポールGPのコース。9月のナイトレースは世界的に有名', url: 'https://www.google.com/search?q=Marina+Bay+Street+Circuit+F1+Singapore' },
      { icon: '🌉', name: 'Helix Bridge', desc: 'DNA二重螺旋型の歩道橋。夜のライトアップが美しい', url: 'https://www.google.com/search?q=Helix+Bridge+Singapore' },
    ],
    mapQuery: 'Promenade+MRT+Station+Singapore',
  },
};

/**
 * Look up station info by name.
 * Returns the entry or null if not found.
 */
export function getStationInfo(name) {
  return STATION_INFO[name] || null;
}
