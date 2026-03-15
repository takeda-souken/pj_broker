/**
 * MRT Line Tutorial Modal
 *
 * Shows a full-screen tutorial overlay when a new MRT line is unlocked
 * for the first time. Sakura introduces the line, explains its real-world
 * character, and links it to the corresponding exam module.
 *
 * - Blocks all interaction until dismissed via the "OK!" button
 * - Uses localStorage to track which intros have been shown
 * - Sakura speaks in Phase 1 (standard polite Japanese) style
 */
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { navigate } from '../router.js';

const STORAGE_KEY = 'sg_broker_mrt_intro_shown';

/** Line intro content — Phase 1 (polite/standard) */
const LINE_INTROS = {
  ns: {
    lineName: 'North-South Line',
    lineColor: '#e4002b',
    lineEmoji: '🔴',
    module: 'BCP',
    moduleFullName: 'Basic Concepts & Principles',
    message: 'BCPの問題に初めて正解しましたね！North-South Lineがアンロックされました！\n\nちなみに、この路線はシンガポールMRTの元祖で、1987年に開業した最古の基幹路線なんですよ。南北を貫いてCity Hallからマリーナまで、ビジネスの中心を走っています。\n\nBCPは保険の基礎原則を学ぶ科目——まさにこの路線のように、すべての土台になる存在です。正解するたびに、City Hallから駅が広がっていきますよ。',
  },
  ew: {
    lineName: 'East-West Line',
    lineColor: '#009645',
    lineEmoji: '🟢',
    module: 'ComGI',
    moduleFullName: 'Commercial General Insurance',
    message: 'ComGIの問題に初めて正解しましたね！East-West Lineがアンロックされました！\n\nちなみに、この路線は東のPasir Risから西のTuas Linkまで、シンガポールを東西に横断する緑の路線なんですよ。工業地帯のTuasまで延伸していて、商業・産業の大動脈です。\n\nComGIは法人向け損害保険の各種目を学ぶ科目——商業の現場を結ぶこの路線にぴったりですね。',
  },
  ne: {
    lineName: 'North-East Line',
    lineColor: '#9016b2',
    lineEmoji: '🟣',
    module: 'PGI',
    moduleFullName: 'Personal General Insurance',
    message: 'PGIの問題に初めて正解しましたね！North-East Lineがアンロックされました！\n\nちなみに、この路線は2003年に開業した、世界初の全自動無人運転の地下鉄なんですよ。HarbourFrontからPunggolまで、北東部の住宅地を結んでいます。\n\nPGIは個人向け保険——自動車、住宅、旅行、傷害——を学ぶ科目。住まいの街を走る紫の路線と、よく似合っていますね。',
  },
  dt: {
    lineName: 'Downtown Line',
    lineColor: '#005ec4',
    lineEmoji: '🔵',
    module: 'HI',
    moduleFullName: 'Health Insurance',
    message: 'HIの問題に初めて正解しましたね！Downtown Lineがアンロックされました！\n\nちなみに、この路線はシンガポールで最も新しいMRT路線の一つで、2013年から段階的に開業しました。都心の地下を通る、まさに新世代の路線です。\n\nHIは健康保険を学ぶ科目——CareShield Lifeなど近年急速に整備が進む分野で、この最新路線のイメージにぴったりですね。',
  },
};

/**
 * Check which line intros have already been shown.
 */
function getShownIntros() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function markIntroShown(lineId) {
  const shown = getShownIntros();
  shown[lineId] = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shown));
}

/**
 * Check if a line's tutorial should be shown.
 * Call this when a user first answers correctly for a given module.
 *
 * @param {string} lineId - 'ns', 'ew', 'ne', or 'dt'
 * @returns {boolean}
 */
export function shouldShowLineIntro(lineId) {
  const settings = SettingsStore.load();
  const shown = getShownIntros();
  return !shown[lineId] && !!LINE_INTROS[lineId];
}

