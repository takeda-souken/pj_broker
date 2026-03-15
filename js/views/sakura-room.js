/**
 * Sakura Room View — LINE-style chat interface
 * Plays conversations from JSON data with typing animation
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SakuraRoomStore } from '../models/sakura-room-store.js';
import { SettingsStore } from '../models/settings-store.js';
import { SakuraState } from '../models/sakura-state.js';
import { DebugStore } from '../models/debug-store.js';
import {
  loadAllConversations,
  pickNextConversation,
  replacePlaceholders,
  pickClosing,
  isSakuraSleeping,
} from '../models/sakura-room-engine.js';
import { sendSakuraRoomLog } from '../utils/gas-client.js';
import { SakuraAlbumStore } from '../models/sakura-album-store.js';

const TYPING_DELAY = 1600;   // ms before typing dots appear (after previous bubble shown)
const LINE_DELAY = 1500;     // ms between consecutive sakura lines
const CHOICE_DELAY = 2000;   // ms before showing choice buttons

/** Typing duration scales with text length — feels like real typing */
function typingDuration(text) {
  const len = (text || '').length;
  // ~100ms per char, min 1200ms, max 4000ms
  return Math.min(4000, Math.max(1200, len * 100));
}

registerRoute('#sakura-room', async (app) => {
  // Check if sakura is gone (after farewell)
  if (SakuraState.getPhase() === 'gone') {
    app.appendChild(buildEmptyState('さくらの部屋は、静かに閉じています。'));
    return;
  }

  // Init room unlock date on first visit
  SakuraRoomStore.initRoomUnlock();

  // Load all conversation data
  await loadAllConversations();

  // Set body background to sakura pink
  document.body.classList.add('sakura-room-active');

  // Fade out door transition overlay if present
  fadeDoorTransition();

  // Build the room
  const room = el('div', { className: 'sakura-room' });

  // Exit door (floating, bottom-right — mirrors sakura door shape)
  const exitDoor = el('button', {
    className: 'sakura-door sakura-door--exit',
    title: '\u623B\u308B',
  });
  exitDoor.addEventListener('click', () => closeSakuraDoor(exitDoor));
  const exitFrame = el('div', { className: 'sakura-door__frame' });
  exitDoor.appendChild(exitFrame);
  exitDoor.appendChild(el('span', { className: 'sakura-door__label' }, '\u623B\u308B'));
  document.body.appendChild(exitDoor);

  // Check sleeping
  if (isSakuraSleeping()) {
    room.appendChild(buildSleepingState());
    app.appendChild(room);
    return;
  }

  // Chat area
  const chatArea = el('div', { className: 'sr-chat' });
  room.appendChild(chatArea);
  app.appendChild(room);

  // Pick a conversation
  const conv = pickNextConversation();
  if (!conv) {
    chatArea.appendChild(buildEmptyChat());
    return;
  }

  // Debug: skip button to jump to next conversation
  if (DebugStore.isActive()) {
    const skipBtn = el('button', {
      className: 'sr-debug-skip',
      onClick: () => {
        SakuraRoomStore.completeConversation(conv.id);
        // Force re-navigation (same hash won't fire hashchange)
        window.location.hash = '#_reload';
        requestAnimationFrame(() => navigate('#sakura-room'));
      },
    }, '⏭ 次の会話へ');
    // Show conversation ID for reference
    const idLabel = el('span', { className: 'sr-debug-skip__id' }, conv.id);
    skipBtn.prepend(idLabel);
    document.body.appendChild(skipBtn);

    // Debug: add sample photo to album for testing
    const albumTestBtn = el('button', {
      className: 'sr-debug-skip',
      style: 'top:48px;background:rgba(33,150,243,0.9);border-color:#2196f3;',
      onClick: () => {
        SakuraAlbumStore.addPhoto({
          src: 'img/sakura-room/sakura-boba.png',
          alt: 'タピオカを持つさくら',
          caption: 'タピオカ買ったよ！ ピースピース✌️',
          conversationId: '_debug_test',
        });
        // Open album directly
        showAlbum();
      },
    }, '\uD83D\uDDBC\uFE0F \u30A2\u30EB\u30D0\u30E0\u30C6\u30B9\u30C8');
    document.body.appendChild(albumTestBtn);

    // Remove both buttons when debug is turned off
    const onDebugChange = () => {
      if (!DebugStore.isActive()) {
        skipBtn.remove();
        albumTestBtn.remove();
        window.removeEventListener('debug-changed', onDebugChange);
      }
    };
    window.addEventListener('debug-changed', onDebugChange);
  }

  // Play it
  await playConversation(conv, chatArea);
});

