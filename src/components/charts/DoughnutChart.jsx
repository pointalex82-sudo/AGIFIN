import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DoughnutChart({ title, data, height = 300 }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Inter', size: 12 } },
      },
      title: {
        display: !!title,
        text: title,
        font: { family: 'Outfit', size: 16, weight: '600' },
      },
    },
  }

  return (
    <div className="chart-container" style={{ height }}>
      <Doughnut options={options} data={data} />
    </div>
  )
}
