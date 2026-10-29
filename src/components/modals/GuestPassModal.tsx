import React, { useEffect, useState } from 'react';
import { QrCode, Download, Printer, X, Sparkles, CheckCircle, MapPin, Calendar, Clock, Utensils } from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { getGuestPass } from '../../services/guestPassService';
import { GuestPass } from '../../types';

export const GuestPassModal: React.FC = () => {
  const { event, selectedGuestForPass, setSelectedGuestForPass } = useEvent();
  const [passData, setPassData] = useState<GuestPass | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedGuestForPass) {
      setPassData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getGuestPass(selectedGuestForPass, event).then((pass) => {
      if (isMounted) {
        setPassData(pass);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedGuestForPass, event]);

  if (!selectedGuestForPass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-festive-lg border border-[#F5D1BD] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </span>
            <h2 className="font-serif text-xl font-bold text-[#49372D]">Festora GuestPass</h2>
          </div>
          <button
            onClick={() => setSelectedGuestForPass(null)}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Card */}
        <div className="mt-5 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF8EF] via-[#FAF0EB] to-[#F5D1BD]/40 border-2 border-[#C96F4A]/30 p-6 shadow-festive text-[#49372D]">
          {/* Header */}
          <div className="text-center pb-4 border-b border-[#C96F4A]/20">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C96F4A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Guest Admission</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#49372D] mt-1 leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-[#6E5548] mt-0.5">{event.tagline}</p>
          </div>

          {/* QR Code Container */}
          <div className="py-5 flex flex-col items-center justify-center">
            <div className="p-3 bg-white rounded-2xl border border-[#F5D1BD] shadow-card">
              {isLoading || !passData?.qrPayload ? (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-[#6E5548] animate-pulse">
                  Generating secure QR pass...
                </div>
              ) : (
                <img
                  src={passData.qrPayload}
                  alt={`QR Pass for ${selectedGuestForPass.name}`}
                  className="w-44 h-44 object-contain rounded-lg"
                />
              )}
            </div>

            {/* Unique Pass Code Badge */}
            <div className="mt-3 text-center">
              <span className="font-mono text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-white border border-[#C96F4A]/40 text-[#C96F4A] shadow-sm">
                {selectedGuestForPass.guestCode}
              </span>
              <p className="text-[11px] text-[#6E5548] mt-1">Scan at entrance for single-entry admission</p>
            </div>
          </div>

          {/* Guest Details Matrix */}
          <div className="pt-4 border-t border-[#C96F4A]/20 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[#6E5548] font-semibold uppercase tracking-wider text-[10px]">Guest Name</p>
              <p className="font-bold text-[#49372D] text-sm truncate">{selectedGuestForPass.name}</p>
            </div>
            <div>
              <p className="text-[#6E5548] font-semibold uppercase tracking-wider text-[10px]">Party Size</p>
              <p className="font-bold text-[#49372D] text-sm">
                {selectedGuestForPass.partySize} {selectedGuestForPass.partySize > 1 ? 'Admitted' : 'Admitted'}
              </p>
            </div>
            <div>
              <p className="text-[#6E5548] font-semibold uppercase tracking-wider text-[10px]">Table Seating</p>
              <p className="font-medium text-[#49372D]">{selectedGuestForPass.tableNumber || 'Open Seating'}</p>
            </div>
            <div>
              <p className="text-[#6E5548] font-semibold uppercase tracking-wider text-[10px]">Meal Plan</p>
              <p className="font-medium text-[#49372D] capitalize">{selectedGuestForPass.mealPreference}</p>
            </div>
          </div>

          {/* Venue & Time Footer */}
          <div className="mt-4 pt-3 border-t border-[#C96F4A]/10 text-[11px] text-[#6E5548] space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {event.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span className="truncate">{event.venue.name}, {event.venue.city}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3 text-sm">
          <button
            onClick={() => setSelectedGuestForPass(null)}
            className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-[#6E5548] font-medium hover:bg-stone-50"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C96F4A] text-white font-semibold shadow-festive hover:bg-[#A8522F]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
