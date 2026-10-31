import React, { useState } from 'react';
import { Clock, Plus, Trash2, X } from 'lucide-react';
import { TimelineEvent } from '../../../types';

interface DayOfTimelineSectionProps {
  schedule: TimelineEvent[];
  eventDate: string;
  defaultVenueName: string;
  defaultOrganizerName: string;
  onToggleMilestone: (id: string) => void;
  onDeleteMilestone: (id: string) => void;
  onAddMilestone: (milestone: Omit<TimelineEvent, 'id'>) => void;
}

export const DayOfTimelineSection: React.FC<DayOfTimelineSectionProps> = ({
  schedule,
  eventDate,
  defaultVenueName,
  defaultOrganizerName,
  onToggleMilestone,
  onDeleteMilestone,
  onAddMilestone,
}) => {
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [newScheduleTime, setNewScheduleTime] = useState('11:00 AM');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleLocation, setNewScheduleLocation] = useState(defaultVenueName);
  const [newScheduleCoordinator, setNewScheduleCoordinator] = useState(defaultOrganizerName);

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;

    onAddMilestone({
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
    <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#C96F4A]" />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#49372D]">
              Day-of Event Schedule & Hourly Flow
            </h3>
            <p className="text-xs text-[#6E5548]">
              Real-time operational choreography for coordination teams on {eventDate}.
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
        {schedule.map((item, idx) => (
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
                onChange={() => onToggleMilestone(item.id)}
                className="w-4 h-4 rounded border-[#EAE5E1] accent-[#C96F4A] cursor-pointer"
                aria-label={`Mark milestone ${item.title} complete`}
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
              onClick={() => onDeleteMilestone(item.id)}
              className="p-1 text-stone-300 hover:text-red-500 rounded transition-colors"
              title="Remove milestone"
              aria-label="Remove milestone"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Schedule Milestone Modal */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
              <h3 className="font-serif font-bold text-lg text-[#49372D]">Add Schedule Milestone</h3>
              <button
                onClick={() => setIsAddScheduleOpen(false)}
                className="p-1 text-[#6E5548] hover:text-[#49372D] rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#49372D] mb-1">Time (e.g. 10:30 AM)</label>
                  <input
                    type="text"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                    placeholder="11:00 AM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#49372D] mb-1">Location Zone</label>
                  <input
                    type="text"
                    value={newScheduleLocation}
                    onChange={(e) => setNewScheduleLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                    placeholder="Main Stage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#49372D] mb-1">Milestone Activity Title</label>
                <input
                  type="text"
                  value={newScheduleTitle}
                  onChange={(e) => setNewScheduleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                  placeholder="e.g. Guest Welcome Drinks & Photography"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#49372D] mb-1">Lead Coordinator</label>
                <input
                  type="text"
                  value={newScheduleCoordinator}
                  onChange={(e) => setNewScheduleCoordinator(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                  placeholder="e.g. Stage Manager / Emcee"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE5E1]">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-xs font-semibold text-[#6E5548]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F]"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

