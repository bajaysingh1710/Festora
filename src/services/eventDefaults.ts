import {
  EventType,
  VenueType,
  BudgetCategory,
  ThemeConcept,
  Task,
  EventDetails,
  TimelineEvent,
} from '../types';

export function getEventTypeName(type: EventType): string {
  switch (type) {
    case 'wedding':
      return 'Wedding Celebration';
    case 'engagement':
      return 'Engagement & Ring Ceremony';
    case 'birthday':
      return 'Birthday Party';
    case 'anniversary':
      return 'Anniversary Gala';
    case 'college':
      return 'College Fest / Cultural Meet';
    case 'corporate':
      return 'Corporate Conference / Summit';
    case 'community':
      return 'Community Gathering / Festival';
    case 'family':
      return 'Family Function / Get-Together';
    case 'custom':
    default:
      return 'Special Celebration';
  }
}

export function getDefaultBudgetCategories(
  eventType: EventType,
  targetBudget: number = 250000,
  guestCount: number = 100
): BudgetCategory[] {
  switch (eventType) {
    case 'birthday':
      return [
        {
          id: 'venue',
          name: 'Party Venue & Space',
          iconName: 'Building',
          color: '#C96F4A',
          targetPercent: 20,
          items: [
            {
              id: 'bday-v-1',
              categoryId: 'venue',
              name: 'Hall / Party Lounge Rental',
              description: '4-hour evening hall or private garden rental',
              unitCost: Math.round(targetBudget * 0.18),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              isHomeVenueDiscounted: true,
              homeVenueCostModifier: 0,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.18),
            },
            {
              id: 'bday-v-2',
              categoryId: 'venue',
              name: 'Clean-up & Service Crew',
              description: 'Pre and post party cleanup and waste management',
              unitCost: 3500,
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: 3500,
            },
          ],
        },
        {
          id: 'catering',
          name: 'Cake, Food & Drinks',
          iconName: 'UtensilsCrossed',
          color: '#F2C66D',
          targetPercent: 35,
          items: [
            {
              id: 'bday-c-1',
              categoryId: 'catering',
              name: 'Custom Theme Birthday Cake',
              description: 'Designer 3kg tier cake with fondant toppers',
              unitCost: 4500,
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: 4500,
            },
            {
              id: 'bday-c-2',
              categoryId: 'catering',
              name: 'Buffet & Live Snack Counters',
              description: 'Starters, mocktail bar, dinner buffet & desserts',
              unitCost: Math.round((targetBudget * 0.3) / Math.max(20, guestCount)),
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.3),
            },
          ],
        },
        {
          id: 'decor',
          name: 'Theme Backdrop & Balloons',
          iconName: 'Sparkles',
          color: '#A9B89A',
          targetPercent: 20,
          items: [
            {
              id: 'bday-d-1',
              categoryId: 'decor',
              name: 'Main Stage & Photo-Booth Backdrop',
              description: 'Balloon arches, neon signage, custom character/glam cutouts',
              unitCost: Math.round(targetBudget * 0.14),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.14),
            },
            {
              id: 'bday-d-2',
              categoryId: 'decor',
              name: 'Table Centerpieces & Ceiling Balloons',
              description: 'Helium bouquets and curated table setups',
              unitCost: 450,
              quantity: Math.max(5, Math.round(guestCount / 6)),
              isGuestDependent: true,
              guestMultiplier: 0.16,
              committedAmount: 0,
              estimatedTotal: Math.round(guestCount * 75),
            },
          ],
        },
        {
          id: 'entertainment',
          name: 'DJ, Magic & Activities',
          iconName: 'Sparkles',
          color: '#D9A948',
          targetPercent: 12,
          items: [
            {
              id: 'bday-e-1',
              categoryId: 'entertainment',
              name: 'Party Emcee & Magician / Game Host',
              description: 'Interactive party games, music and dance coordination',
              unitCost: Math.round(targetBudget * 0.08),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.08),
            },
            {
              id: 'bday-e-2',
              categoryId: 'entertainment',
              name: 'Sound System & Party Lighting',
              description: 'Pioneer DJ console, dual PA speakers, party strobe lights',
              unitCost: 6500,
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: 6500,
            },
          ],
        },
        {
          id: 'gifts',
          name: 'Return Gifts & Hampers',
          iconName: 'Gift',
          color: '#F5D1BD',
          targetPercent: 8,
          items: [
            {
              id: 'bday-g-1',
              categoryId: 'gifts',
              name: 'Personalized Favors & Goodie Bags',
              description: 'Curated gift hampers for every departing guest/family',
              unitCost: 250,
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 0.7,
              committedAmount: 0,
              estimatedTotal: Math.round(guestCount * 175),
            },
          ],
        },
        {
          id: 'photography',
          name: 'Photography & Reel Shoots',
          iconName: 'Camera',
          color: '#6E5548',
          targetPercent: 5,
          items: [
            {
              id: 'bday-p-1',
              categoryId: 'photography',
              name: 'Candid Event Photographer + Highlights',
              description: 'Full event coverage and 60-second edited celebration reel',
              unitCost: Math.round(targetBudget * 0.06),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.06),
            },
          ],
        },
      ];

    case 'college':
      return [
        {
          id: 'venue',
          name: 'Auditorium & Sound Rigging',
          iconName: 'Building',
          color: '#49372D',
          targetPercent: 30,
          items: [
            {
              id: 'col-v-1',
              categoryId: 'venue',
              name: 'Main Stage Rigging & Trussing',
              description: 'Heavy duty aluminium box truss, concert lighting & stage deck',
              unitCost: Math.round(targetBudget * 0.22),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.22),
            },
            {
              id: 'col-v-2',
              categoryId: 'venue',
              name: 'Power Backup & 125kVA Generators',
              description: 'Uninterrupted power supply for concert line arrays',
              unitCost: 18000,
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: 18000,
            },
          ],
        },
        {
          id: 'entertainment',
          name: 'Celebrity Artists & Pro Audio',
          iconName: 'Sparkles',
          color: '#C96F4A',
          targetPercent: 35,
          items: [
            {
              id: 'col-e-1',
              categoryId: 'entertainment',
              name: 'Headliner Band / EDM Artist',
              description: 'Performance rider, travel, and artist booking fee',
              unitCost: Math.round(targetBudget * 0.3),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.3),
            },
            {
              id: 'col-e-2',
              categoryId: 'entertainment',
              name: 'JBL Line Array Sound & Digital Console',
              description: 'Concert-grade sound engineer with side fills & subwoofers',
              unitCost: 35000,
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: 35000,
            },
          ],
        },
        {
          id: 'catering',
          name: 'Food Court & Refreshments',
          iconName: 'UtensilsCrossed',
          color: '#F2C66D',
          targetPercent: 15,
          items: [
            {
              id: 'col-c-1',
              categoryId: 'catering',
              name: 'Participant Refreshment Boxes & Energy Drinks',
              description: 'High-energy snacks and mineral water for delegates',
              unitCost: 120,
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: guestCount * 120,
            },
          ],
        },
        {
          id: 'invitations',
          name: 'Publicity, Passes & RFID Wristbands',
          iconName: 'QrCode',
          color: '#A9B89A',
          targetPercent: 10,
          items: [
            {
              id: 'col-i-1',
              categoryId: 'invitations',
              name: 'Waterproof QR Wristbands & ID Cards',
              description: 'Barcode/QR credential entry tags for fraud prevention',
              unitCost: 30,
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: guestCount * 30,
            },
          ],
        },
        {
          id: 'contingency',
          name: 'Security, Medical & Emergency Buffer',
          iconName: 'ShieldAlert',
          color: '#E06D53',
          targetPercent: 10,
          items: [
            {
              id: 'col-s-1',
              categoryId: 'contingency',
              name: 'Bouncers, Barricades & First Aid Station',
              description: 'Security squad, crowd management barricades & paramedic team',
              unitCost: 22000,
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: 22000,
            },
          ],
        },
      ];

    case 'corporate':
      return [
        {
          id: 'venue',
          name: 'Convention Center & AV Rig',
          iconName: 'Building',
          color: '#49372D',
          targetPercent: 35,
          items: [
            {
              id: 'corp-v-1',
              categoryId: 'venue',
              name: 'Hotel Convention Hall & Breakout Rooms',
              description: 'Full day hall booking with podium, staging and high-speed Wi-Fi',
              unitCost: Math.round(targetBudget * 0.3),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.3),
            },
          ],
        },
        {
          id: 'catering',
          name: 'Executive Lunch & High-Tea',
          iconName: 'UtensilsCrossed',
          color: '#F2C66D',
          targetPercent: 30,
          items: [
            {
              id: 'corp-c-1',
              categoryId: 'catering',
              name: 'Gourmet 3-Course Buffet + 2 High-Tea Breaks',
              description: 'Executive continental and Indian spread with live coffee bar',
              unitCost: Math.round((targetBudget * 0.28) / Math.max(30, guestCount)),
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.28),
            },
          ],
        },
        {
          id: 'decor',
          name: 'Stage Backdrop & Tech Displays',
          iconName: 'Sparkles',
          color: '#A9B89A',
          targetPercent: 15,
          items: [
            {
              id: 'corp-d-1',
              categoryId: 'decor',
              name: 'P3 LED Video Wall (16x9 ft) & Stage Branding',
              description: 'Seamless presentation LED wall, speaker backdrop & step-and-repeat',
              unitCost: Math.round(targetBudget * 0.12),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.12),
            },
          ],
        },
        {
          id: 'gifts',
          name: 'Delegate Kits & Welcome Hampers',
          iconName: 'Gift',
          color: '#C96F4A',
          targetPercent: 12,
          items: [
            {
              id: 'corp-g-1',
              categoryId: 'gifts',
              name: 'Branded Notebook, Steel Sipper & Tech Organizer',
              description: 'Premium welcome kit for registered attendees',
              unitCost: 550,
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: guestCount * 550,
            },
          ],
        },
        {
          id: 'contingency',
          name: 'Contingency & Incidentals',
          iconName: 'ShieldAlert',
          color: '#6E5548',
          targetPercent: 8,
          items: [
            {
              id: 'corp-x-1',
              categoryId: 'contingency',
              name: 'Emergency Reserve',
              description: 'Buffer for overtime tech support, extra delegates and transport',
              unitCost: Math.round(targetBudget * 0.08),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.08),
            },
          ],
        },
      ];

    case 'wedding':
    case 'engagement':
    case 'anniversary':
    case 'community':
    case 'family':
    case 'custom':
    default:
      return [
        {
          id: 'venue',
          name: 'Venue & Infrastructure',
          iconName: 'Building',
          color: '#C96F4A',
          targetPercent: 25,
          items: [
            {
              id: 'gen-v-1',
              categoryId: 'venue',
              name: 'Celebration Hall / Lawns Rental',
              description: 'Grand event hall and outdoor patio booking',
              unitCost: Math.round(targetBudget * 0.22),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              isHomeVenueDiscounted: true,
              homeVenueCostModifier: 0,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.22),
            },
          ],
        },
        {
          id: 'catering',
          name: 'Food & Royal Catering',
          iconName: 'UtensilsCrossed',
          color: '#F2C66D',
          targetPercent: 35,
          items: [
            {
              id: 'gen-c-1',
              categoryId: 'catering',
              name: 'Multi-Cuisine Festive Feast',
              description: 'Welcome drinks, live chaat & pasta counters, royal main course, 4 desserts',
              unitCost: Math.max(450, Math.round((targetBudget * 0.32) / Math.max(30, guestCount))),
              quantity: guestCount,
              isGuestDependent: true,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.32),
            },
          ],
        },
        {
          id: 'decor',
          name: 'Theme Ambience & Florals',
          iconName: 'Sparkles',
          color: '#A9B89A',
          targetPercent: 20,
          items: [
            {
              id: 'gen-d-1',
              categoryId: 'decor',
              name: 'Stage Focal Setting & Floral Mandap / Arch',
              description: 'Artisanal backdrop with hanging florals, fairy lights, and vintage urns',
              unitCost: Math.round(targetBudget * 0.16),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.16),
            },
          ],
        },
        {
          id: 'photography',
          name: 'Photography & Cinema',
          iconName: 'Camera',
          color: '#6E5548',
          targetPercent: 10,
          items: [
            {
              id: 'gen-p-1',
              categoryId: 'photography',
              name: 'Candid Photo & Cinematic Video Team',
              description: '2 photographers, 1 drone videographer, online gallery & photobook',
              unitCost: Math.round(targetBudget * 0.09),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.09),
            },
          ],
        },
        {
          id: 'gifts',
          name: 'Favors & Return Gifts',
          iconName: 'Gift',
          color: '#F5D1BD',
          targetPercent: 6,
          items: [
            {
              id: 'gen-g-1',
              categoryId: 'gifts',
              name: 'Artisan Keepsake Favors',
              description: 'Handcrafted bell metal / brass keepsake with gourmet dry fruits',
              unitCost: 350,
              quantity: Math.max(20, Math.round(guestCount * 0.6)),
              isGuestDependent: true,
              guestMultiplier: 0.6,
              committedAmount: 0,
              estimatedTotal: Math.round(guestCount * 210),
            },
          ],
        },
        {
          id: 'contingency',
          name: 'Contingency & Logistics',
          iconName: 'ShieldAlert',
          color: '#D9A948',
          targetPercent: 4,
          items: [
            {
              id: 'gen-k-1',
              categoryId: 'contingency',
              name: 'Emergency Buffer Reserve',
              description: 'Flexibility fund for unexpected guest party expansion or timing extensions',
              unitCost: Math.round(targetBudget * 0.04),
              quantity: 1,
              isGuestDependent: false,
              guestMultiplier: 1,
              committedAmount: 0,
              estimatedTotal: Math.round(targetBudget * 0.04),
            },
          ],
        },
      ];
  }
}

