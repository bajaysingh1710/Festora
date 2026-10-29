import { EventDetails, Guest, BudgetCategory, ThemeConcept, Task } from '../types';

export const SEED_EVENT: EventDetails = {
  id: 'event-aanya-kabir-2026',
  title: "Aanya & Kabir's Sangeet & Engagement Celebration",
  tagline: 'An evening of royal melodies, warm terracotta lights, and lifelong promises',
  eventType: 'engagement',
  date: '2026-11-28',
  time: '18:30',
  venue: {
    name: 'The Courtyard Pavilion & Heritage Lawns',
    type: 'function_hall',
    address: '42 Palace Orchards, Heritage Boulevard',
    city: 'Bengaluru',
    capacity: 220,
    directionsUrl: 'https://maps.google.com/?q=The+Courtyard+Pavilion+Bengaluru',
    notes: 'Valet parking available at North Gate. Main ballroom connects to open lawns.'
  },
  targetGuestCount: 150,
  targetBudget: 850000,
  activeThemeId: 'theme-terracotta-sunset',
  dressCode: 'Indo-Western Festive in Terracotta, Ochre, and Sage Silks',
  story: 'From college library debates to shared sunrise hikes across the Western Ghats, celebrate with us as we make our promises under the banyan canopy.',
  organizer: {
    name: 'Aanya Sharma & Kabir Mehra',
    email: 'celebration@festora.in',
    phone: '+91 98765 43210',
    role: 'Couple / Hosts'
  },
  cateringPlateBuffer: 15,
  returnGiftBuffer: 10,
  createdAt: '2026-05-10T10:00:00.000Z',
  updatedAt: '2026-10-24T18:00:00.000Z'
};

