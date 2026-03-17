/**
 * Sakura message pools — index file.
 * Actual messages live in individual phase files.
 *
 * 6-Phase message pool mapping (from sakura-state.js):
 *   japan       → JAPAN       完全な標準語。丁寧で距離のある応援。
 *   sg_early    → SG_EARLY    敬語フランク・標準語。SGガイド役。
 *   sg_mid      → SG_MID      ですます + 博多弁が滲む。淡い恋心。
 *   sg_late     → SG_LATE     タメ口・博多弁全開。完全な恋心。
 *   heartbreak  → HEARTBREAK  博多弁全開、悲恋モード。プロに戻る。
 *   ending      → ENDING      博多弁、愛情たっぷり。別れと出発。
 *   gone        → null        メッセージなし（さくら消滅）
 *
 * Design doc: docs/sakura-phase-design.md
 */

import { JAPAN } from './sakura-phase1.js';
import { SG_EARLY } from './sakura-sg-early.js';
import { SG_MID } from './sakura-phase2.js';
import { SG_LATE } from './sakura-phase3.js';
import { HEARTBREAK } from './sakura-heartbreak.js';
import { ENDING } from './sakura-ending.js';
import { SakuraState } from '../models/sakura-state.js';

export { JAPAN, SG_EARLY, SG_MID, SG_LATE, HEARTBREAK, ENDING };

// Phase name → message pool
const POOL_MAP = {
  japan: JAPAN,
  sg_early: SG_EARLY,
  sg_mid: SG_MID,
  sg_late: SG_LATE,
  heartbreak: HEARTBREAK,
  ending: ENDING,
  gone: null,
};

/**
 * Get the active message pool based on current phase.
 * Returns null when sakura is gone.
 */
export function getActiveMessages() {
  const phase = SakuraState.getPhase();
  return POOL_MAP[phase] ?? null;
}

// ─── Takeda-sensei messages (rare, from the boss) ────────────
export const TAKEDA_MESSAGES = [
  '片岡くん、がんばれ！　ｂｙ武田',
  '受かったら祝杯だな！　ｂｙ武田',
  '応援してるぜ　ｂｙ武田',
];
