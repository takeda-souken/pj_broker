/**
 * fix-early-images.js
 *
 * Restructures 10 sakura-room conversations so the image node comes
 * AFTER conversation buildup instead of at position 0/1.
 *
 * Pattern: talk → choice → explain → offer photo → choice to see → photo → reaction → end
 *
 * Does NOT touch b58_sunset_photo.
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data', 'sakura-room');

// ── Replacement nodes for each conversation ──

const replacements = {

  // ============================================================
  // b04_kaya_toast (phase2-early-b.json) — food photo
  // ============================================================
  b04_kaya_toast: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今朝ね、最高の朝ごはん食べたんよ。",
        "{name}、カヤトーストって知っとる？"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "カヤトーストだよね",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "なにそれ？",
          next: "n3b",
          axes: {}
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "お、知っとるんやね！ さすが。",
        "SGに来てもう食べた？"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "SGの朝ごはんの大定番！",
        "カヤジャムっていう、ココナッツと卵で作ったジャムを塗ったトーストなんよ。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "これにね、半熟卵をつけて食べるのが正しい食べ方なんよ。",
        "半熟卵にダークソイソースを垂らして、トーストをディップして。",
        "あーー、話してたらまた食べたくなってきた。"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "おすすめの店は？",
          next: "n6a",
          flags: { interested_kaya: true },
          axes: { warmth: 1 }
        },
        {
          label: "毎朝これなの？",
          next: "n6b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n6a",
      speaker: "sakura",
      lines: [
        "Ya Kun Kaya Toastっていうチェーンが王道。どこにでもあるよ。",
        "でもうちのおすすめは、Tong Ah Eating House。Keong Saik Roadにあって。",
        "炭火で焼いてるけん、香ばしさが全然違うんよ。"
      ],
      next: "n7"
    },
    {
      id: "n6b",
      speaker: "sakura",
      lines: [
        "毎朝じゃないよ、さすがに。",
        "でも週に2回くらいは食べてるかも。好きなものは好きなんよ。"
      ],
      next: "n7"
    },
    {
      id: "n7",
      speaker: "sakura",
      lines: [
        "あ、そうそう。今朝のやつ写真撮ったんよ。見る？"
      ]
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "見たい！",
          next: "n9",
          axes: { warmth: 1 }
        },
        {
          label: "見せて見せて",
          next: "n9",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n9",
      speaker: "image",
      alt: "カヤトーストと半熟卵とコーヒーのセット",
      src: "img/sakura-room/kaya-toast.jpg",
      caption: "自分で撮ったんですけど、おいしそうに見えます？",
      next: "n10"
    },
    {
      id: "n10",
      speaker: "sakura",
      lines: [
        "どう？ おいしそうやろ？",
        "{name}も朝ごはんちゃんと食べてね。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b16_first_photo (phase2-early-b.json) — food photo
  // ============================================================
  b16_first_photo: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今日のお昼ね、すっごいおいしいもの食べたんよ！",
        "ナシレマっていうの。知っとる？"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "聞いたことある",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "なにそれ？",
          next: "n3b",
          axes: {}
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "おお、さすが！ ココナッツミルクで炊いたご飯に、サンバルっていう辛いソースと、揚げた小魚とゆで卵と。",
        "SGの国民食って言ってもいいくらいなんよ。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "マレー系の料理でね、ココナッツミルクで炊いたご飯がベース。",
        "サンバルっていう辛いソースと、イカンビリスっていう揚げた小魚がのっとるの。",
        "SGではみんな大好き！"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "あ、写真撮ったんよ。見てくれん？"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "見たい！",
          next: "n6",
          axes: { warmth: 1 }
        },
        {
          label: "見せて",
          next: "n6",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n6",
      speaker: "image",
      alt: "ホーカーで撮ったナシレマの写真",
      src: "img/sakura-room/nasi-lemak.jpg",
      caption: "隣の席のおばちゃんが「撮ってあげるよ」って。料理の写真ですけどね",
      next: "n7"
    },
    {
      id: "n7",
      speaker: "sakura",
      lines: [
        "じゃん！ おいしそうやろ？",
        "あ、写真撮って送るの、迷惑じゃなかった？"
      ]
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "全然、もっと送ってよ",
          next: "n9a",
          flags: { wants_photos: true },
          axes: { warmth: 2 }
        },
        {
          label: "お腹空いてくるけどね",
          next: "n9b",
          flags: { wants_photos: true },
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n9a",
      speaker: "sakura",
      lines: [
        "ほんと！？",
        "じゃあ、おいしいもの見つけたら撮って送るね。",
        "へへ。なんか嬉しい。"
      ],
      end: true
    },
    {
      id: "n9b",
      speaker: "sakura",
      lines: [
        "あはは、ごめんって！",
        "でも止められんかもしれん。おいしいもの見つけると撮りたくなる性分で。",
        "まあ、{name}のお腹が鳴るのはうちの責任じゃないけんね。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b22_satay (phase2-mid-b.json) — food photo
  // ============================================================
  b22_satay: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今日の晩ごはん、サテーっていう串焼き食べたんよ！",
        "{name}、串焼きって聞いたら何思い出す？"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "焼き鳥かな",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "串カツ",
          next: "n3b",
          axes: {}
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "やっぱり！ でもサテーはちょっと違うんよ。",
        "ピーナッツソースをつけて食べるの。甘辛くて、やみつきになるよ。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "串カツ！ 大阪やね～。",
        "うちも大阪で食べた串カツ、忘れられんっちゃ。",
        "サテーも串やけど、ピーナッツソースをつけるのがSG流。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "Lau Pa Satの屋台が有名なんよ。夜になると炭火の煙がもくもくして、いい匂いがするの。",
        "10本で5ドルくらい。安いやろ？"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "写真ある？",
          next: "n6",
          axes: { warmth: 1 }
        },
        {
          label: "食べてみたい",
          next: "n5b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n5b",
      speaker: "sakura",
      lines: [
        "食べてほしい！ あ、昨日撮った写真あるんよ。見る？"
      ],
      next: "n6_choice"
    },
    {
      id: "n6",
      speaker: "sakura",
      lines: [
        "あるよ！ 昨日撮ったやつ。"
      ],
      next: "n6_choice"
    },
    {
      id: "n6_choice",
      speaker: "choice",
      choices: [
        {
          label: "見せて！",
          next: "n7_img",
          axes: { warmth: 1 }
        },
        {
          label: "見たい",
          next: "n7_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n7_img",
      speaker: "image",
      alt: "サテーの写真（炭火焼きの串）",
      src: "img/sakura-room/satay.jpg",
      caption: "昨日の夜うちが撮ったやつ。炭火の匂い、伝わる？",
      next: "n8"
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "お腹空いてきた",
          next: "n9a",
          axes: { warmth: 1 }
        },
        {
          label: "ピーナッツアレルギーだったらどうするの",
          next: "n9b",
          axes: {}
        }
      ]
    },
    {
      id: "n9a",
      speaker: "sakura",
      lines: [
        "ごめんって！ でもうちの飯テロは止まらんよ。",
        "{name}も夜ごはんちゃんと食べた？ カップ麺はダメやよ。"
      ],
      end: true
    },
    {
      id: "n9b",
      speaker: "sakura",
      lines: [
        "あ、それは確かに。ピーナッツなしのソースもあるけど、確認したほうがいいね。",
        "SGは食のアレルギー表示が日本ほど親切じゃないけん、気をつけて。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b24_tiong_bahru (phase2-mid-b.json) — place photo
  // ============================================================
  b24_tiong_bahru: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今日ね、Tiong Bahruに行ってきたんよ。",
        "SGで一番おしゃれなエリアかもしれん。"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "どんなところ？",
          next: "n3a",
          axes: {}
        },
        {
          label: "聞いたことある",
          next: "n3b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "戦前のアパートが残ってて、その1階にカフェやベーカリーが入ってるの。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "おお、知っとるんや！ 古い建物がそのまま残っててね。",
        "リノベされてカフェになっとるの。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "古いものと新しいものが混ざってる感じが、うちは好きなんよね。",
        "大阪の中崎町に雰囲気が似とるかも。{name}、中崎町知っとる？"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "知ってるよ、いいところだよね",
          next: "n6a",
          axes: { warmth: 1 }
        },
        {
          label: "聞いたことはある",
          next: "n6b",
          axes: {}
        }
      ]
    },
    {
      id: "n6a",
      speaker: "sakura",
      lines: [
        "やっぱり！ あの路地裏の雑貨屋さんとか、古いビルのカフェとか。",
        "うちが大阪で一番好きな場所やった。"
      ],
      next: "n7"
    },
    {
      id: "n6b",
      speaker: "sakura",
      lines: [
        "梅田のちょっと北にあるんよ。古い長屋をリノベしたカフェとか、個性的な雑貨屋さんがあって。",
        "うちが大阪で一番好きな場所やった。"
      ],
      next: "n7"
    },
    {
      id: "n7",
      speaker: "sakura",
      lines: [
        "あ、写真撮ったんよ。この雰囲気、見てほしい。"
      ]
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "見せて",
          next: "n9_img",
          axes: { warmth: 1 }
        },
        {
          label: "見たい",
          next: "n9_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n9_img",
      speaker: "image",
      alt: "Tiong Bahruのレトロな建物とカフェ",
      src: "img/sakura-room/tiong-bahru.jpg",
      caption: "うちのスマホで撮りました。この雰囲気、伝わりますかね？",
      next: "n10"
    },
    {
      id: "n10",
      speaker: "sakura",
      lines: [
        "いいやろ？ {name}と好きな場所が似とるのかもしれんね。",
        "いつかTiong Bahruも歩いてみてね。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b35_night_skyline (phase2-mid-b.json) — place photo
  // ============================================================
  b35_night_skyline: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "ねぇ、今仕事帰りなんやけど。",
        "今日のマリーナベイ、すごいきれいなんよ。"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "夜景？",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "レーザーショーの日？",
          next: "n3b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "そう！ マリーナベイサンズのレーザーショー。毎晩やっとるんよ。",
        "タダで見れるの。世界一贅沢な無料ショーかもしれん。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "毎晩やっとるんよ、実は。20時と21時。",
        "タダで見れるけん、仕事帰りにふらっと寄れるの。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "うちね、疲れた日はここに来るんよ。",
        "ベンチに座って、夜風に当たって、この景色見てたらなんか、大丈夫になるの。",
        "{name}にも、SGでそういう場所見つけてほしいな。"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "写真見たいな",
          next: "n6_offer",
          axes: { warmth: 1 }
        },
        {
          label: "「大丈夫」の場所なんだね",
          next: "n6_deep",
          axes: { warmth: 2 }
        }
      ]
    },
    {
      id: "n6_offer",
      speaker: "sakura",
      lines: [
        "撮ったよ！ ちょうど今。"
      ],
      next: "n7_img"
    },
    {
      id: "n6_deep",
      speaker: "sakura",
      lines: [
        "うん。誰にも言ったことなかったんやけどね。",
        "あ、今ちょうど写真撮ったんよ。見てくれん？"
      ],
      next: "n7_choice"
    },
    {
      id: "n7_choice",
      speaker: "choice",
      choices: [
        {
          label: "見たい",
          next: "n7_img",
          axes: { warmth: 1 }
        },
        {
          label: "見せて",
          next: "n7_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n7_img",
      speaker: "image",
      alt: "マリーナベイの夜景",
      src: "img/sakura-room/marina-bay-night.jpg",
      caption: "うちのスマホで撮ったけん画質悪いけどきれいやったんよ",
      next: "n8"
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "今度行ってみるよ",
          next: "n9a",
          flags: { interested_marina_night: true },
          axes: { warmth: 1 }
        },
        {
          label: "きれいだね",
          next: "n9b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n9a",
      speaker: "sakura",
      lines: [
        "うん、行ってみて。",
        "写真撮ったら送ってね。{name}が見た夜景、うちも見たいけん。"
      ],
      end: true
    },
    {
      id: "n9b",
      speaker: "sakura",
      lines: [
        "やろ？ でも{name}には、なんか言いたくなった。不思議やね。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b39_ice_kachang (phase2-mid-b.json) — food photo
  // ============================================================
  b39_ice_kachang: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今日暑すぎて、かき氷食べてきたんよ。",
        "アイスカチャンっていうSGのかき氷！"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "かき氷あるんだ",
          next: "n3a",
          axes: {}
        },
        {
          label: "日本のかき氷と違う？",
          next: "n3b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "あるよ！ しかもめっちゃカラフルなの。シロップがすごい色しとる。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "全然違う！ 中にあずきとかゼリーとかコーンとか入っとるの。てんこ盛り。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "暑い日にこれ食べるとね、生き返るんよ。",
        "でも食べてる途中で溶けてくるけん、早食い勝負になるの。",
        "うち、毎回服にシロップつけてしまうんよね。学習せんっちゃ。"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "かわいいな",
          next: "n6_cute",
          axes: { warmth: 2 }
        },
        {
          label: "写真撮った？",
          next: "n6_photo",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n6_cute",
      speaker: "sakura",
      lines: [
        "かっ！ かわいくないよ！ ただの不器用なだけ！",
        "もう。あ、写真撮ったんよ。見る？"
      ],
      next: "n6_choice"
    },
    {
      id: "n6_photo",
      speaker: "sakura",
      lines: [
        "撮った！ 食べる前にギリギリセーフで。見る？"
      ],
      next: "n6_choice"
    },
    {
      id: "n6_choice",
      speaker: "choice",
      choices: [
        {
          label: "見たい！",
          next: "n7_img",
          axes: { warmth: 1 }
        },
        {
          label: "見せて",
          next: "n7_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n7_img",
      speaker: "image",
      alt: "カラフルなアイスカチャンの写真",
      src: "img/sakura-room/ice-kachang.jpg",
      caption: "食べる前に撮るの忘れそうになった。ギリギリセーフ",
      next: "n8"
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "すごい色だね",
          next: "n9a",
          axes: { warmth: 1 }
        },
        {
          label: "今度食べてみるよ",
          next: "n9b",
          flags: { interested_ice_kachang: true },
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n9a",
      speaker: "sakura",
      lines: [
        "やろ？ 見た目すごいけど味はちゃんとおいしいんよ。",
        "Old Airport Roadのホーカーにおいしいとこあるけん、行ってみて。"
      ],
      end: true
    },
    {
      id: "n9b",
      speaker: "sakura",
      lines: [
        "食べて食べて！ Old Airport Roadのホーカーにおいしいとこあるよ。",
        "あ、食べるとき白い服はやめたほうがいいよ。うちの失敗から学んで。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b47_rooftop (phase2-late-b.json) — place photo
  // ============================================================
  b47_rooftop: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今、会社のビルの屋上におるんよ。",
        "たまにね、残業のあとにここに来るの。誰もおらんけん。"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "ひとりで？",
          next: "n3a",
          axes: { warmth: 2 }
        },
        {
          label: "息抜き？",
          next: "n3b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "うん。ひとりで。",
        "寂しいとかじゃなくて。ひとりの時間がほしい時ってあるやん。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "うん。この景色見るとね、なんか落ち着くんよ。",
        "街の灯りが全部見えて、でも音は聞こえんくて。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "ここから見るとね、SGがすごく小さく見えるの。",
        "この小さい島に、うちが生まれて、育って、働いて。",
        "でもこの島の外に、{name}がおった世界があるんよね。大阪とか、日本とか。",
        "広いね、世界って。"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "でもこうしてつながってるよ",
          next: "n6a",
          axes: { warmth: 2 }
        },
        {
          label: "外に出たいと思う？",
          next: "n6b",
          axes: { honesty: 1 }
        }
      ]
    },
    {
      id: "n6a",
      speaker: "sakura",
      lines: [
        "うん。そうやね。",
        "こんな夜に、こうやって話せる人がおるの、ありがたいなって思う。",
        "あ、写真撮ったんよ。ここ、うちの秘密の場所。見る？"
      ],
      next: "n7_choice"
    },
    {
      id: "n6b",
      speaker: "sakura",
      lines: [
        "…………。",
        "うん。出たいと思う。ずっと。",
        "でもその話は、またいつか。今日は、この景色だけ見ていたい。",
        "あ、{name}にも見せたいな。写真送っていい？"
      ],
      next: "n7_choice"
    },
    {
      id: "n7_choice",
      speaker: "choice",
      choices: [
        {
          label: "見たい",
          next: "n8_img",
          axes: { warmth: 1 }
        },
        {
          label: "見せて",
          next: "n8_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n8_img",
      speaker: "image",
      alt: "ビルの屋上から見た夜のSG",
      src: "img/sakura-room/rooftop-night.jpg",
      caption: "ひとりで撮った。ここ、うちの秘密の場所",
      next: "n9"
    },
    {
      id: "n9",
      speaker: "sakura",
      lines: [
        "きれいやろ。",
        "ごめんね、しんみりして。夜はダメやね、うち。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b54_pet_cat (phase2-late-b.json) — cat photo
  // ============================================================
  b54_pet_cat: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今日の帰り道でね、めっちゃかわいい猫に会ったんよ！"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "猫好きなの？",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "野良猫？",
          next: "n3b",
          axes: {}
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "大好き！ 飼いたいんやけど、うちのHDB（公団）はペット禁止で。",
        "だから野良猫に会うのが楽しみなんよ。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "SGの野良猫ってね、人懐っこいんよ。撫でさせてくれるの。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "SGには「コミュニティキャット」っていう文化があってね。",
        "野良猫をみんなで世話するの。ごはんあげたり、病院連れて行ったり。",
        "誰のものでもないけど、みんなのもの。いいよね、そういうの。"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "写真撮った？",
          next: "n6_photo",
          axes: { warmth: 1 }
        },
        {
          label: "SGらしい文化だね",
          next: "n6_culture",
          axes: {}
        }
      ]
    },
    {
      id: "n6_photo",
      speaker: "sakura",
      lines: [
        "撮った撮った！ 見て！"
      ],
      next: "n7_img"
    },
    {
      id: "n6_culture",
      speaker: "sakura",
      lines: [
        "ね。SGって冷たい国に見えるかもしれんけど、こういう温かさがあるんよ。",
        "あ、写真撮ったんよ。見てくれん？"
      ],
      next: "n7_choice"
    },
    {
      id: "n7_choice",
      speaker: "choice",
      choices: [
        {
          label: "見たい",
          next: "n7_img",
          axes: { warmth: 1 }
        },
        {
          label: "見せて",
          next: "n7_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n7_img",
      speaker: "image",
      alt: "道端で寝ている猫の写真",
      src: "img/sakura-room/stray-cat.jpg",
      caption: "さっきうちが撮ったんよ。かわいくない？",
      next: "n8"
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "名前つけてあげれば？",
          next: "n9a",
          axes: { warmth: 1 }
        },
        {
          label: "かわいいね",
          next: "n9b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n9a",
      speaker: "sakura",
      lines: [
        "じゃあ、「みかん」にする。オレンジ色やけん。",
        "次会ったら「みかん」って呼んでみるね。振り向いてくれるかな。",
        "{name}にも会わせたいな。チャット越しやなくて。"
      ],
      end: true
    },
    {
      id: "n9b",
      speaker: "sakura",
      lines: [
        "やろ？ この子、いつもこの辺におるんよ。",
        "うちはこの国のこういうところが好き。",
        "{name}にも好きになってもらいたいなって、いつも思っとる。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b66_one_north_lunch (phase2-late-b.json) — food photo
  // ============================================================
  b66_one_north_lunch: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "今日のランチ、会社の近くのカフェで食べたんよ。",
        "one-northエリア、実はカフェが多いの。"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "おしゃれなとこ？",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "毎日外食？",
          next: "n3b",
          axes: {}
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "テック系の会社が多いけん、カフェもモダンなとこが多いんよ。",
        "でもうちは結局ホーカーに行くことが多い。安いし早いし。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "平日はほぼ外食やね。SGの人はみんなそうよ。",
        "自炊は週末だけ。平日は時間がないけん。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "あ、写真撮ったんよ。同僚に「また撮っとる」って笑われたけど。見る？"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "見せて",
          next: "n6_img",
          axes: { warmth: 1 }
        },
        {
          label: "見たい",
          next: "n6_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n6_img",
      speaker: "image",
      alt: "one-northエリアのカフェランチ",
      src: "img/sakura-room/one-north-lunch.jpg",
      caption: "同僚に「また撮っとる」って笑われた",
      next: "n7"
    },
    {
      id: "n7",
      speaker: "sakura",
      lines: [
        "こんな感じ。おしゃれやろ？",
        "あ、{name}もone-northの近くに来ることとかある？",
        "いや、別に深い意味はないんやけど。ほんまに意味ないよ。聞いただけ。"
      ]
    },
    {
      id: "n8",
      speaker: "choice",
      choices: [
        {
          label: "用事があったら行くかも",
          next: "n9a",
          axes: { warmth: 1 }
        },
        {
          label: "あんまりないかな",
          next: "n9b",
          axes: {}
        }
      ]
    },
    {
      id: "n9a",
      speaker: "sakura",
      lines: [
        "そ、そう。",
        "まあ、来ることがあったらいや、会えんのやけどね。ルールあるけん。",
        "でも同じ空気吸ってるかもって思うと、ちょっとだけ嬉しい。ばかみたい。"
      ],
      end: true
    },
    {
      id: "n9b",
      speaker: "sakura",
      lines: [
        "やんね。用事ないもんね。そうよね。",
        "なんで聞いたんやろ、うち。ごめんね、変なこと聞いて。"
      ],
      end: true
    }
  ],

  // ============================================================
  // b71_hawker_selfie (phase2-late-b.json) — move img after choice
  // ============================================================
  b71_hawker_selfie: [
    {
      id: "n1",
      speaker: "sakura",
      lines: [
        "ねえねえ！ 今日ね、初めてのホーカー行ってきた！",
        "Old Airport Road Food Centreってとこ。"
      ]
    },
    {
      id: "n2",
      speaker: "choice",
      choices: [
        {
          label: "何食べたの？",
          next: "n3a",
          axes: { warmth: 1 }
        },
        {
          label: "楽しそう",
          next: "n3b",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n3a",
      speaker: "sakura",
      lines: [
        "フライドホッケンミー！ 太麺と細麺が混ざったやつ。",
        "エビの出汁がすごくて{name}にも食べさせたい。",
        "あ、また食べ物の布教しとる。うちの悪い癖やね。"
      ],
      next: "n4"
    },
    {
      id: "n3b",
      speaker: "sakura",
      lines: [
        "楽しかったよ！ めっちゃ広くて、何食べるか迷いすぎて30分うろうろしてた。"
      ],
      next: "n4"
    },
    {
      id: "n4",
      speaker: "sakura",
      lines: [
        "あ、写真撮ったんよ。{name}にも見せたくて。見る？"
      ]
    },
    {
      id: "n5",
      speaker: "choice",
      choices: [
        {
          label: "見たい！",
          next: "n6_img",
          axes: { warmth: 1 }
        },
        {
          label: "見せて見せて",
          next: "n6_img",
          axes: { warmth: 1 }
        }
      ]
    },
    {
      id: "n6_img",
      speaker: "image",
      src: "img/sakura-room/sakura-hawker-selfie.png",
      alt: "ホーカーの雑多な背景でわくわく顔のさくら",
      caption: "ここ初めて来たっちゃ！ {name}にも見せたくて"
    },
    {
      id: "n7",
      speaker: "sakura",
      lines: [
        "ひとりで行ったけど、{name}と一緒やったらもっと楽しかったやろうなって。",
        "あ、ごめん。なんでもない。"
      ],
      next: "n8"
    },
    {
      id: "n8",
      speaker: "sakura",
      lines: [
        "でもこうやって{name}に報告できるのが嬉しいんよ。",
        "次はどこのホーカー行こうかな。"
      ],
      end: true
    }
  ]
};

// ── Main logic ──

const fileMap = {
  'phase2-early-b.json': ['b04_kaya_toast', 'b16_first_photo'],
  'phase2-mid-b.json': ['b22_satay', 'b24_tiong_bahru', 'b35_night_skyline', 'b39_ice_kachang'],
  'phase2-late-b.json': ['b47_rooftop', 'b54_pet_cat', 'b66_one_north_lunch', 'b71_hawker_selfie']
};

let totalFixed = 0;

for (const [filename, convIds] of Object.entries(fileMap)) {
  const filePath = path.join(dataDir, filename);
  console.log(`\nProcessing ${filename}...`);

  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  for (const convId of convIds) {
    const conv = data.find(c => c.id === convId);
    if (!conv) {
      console.error(`  ERROR: conversation ${convId} not found in ${filename}`);
      continue;
    }

    const newNodes = replacements[convId];
    if (!newNodes) {
      console.error(`  ERROR: no replacement defined for ${convId}`);
      continue;
    }

    const oldImageCount = conv.nodes.filter(n => n.speaker === 'image').length;
    const newImageCount = newNodes.filter(n => n.speaker === 'image').length;

    // Verify image data is preserved
    const oldImg = conv.nodes.find(n => n.speaker === 'image');
    const newImg = newNodes.find(n => n.speaker === 'image');

    if (oldImg && newImg) {
      if (oldImg.src !== newImg.src) {
        console.error(`  ERROR: image src mismatch for ${convId}: ${oldImg.src} vs ${newImg.src}`);
        continue;
      }
    }

    // Find image position in old vs new
    const oldImgIdx = conv.nodes.findIndex(n => n.speaker === 'image');
    const newImgIdx = newNodes.findIndex(n => n.speaker === 'image');

    console.log(`  ${convId}: image moved from position ${oldImgIdx} -> ${newImgIdx} (of ${newNodes.length} nodes)`);

    conv.nodes = newNodes;
    totalFixed++;
  }

  // Write back with 2-space indent
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  Written: ${filePath}`);
}

console.log(`\nDone! Fixed ${totalFixed} conversations.`);
