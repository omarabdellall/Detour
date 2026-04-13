import { RAW_NEARBY_MORE } from "./nycNearbyMore";

const NYC_IMG =
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80";

/** Six curated stops for the NYC plan (shown with gray map pins plus the extended attraction set). */
export const NYC_ACTIVITIES = [
  {
    id: 201,
    title: "The Met + Central Park edge",
    description:
      "World-class collections then a short walk into the park — locals treat this as a full afternoon, not a rush-through museum trip.",
    tags: ["Cultural", "Walkable", "Moderate"],
    time: "Half day",
    cost: "$30",
    coords: [40.7794, -73.9632],
    etaMinutes: 18,
    image: NYC_IMG,
  },
  {
    id: 202,
    title: "Central Park Ramble",
    description:
      "Wooded paths and birders — quieter than the loop, especially weekday mornings.",
    tags: ["Outdoors", "Low-cost", "Chill"],
    time: "1-2 hours",
    cost: "$0",
    coords: [40.7829, -73.9654],
    etaMinutes: 14,
    image:
      "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 203,
    title: "Brooklyn Bridge walk (Manhattan approach)",
    description:
      "Classic skyline approach; go early or late to avoid the thickest crowds on the wooden promenade.",
    tags: ["Outdoors", "Social", "Low-cost"],
    time: "1 hour",
    cost: "$0",
    coords: [40.7061, -73.9969],
    etaMinutes: 22,
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 204,
    title: "Chelsea Market pass-through",
    description:
      "Indoor food hall energy — grab a bite, then slip out toward the High Line without treating it like a mall.",
    tags: ["Social", "Moderate", "Local favorite"],
    time: "1-2 hours",
    cost: "$15-35",
    coords: [40.7424, -74.0061],
    etaMinutes: 16,
    image:
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 205,
    title: "The High Line",
    description:
      "Elevated park on old rail — best at golden hour; enter from different blocks to vary the rhythm.",
    tags: ["Chill", "Walkable", "Unique"],
    time: "1-2 hours",
    cost: "$0",
    coords: [40.748, -74.0048],
    etaMinutes: 12,
    image:
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 206,
    title: "Washington Square Park",
    description:
      "Student-heavy, buskers, chess — the arch frames a very different downtown than Midtown towers.",
    tags: ["Social", "Low-cost", "Cultural"],
    time: "1-2 hours",
    cost: "$0",
    coords: [40.7313, -74.0005],
    etaMinutes: 10,
    image: NYC_IMG,
  },
  {
    id: 207,
    title: "Greenwich Village jazz basement",
    description:
      "Low cover, tight room — sets run late; arrive before the second show if you hate lines.",
    tags: ["Nightlife", "Cultural", "Low-cost"],
    time: "2-3 hours",
    cost: "$15-25",
    coords: [40.7303, -74.0024],
    etaMinutes: 14,
    image: NYC_IMG,
  },
  {
    id: 208,
    title: "East Village food counter crawl",
    description:
      "Banh mi, pierogi, and late slices within a few blocks — share plates to keep it social.",
    tags: ["Social", "Low-cost", "Authentic"],
    time: "1-2 hours",
    cost: "$12-22",
    coords: [40.7264, -73.9838],
    etaMinutes: 13,
    image:
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 209,
    title: "Roosevelt Island tram viewpoint",
    description:
      "Cable car over the East River then a short walk to Four Freedoms views — very skyline-forward.",
    tags: ["Outdoors", "Social", "Unique"],
    time: "1-2 hours",
    cost: "$5-10",
    coords: [40.7612, -73.964],
    etaMinutes: 19,
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 210,
    title: "Upper West Riverside stroll",
    description:
      "Shaded path, dog chaos, and benches facing the Hudson — pairs well with a Zabar's picnic.",
    tags: ["Chill", "Outdoors", "Walkable"],
    time: "1-2 hours",
    cost: "$0-15",
    coords: [40.7872, -73.9754],
    etaMinutes: 17,
    image:
      "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 211,
    title: "Lincoln Center plaza + fountain",
    description:
      "Free to wander the campus; fountain photos before a rush ticket or outdoor screening.",
    tags: ["Cultural", "Nightlife", "Social"],
    time: "1-2 hours",
    cost: "$0-40",
    coords: [40.7725, -73.9835],
    etaMinutes: 15,
    image: NYC_IMG,
  },
  {
    id: 212,
    title: "Brooklyn Flea — Dumbo summer lot",
    description:
      "Vintage, prints, and snacks with bridge views — Sunday-heavy; check season dates.",
    tags: ["Social", "Cultural", "Morning"],
    time: "2 hours",
    cost: "$0-40",
    coords: [40.7036, -73.9888],
    etaMinutes: 21,
    image:
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80",
  },
];

