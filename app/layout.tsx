import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://table-expressive-therapies-inc.jason-hou.chatgpt.site'),
  title: 'Table Expressive Therapies, Inc. | 臺波波表達性治療',
  description: 'Promoting healing and well-being through expressive arts-based and culturally responsive therapeutic practice.',
  openGraph: {
    title: 'Table Expressive Therapies, Inc. | 臺波波表達性治療',
    description: 'Create · Connect · Be Heard. Expressive arts and culturally responsive community care.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Table Expressive Therapies — Create, Connect, Be Heard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Table Expressive Therapies, Inc. | 臺波波表達性治療',
    description: 'Create · Connect · Be Heard. Expressive arts and culturally responsive community care.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
