
import { useState } from "react";

import Discover from "./Discover.jsx";
import Matches from "./Matches.jsx";

// Available navigation tabs
const TABS = ["Home", "Discover", "Matches"];

// Icons displayed alongside the navigation tabs
const ICON = {
  Home: "🏠",
  Discover: "🔥",
  Matches: "💘",
};

// Scrolling text displayed below the header
const TICKER =
  "main character energy ✨ no peeking 🫣 swipe right, be brave 💘 vibes only 🔥 touch grass later 🌱 ";

// Main application component
export default function App() {
  // Track the currently selected tab
  const [tab, setTab] = useState("Discover");

  // Change the active navigation tab
  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
  };

  return (
    <div className="app">

      {/* Application header */}
      <header className="topbar">
        <h1>
          <span className="logo">coy</span>
          <span className="face" aria-hidden="true">
            🫣
          </span>
        </h1>

        <p className="tag">swipe. match. no spoilers.</p>
      </header>

      {/* Animated scrolling message */}
      <div className="ticker" aria-hidden="true">
        <div>{TICKER.repeat(4)}</div>
      </div>

      {/* Main content changes according to the selected tab */}
      <main className="screen">

        {/* Home tab */}
        {tab === "Home" && (
          <div className="home" aria-label="Home" />
        )}

        {/* Discover tab */}
        {tab === "Discover" && (
          <Discover
            onViewMatches={() => handleTabChange("Matches")}
          />
        )}

        {/* Matches tab */}
        {tab === "Matches" && (
          <Matches
            onDiscover={() => handleTabChange("Discover")}
          />
        )}

      </main>

      {/* Bottom navigation bar */}
      <nav className="tabbar" role="tablist" aria-label="Main navigation">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "on" : ""}
            onClick={() => handleTabChange(t)}
          >
            <span aria-hidden="true">{ICON[t]}</span>
            {t}
          </button>
        ))}
      </nav>

    </div>
  );
}