// ─── Header ───────────────────────────────────────
function buildHeader() {
  const header = el('div', { className: 'sr-header' });

  const backBtn = el('button', {
    className: 'sr-header__back',
    onClick: () => navigate('#home'),
  }, '\u2190');
  header.appendChild(backBtn);

  const avatar = el('div', { className: 'sr-header__avatar' }, '\uD83C\uDF38');
  header.appendChild(avatar);

  const info = el('div', { className: 'sr-header__info' });
  info.appendChild(el('div', { className: 'sr-header__name' }, '\u6625\u5C71\u3055\u304F\u3089'));
  info.appendChild(el('div', { className: 'sr-header__status' }, 'online'));
  header.appendChild(info);

  // Album button
  const albumCount = SakuraAlbumStore.getCount();
  if (albumCount > 0) {
    const albumBtn = el('button', {
      className: 'sr-header__album',
      onClick: () => showAlbum(),
    }, '\uD83D\uDDBC\uFE0F');
    header.appendChild(albumBtn);
  }

  return header;
}

// ─── Sleeping state ─────────────────────────────────
function buildSleepingState() {
  const container = el('div', { className: 'sr-sleeping' });
  container.appendChild(el('div', { className: 'sr-sleeping__icon' }, '\uD83D\uDE34'));
  container.appendChild(el('div', { className: 'sr-sleeping__text' },
    '\u3055\u304F\u3089\u306F\u5BDD\u3066\u3044\u307E\u3059\u3002\n6:30\u306B\u8D77\u304D\u307E\u3059\u3002'));
  return container;
}

// ─── Empty states ───────────────────────────────────
function buildEmptyState(text) {
  const container = el('div', { className: 'sr-empty', style: 'height:100vh;' });
  container.appendChild(el('div', {}, '\uD83C\uDF38'));
  container.appendChild(el('div', { className: 'sr-empty__text' }, text));
  const btn = el('button', {
    className: 'btn btn--primary',
    onClick: () => navigate('#home'),
  }, '\u30DB\u30FC\u30E0\u306B\u623B\u308B');
  container.appendChild(btn);
  return container;
}

function buildEmptyChat() {
  const container = el('div', { className: 'sr-empty' });
  container.appendChild(el('div', { className: 'sr-empty__text' },
    '\u4ECA\u65E5\u306F\u65B0\u3057\u3044\u4F1A\u8A71\u304C\u306A\u3044\u307F\u305F\u3044\u3002\n\u307E\u305F\u660E\u65E5\u6765\u3066\u306D\uFF01'));
  return container;
}

