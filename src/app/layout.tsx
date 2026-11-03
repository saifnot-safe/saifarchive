import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAIF ARCHIVE",
  description:
    "saif alshawaf, software engineering student at western. frontend, game systems, and interactive software.",
  metadataBase: new URL("https://saifarchive.xyz"),
  openGraph: {
    title: "SAIF ARCHIVE",
    description: "frontend, game systems, and interactive software by saif alshawaf.",
    url: "https://saifarchive.xyz",
    siteName: "saifarchive.xyz",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-mono)]">
        {children}
      </body>
    </html>
  );
}
