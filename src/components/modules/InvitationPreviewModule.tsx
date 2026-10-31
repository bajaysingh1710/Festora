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
  Share2,
  Printer,
  Wand2,
  Copy,
  Check,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { MealPreference } from '../../types';

export const InvitationPreviewModule: React.FC = () => {
  const { event, activeTheme, setActiveModule, guests, updateGuest, updateEvent, showToast } = useEvent();

  const [rsvpGuestCode, setRsvpGuestCode] = useState('');
  const [rsvpStatusSelection, setRsvpStatusSelection] = useState<'attending' | 'declined'>('attending');
  const [rsvpPartyCount, setRsvpPartyCount] = useState<number>(2);
  const [rsvpMeal, setRsvpMeal] = useState<MealPreference>('vegetarian');
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

  // Template Style
  const [templateStyle, setTemplateStyle] = useState<'royal' | 'botanical' | 'midnight'>('royal');

  // AI Copywriter State
  const [isCopywriterOpen, setIsCopywriterOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'warm' | 'formal' | 'fun' | 'minimal'>('warm');
  const [customStory, setCustomStory] = useState(event.story);
  const [customTagline, setCustomTagline] = useState(event.tagline);
  const [linkCopied, setLinkCopied] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleGenerateCopy = (tone: 'warm' | 'formal' | 'fun' | 'minimal') => {
    setSelectedTone(tone);
    let newStory = '';
    let newTagline = '';

    if (tone === 'warm') {
      newTagline = 'With love, joy, and the blessings of our closest family';
      newStory = `From cherished shared memories to new beginnings under the evening sky, join us in celebrating "${event.title}". Your laughter and presence mean the world to us.`;
    } else if (tone === 'formal') {
      newTagline = 'The honor of your gracious presence is requested';
      newStory = `We cordially invite you to join us for "${event.title}" at ${event.venue.name}. Together with our families, we request your presence and blessings on this auspicious celebration.`;
    } else if (tone === 'fun') {
      newTagline = 'Good vibes, great music, and unforgettable celebration!';
      newStory = `Get ready to eat, dance, and celebrate! We are throwing the ultimate celebration for "${event.title}" and we cannot do it without you. Put on your celebration shoes!`;
    } else {
      newTagline = 'Celebrating life, milestones, and shared moments';
      newStory = `Join us at ${event.venue.name} in ${event.venue.city} for an evening of music, gourmet dinner, and celebration.`;
    }

    setCustomTagline(newTagline);
    setCustomStory(newStory);
    updateEvent({ tagline: newTagline, story: newStory });
    showToast(`Generated ${tone.toUpperCase()} invitation copy!`);
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    showToast('Invitation link copied to clipboard!');
    setTimeout(() => setLinkCopied(false), 2500);
  };

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
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Bar with Organizer Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EAE5E1] shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#6E5548]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Guest-Facing Live Invitation Portal · Real RSVP Synchronization</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsCopywriterOpen(!isCopywriterOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] text-xs font-bold hover:bg-[#F5D1BD]/50 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Copywriter</span>
          </button>

          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] text-xs font-bold hover:bg-[#FAF0EB] shadow-sm transition-all"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>Share Link</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAE5E1] text-[#49372D] text-xs font-bold hover:bg-[#FAF0EB] shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={() => setActiveModule('overview')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* AI Copywriter Accordion Drawer */}
      {isCopywriterOpen && (
        <div className="rounded-3xl bg-white border border-[#C96F4A] p-5 shadow-festive space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-[#EAE5E1] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#49372D] flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#C96F4A]" />
              <span>AI Invitation Message Copywriter</span>
            </h3>
            <span className="text-xs text-[#6E5548]">Select a tone to automatically rewrite your invitation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'warm', label: 'Warm & Heartfelt' },
              { id: 'formal', label: 'Formal & Regal' },
              { id: 'fun', label: 'Fun & Playful' },
              { id: 'minimal', label: 'Modern Minimal' },
            ].map((tone) => (
              <button
                key={tone.id}
                onClick={() => handleGenerateCopy(tone.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  selectedTone === tone.id
                    ? 'bg-[#C96F4A] text-white border-[#C96F4A]'
                    : 'bg-[#FFF8EF] border-[#EAE5E1] text-[#49372D] hover:border-[#F5D1BD]'
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#6E5548] uppercase">
              Tagline
            </label>
            <input
              type="text"
              value={customTagline}
              onChange={(e) => {
                setCustomTagline(e.target.value);
                updateEvent({ tagline: e.target.value });
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
            />

            <label className="block text-xs font-bold text-[#6E5548] uppercase mt-2">
              Celebration Story / Invitation Note
            </label>
            <textarea
              rows={3}
              value={customStory}
              onChange={(e) => {
                setCustomStory(e.target.value);
                updateEvent({ story: e.target.value });
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C96F4A]/30"
            />
          </div>
        </div>
      )}

      {/* Template Theme Selector */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs font-semibold text-[#6E5548]">Invitation Style:</span>
        {[
          { id: 'royal', label: 'Royal Terracotta' },
          { id: 'botanical', label: 'Sage Botanical' },
          { id: 'midnight', label: 'Midnight Glamour' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplateStyle(t.id as any)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              templateStyle === t.id
                ? 'bg-[#C96F4A] text-white border-[#C96F4A]'
                : 'bg-white border-[#EAE5E1] text-[#49372D]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Royal Celebration Invitation Card */}
      <div
        className={`max-w-3xl mx-auto rounded-3xl border-2 p-8 sm:p-14 shadow-festive-lg text-center relative overflow-hidden transition-all ${
          templateStyle === 'midnight'
            ? 'bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white border-amber-500/50'
            : templateStyle === 'botanical'
            ? 'bg-gradient-to-b from-[#F2F6F0] via-white to-[#F2F6F0] text-[#2D3728] border-[#A9B89A]'
            : 'bg-gradient-to-b from-[#FFF] via-[#FFF8EF] to-[#FAF0EB] text-[#49372D] border-[#F5D1BD]'
        }`}
      >
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 border border-[#F5D1BD] text-xs font-bold text-[#C96F4A] shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">Celebration Invitation</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#C96F4A] italic font-light">
            "{event.tagline}"
          </p>

          <p className="text-sm sm:text-base opacity-80 leading-relaxed max-w-xl mx-auto font-light">
            {event.story}
          </p>

          {/* Date, Time & Venue Plaque */}
          <div className="mt-8 pt-8 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left bg-white/90 text-[#49372D] p-6 rounded-2xl border shadow-sm">
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
                    <span>Google Maps Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Celebration Run of Show Schedule */}
          <div className="pt-6 text-left">
            <h3 className="font-serif text-lg font-bold text-center mb-4">
              Celebration Schedule
            </h3>
            <div className="space-y-3 max-w-lg mx-auto text-[#49372D]">
              {[
                { time: '6:30 PM', title: 'Royal Welcome & Refreshments', desc: 'Welcome mocktails, grazing mezze, and floral greetings' },
                { time: '7:30 PM', title: 'Main Celebration & Program', desc: 'Central presentation, milestones & commemorative toasts' },
                { time: '8:45 PM', title: 'Grand Multi-Cuisine Feast', desc: 'Live counters, dinner buffet & chef special desserts' },
                { time: '10:00 PM', title: 'Dance Floor & Keepsakes', desc: 'Music set and collection of handcrafted return gifts' },
              ].map((slot, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-white/90 border border-[#EAE5E1] shadow-sm">
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
          <div className="pt-6 border-t border-black/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-80">
              <Shirt className="w-4 h-4 text-[#C96F4A]" />
              <span>Dress Code & Theme Palette</span>
            </div>
            <p className="font-medium text-sm mt-1">{event.dressCode}</p>
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
          <div className="pt-8 border-t border-black/10">
            <div className="max-w-md mx-auto rounded-2xl bg-white text-[#49372D] p-6 border border-[#F5D1BD] shadow-card text-left">
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
                      placeholder="e.g. FEST-BD-101 or Rohan Desai"
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
