// manually added imports after the "import { useEffect, useState } from "react";" import.
// Import React so this file can create a React component.
import React from "react";

// Import useState so the dashboard can remember which island the user selected.
import { useState } from "react";

// Import the chart components used in the dashboard.
import ArrivalChart from "./charts/ArrivalChart";
import OriginChart from "./charts/OriginChart";
import MetricCards from "./charts/MetricCards";

// Import dashboard widgets and smaller UI components.
import WeatherWidget from "./components/WeatherWidget";
import Label from "./components/Label";
import DashboardCTA from "./components/DashboardCTA";
import LiveStream from "./components/LiveStream";
import VolcWidget from "./components/VolcWidget";

// Import the dashboard-specific CSS file.
import "./Dashboard.css";

// Dashboard receives property data from DashboardPage through props.
// The property prop contains information like the property name.
function Dashboard({ property }) {
  const [slctIsland, setSlctIsland] = useState("Hawaii Island");

// This object connects each island name to a city name.
// The WeatherWidget needs a city, not just an island, so this maps the selected island to the correct city.
  const cityMap = {
    "Hawaii Island": "Hilo",
    "Maui Island": "Kahului",
    Oahu: "Honolulu"
  };

  // The return statement controls what appears on the dashboard page.
  return (
    <section id="dashboard">
      <div className="dashboard-header">
        <h2>{property.name} Travel Dashboard</h2>
      </div>

      <Label />
      {/* Toolbar area where the user chooses which island data to view. */}
      <div className="dashboard-toolbar">
        <label htmlFor="island-select">Select Island</label>
        {/* Controlled dropdown. value={slctIsland} keeps the dropdown synced with React state.
        onChange updates slctIsland whenever the user selects a new island. */}
        <select
          id="island-select"
          value={slctIsland}
          onChange={(event) => setSlctIsland(event.target.value)}
        >
          <option value="Hawaii Island">Hawaii Island</option>
          <option value="Maui Island">Maui Island</option>
          <option value="Oahu">Oahu</option>
        </select>
      </div>
        {/* Top row of dashboard widgets. WeatherWidget changes based on the selected island.
        VolcWidget and LiveStream provide extra travel context. */}
      <div className="dashboard-top-row">
        <WeatherWidget city={cityMap[slctIsland]} />
        <VolcWidget />
        <LiveStream />
      </div>

      {/* MetricCards receives the selected island and displays matching summary data. */}
      <MetricCards island={slctIsland} />

      {/* Chart section for visitor arrivals and visitor origin data. Updating based on the selected island. */}
      <div className="dashboard-chart-grid">
        <div className="dashboard-chart-card">
          <h3>Visitor Arrivals</h3>
          <ArrivalChart island={slctIsland} />
        </div>

        <div className="dashboard-chart-card">
          <h3>Visitor Origin</h3>
          <OriginChart island={slctIsland} />
        </div>
      </div>
      {/* DashboardCTA receives property data and displays a call-to-action section. */}
        <DashboardCTA property={property} />

    </section>
  );
}
// Export Dashboard so DashboardPage.jsx can import and render it.
export default Dashboard;
