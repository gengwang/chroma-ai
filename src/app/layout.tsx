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
    display: "auto",
  }
)

export const metadata: Metadata = siteMetadata;
// BUG: FIXME: The font is not loading on the first page load.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html lang="en" className={spaceMono.className}>
			<body className="antialiased h-screen">
				<div className="flex flex-col min-h-screen mx-auto max-w-7xl">
					<div className="flex-0">
						<Header />
					</div>
					<div className="flex flex-grow">
						{children}
					</div>
					<div className="flex-0">
						<Footer />
					</div>
				</div>
			</body>
		</html>
	);
}
