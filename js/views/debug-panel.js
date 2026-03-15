/**
 * Debug Panel — overlay UI for development-only debugging tools
 * Only available on localhost. Invisible to production.
 */
import { DebugStore } from '../models/debug-store.js';
import { el } from '../utils/dom-helpers.js';
import { showToast } from '../components/toast.js';
import { GamificationStore } from '../models/gamification-store.js';

let panelEl = null;
let fabEl = null;

/** Initialize the debug FAB button (only on localhost) */
export function initDebugFab() {
  if (!DebugStore.isLocal()) return;

  fabEl = document.createElement('button');
  fabEl.className = 'debug-fab';
  fabEl.textContent = '🐛';
  fabEl.title = 'Debug Panel';
  document.body.appendChild(fabEl);

  fabEl.addEventListener('click', () => {
    // If OFF, turn ON first then open panel
    if (!DebugStore.load().enabled) {
      DebugStore.set('enabled', true);
      showToast('Debug ON', 'info');
    }
    // Toggle panel open/close
    if (panelEl) closePanel(); else openPanel();
  });

  // Update FAB style based on debug state
  updateFabStyle();
  window.addEventListener('debug-changed', updateFabStyle);
}

function updateFabStyle() {
  if (!fabEl) return;
  fabEl.classList.toggle('debug-fab--active', DebugStore.isActive());
}

function togglePanel() {
  if (panelEl) {
    closePanel();
  } else {
    openPanel();
  }
}

function closePanel() {
  if (panelEl) {
    panelEl.classList.add('debug-panel--closing');
    setTimeout(() => { panelEl?.remove(); panelEl = null; }, 200);
  }
}

function openPanel() {
  if (panelEl) return;

  const d = DebugStore.load();

  panelEl = el('div', { className: 'debug-panel' });

  // Header
  const header = el('div', { className: 'debug-panel__header' });
  header.appendChild(el('span', {}, '🐛 Debug Panel'));
  const closeBtn = el('button', { className: 'debug-panel__close', onClick: closePanel }, '✕');
  header.appendChild(closeBtn);
  panelEl.appendChild(header);

  const body = el('div', { className: 'debug-panel__body' });

  // ─── Master toggle ────────────────────────────
  body.appendChild(sectionTitle('Master'));
  body.appendChild(toggleRow('Debug Mode', d.enabled, (v) => {
    DebugStore.set('enabled', v);
    if (!v) {
      // Turned OFF — close panel
      closePanel();
    } else {
      // Turned ON — rebuild panel to show all options
      closePanel();
      setTimeout(openPanel, 250);
    }
  }));

  if (d.enabled) {
    // ─── Auto Mode ────────────────────────────────
    body.appendChild(sectionTitle('Auto Mode'));
    body.appendChild(toggleRow('Auto Answer', d.autoMode, (v) => {
      DebugStore.set('autoMode', v);
      window.dispatchEvent(new Event('debug-auto-changed'));
    }));

    const speedOptions = [
      { label: '0.5s', value: 500 },
      { label: '1s', value: 1000 },
      { label: '2s', value: 2000 },
    ];
    body.appendChild(segmentRow('Speed', speedOptions, d.autoSpeed, (v) => {
      DebugStore.set('autoSpeed', v);
    }));

    const rateOptions = [
      { label: '100%', value: 100 },
      { label: '70%', value: 70 },
    ];
    body.appendChild(segmentRow('Correct Rate', rateOptions, d.autoCorrectRate, (v) => {
      DebugStore.set('autoCorrectRate', v);
      showToast(`Auto correct rate: ${v}%`, 'info');
    }));

    // ─── Virtual Date ─────────────────────────────
    body.appendChild(sectionTitle('Virtual Date'));
    const dateInput = el('input', { type: 'date', className: 'debug-input', value: d.virtualDate });
    dateInput.addEventListener('change', () => {
      DebugStore.set('virtualDate', dateInput.value);
      showToast(`Virtual date: ${dateInput.value || 'OFF'}`, 'info');
    });
    const dateRow = el('div', { className: 'debug-row' });
    dateRow.appendChild(el('span', {}, 'Date'));
    const dateRight = el('div', { style: 'display:flex;gap:4px;align-items:center;' });
    dateRight.appendChild(dateInput);
    const clearDateBtn = el('button', { className: 'debug-btn debug-btn--sm', onClick: () => {
      dateInput.value = '';
      DebugStore.set('virtualDate', '');
      showToast('Virtual date OFF', 'info');
    }}, '✕');
    dateRight.appendChild(clearDateBtn);
    dateRow.appendChild(dateRight);
    body.appendChild(dateRow);

    const nowLabel = el('div', { className: 'debug-hint' },
      `Current: ${DebugStore.now().toISOString().slice(0, 10)}`);
    body.appendChild(nowLabel);

    // ─── Sakura Phase ─────────────────────────────
    body.appendChild(sectionTitle('Sakura Phase'));
    const phaseOptions = [
      { label: 'Auto', value: 0 },
      { label: 'JP', value: 'japan' },
      { label: 'SG', value: 'sg' },
      { label: 'Conf', value: 'post_confession' },
      { label: 'Bye', value: 'farewell' },
      { label: 'Gone', value: 'gone' },
    ];
    body.appendChild(segmentRow('Phase', phaseOptions, d.sakuraPhaseOverride, (v) => {
      DebugStore.set('sakuraPhaseOverride', v);
      showToast(`Sakura phase: ${v === 0 ? 'Auto' : v}`, 'info');
    }));

    // ─── XP / Level ───────────────────────────────
    body.appendChild(sectionTitle('Gamification'));
    const gameData = GamificationStore.load();
    const levelInfo = GamificationStore.getLevel(gameData.xp);
    body.appendChild(el('div', { className: 'debug-hint' },
      `Lv.${levelInfo.level} ${levelInfo.title} (${gameData.xp} XP)`));

    body.appendChild(numberRow('XP', gameData.xp, (v) => {
      DebugStore.setGameField('xp', v);
      showToast(`XP → ${v}`, 'info');
    }));
    body.appendChild(numberRow('Total Correct', gameData.totalCorrect, (v) => {
      DebugStore.setGameField('totalCorrect', v);
      showToast(`totalCorrect → ${v}`, 'info');
    }));
    body.appendChild(numberRow('Total Answered', gameData.totalAnswered, (v) => {
      DebugStore.setGameField('totalAnswered', v);
      showToast(`totalAnswered → ${v}`, 'info');
    }));
    body.appendChild(numberRow('Topics Mastered', gameData.topicsMastered, (v) => {
      DebugStore.setGameField('topicsMastered', v);
      showToast(`topicsMastered → ${v}`, 'info');
    }));

    // ─── Unique Correct Counts (MRT progress) ─────
    body.appendChild(sectionTitle('Unique Correct (MRT)'));
    const counts = DebugStore.getUniqueCorrectCounts();
    for (const m of ['bcp', 'comgi', 'pgi', 'hi']) {
      body.appendChild(el('div', { className: 'debug-hint' },
        `${m.toUpperCase()}: ${counts[m]}`));
    }

    // ─── GAS Sync ─────────────────────────────────
    body.appendChild(sectionTitle('GAS Sync'));
    body.appendChild(toggleRow('Block GAS Sends', d.gasSyncDisabled, (v) => {
      DebugStore.set('gasSyncDisabled', v);
      showToast(v ? 'GAS sync blocked' : 'GAS sync enabled', 'info');
    }));

    // ─── localStorage ─────────────────────────────
    body.appendChild(sectionTitle('localStorage'));
    const keys = DebugStore.getLocalStorageKeys();
    for (const item of keys) {
      const row = el('div', { className: 'debug-ls-row' });
      const label = el('span', { className: 'debug-ls-key', title: item.preview },
        item.key.replace('sg_broker_', '') + ` (${formatBytes(item.size)})`);
      const delBtn = el('button', { className: 'debug-btn debug-btn--danger debug-btn--sm', onClick: () => {
        if (confirm(`Delete ${item.key}?`)) {
          DebugStore.clearLocalStorageKey(item.key);
          showToast(`Deleted ${item.key}`, 'info');
          closePanel();
          setTimeout(openPanel, 250);
        }
      }}, '🗑');
      row.appendChild(label);
      row.appendChild(delBtn);
      body.appendChild(row);
    }

    // ─── Reset All ────────────────────────────────
    body.appendChild(sectionTitle(''));
    const resetBtn = el('button', { className: 'debug-btn debug-btn--danger', onClick: () => {
      if (confirm('Reset ALL app data? This cannot be undone.')) {
        const keys = DebugStore.getLocalStorageKeys();
        keys.forEach(k => localStorage.removeItem(k.key));
        showToast('All data cleared', 'info');
        closePanel();
      }
    }}, '🗑 Reset ALL Data');
    body.appendChild(resetBtn);
  }

  panelEl.appendChild(body);
  document.body.appendChild(panelEl);
  requestAnimationFrame(() => panelEl?.classList.add('debug-panel--open'));
}

