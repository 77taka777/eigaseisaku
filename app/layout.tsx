import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mirai-seisaku.example'),
  title: '未来制作録｜映画と舞台の制作をめぐる問い',
  description: '3人の案内役と、撮影・照明・音響・舞台転換・編集の5つの問いを巡る映画・舞台制作サイト。',
  openGraph: {
    title: '未来制作録',
    description: '物語が、生まれる瞬間へ。',
    images: [{ url: '/og.png', width: 1672, height: 941 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '未来制作録',
    description: '物語が、生まれる瞬間へ。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
