import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shirt,
  Heart,
  Bot,
  Ticket,
  Palette,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const OverviewModule: React.FC = () => {
  const {
    event,
    guests,
    budgetSummary,
    alerts,
    activeTheme,
    tasks,
    isFirstTimeUser,
    setActiveModule,
    setIsWhatIfModalOpen,
    setIsCheckInScannerOpen,
    setIsCreateEventModalOpen,
    loadSampleWedding,
  } = useEvent();

  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const confirmedHeadcount = attendingGuests.reduce((sum, g) => sum + g.partySize, 0);
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 pb-12">
      {/* New User Onboarding Banner */}
      {isFirstTimeUser && (
        <div className="rounded-3xl bg-gradient-to-r from-[#C96F4A] to-[#A8522F] text-white p-6 sm:p-8 shadow-festive flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-top-3 duration-300">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to Festora</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Organize Any Event from First Idea to Celebration
            </h2>
            <p className="text-sm text-white/90 leading-relaxed font-light">
              Plan weddings, birthdays, engagements, college fests, and corporate summits. Describe your celebration to the AI Copilot to get an instant 12-section master plan, or create your first workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-[#C96F4A] text-xs font-bold shadow-md hover:bg-[#FFF8EF] active:scale-95 transition-all"
            >
              + Create First Event
            </button>
            <button
              onClick={() => setActiveModule('copilot')}
              className="px-5 py-2.5 rounded-xl bg-white/20 border border-white/40 text-white text-xs font-semibold hover:bg-white/30 active:scale-95 transition-all"
            >
              Describe to AI Copilot
            </button>
            <button
              onClick={loadSampleWedding}
              className="px-4 py-2.5 rounded-xl text-white/90 text-xs hover:underline"
            >
              Explore Sample Wedding Demo
            </button>
          </div>
        </div>
      )}

      {/* Hero Celebration Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF] via-[#FAF0EB] to-[#F5D1BD]/50 border border-[#F5D1BD] p-6 sm:p-10 shadow-festive">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-[#F2C66D]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 rounded-full bg-[#C96F4A]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF] border border-[#F5D1BD] text-xs font-semibold text-[#C96F4A] mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connected Event Workspace</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#49372D] tracking-tight leading-tight">
            Your celebration, beautifully planned.
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#6E5548] leading-relaxed max-w-2xl font-light">
            Every guest list change, budget estimate, venue decision, and styling choice speaks to
            the same event heart. Adjust once, and watch the whole celebration respond.
          </p>

          {/* Event Quick Details Card */}
          <div className="mt-6 pt-6 border-t border-[#F5D1BD]/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#C96F4A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6E5548] font-semibold">Date & Time</p>
                <p className="font-medium text-[#49372D]">{formattedDate}</p>
                <p className="text-xs text-[#6E5548]">{event.time} onwards</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C96F4A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6E5548] font-semibold">Venue</p>
                <p className="font-medium text-[#49372D]">{event.venue.name}</p>
                <p className="text-xs text-[#6E5548] capitalize">{event.venue.type.replace('_', ' ')} · {event.venue.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shirt className="w-5 h-5 text-[#C96F4A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6E5548] font-semibold">Dress Code</p>
                <p className="font-medium text-[#49372D] truncate max-w-[180px]">{event.dressCode}</p>
                <p className="text-xs text-[#6E5548]">{activeTheme.title}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#C96F4A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6E5548] font-semibold">Hosts</p>
                <p className="font-medium text-[#49372D]">{event.organizer.name}</p>
                <p className="text-xs text-[#6E5548]">{event.organizer.email}</p>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsWhatIfModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C96F4A] text-white text-sm font-semibold shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Simulate What-If Scenarios</span>
            </button>

            <button
              onClick={() => setActiveModule('copilot')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#49372D] border border-[#EAE5E1] text-sm font-semibold hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-[#C96F4A]" />
              <span>Ask Event Copilot</span>
            </button>

            <button
              onClick={() => setActiveModule('invitation-preview')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#49372D] border border-[#EAE5E1] text-sm font-semibold hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
            >
              <Ticket className="w-4 h-4 text-[#D9A948]" />
              <span>View Guest Invitation Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Alerts Banner (calculated from real data) */}
      {alerts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-amber-900 text-sm">
                  {alerts.length} Operational Decision{alerts.length > 1 ? 's' : ''} Requiring Review
                </h3>
                <span className="text-xs text-amber-700 font-medium">Computed live</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-900 gap-1 sm:gap-4 bg-white/70 px-3 py-2 rounded-lg border border-amber-200/50"
                  >
                    <span>
                      <strong className="font-semibold">{alert.title}:</strong> {alert.message}
                    </span>
                    {alert.actionLabel && alert.actionTargetModule && (
                      <button
                        onClick={() => {
                          if (alert.actionTargetModule === 'what-if') {
                            setIsWhatIfModalOpen(true);
                          } else {
                            setActiveModule(alert.actionTargetModule as any);
                          }
                        }}
                        className="shrink-0 self-start sm:self-auto px-2.5 py-1 rounded bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
                      >
                        {alert.actionLabel} →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5 Connected Modules Status Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-[#49372D]">
            The 5 Connected Modules
          </h2>
          <span className="text-xs text-[#6E5548]">All modules update synchronously</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module A Card */}
          <div
            onClick={() => setActiveModule('guests')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card hover:border-[#C96F4A] hover:shadow-festive transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A]">
                Module A
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#49372D] mt-3 group-hover:text-[#C96F4A] transition-colors">
              Smart Invitations & GuestPass
            </h3>
            <p className="text-xs text-[#6E5548] mt-1">
              Guest records, QR GuestPass generation, RSVP tracking & live duplicate-proof check-ins.
            </p>
            <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#49372D]">
              <span>
                <strong>{confirmedHeadcount}</strong> Confirmed · <strong>{pendingCount}</strong> Pending
              </span>
              <ArrowRight className="w-4 h-4 text-[#C96F4A] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module B Card */}
          <div
            onClick={() => setActiveModule('budget')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card hover:border-[#C96F4A] hover:shadow-festive transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FEF9ED] text-[#D9A948] flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF9ED] text-[#D9A948]">
                Module B
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#49372D] mt-3 group-hover:text-[#C96F4A] transition-colors">
              Smart Budget Planner
            </h3>
            <p className="text-xs text-[#6E5548] mt-1">
              7 expense categories, guest-scaled catering calculation, home vs hall comparisons.
            </p>
            <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#49372D]">
              <span>
                <strong>₹{Math.round(budgetSummary.totalEstimated).toLocaleString('en-IN')}</strong> of ₹
                {Math.round(budgetSummary.targetBudget).toLocaleString('en-IN')}
              </span>
              <ArrowRight className="w-4 h-4 text-[#C96F4A] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module C Card */}
          <div
            onClick={() => setActiveModule('theme')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card hover:border-[#C96F4A] hover:shadow-festive transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#F2F6F0] text-[#859675] flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2F6F0] text-[#859675]">
                Module C
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#49372D] mt-3 group-hover:text-[#C96F4A] transition-colors">
              AI Theme & Venue Decor
            </h3>
            <p className="text-xs text-[#6E5548] mt-1">
              Harmonious color palettes, venue-specific decoration briefs & budget-aware styling tips.
            </p>
            <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#49372D]">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ backgroundColor: activeTheme.palette.primary }}
                />
                <span className="font-medium truncate max-w-[140px]">{activeTheme.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C96F4A] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module D Card */}
          <div
            onClick={() => setActiveModule('admin')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card hover:border-[#C96F4A] hover:shadow-festive transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A]">
                Module D
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#49372D] mt-3 group-hover:text-[#C96F4A] transition-colors">
              Event Admin & Live Operations
            </h3>
            <p className="text-xs text-[#6E5548] mt-1">
              Food plate tracking, return gift buffer reconciliation, task milestones & live checklists.
            </p>
            <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#49372D]">
              <span>
                <strong>{pendingTasks.length}</strong> Tasks Remaining
              </span>
              <ArrowRight className="w-4 h-4 text-[#C96F4A] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module E Card */}
          <div
            onClick={() => setActiveModule('copilot')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card hover:border-[#C96F4A] hover:shadow-festive transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FEF9ED] text-[#D9A948] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF9ED] text-[#D9A948]">
                Module E
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#49372D] mt-3 group-hover:text-[#C96F4A] transition-colors">
              AI Event Copilot
            </h3>
            <p className="text-xs text-[#6E5548] mt-1">
              Context-grounded assistant with explicit review-and-apply approvals. Never overwrites blindly.
            </p>
            <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#49372D]">
              <span className="text-emerald-700 font-medium">Ready for questions</span>
              <ArrowRight className="w-4 h-4 text-[#C96F4A] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Signature Differentiator Card: What-If Engine */}
          <div
            onClick={() => setIsWhatIfModalOpen(true)}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#49372D] to-[#32251D] text-white p-5 shadow-festive-lg hover:brightness-110 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F2C66D] flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#C96F4A] text-white uppercase tracking-wider">
                Signature Engine
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-white mt-3 group-hover:text-[#F2C66D] transition-colors">
              Event What-If Simulator
            </h3>
            <p className="text-xs text-[#FFF8EF]/80 mt-1">
              Explore "+50 guests", "-20 guests", or "Switch to Home Courtyard" without touching your live plan until approved.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#F2C66D]">
              <span className="font-medium">Launch Simulation Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