// ─── Play a conversation ────────────────────────────
async function playConversation(conv, chatArea) {
  const nodeMap = {};
  conv.nodes.forEach(n => { nodeMap[n.id] = n; });

  // Start from first node
  let currentNode = conv.nodes[0];

  while (currentNode) {
    if (currentNode.end) {
      // Show closing
      const closingText = pickClosing(conv);
      if (closingText) {
        const closingResolved = replacePlaceholders(closingText);
        await delay(TYPING_DELAY);
        await showTyping(chatArea, closingResolved);
        addSakuraMessage(chatArea, closingResolved);
      }
      // Mark completed
      SakuraRoomStore.completeConversation(conv.id);
      // Handle nickname changes
      handlePostConversation(conv);
      // Disable sakura if needed (farewell → gone)
      if (conv.disableSakuraAfter) {
        SakuraState.markEventSeen('farewell');
      }
      break;
    }

    if (currentNode.speaker === 'sakura') {
      // Show each line with typing animation
      if (currentNode.lines && currentNode.lines.length > 0) {
        for (let i = 0; i < currentNode.lines.length; i++) {
          const lineText = replacePlaceholders(currentNode.lines[i]);
          await delay(i === 0 ? TYPING_DELAY : LINE_DELAY);
          await showTyping(chatArea, lineText);
          addSakuraMessage(chatArea, lineText);
        }
      }

      // Apply flags from this node
      if (currentNode.flags) {
        for (const [k, v] of Object.entries(currentNode.flags)) {
          SakuraRoomStore.setFlag(k, v);
        }
      }

      // Follow next
      const nextId = currentNode.next || getNextNodeId(conv.nodes, currentNode.id);
      currentNode = nextId ? nodeMap[nextId] : null;

    } else if (currentNode.speaker === 'choice') {
      // Pause before showing choices
      await delay(CHOICE_DELAY);
      const choice = await showChoices(chatArea, currentNode.choices);

      // Show user's choice as a message
      addUserMessage(chatArea, choice.label);


      // Log to GAS spreadsheet
      sendSakuraRoomLog({
        conversationId: conv.id,
        nodeId: currentNode.id,
        choiceLabel: choice.label,
        flags: choice.flags,
        axes: choice.axes,
      });

      // Apply flags and axes
      if (choice.flags) {
        for (const [k, v] of Object.entries(choice.flags)) {
          SakuraRoomStore.setFlag(k, v);
        }
      }
      if (choice.axes) {
        SakuraRoomStore.addAxes(choice.axes);
      }

      // Follow to next node
      currentNode = choice.next ? nodeMap[choice.next] : null;

    } else if (currentNode.speaker === 'narration') {
      await delay(TYPING_DELAY);
      addNarrationMessage(chatArea, replacePlaceholders(currentNode.text));

      const nextId = currentNode.next || getNextNodeId(conv.nodes, currentNode.id);
      currentNode = nextId ? nodeMap[nextId] : null;

    } else if (currentNode.speaker === 'image') {
      await delay(TYPING_DELAY);
      await showTyping(chatArea, '📷');
      addImageMessage(chatArea, currentNode);

      // Save to album
      SakuraAlbumStore.addPhoto({
        src: currentNode.src,
        alt: currentNode.alt,
        caption: currentNode.caption,
        conversationId: conv.id,
      });

      const nextId = currentNode.next || getNextNodeId(conv.nodes, currentNode.id);
      currentNode = nextId ? nodeMap[nextId] : null;
    } else {
      // Unknown speaker type, try next
      const nextId = currentNode.next || getNextNodeId(conv.nodes, currentNode.id);
      currentNode = nextId ? nodeMap[nextId] : null;
    }
  }
}

// ─── Message helpers ─────────────────────────────────

function addSakuraMessage(chatArea, text) {
  const msg = el('div', { className: 'sr-msg sr-msg--sakura' });
  const avatar = el('div', { className: 'sr-msg__avatar' }, '\uD83C\uDF38');
  const bubble = el('div', { className: 'sr-msg__bubble' }, text);
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatArea.appendChild(msg);
  scrollToBottom(chatArea);
}

function addUserMessage(chatArea, text) {
  const msg = el('div', { className: 'sr-msg sr-msg--user' });
  const bubble = el('div', { className: 'sr-msg__bubble' }, text);
  msg.appendChild(bubble);
  chatArea.appendChild(msg);
  scrollToBottom(chatArea);
}

function addNarrationMessage(chatArea, text) {
  const msg = el('div', { className: 'sr-msg sr-msg--narration' });
  const bubble = el('div', { className: 'sr-msg__bubble' }, text);
  msg.appendChild(bubble);
  chatArea.appendChild(msg);
  scrollToBottom(chatArea);
}

