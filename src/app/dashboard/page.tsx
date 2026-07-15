"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

const monthlyData = [
  { month: "Jan", bookings: 45, revenue: 28500 },
  { month: "Feb", bookings: 52, revenue: 32400 },
  { month: "Mar", bookings: 68, revenue: 41200 },
  { month: "Apr", bookings: 74, revenue: 45800 },
  { month: "May", bookings: 89, revenue: 52300 },
  { month: "Jun", bookings: 105, revenue: 61200 },
  { month: "Jul", bookings: 120, revenue: 72500 },
  { month: "Aug", bookings: 115, revenue: 69800 },
  { month: "Sep", bookings: 95, revenue: 58400 },
  { month: "Oct", bookings: 82, revenue: 51000 },
  { month: "Nov", bookings: 60, revenue: 37800 },
  { month: "Dec", bookings: 78, revenue: 48200 },
];

const categoryData = [
  { name: "Villa", value: 35 },
  { name: "Cabin", value: 20 },
  { name: "Apartment", value: 25 },
  { name: "Resort", value: 20 },
];

const recentActivity = [
  { action: "New booking", property: "Luxury Beachfront Villa", user: "Sarah M.", amount: "$850", date: "2 hours ago" },
  { action: "New review", property: "Mountain Retreat Cabin", user: "Emily R.", amount: "★★★★★", date: "5 hours ago" },
  { action: "New booking", property: "Santorini Cliff Suite", user: "Sophia L.", amount: "$950", date: "1 day ago" },
  { action: "Property listed", property: "Wine Country Estate", user: "Admin", amount: "$1,500", date: "2 days ago" },
  { action: "New booking", property: "Modern City Apartment", user: "Michael T.", amount: "$450", date: "3 days ago" },
];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [selectedChart, setSelectedChart] = useState<"bar" | "pie" | "line">("bar");

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin");
    }
  }, [session, router]);

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back, {session.user.name?.split(" ")[0] || "Explorer"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Properties", value: "89", change: "+12%", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" },
            { label: "Total Bookings", value: "983", change: "+8.2%", icon: "M9 12.75L11.25 15 15 9.75M3 12c0 1.268.63 2.39 1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12" },
            { label: "Total Users", value: "1,247", change: "+5.4%", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
            { label: "Revenue", value: "$584K", change: "+18.3%", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/30 dark:text-emerald-400">
                  {stat.change}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Selector & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["bar", "area"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type === "area" ? "line" : "bar")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      (type === "bar" && selectedChart === "bar") || (type === "area" && selectedChart === "line")
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {type === "bar" ? "Bookings" : "Revenue"}
                  </button>
                ))}
              </div>
              <span className="text-xs text-zinc-400">Monthly Overview</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === "bar" ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenueGradient)" strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Property Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-zinc-500 dark:text-zinc-400">{entry.name}</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Property</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, idx) => (
                  <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        activity.action === "New booking" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                        activity.action === "New review" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      }`}>
                        {activity.action}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-zinc-700 dark:text-zinc-300">{activity.property}</td>
                    <td className="py-3 px-2 text-zinc-500">{activity.user}</td>
                    <td className="py-3 px-2 text-right font-medium text-zinc-900 dark:text-zinc-100">{activity.amount}</td>
                    <td className="py-3 px-2 text-right text-zinc-400 text-xs">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/addListing" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Property
          </Link>
          <Link href="/items/manage" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            Manage Properties
          </Link>
          <Link href="/explore" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            View All Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
