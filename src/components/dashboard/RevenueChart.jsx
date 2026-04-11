// RevenueChart.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const data = [
  { month: "Jan", revenue: 4200, invoices: 12 },
  { month: "Feb", revenue: 5800, invoices: 15 },
  { month: "Mar", revenue: 4900, invoices: 14 },
  { month: "Apr", revenue: 7200, invoices: 18 },
  { month: "May", revenue: 6800, invoices: 17 },
  { month: "Jun", revenue: 8900, invoices: 22 },
  { month: "Jul", revenue: 7500, invoices: 20 },
  { month: "Aug", revenue: 9200, invoices: 24 },
  { month: "Sep", revenue: 8100, invoices: 21 },
  { month: "Oct", revenue: 10500, invoices: 26 },
  { month: "Nov", revenue: 9800, invoices: 25 },
  { month: "Dec", revenue: 12400, invoices: 30 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl px-4 py-3 shadow-xl border border-slate-100">
        <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-lg font-bold text-slate-900">${payload[0].value.toLocaleString()}</p>
        {payload[0].payload.invoices && (
          <p className="text-xs text-slate-400 mt-1">{payload[0].payload.invoices} invoices</p>
        )}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [chartType, setChartType] = useState('area');
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / data.length;
  const growth = ((data[11].revenue - data[0].revenue) / data[0].revenue * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">Revenue Overview</h3>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">Monthly invoice revenue analysis</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartType === 'area' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartType === 'bar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Bar
            </button>
          </div>

          {/* Stats */}
          <div className="hidden md:block text-right">
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              ${totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 justify-end">
              {parseFloat(growth) > 0 ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : (
                <TrendingDown size={12} className="text-rose-500" />
              )}
              <p className={`text-xs font-semibold ${parseFloat(growth) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {growth}% this year
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden mt-4 p-3 bg-slate-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Total Revenue</p>
            <p className="text-lg font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Growth</p>
            <div className="flex items-center gap-1">
              {parseFloat(growth) > 0 ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : (
                <TrendingDown size={12} className="text-rose-500" />
              )}
              <p className={`text-sm font-bold ${parseFloat(growth) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {growth}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}