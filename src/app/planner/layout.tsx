import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "行程规划 - 中国旅行推荐系统",
  description: "AI智能生成详细中国旅行计划，三餐美食推荐精确到店，结合五行食疗养生",
};

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
