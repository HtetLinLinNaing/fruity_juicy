import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fruity Juicy",
  description: "Fruity Juicy project foundation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{"[data-preloader] { display: none !important; }"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
