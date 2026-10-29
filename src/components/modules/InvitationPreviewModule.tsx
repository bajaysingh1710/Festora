import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Shirt,
  Send,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Utensils,
  Music,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { MealPreference } from '../../types';

export const InvitationPreviewModule: React.FC = () => {
  const { event, activeTheme, setActiveModule, guests, updateGuest, showToast } = useEvent();

  const [rsvpGuestCode, setRsvpGuestCode] = useState('');
  const [rsvpStatusSelection, setRsvpStatusSelection] = useState<'attending' | 'declined'>('attending');
  const [rsvpPartyCount, setRsvpPartyCount] = useState<number>(2);
  const [rsvpMeal, setRsvpMeal] = useState<MealPreference>('vegetarian');
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleGuestRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = rsvpGuestCode.trim().toUpperCase();

    const matchedGuest = guests.find(
      (g) => g.guestCode.toUpperCase() === code || g.name.toLowerCase().includes(code.toLowerCase())
    );

    if (matchedGuest) {
      updateGuest(matchedGuest.id, {
        rsvpStatus: rsvpStatusSelection,
        partySize: Number(rsvpPartyCount) || matchedGuest.partySize,
        mealPreference: rsvpMeal,
      });

      setRsvpConfirmed(true);
      showToast(`Thank you! RSVP recorded for ${matchedGuest.name}.`);
    } else {
      showToast('Could not find that Guest Code. Check your invitation message.', 'warning');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back to Organizer Workspace Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EAE5E1] shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#6E5548]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Viewing live Guest-Facing Invitation Portal as seen by arriving guests</span>
        </div>
        <button
          onClick={() => setActiveModule('overview')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0EB] text-[#C96F4A] text-xs font-semibold hover:bg-[#F5D1BD] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Organizer Workspace</span>
        </button>
      </div>

      {/* Royal Celebration Invitation Card */}
      <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-[#FFF] via-[#FFF8EF] to-[#FAF0EB] border-2 border-[#F5D1BD] p-8 sm:p-14 shadow-festive-lg text-center relative overflow-hidden">
        {/* Subtle decorative corners */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#C96F4A]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#D9A948]/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border border-[#F5D1BD] text-xs font-semibold text-[#C96F4A] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">Celebration Invitation</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#49372D] tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#C96F4A] italic font-light">
            "{event.tagline}"
          </p>

          <p className="text-sm sm:text-base text-[#6E5548] leading-relaxed max-w-xl mx-auto font-light">
            {event.story}
          </p>

          {/* Date, Time & Venue Plaque */}
          <div className="mt-8 pt-8 border-t border-[#F5D1BD] grid grid-cols-1 sm:grid-cols-2 gap-5 text-left bg-white/70 p-6 rounded-2xl border">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E5548]">When</span>
                <p className="font-bold text-[#49372D] text-sm mt-0.5">{formattedDate}</p>
                <p className="text-xs text-[#6E5548] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#C96F4A]" />
                  <span>{event.time} onwards</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E5548]">Where</span>
                <p className="font-bold text-[#49372D] text-sm mt-0.5">{event.venue.name}</p>
                <p className="text-xs text-[#6E5548] mt-0.5">{event.venue.address}, {event.venue.city}</p>
                {event.venue.directionsUrl && (
                  <a
                    href={event.venue.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#C96F4A] font-semibold mt-1 hover:underline"
                  >
                    <span>Get Google Maps Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Celebration Run of Show Schedule */}
          <div className="pt-6 text-left">
            <h3 className="font-serif text-lg font-bold text-[#49372D] text-center mb-4">
              Celebration Day Schedule
            </h3>
            <div className="space-y-3 max-w-lg mx-auto">
              {[
                { time: '6:30 PM', title: 'Royal Welcome & Shehnai', desc: 'Welcome mocktails, grazing mezze, and flower petal greetings' },
                { time: '7:15 PM', title: 'Ring Exchange & Traditional Vows', desc: 'Sacred blessings under the floral banyan canopy' },
                { time: '8:00 PM', title: 'Live Sangeet & Performances', desc: 'Family dances, choreographed specials, and couple waltz' },
                { time: '9:00 PM', title: 'Grand Royal Multi-Cuisine Feast', desc: 'Live chaat counters, rich dinner buffet, and artisan sweets' },
                { time: '10:30 PM', title: 'Open Dance Floor & Keepsakes', desc: 'DJ set and collection of handcrafted return gifts' },
              ].map((slot, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-white border border-[#EAE5E1]">
                  <span className="font-mono text-xs font-bold text-[#C96F4A] w-16 shrink-0 mt-0.5">
                    {slot.time}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-[#49372D]">{slot.title}</h4>
                    <p className="text-[11px] text-[#6E5548] mt-0.5">{slot.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code & Color Palette */}
          <div className="pt-6 border-t border-[#F5D1BD] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6E5548]">
              <Shirt className="w-4 h-4 text-[#C96F4A]" />
              <span>Dress Code & Theme Palette</span>
            </div>
            <p className="font-medium text-sm text-[#49372D] mt-1">{event.dressCode}</p>
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {Object.values(activeTheme.palette).slice(0, 5).map((color, idx) => {
                if (typeof color !== 'string') return null;
                return (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-card"
                    style={{ backgroundColor: color }}
                    title={activeTheme.palette.names[idx] || color}
                  />
                );
              })}
            </div>
          </div>

          {/* Interactive Guest RSVP Form */}
          <div className="pt-8 border-t border-[#F5D1BD]">
            <div className="max-w-md mx-auto rounded-2xl bg-white p-6 border border-[#F5D1BD] shadow-card text-left">
              <h3 className="font-serif text-lg font-bold text-[#49372D] mb-1">
                Confirm Your Attendance
              </h3>
              <p className="text-xs text-[#6E5548] mb-4">
                Enter your pass code or family name to update your RSVP status.
              </p>

              {rsvpConfirmed ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm text-emerald-900">Your RSVP has been confirmed!</p>
                  <p className="text-xs text-emerald-700">We look forward to celebrating with you.</p>
                  <button
                    onClick={() => setRsvpConfirmed(false)}
                    className="text-xs text-[#C96F4A] underline font-semibold mt-2"
                  >
                    Edit RSVP
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGuestRsvpSubmit} className="space-y-3.5 text-xs text-[#49372D]">
                  <div>
                    <label className="block font-semibold text-[#6E5548] mb-1">
                      Guest Code or Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpGuestCode}
                      onChange={(e) => setRsvpGuestCode(e.target.value)}
                      placeholder="e.g. FEST-AK-102 or Vikram Mehra"
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#6E5548] mb-1">Will you attend?</label>
                      <select
                        value={rsvpStatusSelection}
                        onChange={(e) => setRsvpStatusSelection(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                      >
                        <option value="attending">Joyfully Accept</option>
                        <option value="declined">Regretfully Decline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#6E5548] mb-1">Attending Count</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={rsvpPartyCount}
                        onChange={(e) => setRsvpPartyCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#6E5548] mb-1">Meal Preference</label>
                    <select
                      value={rsvpMeal}
                      onChange={(e) => setRsvpMeal(e.target.value as MealPreference)}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                    >
                      <option value="vegetarian">Vegetarian Feast</option>
                      <option value="non_vegetarian">Non-Vegetarian Feast</option>
                      <option value="jain">Strict Jain</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#C96F4A] text-white font-bold text-xs shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all mt-2"
                  >
                    Submit RSVP Response
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
