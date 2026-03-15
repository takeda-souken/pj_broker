/**
 * Records view — study history and statistics with Chart.js visualizations
 * Total / BCP / ComGI segmented control with topic breakdown and charts
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';
import { SettingsStore } from '../models/settings-store.js';
import { loadChartJs } from '../utils/chart-loader.js';
import { triText, triContent, tr } from '../utils/i18n.js';
import { DebugStore } from '../models/debug-store.js';
import { GamificationStore } from '../models/gamification-store.js';

/** Store active Chart instances so we can destroy on tab switch */
let activeCharts = [];

function destroyCharts() {
  activeCharts.forEach(c => c.destroy());
  activeCharts = [];
}

registerRoute('#records', (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.append('\u25C0 ');
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'mt-sm' });
  h1.appendChild(triText('records.title', 'Study Records'));
  app.appendChild(h1);

  // Segmented control: Total / BCP / ComGI / PGI / HI
  let activeTab = 'total';
  const seg = el('div', { className: 'seg-control seg-control--records mt-sm' });
  const tabs = [
    { id: 'total', label: tr('records.total', 'Total'), colorClass: 'seg-control__item--total' },
    { id: 'bcp', label: 'BCP', colorClass: 'seg-control__item--bcp' },
    { id: 'comgi', label: 'ComGI', colorClass: 'seg-control__item--comgi' },
    { id: 'pgi', label: 'PGI', colorClass: 'seg-control__item--pgi' },
    { id: 'hi', label: 'HI', colorClass: 'seg-control__item--hi' },
  ];
  const tabBtns = tabs.map(t =>
    el('button', {
      className: 'seg-control__item ' + t.colorClass + (t.id === activeTab ? ' seg-control__item--active' : ''),
      onClick: () => switchTab(t.id),
    }, t.label)
  );
  tabBtns.forEach(b => seg.appendChild(b));
  app.appendChild(seg);

  const content = el('div', { className: 'records-layout mt-sm' });
  app.appendChild(content);

  function switchTab(tab) {
    activeTab = tab;
    destroyCharts();
    tabBtns.forEach((btn, i) => {
      btn.className = 'seg-control__item ' + tabs[i].colorClass + (tabs[i].id === tab ? ' seg-control__item--active' : '');
    });
    renderContent();
  }

  function renderContent() {
    content.innerHTML = '';
    if (activeTab === 'total') {
      renderTotal(content);
    } else {
      renderModuleStats(content, activeTab);
    }
  }

  renderContent();
});

// ─── Total Tab ───────────────────────────────────────────────────

const ALL_MODULES = [
  { id: 'bcp', label: 'BCP', color: 'var(--mrt-red)' },
  { id: 'comgi', label: 'ComGI', color: 'var(--mrt-green)' },
  { id: 'pgi', label: 'PGI', color: 'var(--mrt-purple)' },
  { id: 'hi', label: 'HI', color: 'var(--mrt-blue)' },
];

