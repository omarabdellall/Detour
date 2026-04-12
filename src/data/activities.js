export const ACTIVITIES = [
  {
    id: 1,
    title: "Late-night student jazz bar",
    description:
      "Local music students perform here weekly. Mostly authentic vibe, not many tourists.",
    tags: ["Low-cost", "Local favorite", "Walkable"],
    time: "2-3 hours",
    cost: "$8-15",
    coords: [37.7592, -122.4148],
    etaMinutes: 12,
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Weekend flea market in arts district",
    description:
      "Where locals actually shop. Student vendors, vintage finds, food trucks.",
    tags: ["Low-cost", "Authentic", "Morning"],
    time: "1-2 hours",
    cost: "$0-20",
    coords: [37.7634, -122.4172],
    etaMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Community pottery studio open hours",
    description:
      "Drop-in sessions run by local artists. Chill atmosphere, meet locals.",
    tags: ["Moderate", "Creative", "Social"],
    time: "2 hours",
    cost: "$25",
    coords: [37.7545, -122.4215],
    etaMinutes: 14,
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Underground comedy open mic",
    description:
      "Testing ground for local comedians. Intimate venue above a bookstore.",
    tags: ["Low-cost", "Nightlife", "Unique"],
    time: "2 hours",
    cost: "$5",
    coords: [37.7674, -122.4294],
    etaMinutes: 11,
    image:
      "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Clarion Alley mural walk",
    description:
      "Dense outdoor gallery between Mission and Valencia — quick loop, strong photo light before noon.",
    tags: ["Cultural", "Outdoors", "Low-cost"],
    time: "1 hour",
    cost: "$0",
    coords: [37.762, -122.4214],
    etaMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1534050359320-02900022671e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "Ferry Building farmers' stroll",
    description:
      "Weekday lunch counters and Bay views — easy hop on/off transit at the Embarcadero.",
    tags: ["Social", "Morning", "Walkable"],
    time: "1-2 hours",
    cost: "$10-25",
    coords: [37.7955, -122.3934],
    etaMinutes: 20,
    image:
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    title: "Lands End lookout trail",
    description:
      "Pacific breeze and Golden Gate glimpses without crossing the bridge — bring a wind layer.",
    tags: ["Outdoors", "Chill", "Low-cost"],
    time: "2 hours",
    cost: "$0",
    coords: [37.7799, -122.5111],
    etaMinutes: 35,
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    title: "24th Street taco crawl (short)",
    description:
      "Three stops max — counter-service only, cash-friendly, very local rhythm.",
    tags: ["Social", "Low-cost", "Authentic"],
    time: "1-2 hours",
    cost: "$12-20",
    coords: [37.7523, -122.4182],
    etaMinutes: 15,
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
  },
];

export const NEARBY_SPOTS = [
  {
    id: 101,
    title: "Student-run coffee roastery",
    description: "Small batch roasters who started as a student project.",
    coords: [37.7618, -122.4242],
    tags: ["Chill", "Social", "Local favorite"],
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 102,
    title: "Record store with listening booths",
    description: "Owner curates based on local music scene.",
    coords: [37.7514, -122.4187],
    tags: ["Cultural", "Nightlife", "Unique"],
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 103,
    title: "Neighborhood park with street art",
    description:
      "Local artists showcase work, students hang out here.",
    coords: [37.7693, -122.4265],
    tags: ["Outdoors", "Cultural", "Social"],
    image:
      "https://images.unsplash.com/photo-1470165518248-ff2607f8f062?auto=format&fit=crop&w=900&q=80",
  },
];

export const AI_DESCRIPTIONS = {
  default:
    "Your plan starts with morning market energy at the arts district flea, then gets creative at the pottery studio before ending the night at the jazz bar — a perfectly paced student day.",
  nightlife:
    "Nights first: comedy mic sets the tone, jazz bar closes it out. Market in the morning to reset. Classic Detour loop.",
  cultural:
    "An immersive cultural day — pottery, street art, local markets. Each stop chosen for authenticity over popularity.",
};

export const LEARN_CONTENT = {
  neighborhood: {
    name: "Mission Arts District",
    description:
      "The Mission is known in the city for its vibrant murals, student-run businesses, and late-night food scene. Local traditions include the weekend markets, open studio nights, and impromptu street performances. Locals on DETOUR recommend checking out Clarion Alley and Tartine Manufactory to get a good sense of authentic life here. Historically, this neighborhood was central to the Chicano civil rights movement.",
    image:
      "https://images.unsplash.com/photo-1534050359320-02900022671e?auto=format&fit=crop&w=1200&q=80",
  },
  city: {
    name: "San Francisco",
    description:
      "San Francisco is a peninsula city defined by its hills, fog, and culture of reinvention. Established in 1848, it's been known throughout history for the Gold Rush, the Summer of Love, and the dot-com boom.",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
  },
  country: {
    name: "United States",
    description:
      "The US is a country of regions — each city has its own distinct character. Though internationally perceived as fast-paced and commercial, locals describe SF as surprisingly neighborhood-driven and community-focused.",
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80",
  },
};
