import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Utensils,
  Gift,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  CloudSun,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  MapPin,
  Check,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { Task, TaskPriority, TimelineEvent } from '../../types';
import { getDefaultEventSchedule } from '../../services/eventDefaults';

function getSeasonalWeatherAdvisory(dateStr: string, city: string, venueType: string) {
  const parsedDate = new Date(dateStr);
  const month = isNaN(parsedDate.getTime()) ? 11 : parsedDate.getMonth() + 1; // 1-12
  let season = 'pleasant';
  let tempRange = '22°C - 30°C';
  let iconDesc = 'Clear Skies & Mild Breeze';
  let outdoorRisk = 'low';
  let tips: string[] = [];

  if (month >= 6 && month <= 9) {
    season = 'monsoon';
    tempRange = '24°C - 29°C';
    iconDesc = 'Monsoon Season & Humid Winds';
    outdoorRisk = 'high';
    tips = [
      'Pre-install transparent waterproof canopy tarps over dining and stage areas.',
      'Provide covered walkways from valet / parking to main entrance.',
      'Ensure acoustic and electrical cables are lifted off ground with dry conduits.',
    ];
  } else if (month >= 3 && month <= 5) {
    season = 'summer';
    tempRange = '30°C - 38°C';
    iconDesc = 'High Summer Heat & Warm Sunlight';
    outdoorRisk = venueType.includes('outdoor') || venueType.includes('courtyard') ? 'high' : 'medium';
    tips = [
      'Schedule outdoor ceremonial activities post-5:00 PM to avoid peak heat.',
      'Set up chilled coconut water and iced mocktail stations at guest entrance.',
      'Deploy industrial misting fans and fabric shading canopies across seating zones.',
    ];
  } else {
    season = 'winter';
    tempRange = '14°C - 26°C';
    iconDesc = 'Crisp Sunny Days & Cool Evenings';
    outdoorRisk = 'low';
    tips = [
      'Ideal outdoor climate! Prepare standing patio heaters or decorative fire pits for late evening hours.',
      'Ensure warm welcome beverages (masala chai, kahwa, hot spiced chocolate).',
      'Golden hour lighting between 4:30 PM - 5:45 PM is prime for photography.',
    ];
  }

  return { season, tempRange, iconDesc, outdoorRisk, tips };
}

