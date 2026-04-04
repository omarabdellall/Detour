import { Check, Clock3, DollarSign, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ACTIVITIES, AI_DESCRIPTIONS } from "../data/activities";
import { generateAiOverview } from "../utils/gemini";

function Results({ preferences, selectedActivities, setSelectedActivities, setPage }) {
  const [aiDescription, setAiDescription] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const hasSelections = selectedActivities.length > 0;
  const selectedActivityObjects = useMemo(
    () => ACTIVITIES.filter((activity) => selectedActivities.includes(activity.id)),
    [selectedActivities],
  );

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
      <main style={{ display: "grid", gap: "18px", alignContent: "start" }}>
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
          <strong style={{ color: "var(--text-primary)" }}>Preferences:</strong>
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

        <div style={{ display: "grid", gap: "4px" }}>
          <div className="section-divider">
            <span className="section-label">Your activities</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Curated options based on your current preferences.
          </p>
        </div>

        {ACTIVITIES.map((activity) => {
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
