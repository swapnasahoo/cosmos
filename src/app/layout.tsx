import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Big Bang Theory | Cosmological Simulator & Chronology",
  description: "Explore the origin of the cosmos: from the Planck Epoch and Cosmic Microwave Background to N-body expansion simulators, Keplerian planet accretion, and the rise of humanity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[#04020a] text-[#f5f4f8] font-body selection:bg-cyan-500/20 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
