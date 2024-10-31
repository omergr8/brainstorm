// WordCountDoughnutChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { colors } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const WordCountPieChart = ({ wordData }) => {
  const chartData = {
    labels: wordData.map((item) => `${item.user}: ${item.wordCount} words`),
    datasets: [
      {
        data: wordData.map((item) => item.wordCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF", // Set legend text color to white
        },
      },
    },
  };
  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <Doughnut data={chartData} options={options} />
      <h3 className="text-center">User Word Count Distribution</h3>
    </div>
  );
};

export default WordCountPieChart;
