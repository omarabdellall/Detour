import { useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { ACTIVITIES, NEARBY_SPOTS } from "../data/activities";

const CURRENT_LOCATION = [37.7588, -122.4209];

function Explore({ selectedActivities = [], setPage }) {
  const [layers, setLayers] = useState({
    activities: true,
    location: true,
    route: true,
    nearby: true,
    detours: true,
  });

  const selectedActivityObjects = useMemo(
    () => ACTIVITIES.filter((activity) => selectedActivities.includes(activity.id)),
    [selectedActivities],
  );

  const totalMinutes = selectedActivityObjects.reduce(
    (acc, activity) => acc + (activity.etaMinutes || 0),
    0,
  );

  const routeLine = useMemo(() => {
    if (selectedActivityObjects.length === 0) {
      return [];
    }
    return [CURRENT_LOCATION, ...selectedActivityObjects.map((activity) => activity.coords)];
  }, [selectedActivityObjects]);

  const detourLines = useMemo(() => {
    if (selectedActivityObjects.length === 0) {
      return [];
    }
    return NEARBY_SPOTS.map((spot, index) => [
      selectedActivityObjects[index % selectedActivityObjects.length].coords,
      spot.coords,
    ]);
  }, [selectedActivityObjects]);

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
          }}
        >
          <Clock3 size={14} />
          <span>
            Next stop: {selectedActivityObjects[0]?.etaMinutes ?? "--"} min | Total:{" "}
            {totalMinutes > 0 ? `${totalMinutes} min` : "--"}
          </span>
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0 }}>
        <MapContainer
          center={CURRENT_LOCATION}
          zoom={14}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {layers.route && routeLine.length > 1 ? (
            <Polyline positions={routeLine} color="#0f766e" weight={5} />
          ) : null}

          {layers.detours
            ? detourLines.map((line, index) => (
                <Polyline
                  key={`detour-${index}`}
                  positions={line}
                  color="#94a3b8"
                  weight={3}
                  dashArray="6 8"
                />
              ))
            : null}

          {layers.location ? (
            <CircleMarker
              center={CURRENT_LOCATION}
              radius={9}
              pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 1 }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          ) : null}

          {layers.nearby
            ? NEARBY_SPOTS.map((spot) => (
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
            Recommended Route
          </button>
          <button type="button" onClick={() => toggleLayer("nearby")} style={layerRowStyle(layers.nearby)}>
            <span style={{ color: "#64748b", marginRight: "7px" }}>●</span>
            Nearby Activities
          </button>
          <button type="button" onClick={() => toggleLayer("detours")} style={layerRowStyle(layers.detours)}>
            <span style={{ color: "#9ca3af", marginRight: "7px" }}>●</span>
            Possible Explorations
          </button>

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
      </div>
    </section>
  );
}

export default Explore;
