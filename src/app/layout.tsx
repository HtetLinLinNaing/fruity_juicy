import type { Metadata } from "next";
import Preloader from "@/components/Preloader";
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
        <Preloader contentId="page-content" />
        <noscript>
          <style>{"[data-preloader] { display: none !important; }"}</style>
        </noscript>
        <div id="page-content">{children}</div>
      </body>
    </html>
  );
}
