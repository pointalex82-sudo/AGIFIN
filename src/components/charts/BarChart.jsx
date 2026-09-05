import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BarChart({ title, data, height = 300 }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Inter' } },
      },
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
      <Bar options={options} data={data} />
    </div>
  )
}