// ─── UI Helpers ──────────────────────────────────────

function sectionTitle(text) {
  return el('div', { className: 'debug-section-title' }, text);
}

function toggleRow(label, value, onChange) {
  const row = el('div', { className: 'debug-row' });
  row.appendChild(el('span', {}, label));
  const toggle = el('button', {
    className: `debug-toggle ${value ? 'debug-toggle--on' : ''}`,
    onClick: () => {
      const next = !value;
      value = next;
      toggle.classList.toggle('debug-toggle--on', next);
      onChange(next);
    },
  });
  toggle.appendChild(el('span', { className: 'debug-toggle__knob' }));
  row.appendChild(toggle);
  return row;
}

function segmentRow(label, options, current, onChange) {
  const row = el('div', { className: 'debug-row' });
  row.appendChild(el('span', {}, label));
  const seg = el('div', { className: 'debug-segment' });
  for (const opt of options) {
    const btn = el('button', {
      className: `debug-seg-btn ${opt.value === current ? 'debug-seg-btn--active' : ''}`,
      onClick: () => {
        seg.querySelectorAll('.debug-seg-btn').forEach(b => b.classList.remove('debug-seg-btn--active'));
        btn.classList.add('debug-seg-btn--active');
        onChange(opt.value);
      },
    }, opt.label);
    seg.appendChild(btn);
  }
  row.appendChild(seg);
  return row;
}

function numberRow(label, value, onChange) {
  const row = el('div', { className: 'debug-row' });
  row.appendChild(el('span', {}, label));
  const input = el('input', {
    type: 'number',
    className: 'debug-input debug-input--num',
    value: String(value),
  });
  input.addEventListener('change', () => {
    const v = parseInt(input.value, 10);
    if (!isNaN(v)) onChange(v);
  });
  row.appendChild(input);
  return row;
}

function formatBytes(len) {
  if (len < 1024) return `${len}B`;
  return `${(len / 1024).toFixed(1)}KB`;
}
