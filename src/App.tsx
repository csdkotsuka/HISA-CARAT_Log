import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import type { ActiveTab } from './components/TabNavigation';
import { DailyLogTab } from './components/DailyLogTab';
import { PTEvalTab } from './components/PTEvalTab';
import { DashboardTab } from './components/DashboardTab';
import { CaratLoungeModal } from './components/CaratLoungeModal';
import { MedicalReportModal } from './components/MedicalReportModal';
import type { DailyLog, PTEvalDock } from './types';
import {
  getDailyLogs,
  saveDailyLogs,
  getPTDocks,
  savePTDocks,
  getConcertGoal,
  saveConcertGoal,
} from './utils/storage';
import type { ConcertGoal } from './utils/storage';

export const App: React.FC = () => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [ptDocks, setPtDocks] = useState<PTEvalDock[]>([]);
  const [concertGoal, setConcertGoal] = useState<ConcertGoal>(getConcertGoal());
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [isCaratLoungeOpen, setIsCaratLoungeOpen] = useState(false);
  const [isMedicalReportOpen, setIsMedicalReportOpen] = useState(false);

  // Initialize from storage
  useEffect(() => {
    setDailyLogs(getDailyLogs());
    setPtDocks(getPTDocks());
    setConcertGoal(getConcertGoal());
  }, []);

  // Save handlers
  const handleSaveDailyLog = (newLog: DailyLog) => {
    const existingIndex = dailyLogs.findIndex((l) => l.date === newLog.date);
    let updated: DailyLog[];
    if (existingIndex >= 0) {
      updated = [...dailyLogs];
      updated[existingIndex] = newLog;
    } else {
      updated = [newLog, ...dailyLogs];
    }
    setDailyLogs(updated);
    saveDailyLogs(updated);
  };

  const handleSavePTDock = (newDock: PTEvalDock) => {
    const updated = [...ptDocks, newDock];
    setPtDocks(updated);
    savePTDocks(updated);
  };

  const handleDeleteDailyLog = (id: string) => {
    if (window.confirm('この日の日常記録を削除してもよろしいですか？')) {
      const updated = dailyLogs.filter((l) => l.id !== id);
      setDailyLogs(updated);
      saveDailyLogs(updated);
    }
  };

  const handleDeletePTDock = (id: string) => {
    if (window.confirm('この和宏先生の評価ドックを削除してもよろしいですか？')) {
      const updated = ptDocks.filter((p) => p.id !== id);
      setPtDocks(updated);
      savePTDocks(updated);
    }
  };

  const handleSaveGoal = (goal: ConcertGoal) => {
    setConcertGoal(goal);
    saveConcertGoal(goal);
  };

  const latestDaily = dailyLogs.length > 0 ? dailyLogs[0] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F6] via-[#FFF9FA] to-[#EFF4FC] py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Jeonghan avatar, quotes, and quick stats */}
        <Header
          onOpenCaratLounge={() => setIsCaratLoungeOpen(true)}
          onOpenMedicalReport={() => setIsMedicalReportOpen(true)}
          currentPslDose={latestDaily?.pslDoseMg ?? 6}
          totalLogsCount={dailyLogs.length}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ptDocksCount={ptDocks.length}
        />

        {/* Active Tab View */}
        <main className="transition-all duration-300">
          {activeTab === 'daily' && (
            <DailyLogTab
              onSaveLog={handleSaveDailyLog}
              existingLogs={dailyLogs}
            />
          )}

          {activeTab === 'pt-eval' && (
            <PTEvalTab
              onSaveDock={handleSavePTDock}
              ptDocks={ptDocks}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab
              dailyLogs={dailyLogs}
              ptDocks={ptDocks}
              onDeleteDailyLog={handleDeleteDailyLog}
              onDeletePTDock={handleDeletePTDock}
              onOpenMedicalReport={() => setIsMedicalReportOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 mb-6 text-center text-xs text-slate-400 border-t border-pink-100/80 pt-6">
          <div className="flex items-center justify-center gap-1.5 font-bold text-slate-600 mb-1">
            <span>HISA-CARAT Log ✨</span>
            <span className="text-pink-400">♥</span>
            <span>Rose Quartz & Serenity</span>
          </div>
          <p className="text-[11px] text-slate-400">
            ひさこのEGPAリハビリ ＆ 和宏先生の評価ドック with ジョンハン👼💎
          </p>
        </footer>
      </div>

      {/* Modals */}
      <CaratLoungeModal
        isOpen={isCaratLoungeOpen}
        onClose={() => setIsCaratLoungeOpen(false)}
        concertGoal={concertGoal}
        onSaveConcertGoal={handleSaveGoal}
      />

      <MedicalReportModal
        isOpen={isMedicalReportOpen}
        onClose={() => setIsMedicalReportOpen(false)}
        dailyLogs={dailyLogs}
        ptDocks={ptDocks}
      />
    </div>
  );
};

export default App;