/**
 * Show the MRT line tutorial modal.
 * Returns a Promise that resolves when the user dismisses it.
 *
 * @param {string} lineId - 'ns', 'ew', 'ne', or 'dt'
 * @param {object} [opts] - Options
 * @param {boolean} [opts.deferred] - If true, shown after quiz ended (adjusts button text)
 */
export function showLineIntro(lineId, opts = {}) {
  const intro = LINE_INTROS[lineId];
  if (!intro) return Promise.resolve();

  return new Promise((resolve) => {
    // Overlay — blocks everything
    const overlay = el('div', { className: 'mrt-tutorial-overlay' });

    // Card — pass line color as CSS variable for glow
    const card = el('div', { className: 'mrt-tutorial-card' });
    card.style.setProperty('--line-color', intro.lineColor);

    // Line color accent bar
    const accent = el('div', { className: 'mrt-tutorial-accent' });
    accent.style.background = intro.lineColor;
    card.appendChild(accent);

    // Sakura avatar (large)
    const avatar = el('div', { className: 'mrt-tutorial-avatar' }, '🌸');
    card.appendChild(avatar);

    // Sakura name
    const name = el('div', { className: 'mrt-tutorial-name' }, 'さくら');
    card.appendChild(name);

    // Line badge
    const badge = el('div', { className: 'mrt-tutorial-badge' });
    badge.style.background = intro.lineColor;
    badge.textContent = `${intro.lineEmoji} ${intro.lineName}`;
    card.appendChild(badge);

    // Module info
    const moduleInfo = el('div', { className: 'mrt-tutorial-module' },
      `${intro.module} — ${intro.moduleFullName}`);
    card.appendChild(moduleInfo);

    // Message text (preserve newlines)
    const msgEl = el('div', { className: 'mrt-tutorial-message' });
    const paragraphs = intro.message.split('\n\n');
    for (const p of paragraphs) {
      msgEl.appendChild(el('p', {}, p));
    }
    card.appendChild(msgEl);

    // Button row
    const btnRow = el('div', { className: 'mrt-tutorial-btn-row' });

    const btnContinue = el('button', {
      className: 'btn btn--outline mrt-tutorial-btn',
      onClick: () => {
        markIntroShown(lineId);
        overlay.classList.add('mrt-tutorial-overlay--closing');
        setTimeout(() => {
          overlay.remove();
          resolve('continue');
        }, 300);
      },
    }, opts.deferred ? 'OK!' : 'クイズを続ける');
    btnRow.appendChild(btnContinue);

    // Hide "路線を見る" in deferred mode (quiz already ended, navigate would interrupt result flow)
    if (!opts.deferred) {
      const btnView = el('button', {
        className: 'btn btn--primary mrt-tutorial-btn',
        style: `background: ${intro.lineColor};`,
        onClick: () => {
          markIntroShown(lineId);
          overlay.classList.add('mrt-tutorial-overlay--closing');
          setTimeout(() => {
            overlay.remove();
            navigate('#mrt');
            resolve('view');
          }, 300);
        },
      }, '🗺️ 路線を見る');
      btnRow.appendChild(btnView);
    }

    card.appendChild(btnRow);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Trigger entrance animation
    requestAnimationFrame(() => overlay.classList.add('mrt-tutorial-overlay--open'));
  });
}

/**
 * Show multiple line intros sequentially (one at a time).
 * Each modal appears after the previous one is dismissed.
 *
 * @param {string[]} lineIds - Array of line IDs to show
 * @returns {Promise<void>}
 */
export async function showLineIntroQueue(lineIds) {
  for (const id of lineIds) {
    await showLineIntro(id, { deferred: true });
  }
}

/**
 * Map module name to MRT line ID.
 */
export function moduleToLineId(module) {
  switch (module) {
    case 'bcp': return 'ns';
    case 'comgi': return 'ew';
    case 'pgi': return 'ne';
    case 'hi': return 'dt';
    default: return null;
  }
}
