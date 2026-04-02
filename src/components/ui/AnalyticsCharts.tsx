'use client';

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsProps {
  stats: {
    totalAds: number;
    activeAds: number;
    pendingAds: number;
    revenue: number;
  };
  chartData: {
    categories:  { category: string; count: number }[];
    packages: { package: string; count: number }[];
  }
}

export default function AnalyticsCharts({ stats, chartData }: AnalyticsProps) {
  // Chart configurations
  const darkThemeOptions = {
    color: '#a1a1aa',
    plugins: {
      legend: { labels: { color: '#a1a1aa' } },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } }
    }
  };

  const donutOptions = {
    color: '#a1a1aa',
    plugins: {
      legend: { labels: { color: '#a1a1aa' } },
    },
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Animated Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Ads', value: stats.totalAds, color: 'text-indigo-400' },
          { label: 'Active Ads', value: stats.activeAds, color: 'text-emerald-400' },
          { label: 'Pending Docs', value: stats.pendingAds, color: 'text-amber-400' },
          { label: 'Est. Revenue', value: `$${stats.revenue.toLocaleString()}`, color: 'text-teal-400' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card p-6 rounded-xl flex flex-col justify-center border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-[100px] pointer-events-none" />
            <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wider mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 glass-panel p-6 rounded-xl relative"
        >
          <h3 className="text-white font-semibold mb-6">Ads By Category</h3>
          <div className="h-72 w-full">
            <Bar 
              options={{ ...darkThemeOptions, maintainAspectRatio: false }}
              data={{
                labels: chartData.categories.map(c => c.category),
                datasets: [
                  {
                    label: 'Number of Ads',
                    data: chartData.categories.map(c => c.count),
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 1,
                    borderRadius: 4
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-panel p-6 rounded-xl relative"
        >
          <h3 className="text-white font-semibold mb-6">Revenue By Package</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <Doughnut 
              options={{ ...donutOptions, maintainAspectRatio: false }}
              data={{
                labels: chartData.packages.map(p => p.package),
                datasets: [
                  {
                    data: chartData.packages.map(p => p.count),
                    backgroundColor: [
                      'rgba(99, 102, 241, 0.8)', // basic
                      'rgba(16, 185, 129, 0.8)', // standard
                      'rgba(245, 158, 11, 0.8)'  // premium
                    ],
                    borderColor: 'rgba(10, 10, 11, 1)',
                    borderWidth: 2,
                  }
                ]
              }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
