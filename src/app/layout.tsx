import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-chinese",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "中国旅行推荐系统 - 八字择日智能行程",
  description: "基于八字五行分析的中国旅行智能推荐系统，提供择日、美食药膳与行程规划",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSerifSC.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
