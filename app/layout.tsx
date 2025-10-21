import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NFT Marketplace - Khám phá và sưu tập NFT độc đáo",
  description: "Khám phá, sưu tập và giao dịch NFT độc đáo trên nền tảng blockchain. Tạo, mua bán NFT một cách dễ dàng và an toàn.",
  keywords: ["NFT", "Marketplace", "Blockchain", "Crypto", "Digital Art", "Collectibles"],
  authors: [{ name: "NFT Marketplace Team" }],
  creator: "NFT Marketplace",
  publisher: "NFT Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nft-marketplace.vercel.app"),
  openGraph: {
    title: "NFT Marketplace - Khám phá và sưu tập NFT độc đáo",
    description: "Khám phá, sưu tập và giao dịch NFT độc đáo trên nền tảng blockchain.",
    url: "https://nft-marketplace.vercel.app",
    siteName: "NFT Marketplace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NFT Marketplace",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NFT Marketplace - Khám phá và sưu tập NFT độc đáo",
    description: "Khám phá, sưu tập và giao dịch NFT độc đáo trên nền tảng blockchain.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
