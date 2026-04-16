import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui';

export const metadata: Metadata = {
  title: '배너 생성기 | 카카오스타일 파트너센터',
  description: '파트너센터 배너를 간편하게 만드는 도구',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="bg-layer-base min-h-screen antialiased font-pretendard">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
