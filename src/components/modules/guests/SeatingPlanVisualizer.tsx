import React from 'react';
import { Guest } from '../../../types';

interface SeatingPlanVisualizerProps {
  guests: Guest[];
  unseatedGuests: Guest[];
  tables: Record<string, { guests: Guest[]; totalHeadcount: number }>;
  onAssignTable: (guestId: string, tableName: string) => void;
  onUnseatGuest: (guestId: string) => void;
}

export const SeatingPlanVisualizer: React.FC<SeatingPlanVisualizerProps> = ({
  guests,
  unseatedGuests,
  tables,
  onAssignTable,
  onUnseatGuest,
}) => {
  const seatedCount = guests
    .filter((g) => !!g.tableNumber)
    .reduce((sum, g) => sum + g.partySize, 0);
  const unseatedCount = unseatedGuests.reduce((sum, g) => sum + g.partySize, 0);

  return (
    <div className="space-y-6">
      {/* Seating Top Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#EAE5E1] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#49372D]">
            Venue Seating Layout & Table Allocations
          </h3>
          <p className="text-xs text-[#6E5548] mt-0.5">
            Organize attending guests into banquet tables, VIP sections, and family groupings.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            ✓ {seatedCount} Seated
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            ⏳ {unseatedCount} Unseated Attending
          </span>
        </div>
      </div>

      {/* Unseated Guests Pool */}
      {unseatedGuests.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#FEF9ED] border border-[#F2C66D]/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Guests Awaiting Table Assignment ({unseatedGuests.length} parties)
            </span>
            <span className="text-xs text-amber-800">Assign with 1 click:</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {unseatedGuests.map((g) => (
              <div
                key={g.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#F2C66D] text-xs text-[#49372D] shadow-sm"
              >
                <span className="font-semibold">{g.name}</span>
                <span className="text-[11px] text-[#6E5548]">({g.partySize}p)</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      onAssignTable(g.id, e.target.value);
                    }
                  }}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] cursor-pointer"
                >
                  <option value="" disabled>
                    Seat at...
                  </option>
                  {Object.keys(tables).map((tName) => (
                    <option key={tName} value={tName}>
                      {tName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(tables).map(([tableName, data]) => {
          const capacity = tableName.includes('VIP') ? 6 : 8;
          const isFull = data.totalHeadcount >= capacity;

          return (
            <div
              key={tableName}
              className="p-5 rounded-2xl bg-white border border-[#EAE5E1] shadow-card flex flex-col justify-between hover:border-[#F5D1BD] transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C96F4A] flex items-center justify-center font-bold text-xs">
                      🍽️
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#49372D]">{tableName}</h4>
                      <span className="text-[10px] text-[#6E5548]">Capacity: {capacity} seats</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-amber-100 text-amber-800'
                        : data.totalHeadcount > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {data.totalHeadcount} / {capacity}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 rounded-full h-1.5 my-3 overflow-hidden">
                  <div
                    className={`h-full ${isFull ? 'bg-amber-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, (data.totalHeadcount / (capacity || 1)) * 100)}%` }}
                  />
                </div>

                {/* Guest list for this table */}
                <div className="space-y-2 mt-3 min-h-[90px]">
                  {data.guests.length === 0 ? (
                    <p className="text-xs text-stone-400 italic text-center py-6">
                      No guests seated here yet.
                    </p>
                  ) : (
                    data.guests.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#FFF8EF]/80 text-xs border border-[#FAF0EB]"
                      >
                        <div>
                          <p className="font-bold text-[#49372D]">{g.name}</p>
                          <p className="text-[10px] text-[#6E5548]">
                            {g.partySize} guests · {g.mealPreference.replace('_', ' ')}
                          </p>
                        </div>
                        <button
                          onClick={() => onUnseatGuest(g.id)}
                          className="text-stone-300 hover:text-red-500 p-1 text-xs"
                          title="Unseat guest"
                          aria-label={`Unseat ${g.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Seat Guest Action */}
              {unseatedGuests.length > 0 && !isFull && (
                <div className="mt-4 pt-3 border-t border-[#EAE5E1]">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onAssignTable(e.target.value, tableName);
                      }
                    }}
                    className="w-full text-xs font-semibold py-1.5 px-3 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] cursor-pointer hover:bg-[#F5D1BD]/50"
                  >
                    <option value="" disabled>
                      + Seat Unassigned Guest Here...
                    </option>
                    {unseatedGuests.map((ug) => (
                      <option key={ug.id} value={ug.id}>
                        {ug.name} ({ug.partySize} guests)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

