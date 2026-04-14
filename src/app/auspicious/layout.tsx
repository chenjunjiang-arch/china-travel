import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "黄道吉日 - 中国旅行推荐系统",
  description: "查看近期宜出行的黄道吉日，根据传统历法选择最佳出发日期",
};

export default function AuspiciousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
