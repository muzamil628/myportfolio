import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SmoothScroll } from '@/lib/scroll';

const inter = localFont({
  src: [
    { path: '../fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYMZg.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf', weight: '800', style: 'normal' },
    { path: '../fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

const instrument = localFont({
  src: [
    { path: '../fonts/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf', weight: '400', style: 'italic' },
  ],
  variable: '--font-instrument',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: '../fonts/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8FqtjPQ.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yK1jPQ.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Muzamil Arshad | Full Stack Web Developer',
  description: 'Portfolio site for Muzamil Arshad, a Full Stack Web Developer.',
  metadataBase: new URL('https://example.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Muzamil Arshad | Full Stack Web Developer',
    description: 'Portfolio site for Muzamil Arshad, a Full Stack Web Developer.',
    images: ['/og.jpg'],
  },
};

export const viewport = {
  themeColor: '#f4f2ee',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
