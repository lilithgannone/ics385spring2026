import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function OriginChart({ island }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/origin?island=${encodeURIComponent(island)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch origin data.");
        }
        return response.json();
      })
      .then((data) =>
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: `${island} Visitor Origin`,
              data: data.values,
              backgroundColor: [
                "rgba(13,110,122,0.7)",
                "rgba(111,74,49,0.7)",
                "rgba(83,99,83,0.7)",
                "rgba(201,165,107,0.7)"
              ]
            }
          ]
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }, [island]);

  if (!chartData) {
    return <p>Loading origin data...</p>;
  }

  return <Doughnut data={chartData} />;
}

export default OriginChart;
