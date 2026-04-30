import React, { useState, useEffect } from "react";

function MetricCards({ island }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch(`/api/metrics?island=${encodeURIComponent(island)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch metrics data.");
        }
        return response.json();
      })
      .then((data) => setMetrics(data))
      .catch((error) => {
        console.error(error);
      });
  }, [island]);

  if (!metrics) {
    return <p>Loading metrics...</p>;
  }

  return (
    <section className="metric-cards-row">
      <article className="metric-card">
        <p className="metric-label">Average Daily Rate</p>
        <h3>${metrics.adr}</h3>
        <p className="metric-detail">per night</p>
      </article>

      <article className="metric-card">
        <p className="metric-label">Occupancy Rate</p>
        <h3>{metrics.occupancy}%</h3>
        <p className="metric-detail">2025 average</p>
      </article>

      <article className="metric-card">
        <p className="metric-label">Average Length of Stay</p>
        <h3>{metrics.lengthOfStay}</h3>
        <p className="metric-detail">days</p>
      </article>
    </section>
  );
}

export default MetricCards;
