import React, { useMemo } from 'react';
import { CloudSun, MapPin } from 'lucide-react';
import { formatDate } from '../../../lib/formatters';

interface WeatherAdvisoryCardProps {
  dateStr: string;
  city: string;
  venueType: string;
  onSimulateBackupVenue: () => void;
}

export function getSeasonalWeatherAdvisory(dateStr: string, city: string, venueType: string) {
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

export const WeatherAdvisoryCard: React.FC<WeatherAdvisoryCardProps> = ({
  dateStr,
  city,
  venueType,
  onSimulateBackupVenue,
}) => {
  const advisory = useMemo(() => {
    return getSeasonalWeatherAdvisory(dateStr, city, venueType);
  }, [dateStr, city, venueType]);

  return (
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
            {advisory.tempRange}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6E5548] mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#C96F4A]" />
          <span>{city || 'Bengaluru'} · {formatDate(dateStr, 'medium')} · {advisory.iconDesc}</span>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E5548]">
            Operational Precautions for {venueType.replace('_', ' ')}:
          </span>
          <ul className="space-y-1.5 text-xs text-[#49372D]">
            {advisory.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#C96F4A] font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EAE5E1] flex items-center justify-between text-xs text-[#6E5548]">
        <span>
          Weather Risk Index: <strong className="capitalize text-[#49372D]">{advisory.outdoorRisk}</strong>
        </span>
        <button
          onClick={onSimulateBackupVenue}
          className="font-semibold text-[#C96F4A] hover:underline"
        >
          Simulate Venue Backup →
        </button>
      </div>
    </div>
  );
};