function renderTotal(container) {
  // ─── Trophy Showcase ─────────────────────────────────────────
  renderTrophyShowcase(container);

  const moduleStats = ALL_MODULES.map(m => ({ ...m, stats: RecordStore.getModuleStats(m.id) }));
  const totalAttempts = moduleStats.reduce((sum, m) => sum + m.stats.attempts, 0);
  const totalCorrect = moduleStats.reduce((sum, m) => sum + m.stats.correct, 0);
  const totalAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const totalMastered = moduleStats.reduce((sum, m) => sum + m.stats.mastered, 0);

  // Stats grid
  const grid = el('div', { className: 'stats-grid' });
  grid.appendChild(statCard(totalAttempts.toString(), 'records.attempts', 'Attempts'));
  grid.appendChild(statCard(totalAccuracy + '%', 'records.accuracy', 'Accuracy'));
  grid.appendChild(statCard(totalMastered.toString(), 'records.mastered', 'Mastered'));
  container.appendChild(grid);

  // Charts section (side by side on desktop)
  const chartsRow = el('div', { className: 'records-charts' });

  // Donut chart: correct / wrong
  if (totalAttempts > 0) {
    const donutWrap = el('div', { className: 'chart-container chart-container--donut' });
    const donutH3 = el('h3', {});
    donutH3.appendChild(triText('records.correctVsWrong', 'Correct vs Wrong'));
    donutWrap.appendChild(donutH3);
    const canvas = el('canvas', {});
    donutWrap.appendChild(canvas);
    chartsRow.appendChild(donutWrap);

    const totalWrong = totalAttempts - totalCorrect;
    renderDonutChart(canvas, totalCorrect, totalWrong);
  }

  // Daily accuracy line chart
  const dailyWrap = el('div', { className: 'chart-container' });
  const dailyH3 = el('h3', {});
  dailyH3.appendChild(triText('records.dailyAccuracy', 'Daily Accuracy'));
  dailyWrap.appendChild(dailyH3);
  const dailyCanvas = el('canvas', {});
  dailyWrap.appendChild(dailyCanvas);
  chartsRow.appendChild(dailyWrap);
  renderDailyChart(dailyCanvas, null);

  container.appendChild(chartsRow);

  // Per-module summary cards
  const byModH3 = el('h3', { className: 'mt-sm' });
  byModH3.appendChild(triText('records.byModule', 'By Module'));
  container.appendChild(byModH3);
  const moduleGrid = el('div', { className: 'flex-col', style: 'gap:var(--sp-sm);' });
  for (const m of moduleStats) {
    moduleGrid.appendChild(moduleSummaryCard(m.label, m.stats, m.color));
  }
  container.appendChild(moduleGrid);

  // Weakness analysis
  renderWeaknessAnalysis(container, null);
}

// ─── Module Tab ──────────────────────────────────────────────────

function renderModuleStats(container, module) {
  const stats = RecordStore.getModuleStats(module);

  const grid = el('div', { className: 'stats-grid' });
  grid.appendChild(statCard(stats.attempts.toString(), 'records.attempts', 'Attempts'));
  grid.appendChild(statCard(stats.accuracy + '%', 'records.accuracy', 'Accuracy'));
  grid.appendChild(statCard(stats.mastered.toString(), 'records.mastered', 'Mastered'));
  container.appendChild(grid);

  // Topic breakdown table
  const topicStats = RecordStore.getTopicStats();
  const moduleTopics = Object.values(topicStats).filter(s => s.module === module);

  if (moduleTopics.length === 0) {
    const noRec = el('div', { className: 'text-center text-secondary mt-sm' });
    noRec.appendChild(triText('records.noRecords', 'No study data yet. Start practicing!'));
    container.appendChild(noRec);
    return;
  }

  // Charts section (side by side on desktop)
  const chartsRow = el('div', { className: 'records-charts' });

  // Per-topic horizontal bar chart
  const barWrap = el('div', { className: 'chart-container' });
  const barH3 = el('h3', {});
  barH3.appendChild(triText('records.topicAccuracy', 'Topic Accuracy'));
  barWrap.appendChild(barH3);
  const barCanvas = el('canvas', {});
  barWrap.appendChild(barCanvas);
  chartsRow.appendChild(barWrap);
  renderTopicBarChart(barCanvas, moduleTopics, module);

  // Daily accuracy line chart
  const dailyWrap = el('div', { className: 'chart-container' });
  const dailyH3 = el('h3', {});
  dailyH3.appendChild(triText('records.dailyAccuracy', 'Daily Accuracy'));
  dailyWrap.appendChild(dailyH3);
  const dailyCanvas = el('canvas', {});
  dailyWrap.appendChild(dailyCanvas);
  chartsRow.appendChild(dailyWrap);
  renderDailyChart(dailyCanvas, module);

  container.appendChild(chartsRow);

  // Topic table
  const table = el('table', { className: 'topic-table mt-sm' });
  const headerRow = el('tr', {});
  const thTopic = el('th', {});
  thTopic.appendChild(triText('records.topic', 'Topic'));
  const thAcc = el('th', {});
  thAcc.appendChild(triText('records.acc', 'Acc.'));
  const thStreak = el('th', {});
  thStreak.appendChild(triText('records.streak', 'Streak'));
  headerRow.appendChild(thTopic);
  headerRow.appendChild(thAcc);
  headerRow.appendChild(thStreak);
  table.appendChild(headerRow);

  moduleTopics.sort((a, b) => (a.correct / a.attempts) - (b.correct / b.attempts));
  for (const s of moduleTopics) {
    const pct = Math.round((s.correct / s.attempts) * 100);
    const row = el('tr', {},
      el('td', {}, s.topic + (s.mastered ? ' \u2605' : '')),
      el('td', {}, `${pct}% (${s.correct}/${s.attempts})`),
      el('td', {}, s.streak.toString()),
    );
    table.appendChild(row);
  }
  container.appendChild(table);

  // Weakness analysis
  renderWeaknessAnalysis(container, module);
}