const RAW_NEARBY = [
  ["Empire State Building", "Art deco icon; observatory decks draw lines — worth booking ahead.", [40.7484, -73.9857]],
  ["Bryant Park", "Midtown lawn with seasonal markets, ping-pong, and outdoor film nights.", [40.7536, -73.9832]],
  ["New York Public Library (Stephen A.)", "Rose Main Reading Room is a quiet cathedral for books.", [40.7532, -73.9822]],
  ["Grand Central Terminal", "Whispering gallery, constellations ceiling, and commuter rhythm.", [40.7527, -73.9772]],
  ["Museum of Modern Art (MoMA)", "Dense modernist hits; Friday evenings can feel more social.", [40.7614, -73.9776]],
  ["Rockefeller Center", "Ice rink in winter; Top of the Rock competes with downtown views.", [40.7587, -73.9787]],
  ["St. Patrick's Cathedral", "Neo-Gothic contrast to glass towers — quick respectful visit.", [40.7585, -73.9755]],
  ["Radio City Music Hall", "Art deco marquee; backstage tours when you want the backstage story.", [40.7598, -73.9795]],
  ["Times Square", "Neon baseline; locals cross it fast — still a useful meeting landmark.", [40.758, -73.9855]],
  ["Flatiron Building", "Thin wedge landmark; Madison Square gives you space to photograph.", [40.7411, -73.9897]],
  ["Madison Square Park", "Shake Shack origin story; art installations rotate on the lawn.", [40.7414, -73.9877]],
  ["Union Square", "Greenmarket days, protests, and subway convergence — very kinetic.", [40.7359, -73.9906]],
  ["Hudson Yards & The Edge", "New skyline chapter; High Line connects north from here.", [40.7538, -74.0022]],
  ["Lincoln Center", "Fountain plaza before shows; campus architecture is worth a loop.", [40.7725, -73.9835]],
  ["American Museum of Natural History", "Dinos, dioramas, and the Hayden Planetarium next door.", [40.7813, -73.9744]],
  ["Columbia University campus", "Core campus gates and college-town cafes on Broadway.", [40.8075, -73.9626]],
  ["Apollo Theater", "Harlem institution; amateur night is the classic format.", [40.81, -73.95]],
  ["Bethesda Terrace", "Central Park's acoustic heart under the mosaic ceiling.", [40.7755, -73.9712]],
  ["Strawberry Fields", "Quiet memorial mosaic near the west drive.", [40.7753, -73.9752]],
  ["Conservatory Water", "Model sailboats and benches — very family-forward weekends.", [40.7665, -73.971]],
  ["The Frick Collection", "Gilded Age mansion setting for old masters (check reopening hours).", [40.7711, -73.9674]],
  ["Neue Galerie", "German and Austrian focus in a Fifth Avenue townhouse.", [40.7733, -73.9654]],
  ["Guggenheim Museum", "Spiral ramp building is the experience as much as the shows.", [40.7829, -73.959]],
  ["National September 11 Memorial", "Reflecting pools mark the footprints; museum is optional depth.", [40.7115, -74.0133]],
  ["One World Trade Center", "Tallest tower downtown; plaza connects transit and memorial.", [40.7127, -74.0134]],
  ["The Battery", "Harbor views, sea glass carousel, ferries to Statue Island.", [40.7029, -74.0153]],
  ["Chinatown (Canal & Mott)", "Dense produce markets and dumpling counters — cash still common.", [40.7153, -73.9982]],
  ["Little Italy (Mulberry)", "Festival streets narrow; gelato stops between SoHo walks.", [40.7198, -73.9975]],
  ["SoHo cast-iron facades", "Retail-heavy but architecture rewards looking up at the columns.", [40.7231, -73.9991]],
  ["Tribeca Washington Market Park", "Neighborhood green amid loft blocks and film-festival energy.", [40.7176, -74.0108]],
  ["Brooklyn Bridge Park — Pier 1", "Manhattan skyline picnic spot along the East River.", [40.7021, -73.9965]],
  ["DUMBO — Washington Street view", "Classic Manhattan Bridge frame between brick warehouses.", [40.7031, -73.9889]],
  ["Brooklyn Heights Promenade", "Elevated walk with uninterrupted downtown views.", [40.6965, -73.9971]],
  ["Prospect Park — Grand Army Plaza", "Arch and farmers market gateway to Brooklyn's big park.", [40.6725, -73.9686]],
  ["Barclays Center", "Arena block; Atlantic Terminal connects many subway lines.", [40.6826, -73.9754]],
  ["Coney Island Boardwalk", "Ferris wheel nostalgia and ocean breeze — long subway, big payoff.", [40.5755, -73.9707]],
  ["Flushing Meadows — Unisphere", "Queens fairgrounds icon; museums and tennis nearby.", [40.7461, -73.8467]],
  ["Roosevelt Island — Four Freedoms Park", "Quiet tip of the island facing the UN and East River.", [40.7614, -73.9496]],
  ["Tenement Museum", "Guided building tours about immigrant block life on the Lower East Side.", [40.7187, -73.99]],
  ["The Strand Bookstore", "Miles of shelves; rare book room upstairs for quiet browsing.", [40.7333, -73.9903]],
  ["St. Mark's Place", "East Village stretch — cheap eats, vintage, and late-night energy.", [40.7295, -73.9877]],
  ["The Morgan Library & Museum", "Renzo Piano addition around Pierpont Morgan's study.", [40.7492, -73.9822]],
  ["Intrepid Sea, Air & Space Museum", "Aircraft carrier on the Hudson with a Concorde on deck.", [40.7645, -73.9996]],
  ["Studio Museum in Harlem (127th)", "African diaspora contemporary art; check for pop-ups nearby.", [40.8079, -73.9469]],
  ["Whitney Museum of American Art", "Meatpacking base; outdoor terraces overlook the High Line.", [40.7396, -74.0089]],
  ["The Vessel (Hudson Yards)", "Honeycomb stairs — great silhouette even if climbing rules change.", [40.7538, -74.002]],
];

