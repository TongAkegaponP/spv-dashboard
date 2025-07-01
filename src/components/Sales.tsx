'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { motion, useSpring, useTransform } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type SalesData = {
  year: number;
  target: number;
  [month: string]: number | string;
};

const AnimatedNumber = ({ value, formatType, prefix = '', suffix = '' }: {
  value: number;
  formatType?: 'currency' | 'percent' | 'year';
  prefix?: string;
  suffix?: string;
}) => {
  const spring = useSpring(0, { mass: 1, stiffness: 500, damping: 20 });
  const display = useTransform(spring, (current) => {
    if (formatType === 'currency') {
      return prefix + new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(current));
    } else if (formatType === 'percent') {
      return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(current) + suffix;
    } else if (formatType === 'year') {
      return Math.round(current).toString();
    }
    return Math.round(current).toLocaleString('th-TH');
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function Sales() {
  const [current, setCurrent] = useState<SalesData | null>(null);
  const [previous, setPrevious] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/sales');
        const data = await res.json();
        setCurrent(data.current);
        setPrevious(data.previous);
      } catch (err) {
        console.error('Sales fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  if (loading) return <div className="text-center py-10">Loading sales data...</div>;
  if (!current) return <div className="text-center py-10">No sales data available.</div>;

  const labels = months.map(m => m.charAt(0).toUpperCase() + m.slice(1));
  const values = months.map(m => Number(current[m]) || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const progress = (total / Number(current.target)) * 100;

  const lastYearTotal = previous
    ? months.map(m => Number(previous[m]) || 0).reduce((a, b) => a + b, 0)
    : null;

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Sales (THB)',
        data: values,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.3)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: `Sales Report - ${current.year}`, font: { size: 28 } },
      legend: { display: true, position: 'top' as const, labels: { font: { size: 18 } } },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ฿${Number(ctx.raw).toLocaleString('th-TH')}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: v => `฿${Number(v).toLocaleString('th-TH')}`,
          font: { size: 18 },
        },
      },
      x: {
        ticks: { font: { size: 18 } }
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-8 w-full p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Summary */}
      <motion.div
        className="bg-white p-8 rounded-lg shadow-xl w-full md:w-96 lg:w-1/3 flex-shrink-0 border"
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">📈</span> Overall Sales Progress
        </h2>
        <div className="space-y-6">
          <p className="flex justify-between items-center text-lg">
            <span className="text-gray-600 text-2xl md:text-3xl font-semibold">Reporting Year:</span>
            <strong className="text-gray-900 text-5xl md:text-6xl">
              <AnimatedNumber value={current.year} formatType="year" />
            </strong>
          </p>
          <p className="flex justify-between items-center text-lg">
            <span className="text-gray-600 text-2xl md:text-3xl font-semibold">Sales Target:</span>
            <span className="text-green-600 font-semibold text-4xl md:text-5xl">
              <AnimatedNumber value={Number(current.target)} formatType="currency" prefix="฿" />
            </span>
          </p>
          <p className="flex justify-between items-center text-lg">
            <span className="text-gray-600 text-2xl md:text-3xl font-semibold">Total Sales:</span>
            <span className="text-blue-600 font-semibold text-4xl md:text-5xl">
              <AnimatedNumber value={total} formatType="currency" prefix="฿" />
            </span>
          </p>
          <p className="flex justify-between items-center text-lg">
            <span className="text-gray-600 text-2xl md:text-3xl font-semibold">Current Progress:</span>
            <span className={`font-semibold text-4xl md:text-5xl ${progress >= 100 ? 'text-purple-600' : 'text-orange-500'}`}>
              <AnimatedNumber value={progress} formatType="percent" suffix="%" />
            </span>
          </p>
          {lastYearTotal !== null && previous && (
            <p className="flex justify-between items-center text-lg">
              <span className="text-gray-600 text-2xl md:text-3xl font-semibold">Last Year ({previous.year}):</span>
              <span className="text-indigo-600 font-semibold text-3xl md:text-4xl">
                <AnimatedNumber value={lastYearTotal} formatType="currency" prefix="฿" />
              </span>
            </p>
          )}
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl flex-1 border"
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span> Monthly Sales (THB)
        </h2>
        <div className="h-[400px]">
          <Line data={data} options={options} />
        </div>
      </motion.div>
    </motion.div>
  );
}
