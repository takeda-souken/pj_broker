/**
 * Achievements view — displays all achievements and unlock status
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { GamificationStore } from '../models/gamification-store.js';
import { tr, trNode } from '../utils/i18n.js';

registerRoute('#achievements', (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#settings') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('achievements.title', 'Achievements'));
  app.appendChild(h1);

  const allAch = GamificationStore.getAllAchievements();
  const unlocked = allAch.filter(a => a.unlocked).length;
  app.appendChild(el('div', { className: 'text-center text-secondary mb-md' },
    `${unlocked}/${allAch.length} ${tr('achievements.unlocked', 'unlocked')}`));

  // XP summary
  const gameData = GamificationStore.load();
  const levelInfo = GamificationStore.getLevel(gameData.xp);
  const summaryCard = el('div', { className: 'card', style: 'text-align:center;' });
  summaryCard.appendChild(el('div', { style: 'font-size:2rem;font-weight:800;color:var(--c-gold);' }, `Lv.${levelInfo.level}`));
  summaryCard.appendChild(el('div', { className: 'text-sm text-secondary' }, levelInfo.title));
  summaryCard.appendChild(el('div', { className: 'text-sm mt-sm' }, `${gameData.xp} XP \u2022 ${gameData.totalQuizzes} quizzes \u2022 ${gameData.totalCorrect} correct`));
  app.appendChild(summaryCard);

  // Achievement grid (2-col on tablet, 3-col on wide desktop)
  const grid = el('div', { className: 'achievements-grid mt-md' });
  for (const a of allAch) {
    const card = el('div', {
      className: `card ${a.unlocked ? '' : 'achievement--locked'}`,
      style: a.unlocked ? 'border-left:4px solid var(--c-gold);' : 'opacity:0.5;',
    });
    const row = el('div', { className: 'flex-row', style: 'gap:12px;' });
    row.appendChild(el('div', { style: 'font-size:1.5rem;' }, a.unlocked ? a.icon : '\uD83D\uDD12'));
    const info = el('div', { style: 'flex:1;' });
    info.appendChild(el('div', { style: 'font-weight:700;' }, a.name));
    info.appendChild(el('div', { className: 'text-sm text-secondary' }, a.desc));
    row.appendChild(info);
    if (a.unlocked) {
      row.appendChild(el('div', { style: 'color:var(--c-gold);font-size:1.2rem;' }, '\u2713'));
    }
    card.appendChild(row);
    grid.appendChild(card);
  }
  app.appendChild(grid);

  // Stats breakdown
  const statsCard = el('div', { className: 'card mt-lg' });
  statsCard.appendChild(el('h3', {}, tr('achievements.stats', 'Statistics')));
  const statsList = [
    ['Total Answered', gameData.totalAnswered],
    ['Total Correct', gameData.totalCorrect],
    ['Best Streak', gameData.bestStreak],
    ['Perfect Quizzes', gameData.perfectQuizzes],
    ['Mock Passes', gameData.mockPasses],
    ['Topics Mastered', gameData.topicsMastered],
  ];
  for (const [label, value] of statsList) {
    const row = el('div', { className: 'flex-row', style: 'justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--c-surface-alt);' });
    row.appendChild(el('span', { className: 'text-sm' }, label));
    row.appendChild(el('span', { className: 'text-sm', style: 'font-weight:700;' }, value.toString()));
    statsCard.appendChild(row);
  }
  app.appendChild(statsCard);
});