export const AdminModule: React.FC = () => {
  const {
    event,
    guests,
    tasks,
    alerts,
    budgetSummary,
    updateEvent,
    toggleTask,
    addTask,
    deleteTask,
    addScheduleMilestone,
    deleteScheduleMilestone,
    toggleScheduleMilestone,
    setActiveModule,
    setIsWhatIfModalOpen,
    setIsReportModalOpen,
  } = useEvent();

  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'critical'>('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Logistics');
  const [newTaskDeadline, setNewTaskDeadline] = useState(event.date);
  const [newTaskAssignee, setNewTaskAssignee] = useState(event.organizer.name);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('high');

  // New schedule milestone form state
  const [newScheduleTime, setNewScheduleTime] = useState('11:00 AM');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleLocation, setNewScheduleLocation] = useState(event.venue.name);
  const [newScheduleCoordinator, setNewScheduleCoordinator] = useState(event.organizer.name);

  // Attendance Metrics
  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const confirmedHeadcount = attendingGuests.reduce((sum, g) => sum + g.partySize, 0);

  const pendingGuests = guests.filter((g) => g.rsvpStatus === 'pending');
  const pendingHeadcount = pendingGuests.reduce((sum, g) => sum + g.partySize, 0);
  const expectedTotalHeadcount = confirmedHeadcount + Math.round(pendingHeadcount * 0.7);

  const checkedInGuests = guests.filter((g) => g.checkInStatus === 'checked_in');
  const checkedInHeadcount = checkedInGuests.reduce((sum, g) => sum + g.partySize, 0);

  // Catering Plate Capacity
  const cateringPlateCapacity = event.targetGuestCount + (event.cateringPlateBuffer || 0);
  const cateringDeficit = Math.max(0, expectedTotalHeadcount - cateringPlateCapacity);

  // Return Gift Capacity (1 per family/attending party)
  const totalAttendingParties = attendingGuests.length;
  const projectedAttendingParties = totalAttendingParties + Math.round(pendingGuests.length * 0.7);
  const totalGiftHampers = Math.round(event.targetGuestCount * 0.55) + (event.returnGiftBuffer || 0);
  const giftDeficit = Math.max(0, projectedAttendingParties - totalGiftHampers);

  // Fair Billing & Quantity Adjustments
  const cateringTotal = budgetSummary.categoryTotals['catering']?.estimatedTotal || 0;
  const costPerPlate = event.targetGuestCount > 0 ? Math.round(cateringTotal / event.targetGuestCount) : 850;
  const plateVariance = cateringPlateCapacity - expectedTotalHeadcount;
  const fairBillingValue = Math.abs(plateVariance) * costPerPlate;

  // Weather Advisory
  const weatherAdvisory = useMemo(() => {
    return getSeasonalWeatherAdvisory(event.date, event.venue.city, event.venue.type);
  }, [event.date, event.venue.city, event.venue.type]);

  // Schedule Timeline
  const scheduleItems = useMemo(() => {
    if (event.schedule && event.schedule.length > 0) {
      return event.schedule;
    }
    return getDefaultEventSchedule(event.eventType);
  }, [event.schedule, event.eventType]);

  // Filtered Tasks
  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === 'pending') return !task.isCompleted;
    if (taskFilter === 'completed') return task.isCompleted;
    if (taskFilter === 'critical') return task.priority === 'critical' && !task.isCompleted;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      deadline: newTaskDeadline,
      assignedTo: newTaskAssignee.trim() || 'Coordinator',
      priority: newTaskPriority,
      isCompleted: false,
    });

    setNewTaskTitle('');
    setIsAddTaskOpen(false);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;

    addScheduleMilestone({
      time: newScheduleTime.trim(),
      title: newScheduleTitle.trim(),
      location: newScheduleLocation.trim(),
      coordinator: newScheduleCoordinator.trim(),
      isCompleted: false,
    });

    setNewScheduleTitle('');
    setIsAddScheduleOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Module D</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#49372D]">
            Event Admin & Live Operations
          </h1>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Operational cockpit: headcount reconciliation, catering & gift tracking, live alerts, timeline, and weather advisory.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-semibold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-[#C96F4A]" />
            <span>Executive Brief</span>
          </button>

          <button
            onClick={() => setIsAddScheduleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] font-semibold text-xs hover:bg-[#FAF0EB] active:scale-95 transition-all shadow-sm"
          >
            <Clock className="w-4 h-4 text-[#D9A948]" />
            <span>+ Milestone Time</span>
          </button>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold text-xs shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Operational Capacity Dashboard: RSVP, Food & Return Gifts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Attendance & RSVP Reconciliation */}
        <div className="rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="font-serif font-bold text-base text-[#49372D]">Headcount Status</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {event.targetGuestCount} Target
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Confirmed Attending:</span>
              <span className="font-bold text-emerald-800 text-sm">{confirmedHeadcount} guests</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Projected Total (70% conversion):</span>
              <span className="font-bold text-[#49372D] text-sm">{expectedTotalHeadcount} guests</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Admitted at Entrance:</span>
              <span className="font-semibold text-[#C96F4A]">{checkedInHeadcount} checked in</span>
            </div>

            <div className="pt-2">
              <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full"
                  style={{ width: `${Math.min(100, (confirmedHeadcount / (event.targetGuestCount || 1)) * 100)}%` }}
                  title="Confirmed Attending"
                />
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: `${Math.min(100, ((expectedTotalHeadcount - confirmedHeadcount) / (event.targetGuestCount || 1)) * 100)}%` }}
                  title="Projected Conversion"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#6E5548] mt-1.5">
                <span>🟢 {confirmedHeadcount} Confirmed</span>
                <span>🟡 {pendingHeadcount} Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Food & Catering Plate Buffer Tracking */}
        <div className="rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#FEF9ED] text-[#D9A948] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </span>
              <h3 className="font-serif font-bold text-base text-[#49372D]">Catering Buffer</h3>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                cateringDeficit > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {cateringDeficit > 0 ? 'Shortfall Warning' : 'Buffer Secure'}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Total Plate Capacity:</span>
              <span className="font-bold text-[#49372D] text-sm">
                {cateringPlateCapacity} plates ({event.cateringPlateBuffer} buffer)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Projected Demand:</span>
              <span className="font-bold text-[#49372D] text-sm">{expectedTotalHeadcount} plates</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Buffer Safety Margin:</span>
              <span
                className={`font-semibold ${
                  cateringPlateCapacity - expectedTotalHeadcount < 5 ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {cateringPlateCapacity - expectedTotalHeadcount} plates remaining
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() =>
                  updateEvent({ cateringPlateBuffer: (event.cateringPlateBuffer || 0) + 10 })
                }
                className="w-full py-1.5 rounded-xl border border-[#F5D1BD] bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold hover:bg-[#F5D1BD] transition-all"
              >
                + Add 10 Buffer Plates
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Return Gift & Keepsake Hampers */}
        <div className="rounded-2xl bg-white border border-[#EAE5E1] p-5 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#F2F6F0] text-[#859675] flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </span>
              <h3 className="font-serif font-bold text-base text-[#49372D]">Return Favors</h3>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                giftDeficit > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {giftDeficit > 0 ? 'Deficit Warning' : 'Sufficient'}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Prepared Gift Boxes:</span>
              <span className="font-bold text-[#49372D] text-sm">{totalGiftHampers} hampers</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Projected Attending Families:</span>
              <span className="font-bold text-[#49372D] text-sm">
                {projectedAttendingParties} parties
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E5548]">Gift Surplus / Deficit:</span>
              <span
                className={`font-semibold ${giftDeficit > 0 ? 'text-amber-700' : 'text-emerald-700'}`}
              >
                {totalGiftHampers - projectedAttendingParties} spare boxes
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() =>
                  updateEvent({ returnGiftBuffer: (event.returnGiftBuffer || 0) + 10 })
                }
                className="w-full py-1.5 rounded-xl border border-[#A9B89A]/50 bg-[#F2F6F0] text-[#859675] text-xs font-semibold hover:bg-[#C8D4BD] transition-all"
              >
                + Order 10 Extra Hampers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fair Billing & Attendance-Based Adjustments + Weather Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance-Based Fair Billing Reconciliation */}
        <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-lg text-[#49372D]">
                  Attendance-Based Fair Billing Analysis
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 font-mono text-[#6E5548]">
                ~₹{costPerPlate}/plate
              </span>
            </div>
            <p className="text-xs text-[#6E5548] mb-4">
              Real-time audit between contractual plate commitments and projected live demand to prevent food wastage or surprise rush penalties.
            </p>

            <div className="space-y-2.5 p-4 rounded-2xl bg-[#FAF0EB]/40 border border-[#F5D1BD]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E5548]">Contracted Plates:</span>
                <span className="font-bold text-[#49372D]">{cateringPlateCapacity} plates</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E5548]">Live Projected Demand:</span>
                <span className="font-bold text-[#C96F4A]">{expectedTotalHeadcount} plates</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F5D1BD]">
                <span className="font-semibold text-[#49372D]">
                  {plateVariance >= 0 ? 'Potential Avoidable Wastage:' : 'Urgent Plate Deficit Risk:'}
                </span>
                <span
                  className={`font-bold font-mono text-sm ${
                    plateVariance >= 0 ? 'text-amber-800' : 'text-red-700'
                  }`}
                >
                  {plateVariance >= 0 ? `+${plateVariance} spare plates` : `${plateVariance} plates short`}
                  {' '}(₹{fairBillingValue.toLocaleString('en-IN')})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center gap-2">
            {plateVariance < 0 ? (
              <button
                onClick={() =>
                  updateEvent({
                    cateringPlateBuffer: (event.cateringPlateBuffer || 0) + Math.abs(plateVariance) + 10,
                  })
                }
                className="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-festive hover:bg-red-700 transition-all"
              >
                Auto-Adjust Buffer (+{Math.abs(plateVariance) + 10} Plates)
              </button>
            ) : plateVariance > 20 ? (
              <button
                onClick={() => updateEvent({ cateringPlateBuffer: 10 })}
                className="w-full py-2 rounded-xl bg-[#49372D] text-white text-xs font-semibold hover:bg-[#32251D] transition-all"
              >
                Reconcile & Cap Buffer to 10 Plates (Saves ₹{((plateVariance - 10) * costPerPlate).toLocaleString('en-IN')})
              </button>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold py-1">
                ✓ Catering commitment perfectly balanced with projected attendance.
              </p>
            )}
          </div>
        </div>

        {/* Weather-Aware Planning Advisory Widget */}
        <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#FEF9ED] text-[#D9A948] flex items-center justify-center">
                  <CloudSun className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-lg text-[#49372D]">
                  Weather & Climate Advisory
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FEF9ED] text-[#D9A948] border border-[#F2C66D]">
                {weatherAdvisory.tempRange}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6E5548] mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>{event.venue.city || 'Bengaluru'} · {event.date} · {weatherAdvisory.iconDesc}</span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E5548]">
                Operational Precautions for {event.venue.type.replace('_', ' ')}:
              </span>
              <ul className="space-y-1.5 text-xs text-[#49372D]">
                {weatherAdvisory.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C96F4A] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#6E5548]">
            <span>Weather Risk Index: <strong className="capitalize text-[#49372D]">{weatherAdvisory.outdoorRisk}</strong></span>
            <button
              onClick={() => setIsWhatIfModalOpen(true)}
              className="font-semibold text-[#C96F4A] hover:underline"
            >
              Simulate Venue Backup →
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Calculated Alerts Center */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#C96F4A]" />
            <h3 className="font-serif font-bold text-lg text-[#49372D]">
              Operational Alerts & Decision Matrix ({alerts.length})
            </h3>
          </div>
          <span className="text-xs text-[#6E5548]">Calculated deterministically from state</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.severity === 'danger'
                  ? 'bg-red-50/80 border-red-200 text-red-900'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-blue-50/80 border-blue-200 text-blue-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.severity === 'danger'
                      ? 'text-red-600'
                      : alert.severity === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-sm">{alert.title}</h4>
                  <p className="text-xs mt-0.5 opacity-90">{alert.message}</p>
                </div>
              </div>

              {alert.actionLabel && alert.actionTargetModule && (
                <button
                  onClick={() => {
                    if (alert.actionTargetModule === 'what-if') {
                      setIsWhatIfModalOpen(true);
                    } else {
                      setActiveModule(alert.actionTargetModule as any);
                    }
                  }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all ${
                    alert.severity === 'danger'
                      ? 'bg-red-700 hover:bg-red-800'
                      : alert.severity === 'warning'
                      ? 'bg-amber-700 hover:bg-amber-800'
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {alert.actionLabel} →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Day-of Event Timeline & Milestones */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C96F4A]" />
            <div>
              <h3 className="font-serif font-bold text-lg text-[#49372D]">
                Day-of Event Schedule & Hourly Flow
              </h3>
              <p className="text-xs text-[#6E5548]">
                Real-time operational choreography for coordination teams on {event.date}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddScheduleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#F5D1BD] bg-[#FAF0EB] text-[#C96F4A] text-xs font-bold hover:bg-[#F5D1BD] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Timeline Event</span>
          </button>
        </div>

        <div className="space-y-3">
          {scheduleItems.map((item, idx) => (
            <div
              key={item.id || `sch-${idx}`}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                item.isCompleted
                  ? 'bg-stone-50 border-stone-200 opacity-60'
                  : 'bg-white border-[#EAE5E1] hover:border-[#F5D1BD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!item.isCompleted}
                  onChange={() => toggleScheduleMilestone(item.id)}
                  className="w-4 h-4 rounded border-[#EAE5E1] accent-[#C96F4A] cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#FAF0EB] text-[#C96F4A]">
                      {item.time}
                    </span>
                    <h4
                      className={`text-sm font-bold ${
                        item.isCompleted ? 'line-through text-stone-400' : 'text-[#49372D]'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#6E5548] mt-1">
                    {item.location && <span>📍 {item.location}</span>}
                    {item.coordinator && <span>· 👤 Lead: {item.coordinator}</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteScheduleMilestone(item.id)}
                className="p-1 text-stone-300 hover:text-red-500 rounded"
                title="Remove milestone"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Event Task Checklist */}
      <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#C96F4A]" />
            <h3 className="font-serif font-bold text-lg text-[#49372D]">
              Event Milestones & Task Checklist
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'pending', 'critical', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  taskFilter === f
                    ? 'bg-[#49372D] text-white shadow-sm'
                    : 'bg-[#FAF0EB] text-[#6E5548] hover:text-[#49372D]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#EAE5E1]/60">
          {filteredTasks.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#6E5548]">
              No tasks match this filter. All clear!
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#FFF8EF]/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded border-[#EAE5E1] accent-[#C96F4A] cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        task.isCompleted ? 'line-through text-stone-400' : 'text-[#49372D]'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#6E5548] mt-0.5">
                      <span className="font-semibold text-[#C96F4A]">{task.category}</span>
                      <span>· Assigned to {task.assignedTo}</span>
                      <span>· Due {task.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-stone-300 hover:text-red-500 rounded"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
            <h2 className="font-serif text-xl font-bold text-[#49372D] mb-4">Create Milestone Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4 text-sm text-[#49372D]">
              <div>
                <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Confirm DJ Sound Limit Permit"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-[#6E5548] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold shadow-festive hover:bg-[#A8522F]"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Timeline Event Modal */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD]">
            <h2 className="font-serif text-xl font-bold text-[#49372D] mb-4">Add Day-of Timeline Event</h2>
            <form onSubmit={handleCreateSchedule} className="space-y-4 text-sm text-[#49372D]">
              <div>
                <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                  Time Slot *
                </label>
                <input
                  type="text"
                  required
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  placeholder="e.g. 11:30 AM or 14:00"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                  Event / Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={newScheduleTitle}
                  onChange={(e) => setNewScheduleTitle(e.target.value)}
                  placeholder="e.g. Guest Welcome & Shehnai Melodies"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                    Location Zone
                  </label>
                  <input
                    type="text"
                    value={newScheduleLocation}
                    onChange={(e) => setNewScheduleLocation(e.target.value)}
                    placeholder="e.g. Grand Entrance"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5548] uppercase mb-1">
                    Lead Coordinator
                  </label>
                  <input
                    type="text"
                    value={newScheduleCoordinator}
                    onChange={(e) => setNewScheduleCoordinator(e.target.value)}
                    placeholder="e.g. Host Squad"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5E1] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-[#6E5548] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold shadow-festive hover:bg-[#A8522F]"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
