import { distanceMeters } from "./geo";

/** Matches Landing vibe chips: Social, Chill, Cultural, Nightlife, Outdoors */
const TAG_TO_VIBES = {
  Social: ["Social"],
  Chill: ["Chill"],
  Cultural: ["Cultural"],
  Nightlife: ["Nightlife"],
  Outdoors: ["Outdoors"],
  Creative: ["Cultural"],
  Authentic: ["Cultural", "Social"],
  Morning: ["Outdoors", "Chill"],
  "Local favorite": ["Social"],
  Unique: [],
  Walkable: [],
  "Low-cost": [],
  Moderate: [],
};

function inferVibesFromText(title, description) {
  const t = `${title} ${description}`.toLowerCase();
  const s = new Set();
  if (
    /(museum|gallery|library|theat(er|re)|concert|symphony|opera|exhibit|collection|cultural|historic house|memorial|folk art|sculpture|planetarium|tenement|schomburg|cloisters)/.test(
      t,
    )
  ) {
    s.add("Cultural");
  }
  if (
    /(park|garden|trail|waterfront|beach|zoo|meadow|ramble|promenade|rink|outdoor|river|pier|boardwalk|bridge|island|cemetery lawn|high line|battery|greenway|wildlife|hudson yards vessel)/.test(
      t,
    )
  ) {
    s.add("Outdoors");
  }
  if (/(night|jazz|comedy|club|cabaret|music hall|amateur night|arena|stadium|apollo|radio city)/.test(t)) {
    s.add("Nightlife");
  }
  if (
    /(market|food hall|square|chinatown|italy|greenmarket|festival|brew|restaurant|coffee|eats|dining|strand|bookstore|flea|vendors|chelsea market|koreatown|astoria)/.test(
      t,
    )
  ) {
    s.add("Social");
  }
  if (/(chill|quiet|reading|conservatory|strawberry fields|meandering|lawn|picnic|slow)/.test(t)) {
    s.add("Chill");
  }
  return s;
}

/** Vibes implied by a curated plan activity's tags. */
export function activityVibeSet(activity) {
  const vibes = new Set();
  for (const tag of activity.tags || []) {
    for (const v of TAG_TO_VIBES[tag] || []) {
      vibes.add(v);
    }
  }
  return vibes;
}

/** Vibes for a map pin (optional explicit tags, else inferred from copy). */
export function spotVibeSet(spot) {
  if (spot.tags?.length) {
    const vibes = new Set();
    for (const tag of spot.tags) {
      for (const v of TAG_TO_VIBES[tag] || [tag]) {
        if (["Social", "Chill", "Cultural", "Nightlife", "Outdoors"].includes(v)) {
          vibes.add(v);
        }
      }
    }
    if (vibes.size > 0) {
      return vibes;
    }
  }
  return inferVibesFromText(spot.title, spot.description);
}

function effectiveStopVibes(stop, preferences) {
  const fromAct = activityVibeSet(stop);
  if (fromAct.size > 0) {
    return fromAct;
  }
  return new Set((preferences?.vibes || []).filter(Boolean));
}

/**
 * Dotted "similar alternative" segments: same vibe family as the stop, within range, capped per stop.
 */
export function buildSimilarDetourLines(selectedStops, nearbySpots, preferences, options = {}) {
  const maxMeters = options.maxMeters ?? 2200;
  const perStop = options.perStop ?? 2;
  const minSeparationM = options.minSeparationM ?? 55;
  if (!selectedStops.length || !nearbySpots.length) {
    return [];
  }

  const lines = [];
  const seenPair = new Set();

  for (const stop of selectedStops) {
    const stopVibes = effectiveStopVibes(stop, preferences);
    if (stopVibes.size === 0) {
      continue;
    }

    const scored = nearbySpots
      .map((spot) => {
        const spotVibes = spotVibeSet(spot);
        const d = distanceMeters(stop.coords, spot.coords);
        const shared = [...stopVibes].filter((v) => spotVibes.has(v)).length;
        const prefMatch = (preferences?.vibes || []).some((v) => spotVibes.has(v)) ? 1 : 0;
        return { spot, d, shared, prefMatch };
      })
      .filter((x) => x.d <= maxMeters && x.d >= minSeparationM && x.shared >= 1)
      .sort((a, b) => {
        if (b.shared !== a.shared) {
          return b.shared - a.shared;
        }
        if (b.prefMatch !== a.prefMatch) {
          return b.prefMatch - a.prefMatch;
        }
        return a.d - b.d;
      })
      .slice(0, perStop);

    for (const { spot } of scored) {
      const a = `${stop.coords[0]},${stop.coords[1]}`;
      const b = `${spot.coords[0]},${spot.coords[1]}`;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seenPair.has(key)) {
        continue;
      }
      seenPair.add(key);
      lines.push([stop.coords, spot.coords]);
    }
  }

  return lines;
}

/** Score for ordering plan suggestions (higher = better quick-pick). */
export function scoreActivityForPlan(activity, preferences, anchorCoords) {
  let score = 0;
  const prefVibes = new Set(preferences?.vibes || []);
  const actVibes = activityVibeSet(activity);
  for (const v of actVibes) {
    if (prefVibes.has(v)) {
      score += 4;
    }
  }
  if (preferences?.budget && activity.tags?.includes(preferences.budget)) {
    score += 3;
  }
  if (anchorCoords) {
    const km = distanceMeters(anchorCoords, activity.coords) / 1000;
    score += Math.max(0, 8 - km * 2.2);
  }
  return score;
}

export function rankActivitiesForQuickPick(activities, preferences, selectedIds, startLocation) {
  const selected = activities.filter((a) => selectedIds.includes(a.id));
  let anchor = startLocation;
  if (selected.length > 0) {
    const lat = selected.reduce((s, a) => s + a.coords[0], 0) / selected.length;
    const lng = selected.reduce((s, a) => s + a.coords[1], 0) / selected.length;
    anchor = [lat, lng];
  }
  return [...activities]
    .map((a) => ({
      activity: a,
      score: scoreActivityForPlan(a, preferences, anchor),
    }))
    .sort((x, y) => y.score - x.score);
}