// ─── Weakness Analysis ───────────────────────────────────────────

function renderWeaknessAnalysis(container, module) {
  const weakTopics = module
    ? RecordStore.getWeakTopics(module, 5)
    : ALL_MODULES.flatMap(m => RecordStore.getWeakTopics(m.id, 2));

  const trends = module
    ? RecordStore.getTopicTrends(module)
    : ALL_MODULES.flatMap(m => RecordStore.getTopicTrends(m.id));

  const declining = trends.filter(t => t.trend === 'declining');
  const improving = trends.filter(t => t.trend === 'improving');

  if (weakTopics.length === 0 && declining.length === 0 && improving.length === 0) return;

  const section = el('div', { className: 'card analysis-card mt-sm' });
  const analysisH3 = el('h3', { style: 'margin-bottom:12px;' });
  analysisH3.appendChild(triText('records.weaknessAnalysis', 'Weakness Analysis'));
  section.appendChild(analysisH3);

  // Weak topics
  if (weakTopics.length > 0) {
    const weakLabel = el('div', { className: 'analysis-label analysis-label--danger' });
    weakLabel.appendChild(triText('records.weakTopics', 'Weak Topics'));
    section.appendChild(weakLabel);
    for (const w of weakTopics) {
      const pct = Math.round((w.correct / w.attempts) * 100);
      const item = el('div', { className: 'analysis-item' });
      const bar = el('div', { className: 'analysis-bar' });
      const fill = el('div', {
        className: 'analysis-bar__fill',
        style: `width:${pct}%;background:var(--c-danger);`,
      });
      bar.appendChild(fill);
      item.appendChild(el('div', { className: 'analysis-item__name' }, w.topic));
      item.appendChild(bar);
      item.appendChild(el('div', { className: 'analysis-item__pct' }, `${pct}%`));
      section.appendChild(item);
    }
  }

  // Declining topics
  if (declining.length > 0) {
    const decLabel = el('div', { className: 'analysis-label analysis-label--warning mt-sm' });
    decLabel.appendChild(triText('records.declining', 'Declining'));
    section.appendChild(decLabel);
    for (const t of declining) {
      const item = el('div', { className: 'analysis-item' });
      item.appendChild(el('div', { className: 'analysis-item__name' }, t.topic));
      item.appendChild(el('div', {
        className: 'text-sm',
        style: 'color:var(--c-warning);',
      }, `${t.overallAcc}% \u2192 ${t.recentAcc}% \u2193`));
      section.appendChild(item);
    }
  }

  // Improving topics
  if (improving.length > 0) {
    const impLabel = el('div', { className: 'analysis-label analysis-label--success mt-sm' });
    impLabel.appendChild(triText('records.improving', 'Improving'));
    section.appendChild(impLabel);
    for (const t of improving) {
      const item = el('div', { className: 'analysis-item' });
      item.appendChild(el('div', { className: 'analysis-item__name' }, t.topic));
      item.appendChild(el('div', {
        className: 'text-sm',
        style: 'color:var(--c-success);',
      }, `${t.overallAcc}% \u2192 ${t.recentAcc}% \u2191`));
      section.appendChild(item);
    }
  }

  // Weak focus status
  const weakFocus = SettingsStore.load().weakFocusEnabled !== false;
  const statusEl = el('div', { className: 'text-sm mt-sm', style: 'opacity:0.7;' });
  statusEl.textContent = weakFocus
    ? tr('records.weakFocusOn', 'Weak Focus ON — practice sessions prioritize weak topics')
    : tr('records.weakFocusOff', 'Weak Focus OFF — practice sessions use random selection');
  section.appendChild(statusEl);

  container.appendChild(section);
}

