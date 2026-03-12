/**
 * Records view — study history and statistics with Chart.js visualizations
 * Total / BCP / ComGI segmented control with topic breakdown and charts
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';
import { SettingsStore } from '../models/settings-store.js';
import { loadChartJs } from '../utils/chart-loader.js';
import { tr, trNode } from '../utils/i18n.js';

/** Store active Chart instances so we can destroy on tab switch */
let activeCharts = [];

function destroyCharts() {
  activeCharts.forEach(c => c.destroy());
  activeCharts = [];
}

registerRoute('#records', (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('records.title', 'Study Records'));
  app.appendChild(h1);

  // Segmented control: Total / BCP / ComGI
  let activeTab = 'total';
  const seg = el('div', { className: 'seg-control mt-md' });
  const tabs = [
    { id: 'total', label: tr('records.total', 'Total') },
    { id: 'bcp', label: 'BCP' },
    { id: 'comgi', label: 'ComGI' },
  ];
  const tabBtns = tabs.map(t =>
    el('button', {
      className: 'seg-control__item' + (t.id === activeTab ? ' seg-control__item--active' : ''),
      onClick: () => switchTab(t.id),
    }, t.label)
  );
  tabBtns.forEach(b => seg.appendChild(b));
  app.appendChild(seg);

  const content = el('div', { className: 'mt-md' });
  app.appendChild(content);

  function switchTab(tab) {
    activeTab = tab;
    destroyCharts();
    tabBtns.forEach((btn, i) => {
      btn.className = 'seg-control__item' + (tabs[i].id === tab ? ' seg-control__item--active' : '');
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

function renderTotal(container) {
  const bcpStats = RecordStore.getModuleStats('bcp');
  const comgiStats = RecordStore.getModuleStats('comgi');
  const totalAttempts = bcpStats.attempts + comgiStats.attempts;
  const totalCorrect = (bcpStats.attempts > 0 ? Math.round(bcpStats.accuracy * bcpStats.attempts / 100) : 0)
    + (comgiStats.attempts > 0 ? Math.round(comgiStats.accuracy * comgiStats.attempts / 100) : 0);
  const totalAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const totalMastered = bcpStats.mastered + comgiStats.mastered;

  // Stats grid
  const grid = el('div', { className: 'stats-grid' });
  grid.appendChild(statCard(totalAttempts.toString(), tr('records.attempts', 'Attempts')));
  grid.appendChild(statCard(totalAccuracy + '%', tr('records.accuracy', 'Accuracy')));
  grid.appendChild(statCard(totalMastered.toString(), tr('records.mastered', 'Mastered')));
  container.appendChild(grid);

  // Donut chart: correct / wrong
  if (totalAttempts > 0) {
    const donutWrap = el('div', { className: 'chart-container chart-container--donut mt-md' });
    donutWrap.appendChild(el('h3', {}, tr('records.correctVsWrong', 'Correct vs Wrong')));
    const canvas = el('canvas', {});
    donutWrap.appendChild(canvas);
    container.appendChild(donutWrap);

    const totalWrong = totalAttempts - totalCorrect;
    renderDonutChart(canvas, totalCorrect, totalWrong);
  }

  // Daily accuracy line chart
  const dailyWrap = el('div', { className: 'chart-container mt-md' });
  dailyWrap.appendChild(el('h3', {}, tr('records.dailyAccuracy', 'Daily Accuracy')));
  const dailyCanvas = el('canvas', {});
  dailyWrap.appendChild(dailyCanvas);
  container.appendChild(dailyWrap);
  renderDailyChart(dailyCanvas, null);

  // Per-module summary cards
  container.appendChild(el('h3', { className: 'mt-lg' }, tr('records.byModule', 'By Module')));
  const moduleGrid = el('div', { className: 'flex-col gap-sm' });
  moduleGrid.appendChild(moduleSummaryCard('BCP', bcpStats, 'var(--mrt-blue)'));
  moduleGrid.appendChild(moduleSummaryCard('ComGI', comgiStats, 'var(--mrt-red)'));
  container.appendChild(moduleGrid);

  // Weakness analysis
  renderWeaknessAnalysis(container, null);
}

// ─── Module Tab ──────────────────────────────────────────────────

function renderModuleStats(container, module) {
  const stats = RecordStore.getModuleStats(module);

  const grid = el('div', { className: 'stats-grid' });
  grid.appendChild(statCard(stats.attempts.toString(), tr('records.attempts', 'Attempts')));
  grid.appendChild(statCard(stats.accuracy + '%', tr('records.accuracy', 'Accuracy')));
  grid.appendChild(statCard(stats.mastered.toString(), tr('records.mastered', 'Mastered')));
  container.appendChild(grid);

  // Topic breakdown table
  const topicStats = RecordStore.getTopicStats();
  const moduleTopics = Object.values(topicStats).filter(s => s.module === module);

  if (moduleTopics.length === 0) {
    container.appendChild(el('div', { className: 'text-center text-secondary mt-lg' }, tr('records.noRecords', 'No study data yet. Start practicing!')));
    return;
  }

  // Per-topic horizontal bar chart
  const barWrap = el('div', { className: 'chart-container mt-md' });
  barWrap.appendChild(el('h3', {}, tr('records.topicAccuracy', 'Topic Accuracy')));
  const barCanvas = el('canvas', {});
  barWrap.appendChild(barCanvas);
  container.appendChild(barWrap);
  renderTopicBarChart(barCanvas, moduleTopics, module);

  // Daily accuracy line chart
  const dailyWrap = el('div', { className: 'chart-container mt-md' });
  dailyWrap.appendChild(el('h3', {}, tr('records.dailyAccuracy', 'Daily Accuracy')));
  const dailyCanvas = el('canvas', {});
  dailyWrap.appendChild(dailyCanvas);
  container.appendChild(dailyWrap);
  renderDailyChart(dailyCanvas, module);

  // Topic table
  const table = el('table', { className: 'topic-table mt-md' });
  table.appendChild(el('tr', {},
    el('th', {}, tr('records.topic', 'Topic')),
    el('th', {}, tr('records.acc', 'Acc.')),
    el('th', {}, tr('records.streak', 'Streak')),
  ));

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
    : [...RecordStore.getWeakTopics('bcp', 3), ...RecordStore.getWeakTopics('comgi', 3)];

  const trends = module
    ? RecordStore.getTopicTrends(module)
    : [...RecordStore.getTopicTrends('bcp'), ...RecordStore.getTopicTrends('comgi')];

  const declining = trends.filter(t => t.trend === 'declining');
  const improving = trends.filter(t => t.trend === 'improving');

  if (weakTopics.length === 0 && declining.length === 0 && improving.length === 0) return;

  const section = el('div', { className: 'card analysis-card mt-lg' });
  section.appendChild(el('h3', { style: 'margin-bottom:12px;' }, tr('records.weaknessAnalysis', 'Weakness Analysis')));

  // Weak topics
  if (weakTopics.length > 0) {
    section.appendChild(el('div', { className: 'analysis-label analysis-label--danger' }, tr('records.weakTopics', 'Weak Topics')));
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
    section.appendChild(el('div', { className: 'analysis-label analysis-label--warning mt-md' }, tr('records.declining', 'Declining')));
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
    section.appendChild(el('div', { className: 'analysis-label analysis-label--success mt-md' }, tr('records.improving', 'Improving')));
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
  const statusEl = el('div', { className: 'text-sm mt-md', style: 'opacity:0.7;' });
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
  const today = new Date().toISOString().slice(0, 10);
  let endDate = today;

  if (isKataoka) {
    // Cap at April 30 of current year (or next year if already past)
    const year = new Date().getFullYear();
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
    const barColor = module === 'bcp' ? c.blue : c.primary;

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

function statCard(value, label) {
  const card = el('div', { className: 'stat-card' });
  card.appendChild(el('div', { className: 'stat-card__value' }, value));
  card.appendChild(el('div', { className: 'stat-card__label' }, label));
  return card;
}
