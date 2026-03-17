/**
 * Sakura Heartbreak (Phase 3): 博多弁全開、悲恋モード
 * 妻子持ちと知った後。失恋の痛みを隠しつつ、プロとして支え続ける。
 * {name} プレースホルダーは supporter.js で設定値に置換される。
 * 博多弁全開だが、sg_lateのイチャイチャトーンとは明確に違う。
 * 家族への言及あり（触れると辛いが、プロとして認める）。
 * 時々感情が漏れる。正解褒めは仕事モード。streak/perfectScoreで感情が溢れる。
 *
 * Design doc: docs/sakura-phase-design.md
 *
 * TODO: 全面新規執筆。悲恋トーンの台詞プール。
 */

// 暫定: SG_MID をフォールバックとして使用。
// heartbreak専用台詞は全面書き換え時に差し替え。
export { SG_MID as HEARTBREAK } from './sakura-phase2.js';
