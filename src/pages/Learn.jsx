import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LEARN_CONTENT } from "../data/activities";

const LEVELS = ["neighborhood", "city", "country"];

const INLINE_FACTS = {
  city: [
    {
      id: "city-1",
      title: "Why this city feels different",
      content:
        "San Francisco feels distinct because each neighborhood carries its own rhythm, visual identity, and social scene. A few blocks can completely change the mood, from tourist-heavy corridors to student-centered local pockets.",
    },
    {
      id: "city-2",
      title: "How students usually explore it",
      content:
        "Students often navigate San Francisco through transit lines, walkable districts, late-night food, and low-cost cultural spaces. That perspective tends to surface more local, repeatable experiences than landmark-focused tourism.",
    },
  ],
  country: [
    {
      id: "country-1",
      title: "Why the national view matters",
      content:
        "The United States is often discussed as one unified culture, but local identity changes dramatically across regions. Seeing the broader national context helps explain why cities like San Francisco feel so specific and layered.",
    },
    {
      id: "country-2",
      title: "How authenticity shifts by place",
      content:
        "What feels authentic in one city may be very different in another. Detour focuses on recurring local habits, neighborhood spaces, and community participation instead of popularity metrics.",
    },
  ],
};

const BOTTOM_FACTS = {
  neighborhood: [
    {
      id: "n-1",
      title: "Best time to wander",
      content:
        "Late morning through early evening usually gives you the fullest mix of coffee shops, markets, murals, and casual neighborhood activity before nightlife takes over.",
    },
    {
      id: "n-2",
      title: "What locals value here",
      content:
        "The neighborhood is shaped by creativity, informality, and community loyalty. Small businesses, open studios, and recurring local traditions matter more than polished tourist experiences.",
    },
    {
      id: "n-3",
      title: "A good Detour mindset",
      content:
        "This area rewards slow exploration. Leave room for side streets, short stops, and spontaneous discoveries instead of treating every block like a checklist.",
    },
  ],
  city: [
    {
      id: "c-1",
      title: "City pattern: neighborhood by neighborhood",
      content:
        "San Francisco is best understood as a network of micro-neighborhoods. Distance on a map does not always match how different a place feels once you arrive.",
    },
    {
      id: "c-2",
      title: "Student budget reality",
      content:
        "San Francisco can be expensive, but there are still plenty of low-cost experiences clustered around parks, open mics, local markets, and community-driven spaces.",
    },
  ],
  country: [
    {
      id: "u-1",
      title: "Regional identity matters",
      content:
        "Across the United States, climate, migration, politics, and history shape how people move, gather, and define community. One city can feel radically different from another.",
    },
    {
      id: "u-2",
      title: "Expectation versus reality",
      content:
        "Media often flattens places into stereotypes. The reality is more neighborhood-driven, with everyday culture shaped by local businesses, rituals, and repeat hangout spaces.",
    },
  ],
};

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "100%",
        border: "1px solid rgba(210, 221, 223, 0.9)",
        borderRadius: "12px",
        background: "white",
        padding: "14px 14px",
        textAlign: "left",
        cursor: "pointer",
        borderLeft: isOpen ? "4px solid var(--bg-primary)" : "1px solid rgba(210, 221, 223, 0.9)",
        transition: "all 180ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: "15px" }}>{item.title}</strong>
        <span style={{ fontSize: "18px", color: "var(--text-muted)" }}>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen ? (
        <p style={{ marginTop: "8px", color: "var(--text-secondary)", lineHeight: "24px", fontSize: "15px" }}>
          {item.content}
        </p>
      ) : null}
    </button>
  );
}

function Learn() {
  const [level, setLevel] = useState("neighborhood");
  const [openFacts, setOpenFacts] = useState({});

  const currentIndex = LEVELS.indexOf(level);
  const currentContent = LEARN_CONTENT[level];
  const inlineFacts = useMemo(() => INLINE_FACTS[level] || [], [level]);
  const bottomFacts = useMemo(() => BOTTOM_FACTS[level] || [], [level]);
  const canGoBroader = currentIndex < LEVELS.length - 1;
  const canGoLocal = currentIndex > 0;

  const toggleFact = (id) => {
    setOpenFacts((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "var(--bg-app)",
        padding: "34px 24px 48px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "22px" }}>
      <div
        style={{
          minHeight: "68px",
          background: "var(--bg-surface)",
          borderRadius: "14px",
          boxShadow: "var(--shadow-soft)",
          display: "grid",
          gridTemplateColumns: "220px 1fr 220px",
          alignItems: "center",
          padding: "0 12px",
          gap: "12px",
        }}
      >
        <button
          type="button"
          disabled={!canGoBroader}
          onClick={() => canGoBroader && setLevel(LEVELS[currentIndex + 1])}
          className="pill"
          style={{
            height: "44px",
            opacity: canGoBroader ? 1 : 0.45,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <ChevronLeft size={16} />
          MORE BROAD
        </button>
        <p style={{ textAlign: "center", fontSize: "25px", fontWeight: 700 }}>
          You're in {currentContent.name}
        </p>
        <button
          type="button"
          disabled={!canGoLocal}
          onClick={() => canGoLocal && setLevel(LEVELS[currentIndex - 1])}
          className="pill"
          style={{
            height: "44px",
            opacity: canGoLocal ? 1 : 0.45,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          MORE LOCAL
          <ChevronRight size={16} />
        </button>
      </div>

      <img
        src={currentContent.image}
        alt={currentContent.name}
        style={{
          width: "100%",
          height: "340px",
          objectFit: "cover",
          borderRadius: "16px",
          boxShadow: "var(--shadow-soft)",
        }}
      />

      <div style={{ background: "var(--bg-surface)", borderRadius: "14px", boxShadow: "var(--shadow-soft)", padding: "20px", display: "grid", gap: "14px" }}>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.75", fontSize: "18px", maxWidth: "880px" }}>
          {currentContent.description}
        </p>

        {inlineFacts.map((fact) => (
          <AccordionItem
            key={fact.id}
            item={fact}
            isOpen={Boolean(openFacts[fact.id])}
            onToggle={() => toggleFact(fact.id)}
          />
        ))}
      </div>

      <div style={{ background: "var(--bg-surface)", borderRadius: "14px", boxShadow: "var(--shadow-soft)", padding: "18px", display: "grid", gap: "10px" }}>
        {bottomFacts.map((fact) => (
          <AccordionItem
            key={fact.id}
            item={fact}
            isOpen={Boolean(openFacts[fact.id])}
            onToggle={() => toggleFact(fact.id)}
          />
        ))}
      </div>
      </div>
    </section>
  );
}

export default Learn;