export function getDefaultThemesForEventType(eventType: EventType): ThemeConcept[] {
  switch (eventType) {
    case 'birthday':
      return [
        {
          id: 'theme-bday-carnival',
          title: 'Golden Carnival & Pastel Confetti',
          tagline: 'Vibrant joyful celebration with sunny warmth and whimsical touches',
          description: 'Designed for high energy celebrations with bright balloon installations, organic pastel streamers, and warm fairy lights.',
          palette: {
            primary: '#F2C66D',
            secondary: '#C96F4A',
            accent: '#E06D53',
            background: '#FFF8EF',
            text: '#49372D',
            names: ['Sunlit Honey', 'Terracotta Pop', 'Berry Blush', 'Vanilla Cream', 'Deep Cocoa'],
          },
          suitableEventTypes: ['birthday', 'family', 'community'],
          vibeKeywords: ['Playful', 'Joyful', 'Golden Glow', 'Vibrant'],
          venueBriefs: {
            function_hall: 'Create an immersive party entrance with double balloon arches. Cluster neon marquee numbers at the stage.',
            home_courtyard: 'Hang paper lanterns and warm festoon bulbs across courtyard boughs. Decorate cake table with fresh greenery.',
          },
          decorElements: ['Balloon garlands in organic clusters', 'Custom acrylic neon name signage', 'Photo-booth with props', 'Themed cupcake display tier'],
          costTier: 'balanced',
          costSavingTips: ['Use helium-free air-filled balloon garlands instead of full ceiling helium', 'Print photo cutouts on foam-board locally'],
        },
        {
          id: 'theme-bday-starry',
          title: 'Midnight Stardust & Warm Amber',
          tagline: 'Chic, modern evening glamour with celestial sparkle',
          description: 'Deep navy and shimmering gold accents paired with warm amber filament bulbs for a sophisticated milestone birthday.',
          palette: {
            primary: '#1E293B',
            secondary: '#D9A948',
            accent: '#F5D1BD',
            background: '#0F172A',
            text: '#F8FAFC',
            names: ['Midnight Navy', 'Stardust Gold', 'Soft Champagne', 'Deep Cosmic', 'Warm White'],
          },
          suitableEventTypes: ['birthday', 'anniversary', 'corporate'],
          vibeKeywords: ['Glamorous', 'Modern', 'Starry', 'Milestone'],
          venueBriefs: {
            function_hall: 'Dim ambient hall lights and highlight table centerpieces with amber pin-spots. Project starry ceiling gobos.',
            home_courtyard: 'Drape cascading fairy lights along courtyard perimeter walls to form a shimmering starlight curtain.',
          },
          decorElements: ['Golden star chandeliers', 'Fairy light waterfall backdrop', 'Mirrored cake pedestal', 'Amber filament cluster pendants'],
          costTier: 'luxury',
          costSavingTips: ['Rent LED light curtains instead of custom carpentry backdrops', 'Use metallic gold spray paint on reusable clay vases'],
        },
      ];

    case 'college':
      return [
        {
          id: 'theme-college-cyberpunk',
          title: 'Neon Pulse & Cyber Wave',
          tagline: 'High-voltage electric beats, vibrant UV gradients, and futuristic festival energy',
          description: 'Electric cyan, neon pink, and industrial metallic accents optimized for youth fests, rock shows, and DJ nights.',
          palette: {
            primary: '#06B6D4',
            secondary: '#EC4899',
            accent: '#8B5CF6',
            background: '#0B0F19',
            text: '#F1F5F9',
            names: ['Cyan Pulse', 'Electric Magenta', 'Ultraviolet', 'Abyss Black', 'Silver White'],
          },
          suitableEventTypes: ['college', 'community'],
          vibeKeywords: ['High-Energy', 'Electrifying', 'Youthful', 'Concert'],
          venueBriefs: {
            function_hall: 'Equip stage with moving head beam lights and fog hazers to amplify beam visibility across the crowd.',
            home_courtyard: 'Set up blacklight glow zones with UV reactive tape art and laser projections on open surfaces.',
          },
          decorElements: ['UV reactive graffiti photo-wall', 'Truss-mounted neon strip lights', 'Heavy haze machines', 'LED wristband glow activation'],
          costTier: 'budget_friendly',
          costSavingTips: ['Engage student design clubs for live graffiti murals', 'Use digital projection mapping rather than heavy physical sets'],
        },
      ];

    case 'corporate':
      return [
        {
          id: 'theme-corp-summit',
          title: 'Minimalist Titanium & Sage Prestige',
          tagline: 'Refined executive aesthetics, clean lines, and purposeful sustainable materials',
          description: 'Warm slate grey, organic sage green, and brushed brass details tailored for summits, product launches, and gala dinners.',
          palette: {
            primary: '#334155',
            secondary: '#A9B89A',
            accent: '#F2C66D',
            background: '#F8FAFC',
            text: '#1E293B',
            names: ['Titanium Slate', 'Earthy Sage', 'Brushed Brass', 'Ivory Mist', 'Graphite'],
          },
          suitableEventTypes: ['corporate', 'community'],
          vibeKeywords: ['Executive', 'Sustainable', 'Polished', 'Modern'],
          venueBriefs: {
            function_hall: 'Keep stage clean with an ultra-wide 16:9 LED display and potted live foliage along the speaker riser.',
            home_courtyard: 'Set up acoustic discussion pods with linen covered circular tables and living plant dividers.',
          },
          decorElements: ['Living green wall photo-opportunity', 'Brushed brass directional signage', 'Bamboo lanyard registration desk', 'Warm architectural downlights'],
          costTier: 'balanced',
          costSavingTips: ['Rent living potted ficus and palms rather than single-use cut floral installations'],
        },
      ];

    case 'wedding':
    case 'engagement':
    case 'anniversary':
    case 'community':
    case 'family':
    case 'custom':
    default:
      return [
        {
          id: 'theme-sunset-terracotta',
          title: 'Sunset Terracotta & Royal Ochre',
          tagline: 'Earthen luxury, antique brass, and the soul of intimate festivities',
          description: 'Warm terracotta tones infused with golden ochre, marigold clusters, and gentle flickering candlelight.',
          palette: {
            primary: '#C96F4A',
            secondary: '#D9A948',
            accent: '#F5D1BD',
            background: '#FFF8EF',
            text: '#49372D',
            names: ['Sunset Terracotta', 'Royal Ochre', 'Blush Peach', 'Warm Cream', 'Deep Umber'],
          },
          suitableEventTypes: ['wedding', 'engagement', 'anniversary', 'family', 'custom'],
          vibeKeywords: ['Regal', 'Intimate', 'Warm', 'Earthy'],
          venueBriefs: {
            function_hall: 'Use cascading brass urlis filled with floating petals along the grand entryway. Hang marigold drapery on stage.',
            home_courtyard: 'Line the courtyard steps with terracotta diyas and brass lamps. Drape sheer ivory drapes across terrace railings.',
          },
          decorElements: ['Hand-thrown terracotta urns', 'Deep marigold floral strings', 'Antique brass urlis with floating candles', 'Handloom fabric canopy drapes'],
          costTier: 'balanced',
          costSavingTips: ['Source marigolds from local wholesale markets', 'Use terracotta planters that guests or family can take home afterward'],
        },
        {
          id: 'theme-botanical-chic',
          title: 'Sage & Mogra Botanical Chic',
          tagline: 'Fresh organic romance with fragrant jasmine, lush foliage, and sheer ivory',
          description: 'A serene celebration aesthetic celebrating nature with fragrant mogra strands, eucalyptus, and airy textured fabrics.',
          palette: {
            primary: '#859675',
            secondary: '#F5F2EB',
            accent: '#D4AF37',
            background: '#FFFFFF',
            text: '#2D3728',
            names: ['Muted Sage', 'Mogra Ivory', 'Champagne Gold', 'Linen White', 'Forest Shadow'],
          },
          suitableEventTypes: ['wedding', 'engagement', 'anniversary', 'family'],
          vibeKeywords: ['Organic', 'Romantic', 'Fragrant', 'Serene'],
          venueBriefs: {
            function_hall: 'Create open garden vibes inside the ballroom with hanging jasmine chandeliers and potted lemon trees.',
            home_courtyard: 'Enchant the courtyard with strings of fresh white jasmine and gentle warm uplighting on existing trees.',
          },
          decorElements: ['Fragrant mogra curtain backdrops', 'Eucalyptus runner garlands for tables', 'White floating taper candles in glass hurricane vases'],
          costTier: 'luxury',
          costSavingTips: ['Mix seasonal local foliage with scented blooms to reduce reliance on imported florals'],
        },
      ];
  }
}

