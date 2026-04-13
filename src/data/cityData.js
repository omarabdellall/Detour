import { ACTIVITIES as SAN_FRANCISCO_ACTIVITIES, NEARBY_SPOTS as SAN_FRANCISCO_NEARBY, SF_LEARN_CONTENT as SF_LEARN_CONTENT} from "./activities";
import { NYC_ACTIVITIES, NYC_NEARBY_SPOTS, NYC_LEARN_CONTENT } from "./nycData";

const SAN_FRANCISCO_PACK = {
  startLocation: [37.7588, -122.4209],
  mapZoom: 14,
  activities: SAN_FRANCISCO_ACTIVITIES,
  nearbySpots: SAN_FRANCISCO_NEARBY,
  learnContent: SF_LEARN_CONTENT,
};

const NEW_YORK_PACK = {
  /** Slightly offset from any sample POI so the map does not start inside an immediate-radius ding. */
  startLocation: [40.7518, -73.9845],
  mapZoom: 13,
  activities: NYC_ACTIVITIES,
  nearbySpots: NYC_NEARBY_SPOTS,
  learnContent: NYC_LEARN_CONTENT, // This connects the data
};

/** Boston and Chicago reuse the SF sample dataset until city-specific content exists. */
export function getCityExperience(city) {
  if (city === "New York City") {
    return NEW_YORK_PACK;
  }
  return SAN_FRANCISCO_PACK;
}

export function getActivitiesForCity(city) {
  return getCityExperience(city).activities;
}
