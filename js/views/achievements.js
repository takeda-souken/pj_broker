/**
 * Achievements view — displays all achievements and unlock status
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { GamificationStore } from '../models/gamification-store.js';
import { triText, triContent, tr } from '../utils/i18n.js';

registerRoute('#achievements', (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#records') });
  backBtn.appendChild(document.createTextNode('\u25C0 '));
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('achievements.title', 'Achievements'));
  app.appendChild(h1);

  const allAch = GamificationStore.getAllAchievements();
  const unlocked = allAch.filter(a => a.unlocked).length;
  const summaryDiv = el('div', { className: 'text-center text-secondary mb-md' });
  summaryDiv.appendChild(document.createTextNode(`${unlocked}/${allAch.length} `));
  summaryDiv.appendChild(triText('achievements.unlocked', 'unlocked'));
  app.appendChild(summaryDiv);

  // XP summary + level staircase
  const gameData = GamificationStore.load();
  const levelInfo = GamificationStore.getLevel(gameData.xp);
  const allLevels = GamificationStore.getLevels();
  const maxLv = allLevels.length;
  const minH = 28;   // px — shortest step (Lv.1)
  const maxH = 140;  // px — tallest step (Lv.10)

  const stairCard = el('div', { className: 'card level-staircase' });
  const stairTitle = el('div', { className: 'level-staircase__header' });
  stairTitle.appendChild(el('span', { style: 'font-size:1.4rem;font-weight:800;color:var(--c-gold);' }, `Lv.${levelInfo.level}`));
  const titleLabel = el('span', { className: 'text-sm', style: 'color:var(--c-gold);' });
  titleLabel.appendChild(triContent(levelInfo.title, levelInfo.titleJA));
  stairTitle.appendChild(titleLabel);
  stairTitle.appendChild(el('span', { className: 'text-sm text-secondary' }, `${gameData.xp} XP`));
  stairCard.appendChild(stairTitle);

  // Boxes row (aligned to bottom)
  const boxRow = el('div', { className: 'level-stairs__boxes' });
  // Marker row (▼ only for current level, empty for others)
  const markerRow = el('div', { className: 'level-stairs__markers' });
  // Labels row
  const labelRow = el('div', { className: 'level-stairs__labels' });

  for (let i = 0; i < allLevels.length; i++) {
    const lv = allLevels[i];
    const isCurrent = lv.level === levelInfo.level;
    const isReached = gameData.xp >= lv.xp;
    const h = minH + (maxH - minH) * (i / (maxLv - 1));
    const cls = isCurrent ? 'level-step--current' : isReached ? 'level-step--reached' : '';

    // Box cell — only the box, no marker
    const cell = el('div', { className: `level-step__cell ${cls}` });
    const box = el('div', { className: 'level-step__box', style: `height:${Math.round(h)}px` });
    box.appendChild(el('span', { className: 'level-step__lv' }, `${lv.level}`));
    cell.appendChild(box);
    boxRow.appendChild(cell);

    // Marker cell
    const markerCell = el('div', { className: 'level-step__marker-cell' });
    if (isCurrent) {
      markerCell.appendChild(el('span', { className: 'level-step__marker' }, '\u25BC'));
    }
    markerRow.appendChild(markerCell);

    // Label cell
    const label = el('div', { className: `level-step__label ${cls}` });
    label.appendChild(triContent(lv.title, lv.titleJA));
    labelRow.appendChild(label);
  }

  stairCard.appendChild(boxRow);
  stairCard.appendChild(markerRow);
  stairCard.appendChild(labelRow);
  app.appendChild(stairCard);

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
  const statsH3 = el('h3', {});
  statsH3.appendChild(triText('achievements.stats', 'Statistics'));
  statsCard.appendChild(statsH3);
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
