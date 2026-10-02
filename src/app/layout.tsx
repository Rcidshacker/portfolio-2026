import type { Metadata, Viewport } from "next";
import { Source_Sans_3, IBM_Plex_Mono, Shippori_Mincho_B1 } from "next/font/google";
import "./globals.css";
import "./stations.css";
import "./panels.css";

// Body copy is Latin only (Noto Sans JP's Latin glyphs are Source Sans), so one small variable font replaces
// a family that shipped ~370 CJK font-face rules. Mincho keeps its kanji, but its ~120 slices per weight are
// fetched on demand (preload: false) instead of all being preloaded, and only the weights the CSS uses.
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const ibmMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["300", "400", "500"], display: "swap" });
const mincho = Shippori_Mincho_B1({ subsets: ["latin"], variable: "--font-mincho", weight: ["400", "700"], display: "swap", preload: false });

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

export const viewport: Viewport = { themeColor: "#f0e7d1" };

// Runs before first paint so the saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="ink")document.documentElement.dataset.theme="ink"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sans.variable} ${ibmMono.variable} ${mincho.variable} antialiased`}>{children}</body>
    </html>
  );
}
