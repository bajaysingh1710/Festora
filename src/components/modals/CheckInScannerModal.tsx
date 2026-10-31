import React, { useState } from 'react';
import {
  QrCode,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { CheckInResult, validateGuestCheckOut } from '../../services/guestPassService';

export const CheckInScannerModal: React.FC = () => {
  const {
    guests,
    isCheckInScannerOpen,
    setIsCheckInScannerOpen,
    checkInGuestByCode,
    showToast,
  } = useEvent();

  const [scanMode, setScanMode] = useState<'check_in' | 'check_out'>('check_in');
  const [inputCode, setInputCode] = useState('');
  const [operatorName, setOperatorName] = useState('Front Desk - Gate 1');
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);

  if (!isCheckInScannerOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    if (scanMode === 'check_in') {
      const result = checkInGuestByCode(inputCode.trim(), operatorName);
      setLastResult(result);
      if (result.success) {
        setInputCode('');
      }
    } else {
      const result = validateGuestCheckOut(inputCode.trim(), guests, operatorName);
      setLastResult(result);
      if (result.success) {
        setInputCode('');
        showToast(`Exit recorded for ${result.guest?.name}`);
      }
    }
  };

  const handleQuickAdmit = (guestCode: string) => {
    if (scanMode === 'check_in') {
      const result = checkInGuestByCode(guestCode, operatorName);
      setLastResult(result);
    } else {
      const result = validateGuestCheckOut(guestCode, guests, operatorName);
      setLastResult(result);
    }
  };

  // Recent checked in guests list
  const checkedInList = guests.filter((g) => g.checkInStatus === 'checked_in');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-festive-lg border border-[#F5D1BD] animate-in fade-in zoom-in-95 duration-200">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-[#49372D]">
                  Organizer Check-In Terminal
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800">
                  Live Scanner
                </span>
              </div>
              <p className="text-xs text-[#6E5548]">
                Validate GuestPass tokens, admit parties, and prevent duplicate check-ins.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckInScannerOpen(false);
              setLastResult(null);
            }}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operator Badge & Mode Selector */}
        <div className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6E5548]">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C96F4A]" />
                <span>Operator:</span>
              </span>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="px-2.5 py-0.5 rounded border border-[#EAE5E1] text-xs font-semibold text-[#49372D] focus:outline-none"
              />
            </div>

            <div className="inline-flex rounded-xl p-0.5 bg-[#FAF0EB] border border-[#F5D1BD]">
              <button
                type="button"
                onClick={() => {
                  setScanMode('check_in');
                  setLastResult(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  scanMode === 'check_in'
                    ? 'bg-[#C96F4A] text-white shadow-sm'
                    : 'text-[#6E5548] hover:text-[#49372D]'
                }`}
              >
                Entry Check-In
              </button>
              <button
                type="button"
                onClick={() => {
                  setScanMode('check_out');
                  setLastResult(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  scanMode === 'check_out'
                    ? 'bg-[#49372D] text-white shadow-sm'
                    : 'text-[#6E5548] hover:text-[#49372D]'
                }`}
              >
                Exit Verification
              </button>
            </div>
          </div>

          <form onSubmit={handleScanSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#6E5548] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Scan QR or enter Guest Code (e.g. FEST-AK-101)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-[#C96F4A]/40 text-base font-mono font-medium text-[#49372D] placeholder:font-sans placeholder:text-sm focus:outline-none focus:border-[#C96F4A] focus:ring-2 focus:ring-[#C96F4A]/20"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#C96F4A] text-white font-semibold text-sm shadow-festive hover:bg-[#A8522F] active:scale-95 transition-all shrink-0"
            >
              Verify & Admit
            </button>
          </form>
        </div>

        {/* Live Validation Result Feedback Display */}
        {lastResult && (
          <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-200">
            {lastResult.status === 'valid' && (
              <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 p-4 text-emerald-900 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-emerald-900">
                        Admission Verified! 🎉
                      </span>
                      <span className="text-xs font-mono bg-emerald-200/80 px-2 py-0.5 rounded font-bold">
                        {lastResult.guest?.guestCode}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mt-1">
                      {lastResult.guest?.name} (Party of {lastResult.guest?.partySize})
                    </p>
                    <div className="mt-2 text-xs text-emerald-800 grid grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-200">
                      <div>
                        <span className="font-semibold">Table Seating:</span>{' '}
                        {lastResult.guest?.tableNumber || 'Open Seating'}
                      </div>
                      <div>
                        <span className="font-semibold">Meal Preference:</span>{' '}
                        <span className="capitalize">{lastResult.guest?.mealPreference}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Admission Timestamp:</span>{' '}
                        {new Date().toLocaleTimeString()} by {lastResult.operator}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {lastResult.status === 'already_checked_in' && (
              <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 text-amber-900 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-base text-amber-900">
                      Duplicate Pass Scanned — Already Checked In!
                    </span>
                    <p className="text-sm font-medium mt-1">{lastResult.message}</p>
                    <p className="text-xs text-amber-800 mt-2 bg-white/70 p-2 rounded-lg border border-amber-200">
                      If this is an additional family member arriving separately, please verify ID with the main party host.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(lastResult.status === 'cancelled' || lastResult.status === 'invalid') && (
              <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-4 text-red-900 shadow-sm">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-base text-red-900">
                      {lastResult.status === 'cancelled' ? 'RSVP Was Declined' : 'Invalid Guest Pass Code'}
                    </span>
                    <p className="text-sm mt-1">{lastResult.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Check-In Roster for Arriving Guests */}
        <div className="mt-6 pt-5 border-t border-[#EAE5E1]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6E5548]">
              Quick Reception Roster ({checkedInList.length} of {guests.length} Checked In)
            </h3>
            <span className="text-[11px] text-[#6E5548]">One-click reception check-in</span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {guests.map((g) => {
              const isChecked = g.checkInStatus === 'checked_in';
              return (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF0EB]/40 border border-[#EAE5E1] text-xs hover:bg-[#FAF0EB] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#49372D]">{g.name}</span>
                      <span className="font-mono text-[10px] text-[#C96F4A] font-bold">
                        {g.guestCode}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6E5548]">
                      Party of {g.partySize} · Table: {g.tableNumber || 'Open'}
                    </span>
                  </div>

                  {isChecked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Checked In</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdmit(g.guestCode)}
                      className="px-2.5 py-1 rounded-md bg-[#C96F4A] text-white font-medium text-[11px] hover:bg-[#A8522F] active:scale-95 transition-all"
                    >
                      Admit Party
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