export const SEED_GUESTS: Guest[] = [
  {
    id: 'g-101',
    guestCode: 'FEST-AK-101',
    name: 'Rajesh & Sunita Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98450 11223',
    category: 'family',
    partySize: 4,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'Table Royal 1',
    dietaryNotes: 'Elderly dietary: low salt',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'checked_in',
    checkedInAt: '2026-11-28T18:45:00Z',
    checkedInBy: 'Pooja (Host)'
  },
  {
    id: 'g-102',
    guestCode: 'FEST-AK-102',
    name: 'Vikram & Preeti Mehra',
    email: 'vikram.mehra@example.com',
    phone: '+91 98450 33445',
    category: 'family',
    partySize: 3,
    rsvpStatus: 'attending',
    mealPreference: 'non_vegetarian',
    tableNumber: 'Table Royal 1',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-103',
    guestCode: 'FEST-AK-103',
    name: 'Dr. Harish & Shanti Vyas',
    email: 'harish.vyas@example.com',
    phone: '+91 98450 55667',
    category: 'vip',
    partySize: 2,
    rsvpStatus: 'attending',
    mealPreference: 'jain',
    tableNumber: 'VIP Emerald',
    dietaryNotes: 'Strict Jain preparation',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-104',
    guestCode: 'FEST-AK-104',
    name: 'Rohan Desai & Partner',
    email: 'rohan.desai@example.com',
    phone: '+91 98450 77889',
    category: 'close_friends',
    partySize: 2,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'Table Sangeet Stars',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'checked_in',
    checkedInAt: '2026-11-28T18:52:00Z',
    checkedInBy: 'Terminal 1'
  },
  {
    id: 'g-105',
    guestCode: 'FEST-AK-105',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 98450 99001',
    category: 'close_friends',
    partySize: 1,
    rsvpStatus: 'attending',
    mealPreference: 'non_vegetarian',
    tableNumber: 'Table Sangeet Stars',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-106',
    guestCode: 'FEST-AK-106',
    name: 'Siddharth Mehta',
    email: 'siddharth.mehta@example.com',
    phone: '+91 98451 22334',
    category: 'colleagues',
    partySize: 2,
    rsvpStatus: 'pending',
    mealPreference: 'vegetarian',
    invitationSent: true,
    invitationSentAt: '2026-10-16T11:00:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-107',
    guestCode: 'FEST-AK-107',
    name: 'Kunal Kapoor & Family',
    email: 'kunal.kapoor@example.com',
    phone: '+91 98451 44556',
    category: 'close_friends',
    partySize: 4,
    rsvpStatus: 'pending',
    mealPreference: 'non_vegetarian',
    invitationSent: true,
    invitationSentAt: '2026-10-16T11:00:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-108',
    guestCode: 'FEST-AK-108',
    name: 'Smt. Leela Sen',
    email: 'leela.sen@example.com',
    phone: '+91 98451 66778',
    category: 'vip',
    partySize: 2,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'VIP Emerald',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-109',
    guestCode: 'FEST-AK-109',
    name: 'Pooja & Sameer Nair',
    email: 'pooja.nair@example.com',
    phone: '+91 98451 88990',
    category: 'colleagues',
    partySize: 2,
    rsvpStatus: 'declined',
    mealPreference: 'vegetarian',
    dietaryNotes: 'Traveling overseas for conference',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-110',
    guestCode: 'FEST-AK-110',
    name: 'Arjun & Meera Mangarath',
    email: 'arjun.m@example.com',
    phone: '+91 98452 00112',
    category: 'close_friends',
    partySize: 2,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'Table Royal 2',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-111',
    guestCode: 'FEST-AK-111',
    name: 'Tanvi & Dev Sen',
    email: 'tanvi.sen@example.com',
    phone: '+91 98452 33445',
    category: 'family',
    partySize: 3,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'Table Royal 2',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-112',
    guestCode: 'FEST-AK-112',
    name: 'Ravi & Geeta Shastri',
    email: 'ravi.shastri@example.com',
    phone: '+91 98452 55667',
    category: 'community',
    partySize: 2,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'Table Harmony',
    invitationSent: true,
    invitationSentAt: '2026-10-16T11:00:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-113',
    guestCode: 'FEST-AK-113',
    name: 'Nikhil & Simran Khurana',
    email: 'nikhil.k@example.com',
    phone: '+91 98452 77889',
    category: 'close_friends',
    partySize: 2,
    rsvpStatus: 'pending',
    mealPreference: 'non_vegetarian',
    invitationSent: false,
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-114',
    guestCode: 'FEST-AK-114',
    name: 'Alok Gupta',
    email: 'alok.gupta@example.com',
    phone: '+91 98452 99001',
    category: 'colleagues',
    partySize: 1,
    rsvpStatus: 'declined',
    mealPreference: 'vegetarian',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  },
  {
    id: 'g-115',
    guestCode: 'FEST-AK-115',
    name: 'Maya & Kabir Joshi',
    email: 'maya.j@example.com',
    phone: '+91 98453 11223',
    category: 'family',
    partySize: 3,
    rsvpStatus: 'attending',
    mealPreference: 'vegetarian',
    tableNumber: 'Table Royal 1',
    invitationSent: true,
    invitationSentAt: '2026-10-15T09:30:00Z',
    checkInStatus: 'not_checked_in'
  }
];

