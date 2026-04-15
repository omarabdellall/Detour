import { distanceMeters } from "./geo";

function legCost(a, b) {
  return distanceMeters(a.coords, b.coords);
}

function pathLengthOpen(path) {
  let sum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    sum += legCost(path[i], path[i + 1]);
  }
  return sum;
}

function permutationsOfIndices(n) {
  const idx = Array.from({ length: n }, (_, i) => i);
  const out = [];

  function swap(arr, i, j) {
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }

  function permute(k) {
    if (k === n) {
      out.push(idx.slice());
      return;
    }
    for (let i = k; i < n; i++) {
      swap(idx, k, i);
      permute(k + 1);
      swap(idx, k, i);
    }
  }

  permute(0);
  return out;
}

/** Exact minimum open path (order only) for small n using haversine legs. */
function orderOpenTSPExact(stops) {
  const n = stops.length;
  if (n <= 1) {
    return stops.slice();
  }
  let best = stops.slice();
  let bestCost = Infinity;
  for (const perm of permutationsOfIndices(n)) {
    const ordered = perm.map((i) => stops[i]);
    const c = pathLengthOpen(ordered);
    if (c < bestCost) {
      bestCost = c;
      best = ordered;
    }
  }
  return best;
}

function nearestNeighborMultiStart(stops) {
  const n = stops.length;
  let bestPath = stops.slice();

  for (let s = 0; s < n; s++) {
    const remaining = new Set(Array.from({ length: n }, (_, i) => i));
    const pathIdx = [];
    let cur = s;
    remaining.delete(cur);
    pathIdx.push(cur);
    while (remaining.size) {
      let next = null;
      let dMin = Infinity;
      for (const j of remaining) {
        const d = legCost(stops[cur], stops[j]);
        if (d < dMin) {
          dMin = d;
          next = j;
        }
      }
      pathIdx.push(next);
      remaining.delete(next);
      cur = next;
    }
    const ordered = pathIdx.map((i) => stops[i]);
    if (pathLengthOpen(ordered) < pathLengthOpen(bestPath)) {
      bestPath = ordered;
    }
  }
  return bestPath;
}

/** 2-opt improvement for an open path (activity objects with .coords). */
function twoOptOpen(path) {
  let p = path.slice();
  const n = p.length;
  if (n < 4) {
    return p;
  }

  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 2; j < n; j++) {
        const a = p[i];
        const b = p[i + 1];
        const cNode = p[j - 1];
        const dNode = p[j];
        const before = legCost(a, b) + legCost(cNode, dNode);
        const after = legCost(a, cNode) + legCost(b, dNode);
        if (after < before - 0.5) {
          const next = [...p.slice(0, i + 1), ...p.slice(i + 1, j).reverse(), ...p.slice(j)];
          p = next;
          improved = true;
        }
      }
    }
  }
  return p;
}

/**
 * Order selected stops to minimize total straight-line distance along an open walk
 * (no return leg, no fixed depot — only between itinerary points).
 */
export function orderStopsShortestOpen(stops) {
  if (stops.length <= 1) {
    return stops.slice();
  }
  let ordered;
  if (stops.length <= 8) {
    ordered = orderOpenTSPExact(stops);
  } else {
    ordered = nearestNeighborMultiStart(stops);
    ordered = twoOptOpen(ordered);
  }
  return twoOptOpen(ordered);
}

/**
 * Street routing via public OSRM demo (lon,lat GeoJSON → [lat,lng] for Leaflet).
 * @param {[number, number][]} latLngWaypoints
 * @param {'foot' | 'driving'} mode
 */
export async function fetchOsrmRoute(latLngWaypoints, mode = "foot") {
  if (latLngWaypoints.length < 2) {
    return latLngWaypoints;
  }
  const profile = mode === "driving" ? "driving" : "foot";
  const coordStr = latLngWaypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coordStr}?overview=simplified&geometries=geojson&continue_straight=false`;
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) {
    throw new Error("osrm-http");
  }
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]?.geometry?.coordinates) {
    throw new Error("osrm-route");
  }
  return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
}

/** @deprecated Use fetchOsrmRoute(waypoints, 'foot') */
export async function fetchOsrmFootRoute(latLngWaypoints) {
  return fetchOsrmRoute(latLngWaypoints, "foot");
}

/**
 * Routes for each detour segment (stop → similar alternative). Failed legs fall back to a two-point line.
 * @param {[[number, number], [number, number]][]} segments
 * @param {'foot' | 'driving'} mode
 * @returns {Promise<[number, number][][]>}
 */
export async function fetchOsrmDetourSegments(segments, mode = "foot") {
  if (segments.length === 0) {
    return [];
  }
  return Promise.all(
    segments.map(([from, to]) => fetchOsrmRoute([from, to], mode).catch(() => [from, to])),
  );
}

/** @deprecated Use fetchOsrmDetourSegments(segments, 'foot') */
export async function fetchOsrmFootDetourSegments(segments) {
  return fetchOsrmDetourSegments(segments, "foot");
}
