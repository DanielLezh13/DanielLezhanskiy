import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

const title = "Daniel Lezhanskiy | Ideas, Writing & Projects";
const description =
  "Daniel Lezhanskiy's writing on philosophy, politics, religion, economics, and the ideas connecting them.";

export const metadata: Metadata = {
  metadataBase: new URL("https://daniellezhanskiy.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Daniel Lezhanskiy",
    title,
    description,
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Daniel Lezhanskiy — Explore My Ideas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
