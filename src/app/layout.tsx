import type { Metadata } from "next";
import "./globals.css";
import { siteMetadata } from '@/app/data/siteMetadata';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
