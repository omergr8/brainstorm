import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const DecisionsMadeChart = ({ decisionsMade }) => {
  const pieData = {
    labels: decisionsMade,
    datasets: [
      {
        data: new Array(decisionsMade.length).fill(1), // Each decision gets equal weight
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div>
      <Pie
        data={pieData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Distribution of Decisions Made",
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "white",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DecisionsMadeChart;
