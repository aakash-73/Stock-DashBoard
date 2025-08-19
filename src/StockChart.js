import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function StockChart({ history, symbol }) {
  const data = {
    labels: history.map((h) => h.date).reverse(),
    datasets: [
      {
        label: `${symbol} Price`,
        data: history.map((h) => h.price).reverse(),
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        tension: 0.2,
      },
    ],
  };

  return <div className="w-full max-w-2xl mt-6"><Line data={data} /></div>;
}