const RAW_NEARBY_ALL = [...RAW_NEARBY, ...RAW_NEARBY_MORE];

/** Map pins: original set plus extended borough coverage (6 plan stops + all nearby). */
export const NYC_NEARBY_SPOTS = RAW_NEARBY_ALL.map((row, index) => {
  const [title, description, coords, tags] =
    row.length >= 4 ? row : [row[0], row[1], row[2], undefined];
  return {
    id: 301 + index,
    title,
    description,
    coords,
    tags,
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=900&q=80",
  };
});

export const NYC_LEARN_CONTENT = {
  neighborhood: {
    name: "Midtown Manhattan",
    description:
      "Midtown is the dense heart of Manhattan's tourist landmarks, office towers, and transit hubs. The center of one of NYC's five boroughs, it's a high-energy area where locals often pass through without lingering, but it also contains hidden gems and classic NYC moments.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/42nd_Street_in_New_York.jpg/330px-42nd_Street_in_New_York.jpg",
  },
  city: {
    name: "New York City",
    description:
      "New York City is a bustling metropolis known for its iconic skyline, diverse neighborhoods, and vibrant cultural scene. It's a city of contrasts, where you can experience everything from world-class museums to street food vendors.",
    image:
      "https://i.natgeofe.com/k/5b396b5e-59e7-43a6-9448-708125549aa1/new-york-statue-of-liberty.jpg",
  },
  country: {
    name: "United States",
    description:
      "The US is a country of regions — each city has its own distinct character. Though internationally perceived as fast-paced and commercial, locals describe SF as surprisingly neighborhood-driven and community-focused.",
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80",
  },
};
