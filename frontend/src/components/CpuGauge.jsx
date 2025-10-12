import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

function CpuGauge({ cpuHistory }) {
  const data = {
    labels: cpuHistory.map((_, index) => ''),
    datasets: [
      {
        label: 'Victim CPU Usage',
        data: cpuHistory,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { callback: (value) => `${value}%`, color: '#ccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Victim CPU Load',
            color: '#eee',
            font: { size: 18 },
            align: 'start',
            padding: { bottom: 20 }
        }
    },
    animation: { duration: 150 },
  };

  return (
    <div style={{ width: '100%', height: '400px', margin: 'auto' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default CpuGauge;
