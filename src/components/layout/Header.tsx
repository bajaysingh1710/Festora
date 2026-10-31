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
  QrCode,
  Ticket,
  ChevronDown,
  Plus,
  Settings,
  Menu,
  X,
  Cake,
  Heart,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getEventTypeName } from '../../services/eventDefaults';

export const Header: React.FC = () => {
  const {
    event,
    events,
    activeModule,
    setActiveModule,
    budgetSummary,
    alerts,
    activeTheme,
    aiSettings,
    setIsWhatIfModalOpen,
    setIsCheckInScannerOpen,
    setIsCreateEventModalOpen,
    setIsEventSwitcherOpen,
    setIsAISettingsOpen,
    isMobileNavOpen,
    setIsMobileNavOpen,
    loadSampleWedding,
  } = useEvent();

  interface NavItem {
    id: 'overview' | 'copilot' | 'theme' | 'budget' | 'guests' | 'admin' | 'invitation-preview';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    alertCount?: number;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, highlight: true },
    { id: 'theme', label: 'AI Decor Designer', icon: Palette },
    { id: 'budget', label: 'Smart Budget', icon: Wallet },
    { id: 'guests', label: 'Invitations & Passes', icon: Users, badge: event.targetGuestCount },
    { id: 'admin', label: 'Operations', icon: ClipboardList, alertCount: alerts.length },
    { id: 'invitation-preview', label: 'Guest Pass View', icon: Ticket },
  ];

  const hasApiKey = Boolean(aiSettings.apiKey && aiSettings.apiKey.length > 15);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8EF]/95 backdrop-blur-md border-b border-[#F5D1BD]/80 transition-all">
      {/* Top Banner / Event Quick Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C96F4A] to-[#D9A948] flex items-center justify-center text-white shadow-card shrink-0">
              <Sparkles className="w-5 h-5 text-[#FFF8EF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#49372D]">
                  Festora
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD]">
                  AI Event Suite
                </span>
              </div>
              <p className="text-xs text-[#6E5548] hidden md:block">
                Big moments. Beautifully planned.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Workspace Switcher */}
          <div className="flex items-center gap-2">
            {/* Active Event Switcher Trigger */}
            <button
              onClick={() => setIsEventSwitcherOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE5E1] text-xs font-semibold text-[#49372D] shadow-sm hover:border-[#C96F4A] transition-all group max-w-[190px] sm:max-w-[240px]"
              title="Switch or manage celebration workspaces"
            >
              <span className="w-2 h-2 rounded-full bg-[#C96F4A] shrink-0" />
              <span className="truncate">{event.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E5548] shrink-0 group-hover:text-[#C96F4A]" />
            </button>

            {/* Quick Create Event Button */}
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-semibold hover:bg-[#F5D1BD]/50 active:scale-95 transition-all inline-flex items-center gap-1"
              title="Create new celebration workspace"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Event</span>
            </button>

            {/* Target Guests Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE5E1] text-xs font-semibold text-[#49372D] shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>{event.targetGuestCount} Guests</span>
            </div>

            {/* Budget Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${
                budgetSummary.isOverBudget
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-white text-[#49372D] border-[#EAE5E1]'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-[#D9A948]" />
              <span>
                ₹{Math.round(budgetSummary.totalEstimated / 1000)}k / ₹
                {Math.round(budgetSummary.targetBudget / 1000)}k
              </span>
            </div>

            {/* Signature What-If Engine Button */}
            <button
              onClick={() => setIsWhatIfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C96F4A] to-[#A8522F] text-white text-xs font-semibold shadow-festive hover:brightness-105 active:scale-95 transition-all"
              title="Test guest and cost changes in the What-If simulation sandbox"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">What-If Engine</span>
            </button>

            {/* Organizer Check-In Scanner Trigger */}
            <button
              onClick={() => setIsCheckInScannerOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-semibold hover:bg-[#F5D1BD]/50 active:scale-95 transition-all inline-flex items-center gap-1.5"
              title="Open organizer guest check-in terminal"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pass Scanner</span>
            </button>

            {/* AI Engine Settings Button */}
            <button
              onClick={() => setIsAISettingsOpen(true)}
              className="relative p-1.5 rounded-full text-[#6E5548] hover:text-[#49372D] hover:bg-[#FAF0EB] transition-colors"
              title="AI Copilot & Gemini Engine Configuration"
            >
              <Settings className="w-4 h-4" />
              <span
                className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  hasApiKey ? 'bg-emerald-500' : 'bg-[#D9A948]'
                }`}
              />
            </button>

            {/* Mobile Nav Hamburger */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-1.5 rounded-xl md:hidden text-[#49372D] hover:bg-[#FAF0EB]"
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Module Navigation Tabs */}
      <nav className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 sm:space-x-2 py-1.5 border-t border-[#F5D1BD]/50 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#C96F4A] text-white shadow-card font-semibold'
                    : item.highlight
                    ? 'bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] font-semibold hover:bg-[#F5D1BD]/40'
                    : 'text-[#49372D] hover:bg-[#FAF0EB] hover:text-[#C96F4A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#C96F4A]' : 'text-[#6E5548]'}`} />
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

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-[#F5D1BD] bg-[#FFF8EF] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C96F4A] text-white shadow-sm'
                    : 'text-[#49372D] hover:bg-[#FAF0EB]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C96F4A]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.alertCount && item.alertCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 font-bold">
                    {item.alertCount}
                  </span>
                ) : item.badge ? (
                  <span className="text-xs opacity-70">({item.badge})</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
