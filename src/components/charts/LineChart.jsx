import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function LineChart({ title, data, height = 300 }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: !!title,
        text: title,
        font: { family: 'Outfit', size: 16, weight: '600' },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#F0EEE8' } },
    },
  }

  return (
    <div className="chart-container" style={{ height }}>
      <Line options={options} data={data} />
    </div>
  )
}
