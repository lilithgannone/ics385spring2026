import React, { useState, useEffect } from "react";

function VolcWidget() {
  const [volcano, setVolcano] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://volcanoes.usgs.gov/vsc/api/volcanoApi/vhpstatus/332010")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch volcano data.");
        }
        return response.json();
      })
      .then((data) => setVolcano(data))
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!volcano) {
    return <p>Loading volcano data...</p>;
  }
  
  const aviationCode = volcano.colorCode?.toLowerCase() || "default";
  
  return (
    <article className={`dashboard-info-card volc-widget volc-${aviationCode}`}>
      <h3>{volcano.vName} Status</h3>
      <p><strong>Alert Level:</strong> {volcano.alertLevel}</p>
      <p><strong>Aviation Color Code:</strong> {volcano.colorCode}</p>
      <p><strong>Observatory:</strong> {volcano.obs?.toUpperCase()}</p>
      <p><strong>Region:</strong> {volcano.region}</p>
      <p><strong>Updated:</strong> {volcano.alertDate}</p>
      <p>{volcano.noticeSynopsis}</p>
    </article>
  );
}

export default VolcWidget;