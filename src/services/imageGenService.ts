import {
  EventType,
  VenueType,
  ThemeConcept,
  DecorAreaId,
  DecorConceptItem,
} from '../types';

export interface GenerateDecorOptions {
  eventType: EventType;
  venueType: VenueType;
  theme: ThemeConcept;
  targetBudget: number;
  guestCount: number;
  customModifications?: string;
  venuePhotoNote?: string;
}

export const DECOR_AREAS: Array<{ id: DecorAreaId; label: string; description: string }> = [
  { id: 'entrance', label: 'Entrance & Welcome Area', description: 'Grand entryway, floral/balloon arch, welcoming signage & photo pathway' },
  { id: 'stage', label: 'Main Stage & Focal Area', description: 'Central presentation backdrop, ceremonial riser, thematic accent wall & lighting' },
  { id: 'seating', label: 'Guest Seating Arrangement', description: 'Ergonomic seating zones, banquet layout, luxury chair sashes & lounge lounges' },
  { id: 'dining', label: 'Dining & Buffet Station', description: 'Gourmet spread presentation, canopy draping, warm ambient illumination & food signage' },
  { id: 'tables', label: 'Table Decorations & Centerpieces', description: 'Curated floral vessels, table runners, candlelight accents & menu plaques' },
  { id: 'lighting', label: 'Lighting & Ceiling Canopy', description: 'Warm fairy light webs, suspended chandeliers, pin-spotting & architectural wash' },
  { id: 'outdoor', label: 'Outdoor Lawns & Patio', description: 'Open-air festoon strings, natural garden accents, cozy photo corners & path lights' },
  { id: 'complete_venue', label: 'Complete 360° Venue Concept', description: 'Harmonious holistic celebration environment tying all zones together' },
];

function buildImagePrompt(
  area: DecorAreaId,
  options: GenerateDecorOptions
): string {
  const { eventType, venueType, theme, customModifications, venuePhotoNote } = options;
  const primaryColor = theme.palette.names[0] || 'terracotta';
  const secondaryColor = theme.palette.names[1] || 'golden';

  let areaDescription = '';
  switch (area) {
    case 'entrance':
      areaDescription = `grand event entrance with ${theme.decorElements[0] || 'sculptural arches'}, customized welcome sign, elegant pathway lined with lanterns and floral arrangements in ${primaryColor} and ${secondaryColor}`;
      break;
    case 'stage':
      areaDescription = `spectacular main stage backdrop with ${theme.decorElements[1] || 'draped fabric and acoustic panels'}, ambient warm uplighting, floral installations in ${primaryColor} and ${secondaryColor}, clean modern staging`;
      break;
    case 'seating':
      areaDescription = `stylish celebration guest seating arrangement with clothed banquet chairs, elegant aisle runners, lounge seating pods with textured cushions in ${primaryColor}`;
      break;
    case 'dining':
      areaDescription = `lavish food and buffet dining area with gourmet presentation stations, overhead hanging botanicals or fairy lights, carved wooden risers, warm ambient lighting`;
      break;
    case 'tables':
      areaDescription = `intimate guest dining table centerpiece design featuring ${theme.decorElements[2] || 'low floral urns'}, floating candles in glass hurricane vases, refined linen runners in ${theme.palette.names[2] || 'cream'}`;
      break;
    case 'lighting':
      areaDescription = `dramatic ceiling canopy lighting with cascading warm fairy lights, filament bulb clusters, atmospheric glow, soft shadows, architectural warm illumination`;
      break;
    case 'outdoor':
      areaDescription = `magical outdoor lawn evening celebration area with festoon canopy lighting, garden seating, romantic illuminated pathways under mature trees`;
      break;
    case 'complete_venue':
    default:
      areaDescription = `architectural wide-angle view of complete ${venueType.replace('_', ' ')} transformed for a ${eventType} celebration with cohesive ${theme.title} decor, harmonious lighting and ambient warmth`;
      break;
  }

  const modificationsText = customModifications ? ` Special request: ${customModifications}.` : '';
  const photoNoteText = venuePhotoNote ? ` Grounded in uploaded venue reference layout: ${venuePhotoNote}.` : '';

  return `Professional architectural photograph of a ${eventType} event decor: ${areaDescription}.${modificationsText}${photoNoteText} Architectural digest interior styling, ultra-realistic, warm cinematic lighting, elegant luxury event design, 8k resolution, award-winning venue design`;
}

