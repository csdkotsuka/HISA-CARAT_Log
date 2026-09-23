import type { DailyLog, PTEvalDock } from '../types';

export const exportDailyLogsToCsv = (logs: DailyLog[]) => {
  const headers = [
    '日付',
    '体調コンディション',
    '易疲労感(1-5)',
    'しびれ・痛みVAS(0-10)',
    'アロディニア(0-3)',
    '痛む部位',
    '椅子立ち座り',
    'タオルギャザー',
    'ご主人の包み込みケア',
    '低周波TENS',
    'ストレッチ',
    '散歩',
    'プレドニン(mg)',
    '体温(℃)',
    '歩数',
    'お天気/気圧',
    'ハニ度/推し活力(%)',
    'メモ',
  ];

  const rows = logs.map((log) => [
    `"${log.date}"`,
    `"${log.condition}"`,
    log.fatigueLevel,
    log.painVas,
    log.allodyniaLevel,
    `"${log.painLocations.join(' / ')}"`,
    log.exercises.chairSquats ? '済' : '未',
    log.exercises.towelGather ? '済' : '未',
    log.exercises.husbandSoleCare ? '済' : '未',
    log.exercises.tensTherapy ? '済' : '未',
    log.exercises.calfStretch ? '済' : '未',
    log.exercises.walking ? '済' : '未',
    log.pslDoseMg,
    log.bodyTemp ?? '',
    log.stepCount ?? '',
    `"${log.weather}"`,
    log.oshiEnergy,
    `"${(log.memo || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `HISA-CARAT_日常記録_${new Date().toISOString().slice(0, 10)}.csv`);
};

export const exportPTDocksToCsv = (docks: PTEvalDock[]) => {
  const headers = [
    '評価日',
    '担当評価者',
    'MMT_前脛骨筋(背屈)',
    'MMT_長母趾伸筋',
    'MMT_下腿三頭筋(底屈)',
    'MMT_大腿四頭筋',
    'CS-30テスト(回)',
    '片足カーフレイズ左(回)',
    '片足カーフレイズ右(回)',
    'ロンベルグ試験(閉眼バランス)',
    '下腿周径_右(cm)',
    '下腿周径_左(cm)',
    '感覚低下・アロディニア部位',
    'アロディニア重症度(0-10)',
    '和宏先生からのアドバイス',
    '次回目標',
  ];

  const rows = docks.map((dock) => [
    `"${dock.date}"`,
    `"${dock.evaluator}"`,
    dock.mmt.tibialisAnterior,
    dock.mmt.extensorHallucisLongus,
    dock.mmt.gastrocnemiusSoleus,
    dock.mmt.quadriceps,
    dock.functional.cs30Count,
    dock.functional.singleLegHeelRaiseLeft,
    dock.functional.singleLegHeelRaiseRight,
    `"${dock.functional.rombergTest}"`,
    dock.calfCircumference.rightCm,
    dock.calfCircumference.leftCm,
    `"${dock.sensoryZones.join(' / ')}"`,
    dock.allodyniaScore,
    `"${dock.kazuhiroAdvice.replace(/"/g, '""')}"`,
    `"${dock.nextGoal.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `HISA-CARAT_和宏先生評価ドック_${new Date().toISOString().slice(0, 10)}.csv`);
};

function downloadBlob(content: string, filename: string) {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
