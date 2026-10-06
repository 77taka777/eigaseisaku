import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mirai-seisaku.example'),
  title: '未来制作録｜映画と舞台の制作をめぐる問い',
  description: '映画と舞台をつくる仕事を、3人の案内役と5つの問いから学べる無料の学習プログラム。職業紹介、体験課題、修了証、授業用の手引きつき。',
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
