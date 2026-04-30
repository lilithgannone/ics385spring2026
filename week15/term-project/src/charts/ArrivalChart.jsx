import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ArrivalChart({ island }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/arrivals?island=${encodeURIComponent(island)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch arrivals data.");
        }
        return response.json();
      })
      .then((data) =>
        setChartData({
          labels: data.map((row) => row.month),
          datasets: [
            {
              label: `${island} Arrivals`,
              data: data.map((row) => row.arrivals),
              backgroundColor: "rgba(13,110,122,0.7)"
            }
          ]
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }, [island]);

  if (!chartData) {
    return <p>Loading arrivals...</p>;
  }

  return <Bar data={chartData} />;
}

export default ArrivalChart;