export function constructImageUrl(prompt: string, seed: number): string {
  const cleanPrompt = prompt.replace(/[^\w\s,.-]/gi, ' ').slice(0, 350);
  const encoded = encodeURIComponent(cleanPrompt);
  // Using Pollinations AI with Flux model
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=680&seed=${seed}&nologo=true&model=flux`;
}

export function generateAllDecorConcepts(options: GenerateDecorOptions): DecorConceptItem[] {
  const { eventType, theme, targetBudget, guestCount, customModifications } = options;
  const decorBudgetTotal = Math.round(targetBudget * 0.2); // ~20% decor allocation
  const baseSeed = Math.floor(Math.random() * 899999) + 100000;

  return DECOR_AREAS.map((areaInfo, index) => {
    const area = areaInfo.id;
    const prompt = buildImagePrompt(area, options);
    const seed = baseSeed + index * 47;
    const imageUrl = constructImageUrl(prompt, seed);

    let estimatedCost = Math.round(decorBudgetTotal * 0.12);
    let materials: string[] = [];
    let affordableAlternative = '';

    switch (area) {
      case 'entrance':
        estimatedCost = Math.round(decorBudgetTotal * 0.18);
        materials = ['Custom wooden archway', 'Wholesale fresh marigolds / carnations', 'Brass lanterns', 'Printed welcome vinyl easel'];
        affordableAlternative = 'Replace structural wooden arch with reusable wrought-iron frame and potted seasonal plants (saves ~30%)';
        break;
      case 'stage':
        estimatedCost = Math.round(decorBudgetTotal * 0.32);
        materials = ['Stage riser cladding', 'Fabric drapes in theme silks', 'Central metallic/acrylic monogram', '4x warm LED pin spots'];
        affordableAlternative = 'Use sheer fabric drop with warm fairy light curtains instead of sculpted multi-layer plywood sets (saves ~35%)';
        break;
      case 'seating':
        estimatedCost = Math.round(decorBudgetTotal * 0.12);
        materials = ['Banquet chair covers', 'Themed chiffon tie-backs', 'Aisle carpet runner', 'Lounge poufs'];
        affordableAlternative = 'Rent standard Chiavari chairs without individual sash labor to reduce per-chair styling cost by 40%';
        break;
      case 'dining':
        estimatedCost = Math.round(decorBudgetTotal * 0.14);
        materials = ['Buffet table skirters', 'Warm food warmer lanterns', 'Printed chalkboard menu stands', 'Overhead botanical swag'];
        affordableAlternative = 'Focus styling on front greeting counter; keep rear warming trays minimal (saves ~25%)';
        break;
      case 'tables':
        estimatedCost = Math.round(decorBudgetTotal * 0.1);
        materials = ['Clay/brass mini urns', 'Floating tea-light candles', 'Organza runners', 'Table number stands'];
        affordableAlternative = 'Use potted succulents or miniature terrariums that double as guest party favors (saves 50%)';
        break;
      case 'lighting':
        estimatedCost = Math.round(decorBudgetTotal * 0.15);
        materials = ['100m fairy light web', 'Dimmer console', 'Par cans for architectural wash', 'Amber filament clusters'];
        affordableAlternative = 'Prioritize strategic warm wall uplighting and central pendant over full ceiling coverage (saves ~30%)';
        break;
      case 'outdoor':
        estimatedCost = Math.round(decorBudgetTotal * 0.1);
        materials = ['Festoon string cable', 'Bamboo pathway stakes', 'Diyas / solar garden spikes', 'Rattan seating'];
        affordableAlternative = 'Wrap existing trees with fairy lights instead of erecting freestanding poles (saves ~45%)';
        break;
      case 'complete_venue':
      default:
        estimatedCost = decorBudgetTotal;
        materials = ['Complete coordinated design package', 'On-site execution team', 'Breakdown & waste management'];
        affordableAlternative = 'Consolidate flower sourcing through a single local wholesale market coordinator';
        break;
    }

    return {
      id: `concept-${area}-${Date.now()}-${index}`,
      area,
      title: `${theme.title} — ${areaInfo.label}`,
      description: `Tailored for ${eventType} celebration with ${guestCount} guests. Harmonizes with ${theme.palette.names.slice(0, 3).join(', ')} color language.`,
      imageUrl,
      prompt,
      estimatedCost,
      materials,
      affordableAlternative,
      isFavorite: area === 'stage' || area === 'entrance',
      selectedForBudget: false,
    };
  });
}

