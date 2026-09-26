import React, { useState } from 'react';
import { DynamicHeader } from './DynamicHeader';
import { DynamicDailyLogTab } from './DynamicDailyLogTab';
import { DynamicPeriodicEvalTab } from './DynamicPeriodicEvalTab';
import { DynamicDashboardTab } from './DynamicDashboardTab';
import { CaratLoungeModal } from './CaratLoungeModal';
import { PeriodicSummaryReportModal } from './PeriodicSummaryReportModal';
import { AIChatModal } from './AIChatModal';
import { AvatarEvolutionModal } from './AvatarEvolutionModal';
import { TabNavigation } from './TabNavigation';
import type { ActiveTab } from './TabNavigation';
import type { Tenant, Customer, GenericDailyLog, GenericEvalRecord } from '../types/tenant';
import type { AvatarStyle, ConcertGoal } from '../utils/storage';
import type { DailyLog, PTEvalDock } from '../types';
import { calculateStreakInfo } from '../utils/streak';

interface CustomerPortalViewProps {
  tenant: Tenant;
  customer: Customer;
  dailyLogs: GenericDailyLog[];
  evalRecords: GenericEvalRecord[];
  onSaveDailyLog: (log: GenericDailyLog) => void;
  onSaveEvalRecord: (record: GenericEvalRecord) => void;
  // Legacy support for Carat modals & dashboard
  legacyDailyLogs: DailyLog[];
  legacyPtDocks: PTEvalDock[];
  concertGoal: ConcertGoal;
  onSaveConcertGoal: (goal: ConcertGoal) => void;
  cloudStatus: 'synced' | 'syncing' | 'offline';
  onSyncNow: () => void;
  selectedAvatarStyle: AvatarStyle | null;
  onSelectAvatarStyle: (style: AvatarStyle) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  tenant,
  customer,
  dailyLogs,
  evalRecords,
  onSaveDailyLog,
  onSaveEvalRecord,
  legacyDailyLogs,
  legacyPtDocks,
  concertGoal,
  onSaveConcertGoal,
  cloudStatus,
  onSyncNow,
  selectedAvatarStyle,
  onSelectAvatarStyle,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [isLoungeOpen, setIsLoungeOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Convert generic logs to legacy logs format for dashboard compatibility if needed
  const displayDailyLogs: DailyLog[] =
    tenant.id === 'tenant-carat-hisa' && legacyDailyLogs.length > 0
      ? legacyDailyLogs
      : dailyLogs.map((gl) => ({
          id: gl.id,
          date: gl.date,
          condition: gl.condition || 'good',
          fatigueLevel: gl.sliderValues?.fatigueLevel ?? gl.sliderValues?.muscleSoreness ?? 2,
          painVas: gl.sliderValues?.painVas ?? 0,
          allodyniaLevel: 0,
          painLocations: [],
          exercises: {
            chairSquats: !!gl.checkStates?.chairSquats,
            towelGather: !!gl.checkStates?.towelGather,
            husbandSoleCare: !!gl.checkStates?.husbandSoleCare,
            tensTherapy: !!gl.checkStates?.tensTherapy,
            calfStretch: !!gl.checkStates?.calfStretch,
            walking: !!gl.checkStates?.walking,
          },
          pslDoseMg: gl.numericValues?.pslDoseMg ?? 0,
          bodyTemp: gl.numericValues?.bodyTemp,
          stepCount: gl.numericValues?.stepCount,
          weather: gl.weather || 'sunny',
          oshiEnergy: gl.energyLevel ?? 80,
          memo: gl.memo,
          createdAt: gl.createdAt,
        }));

  const streakInfo = calculateStreakInfo(displayDailyLogs, selectedAvatarStyle);

  return (
    <div
      className="w-full min-h-screen transition-colors duration-300"
      style={{
        background: `radial-gradient(circle at 10% 20%, ${tenant.theme.primaryColor}18 0%, transparent 40%), radial-gradient(circle at 90% 80%, ${tenant.theme.secondaryColor}18 0%, transparent 40%), #F8FAFC`,
      }}
    >
      <div className={`max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 ${isReportOpen ? 'no-print' : ''}`}>
        {/* Dynamic Header with tenant branding and persona */}
        <DynamicHeader
          tenant={tenant}
          customer={customer}
          totalLogsCount={dailyLogs.length}
          cloudStatus={cloudStatus}
          onSyncNow={onSyncNow}
          onOpenLounge={() => setIsLoungeOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          activeAvatarStyle={selectedAvatarStyle || streakInfo.activeStyle || 'dot'}
          onOpenEvolutionModal={() => setIsAvatarModalOpen(true)}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ptDocksCount={evalRecords.length}
        />

        {/* Tab Contents */}
        <main className="mt-6">
          {activeTab === 'daily' && (
            <DynamicDailyLogTab
              tenant={tenant}
              customer={customer}
              logs={dailyLogs}
              onSaveLog={onSaveDailyLog}
              onOpenEvolutionModal={() => setIsAvatarModalOpen(true)}
            />
          )}

          {activeTab === 'pt-eval' && (
            <DynamicPeriodicEvalTab
              tenant={tenant}
              customer={customer}
              records={evalRecords}
              onSaveRecord={onSaveEvalRecord}
            />
          )}

          {activeTab === 'dashboard' && (
            <DynamicDashboardTab
              tenant={tenant}
              customer={customer}
              dailyLogs={dailyLogs}
              evalRecords={evalRecords}
              onOpenReport={() => setIsReportOpen(true)}
              legacyDailyLogs={displayDailyLogs}
              legacyPtDocks={legacyPtDocks}
            />
          )}
        </main>
      </div>

      {/* Modals (placed outside no-print container so report printing is visible) */}
      <CaratLoungeModal
        isOpen={isLoungeOpen}
        onClose={() => setIsLoungeOpen(false)}
        concertGoal={concertGoal}
        onSaveConcertGoal={onSaveConcertGoal}
        tenant={tenant}
      />

      {/* Dedicated 1-Page A4 Periodic Summary Report */}
      <PeriodicSummaryReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        tenant={tenant}
        customer={customer}
        dailyLogs={dailyLogs}
        evalRecords={evalRecords}
        legacyDailyLogs={displayDailyLogs}
        legacyPtDocks={legacyPtDocks}
      />

      {/* Interactive AI Chat with Partner (Gemini) */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tenant={tenant}
        customer={customer}
      />

      <AvatarEvolutionModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        streakInfo={streakInfo}
        onSelectAvatar={onSelectAvatarStyle}
      />

      {/* Floating AI Chat Trigger Button (Positioned lower and compact for mobile) */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 no-print">
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/70"
          style={{
            background: `linear-gradient(135deg, ${tenant.theme.primaryColor}, ${tenant.theme.accentColor})`,
          }}
          title={`${tenant.aiPersona.name}とチャット`}
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white overflow-hidden shadow-xs flex-shrink-0 bg-white">
            <img
              src={tenant.aiPersona.avatarUrl}
              alt={tenant.aiPersona.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="text-xs font-bold drop-shadow-xs pr-1">
            チャット 💬
          </div>
        </button>
      </div>
    </div>
  );
};
