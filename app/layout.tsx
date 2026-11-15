import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Ask Me | 郑栩 AI Career Agent",
  description: "东华大学信息管理与信息系统郑栩的可验证、可追溯 AI 产品经理求职数字分身。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geist.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
