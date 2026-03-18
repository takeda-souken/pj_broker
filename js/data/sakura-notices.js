/**
 * Sakura Notices — one-time LINE-style messages from Sakura
 *
 * To add a new notice:
 *   1. Add an object to NOTICES array below
 *   2. That's it. Home view handles display, localStorage flag, and GAS logging.
 *
 * Each notice is shown once (newest first). Only one notice per app launch.
 */

const NOTICES = [
];

const KEY_PREFIX = 'sg_broker_notice_seen_';

/**
 * Returns the first unseen notice, or null.
 */
export function getUnseenNotice() {
  // Newest first — later entries in the array take priority
  for (let i = NOTICES.length - 1; i >= 0; i--) {
    const notice = NOTICES[i];
    if (!localStorage.getItem(KEY_PREFIX + notice.id)) {
      return notice;
    }
  }
  return null;
}

/**
 * Mark a notice as seen.
 */
export function markNoticeSeen(noticeId) {
  localStorage.setItem(KEY_PREFIX + noticeId, '1');
}
