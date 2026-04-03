import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "Mike Rita | Award-Winning Canadian Comedian",
  description:
    "Mike Rita is an award-winning comedian from Toronto, known for his relatable storytelling and sharp humour. Honoured by the President of Portugal (2024). Comedy specials 'Reets' (2025) and 'Live in Toronto' (2023) available now.",
  openGraph: {
    title: "Mike Rita | Award-Winning Canadian Comedian",
    description:
      "Award-winning comedian from Toronto. Comedy specials 'Reets' and 'Live in Toronto' available now.",
    url: "https://www.mikerita.com",
    siteName: "Mike Rita",
    images: [
      {
        url: "/images/reets-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Mike Rita — Reets",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mike Rita | Award-Winning Canadian Comedian",
    description:
      "Award-winning comedian from Toronto. Comedy specials 'Reets' and 'Live in Toronto' available now.",
    images: ["/images/reets-hero.jpg"],
  },
  verification: {
    google: "xgIsIAoNd5kKQnVB85rbI4teM_5t-nuVGTcgQ6rj6GE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${inter.className}`}
        style={{ backgroundColor: "#1a0f0a", color: "#F5F0E8", margin: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
