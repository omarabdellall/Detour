import { BookOpen, Compass, ListChecks, RotateCcw } from "lucide-react";

function NavItem({ label, icon, isActive, onClick }) {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        padding: "4px 8px 2px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        color: isActive ? "var(--bg-primary)" : "var(--text-muted)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {isActive ? (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              width: "16px",
              height: "3px",
              borderRadius: "999px",
              background: "var(--bg-primary)",
            }}
          />
        ) : null}
        <Icon size={18} />
      </div>

      <span
        style={{
          fontSize: "10px",
          lineHeight: "13px",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function BottomNav({ currentPage, setPage, onReset, resetApp }) {
  const handleReset = () => {
    if (typeof onReset === "function") {
      onReset();
      return;
    }

    if (typeof resetApp === "function") {
      resetApp();
      return;
    }

    setPage("landing");
  };

  return (
    <nav
      aria-label="Bottom navigation"
      className="tab-bar"
      style={{
        width: "100%",
        height: "72px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "0 14px",
        boxSizing: "border-box",
        flexShrink: 0,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={handleReset}
          aria-label="New Plan"
          style={{
            width: "42px",
            height: "42px",
            border: "none",
            borderRadius: "999px",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            color: "var(--bg-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Start a new plan"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "56px",
        }}
      >
        <NavItem
          label="PLAN"
          icon={ListChecks}
          isActive={currentPage === "results"}
          onClick={() => setPage("results")}
        />
        <NavItem
          label="EXPLORE"
          icon={Compass}
          isActive={currentPage === "explore"}
          onClick={() => setPage("explore")}
        />
        <NavItem
          label="LEARN"
          icon={BookOpen}
          isActive={currentPage === "learn"}
          onClick={() => setPage("learn")}
        />
      </div>

      <div />
    </nav>
  );
}

export default BottomNav;
