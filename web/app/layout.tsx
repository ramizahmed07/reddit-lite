import { IBM_Plex_Sans, Noto_Sans } from "next/font/google";

import NavMenu from "@/components/NavMenucomponents";

import "./globals.css";

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-noto",
});

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-ibm",
});

export const metadata = {
  title: "Reddit Lite",
  description: "Lite version of reddit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${ibm.variable} ${noto.variable} text-reg font-sans bg-black text-white`}
      >
        <NavMenu />
        {children}
      </body>
    </html>
  );
}
