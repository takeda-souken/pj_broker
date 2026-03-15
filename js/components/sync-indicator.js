/**
 * Sync Indicator — small animated icon below the language toggle
 * Shows sync status: syncing (spinning), done (checkmark fade), error (red flash)
 */

let indicatorEl = null;
let hideTimer = null;

export function initSyncIndicator() {
  if (indicatorEl) return;

  indicatorEl = document.createElement('div');
  indicatorEl.className = 'sync-indicator';
  indicatorEl.innerHTML = `<svg class="sync-indicator__icon" viewBox="0 0 24 24" width="18" height="18">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/>
  </svg>`;
  document.body.appendChild(indicatorEl);

  // Listen for sync events
  window.addEventListener('sync-status', (e) => {
    const status = e.detail?.status;
    if (status === 'syncing') showSyncing();
    else if (status === 'done') showDone();
    else if (status === 'saved') showSaved();
    else if (status === 'error') showError();
  });
}

function showSyncing() {
  if (!indicatorEl) return;
  clearHideTimer();
  indicatorEl.className = 'sync-indicator sync-indicator--syncing';
  indicatorEl.title = 'Syncing...';
}

function showDone() {
  if (!indicatorEl) return;
  indicatorEl.className = 'sync-indicator sync-indicator--done';
  indicatorEl.title = 'Synced';
  scheduleHide();
}

function showSaved() {
  if (!indicatorEl) return;
  indicatorEl.className = 'sync-indicator sync-indicator--saved';
  indicatorEl.title = 'Saved to cloud';
  scheduleHide();
}

function showError() {
  if (!indicatorEl) return;
  indicatorEl.className = 'sync-indicator sync-indicator--error';
  indicatorEl.title = 'Sync failed';
  scheduleHide(5000);
}

function scheduleHide(ms = 3000) {
  clearHideTimer();
  hideTimer = setTimeout(() => {
    if (indicatorEl) indicatorEl.className = 'sync-indicator';
  }, ms);
}

function clearHideTimer() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
}
