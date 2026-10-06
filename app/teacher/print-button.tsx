'use client';

export function PrintButton() {
  return (
    <button type="button" className="guide-print" onClick={() => window.print()}>
      この手引きを印刷する
    </button>
  );
}
