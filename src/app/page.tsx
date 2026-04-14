import { Sparkles, Calendar, MapPin, ChevronRight } from "lucide-react";
import InkButton from "@/components/ui/InkButton";
import InkCard from "@/components/ui/InkCard";
import InkDivider from "@/components/ui/InkDivider";
import Disclaimer from "@/components/ui/Disclaimer";

const features = [
  {
    icon: Sparkles,
    title: "八字分析",
    description: "根据您的生辰八字，分析五行喜用，推荐最适合的旅行目的地和美食",
    href: "/bazi",
  },
  {
    icon: Calendar,
    title: "黄道吉日",
    description: "查看近期宜出行的黄道吉日，选择最佳出发日期",
    href: "/auspicious",
  },
  {
    icon: MapPin,
    title: "行程规划",
    description: "AI智能生成详细旅行计划，三餐美食推荐精确到店",
    href: "/planner",
  },
];

const steps = [
  { number: "一", label: "选择省份" },
  { number: "二", label: "输入生辰(可选)" },
  { number: "三", label: "生成专属行程" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] pt-16 bg-ink-wash-dark text-rice-paper overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cinnabar/30 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gold/20 blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          {/* Decorative top element */}
          <p className="text-cinnabar/70 text-2xl mb-4 select-none">&#9670; &#9670; &#9670;</p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-wide">
            中国旅行推荐系统
          </h1>

          <p className="text-lg md:text-xl text-rice-paper/70 mb-10 leading-relaxed">
            结合八字命理与黄道吉日，为您定制专属旅行方案
          </p>

          <InkButton href="/planner" size="lg">
            开始规划旅行
            <ChevronRight className="h-5 w-5" />
          </InkButton>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="bg-rice-texture py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-ink mb-12">
            三大核心功能
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <InkCard key={feature.href} hoverable>
                <feature.icon className="h-10 w-10 text-cinnabar mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">
                  {feature.title}
                </h3>
                <p className="text-ink/60 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <InkButton href={feature.href} variant="secondary" size="sm">
                  了解更多
                  <ChevronRight className="h-4 w-4" />
                </InkButton>
              </InkCard>
            ))}
          </div>
        </div>
      </section>

      <InkDivider />

      {/* Steps Section */}
      <section className="bg-rice-texture pb-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-ink mb-12">
            三步开始旅程
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-cinnabar text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <p className="text-lg font-medium text-ink">{step.label}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute text-ink/20 h-6 w-6" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Disclaimer />
          </div>
        </div>
      </section>
    </div>
  );
}