function addImageMessage(chatArea, node) {
  const msg = el('div', { className: 'sr-msg sr-msg--sakura' });
  const avatar = el('div', { className: 'sr-msg__avatar' }, '\uD83C\uDF38');
  const content = el('div', {});

  const img = el('img', {
    className: 'sr-msg__image',
    src: node.src || '',
    alt: node.alt || '',
  });
  img.onerror = () => {
    img.style.display = 'none';
    const placeholder = el('div', {
      className: 'sr-msg__bubble',
      style: 'font-style:italic;opacity:0.6;',
    }, `\uD83D\uDCF7 ${node.alt || '\u5199\u771F'}`);
    content.insertBefore(placeholder, content.firstChild);
  };
  content.appendChild(img);

  if (node.caption) {
    content.appendChild(el('div', { className: 'sr-msg__caption' }, replacePlaceholders(node.caption)));
  }

  msg.appendChild(avatar);
  msg.appendChild(content);
  chatArea.appendChild(msg);
  scrollToBottom(chatArea);
}

// ─── Typing indicator ────────────────────────────────

function showTyping(chatArea, text) {
  return new Promise(resolve => {
    const typing = el('div', { className: 'sr-typing' });
    const avatar = el('div', { className: 'sr-msg__avatar' }, '\uD83C\uDF38');
    const dots = el('div', { className: 'sr-typing__dots' });
    dots.appendChild(el('span', { className: 'sr-typing__dot' }));
    dots.appendChild(el('span', { className: 'sr-typing__dot' }));
    dots.appendChild(el('span', { className: 'sr-typing__dot' }));
    typing.appendChild(avatar);
    typing.appendChild(dots);
    chatArea.appendChild(typing);
    scrollToBottom(chatArea);

    setTimeout(() => {
      typing.remove();
      resolve();
    }, typingDuration(text));
  });
}

// ─── Choice buttons ──────────────────────────────────

function showChoices(chatArea, choices) {
  return new Promise(resolve => {
    const container = el('div', { className: 'sr-choices' });

    choices.forEach(choice => {
      const btn = el('button', {
        className: 'sr-choice-btn',
        onClick: () => {
          // Highlight selected
          btn.classList.add('sr-choice-btn--selected');
          // Disable all buttons
          container.querySelectorAll('.sr-choice-btn').forEach(b => {
            b.disabled = true;
            if (b !== btn) b.style.opacity = '0.4';
          });
          // Remove choices, add height to chatArea padding to prevent scroll jump
          setTimeout(() => {
            const h = container.offsetHeight;
            container.remove();
            // Increase bottom padding to compensate for removed height
            const current = parseFloat(getComputedStyle(chatArea).paddingBottom) || 0;
            chatArea.style.paddingBottom = (current + h) + 'px';
            resolve(choice);
          }, 300);
        },
      }, choice.label);
      container.appendChild(btn);
    });

    chatArea.appendChild(container);
    scrollToBottom(chatArea);
  });
}

// ─── Post-conversation handling ──────────────────────

function handlePostConversation(conv) {
  // Handle nickname selection
  const store = SakuraRoomStore.load();
  const selected = store.flags.nickname_selected;
  if (selected && (conv.id === 'a02_nickname_change' || conv.id === 'a13_nickname_2nd')) {
    SettingsStore.set('sakuraNickname', selected);
  }
}

// ─── Utilities ───────────────────────────────────────

