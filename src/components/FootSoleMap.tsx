import React from 'react';

interface FootSoleMapProps {
  selectedZones: string[];
  onChange: (zones: string[]) => void;
  readOnly?: boolean;
}

const ZONES = [
  { id: 'toes', label: 'つま先・足指 (Toes)', desc: 'ピリピリ・触覚低下' },
  { id: 'midfoot', label: '足裏中央・土踏まず (Midfoot)', desc: '歩行時の違和感' },
  { id: 'heel', label: 'かかと (Heel)', desc: '着地時の痛み' },
  { id: 'ankle', label: '足首・くるぶし (Ankle)', desc: '締め付け感・腫れ' },
  { id: 'calf', label: '下腿外側 (Lateral Calf)', desc: '腓骨神経領域のしびれ' },
];

export const FootSoleMap: React.FC<FootSoleMapProps> = ({
  selectedZones,
  onChange,
  readOnly = false,
}) => {
  const toggleZone = (zoneId: string) => {
    if (readOnly) return;
    if (selectedZones.includes(zoneId)) {
      onChange(selectedZones.filter((id) => id !== zoneId));
    } else {
      onChange([...selectedZones, zoneId]);
    }
  };

  return (
    <div className="bg-white/80 rounded-2xl p-4 border border-pink-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span className="text-base">🦶</span> 感覚低下・アロディニア（過敏痛）のある部位
        </span>
        <span className="text-[11px] text-pink-500 font-medium">
          {selectedZones.length} 箇所 選択中
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ZONES.map((zone) => {
          const isSelected = selectedZones.includes(zone.id);
          return (
            <button
              type="button"
              key={zone.id}
              onClick={() => toggleZone(zone.id)}
              disabled={readOnly}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300 shadow-sm text-pink-900'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-pink-50/40 hover:border-pink-200'
              }`}
            >
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-pink-500 ring-2 ring-pink-200' : 'bg-slate-300'}`} />
                  {zone.label}
                </div>
                <div className="text-[10px] text-slate-400 ml-3.5">{zone.desc}</div>
              </div>
              <span className="text-xs font-semibold">
                {isSelected ? '⚠️ 有' : '⚪︎ 無'}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-right">
        ※ご主人の包み込みケアや低周波TENSの重点部位の目安になります
      </p>
    </div>
  );
};
