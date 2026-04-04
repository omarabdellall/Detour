import { Compass, RotateCcw } from "lucide-react";

function NavLink({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
        fontSize: "15px",
        fontWeight: isActive ? 700 : 500,
        padding: "8px 4px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {label}
      {isActive ? (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-10px",
            margin: "0 auto",
            width: "100%",
            height: "2px",
            background: "var(--bg-primary)",
            borderRadius: "999px",
          }}
        />
      ) : null}
    </button>
  );
}

function TopNav({ currentPage, setPage, onReset }) {
  const showReset = currentPage !== "landing";

  return (
    <header className="top-nav">
      <div
        style={{
          width: "min(1200px, 100%)",
          margin: "0 auto",
          height: "64px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "20px",
          padding: "0 12px",
        }}
      >
        <button
          type="button"
          onClick={() => setPage("landing")}
          style={{
            border: "none",
            background: "transparent",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            justifySelf: "start",
            padding: 0,
          }}
        >
          <Compass size={20} color="var(--bg-primary)" />
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              color: "var(--text-primary)",
              letterSpacing: "0.01em",
            }}
          >
            DETOUR
          </span>
        </button>

        <nav
          aria-label="Primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "36px",
            justifySelf: "center",
          }}
        >
          <NavLink
            label="Plan"
            isActive={currentPage === "results" || currentPage === "landing"}
            onClick={() => setPage("results")}
          />
          <NavLink
            label="Explore"
            isActive={currentPage === "explore"}
            onClick={() => setPage("explore")}
          />
          <NavLink
            label="Learn"
            isActive={currentPage === "learn"}
            onClick={() => setPage("learn")}
          />
        </nav>

        <div style={{ justifySelf: "end" }}>
          {showReset ? (
            <button
              type="button"
              onClick={onReset}
              style={{
                border: "none",
                background: "transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} />
              New Plan
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
