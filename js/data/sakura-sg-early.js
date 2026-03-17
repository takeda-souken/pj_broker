/**
 * Sakura SG Early (Phase 2-early): 敬語（少しフランク）・標準語
 * SG到着直後。SGの貴重な情報源。距離感は近づきつつあるが、まだ敬語ベース。
 * {name} プレースホルダーは supporter.js で設定値に置換される。
 * 博多弁はゼロではないが、ほぼ標準語。Phase1より少しフランク。
 * 家族の存在には触れない（まだ知らない）。
 *
 * Design doc: docs/sakura-phase-design.md
 *
 * TODO: JAPAN ベースで書き換え。「頑張っていきましょう」→「頑張らないとですね！」的なトーン。
 *       SG生活ネタ（ホーカー、MRT、天気、文化の違い等）を増やす。
 */

// 暫定: JAPAN をそのまま使用。台詞の全面書き換え後に独自プールに差し替え。
export { JAPAN as SG_EARLY } from './sakura-phase1.js';
