/**
 * Sakura message pools — index file.
 * Actual messages live in sakura-phase1.js / phase2.js / phase3.js.
 *
 * Phase mapping (from sakura-state.js):
 *   japan            → PHASE1  完全な標準語。丁寧で距離のある応援。
 *   sg               → PHASE2  ですます + 博多弁が滲む。
 *   post_confession  → PHASE3  タメ口、博多弁全開、距離が近い。
 *   farewell         → PHASE3
 *   gone             → null    メッセージなし（さくら消滅）
 */

import { PHASE1 } from './sakura-phase1.js';
import { PHASE2 } from './sakura-phase2.js';
import { PHASE3 } from './sakura-phase3.js';
import { SakuraState } from '../models/sakura-state.js';

export { PHASE1, PHASE2, PHASE3 };

/**
 * Get the active message pool based on current phase.
 * Returns null when sakura is gone.
 */
export function getActiveMessages() {
  const phase = SakuraState.getPhaseNumeric();
  if (phase === null) return null;  // gone
  if (phase >= 3) return PHASE3;
  if (phase >= 2) return PHASE2;
  return PHASE1;
}

// ─── Takeda-sensei messages (rare, from the boss) ────────────
export const TAKEDA_MESSAGES = [
  '片岡くん、がんばれ！　ｂｙ武田',
  '受かったら祝杯だな！　ｂｙ武田',
  '応援してるぜ　ｂｙ武田',
];