// ─── Chart Renderers ─────────────────────────────────────────────

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    isDark,
    text: isDark ? '#eeeef6' : '#1a1a2e',
    textSecondary: isDark ? '#a0a0c0' : '#555',
    gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    success: isDark ? '#50e088' : '#28a745',
    danger: isDark ? '#ff5555' : '#dc3545',
    accent: isDark ? '#50ccff' : '#009cde',
    primary: isDark ? '#ff4070' : '#e4002b',
    blue: isDark ? '#4090d0' : '#005da2',
    surface: isDark ? '#1a1a30' : '#ffffff',
    // Dark mode tooltip fix (#20)
    tooltipBg: isDark ? '#2a2a4a' : '#ffffff',
    tooltipBorder: isDark ? '#404068' : 'rgba(0,0,0,0.1)',
  };
}

function renderDonutChart(canvas, correct, wrong) {
  loadChartJs().then(Chart => {
    const c = getChartColors();
    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: [tr('records.chartCorrect', 'Correct'), tr('records.chartWrong', 'Wrong')],
        datasets: [{
          data: [correct, wrong],
          backgroundColor: [c.success, c.danger],
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: c.text, font: { size: 12 }, padding: 16 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = correct + wrong;
                const pct = Math.round((ctx.raw / total) * 100);
                return `${ctx.label}: ${ctx.raw} (${pct}%)`;
              },
            },
          },
        },
      },
    });
    activeCharts.push(chart);
  }).catch(() => {
    canvas.parentElement.innerHTML = `<div class="text-sm text-secondary text-center">${tr('records.chartUnavailable', 'Chart unavailable')}</div>`;
  });
}

