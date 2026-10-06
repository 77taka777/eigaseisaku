import { program } from '@/content/program';

/**
 * 効果測定用の匿名レポート
 * ------------------------------------------------------------
 * 社会貢献活動の報告（参加数、理解度の変化）に使える最小限の値だけを送ります。
 * 名前、連絡先、端末を特定する情報は含めません。
 * `program.report.endpoint` が空の間は何も送信しません。
 */
export type LearningReport = {
  completedAt: string;
  correct: number;
  total: number;
  /** 学習前の自己評価 1〜5。未回答は null */
  before: number | null;
  /** 学習後の自己評価 1〜5。未回答は null */
  after: number | null;
  /** 興味の変化 0:増えた 1:変わらない 2:合わないと分かった。未回答は null */
  interest: number | null;
};

export function sendReport(report: LearningReport): void {
  const { endpoint } = program.report;
  if (!endpoint || typeof navigator === 'undefined') return;

  try {
    const body = new Blob([JSON.stringify(report)], { type: 'application/json' });
    navigator.sendBeacon(endpoint, body);
  } catch {
    // 学習体験を止めないため、送信の失敗は無視します。
  }
}
