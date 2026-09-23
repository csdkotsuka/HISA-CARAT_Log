import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import type { ActiveTab } from './components/TabNavigation';
import { DailyLogTab } from './components/DailyLogTab';
import { PTEvalTab } from './components/PTEvalTab';
import { DashboardTab } from './components/DashboardTab';
import { CaratLoungeModal } from './components/CaratLoungeModal';
import { MedicalReportModal } from './components/MedicalReportModal';
import { AvatarEvolutionModal } from './components/AvatarEvolutionModal';
import { Database, Trash2, Sparkles, Settings } from 'lucide-react';
import type { DailyLog, PTEvalDock } from './types';
import {
  getDailyLogs,
  saveDailyLogs,
  getPTDocks,
  savePTDocks,
  getConcertGoal,
  saveConcertGoal,
  getSavedAvatarStyle,
  saveAvatarStyle,
} from './utils/storage';
import type { ConcertGoal, AvatarStyle } from './utils/storage';
import {
  subscribeDailyLogs,
  saveDailyLogToFirestore,
  deleteDailyLogFromFirestore,
  subscribePTDocks,
  savePTDockToFirestore,
  deletePTDockFromFirestore,
  subscribeConcertGoal,
  saveConcertGoalToFirestore,
  seedSampleDataManually,
  clearAllFirestoreData,
} from './firebase/firestoreService';
import { calculateStreakInfo } from './utils/streak';

