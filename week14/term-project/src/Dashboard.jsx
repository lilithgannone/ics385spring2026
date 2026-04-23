// manually added imports after the "import { useEffect, useState } from "react";" import.
import React from "react";
import { useState } from "react";
import ArrivalChart from "./charts/ArrivalChart";
import OriginChart from "./charts/OriginChart";
import MetricCards from "./charts/MetricCards";
import WeatherWidget from "./components/WeatherWidget";
import Label from "./components/Label";
import DashboardCTA from "./components/DashboardCTA";
import LiveStream from "./components/LiveStream";
import VolcWidget from "./components/VolcWidget";
import "./Dashboard.css";

// defines the Dashboard component and creates a React state variable for island selection.
function Dashboard({ property }) {
  const [slctIsland, setSlctIsland] = useState("Hawaii Island");

// Maps each island option to the city used by the weather API for the later slctIsland feature.
  const cityMap = {
    "Hawaii Island": "Hilo",
    "Maui Island": "Kahului",
    Oahu: "Honolulu"
  };

  // main render, combines/ defines different sections.
  return (
    <section id="dashboard">
      <div className="dashboard-header">
        <h2>{property.name} Travel Dashboard</h2>
      </div>

      <Label />

      <div className="dashboard-toolbar">
        <label htmlFor="island-select">Select Island</label>
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

      <div className="dashboard-top-row">
        <WeatherWidget city={cityMap[slctIsland]} />
        <VolcWidget />
        <LiveStream />
      </div>

      <MetricCards island={slctIsland} />

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

        <DashboardCTA property={property} />

    </section>
  );
}

export default Dashboard;
