import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Clock3, Loader2 } from "lucide-react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { getCityExperience } from "../data/cityData";
import { fetchOsrmDetourSegments, fetchOsrmRoute, orderStopsShortestOpen } from "../utils/itineraryRoute";
import { distanceMeters } from "../utils/geo";
import { buildSimilarDetourLines } from "../utils/vibeSimilarity";
import { playProximityDing } from "../utils/playDing";

/** Show expanded info within this radius (meters). */
const NEARBY_INFO_METERS = 240;
/** "Right next to" — ding, strongest emphasis (meters). */
const IMMEDIATE_METERS = 42;
const MOVE_STEP = 0.00012;

function MapFollowUser({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true, duration: 0.2 });
  }, [center, map]);
  return null;
}

/** Leaflet's keyboard pan shares arrow keys with our walker; sync handler when the user toggles modes. */
function MapKeyboardMode({ keyboardPanEnabled }) {
  const map = useMap();
  useLayoutEffect(() => {
    const kb = map.keyboard;
    if (!kb) {
      return;
    }
    if (keyboardPanEnabled) {
      kb.enable();
    } else {
      kb.disable();
    }
  }, [keyboardPanEnabled, map]);
  return null;
}

function Explore({ selectedActivities = [], setPage, preferences }) {
  const pack = useMemo(() => getCityExperience(preferences?.city ?? "New York City"), [preferences?.city]);

  const [layers, setLayers] = useState({
    activities: true,
    location: true,
    route: true,
    nearby: true,
    detours: true,
  });

  const [userPosition, setUserPosition] = useState(() => [...pack.startLocation]);
  /** When true, arrows move the blue dot; when false, Leaflet uses arrows to pan (click map first to focus). */
  const [arrowKeysMoveWalker, setArrowKeysMoveWalker] = useState(true);
  /** OSRM profile: walking (foot) by default; driving uses car routing. */
  const [routeProfile, setRouteProfile] = useState("walking");

  const selectedActivityObjects = useMemo(
    () => pack.activities.filter((activity) => selectedActivities.includes(activity.id)),
    [pack.activities, selectedActivities],
  );

  const totalMinutes = selectedActivityObjects.reduce(
    (acc, activity) => acc + (activity.etaMinutes || 0),
    0,
  );

  const selectionKey = useMemo(() => {
    if (selectedActivities.length === 0) {
      return "";
    }
    return [...selectedActivities].sort((a, b) => a - b).join(",");
  }, [selectedActivities]);

  /** Shortest open path over selected stops only (no line to/from the moving blue pin or trip start). */
  const orderedStops = useMemo(() => {
    if (!selectionKey) {
      return [];
    }
    const ids = new Set(selectionKey.split(",").map(Number));
    const list = pack.activities.filter((a) => ids.has(a.id));
    return orderStopsShortestOpen(list);
  }, [selectionKey, pack.activities]);

  const mainRouteKey =
    orderedStops.length >= 2 && selectionKey ? `${selectionKey}:${routeProfile}` : "";

  const [itineraryResult, setItineraryResult] = useState({ key: "", positions: null });

  useEffect(() => {
    if (orderedStops.length < 2 || !selectionKey) {
      return undefined;
    }
    const key = `${selectionKey}:${routeProfile}`;
    const straight = orderedStops.map((a) => a.coords);
    let cancelled = false;
    fetchOsrmRoute(orderedStops.map((a) => a.coords), routeProfile === "driving" ? "driving" : "foot")
      .then((pts) => {
        if (cancelled) {
          return;
        }
        const resolved = pts.length >= 2 ? pts : straight;
        setItineraryResult({ key, positions: resolved });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setItineraryResult({ key, positions: straight });
      });
    return () => {
      cancelled = true;
    };
  }, [orderedStops, selectionKey, routeProfile]);

  const itineraryReady =
    orderedStops.length < 2 ||
    (itineraryResult.key === mainRouteKey && itineraryResult.positions !== null);

  const itineraryLoading = mainRouteKey !== "" && !itineraryReady;

  const itineraryRoutePositions =
    orderedStops.length < 2 || !itineraryReady || !itineraryResult.positions
      ? []
      : itineraryResult.positions.length > 1
        ? itineraryResult.positions
        : [];

  const itineraryFallbackPositions = orderedStops.length >= 2 ? orderedStops.map((a) => a.coords) : [];
  const itineraryRenderPositions = layers.route
    ? itineraryRoutePositions.length > 1
      ? itineraryRoutePositions
      : itineraryFallbackPositions
    : [];

  const detourSegments = useMemo(
    () => buildSimilarDetourLines(orderedStops, pack.nearbySpots, preferences),
    [orderedStops, pack.nearbySpots, preferences],
  );

  const detourKey = useMemo(
    () => detourSegments.map(([a, b]) => `${a[0]},${a[1]}→${b[0]},${b[1]}`).join("|"),
    [detourSegments],
  );

  const detourFetchKey = detourSegments.length > 0 ? `${detourKey}:${routeProfile}` : "";

  const [detourResult, setDetourResult] = useState({ key: "", routes: null });

  useEffect(() => {
    if (detourSegments.length === 0) {
      return undefined;
    }
    const key = `${detourKey}:${routeProfile}`;
    let cancelled = false;
    fetchOsrmDetourSegments(detourSegments, routeProfile === "driving" ? "driving" : "foot").then((routes) => {
      if (cancelled) {
        return;
      }
      setDetourResult({ key, routes });
    });
    return () => {
      cancelled = true;
    };
  }, [detourSegments, detourKey, routeProfile]);

  const detourReady =
    detourSegments.length === 0 ||
    (detourResult.key === detourFetchKey && detourResult.routes !== null);

  const detourLoading = detourFetchKey !== "" && !detourReady;

  const detourPolylines =
    detourSegments.length === 0 ||
    !detourReady ||
    !detourResult.routes ||
    detourResult.routes.length !== detourSegments.length
      ? []
      : detourResult.routes;

  const showRouteLoadingOverlay =
    (layers.route && itineraryLoading && itineraryRoutePositions.length < 2) ||
    (layers.detours && detourLoading);

  const attractionCatalog = useMemo(() => {
    const rows = [];
    for (const activity of pack.activities) {
      rows.push({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        coords: activity.coords,
        source: "itinerary",
        time: activity.time,
        cost: activity.cost,
      });
    }
    for (const spot of pack.nearbySpots) {
      rows.push({
        id: spot.id,
        title: spot.title,
        description: spot.description,
        coords: spot.coords,
        source: "nearby",
      });
    }
    return rows;
  }, [pack.activities, pack.nearbySpots]);

  const nearbyAttractions = useMemo(() => {
    return attractionCatalog
      .map((item) => ({
        ...item,
        distanceM: distanceMeters(userPosition, item.coords),
      }))
      .filter((item) => item.distanceM <= NEARBY_INFO_METERS)
      .sort((a, b) => a.distanceM - b.distanceM);
  }, [attractionCatalog, userPosition]);

  const closestImmediateId = useMemo(() => {
    const first = nearbyAttractions.find((a) => a.distanceM <= IMMEDIATE_METERS);
    return first ? first.id : null;
  }, [nearbyAttractions]);

  const immediateRingRef = useRef(new Set());

  useEffect(() => {
    const inRange = new Set();
    for (const item of attractionCatalog) {
      if (distanceMeters(userPosition, item.coords) <= IMMEDIATE_METERS) {
        inRange.add(item.id);
      }
    }
    for (const id of [...immediateRingRef.current]) {
      if (!inRange.has(id)) {
        immediateRingRef.current.delete(id);
      }
    }
    for (const id of inRange) {
      if (!immediateRingRef.current.has(id)) {
        immediateRingRef.current.add(id);
        playProximityDing();
      }
    }
  }, [userPosition, attractionCatalog]);

  useEffect(() => {
    if (!arrowKeysMoveWalker) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        return;
      }
      event.preventDefault();
      const step = MOVE_STEP;
      setUserPosition(([lat, lng]) => {
        if (event.key === "ArrowUp") {
          return [lat + step, lng];
        }
        if (event.key === "ArrowDown") {
          return [lat - step, lng];
        }
        if (event.key === "ArrowLeft") {
          return [lat, lng - step];
        }
        return [lat, lng + step];
      });
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [arrowKeysMoveWalker]);

  const toggleLayer = (key) => {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
  };

  const layerRowStyle = (enabled) => ({
    border: "none",
    borderRadius: "10px",
    background: enabled ? "rgba(255,255,255,0.96)" : "rgba(247,249,250,0.9)",
    color: enabled ? "var(--text-primary)" : "var(--text-muted)",
    padding: "10px 12px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    boxShadow: enabled ? "0 4px 14px rgba(16, 37, 37, 0.08)" : "none",
  });

  return (
    <section style={{ minHeight: "calc(100vh - 64px)", position: "relative" }}>
      <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(210, 221, 223, 0.85)",
            borderRadius: "999px",
            padding: "8px 14px",
            boxShadow: "0 10px 22px rgba(16, 37, 37, 0.15)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "min(560px, 92vw)",
          }}
        >
          <Clock3 size={14} />
          <span>
            Next on route: {orderedStops[0]?.etaMinutes ?? "--"} min | Total:{" "}
            {totalMinutes > 0 ? `${totalMinutes} min` : "--"}
          </span>
          <span style={{ opacity: 0.85 }}>
            |{" "}
            {arrowKeysMoveWalker
              ? "Arrows: move your pin (toggle under Layers)"
              : "Arrows: pan map — click the map once, then use arrows"}
          </span>
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0 }}>
        <MapContainer
          key={preferences?.city ?? "sf"}
          center={pack.startLocation}
          zoom={pack.mapZoom}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom
          keyboard
        >
          <MapKeyboardMode keyboardPanEnabled={!arrowKeysMoveWalker} />
          <MapFollowUser center={userPosition} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {layers.route && itineraryRenderPositions.length > 1 ? (
            <Polyline positions={itineraryRenderPositions} color="#0f766e" weight={5} />
          ) : null}

          {layers.detours
            ? detourPolylines.map((positions, index) => (
                <Polyline
                  key={`detour-${detourFetchKey}-${index}`}
                  positions={positions}
                  color="#94a3b8"
                  weight={3}
                  dashArray="6 8"
                />
              ))
            : null}

          {layers.location ? (
            <CircleMarker
              center={userPosition}
              radius={11}
              pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 1 }}
            >
              <Popup>
                Your simulated position
                {arrowKeysMoveWalker ? " (arrow keys in My position mode)" : " (choose My position mode to walk with arrows)"}
              </Popup>
            </CircleMarker>
          ) : null}

          {layers.nearby
            ? pack.nearbySpots.map((spot) => (
                <CircleMarker
                  key={spot.id}
                  center={spot.coords}
                  radius={7}
                  pathOptions={{ color: "#64748b", fillColor: "#94a3b8", fillOpacity: 0.95 }}
                >
                  <Popup>
                    <strong>{spot.title}</strong>
                    <p style={{ marginTop: "6px" }}>{spot.description}</p>
                  </Popup>
                </CircleMarker>
              ))
            : null}

          {layers.activities
            ? selectedActivityObjects.map((activity) => (
                <CircleMarker
                  key={activity.id}
                  center={activity.coords}
                  radius={10}
                  pathOptions={{ color: "#0f766e", fillColor: "#14b8a6", fillOpacity: 1 }}
                >
                  <Popup>
                    <strong>{activity.title}</strong>
                    <p style={{ marginTop: "6px", marginBottom: "6px" }}>{activity.description}</p>
                    <div style={{ color: "#475569", fontSize: "12px" }}>
                      Time: {activity.time} | Cost: {activity.cost}
                    </div>
                  </Popup>
                </CircleMarker>
              ))
            : null}
        </MapContainer>

        {showRouteLoadingOverlay ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2000,
              background: "rgba(246, 249, 249, 0.78)",
              backdropFilter: "blur(5px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              pointerEvents: "none",
            }}
          >
            <Loader2 size={34} className="route-loader-spin" style={{ color: "var(--bg-primary)" }} aria-hidden />
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Loading {routeProfile === "driving" ? "driving" : "walking"} routes…
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", textAlign: "center", maxWidth: "280px" }}>
              Snapping your itinerary and alternatives to the street network
            </p>
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: "18px",
            top: "18px",
            width: "280px",
            zIndex: 1000,
            padding: "14px 14px 12px",
            display: "grid",
            gap: "10px",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            boxShadow: "0 14px 30px rgba(16, 37, 37, 0.18)",
          }}
        >
          <strong style={{ fontSize: "16px" }}>Layers</strong>

          <button type="button" onClick={() => toggleLayer("activities")} style={layerRowStyle(layers.activities)}>
            <span style={{ color: "#0f766e", marginRight: "7px" }}>●</span>
            Your Activities (click for info)
          </button>
          <button type="button" onClick={() => toggleLayer("location")} style={layerRowStyle(layers.location)}>
            <span style={{ color: "#2563eb", marginRight: "7px" }}>●</span>
            Your Location
          </button>
          <button type="button" onClick={() => toggleLayer("route")} style={layerRowStyle(layers.route)}>
            <span style={{ color: "#14b8a6", marginRight: "7px" }}>●</span>
            Itinerary (shortest order)
          </button>
          <button type="button" onClick={() => toggleLayer("nearby")} style={layerRowStyle(layers.nearby)}>
            <span style={{ color: "#64748b", marginRight: "7px" }}>●</span>
            Nearby Activities
          </button>
          <button type="button" onClick={() => toggleLayer("detours")} style={layerRowStyle(layers.detours)}>
            <span style={{ color: "#9ca3af", marginRight: "7px" }}>●</span>
            Similar alternatives (dotted, streets)
          </button>

          <div style={{ borderTop: "1px solid rgba(210, 221, 223, 0.85)", paddingTop: "10px", display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Route follows</span>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.45 }}>
              Default is walking (foot). Switch to driving for car-oriented roads.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setRouteProfile("walking")}
                style={{
                  flex: 1,
                  border: routeProfile === "walking" ? "2px solid #0d9488" : "1px solid rgba(210, 221, 223, 0.95)",
                  borderRadius: "10px",
                  padding: "10px 8px",
                  background: routeProfile === "walking" ? "rgba(20, 184, 166, 0.12)" : "rgba(247, 249, 250, 0.9)",
                  color: routeProfile === "walking" ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: routeProfile === "walking" ? "0 4px 12px rgba(13, 148, 136, 0.15)" : "none",
                }}
              >
                Walking
              </button>
              <button
                type="button"
                onClick={() => setRouteProfile("driving")}
                style={{
                  flex: 1,
                  border: routeProfile === "driving" ? "2px solid #b45309" : "1px solid rgba(210, 221, 223, 0.95)",
                  borderRadius: "10px",
                  padding: "10px 8px",
                  background: routeProfile === "driving" ? "rgba(245, 158, 11, 0.14)" : "rgba(247, 249, 250, 0.9)",
                  color: routeProfile === "driving" ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: routeProfile === "driving" ? "0 4px 12px rgba(180, 83, 9, 0.18)" : "none",
                }}
              >
                Driving
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(210, 221, 223, 0.85)", paddingTop: "10px", display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Arrow keys</span>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.45 }}>
              Leaflet also pans the map with arrows when the map is focused — pick one behavior at a time.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setArrowKeysMoveWalker(true)}
                style={{
                  flex: 1,
                  border: arrowKeysMoveWalker ? "2px solid #0d9488" : "1px solid rgba(210, 221, 223, 0.95)",
                  borderRadius: "10px",
                  padding: "10px 8px",
                  background: arrowKeysMoveWalker ? "rgba(20, 184, 166, 0.12)" : "rgba(247, 249, 250, 0.9)",
                  color: arrowKeysMoveWalker ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: arrowKeysMoveWalker ? "0 4px 12px rgba(13, 148, 136, 0.15)" : "none",
                }}
              >
                My position
              </button>
              <button
                type="button"
                onClick={() => setArrowKeysMoveWalker(false)}
                style={{
                  flex: 1,
                  border: !arrowKeysMoveWalker ? "2px solid #2563eb" : "1px solid rgba(210, 221, 223, 0.95)",
                  borderRadius: "10px",
                  padding: "10px 8px",
                  background: !arrowKeysMoveWalker ? "rgba(59, 130, 246, 0.1)" : "rgba(247, 249, 250, 0.9)",
                  color: !arrowKeysMoveWalker ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: !arrowKeysMoveWalker ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "none",
                }}
              >
                Pan map
              </button>
            </div>
          </div>

          {selectedActivityObjects.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Add activities in PLAN to see your route here.
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setPage("results")}
            style={{
              border: "none",
              borderRadius: "11px",
              background: "white",
              color: "var(--text-primary)",
              height: "42px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 14px rgba(16, 37, 37, 0.12)",
            }}
          >
            Back to plan
          </button>
        </div>

        <div
          style={{
            position: "absolute",
            right: "18px",
            bottom: "22px",
            width: "min(340px, calc(100vw - 36px))",
            maxHeight: "min(46vh, 420px)",
            overflowY: "auto",
            zIndex: 1000,
            padding: "14px",
            display: "grid",
            gap: "12px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            boxShadow: "0 14px 30px rgba(16, 37, 37, 0.18)",
            border: "1px solid rgba(210, 221, 223, 0.75)",
          }}
        >
          <strong style={{ fontSize: "15px" }}>Attractions nearby</strong>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.45 }}>
            Within ~{NEARBY_INFO_METERS}m you get details; within ~{IMMEDIATE_METERS}m you hear a ding and the
            closest card is highlighted.
          </p>
          {nearbyAttractions.length === 0 ? (
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Walk closer to a pin to see information here.
            </p>
          ) : (
            nearbyAttractions.map((a) => {
              const isImmediate = a.distanceM <= IMMEDIATE_METERS;
              const isPrimary = isImmediate && a.id === closestImmediateId;
              return (
                <div
                  key={a.id}
                  style={{
                    borderRadius: "12px",
                    padding: isPrimary ? "14px 14px" : "11px 12px",
                    background: isPrimary ? "linear-gradient(135deg, rgba(20, 184, 166, 0.22), rgba(59, 130, 246, 0.12))" : "rgba(247, 249, 250, 0.95)",
                    border: isPrimary ? "2px solid #0d9488" : "1px solid rgba(210, 221, 223, 0.9)",
                    boxShadow: isPrimary ? "0 0 0 3px rgba(13, 148, 136, 0.25), 0 8px 20px rgba(16, 37, 37, 0.12)" : "none",
                    transform: isPrimary ? "scale(1.02)" : "none",
                    transition: "box-shadow 160ms ease, transform 160ms ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline" }}>
                    <strong
                      style={{
                        fontSize: isPrimary ? "17px" : "14px",
                        lineHeight: 1.3,
                        color: isPrimary ? "#0f766e" : "var(--text-primary)",
                        fontWeight: isPrimary ? 800 : 600,
                      }}
                    >
                      {a.title}
                      {isImmediate ? (isPrimary ? " — you're here!" : " — very close") : null}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {Math.round(a.distanceM)}m
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: isPrimary ? "15px" : "13px",
                      lineHeight: 1.55,
                      color: "var(--text-secondary)",
                      fontWeight: isPrimary ? 600 : 400,
                    }}
                  >
                    {a.description}
                  </p>
                  {a.time ? (
                    <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#475569" }}>
                      Time: {a.time}
                      {a.cost ? ` · Cost: ${a.cost}` : null}
                    </p>
                  ) : null}
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", display: "block" }}>
                    {a.source === "itinerary" ? "On your plan" : "Area highlight"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Explore;
