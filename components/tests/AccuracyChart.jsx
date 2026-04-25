'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AccuracyChart({ tests }) {
  const chartData = useMemo(() => {
    // Sort tests chronologically for the chart
    const sorted = [...tests].sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));
    
    return {
      labels: sorted.map(t => format(new Date(t.taken_at), 'MMM d')),
      datasets: [
        {
          label: 'Score %',
          data: sorted.map(t => Number(t.percentage)),
          borderColor: '#6c63ff', // var(--accent)
          backgroundColor: 'rgba(108, 99, 255, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#0c0e14', // var(--bg-primary)
          pointBorderColor: '#6c63ff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4, // Smooth curves
        }
      ]
    };
  }, [tests]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e2130',
        titleColor: '#9096b0',
        bodyColor: '#e8eaf0',
        borderColor: '#3a3f58',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
          title: (items) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const sorted = [...tests].sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));
            return sorted[idx].test_name;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#555c78',
          font: { family: "'JetBrains Mono', monospace" },
          callback: (value) => `${value}%`
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#555c78',
          font: { family: "'JetBrains Mono', monospace" }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  if (!tests || tests.length < 2) {
    return (
      <Card className="h-[300px] flex items-center justify-center text-center">
        <div>
          <p className="text-[var(--text-secondary)] mb-2">Not enough data</p>
          <p className="text-sm text-[var(--text-muted)]">Log at least 2 tests to see your trend line.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[300px]">
      <div className="mb-4">
        <h3 className="font-semibold">Performance Trend</h3>
        <p className="text-xs text-[var(--text-muted)]">Overall accuracy over time</p>
      </div>
      <div className="h-[210px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