export const SEED_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'venue',
    name: 'Venue & Infrastructure',
    iconName: 'Building',
    color: '#C96F4A',
    targetPercent: 25,
    items: [
      {
        id: 'b-v1',
        categoryId: 'venue',
        name: 'Pavilion Ballroom & Lawns Rental',
        description: 'Exclusive 8-hour access including green rooms and valet parking',
        unitCost: 175000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        isHomeVenueDiscounted: true,
        homeVenueCostModifier: 0, // Free if hosted at home!
        committedAmount: 50000,
        estimatedTotal: 175000
      },
      {
        id: 'b-v2',
        categoryId: 'venue',
        name: 'Acoustic Sound & Stage Rigging',
        description: 'Wireless microphones, monitor speakers, and Sangeet sound engineer',
        unitCost: 28000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        isHomeVenueDiscounted: true,
        homeVenueCostModifier: 0.6,
        committedAmount: 10000,
        estimatedTotal: 28000
      },
      {
        id: 'b-v3',
        categoryId: 'venue',
        name: 'Generator Backup & Facility Cleanup',
        description: 'Continuous power backup & housekeeping squad throughout event',
        unitCost: 15000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 5000,
        estimatedTotal: 15000
      }
    ]
  },
  {
    id: 'catering',
    name: 'Food & Catering',
    iconName: 'UtensilsCrossed',
    color: '#F2C66D',
    targetPercent: 35,
    items: [
      {
        id: 'b-c1',
        categoryId: 'catering',
        name: 'Multi-Cuisine Royal Buffet Dinner',
        description: '4 starters, 3 live chaat counters, 8 mains, breads, and pulao',
        unitCost: 1200,
        quantity: 150, // Scales with guest count
        isGuestDependent: true,
        guestMultiplier: 1.0,
        committedAmount: 60000,
        estimatedTotal: 180000
      },
      {
        id: 'b-c2',
        categoryId: 'catering',
        name: 'Artisan Mocktail & Grazing Counter',
        description: 'Botanical infused spritzers, fresh fruit coolers, artisanal mezze',
        unitCost: 250,
        quantity: 150, // Scales with guest count
        isGuestDependent: true,
        guestMultiplier: 1.0,
        committedAmount: 15000,
        estimatedTotal: 37500
      },
      {
        id: 'b-c3',
        categoryId: 'catering',
        name: 'Heritage Dessert & Warm Jalebi Studio',
        description: 'Rabdi jalebi, kulfi falooda, baked rasgulla & artisan confectionery',
        unitCost: 220,
        quantity: 150, // Scales with guest count
        isGuestDependent: true,
        guestMultiplier: 1.0,
        committedAmount: 10000,
        estimatedTotal: 33000
      }
    ]
  },
  {
    id: 'decor',
    name: 'Decoration & Ambience',
    iconName: 'Sparkles',
    color: '#A9B89A',
    targetPercent: 18,
    items: [
      {
        id: 'b-d1',
        categoryId: 'decor',
        name: 'Terracotta & Marigold Stage Backdrop',
        description: 'Handcrafted brass bells, marigold hangings, and terracotta urns',
        unitCost: 75000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        isHomeVenueDiscounted: true,
        homeVenueCostModifier: 0.5,
        committedAmount: 25000,
        estimatedTotal: 75000
      },
      {
        id: 'b-d2',
        categoryId: 'decor',
        name: 'Fairy Light Pathway & Banyan Canopy',
        description: 'Warm 2700K fairy string canopy, Moroccan candle lanterns',
        unitCost: 40000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        isHomeVenueDiscounted: true,
        homeVenueCostModifier: 0.7,
        committedAmount: 15000,
        estimatedTotal: 40000
      },
      {
        id: 'b-d3',
        categoryId: 'decor',
        name: 'Guest Table Floral Centerpieces',
        description: 'Earthen brass bowls with floating rose petals and taper candles',
        unitCost: 700,
        quantity: 20, // ~1 table per 7-8 guests
        isGuestDependent: true,
        guestMultiplier: 0.133,
        committedAmount: 5000,
        estimatedTotal: 14000
      }
    ]
  },
  {
    id: 'photography',
    name: 'Photography & Cinema',
    iconName: 'Camera',
    color: '#E28E6C',
    targetPercent: 10,
    items: [
      {
        id: 'b-p1',
        categoryId: 'photography',
        name: 'Senior Candid Photographers (Dual Lead)',
        description: 'Full event documentary coverage, high-res edited gallery',
        unitCost: 55000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 20000,
        estimatedTotal: 55000
      },
      {
        id: 'b-p2',
        categoryId: 'photography',
        name: 'Cinematic 4K Sangeet Teaser & Reel Edit',
        description: 'Same-day 60s Instagram reel + 4-minute cinematic highlights film',
        unitCost: 35000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 15000,
        estimatedTotal: 35000
      }
    ]
  },
  {
    id: 'styling',
    name: 'Clothing & Styling',
    iconName: 'Shirt',
    color: '#F5D1BD',
    targetPercent: 6,
    items: [
      {
        id: 'b-s1',
        categoryId: 'styling',
        name: 'Custom Couple Ensembles & Accessories',
        description: 'Custom designer terracotta lehenga & sage raw-silk sherwani',
        unitCost: 48000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 30000,
        estimatedTotal: 48000
      },
      {
        id: 'b-s2',
        categoryId: 'styling',
        name: 'Bridal & Family Hair / Makeup Squad',
        description: 'HD party makeup for bride, mothers, and sisters',
        unitCost: 22000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 8000,
        estimatedTotal: 22000
      }
    ]
  },
  {
    id: 'invitations',
    name: 'Invitations & GuestPass',
    iconName: 'QrCode',
    color: '#859675',
    targetPercent: 4,
    items: [
      {
        id: 'b-i1',
        categoryId: 'invitations',
        name: 'Digital Interactive GuestPass Platform',
        description: 'Custom domain RSVP portal, WhatsApp invitations & QR passes',
        unitCost: 80,
        quantity: 150,
        isGuestDependent: true,
        guestMultiplier: 1.0,
        committedAmount: 8000,
        estimatedTotal: 12000
      },
      {
        id: 'b-i2',
        categoryId: 'invitations',
        name: 'Artisanal Brass Keepsake Return Favors',
        description: 'Hand-carved brass diya boxes with organic cardamom tea blend',
        unitCost: 320,
        quantity: 80, // ~1 per family
        isGuestDependent: true,
        guestMultiplier: 0.55,
        committedAmount: 12000,
        estimatedTotal: 25600
      }
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Logistics',
    iconName: 'Car',
    color: '#49372D',
    targetPercent: 2,
    items: [
      {
        id: 'b-t1',
        categoryId: 'transport',
        name: 'VIP & Elderly Shuttles (2 Vans)',
        description: 'Airport & hotel transfers for out-of-town elders',
        unitCost: 16000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 5000,
        estimatedTotal: 16000
      },
      {
        id: 'b-t2',
        categoryId: 'transport',
        name: 'Event Contingency & License Approvals',
        description: 'Music permits, green room refreshments & immediate contingency',
        unitCost: 20000,
        quantity: 1,
        isGuestDependent: false,
        guestMultiplier: 1,
        committedAmount: 5000,
        estimatedTotal: 20000
      }
    ]
  }
];

