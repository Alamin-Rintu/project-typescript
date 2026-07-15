"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import type { Booking } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

const categoryData = [
  { name: "Villa", value: 35 },
  { name: "Cabin", value: 20 },
  { name: "Apartment", value: 25 },
  { name: "Resort", value: 20 },
];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [selectedChart, setSelectedChart] = useState<"bar" | "pie" | "line">("bar");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ totalBookings: 0, confirmedBookings: 0, totalRevenue: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    const fetchData = async () => {
      try {
        const [bookingsData, statsData] = await Promise.all([
          api.getMyBookings(),
          api.getBookingStats(),
        ]);
        setBookings(bookingsData.bookings);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchData();
  }, [session]);

  // Build monthly booking chart data from real bookings
  const monthlyBookings = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = new Array(12).fill(0);
    const revenue = new Array(12).fill(0);
    bookings.forEach((b) => {
      const date = new Date(b.createdAt);
      const m = date.getMonth();
      counts[m]++;
      revenue[m] += b.totalPrice;
    });
    return months.map((month, i) => ({
      month,
      bookings: counts[i],
      revenue: revenue[i],
    }));
  })();

  const hasData = monthlyBookings.some((m) => m.bookings > 0);
  const chartData = hasData ? monthlyBookings : [
    { month: "Jan", bookings: 0, revenue: 0 },
    { month: "Feb", bookings: 0, revenue: 0 },
  ];

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

        {/* Stats Cards - Real Data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">My Bookings</span>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{loadingStats ? "..." : bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Total Bookings</span>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{loadingStats ? "..." : stats.totalBookings}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Total Revenue</span>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{loadingStats ? "..." : `$${stats.totalRevenue.toLocaleString()}`}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Confirmed</span>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{loadingStats ? "..." : stats.confirmedBookings}</p>
          </div>
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
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData}>
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
                {bookings.length > 0 ? bookings.slice(0, 10).map((b, idx) => (
                  <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                    <td className="py-3 px-2">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      Booking
                    </span>
                    </td>
                    <td className="py-3 px-2 text-zinc-700 dark:text-zinc-300">{b.propertyTitle}</td>
                    <td className="py-3 px-2 text-zinc-500">{b.userName}</td>
                    <td className="py-3 px-2 text-right font-medium text-zinc-900 dark:text-zinc-100">${b.totalPrice.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right text-zinc-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-8 text-center text-sm text-zinc-400">No bookings yet. Browse properties and make your first booking!</td></tr>
                )}
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
