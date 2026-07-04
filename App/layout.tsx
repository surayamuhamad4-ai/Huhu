import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { GIRLFRIEND_FIRST_NAME } from "@/lib/data";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `For ${GIRLFRIEND_FIRST_NAME} — A Love Letter`,
  description:
    "An interactive love letter, timeline, and collection of every reason why — made for Megan, by Aidil.",
  robots: {
    index: false, // private/personal site — keep it out of search engines
    follow: false,
  },
  openGraph: {
    title: `For ${GIRLFRIEND_FIRST_NAME}`,
    description: "A love letter, written in code.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFB6C8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="font-body antialiased">
        {/* Skip link for keyboard / screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-plum focus:text-cream focus:px-4 focus:py-2 focus:rounded-full"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
