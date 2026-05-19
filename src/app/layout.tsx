import type { Metadata } from "next";
import { Noto_Sans_JP, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["300", "400", "500"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ruchit Das — AI Engineer",
  description: "AI-native engineer shipping production-ready agentic systems, MCP infrastructure, and full-stack AI products.",
  keywords: ["AI Engineer", "Agentic AI", "MCP", "LangGraph", "RAG", "Ruchit Das"],
  openGraph: {
    title: "Ruchit Das — AI Engineer",
    description: "Top 3 @ IIT Bombay. 6 clinics. Building with MCP + LangGraph.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${notoSans.variable} ${ibmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
