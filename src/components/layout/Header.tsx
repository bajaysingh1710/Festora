import React from 'react';
import {
  Sparkles,
  Users,
  Wallet,
  Palette,
  ClipboardList,
  Bot,
  SlidersHorizontal,
  RotateCcw,
  AlertTriangle,
  QrCode,
  Ticket,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const Header: React.FC = () => {
  const {
    event,
    activeModule,
    setActiveModule,
    budgetSummary,
    alerts,
    activeTheme,
    setIsWhatIfModalOpen,
    setIsCheckInScannerOpen,
    resetToDemoSeed,
  } = useEvent();

  interface NavItem {
    id: 'overview' | 'guests' | 'budget' | 'theme' | 'admin' | 'copilot' | 'invitation-preview';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    alertCount?: number;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'guests', label: 'Invitations & Passes', icon: Users, badge: event.targetGuestCount },
    { id: 'budget', label: 'Smart Budget', icon: Wallet },
    { id: 'theme', label: 'Themes & Decor', icon: Palette },
    { id: 'admin', label: 'Event Operations', icon: ClipboardList, alertCount: alerts.length },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'invitation-preview', label: 'Guest Invitation View', icon: Ticket },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8EF]/95 backdrop-blur-md border-b border-[#F5D1BD]/80 transition-all">
      {/* Top Banner / Event Quick Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C96F4A] to-[#D9A948] flex items-center justify-center text-white shadow-card">
              <Sparkles className="w-5 h-5 text-[#FFF8EF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#49372D]">
                  Festora
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD]">
                  Celebration Suite
                </span>
              </div>
              <p className="text-xs text-[#6E5548] hidden sm:block">
                Big moments. Beautifully planned.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Differentiators */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Event Name Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF] border border-[#EAE5E1] text-xs font-medium text-[#49372D] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C96F4A]" />
              <span className="truncate max-w-[200px]">{event.title}</span>
            </div>

            {/* Target Guests Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF] border border-[#EAE5E1] text-xs font-semibold text-[#49372D] shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>{event.targetGuestCount} Guests</span>
            </div>

            {/* Budget Pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${
                budgetSummary.isOverBudget
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-[#FFF] text-[#49372D] border-[#EAE5E1]'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-[#D9A948]" />
              <span>
                ₹{Math.round(budgetSummary.totalEstimated / 1000)}k / ₹
                {Math.round(budgetSummary.targetBudget / 1000)}k
              </span>
            </div>

            {/* Active Theme Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF] border border-[#EAE5E1] text-xs font-medium text-[#49372D] shadow-sm">
              <span
                className="w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: activeTheme.palette.primary }}
              />
              <span className="truncate max-w-[130px]">{activeTheme.title}</span>
            </div>

            {/* Signature What-If Engine Button */}
            <button
              onClick={() => setIsWhatIfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C96F4A] to-[#A8522F] text-white text-xs font-semibold shadow-festive hover:brightness-105 active:scale-95 transition-all"
              title="Test guest and cost changes in the What-If simulation sandbox"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>What-If Engine</span>
            </button>

            {/* Organizer Check-In Scanner Trigger */}
            <button
              onClick={() => setIsCheckInScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-semibold hover:bg-[#F5D1BD]/50 active:scale-95 transition-all"
              title="Open organizer guest check-in terminal"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pass Scanner</span>
            </button>

            {/* Reset Demo Seed Button */}
            <button
              onClick={resetToDemoSeed}
              className="p-1.5 rounded-full text-[#6E5548] hover:text-[#49372D] hover:bg-[#FAF0EB] transition-colors"
              title="Reset to fresh sample celebration demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 sm:space-x-2 py-1.5 border-t border-[#F5D1BD]/50 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#C96F4A] text-white shadow-card font-semibold'
                    : 'text-[#49372D] hover:bg-[#FAF0EB] hover:text-[#C96F4A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6E5548]'}`} />
                <span>{item.label}</span>

                {item.alertCount && item.alertCount > 0 ? (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#C96F4A]' : 'bg-[#C96F4A] text-white'
                    }`}
                  >
                    {item.alertCount}
                  </span>
                ) : null}

                {item.badge ? (
                  <span
                    className={`ml-1 text-[11px] opacity-80 ${
                      isActive ? 'text-white' : 'text-[#6E5548]'
                    }`}
                  >
                    ({item.badge})
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
