// StatusDonut.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusDonut({ counts }) {
  // counts: { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
  const data = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        label: "Applications",
        data: [
          counts.Applied || 0,
          counts.Interview || 0,
          counts.Offer || 0,
          counts.Rejected || 0,
        ],
        backgroundColor: [
          "#3498db", // blue Applied
          "#f1c40f", // yellow Interview
          "#2ecc71", // green Offer
          "#e74c3c", // red Rejected
        ],
        borderColor: ["#ffffff"],
        borderWidth: 2,
        // for rounded edges
        borderRadius: 10,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%", // donut thickness: higher = thinner center
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 320 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
