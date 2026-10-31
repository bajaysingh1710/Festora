import React, { useState } from 'react';
import {
  X,
  Plus,
  Copy,
  Trash2,
  Calendar,
  Users,
  Wallet,
  MapPin,
  Check,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getEventTypeName } from '../../services/eventDefaults';

export const EventSwitcherModal: React.FC = () => {
  const {
    events,
    activeEventId,
    isEventSwitcherOpen,
    setIsEventSwitcherOpen,
    switchEvent,
    duplicateCurrentEvent,
    deleteCurrentEvent,
    setIsCreateEventModalOpen,
    loadSampleWedding,
  } = useEvent();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isEventSwitcherOpen) return null;

  const handleSelectEvent = (id: string) => {
    switchEvent(id);
    setIsEventSwitcherOpen(false);
  };

  const handleOpenCreate = () => {
    setIsEventSwitcherOpen(false);
    setIsCreateEventModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-festive border border-[#F5D1BD] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FAF0EB] to-white border-b border-[#F5D1BD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C96F4A] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#FFF8EF]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#49372D]">Event Workspaces</h2>
              <p className="text-xs text-[#6E5548]">Switch between independent celebrations or start a new plan</p>
            </div>
          </div>
          <button
            onClick={() => setIsEventSwitcherOpen(false)}
            className="p-2 rounded-full text-[#6E5548] hover:bg-[#FAF0EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {events.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#FFF8EF] rounded-2xl border border-dashed border-[#F5D1BD]">
              <Sparkles className="w-10 h-10 text-[#C96F4A] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#49372D]">No Celebrations Saved Yet</h3>
              <p className="text-xs text-[#6E5548] mt-1 max-w-sm mx-auto">
                Create your first event workspace to organize guests, simulate budgets, and design themes.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={handleOpenCreate}
                  className="px-5 py-2.5 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F]"
                >
                  Create Your First Event
                </button>
                <button
                  onClick={() => {
                    loadSampleWedding();
                    setIsEventSwitcherOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#F5D1BD] text-xs font-semibold text-[#49372D] hover:bg-[#FAF0EB]"
                >
                  Explore Sample Wedding
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => {
                const isActive = ev.id === activeEventId;
                const isConfirming = confirmDeleteId === ev.id;

                return (
                  <div
                    key={ev.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isActive
                        ? 'bg-[#FAF0EB] border-[#C96F4A] ring-1 ring-[#C96F4A]/30 shadow-sm'
                        : 'bg-white border-[#EAE5E1] hover:border-[#F5D1BD] shadow-card'
                    }`}
                  >
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => handleSelectEvent(ev.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-[#C96F4A] border border-[#F5D1BD]">
                          {getEventTypeName(ev.eventType)}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Active Workspace</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#49372D] mt-1.5 leading-snug">
                        {ev.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E5548] mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C96F4A]" />
                          <span>{ev.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#C96F4A]" />
                          <span>{ev.targetGuestCount} guests</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-[#D9A948]" />
                          <span>₹{(ev.targetBudget || 0).toLocaleString('en-IN')}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#859675]" />
                          <span>{ev.city}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EAE5E1]">
                      {!isActive ? (
                        <button
                          onClick={() => handleSelectEvent(ev.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE5E1] text-xs font-semibold text-[#49372D] hover:bg-[#FAF0EB]"
                        >
                          Switch To
                        </button>
                      ) : (
                        <button
                          onClick={duplicateCurrentEvent}
                          title="Duplicate this celebration"
                          className="p-2 rounded-xl text-[#6E5548] hover:bg-white border border-transparent hover:border-[#EAE5E1]"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}

                      {isConfirming ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteCurrentEvent();
                              setConfirmDeleteId(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(ev.id)}
                          title="Delete celebration"
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF0EB]/60 border-t border-[#F5D1BD] flex items-center justify-between">
          <button
            onClick={() => {
              loadSampleWedding();
              setIsEventSwitcherOpen(false);
            }}
            className="text-xs text-[#C96F4A] hover:underline font-semibold"
          >
            Load Sample Wedding Demo
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

