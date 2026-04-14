import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "八字分析 - 中国旅行推荐系统",
  description: "根据您的生辰八字，分析五行喜用神，推荐最适合的旅行目的地、方位和食疗美食",
};

export default function BaZiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