export function getDefaultTasksForEventType(eventType: EventType, eventDate: string): Task[] {
  const deadlineDays = (daysBefore: number) => {
    try {
      const d = new Date(eventDate || new Date().toISOString().split('T')[0]);
      d.setDate(d.getDate() - daysBefore);
      return d.toISOString().split('T')[0];
    } catch {
      return eventDate;
    }
  };

  switch (eventType) {
    case 'birthday':
      return [
        {
          id: 'tsk-bday-1',
          title: 'Finalize Party Theme & Cake Design',
          category: 'Styling',
          deadline: deadlineDays(14),
          assignedTo: 'Host',
          priority: 'critical',
          isCompleted: false,
        },
        {
          id: 'tsk-bday-2',
          title: 'Book Birthday Venue & Confirm Sound/AV',
          category: 'Venue',
          deadline: deadlineDays(21),
          assignedTo: 'Lead Organizer',
          priority: 'critical',
          isCompleted: true,
          completedAt: new Date().toISOString(),
        },
        {
          id: 'tsk-bday-3',
          title: 'Dispatch Digital Invitations & Track RSVPs',
          category: 'Guests',
          deadline: deadlineDays(10),
          assignedTo: 'Host',
          priority: 'high',
          isCompleted: false,
        },
        {
          id: 'tsk-bday-4',
          title: 'Purchase Return Gifts & Pack Favor Bags',
          category: 'Logistics',
          deadline: deadlineDays(4),
          assignedTo: 'Coordinator',
          priority: 'medium',
          isCompleted: false,
        },
        {
          id: 'tsk-bday-5',
          title: 'Confirm Magician / Game Host & Playlist',
          category: 'Entertainment',
          deadline: deadlineDays(3),
          assignedTo: 'Host',
          priority: 'high',
          isCompleted: false,
        },
      ];

    case 'college':
      return [
        {
          id: 'tsk-col-1',
          title: 'Obtain Campus Dean & Police Permissions',
          category: 'Permissions',
          deadline: deadlineDays(30),
          assignedTo: 'Faculty Advisor',
          priority: 'critical',
          isCompleted: true,
          completedAt: new Date().toISOString(),
        },
        {
          id: 'tsk-col-2',
          title: 'Sign Contract with Sound & Stage Rigging Vendor',
          category: 'Infrastructure',
          deadline: deadlineDays(20),
          assignedTo: 'Tech Lead',
          priority: 'critical',
          isCompleted: false,
        },
        {
          id: 'tsk-col-3',
          title: 'Launch Online Fest Registration & QR Passes',
          category: 'Publicity',
          deadline: deadlineDays(15),
          assignedTo: 'Publicity Committee',
          priority: 'high',
          isCompleted: false,
        },
        {
          id: 'tsk-col-4',
          title: 'Deploy Crowd Control Barricades & Bouncers',
          category: 'Security',
          deadline: deadlineDays(2),
          assignedTo: 'Security Lead',
          priority: 'critical',
          isCompleted: false,
        },
      ];

    default:
      return [
        {
          id: 'tsk-gen-1',
          title: 'Review Catering Menu & Finalize Plate Headcount',
          category: 'Catering',
          deadline: deadlineDays(7),
          assignedTo: 'Lead Organizer',
          priority: 'critical',
          isCompleted: false,
        },
        {
          id: 'tsk-gen-2',
          title: 'Approve Theme & Stage Decoration Layout',
          category: 'Decor',
          deadline: deadlineDays(14),
          assignedTo: 'Host',
          priority: 'high',
          isCompleted: false,
        },
        {
          id: 'tsk-gen-3',
          title: 'Send Digital Passes to Confirmed RSVPs',
          category: 'Invitations',
          deadline: deadlineDays(5),
          assignedTo: 'Coordinator',
          priority: 'high',
          isCompleted: false,
        },
        {
          id: 'tsk-gen-4',
          title: 'Prepare Keepsake Return Gifts for Attending Parties',
          category: 'Gifts',
          deadline: deadlineDays(3),
          assignedTo: 'Family Member',
          priority: 'medium',
          isCompleted: false,
        },
      ];
  }
}

