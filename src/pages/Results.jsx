import { Check, Clock3, DollarSign, MapPin, Plus, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AI_DESCRIPTIONS } from "../data/activities";
import { getCityExperience } from "../data/cityData";
import { distanceMeters } from "../utils/geo";
import { generateAiOverview } from "../utils/gemini";
import { rankActivitiesForQuickPick } from "../utils/vibeSimilarity";

function Results({ preferences, selectedActivities, setSelectedActivities, setPage }) {
  const [aiDescription, setAiDescription] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const cityPack = useMemo(() => getCityExperience(preferences.city), [preferences.city]);
  const activities = cityPack.activities;

  const hasSelections = selectedActivities.length > 0;
  const selectedActivityObjects = useMemo(
    () => activities.filter((activity) => selectedActivities.includes(activity.id)),
    [activities, selectedActivities],
  );

  const ranked = useMemo(
    () => rankActivitiesForQuickPick(activities, preferences, selectedActivities, cityPack.startLocation),
    [activities, preferences, selectedActivities, cityPack.startLocation],
  );

  const quickAddCandidates = useMemo(() => {
    const selected = new Set(selectedActivities);
    return ranked.filter(({ activity }) => !selected.has(activity.id)).slice(0, 12);
  }, [ranked, selectedActivities]);

  const planAnchor = useMemo(() => {
    if (selectedActivityObjects.length === 0) {
      return cityPack.startLocation;
    }
    const lat =
      selectedActivityObjects.reduce((s, a) => s + a.coords[0], 0) / selectedActivityObjects.length;
    const lng =
      selectedActivityObjects.reduce((s, a) => s + a.coords[1], 0) / selectedActivityObjects.length;
    return [lat, lng];
  }, [selectedActivityObjects, cityPack.startLocation]);

  useEffect(() => {
    let isMounted = true;

    const loadAiText = async () => {
      if (!hasSelections) {
        setAiDescription(null);
        return;
      }

      setIsLoadingAi(true);
      const aiText = await generateAiOverview({
        preferences,
        activities: selectedActivityObjects,
      });

      if (!isMounted) {
        return;
      }

      if (aiText) {
        setAiDescription(aiText);
      } else if (preferences.vibes.includes("Nightlife")) {
        setAiDescription(AI_DESCRIPTIONS.nightlife);
      } else if (preferences.vibes.includes("Cultural")) {
        setAiDescription(AI_DESCRIPTIONS.cultural);
      } else {
        setAiDescription(AI_DESCRIPTIONS.default);
      }

      setIsLoadingAi(false);
    };

    loadAiText();
    return () => {
      isMounted = false;
    };
  }, [hasSelections, preferences, selectedActivityObjects]);

  const toggleActivity = (activityId) => {
    setSelectedActivities((current) =>
      current.includes(activityId)
        ? current.filter((id) => id !== activityId)
        : [...current, activityId],
    );
  };

  const preferenceLine = [
    preferences.vibes.length ? preferences.vibes.join(", ") : "No vibe selected",
    preferences.budget || "No budget selected",
    preferences.time || "No time selected",
    preferences.group || "No group selected",
  ].join(", ");

  const parseCostRange = (cost) => {
    if (!cost || typeof cost !== "string") {
      return [0, 0];
    }
    const normalized = cost.replace(/\$/g, "").trim();
    if (normalized === "0") {
      return [0, 0];
    }
    if (normalized.includes("-")) {
      const [min, max] = normalized.split("-").map((part) => Number(part.replace(/[^0-9.]/g, "")));
      return [Number.isFinite(min) ? min : 0, Number.isFinite(max) ? max : min || 0];
    }
    const value = Number(normalized.replace(/[^0-9.]/g, ""));
    return [Number.isFinite(value) ? value : 0, Number.isFinite(value) ? value : 0];
  };

  const formatCostRange = ([min, max]) => {
    if (min === max) {
      return `$${min}`;
    }
    return `$${min}-${max}`;
  };

  const totalEta = selectedActivityObjects.reduce((acc, a) => acc + (a.etaMinutes || 0), 0);

  const quickPickSubtitle =
    preferences.vibes.length > 0
      ? "Ranked by your vibes, budget, and how close each stop is to the rest of your plan."
      : "Ranked by distance from your plan cluster — add vibes on the home screen for sharper picks.";

  return (
    <section
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 360px",
        gap: "24px",
        padding: "28px 24px",
        background: "var(--bg-app)",
      }}
    >
      <main style={{ display: "grid", gap: "22px", alignContent: "start" }}>
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "12px",
            padding: "14px 16px",
            boxShadow: "var(--shadow-soft)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>Trip setup:</strong>
          <span>{preferenceLine}</span>
          <button
            type="button"
            onClick={() => setPage("landing")}
            style={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              color: "var(--bg-primary)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>Build your plan</h2>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.55, maxWidth: "720px" }}>
            Tap quick cards to stack a day, then fine-tune below. The map will only draw dotted lines to nearby spots that
            match the same kind of energy as each stop (social, cultural, outdoors, and so on).
          </p>
        </div>

        <div
          className="soft-card"
          style={{
            padding: "16px 18px",
            display: "grid",
            gap: "12px",
            background: "white",
            borderRadius: "14px",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <strong style={{ fontSize: "16px" }}>Your plan</strong>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {hasSelections
                ? `${selectedActivityObjects.length} stop${selectedActivityObjects.length === 1 ? "" : "s"} · ~${totalEta} min between legs`
                : "Empty — add from quick picks or the full list"}
            </span>
          </div>
          {hasSelections ? (
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedActivityObjects.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleActivity(a.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      border: "1px solid rgba(17, 125, 117, 0.35)",
                      background: "rgba(17, 125, 117, 0.08)",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.title}
                    </span>
                    <X size={14} aria-hidden />
                  </button>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "rgba(236, 252, 240, 0.9)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "14px" }}>
                    Cost estimate
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--bg-primary)", fontSize: "14px" }}>
                    {formatCostRange(
                      selectedActivityObjects.reduce(
                        (acc, activity) => {
                          const [min, max] = parseCostRange(activity.cost);
                          return [acc[0] + min, acc[1] + max];
                        },
                        [0, 0],
                      ),
                    )}
                  </span>
                </div>
                <div style={{ display: "grid", gap: "6px" }}>
                  {selectedActivityObjects.map((a) => (
                    <div
                      key={a.id}
                      style={{ display: "flex", justifyContent: "space-between", gap: "12px", color: "var(--text-secondary)", fontSize: "13px" }}
                    >
                      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.title}
                      </span>
                      <span>{a.cost || "$0"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
              Start with one or two quick adds — we cluster suggestions around what you pick.
            </p>
          )}
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          <div className="section-divider">
            <span className="section-label">Quick add</span>
          </div>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.5 }}>{quickPickSubtitle}</p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {quickAddCandidates.length === 0 ? (
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)", padding: "8px 4px" }}>
                Every curated stop is on your plan — remove one above if you want to swap in another.
              </p>
            ) : null}
            {quickAddCandidates.map(({ activity }) => {
              const distKm = (distanceMeters(planAnchor, activity.coords) / 1000).toFixed(1);
              return (
                <article
                  key={activity.id}
                  style={{
                    flex: "0 0 min(260px, 82vw)",
                    scrollSnapAlign: "start",
                    borderRadius: "14px",
                    border: "1px solid rgba(210, 221, 223, 0.95)",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "96px 1fr",
                    background: "white",
                    boxShadow: "0 8px 20px rgba(16, 37, 37, 0.06)",
                  }}
                >
                  <img
                    src={activity.image}
                    alt=""
                    style={{ width: "100%", height: "100%", minHeight: "110px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "10px 12px", display: "grid", gap: "8px", alignContent: "start" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, lineHeight: 1.35 }}>{activity.title}</h3>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <MapPin size={12} />
                      ~{distKm} km from plan cluster
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleActivity(activity.id)}
                      style={{
                        border: "none",
                        borderRadius: "999px",
                        height: "36px",
                        padding: "0 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        background: "var(--bg-primary)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gap: "4px" }}>
          <div className="section-divider">
            <span className="section-label">Browse every stop</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Full cards with times and cost — same stops as on the map when you explore.
          </p>
        </div>

        {activities.map((activity) => {
          const isAdded = selectedActivities.includes(activity.id);

          return (
            <article
              key={activity.id}
              className="soft-card"
              style={{
                overflow: "hidden",
                display: "grid",
                gap: "14px",
                background: "white",
              }}
            >
              <img className="card-image" src={activity.image} alt={activity.title} />

              <div style={{ padding: "0 16px 16px", display: "grid", gap: "12px" }}>
                <h3 style={{ fontSize: "20px", lineHeight: "24px", fontWeight: 700 }}>{activity.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "24px" }}>
                  {activity.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "var(--bg-accent-soft)",
                        color: "#9a4a0e",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "16px", color: "var(--text-muted)", fontSize: "13px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Clock3 size={14} />
                      {activity.time}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <DollarSign size={14} />
                      {activity.cost}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleActivity(activity.id)}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      height: "42px",
                      minWidth: "160px",
                      padding: "0 16px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: isAdded ? "var(--bg-accent)" : "var(--bg-primary)",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(16, 44, 44, 0.14)",
                    }}
                  >
                    {isAdded ? <Check size={16} /> : null}
                    {isAdded ? "Added" : "Add to plan"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      <aside
        className="soft-card"
        style={{
          position: "sticky",
          top: "88px",
          padding: "20px 18px",
          display: "grid",
          gap: "14px",
          alignContent: "start",
          maxHeight: "fit-content",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--bg-primary)",
            fontWeight: 700,
          }}
        >
          <Sparkles size={16} />
          <span style={{ fontSize: "14px" }}>AI Plan Description</span>
        </div>

        <div style={{ minHeight: "250px", background: "#fbfdfd", borderRadius: "12px", padding: "14px" }}>
          {isLoadingAi ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Generating plan overview...</p>
          ) : aiDescription ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "24px" }}>
              {aiDescription}
            </p>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Add activities to your plan and DETOUR will summarize your route and recommendations.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => hasSelections && setPage("explore")}
          style={{
            border: "none",
            borderRadius: "12px",
            minHeight: "54px",
            background: hasSelections ? "var(--bg-primary)" : "var(--bg-muted)",
            color: hasSelections ? "white" : "var(--text-muted)",
            fontWeight: 700,
            cursor: hasSelections ? "pointer" : "not-allowed",
            boxShadow: hasSelections ? "0 10px 22px rgba(17, 125, 117, 0.24)" : "none",
          }}
        >
          {hasSelections ? "Explore route" : "Add something to see your route"}
        </button>
      </aside>
    </section>
  );
}

export default Results;