export const App: React.FC = () => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [ptDocks, setPtDocks] = useState<PTEvalDock[]>([]);
  const [concertGoal, setConcertGoal] = useState<ConcertGoal>(getConcertGoal());
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [isCaratLoungeOpen, setIsCaratLoungeOpen] = useState(false);
  const [isMedicalReportOpen, setIsMedicalReportOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle | null>(getSavedAvatarStyle());
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');

  // Load from LocalStorage first, then attach Firestore real-time listeners
  useEffect(() => {
    // 1. Initial Local Cache
    setDailyLogs(getDailyLogs());
    setPtDocks(getPTDocks());
    setConcertGoal(getConcertGoal());

    // 2. Firestore Real-time Subscriptions (strictly reads what is in Firestore, no auto-seed)
    const unsubDaily = subscribeDailyLogs(
      (remoteLogs) => {
        setDailyLogs(remoteLogs);
        saveDailyLogs(remoteLogs);
        setCloudStatus('synced');
      },
      () => setCloudStatus('offline')
    );

    const unsubPT = subscribePTDocks(
      (remoteDocks) => {
        setPtDocks(remoteDocks);
        savePTDocks(remoteDocks);
        setCloudStatus('synced');
      },
      () => setCloudStatus('offline')
    );

    const unsubGoal = subscribeConcertGoal(
      (remoteGoal) => {
        setConcertGoal(remoteGoal);
        saveConcertGoal(remoteGoal);
        setCloudStatus('synced');
      },
      () => setCloudStatus('offline')
    );

    return () => {
      unsubDaily();
      unsubPT();
      unsubGoal();
    };
  }, []);

  // Calculate streak info for gamified avatars & daily stamps
  const streakInfo = calculateStreakInfo(dailyLogs, selectedAvatarStyle);

  const handleSelectAvatarStyle = (style: AvatarStyle) => {
    setSelectedAvatarStyle(style);
    saveAvatarStyle(style);
  };

  // Save handlers (updates LocalStorage immediately + syncs to Firestore)
  const handleSaveDailyLog = async (newLog: DailyLog) => {
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

    try {
      setCloudStatus('syncing');
      await saveDailyLogToFirestore(newLog);
      setCloudStatus('synced');
    } catch (e) {
      console.warn('Failed to sync daily log to Firestore:', e);
      setCloudStatus('offline');
    }
  };

  const handleSavePTDock = async (newDock: PTEvalDock) => {
    const updated = [...ptDocks, newDock];
    setPtDocks(updated);
    savePTDocks(updated);

    try {
      setCloudStatus('syncing');
      await savePTDockToFirestore(newDock);
      setCloudStatus('synced');
    } catch (e) {
      console.warn('Failed to sync PT dock to Firestore:', e);
      setCloudStatus('offline');
    }
  };

  const handleDeleteDailyLog = async (id: string) => {
    if (window.confirm('この日の日常記録を削除してもよろしいですか？')) {
      const target = dailyLogs.find((l) => l.id === id);
      const updated = dailyLogs.filter((l) => l.id !== id);
      setDailyLogs(updated);
      saveDailyLogs(updated);

      if (target) {
        try {
          await deleteDailyLogFromFirestore(target.date);
        } catch (e) {
          console.warn('Failed to delete from Firestore:', e);
        }
      }
    }
  };

  const handleDeletePTDock = async (id: string) => {
    if (window.confirm('この定期チェック記録を削除してもよろしいですか？')) {
      const updated = ptDocks.filter((p) => p.id !== id);
      setPtDocks(updated);
      savePTDocks(updated);

      try {
        await deletePTDockFromFirestore(id);
      } catch (e) {
        console.warn('Failed to delete PT dock from Firestore:', e);
      }
    }
  };

  const handleSaveGoal = async (goal: ConcertGoal) => {
    setConcertGoal(goal);
    saveConcertGoal(goal);

    try {
      setCloudStatus('syncing');
      await saveConcertGoalToFirestore(goal);
      setCloudStatus('synced');
    } catch (e) {
      console.warn('Failed to save concert goal to Firestore:', e);
      setCloudStatus('offline');
    }
  };

  const handleManualSync = useCallback(async () => {
    setCloudStatus('syncing');
    try {
      for (const log of dailyLogs) {
        await saveDailyLogToFirestore(log);
      }
      for (const dock of ptDocks) {
        await savePTDockToFirestore(dock);
      }
      await saveConcertGoalToFirestore(concertGoal);
      setCloudStatus('synced');
      alert('クラウド (Firebase Firestore) と正常に同期しました！✨');
    } catch (e) {
      console.error('Manual sync failed:', e);
      setCloudStatus('offline');
      alert('同期エラー: Firestoreの接続やセキュリティルールをご確認ください。');
    }
  }, [dailyLogs, ptDocks, concertGoal]);

  const handleSeedSampleData = async () => {
    if (window.confirm('サンプルの日常記録と定期チェックデータをFirestoreに投入しますか？')) {
      try {
        setCloudStatus('syncing');
        await seedSampleDataManually();
        setCloudStatus('synced');
        alert('サンプルデータを投入しました！✨');
      } catch (e) {
        console.error(e);
        alert('サンプルデータの投入に失敗しました。Firestoreのルール等をご確認ください。');
      }
    }
  };

  const handleClearAllData = async () => {
    if (
      window.confirm(
        '⚠️ 本当にFirestoreとローカルの全記録データを完全削除しますか？\n（本番運用開始前のリセット用です）'
      )
    ) {
      try {
        setCloudStatus('syncing');
        await clearAllFirestoreData();
        setDailyLogs([]);
        saveDailyLogs([]);
        setPtDocks([]);
        savePTDocks([]);
        setCloudStatus('synced');
        alert('全データを完全消去しました。きれいな初期状態です！');
      } catch (e) {
        console.error(e);
        alert('データ削除に失敗しました。');
      }
    }
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
          cloudStatus={cloudStatus}
          onSyncNow={handleManualSync}
          activeAvatarStyle={streakInfo.activeStyle}
          onOpenEvolutionModal={() => setIsAvatarModalOpen(true)}
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
              streakInfo={streakInfo}
              onOpenEvolutionModal={() => setIsAvatarModalOpen(true)}
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
        <footer className="mt-12 mb-6 text-center text-xs text-slate-400 border-t border-pink-100/80 pt-6 space-y-3">
          <div className="flex items-center justify-center gap-1.5 font-bold text-slate-600">
            <span>HISA-CARAT Log ✨</span>
            <span className="text-pink-400">♥</span>
            <span>Rose Quartz & Serenity</span>
          </div>
          <p className="text-[11px] text-slate-400">
            ひさこのEGPAリハビリ ＆ セルフケア手帳 with ジョンハン👼💎（受診・定期測定共有対応）
          </p>

          {/* Admin / Data Management Section for Kazuhiro */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdminTools(!showAdminTools)}
              className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors py-1 px-2.5 rounded-full hover:bg-slate-100"
            >
              <Settings className="w-3 h-3" />
              <span>開発・データ管理ツール（かずくん用）</span>
            </button>

            {showAdminTools && (
              <div className="mt-3 p-3.5 bg-white/90 border border-slate-200 rounded-2xl max-w-md mx-auto text-left shadow-sm space-y-2.5 animate-fade-in">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Firestore ＆ ローカルデータ制御</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ひさこさんに渡す前にデータを真っ新にリセットしたり、動作確認用にサンプルデータを再投入できます。
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSeedSampleData}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold hover:bg-indigo-100 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>サンプルデータ投入</span>
                  </button>
                  <button
                    onClick={handleClearAllData}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-[11px] font-bold hover:bg-rose-100 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>全データを完全消去</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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

      <AvatarEvolutionModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        streakInfo={streakInfo}
        onSelectAvatar={handleSelectAvatarStyle}
      />
    </div>
  );
};

export default App;