function renderDailyChart(canvas, module) {
  const records = RecordStore.getRecords();
  if (records.length === 0) {
    canvas.parentElement.innerHTML = `<div class="text-sm text-secondary text-center">${tr('records.noData', 'No data yet')}</div>`;
    return;
  }

  // Group records by date
  const byDate = {};
  for (const r of records) {
    if (module && r.module !== module) continue;
    const date = r.timestamp ? r.timestamp.slice(0, 10) : null;
    if (!date) continue;
    if (!byDate[date]) byDate[date] = { correct: 0, total: 0 };
    byDate[date].total++;
    if (r.isCorrect) byDate[date].correct++;
  }

  const sortedDates = Object.keys(byDate).sort();
  if (sortedDates.length === 0) {
    canvas.parentElement.innerHTML = `<div class="text-sm text-secondary text-center">${tr('records.noData', 'No data yet')}</div>`;
    return;
  }

  // Determine date range
  const isKataoka = SettingsStore.isKataokaMode();
  const firstDate = sortedDates[0];
  const today = DebugStore.today();
  let endDate = today;

  if (isKataoka) {
    // Cap at April 30 of current year (or next year if already past)
    const year = DebugStore.now().getFullYear();
    const apr30 = `${year}-04-30`;
    endDate = today > apr30 ? `${year + 1}-04-30` : apr30;
  }

  // Build continuous date labels from first record to endDate
  const labels = [];
  const accuracyData = [];
  const countData = [];
  const d = new Date(firstDate);
  const end = new Date(endDate > today ? endDate : today);

  while (d <= end) {
    const ds = d.toISOString().slice(0, 10);
    labels.push(ds);
    if (byDate[ds]) {
      accuracyData.push(Math.round((byDate[ds].correct / byDate[ds].total) * 100));
      countData.push(byDate[ds].total);
    } else {
      accuracyData.push(null);
      countData.push(0);
    }
    d.setDate(d.getDate() + 1);
  }

  // Format labels as M/D
  const displayLabels = labels.map(ds => {
    const [, m, day] = ds.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
  });

  loadChartJs().then(Chart => {
    const c = getChartColors();

    // Determine tick step based on data range
    const maxTicks = labels.length > 30 ? 8 : labels.length > 14 ? 6 : undefined;

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: displayLabels,
        datasets: [
          {
            label: tr('records.chartAccuracy', 'Accuracy %'),
            data: accuracyData,
            borderColor: c.accent,
            backgroundColor: c.accent + '22',
            fill: true,
            tension: 0.3,
            spanGaps: true,
            pointRadius: labels.length > 30 ? 0 : 3,
            pointHoverRadius: 5,
            pointBackgroundColor: c.accent,
            borderWidth: 2,
            yAxisID: 'y',
          },
          {
            label: tr('records.chartQuestions', 'Questions'),
            data: countData,
            borderColor: c.textSecondary + '80',
            backgroundColor: c.textSecondary + '15',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [4, 4],
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: c.text, font: { size: 11 }, padding: 12 },
          },
          tooltip: {
            backgroundColor: c.tooltipBg,
            titleColor: c.text,
            bodyColor: c.text,
            borderColor: c.tooltipBorder,
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: c.textSecondary,
              font: { size: 10 },
              maxTicksLimit: maxTicks,
              maxRotation: 45,
            },
            grid: { color: c.gridColor },
          },
          y: {
            position: 'left',
            min: 0,
            max: 100,
            ticks: {
              color: c.accent,
              font: { size: 10 },
              callback: v => v + '%',
              stepSize: 25,
            },
            grid: { color: c.gridColor },
          },
          y1: {
            position: 'right',
            min: 0,
            ticks: {
              color: c.textSecondary,
              font: { size: 10 },
              stepSize: 5,
            },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
    activeCharts.push(chart);

    // Add goal line annotation for Kataoka mode
    if (isKataoka && endDate > today) {
      const todayIdx = labels.indexOf(today);
      if (todayIdx >= 0) {
        const todayLabel = el('div', {
          className: 'chart-today-marker text-sm',
          style: `color:${c.primary};font-weight:700;text-align:center;margin-top:4px;`,
        });
        todayLabel.textContent = tr('records.todayGoal', 'Today \u2192 Goal: Apr 30');
        canvas.parentElement.appendChild(todayLabel);
      }
    }
  }).catch(() => {
    canvas.parentElement.innerHTML = `<div class="text-sm text-secondary text-center">${tr('records.chartUnavailable', 'Chart unavailable')}</div>`;
  });
}

