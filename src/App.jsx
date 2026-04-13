import { useState } from "react";
import TopNav from "./components/TopNav";
import Explore from "./pages/Explore";
import Landing from "./pages/Landing";
import Learn from "./pages/Learn";
import Results from "./pages/Results";

const DEFAULT_PREFERENCES = {
  vibes: [],
  budget: "",
  time: "",
  group: "",
  city: "New York City",
};

function App() {
  const [page, setPage] = useState("landing");
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const resetPlan = () => {
    setPage("landing");
    setPreferences(DEFAULT_PREFERENCES);
    setSelectedActivities([]);
  };

  const sharedPageProps = {
    page,
    setPage,
    preferences,
    setPreferences,
    selectedActivities,
    setSelectedActivities,
  };

  let activePage = <Landing {...sharedPageProps} />;
  if (page === "results") {
    activePage = <Results {...sharedPageProps} />;
  } else if (page === "explore") {
    activePage = <Explore key={preferences.city} {...sharedPageProps} />;
  } else if (page === "learn") {
    activePage = <Learn preferences={preferences} />;
  }

  return (
    <div className="app-shell">
      <TopNav currentPage={page} setPage={setPage} onReset={resetPlan} />
      <main key={page} className="page-stage">
        {activePage}
      </main>
    </div>
  );
}

export default App;
