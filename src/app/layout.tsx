import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hidayat Garage | Premium Supercar Rental",
  description:
    "Layanan sewa supercar eksklusif. Koleksi Lamborghini, Ferrari, Pagani, McLaren, Porsche, dan Bugatti dengan standar presisi tertinggi.",
  keywords:
    "car rental, supercar, luxury, lamborghini, ferrari, pagani, mclaren, porsche, bugatti, sewa mobil mewah, Hidayat garage",
  openGraph: {
    title: "Hidayat Garage | Premium Supercar Rental",
    description:
      "Private Automobili Collection — Kemewahan murni & performa tanpa kompromi.",
    type: "website",
    siteName: "Hidayat Garage",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${outfit.variable} ${cormorant.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
