/**
 * Debug Panel — overlay UI for development-only debugging tools
 * Only available on localhost. Invisible to production.
 */
import { DebugStore } from '../models/debug-store.js';
import { el } from '../utils/dom-helpers.js';
import { showToast } from '../components/toast.js';
import { GamificationStore } from '../models/gamification-store.js';
import { SakuraRoomStore } from '../models/sakura-room-store.js';

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

    // ─── Merlion Test ─────────────────────────────
    body.appendChild(sectionTitle('Merlion'));
    const merlionTypes = [
      { label: 'Correct', type: 'correct' },
      { label: 'Streak', type: 'streak' },
      { label: 'Mastered', type: 'mastered' },
    ];
    const merlionRow = el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;padding:4px 0;' });
    for (const mt of merlionTypes) {
      merlionRow.appendChild(el('button', {
        className: 'debug-btn',
        onClick: async () => {
          const { showMerlionCelebration } = await import('../components/merlion.js');
          showMerlionCelebration({ type: mt.type, streak: 10, topicName: 'Test Topic' });
        },
      }, `🦁 ${mt.label}`));
    }
    body.appendChild(merlionRow);

    // ─── Achievement Popup Test ───────────────────
    body.appendChild(sectionTitle('Achievement Popup'));
    const achTestRow = el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;padding:4px 0;' });
    achTestRow.appendChild(el('button', {
      className: 'debug-btn',
      onClick: async () => {
        const { showAchievementPopup } = await import('../components/achievement-popup.js');
        showAchievementPopup([
          { icon: '\uD83D\uDD25', name: 'Hot Streak', nameJA: '絶好調', desc: '5 correct answers in a row' },
        ]);
      },
    }, '🏆 Single'));
    achTestRow.appendChild(el('button', {
      className: 'debug-btn',
      onClick: async () => {
        const { showAchievementPopup } = await import('../components/achievement-popup.js');
        showAchievementPopup([
          { icon: '\uD83D\uDD25', name: 'Hot Streak', nameJA: '絶好調', desc: '5 correct answers in a row' },
          { icon: '\uD83C\uDFC6', name: 'Ace', nameJA: 'エース', desc: 'Score 90%+ on a mock exam' },
          { icon: '\uD83D\uDC51', name: 'True Completionist', nameJA: '真のコンプリート', desc: 'Unlock every other achievement' },
        ]);
      },
    }, '🏆×3 Multi'));
    body.appendChild(achTestRow);

    // ─── MRT Line Intro Test ────────────────────────
    body.appendChild(sectionTitle('MRT Line Intro'));
    const mrtTestRow = el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;padding:4px 0;' });
    const mrtLines = [
      { id: 'ns', label: '🔴 NS', color: '#e4002b' },
      { id: 'ew', label: '🟢 EW', color: '#009645' },
      { id: 'ne', label: '🟣 NE', color: '#9016b2' },
      { id: 'dt', label: '🔵 DT', color: '#005ec4' },
    ];
    for (const line of mrtLines) {
      mrtTestRow.appendChild(el('button', {
        className: 'debug-btn',
        style: `border-color:${line.color};color:${line.color};`,
        onClick: async () => {
          const { showLineIntro } = await import('../components/mrt-tutorial.js');
          // Temporarily remove shown flag so it displays
          const key = 'sg_broker_mrt_intro_shown';
          const shown = JSON.parse(localStorage.getItem(key) || '{}');
          const backup = shown[line.id];
          delete shown[line.id];
          localStorage.setItem(key, JSON.stringify(shown));
          await showLineIntro(line.id, { deferred: true });
          // Restore original shown state (don't pollute real tracking)
          if (backup) {
            const s = JSON.parse(localStorage.getItem(key) || '{}');
            s[line.id] = backup;
            localStorage.setItem(key, JSON.stringify(s));
          }
        },
      }, line.label));
    }
    body.appendChild(mrtTestRow);

    // ─── MRT Station Debug ─────────────────────────
    body.appendChild(sectionTitle('MRT Stations'));
    const counts = DebugStore.getUniqueCorrectCounts();
    for (const m of ['bcp', 'comgi', 'pgi', 'hi']) {
      body.appendChild(el('div', { className: 'debug-hint' },
        `${m.toUpperCase()}: ${counts[m]} unique correct`));
    }
    const mrtBonus = DebugStore.get('mrtBonus') || {};
    const mrtLineIds = [
      { id: 'ns', label: '🔴 NS', color: '#e4002b' },
      { id: 'ew', label: '🟢 EW', color: '#009645' },
      { id: 'ne', label: '🟣 NE', color: '#9016b2' },
      { id: 'dt', label: '🔵 DT', color: '#005ec4' },
      { id: 'cc', label: '🟠 CC', color: '#fa9e0d' },
      { id: 'te', label: '🟤 TE', color: '#9d5b25' },
    ];
    const mrtBtnRow = el('div', { style: 'display:flex;gap:4px;flex-wrap:wrap;padding:4px 0;' });
    for (const ml of mrtLineIds) {
      const btn = el('button', {
        className: 'debug-btn',
        style: `border-color:${ml.color};color:${ml.color};font-size:0.7rem;`,
        onClick: () => {
          const bonus = DebugStore.get('mrtBonus') || {};
          bonus[ml.id] = (bonus[ml.id] || 0) + 1;
          DebugStore.set('mrtBonus', bonus);
          showToast(`${ml.label} +1 (bonus: ${bonus[ml.id]})`, 'info');
        },
      }, `${ml.label} +1`);
      mrtBtnRow.appendChild(btn);
    }
    body.appendChild(mrtBtnRow);
    const mrtBtnRow2 = el('div', { style: 'display:flex;gap:4px;flex-wrap:wrap;padding:4px 0;' });
    mrtBtnRow2.appendChild(el('button', {
      className: 'debug-btn',
      onClick: () => {
        // Re-render MRT page
        if (location.hash === '#fun') {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
          import('../router.js').then(m => m.navigate('#fun'));
        }
        closePanel();
      },
    }, '🗺️ Redraw MRT'));
    mrtBtnRow2.appendChild(el('button', {
      className: 'debug-btn debug-btn--danger',
      onClick: () => {
        DebugStore.set('mrtBonus', {});
        showToast('MRT bonus reset', 'info');
      },
    }, '🔄 Reset Bonus'));
    body.appendChild(mrtBtnRow2);
    const bonusHint = Object.entries(mrtBonus).filter(([, v]) => v > 0).map(([k, v]) => `${k}:+${v}`).join(' ');
    if (bonusHint) {
      body.appendChild(el('div', { className: 'debug-hint' }, `Bonus: ${bonusHint}`));
    }

    // ─── GAS Sync ─────────────────────────────────
    body.appendChild(sectionTitle('GAS Sync'));
    body.appendChild(toggleRow('Block GAS Sends', d.gasSyncDisabled, (v) => {
      DebugStore.set('gasSyncDisabled', v);
      showToast(v ? 'GAS sync blocked' : 'GAS sync enabled', 'info');
    }));

    // ─── Sakura Room ──────────────────────────────
    body.appendChild(sectionTitle('Sakura Room'));

    // Read state directly from localStorage (no import dependency)
    const _srRoom = SakuraRoomStore.load();
    const _srSakura = (() => {
      try { return JSON.parse(localStorage.getItem('sg_broker_sakura') || '{}'); } catch { return {}; }
    })();
    const _srRecords = (() => {
      try { const r = JSON.parse(localStorage.getItem('sg_broker_records') || '[]'); return Array.isArray(r) ? r : []; } catch { return []; }
    })();
    const _srPhase = _srSakura.phase || 'japan';
    const _srTotalRecords = _srRecords.length;
    const _srSinceP2 = _srPhase === 'japan' ? 0 : Math.max(0, _srTotalRecords - (_srSakura.answeredAtPhase2Start || 0));
    const _srDaysP2 = (() => {
      if (!_srSakura.phase2StartedAt) return 0;
      const now = DebugStore.now();
      const start = new Date(_srSakura.phase2StartedAt);
      return Math.floor((now - start) / 86400000);
    })();

    // Quick launch — set up state so a conversation is guaranteed to start
    const launchBtn = el('button', { className: 'debug-btn', onClick: () => {
      // 1. Ensure phase is 'sg' with phase2StartedAt 7 days ago
      const sakuraRaw = localStorage.getItem('sg_broker_sakura');
      const sakura = sakuraRaw ? JSON.parse(sakuraRaw) : {};
      if (!sakura.phase || sakura.phase === 'japan') {
        sakura.phase = 'sg';
      }
      if (!sakura.phase2StartedAt) {
        const d = new Date(DebugStore.now());
        d.setDate(d.getDate() - 7);
        sakura.phase2StartedAt = d.toISOString();
      }
      if (sakura.answeredAtPhase2Start == null) {
        sakura.answeredAtPhase2Start = 0;
      }
      localStorage.setItem('sg_broker_sakura', JSON.stringify(sakura));

      // 2. Ensure at least 60 records exist (covers minAnswered thresholds)
      let records = [];
      try { records = JSON.parse(localStorage.getItem('sg_broker_records') || '[]'); } catch {}
      if (!Array.isArray(records)) records = [];
      const needed = 60 - records.length;
      if (needed > 0) {
        for (let i = 0; i < needed; i++) {
          records.push({ module: '_debug', questionId: `dbg_launch_${Date.now()}_${i}`, isCorrect: true, ts: new Date().toISOString() });
        }
        localStorage.setItem('sg_broker_records', JSON.stringify(records));
      }

      // 3. Clear completed so conversations are available again
      const room = SakuraRoomStore.load();
      room.completedConversations = [];
      room.sakuraDisabled = false;
      SakuraRoomStore.save(room);

      // 4. Set sakura debug phase override to 'sg'
      DebugStore.set('sakuraPhaseOverride', 'sg');

      closePanel();
      showToast('Sakura準備完了 → 部屋へ移動', 'info');
      import('../router.js').then(m => m.navigate('#sakura-room'));
    }}, '🌸 会話開始（一括セットアップ）');
    body.appendChild(launchBtn);

    // Diagnostic info
    body.appendChild(el('div', { className: 'debug-hint' },
      `Phase: ${_srPhase} | Records: ${_srTotalRecords} | SinceP2: ${_srSinceP2} | Days: ${_srDaysP2}`));
    body.appendChild(el('div', { className: 'debug-hint' },
      `Completed: ${_srRoom.completedConversations.length} | Disabled: ${_srRoom.sakuraDisabled}`));

    // Available count (lazy async)
    const availLabel = el('div', { className: 'debug-hint' }, 'Available: (tap Refresh)');
    body.appendChild(availLabel);
    const refreshAvailBtn = el('button', { className: 'debug-btn debug-btn--sm', onClick: async () => {
      try {
        const eng = await import('../models/sakura-room-engine.js');
        await eng.loadAllConversations();
        const avail = eng.getAvailableConversations();
        availLabel.textContent = `Available: ${avail.length}`;
        availLabel.textContent += avail.length > 0 ? ` → next: ${avail[0].id}` : '';
      } catch (e) { availLabel.textContent = `Error: ${e.message}`; }
    }}, '🔄 Refresh');
    body.appendChild(refreshAvailBtn);

    // Inject fake records
    body.appendChild(numberRow('Total Records', _srTotalRecords, (v) => {
      let records = _srRecords;
      const diff = v - records.length;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          records.push({ module: '_debug', questionId: `dbg_${Date.now()}_${i}`, isCorrect: true, ts: new Date().toISOString() });
        }
      } else if (diff < 0) {
        records = records.slice(0, v);
      }
      localStorage.setItem('sg_broker_records', JSON.stringify(records));
      showToast(`Records → ${v}`, 'info');
      closePanel();
      setTimeout(openPanel, 250);
    }));

    // Force phase transition button
    const forcePhaseBtn = el('button', { className: 'debug-btn', onClick: () => {
      const raw = localStorage.getItem('sg_broker_sakura');
      const state = raw ? { ...JSON.parse(raw) } : {};
      const curPhase = state.phase || 'japan';
      const nextMap = { japan: 'sg', sg: 'post_confession', post_confession: 'farewell', farewell: 'gone' };
      const next = nextMap[curPhase];
      if (!next) { showToast('Already at final phase', 'info'); return; }
      state.phase = next;
      if (next === 'sg' && !state.phase2StartedAt) {
        const recs = (() => { try { return JSON.parse(localStorage.getItem('sg_broker_records') || '[]').length; } catch { return 0; } })();
        state.answeredAtPhase2Start = recs;
        state.phase2StartedAt = DebugStore.now().toISOString();
      }
      localStorage.setItem('sg_broker_sakura', JSON.stringify(state));
      showToast(`Phase: ${curPhase} → ${next}`, 'info');
      closePanel();
      setTimeout(openPanel, 250);
    }}, `⏩ Force Phase (now: ${_srPhase})`);
    body.appendChild(forcePhaseBtn);

    // Warmth / Honesty
    body.appendChild(numberRow('Warmth', _srRoom.axes.warmth || 0, (v) => {
      const s = SakuraRoomStore.load(); s.axes.warmth = v; SakuraRoomStore.save(s);
      showToast(`Warmth → ${v}`, 'info');
    }));
    body.appendChild(numberRow('Honesty', _srRoom.axes.honesty || 0, (v) => {
      const s = SakuraRoomStore.load(); s.axes.honesty = v; SakuraRoomStore.save(s);
      showToast(`Honesty → ${v}`, 'info');
    }));
    body.appendChild(numberRow('Room Conversations', _srRoom.totalRoomConversations, (v) => {
      SakuraRoomStore.set('totalRoomConversations', v);
      showToast(`Room conversations → ${v}`, 'info');
    }));

    // Reset
    const resetSakuraBtn = el('button', { className: 'debug-btn debug-btn--danger', onClick: () => {
      if (confirm('Reset Sakura Room + Phase?')) {
        const s = SakuraRoomStore.load();
        s.completedConversations = []; s.totalRoomConversations = 0;
        s.flags = {}; s.axes = { warmth: 0, honesty: 0 }; s.sakuraDisabled = false;
        SakuraRoomStore.save(s);
        localStorage.removeItem('sg_broker_sakura');
        showToast('Sakura room + phase reset', 'info');
        closePanel(); setTimeout(openPanel, 250);
      }
    }}, '🔄 Reset Sakura Room');
    body.appendChild(resetSakuraBtn);

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
