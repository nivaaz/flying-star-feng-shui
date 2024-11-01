import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";

const openSans = Open_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flying Star Feng Shui",
  description: "Flying Star Feng Shui Calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <>
          <nav className="text-center text-xs bg-cyan-50 dark:bg-cyan-800  flex flex-row justify-center p-1 ">
            <p className="my-auto"> Tools by Nivaaz</p>
            {/* <Link href="/feng-shui">
              {" "}
              <p className=" w-fit font-bold p-2 mx-1 bg-cyan-100 dark:bg-cyan-900 rounded">
                {" "}
                Feng Shui{" "}
              </p>
            </Link>
            <Link href="/numerology">
              <p className=" w-fit font-bold p-2 mx-1 bg-cyan-100 dark:bg-cyan-900 rounded">
                {" "}
                Numerology{" "}
              </p>
            </Link> */}
          </nav>
          {children}
        </>
      </body>
      <GoogleAnalytics gaId="G-S4DN9BVZ37" />
    </html>
  );
}
