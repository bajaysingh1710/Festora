import React from 'react';
import {
  Printer,
  X,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  Palette,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  Sparkles,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getEventTypeName, getDefaultEventSchedule } from '../../services/eventDefaults';

export const EventReportModal: React.FC = () => {
  const {
    event,
    guests,
    budgetCategories,
    budgetSummary,
    activeTheme,
    tasks,
    isReportModalOpen,
    setIsReportModalOpen,
  } = useEvent();

  if (!isReportModalOpen) return null;

  // Meal breakdown
  const mealCounts = guests.reduce(
    (acc, g) => {
      acc[g.mealPreference] = (acc[g.mealPreference] || 0) + g.partySize;
      return acc;
    },
    { vegetarian: 0, non_vegetarian: 0, jain: 0, vegan: 0 } as Record<string, number>
  );

  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const confirmedHeadcount = attendingGuests.reduce((sum, g) => sum + g.partySize, 0);
  const pendingHeadcount = guests.filter((g) => g.rsvpStatus === 'pending').reduce((sum, g) => sum + g.partySize, 0);
  const checkedInHeadcount = guests.filter((g) => g.checkInStatus === 'checked_in').reduce((sum, g) => sum + g.partySize, 0);

  const scheduleItems = event.schedule && event.schedule.length > 0
    ? event.schedule
    : getDefaultEventSchedule(event.eventType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-festive-lg border border-[#F5D1BD] my-6 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:m-0 print:rounded-none">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-[#FAF0EB] px-6 py-4 border-b border-[#EAE5E1] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C96F4A] text-white text-[11px] font-bold uppercase tracking-wider">
              Executive Dossier
            </span>
            <span className="text-xs text-[#6E5548]">Official Event Planning Brief</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#49372D] text-white text-xs font-semibold hover:bg-[#32251D] shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-8 text-[#49372D] print:p-0 print:overflow-visible">
          {/* Header & Branding */}
          <div className="border-b-2 border-[#C96F4A] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl text-[#C96F4A]">FESTORA</span>
                <span className="text-xs text-[#6E5548] font-medium tracking-wide">| Event Operations Dossier</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#49372D] mt-2">
                {event.title}
              </h1>
              <p className="text-base text-[#6E5548] italic mt-1 font-serif">
                "{event.tagline || 'Big moments. Beautifully planned.'}"
              </p>
            </div>

            <div className="text-right text-xs text-[#6E5548] space-y-1 sm:self-end">
              <p className="font-semibold text-[#49372D] uppercase tracking-wider">{getEventTypeName(event.eventType)}</p>
              <p>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="font-mono text-[11px] text-[#C96F4A]">ID: {event.id}</p>
            </div>
          </div>

          {/* Core Event Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FAF0EB]/60 border border-[#F5D1BD]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E5548] block">Date & Time</span>
              <p className="font-bold text-sm mt-0.5">{event.date}</p>
              <p className="text-xs text-[#6E5548]">{event.time || '18:00 IST'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E5548] block">Venue & City</span>
              <p className="font-bold text-sm mt-0.5">{event.venue.name}</p>
              <p className="text-xs text-[#6E5548]">{event.venue.city || 'Bengaluru'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E5548] block">Attendance</span>
              <p className="font-bold text-sm mt-0.5">{confirmedHeadcount} Confirmed</p>
              <p className="text-xs text-[#6E5548]">{event.targetGuestCount} target capacity</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E5548] block">Lead Organizer</span>
              <p className="font-bold text-sm mt-0.5">{event.organizer.name}</p>
              <p className="text-xs text-[#6E5548]">{event.organizer.phone}</p>
            </div>
          </div>

          {/* Section 1: Financial Health & Budget Analysis */}
          <div>
            <h3 className="font-serif font-bold text-xl text-[#49372D] mb-3 flex items-center gap-2 border-b border-[#EAE5E1] pb-2">
              <Wallet className="w-5 h-5 text-[#C96F4A]" />
              <span>1. Financial Budget Analysis</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="p-3.5 rounded-xl border border-[#EAE5E1] bg-stone-50">
                <span className="text-[10px] uppercase font-bold text-[#6E5548]">Target Budget</span>
                <p className="font-mono text-lg font-bold text-[#49372D]">₹{event.targetBudget.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[#EAE5E1] bg-stone-50">
                <span className="text-[10px] uppercase font-bold text-[#6E5548]">Estimated Total</span>
                <p className="font-mono text-lg font-bold text-[#C96F4A]">₹{budgetSummary.totalEstimated.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[#EAE5E1] bg-stone-50">
                <span className="text-[10px] uppercase font-bold text-[#6E5548]">Committed / Paid</span>
                <p className="font-mono text-lg font-bold text-emerald-800">₹{budgetSummary.totalCommitted.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[#EAE5E1] bg-stone-50">
                <span className="text-[10px] uppercase font-bold text-[#6E5548]">Remaining Balance</span>
                <p className={`font-mono text-lg font-bold ${budgetSummary.remainingBudget >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                  ₹{budgetSummary.remainingBudget.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Category breakdown table */}
            <table className="w-full text-left text-xs border border-[#EAE5E1] rounded-xl overflow-hidden">
              <thead className="bg-[#FAF0EB]/60 font-semibold uppercase text-[11px] text-[#6E5548]">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Target %</th>
                  <th className="py-2.5 px-3">Target Budget</th>
                  <th className="py-2.5 px-3">Estimated Cost</th>
                  <th className="py-2.5 px-3 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5E1]/60">
                {budgetCategories.map((cat) => {
                  const catEst = budgetSummary.categoryTotals[cat.id]?.estimatedTotal || 0;
                  const catTarget = Math.round(event.targetBudget * (cat.targetPercent / 100));
                  const variance = catTarget - catEst;
                  return (
                    <tr key={cat.id}>
                      <td className="py-2 px-3 font-semibold">{cat.name}</td>
                      <td className="py-2 px-3">{cat.targetPercent}%</td>
                      <td className="py-2 px-3 font-mono">₹{catTarget.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 font-mono font-bold">₹{catEst.toLocaleString('en-IN')}</td>
                      <td className={`py-2 px-3 font-mono text-right ${variance >= 0 ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}`}>
                        {variance >= 0 ? `+₹${variance.toLocaleString('en-IN')}` : `-₹${Math.abs(variance).toLocaleString('en-IN')}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 2: Guest & RSVP Reconciliation */}
          <div>
            <h3 className="font-serif font-bold text-xl text-[#49372D] mb-3 flex items-center gap-2 border-b border-[#EAE5E1] pb-2">
              <Users className="w-5 h-5 text-[#C96F4A]" />
              <span>2. Guest Registration & Dietary Requirements</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-xs">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="font-bold text-emerald-900 block">Attending</span>
                <span className="text-xl font-bold font-serif text-emerald-950">{confirmedHeadcount} guests</span>
                <span className="text-[11px] text-emerald-700 block">({attendingGuests.length} parties)</span>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="font-bold text-amber-900 block">Pending Response</span>
                <span className="text-xl font-bold font-serif text-amber-950">{pendingHeadcount} guests</span>
              </div>
              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50">
                <span className="font-bold text-purple-900 block">Checked In Today</span>
                <span className="text-xl font-bold font-serif text-purple-950">{checkedInHeadcount} guests</span>
              </div>
              <div className="p-3 rounded-xl border border-[#F5D1BD] bg-[#FAF0EB]">
                <span className="font-bold text-[#C96F4A] block">Catering Capacity</span>
                <span className="text-xl font-bold font-serif text-[#49372D]">
                  {event.targetGuestCount + (event.cateringPlateBuffer || 0)} plates
                </span>
                <span className="text-[11px] text-[#6E5548] block">({event.cateringPlateBuffer || 0} buffer)</span>
              </div>
            </div>

            {/* Dietary Preference breakdown */}
            <div className="p-3.5 rounded-xl border border-[#EAE5E1] bg-stone-50/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#49372D]">Meal Allocations:</span>
              <div className="flex items-center gap-4">
                <span>🥗 Veg: <strong>{mealCounts['vegetarian']}</strong></span>
                <span>🍗 Non-Veg: <strong>{mealCounts['non_vegetarian']}</strong></span>
                <span>🌱 Jain: <strong>{mealCounts['jain']}</strong></span>
                <span>🥑 Vegan: <strong>{mealCounts['vegan']}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 3: Day-of Hourly Flow Timeline */}
          <div>
            <h3 className="font-serif font-bold text-xl text-[#49372D] mb-3 flex items-center gap-2 border-b border-[#EAE5E1] pb-2">
              <Clock className="w-5 h-5 text-[#C96F4A]" />
              <span>3. Day-of Chronological Schedule</span>
            </h3>

            <div className="space-y-2">
              {scheduleItems.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between py-2 border-b border-stone-100 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="font-mono font-bold bg-[#FAF0EB] text-[#C96F4A] px-2 py-0.5 rounded text-[11px]">
                      {item.time}
                    </span>
                    <div>
                      <p className="font-bold text-[#49372D]">{item.title}</p>
                      {item.location && <p className="text-[11px] text-[#6E5548]">📍 {item.location}</p>}
                    </div>
                  </div>
                  {item.coordinator && <span className="text-[11px] text-[#6E5548]">👤 {item.coordinator}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Theme & Decoration Concept */}
          <div>
            <h3 className="font-serif font-bold text-xl text-[#49372D] mb-3 flex items-center gap-2 border-b border-[#EAE5E1] pb-2">
              <Palette className="w-5 h-5 text-[#C96F4A]" />
              <span>4. Theme & Decoration Palette</span>
            </h3>

            <div className="p-4 rounded-xl border border-[#EAE5E1] bg-stone-50/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#49372D]">{activeTheme.title}</span>
                <span className="capitalize px-2 py-0.5 rounded bg-[#FAF0EB] text-[#C96F4A] font-semibold text-[10px]">
                  {activeTheme.costTier.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[#6E5548] italic">{activeTheme.tagline}</p>

              {/* Color swatches */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[11px] font-semibold text-[#6E5548]">Palette:</span>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: activeTheme.palette.primary }} title="Primary" />
                  <span className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: activeTheme.palette.secondary }} title="Secondary" />
                  <span className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: activeTheme.palette.accent }} title="Accent" />
                  <span className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: activeTheme.palette.background }} title="Background" />
                  <span className="w-6 h-6 rounded-full border border-stone-200" style={{ backgroundColor: activeTheme.palette.text }} title="Text" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Milestone Tasks & Coordinator Directives */}
          <div>
            <h3 className="font-serif font-bold text-xl text-[#49372D] mb-3 flex items-center gap-2 border-b border-[#EAE5E1] pb-2">
              <CheckCircle2 className="w-5 h-5 text-[#C96F4A]" />
              <span>5. Critical Milestones & Task Ownership</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              {tasks.slice(0, 8).map((task) => (
                <div key={task.id} className="flex items-center justify-between py-1.5 border-b border-stone-100">
                  <span className={task.isCompleted ? 'line-through text-stone-400' : 'text-[#49372D] font-medium'}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#6E5548]">
                    <span>{task.category}</span>
                    <span>· Due {task.deadline}</span>
                    <strong className="text-[#49372D]">· {task.assignedTo}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-6 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#6E5548]">
            <p>Festora AI-First Event Platform · Confidential & Proprietary</p>
            <p>Coordinator Sign-off: ___________________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};
