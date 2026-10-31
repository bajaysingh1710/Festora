import React, { useMemo } from 'react';
import { Sparkles, FileText, ShieldAlert } from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { OperationsVitalsCards } from './admin/OperationsVitalsCards';
import { FairBillingAuditCard } from './admin/FairBillingAuditCard';
import { WeatherAdvisoryCard } from './admin/WeatherAdvisoryCard';
import { DayOfTimelineSection } from './admin/DayOfTimelineSection';
import { TaskManagementSection } from './admin/TaskManagementSection';
import { getDefaultEventSchedule } from '../../services/eventDefaults';

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

  // Schedule Timeline
  const scheduleItems = useMemo(() => {
    if (event.schedule && event.schedule.length > 0) {
      return event.schedule;
    }
    return getDefaultEventSchedule(event.eventType);
  }, [event.schedule, event.eventType]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Action Dossier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Cockpit</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#49372D]">
            Event Administration & Day-of Operations
          </h2>
          <p className="text-sm text-[#6E5548] mt-0.5">
            Real-time headcount reconciliation, catering buffers, weather advisories, fair billing audit, and execution schedules.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#F5D1BD] bg-white text-[#C96F4A] text-xs font-bold shadow-sm hover:bg-[#FAF0EB] active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Operational Capacity Dashboard: RSVP, Food & Return Gifts */}
      <OperationsVitalsCards
        targetGuestCount={event.targetGuestCount}
        confirmedHeadcount={confirmedHeadcount}
        expectedTotalHeadcount={expectedTotalHeadcount}
        checkedInHeadcount={checkedInHeadcount}
        pendingHeadcount={pendingHeadcount}
        cateringPlateCapacity={cateringPlateCapacity}
        cateringDeficit={cateringDeficit}
        cateringPlateBuffer={event.cateringPlateBuffer || 0}
        totalGiftHampers={totalGiftHampers}
        giftDeficit={giftDeficit}
        projectedAttendingParties={projectedAttendingParties}
        onAddPlateBuffer={() =>
          updateEvent({ cateringPlateBuffer: (event.cateringPlateBuffer || 0) + 10 })
        }
        onAddGiftBuffer={() =>
          updateEvent({ returnGiftBuffer: (event.returnGiftBuffer || 0) + 10 })
        }
      />

      {/* Fair Billing & Attendance-Based Adjustments + Weather Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FairBillingAuditCard
          costPerPlate={costPerPlate}
          cateringPlateCapacity={cateringPlateCapacity}
          expectedTotalHeadcount={expectedTotalHeadcount}
          plateVariance={plateVariance}
          fairBillingValue={fairBillingValue}
          onAutoAdjustDeficit={() =>
            updateEvent({
              cateringPlateBuffer: (event.cateringPlateBuffer || 0) + Math.abs(plateVariance) + 10,
            })
          }
          onReconcileCapBuffer={() => updateEvent({ cateringPlateBuffer: 10 })}
        />

        <WeatherAdvisoryCard
          dateStr={event.date}
          city={event.venue.city}
          venueType={event.venue.type}
          onSimulateBackupVenue={() => setIsWhatIfModalOpen(true)}
        />
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
              <div>
                <h4 className="text-sm font-bold">{alert.title}</h4>
                <p className="text-xs mt-0.5 opacity-90">{alert.message}</p>
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
      <DayOfTimelineSection
        schedule={scheduleItems}
        eventDate={event.date}
        defaultVenueName={event.venue.name}
        defaultOrganizerName={event.organizer.name}
        onToggleMilestone={toggleScheduleMilestone}
        onDeleteMilestone={deleteScheduleMilestone}
        onAddMilestone={addScheduleMilestone}
      />

      {/* Event Task Checklist */}
      <TaskManagementSection
        tasks={tasks}
        defaultDeadline={event.date}
        defaultAssignee={event.organizer.name}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onAddTask={addTask}
      />
    </div>
  );
};
