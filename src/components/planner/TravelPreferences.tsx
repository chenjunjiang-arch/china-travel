'use client';

import { clsx } from 'clsx';
import { Car, Plane, TrainFront, Zap, Footprints, Coffee } from 'lucide-react';

export type TransportMode = '自驾' | '飞机' | '高铁';
export type TripPace = '特种兵' | '常规' | '休闲';

interface TravelPreferencesProps {
  transportMode: TransportMode;
  tripPace: TripPace;
  onTransportChange: (mode: TransportMode) => void;
  onPaceChange: (pace: TripPace) => void;
}

const TRANSPORT_OPTIONS: { value: TransportMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: '自驾', label: '自驾', icon: <Car className="h-6 w-6" />, desc: '自由灵活，可深入小众景点' },
  { value: '飞机', label: '飞机', icon: <Plane className="h-6 w-6" />, desc: '适合远距离，节省时间' },
  { value: '高铁', label: '高铁', icon: <TrainFront className="h-6 w-6" />, desc: '高效舒适，城际首选' },
];

const PACE_OPTIONS: { value: TripPace; label: string; icon: React.ReactNode; desc: string; detail: string }[] = [
  { value: '特种兵', label: '特种兵', icon: <Zap className="h-6 w-6" />, desc: '行程最满，不留遗憾', detail: '早7点出发，晚10点回酒店' },
  { value: '常规', label: '常规', icon: <Footprints className="h-6 w-6" />, desc: '节奏适中，劳逸结合', detail: '早9点出发，晚9点回酒店' },
  { value: '休闲', label: '休闲', icon: <Coffee className="h-6 w-6" />, desc: '轻松惬意，享受度假', detail: '早11点出门，晚8点回酒店' },
];

export default function TravelPreferences({
  transportMode,
  tripPace,
  onTransportChange,
  onPaceChange,
}: TravelPreferencesProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Transport mode */}
      <div>
        <h3 className="text-lg font-bold text-ink mb-3 text-center">交通方式</h3>
        <div className="grid grid-cols-3 gap-3">
          {TRANSPORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTransportChange(opt.value)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer',
                transportMode === opt.value
                  ? 'border-cinnabar bg-cinnabar/5 text-cinnabar shadow-md'
                  : 'border-ink/10 text-ink/60 hover:border-cinnabar/30 hover:text-ink'
              )}
            >
              {opt.icon}
              <span className="font-medium text-sm">{opt.label}</span>
              <span className="text-[11px] text-ink/50 text-center leading-tight">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trip pace */}
      <div>
        <h3 className="text-lg font-bold text-ink mb-3 text-center">行程紧凑程度</h3>
        <div className="grid grid-cols-3 gap-3">
          {PACE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPaceChange(opt.value)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer',
                tripPace === opt.value
                  ? 'border-cinnabar bg-cinnabar/5 text-cinnabar shadow-md'
                  : 'border-ink/10 text-ink/60 hover:border-cinnabar/30 hover:text-ink'
              )}
            >
              {opt.icon}
              <span className="font-medium text-sm">{opt.label}</span>
              <span className="text-[11px] text-ink/50 text-center leading-tight">{opt.desc}</span>
              <span className="text-[10px] text-ink/40 text-center">{opt.detail}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
