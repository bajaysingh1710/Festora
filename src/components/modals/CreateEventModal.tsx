import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Users,
  Wallet,
  MapPin,
  Building,
  Cake,
  GraduationCap,
  Briefcase,
  Heart,
  PartyPopper,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { EventType, VenueType } from '../../types';
import { getEventTypeName } from '../../services/eventDefaults';

export const CreateEventModal: React.FC = () => {
  const {
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    createEvent,
    loadSampleWedding,
  } = useEvent();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('birthday');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:30');
  const [city, setCity] = useState('Bengaluru');
  const [guestCount, setGuestCount] = useState(100);
  const [budget, setBudget] = useState(250000);
  const [venueType, setVenueType] = useState<VenueType>('function_hall');
  const [venueName, setVenueName] = useState('');

  if (!isCreateEventModalOpen) return null;

  const eventTypes: Array<{ type: EventType; label: string; icon: any }> = [
    { type: 'birthday', label: 'Birthday', icon: Cake },
    { type: 'wedding', label: 'Wedding', icon: Heart },
    { type: 'engagement', label: 'Engagement', icon: Sparkles },
    { type: 'college', label: 'College Fest', icon: GraduationCap },
    { type: 'corporate', label: 'Corporate', icon: Briefcase },
    { type: 'anniversary', label: 'Anniversary', icon: Heart },
    { type: 'family', label: 'Family Gathering', icon: Users },
    { type: 'custom', label: 'Custom Event', icon: PartyPopper },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || `${guestCount}-Guest ${getEventTypeName(eventType)}`;
    createEvent({
      title: finalTitle,
      eventType,
      date,
      time,
      targetGuestCount: Number(guestCount),
      targetBudget: Number(budget),
      venue: {
        name: venueName.trim() || (venueType === 'home_courtyard' ? 'Ancestral Home Courtyard' : 'Grand Celebration Hall'),
        type: venueType,
        address: `${city} Center`,
        city,
        capacity: Math.round(guestCount * 1.3),
        directionsUrl: 'https://maps.google.com',
      },
    });
    setIsCreateEventModalOpen(false);
  };

  const handleExploreSample = () => {
    loadSampleWedding();
    setIsCreateEventModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-festive border border-[#F5D1BD] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FAF0EB] to-white border-b border-[#F5D1BD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C96F4A] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#FFF8EF]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#49372D]">Create New Celebration</h2>
              <p className="text-xs text-[#6E5548]">Initialize an independent, persistent event workspace</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateEventModalOpen(false)}
            className="p-2 rounded-full text-[#6E5548] hover:bg-[#FAF0EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Event Type Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-2">
              Select Celebration Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {eventTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = eventType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setEventType(item.type);
                      if (item.type === 'birthday') setBudget(150000);
                      else if (item.type === 'wedding') setBudget(850000);
                      else if (item.type === 'college') setBudget(350000);
                      else if (item.type === 'corporate') setBudget(500000);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-[#C96F4A] text-white border-[#C96F4A] shadow-md ring-2 ring-[#C96F4A]/20'
                        : 'bg-[#FFF8EF] border-[#EAE5E1] text-[#49372D] hover:border-[#F5D1BD]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#C96F4A]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. Aarav's 18th Birthday Bash / Zenith 2026 Cultural Fest`}
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30 focus:border-[#C96F4A]"
            />
          </div>

          {/* Date, Time & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C96F4A]" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C96F4A]" />
                <span>City</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
                required
              />
            </div>
          </div>

          {/* Guests & Budget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#C96F4A]" />
                <span>Target Guest Count</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-[#EAE5E1] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
                  required
                />
                <div className="flex gap-1.5 shrink-0">
                  {[50, 100, 200, 500].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                        guestCount === count ? 'bg-[#C96F4A] text-white' : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-[#F2C66D]" />
                <span>Target Budget (₹)</span>
              </label>
              <input
                type="number"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-[#EAE5E1] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
                required
              />
              <p className="text-[11px] text-[#6E5548] mt-1">
                ≈ ₹{Math.round(budget / Math.max(1, guestCount)).toLocaleString('en-IN')} per guest
              </p>
            </div>
          </div>

          {/* Venue Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5548] mb-1.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>Venue Preference</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'function_hall', label: 'Banquet Hall' },
                { type: 'home_courtyard', label: 'Home Courtyard' },
                { type: 'outdoor_lawn', label: 'Outdoor Lawn' },
                { type: 'resort', label: 'Resort / Farm' },
              ].map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVenueType(v.type as VenueType)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                    venueType === v.type
                      ? 'bg-[#C96F4A] text-white border-[#C96F4A]'
                      : 'bg-[#FFF8EF] border-[#EAE5E1] text-[#49372D]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="pt-4 border-t border-[#EAE5E1] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleExploreSample}
              className="text-xs text-[#C96F4A] hover:underline font-semibold"
            >
              Or explore sample wedding demo →
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsCreateEventModalOpen(false)}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-[#EAE5E1] text-xs font-semibold text-[#6E5548] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

