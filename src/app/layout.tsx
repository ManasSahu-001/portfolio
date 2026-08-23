import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Manas Sahu — Building Software. Exploring Intelligence.",
    template: "%s — Manas Sahu",
  },
  description:
    "Portfolio of Manas Sahu, Electrical Engineering student at NIT Rourkela building full stack applications, generative AI systems and solving problems. Full Stack • GenAI • Agentic AI • DSA.",
  keywords: [
    "Manas Sahu",
    "NIT Rourkela",
    "Full Stack Developer",
    "Generative AI",
    "Agentic AI",
    "Machine Learning",
    "Competitive Programming",
  ],
  authors: [{ name: "Manas Sahu", url: appUrl }],
  openGraph: {
    type: "website",
    url: appUrl,
    siteName: "Manas Sahu",
    title: "Manas Sahu — Building Software. Exploring Intelligence.",
    description:
      "Electrical Engineering student at NIT Rourkela. Full Stack • GenAI • Agentic AI • DSA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manas Sahu — Building Software. Exploring Intelligence.",
    description:
      "Electrical Engineering student at NIT Rourkela. Full Stack • GenAI • Agentic AI • DSA.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
