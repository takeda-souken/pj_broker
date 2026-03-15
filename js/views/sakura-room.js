/**
 * Sakura Room View — LINE-style chat interface
 * Plays conversations from JSON data with typing animation
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SakuraRoomStore } from '../models/sakura-room-store.js';
import { SettingsStore } from '../models/settings-store.js';
import {
  loadAllConversations,
  pickNextConversation,
  replacePlaceholders,
  pickClosing,
  isSakuraSleeping,
} from '../models/sakura-room-engine.js';

const TYPING_DELAY = 600;    // ms before typing dots appear
const TYPING_DURATION = 800; // ms typing dots are shown
const LINE_DELAY = 400;      // ms between consecutive sakura lines

registerRoute('#sakura-room', async (app) => {
  // Check if sakura is disabled (after farewell)
  if (SakuraRoomStore.get('sakuraDisabled')) {
    app.appendChild(buildEmptyState('さくらの部屋は、静かに閉じています。'));
    return;
  }

  // Init room unlock date on first visit
  SakuraRoomStore.initRoomUnlock();

  // Load all conversation data
  await loadAllConversations();

  // Build the room
  const room = el('div', { className: 'sakura-room' });

  // Header
  const header = buildHeader();
  room.appendChild(header);

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
        await delay(TYPING_DELAY);
        await showTyping(chatArea);
        addSakuraMessage(chatArea, replacePlaceholders(closingText));
      }
      // Mark completed
      SakuraRoomStore.completeConversation(conv.id);
      // Handle nickname changes
      handlePostConversation(conv);
      // Disable sakura if needed
      if (conv.disableSakuraAfter) {
        SakuraRoomStore.disableSakura();
      }
      break;
    }

    if (currentNode.speaker === 'sakura') {
      // Show each line with typing animation
      if (currentNode.lines && currentNode.lines.length > 0) {
        for (let i = 0; i < currentNode.lines.length; i++) {
          await delay(i === 0 ? TYPING_DELAY : LINE_DELAY);
          await showTyping(chatArea);
          addSakuraMessage(chatArea, replacePlaceholders(currentNode.lines[i]));
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
      // Show choices and wait for selection
      const choice = await showChoices(chatArea, currentNode.choices);

      // Show user's choice as a message
      addUserMessage(chatArea, choice.label);

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
      await showTyping(chatArea);
      addImageMessage(chatArea, currentNode);

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

function showTyping(chatArea) {
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
    }, TYPING_DURATION);
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
          // Small delay then resolve
          setTimeout(() => {
            container.remove();
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
