// src/components/IdeaRelationshipChart.js

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

const IdeaRelationshipChart = ({ data }) => {
  const { titles } = data;

  // Prepare data for the chart
  const categories = [...new Set(titles.map((item) => item.category))];

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Number of Ideas",
        data: categories.map((category) =>
          titles
            .filter((title) => title.category === category)
            .reduce((count, title) => count + title.ideas.length, 0)
        ),
        backgroundColor: "rgb(24,118,209)",
        colors: "white",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
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
                text: "Number of Ideas",
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
              text: "Ideas Count per Category",
            },
          },
        }}
      />
    </div>
  );
};

export default IdeaRelationshipChart;
