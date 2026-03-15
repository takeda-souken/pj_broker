/**
 * About view — version history, credits, disclaimer
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { triText } from '../utils/i18n.js';

const VERSION_HISTORY = [
  {
    version: '1.3.0',
    date: '2026-03-07',
    changes: [
      'XP / Level system with 10 career levels',
      '15 unlockable achievements',
      'Daily study goal with progress tracking',
      '28-day study streak calendar',
      'Keyboard shortcuts for quiz (1-4, Enter, S to skip)',
      'Wrong answer journal for targeted review',
      'Skip question button in practice mode',
      'Mixed practice mode (both modules)',
      'Confetti celebration for perfect scores',
      'Vibration feedback on wrong answers (mobile)',
      'Exam tips & food trivia categories (25 new entries)',
      'More Kataoka encouragement messages',
      'Print-friendly result page',
      'Page transition animations & card entrance effects',
      'Responsive font sizing for small screens',
      'Focus-visible accessibility states',
      'Skeleton loading placeholders',
      'Difficulty indicator badges on questions',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-07',
    changes: [
      'Virtual supporter さくら (Hakata dialect, toggleable)',
      'Exam countdown timer on home screen',
      'Spaced repetition & difficulty progression',
      'Per-choice explanations in answer review',
      'Topic drill mode in study selection',
      'Lazy route loading for faster startup',
      'About page with version history & credits',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-07',
    changes: [
      'Chart.js visualizations (donut, daily accuracy, topic bars)',
      'Weakness analysis & adaptive quiz weighting',
      'Choice shuffle with answer index remapping',
      'Review wrong answers from result screen',
      'Score color grading & smart navigation',
      'Average answer time tracking',
      'MRT route map with station unlocking',
      'Hawker dish collection',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-07',
    changes: [
      'Initial release',
      'BCP & ComGI practice / mock exam modes',
      'Keyword highlighting & glossary tooltips',
      'Singapore & Tokyo skyline backgrounds',
      'Kataoka mode with encouragement messages',
      'Dark mode support',
    ],
  },
];

registerRoute('#about', (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.append('\u25C0 ');
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('about.title', 'About BrokerPass SG'));
  app.appendChild(h1);

  // Credits
  const credits = el('div', { className: 'card' });
  credits.appendChild(el('h3', {}, 'Credits'));
  credits.appendChild(el('div', { className: 'text-sm' }, 'Developed by'));
  credits.appendChild(el('div', { style: 'font-weight:700;font-size:1rem;margin:4px 0;' },
    'Takeda Research Institute, Inc.'));
  credits.appendChild(el('div', { className: 'text-sm text-secondary' },
    '\u00A9 2026 Takeda Research Institute, Inc. All rights reserved.'));
  app.appendChild(credits);

  // Disclaimer (humorous, in Japanese)
  const disclaimer = el('div', { className: 'card' });
  disclaimer.appendChild(el('h3', {}, 'Disclaimer'));
  const disclaimerText = el('div', { className: 'text-sm', style: 'line-height:1.8;' });
  disclaimerText.innerHTML = [
    '\u203B \u672C\u30A2\u30D7\u30EA\u306F\u300C\u7D76\u5BFE\u53D7\u304B\u308B\u300D\u3068\u306F\u8A00\u3063\u3066\u307E\u305B\u3093\u3002\u300C\u53D7\u304B\u3089\u306A\u3044\u3088\u308A\u53D7\u304B\u308B\u65B9\u304C\u826F\u3044\u300D\u3068\u306F\u8A00\u3063\u3066\u3044\u307E\u3059\u3002',
    '\u203B \u52C9\u5F37\u306E\u3057\u3059\u304E\u306B\u3088\u308B\u4F53\u8ABF\u4E0D\u826F\u306B\u3064\u3044\u3066\u306F\u8CAC\u4EFB\u3092\u8CA0\u3044\u304B\u306D\u307E\u3059\u3002\u9069\u5EA6\u306B\u30DB\u30FC\u30AB\u30FC\u30BB\u30F3\u30BF\u30FC\u3067\u4F11\u61A9\u3057\u3066\u304F\u3060\u3055\u3044\u3002',
    '\u203B \u3055\u304F\u3089\u306E\u535A\u591A\u5F01\u306F\u958B\u767A\u8005\u306E\u8DA3\u5473\u3067\u3042\u308A\u3001SCI\u8A66\u9A13\u3068\u306F\u4E00\u5207\u95A2\u4FC2\u3042\u308A\u307E\u305B\u3093\u3002',
    '\u203B \u30DE\u30FC\u30E9\u30A4\u30AA\u30F3\u304C\u6C34\u3092\u5674\u304F\u6F14\u51FA\u304C\u3042\u308A\u307E\u3059\u304C\u3001\u5B9F\u969B\u306E\u30DE\u30FC\u30E9\u30A4\u30AA\u30F3\u306F\u3082\u3063\u3068\u304B\u3063\u3053\u3088\u304F\u5674\u304D\u307E\u3059\u3002',
    '\u203B \u3053\u306E\u30A2\u30D7\u30EA\u3092\u4F7F\u3063\u3066\u4E0D\u5408\u683C\u306B\u306A\u3063\u305F\u5834\u5408\u3001\u305D\u308C\u306F\u305F\u3076\u3093\u52C9\u5F37\u4E0D\u8DB3\u3067\u3059\u3002\u30A2\u30D7\u30EA\u306E\u305B\u3044\u306B\u3057\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002',
  ].join('<br>');
  disclaimer.appendChild(disclaimerText);
  app.appendChild(disclaimer);

  // Version history
  app.appendChild(el('h2', { className: 'mt-lg' }, 'Version History'));
  for (const v of VERSION_HISTORY) {
    const card = el('div', { className: 'card' });
    card.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:center;' },
      el('span', { style: 'font-weight:700;' }, `v${v.version}`),
      el('span', { className: 'text-sm text-secondary' }, v.date),
    ));
    const list = el('ul', { style: 'margin:8px 0 0 16px;font-size:0.85rem;line-height:1.6;' });
    for (const change of v.changes) {
      list.appendChild(el('li', {}, change));
    }
    card.appendChild(list);
    app.appendChild(card);
  }
});
