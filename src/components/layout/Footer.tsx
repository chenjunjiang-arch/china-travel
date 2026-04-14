import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-rice-paper/60 border-t border-rice-paper/10">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} 中国旅行推荐系统
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/bazi" className="hover:text-cinnabar transition-colors">
              八字分析
            </Link>
            <Link href="/auspicious" className="hover:text-cinnabar transition-colors">
              黄道吉日
            </Link>
            <Link href="/planner" className="hover:text-cinnabar transition-colors">
              行程规划
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-rice-paper/40">
          本系统仅供娱乐参考，不构成任何专业建议
        </p>
      </div>
    </footer>
  );
}
