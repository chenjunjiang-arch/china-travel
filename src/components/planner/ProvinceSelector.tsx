'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import provinces from '@/data/provinces.json';

interface Province {
  name: string;
  shortName: string;
  capital: string;
  description: string;
  cities: unknown[];
}

interface ProvinceSelectorProps {
  onSelect: (provinceName: string) => void;
  selected: string | null;
}

export default function ProvinceSelector({ onSelect, selected }: ProvinceSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = (provinces as Province[]).filter(
    (p) =>
      p.name.includes(search) ||
      p.shortName.includes(search) ||
      p.capital.includes(search)
  );

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索省份、简称或省会..."
          className="w-full rounded-md border border-ink/20 bg-rice-paper py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-cinnabar focus:outline-none focus:ring-1 focus:ring-cinnabar/30"
        />
      </div>

      {/* Province grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((province) => {
          const isSelected = selected === province.name;
          const hasData = province.cities && province.cities.length > 0;

          return (
            <button
              key={province.name}
              onClick={() => onSelect(province.name)}
              className={clsx(
                'relative flex flex-col items-center rounded-lg border p-3 text-center transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-cinnabar bg-cinnabar/10 shadow-md ring-1 ring-cinnabar/30'
                  : 'border-ink/10 bg-rice-paper/80 hover:border-cinnabar/30 hover:shadow-sm hover:-translate-y-0.5'
              )}
            >
              {hasData && (
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-jade px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                  推荐
                </span>
              )}
              <span className={clsx(
                'text-2xl font-bold mb-1',
                isSelected ? 'text-cinnabar' : 'text-ink'
              )}>
                {province.shortName}
              </span>
              <span className="text-xs text-ink/70">{province.name}</span>
              <span className="text-[10px] text-ink/40">{province.capital}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-ink/40 py-8">未找到匹配的省份</p>
      )}
    </div>
  );
}
