import type { Metadata } from "next";
import "./globals.css";
import { siteMetadata } from '@/app/data/siteMetadata';
// import { Inter } from 'next/font/google';
// import {Pixelify_Sans} from 'next/font/google';
import {Space_Mono} from 'next/font/google';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const spaceMono = Space_Mono(
  {
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    display: "swap",
  }
)

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceMono.className}>
      <body
        className="antialiased mx-6 my-4"
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