function renderTopicBarChart(canvas, moduleTopics, module) {
  const sorted = [...moduleTopics].sort((a, b) => {
    const accA = a.attempts > 0 ? (a.correct / a.attempts) : 0;
    const accB = b.attempts > 0 ? (b.correct / b.attempts) : 0;
    return accA - accB;
  });

  const labels = sorted.map(s => truncateLabel(s.topic, 22));
  const data = sorted.map(s => s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0);

  loadChartJs().then(Chart => {
    const c = getChartColors();
    const moduleColorMap = {
      bcp: c.isDark ? '#ff4060' : '#e4002b',
      comgi: c.isDark ? '#30c060' : '#009645',
      pgi: c.isDark ? '#b850d8' : '#9e28b4',
      hi: c.isDark ? '#4090d0' : '#005da2',
    };
    const barColor = moduleColorMap[module] || c.accent;

    // Color bars by performance
    const bgColors = data.map(v => {
      if (v >= 80) return c.success + 'cc';
      if (v >= 50) return barColor + 'cc';
      return c.danger + 'cc';
    });

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: tr('records.chartAccuracy', 'Accuracy %'),
          data,
          backgroundColor: bgColors,
          borderRadius: 4,
          barThickness: sorted.length > 8 ? 16 : 24,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => sorted[items[0].dataIndex].topic,
              label: (ctx) => {
                const s = sorted[ctx.dataIndex];
                return `${ctx.raw}% (${s.correct}/${s.attempts})`;
              },
            },
            backgroundColor: c.tooltipBg,
            titleColor: c.text,
            bodyColor: c.text,
            borderColor: c.tooltipBorder,
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: {
              color: c.textSecondary,
              font: { size: 10 },
              callback: v => v + '%',
              stepSize: 25,
            },
            grid: { color: c.gridColor },
          },
          y: {
            ticks: {
              color: c.text,
              font: { size: 11 },
            },
            grid: { display: false },
          },
        },
      },
    });
    activeCharts.push(chart);

    // Set dynamic height based on topic count
    const h = Math.max(180, sorted.length * 36 + 40);
    canvas.parentElement.style.height = h + 'px';
  }).catch(() => {
    canvas.parentElement.innerHTML = `<div class="text-sm text-secondary text-center">${tr('records.chartUnavailable', 'Chart unavailable')}</div>`;
  });
}

// ─── Helpers ─────────────────────────────────────────────────────

function truncateLabel(text, maxLen) {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + '\u2026' : text;
}

function moduleSummaryCard(name, stats, color) {
  const card = el('div', { className: 'card', style: `border-left: 4px solid ${color};` });
  const row = el('div', { className: 'flex-row', style: 'justify-content:space-between;' });
  row.appendChild(el('div', { style: 'font-weight:700;' }, name));
  row.appendChild(el('div', { className: 'text-sm text-secondary' },
    tr('records.moduleSummary', `${stats.attempts} attempts \u00B7 ${stats.accuracy}% \u00B7 ${stats.mastered} mastered`, stats.attempts, stats.accuracy, stats.mastered)));
  card.appendChild(row);

  if (stats.attempts > 0) {
    const barOuter = el('div', { className: 'accuracy-bar', style: 'width:100%;height:6px;margin-top:8px;' });
    const barFill = el('div', { className: 'accuracy-bar__fill' });
    barFill.style.width = stats.accuracy + '%';
    if (stats.accuracy >= 70) barFill.style.background = 'var(--c-success)';
    else if (stats.accuracy >= 50) barFill.style.background = 'var(--c-warning)';
    else barFill.style.background = 'var(--c-danger)';
    barOuter.appendChild(barFill);
    card.appendChild(barOuter);
  }
  return card;
}

function statCard(value, key, fallback) {
  const card = el('div', { className: 'stat-card' });
  card.appendChild(el('div', { className: 'stat-card__value' }, value));
  const label = el('div', { className: 'stat-card__label' });
  label.appendChild(triText(key, fallback));
  card.appendChild(label);
  return card;
}

// ─── Trophy Showcase ──────────────────────────────────────────────