export const SEED_THEMES: ThemeConcept[] = [
  {
    id: 'theme-terracotta-sunset',
    title: 'Sunset Terracotta & Royal Ochre',
    tagline: 'Warm earthen luxury steeped in heritage, candlelight, and glowing marigolds',
    description: 'A celebration grounded in natural terracotta, antique brass, and glowing ochre lanterns. Intimate, regal, and deeply photogenic.',
    palette: {
      primary: '#C96F4A',
      secondary: '#F2C66D',
      accent: '#A9B89A',
      background: '#FFF8EF',
      text: '#49372D',
      names: ['Terracotta Earth', 'Royal Ochre', 'Sage Leaf', 'Almond Cream', 'Deep Espresso']
    },
    suitableEventTypes: ['wedding', 'engagement', 'anniversary', 'family'],
    vibeKeywords: ['Warm', 'Regal', 'Earthy', 'Golden Hour', 'Traditional Luxe'],
    venueBriefs: {
      function_hall: 'Line the perimeter with fluted terracotta pillars and warm up-lighting. Use raw silk fabric ceiling drapes in soft peach and gold.',
      home_courtyard: 'Focus on courtyard banyan tree lighting, hanging brass bells, earthen diyas around water basins, and woven cane loungers.'
    },
    decorElements: [
      'Handcrafted terracotta water bowls with floating petals and floating wax lights',
      'Warm 2700K fairy string arches framing the stage entrance',
      'Antique brass urlis with deep orange marigold and white tuberose ropes',
      'Woven jute rugs and velvet bolster floor seating for elders'
    ],
    costTier: 'balanced',
    costSavingTips: [
      'Source terracotta pots locally from pottery villages rather than florist markups',
      'Use dried palm fans and pampas alongside seasonal marigolds to cut exotic flower costs by 35%',
      'Replace printed backdrop with brass jaali screens and fabric pleating'
    ]
  },
  {
    id: 'theme-botanical-chic',
    title: 'Sage & Mogra Botanical Chic',
    tagline: 'Fresh, airy romance framed in fragrant white florals and velvet sage leaves',
    description: 'An organic, refreshing atmosphere inspired by lush glasshouses and royal palace courtyards. Subtle, understated, and timeless.',
    palette: {
      primary: '#A9B89A',
      secondary: '#F5D1BD',
      accent: '#D9A948',
      background: '#F9FBF8',
      text: '#32402B',
      names: ['Velvet Sage', 'Blushing Peach', 'Champagne Gold', 'Dew Ivory', 'Forest Pine']
    },
    suitableEventTypes: ['engagement', 'wedding', 'birthday', 'college'],
    vibeKeywords: ['Fresh', 'Minimalist', 'Romantic', 'Airy', 'Serene'],
    venueBriefs: {
      function_hall: 'Transform cold ballroom walls with living eucalyptus garlands, sheer ivory drapery, and warm amber pin-spotting.',
      home_courtyard: 'Amplify natural garden foliage with hanging wicker pendant lights and delicate white jasmine streamers.'
    },
    decorElements: [
      'Fragrant strings of fresh Mogra (Arabian Jasmine) and tuberose tassels',
      'Sage green linen table runners with brushed gold cutlery',
      'Hanging bamboo cage chandeliers with filament bulbs',
      'Live herbal welcome bar with rosemary and lemon balm infusions'
    ],
    costTier: 'balanced',
    costSavingTips: [
      'Incorporate potted ficus and monstera plants that can be rented rather than cut flowers',
      'Keep stage structure minimal with clean white arch and asymmetric floral clusters',
      'Use natural daylight if scheduled in late afternoon'
    ]
  },
  {
    id: 'theme-midnight-stardust',
    title: 'Midnight Stardust & Warm Amber',
    tagline: 'Dramatic, glamorous evening styling with celestial lighting and deep velvet tones',
    description: 'A contemporary high-energy aesthetic designed for music-filled nights, dancing, and theatrical celebration.',
    palette: {
      primary: '#242B48',
      secondary: '#E5A93C',
      accent: '#C96F4A',
      background: '#141829',
      text: '#FFF8EF',
      names: ['Midnight Indigo', 'Warm Amber', 'Burnished Copper', 'Star Dust', 'Cream Silk']
    },
    suitableEventTypes: ['birthday', 'college', 'engagement', 'corporate'],
    vibeKeywords: ['Dramatic', 'High-Energy', 'Glamorous', 'Modern', 'Luminous'],
    venueBriefs: {
      function_hall: 'Utilize moving head profile lights, low-lying dry ice fog, and a glossy black reflective dance floor with LED matrix ceiling.',
      home_courtyard: 'Project starlight gobos on home facade, cluster amber uplights on stone walls, and install high-top cocktail tables.'
    },
    decorElements: [
      'Micro-LED light curtain simulating a starlit night sky behind the stage',
      'Geometric brass lanterns with pillar candles on mirrored table risers',
      'Custom neon celebration motto typography photo-wall',
      'Smoked glass grazing pedestals with glowing warm uplights'
    ],
    costTier: 'luxury',
    costSavingTips: [
      'Rely on smart dynamic lighting rather than heavy physical floral installations',
      'Use digital projection mapping for backdrops to avoid bulky wooden framework',
      'Opt for modular LED bars that double as stage risers'
    ]
  },
  {
    id: 'theme-boho-peach',
    title: 'Bohemian Peach & Dried Pampas',
    tagline: 'Effortless bohemian charm with soft peach hues, dried blooms, and macramé textures',
    description: 'Casual yet exquisitely styled for celebratory gatherings where relaxed warmth and aesthetic photos are the priority.',
    palette: {
      primary: '#F5D1BD',
      secondary: '#C96F4A',
      accent: '#E6D7C3',
      background: '#FFF8EF',
      text: '#49372D',
      names: ['Soft Peach', 'Sunbaked Clay', 'Desert Sand', 'Pampas White', 'Warm Umber']
    },
    suitableEventTypes: ['birthday', 'anniversary', 'family', 'engagement'],
    vibeKeywords: ['Boho', 'Cozy', 'Photogenic', 'Artisanal', 'Chic'],
    venueBriefs: {
      function_hall: 'Create intimate lounge pods with rattan sofas, woven cushions, and warm area rugs to break down large hall space.',
      home_courtyard: 'Hang macramé dreamcatchers, arrange picnic-style low seating with poufs, and string Edison bulbs zigzag across courtyard.'
    },
    decorElements: [
      'Fluffy dried pampas grass plumes in oversized terracotta vases',
      'Macramé hanging backdrop with preserved eucalyptus and peach silk ribbons',
      'Low wooden palette seating tables with floor cushions and cane runners',
      'Hand-lettered acrylic welcome signage on natural easel'
    ],
    costTier: 'budget_friendly',
    costSavingTips: [
      'Dried florals and pampas can be rented and reused, cutting floral bill by up to 50%',
      'Low seating tables require fewer rental chairs and tablecloths',
      'DIY photo-booth corner using vintage cane peacock chairs'
    ]
  }
];

