"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const statsData = [
  { label: "Properties Listed", value: "89+", suffix: "worldwide" },
  { label: "Happy Travelers", value: "12K+", suffix: "and counting" },
  { label: "Countries Covered", value: "45+", suffix: "destinations" },
  { label: "Avg. Rating", value: "4.8", suffix: "out of 5" },
];

const barData = [
  { month: "Jan", bookings: 45 },
  { month: "Feb", bookings: 52 },
  { month: "Mar", bookings: 68 },
  { month: "Apr", bookings: 74 },
  { month: "May", bookings: 89 },
  { month: "Jun", bookings: 105 },
  { month: "Jul", bookings: 120 },
  { month: "Aug", bookings: 115 },
  { month: "Sep", bookings: 95 },
  { month: "Oct", bookings: 82 },
  { month: "Nov", bookings: 60 },
  { month: "Dec", bookings: 78 },
];

const pieData = [
  { name: "Villa", value: 35 },
  { name: "Cabin", value: 20 },
  { name: "Apartment", value: 25 },
  { name: "Resort", value: 20 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

export default function Statistics() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Platform Analytics
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Wayfarer by the Numbers
          </h2>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Our growing community of hosts and travelers.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-16">
          {statsData.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{stat.suffix}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-6">Monthly Bookings</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-6">Properties by Type</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="hidden sm:flex flex-col gap-2 ml-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-zinc-600 dark:text-zinc-400">{entry.name}</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
