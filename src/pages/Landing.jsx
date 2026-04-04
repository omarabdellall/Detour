import { MapPin, Moon, Mountain, Palette, Sun, Users } from "lucide-react";
import { useState } from "react";

const VIBE_OPTIONS = [
  { label: "Social", icon: Users },
  { label: "Chill", icon: Moon },
  { label: "Cultural", icon: Palette },
  { label: "Nightlife", icon: Sun },
  { label: "Outdoors", icon: Mountain },
];
const BUDGET_OPTIONS = ["Low-cost", "Moderate", "Flexible"];
const TIME_OPTIONS = ["1-2 hours", "Half day", "Full day"];
const GROUP_OPTIONS = ["Solo", "Friends", "Date", "Large group"];

function PreferenceRow({ label, options, value, onSelect, multiSelect = false }) {
  return (
    <section style={{ display: "grid", gap: "13px" }}>
      <div className="section-divider">
        <span className="section-label">{label}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {options.map((option) => {
          const optionLabel = typeof option === "string" ? option : option.label;
          const OptionIcon = typeof option === "string" ? null : option.icon;
          const isSelected = multiSelect ? value.includes(optionLabel) : value === optionLabel;

          return (
            <button
              key={optionLabel}
              type="button"
              onClick={() => onSelect(optionLabel)}
              className={`pill${isSelected ? " active" : ""}`}
              style={{
                minHeight: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "0 24px",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {OptionIcon ? <OptionIcon size={16} /> : null}
              <span>{optionLabel}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Landing({ preferences, setPreferences, setPage }) {
  const [prompt, setPrompt] = useState("");

  const hasSelections =
    prompt.trim().length > 0 ||
    preferences.vibes.length > 0 ||
    preferences.budget !== "" ||
    preferences.time !== "" ||
    preferences.group !== "";

  const toggleVibe = (option) => {
    const nextVibes = preferences.vibes.includes(option)
      ? preferences.vibes.filter((vibe) => vibe !== option)
      : [...preferences.vibes, option];

    setPreferences({
      ...preferences,
      vibes: nextVibes,
    });
  };

  const setSinglePreference = (key, option) => {
    setPreferences({
      ...preferences,
      [key]: preferences[key] === option ? "" : option,
    });
  };

  return (
    <section
      style={{
        minHeight: "calc(100vh - 64px)",
        background:
          "linear-gradient(180deg, rgba(17, 125, 117, 0.1) 0%, rgba(246, 249, 249, 0) 320px), var(--bg-app)",
        padding: "48px 24px 56px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gap: "34px",
        }}
      >
        <div style={{ textAlign: "center", display: "grid", gap: "10px", justifyItems: "center" }}>
          <h1 style={{ fontSize: "44px", lineHeight: "48px", fontWeight: 800 }}>Explore like a local.</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "18px", lineHeight: "30px", maxWidth: "700px" }}>
            Pick your vibe, budget, and time. We will craft a plan that feels real, local, and
            worth your day.
          </p>
        </div>

        <div
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(210, 221, 223, 0.9)",
            background: "var(--bg-surface)",
            boxShadow: "var(--shadow-soft)",
            display: "grid",
            gridTemplateColumns: "1fr 240px",
            gap: "8px",
            padding: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", paddingLeft: "14px" }}>
            <MapPin size={16} color="var(--text-muted)" />
            <div
              style={{
                width: "1px",
                height: "26px",
                background: "var(--border-soft)",
                margin: "0 12px",
              }}
            />
            <input
              type="text"
              placeholder="What kind of experience are you looking for?"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              style={{
                width: "100%",
                height: "62px",
                borderRadius: "12px",
                border: "none",
                padding: "0 16px 0 0",
                fontSize: "15px",
                background: "transparent",
              }}
            />
          </div>

          <div>
            <select
              value={preferences.city}
              onChange={(event) =>
                setPreferences({
                  ...preferences,
                  city: event.target.value,
                })
              }
              style={{
                width: "100%",
                height: "62px",
                borderRadius: "12px",
                border: "none",
                padding: "0 18px",
                color: "var(--text-secondary)",
                background: "var(--bg-soft)",
                fontSize: "15px",
              }}
            >
              <option value="San Francisco">San Francisco</option>
              <option value="New York City">New York City</option>
              <option value="Boston">Boston</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>
        </div>

        <PreferenceRow
          label="Vibe"
          options={VIBE_OPTIONS}
          value={preferences.vibes}
          onSelect={toggleVibe}
          multiSelect
        />

        <PreferenceRow
          label="Budget"
          options={BUDGET_OPTIONS}
          value={preferences.budget}
          onSelect={(option) => setSinglePreference("budget", option)}
        />

        <PreferenceRow
          label="Time"
          options={TIME_OPTIONS}
          value={preferences.time}
          onSelect={(option) => setSinglePreference("time", option)}
        />

        <PreferenceRow
          label="Group"
          options={GROUP_OPTIONS}
          value={preferences.group}
          onSelect={(option) => setSinglePreference("group", option)}
        />

        {!hasSelections ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Add at least one preference so we can generate your plan.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => hasSelections && setPage("results")}
          disabled={!hasSelections}
          style={{
            width: "100%",
            height: "56px",
            border: "none",
            borderRadius: "12px",
            background: "var(--bg-primary)",
            opacity: hasSelections ? 1 : 0.4,
            color: "var(--text-inverse)",
            cursor: hasSelections ? "pointer" : "not-allowed",
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "0.005em",
            boxShadow: hasSelections ? "0 10px 22px rgba(17, 125, 117, 0.28)" : "none",
          }}
        >
          {hasSelections ? "Generate experiences" : "Select your preferences"}
        </button>
      </div>
    </section>
  );
}

export default Landing;
