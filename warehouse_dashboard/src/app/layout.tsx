import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClientProviders } from "../components/ClientProviders";

const kanit = localFont({
  src: [
    { path: "./fonts/Kanit-Regular.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Kanit-Regular.ttf", weight: "200", style: "normal" },
    { path: "./fonts/Kanit-Regular.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Kanit-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Kanit-Regular.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Kanit-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Kanit-SemiBold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Kanit-SemiBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Kanit-SemiBold.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Kanit-Italic.ttf", weight: "100", style: "italic" },
    { path: "./fonts/Kanit-Italic.ttf", weight: "200", style: "italic" },
    { path: "./fonts/Kanit-Italic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/Kanit-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Kanit-Italic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/Kanit-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./fonts/Kanit-SemiBoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Kanit-SemiBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "./fonts/Kanit-SemiBoldItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบคลังข้อมูลวิจัยและนวัตกรรม มหาวิทยาลัยเกษตรศาสตร์ | MyKU Warehouse",
  description: "ระบบคลังข้อมูลสรุปผลงานวิจัยและวิชาการ คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={kanit.variable}>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body
        className={kanit.className}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f5f7f9",
          minHeight: "100vh",
          overflowX: "hidden",
          fontFamily: "var(--font-kanit), 'Kanit', sans-serif",
        }}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}