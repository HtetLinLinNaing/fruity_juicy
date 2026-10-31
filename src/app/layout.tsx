import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fredoka = localFont({
  src: "./fonts/Fredoka.ttf",
  variable: "--font-fredoka",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fruity Juicy",
  description: "A little fresh. A lot of fun. Meet your daily dose of happy with Fruity Juicy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body>
        <noscript>
          <style>{`
            [data-preloader] { display: none !important; }
            [data-hero-ready="false"] [data-hero-copy],
            [data-hero-ready="false"] [data-fruit-enter] { opacity: 1 !important; }
          `}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
