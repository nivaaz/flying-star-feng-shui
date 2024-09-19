import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flying Star Feng Shui",
  description: "Flying Star Feng Shui Calculator",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>{children}</body>
      <GoogleAnalytics gaId="G-S4DN9BVZ37" />
    </html>
  )
}