function renderTrophyShowcase(container) {
  const gameData = GamificationStore.load();
  const levelInfo = GamificationStore.getLevel(gameData.xp);
  const allAch = GamificationStore.getAllAchievements();
  const unlocked = allAch.filter(a => a.unlocked);
  const studyDays = GamificationStore.getStudyDays().length;
  const dailyStreak = GamificationStore.getLongestDailyStreak();

  const showcase = el('div', { className: 'trophy-showcase' });

  // ── Hero: Level + XP ring ──
  const hero = el('div', { className: 'trophy-hero' });

  // Circular progress ring (SVG)
  const ringSize = 120;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - levelInfo.progress);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', ringSize);
  svg.setAttribute('height', ringSize);
  svg.setAttribute('class', 'trophy-hero__ring');

  const bgCircle = document.createElementNS(svgNS, 'circle');
  bgCircle.setAttribute('cx', ringSize / 2);
  bgCircle.setAttribute('cy', ringSize / 2);
  bgCircle.setAttribute('r', radius);
  bgCircle.setAttribute('class', 'trophy-ring__bg');
  bgCircle.setAttribute('stroke-width', strokeWidth);
  svg.appendChild(bgCircle);

  const fgCircle = document.createElementNS(svgNS, 'circle');
  fgCircle.setAttribute('cx', ringSize / 2);
  fgCircle.setAttribute('cy', ringSize / 2);
  fgCircle.setAttribute('r', radius);
  fgCircle.setAttribute('class', 'trophy-ring__fill');
  fgCircle.setAttribute('stroke-width', strokeWidth);
  fgCircle.setAttribute('stroke-dasharray', circumference);
  fgCircle.setAttribute('stroke-dashoffset', progressOffset);
  svg.appendChild(fgCircle);

  const ringCenter = el('div', { className: 'trophy-hero__center' });
  ringCenter.appendChild(el('div', { className: 'trophy-hero__level' }, `Lv.${levelInfo.level}`));
  const titleEl = el('div', { className: 'trophy-hero__title' });
  titleEl.appendChild(triContent(levelInfo.title, levelInfo.titleJA));
  ringCenter.appendChild(titleEl);

  const ringWrap = el('div', { className: 'trophy-hero__ring-wrap' });
  ringWrap.appendChild(svg);
  ringWrap.appendChild(ringCenter);
  hero.appendChild(ringWrap);

  // Stats beside ring
  const heroStats = el('div', { className: 'trophy-hero__stats' });
  heroStats.appendChild(heroStat(gameData.xp.toLocaleString(), 'XP'));
  heroStats.appendChild(heroStat(`${unlocked.length}/${allAch.length}`, tr('records.trophies', 'Trophies')));
  heroStats.appendChild(heroStat(studyDays.toString(), tr('records.studyDays', 'Study Days')));
  heroStats.appendChild(heroStat(dailyStreak.toString(), tr('records.bestDailyStreak', 'Best Streak (Days)')));
  hero.appendChild(heroStats);

  showcase.appendChild(hero);

  // ── Unlocked achievements — medal parade ──
  if (unlocked.length > 0) {
    const unlockedSection = el('div', { className: 'trophy-unlocked' });
    const unlockedLabel = el('div', { className: 'trophy-section-label trophy-section-label--gold' });
    unlockedLabel.appendChild(triText('records.unlockedTrophies', 'Unlocked'));
    unlockedSection.appendChild(unlockedLabel);

    const medals = el('div', { className: 'trophy-medals' });
    for (const a of unlocked) {
      const medal = el('div', { className: 'trophy-medal' });
      medal.appendChild(el('div', { className: 'trophy-medal__icon' }, a.icon));
      const medalName = el('div', { className: 'trophy-medal__name' });
      medalName.appendChild(triContent(a.name, a.nameJA));
      medal.appendChild(medalName);
      const tip = el('div', { className: 'trophy-tooltip' });
      tip.appendChild(triText(`ach.${a.id}`, a.desc));
      medal.appendChild(tip);
      medals.appendChild(medal);
    }
    unlockedSection.appendChild(medals);
    showcase.appendChild(unlockedSection);
  }

  // ── "View All" link ──
  const viewAll = el('button', {
    className: 'trophy-view-all',
    onClick: () => navigate('#achievements'),
  });
  viewAll.appendChild(triText('records.viewAllAchievements', 'View All Achievements'));
  viewAll.appendChild(el('span', {}, ' \u203A'));
  showcase.appendChild(viewAll);

  container.appendChild(showcase);
}

function heroStat(value, label) {
  const stat = el('div', { className: 'trophy-hero__stat' });
  stat.appendChild(el('div', { className: 'trophy-hero__stat-value' }, value));
  stat.appendChild(el('div', { className: 'trophy-hero__stat-label' }, label));
  return stat;
}
