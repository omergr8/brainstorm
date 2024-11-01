// src/components/KeyOutcomesChart.js

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const KeyOutcomesChart = ({ keyOutcomes, actionItems }) => {
  const barData = {
    labels: ["Key Outcomes", "Action Items"],
    datasets: [
      {
        label: "Count",
        data: [keyOutcomes.length, actionItems.length],
        backgroundColor: ["#4CAF50", "#2196F3"],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Bar
        data={barData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: true,
                color: "rgba(255,255,255,.55)",
              },
              ticks: {
                color: "white",
                fontSize: 12,
              },
              title: {
                display: true,
                text: "Count",
                color: "white",
              },
            },
            x: {
              ticks: {
                color: "white",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Key Outcomes and Action Items",
            },
          },
        }}
      />
    </div>
  );
};

export default KeyOutcomesChart;