export const SEED_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Finalize Catering Plate Count & Jain Menu Tasting',
    category: 'Catering',
    deadline: '2026-11-15',
    assignedTo: 'Kabir & Catering Chef',
    priority: 'critical',
    isCompleted: false
  },
  {
    id: 't-2',
    title: 'Verify Stage Sound Rigging & Acoustic Decibel Permit',
    category: 'Venue & Logistics',
    deadline: '2026-11-18',
    assignedTo: 'Venue Liaison',
    priority: 'high',
    isCompleted: false
  },
  {
    id: 't-3',
    title: 'Send Digital GuestPass WhatsApp Links to Pending RSVPs',
    category: 'GuestPass',
    deadline: '2026-11-20',
    assignedTo: 'Aanya',
    priority: 'high',
    isCompleted: false
  },
  {
    id: 't-4',
    title: 'Approve Stage Terracotta Urn & Light Canopy Mockup',
    category: 'Decoration',
    deadline: '2026-11-21',
    assignedTo: 'Lead Stylist',
    priority: 'medium',
    isCompleted: false
  },
  {
    id: 't-5',
    title: 'Order 15 Buffer Return Gift Hampers to Match RSVP Trend',
    category: 'Gifts & Favors',
    deadline: '2026-11-22',
    assignedTo: 'Family Committee',
    priority: 'critical',
    isCompleted: false
  },
  {
    id: 't-6',
    title: 'Bridal & Groom Sangeet Outfit Final Fitting Trial',
    category: 'Styling',
    deadline: '2026-11-10',
    assignedTo: 'Aanya & Kabir',
    priority: 'high',
    isCompleted: true,
    completedAt: '2026-11-09T16:00:00Z'
  },
  {
    id: 't-7',
    title: 'Assemble VIP Table Seating Arrangement & Tent Cards',
    category: 'Admin',
    deadline: '2026-11-24',
    assignedTo: 'Event Coordinator',
    priority: 'low',
    isCompleted: false
  },
  {
    id: 't-8',
    title: 'Confirm Out-of-Town Elder Airport Shuttles with Driver Fleet',
    category: 'Logistics',
    deadline: '2026-11-25',
    assignedTo: 'Vikram Mehra',
    priority: 'medium',
    isCompleted: false
  }
];