export function getDefaultEventSchedule(eventType: EventType): TimelineEvent[] {
  switch (eventType) {
    case 'birthday':
      return [
        { id: 'sch-1', time: '04:00 PM', title: 'Vendor Arrival & Sound Check', location: 'Main Hall', coordinator: 'Venue Manager', isCompleted: true },
        { id: 'sch-2', time: '05:30 PM', title: 'Guest Arrival, Welcome Drinks & Photobooth', location: 'Foyer Entrance', coordinator: 'Host Squad', isCompleted: false },
        { id: 'sch-3', time: '06:30 PM', title: 'Interactive Party Games & Magic Show', location: 'Activity Zone', coordinator: 'Emcee', isCompleted: false },
        { id: 'sch-4', time: '07:30 PM', title: 'Grand Cake Cutting & Birthday Toast', location: 'Center Stage', coordinator: 'Parents & Host', isCompleted: false },
        { id: 'sch-5', time: '08:00 PM', title: 'Gourmet Dinner Buffet Opens', location: 'Dining Pavilion', coordinator: 'Catering Lead', isCompleted: false },
        { id: 'sch-6', time: '09:30 PM', title: 'Return Gift Distribution & Farewell', location: 'Exit Lounge', coordinator: 'Coordinator', isCompleted: false },
      ];
    case 'corporate':
      return [
        { id: 'sch-1', time: '08:30 AM', title: 'Delegate Registration & Breakfast Networking', location: 'Lobby', coordinator: 'Registration Desk', isCompleted: true },
        { id: 'sch-2', time: '09:30 AM', title: 'Keynote Address & Opening Remarks', location: 'Main Auditorium', coordinator: 'Program Chair', isCompleted: false },
        { id: 'sch-3', time: '11:00 AM', title: 'Executive Panel Discussion & Q&A', location: 'Main Auditorium', coordinator: 'Moderator', isCompleted: false },
        { id: 'sch-4', time: '01:00 PM', title: 'Business Lunch & Networking Break', location: 'Dining Hall', coordinator: 'Hospitality Lead', isCompleted: false },
        { id: 'sch-5', time: '02:30 PM', title: 'Breakout Workshops & Innovation Tracks', location: 'Conference Rooms A & B', coordinator: 'Track Leads', isCompleted: false },
        { id: 'sch-6', time: '04:30 PM', title: 'Closing Ceremonies & Delegate Hampers', location: 'Main Auditorium', coordinator: 'Organizing Committee', isCompleted: false },
      ];
    case 'college':
      return [
        { id: 'sch-1', time: '09:00 AM', title: 'Campus Gate Security & QR Pass Verification', location: 'Gate 1 & Gate 2', coordinator: 'Security Team', isCompleted: true },
        { id: 'sch-2', time: '10:30 AM', title: 'Inauguration & Battle of the Bands Prelims', location: 'Open Air Theatre', coordinator: 'Cultural Secretary', isCompleted: false },
        { id: 'sch-3', time: '01:00 PM', title: 'Food Truck Alley & Carnival Stalls', location: 'Quadrangle', coordinator: 'Student Council', isCompleted: false },
        { id: 'sch-4', time: '03:30 PM', title: 'Inter-College Choreography Showcase', location: 'Auditorium', coordinator: 'Stage Lead', isCompleted: false },
        { id: 'sch-5', time: '06:00 PM', title: 'Celebrity Pro-Night / Live Concert', location: 'Stadium Ground', coordinator: 'Core Fest Team', isCompleted: false },
        { id: 'sch-6', time: '09:30 PM', title: 'Dispersal & Crowd Control Clearance', location: 'All Exits', coordinator: 'Safety Marshals', isCompleted: false },
      ];
    case 'wedding':
    case 'engagement':
    case 'anniversary':
    default:
      return [
        { id: 'sch-1', time: '09:00 AM', title: 'Mandap / Stage Floral Rigging & Decor Prep', location: 'Ceremony Stage', coordinator: 'Florist Lead', isCompleted: true },
        { id: 'sch-2', time: '11:00 AM', title: 'Guest Welcome, Shehnai / Live Strings & Refreshments', location: 'Grand Entrance', coordinator: 'Family Welcoming Team', isCompleted: false },
        { id: 'sch-3', time: '12:00 PM', title: 'Main Auspicious Ceremony & Ring Exchange', location: 'Sacred Mandap', coordinator: 'Ceremony Director', isCompleted: false },
        { id: 'sch-4', time: '01:30 PM', title: 'Royal Wedding Feast & Live Counters', location: 'Dining Pavilion', coordinator: 'Catering Lead', isCompleted: false },
        { id: 'sch-5', time: '03:30 PM', title: 'Family Blessings, Portrait Sessions & Group Photos', location: 'Photobooth & Stage', coordinator: 'Lead Photographer', isCompleted: false },
        { id: 'sch-6', time: '05:00 PM', title: 'Sweets & Keepsake Return Favor Handover', location: 'Exit Canopy', coordinator: 'Hospitality Lead', isCompleted: false },
      ];
  }
}