function scrollToBottom(container) {
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getNextNodeId(nodes, currentId) {
  const idx = nodes.findIndex(n => n.id === currentId);
  if (idx >= 0 && idx < nodes.length - 1) {
    return nodes[idx + 1].id;
  }
  return null;
}

// ─── Album overlay ───────────────────────────────────

function showAlbum() {
  const photos = SakuraAlbumStore.load();
  if (photos.length === 0) return;

  const overlay = el('div', { className: 'sr-album-overlay' });

  const header = el('div', { className: 'sr-album-header' });
  header.appendChild(el('span', {}, `\u30A2\u30EB\u30D0\u30E0 (${photos.length})`));
  header.appendChild(el('button', {
    className: 'sr-album-close',
    onClick: () => overlay.remove(),
  }, '\u00D7'));
  overlay.appendChild(header);

  const grid = el('div', { className: 'sr-album-grid' });
  photos.forEach(photo => {
    const thumb = el('div', { className: 'sr-album-thumb' });
    const img = el('img', { src: photo.src, alt: photo.alt });
    img.onerror = () => {
      img.style.display = 'none';
      thumb.appendChild(el('div', { className: 'sr-album-placeholder' }, '\uD83D\uDCF7'));
    };
    thumb.appendChild(img);
    thumb.addEventListener('click', () => showAlbumDetail(photo, overlay));
    grid.appendChild(thumb);
  });
  overlay.appendChild(grid);

  document.body.appendChild(overlay);
}

function showAlbumDetail(photo, albumOverlay) {
  const detail = el('div', { className: 'sr-album-detail' });
  // Close on background click (not on buttons/img)
  detail.addEventListener('click', (e) => {
    if (e.target === detail) detail.remove();
  });

  const img = el('img', { src: photo.src, alt: photo.alt });
  img.onerror = () => {
    img.style.display = 'none';
    detail.appendChild(el('div', { style: 'color:#fff;font-size:48px;' }, '\uD83D\uDCF7'));
  };
  detail.appendChild(img);

  if (photo.caption) {
    detail.appendChild(el('div', { className: 'sr-album-detail__caption' }, photo.caption));
  }

  const dateStr = photo.timestamp ? new Date(photo.timestamp).toLocaleDateString('ja-JP') : '';
  if (dateStr) {
    detail.appendChild(el('div', { className: 'sr-album-detail__date' }, dateStr));
  }

  // Download button
  const dlBtn = el('button', {
    className: 'sr-album-dl',
    onClick: (e) => {
      e.stopPropagation();
      downloadImage(photo.src, photo.alt);
    },
  }, '\u2B07 \u4FDD\u5B58');
  detail.appendChild(dlBtn);

  albumOverlay.appendChild(detail);
}

async function downloadImage(src, filename) {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (filename || 'sakura-photo').replace(/[^a-zA-Z0-9\u3000-\u9fff_-]/g, '_') + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: open in new tab
    window.open(src, '_blank');
  }
}

// ─── Exit door transition (reverse of entry) ────────
function closeSakuraDoor(doorEl) {
  // Close album overlay if open
  document.querySelectorAll('.sr-album-overlay, .sr-album-detail').forEach(e => e.remove());

  const rect = doorEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const maxDist = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(window.innerWidth - cx, cy),
    Math.hypot(cx, window.innerHeight - cy),
    Math.hypot(window.innerWidth - cx, window.innerHeight - cy),
  );

  // 1) Navigate to home first so it renders underneath
  navigate('#home');

  // 2) Place a full-screen pink overlay on top (covers home)
  const overlay = document.createElement('div');
  overlay.className = 'sakura-door-transition sakura-door-transition--cover';
  overlay.style.cssText = `left:${cx}px;top:${cy}px;--max-r:${Math.ceil(maxDist)}px;`;
  document.body.appendChild(overlay);

  // 3) Next frame: shrink it to reveal home behind
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.remove('sakura-door-transition--cover');
      overlay.classList.add('sakura-door-transition--shrink');
    });
  });

  overlay.addEventListener('animationend', () => {
    overlay.remove();
  }, { once: true });
}

// ─── Door transition cleanup ─────────────────────────
function fadeDoorTransition() {
  const overlay = document.querySelector('.sakura-door-transition');
  if (!overlay) return;
  overlay.style.transition = 'opacity 0.4s ease';
  overlay.style.opacity = '0';
  setTimeout(() => overlay.remove(), 400);
  delete document.body.dataset.sakuraTransition;
}
