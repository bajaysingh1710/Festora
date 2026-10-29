import React from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Header } from './components/layout/Header';
import { OverviewModule } from './components/modules/OverviewModule';
import { GuestsModule } from './components/modules/GuestsModule';
import { BudgetModule } from './components/modules/BudgetModule';
import { ThemeModule } from './components/modules/ThemeModule';
import { AdminModule } from './components/modules/AdminModule';
import { CopilotModule } from './components/modules/CopilotModule';
import { InvitationPreviewModule } from './components/modules/InvitationPreviewModule';
import { WhatIfModal } from './components/modals/WhatIfModal';
import { GuestPassModal } from './components/modals/GuestPassModal';
import { CheckInScannerModal } from './components/modals/CheckInScannerModal';
import { Sparkles, CheckCircle, AlertTriangle, Info, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeModule, activeToast } = useEvent();

  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#49372D] flex flex-col font-sans selection:bg-[#F5D1BD] selection:text-[#49372D]">
      {/* WCAG Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#C96F4A] text-white font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      {/* Global Header & Navigation */}
      <Header />

      {/* Toast Notification Alert Banner */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-festive-lg border text-xs sm:text-sm font-semibold ${
              activeToast.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : activeToast.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-300'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
          >
            {activeToast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            ) : activeToast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            )}
            <span>{activeToast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8" tabIndex={-1}>
        {activeModule === 'overview' && <OverviewModule />}
        {activeModule === 'guests' && <GuestsModule />}
        {activeModule === 'budget' && <BudgetModule />}
        {activeModule === 'theme' && <ThemeModule />}
        {activeModule === 'admin' && <AdminModule />}
        {activeModule === 'copilot' && <CopilotModule />}
        {activeModule === 'invitation-preview' && <InvitationPreviewModule />}
      </main>

      {/* Global Modals */}
      <WhatIfModal />
      <GuestPassModal />
      <CheckInScannerModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#F5D1BD]/70 bg-white/60 py-6 text-xs text-[#6E5548]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#49372D]">Festora</span>
            <span>· Big moments. Beautifully planned.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#C96F4A] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars 2026 Win Methodology</span>
            </span>
            <span>·</span>
            <span>Local-First Event Architecture</span>
            <span>·</span>
            <span>Zero Data Loss</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EventProvider>
      <MainAppContent />
    </EventProvider>
  );
};

export default App;
