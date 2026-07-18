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

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#f59e0b", "#ef4444", "#10b981", "#3b82f6"];

const categoryData = [
  { name: "Villa", value: 35 },
  { name: "Cabin", value: 20 },
  { name: "Apartment", value: 25 },
  { name: "Resort", value: 20 },
];

function StatCard({ label, value, icon, loading }: { label: string; value: string; icon: React.ReactNode; loading?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-indigo-800">
      <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-indigo-50 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-indigo-950/20" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
          <span className="text-zinc-300 dark:text-zinc-600">{icon}</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {loading ? (
            <span className="inline-block w-16 h-7 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ) : value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    cancelled: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// =====================
// USER DASHBOARD VIEW
// =====================
function UserDashboard({ userName }: { userName: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ totalBookings: 0, confirmedBookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<"bar" | "area">("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, statsData] = await Promise.all([
          api.getMyBookings(),
          api.getBookingStats(),
        ]);
        setBookings(bookingsData.bookings);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build monthly chart data from user's bookings
  const monthlyData = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = new Array(12).fill(0);
    const revenue = new Array(12).fill(0);
    bookings.forEach((b) => {
      const date = new Date(b.createdAt);
      const m = date.getMonth();
      counts[m]++;
      revenue[m] += b.totalPrice;
    });
    return months.map((month, i) => ({ month, bookings: counts[i], revenue: revenue[i] }));
  })();

  const hasData = monthlyData.some((m) => m.bookings > 0);
  const chartData = hasData ? monthlyData : [{ month: "No data", bookings: 0, revenue: 0 }];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">My Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back, {userName.split(" ")[0] || "Explorer"} — here&apos;s your travel activity.
          </p>
        </div>

        {/* Stats Cards - User Specific */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="My Bookings"
            value={loading ? "..." : String(bookings.length)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Confirmed"
            value={loading ? "..." : String(stats.confirmedBookings)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Total Spent"
            value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Pending"
            value={loading ? "..." : String(bookings.filter((b) => b.status === "pending").length)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
        </div>

        {/* Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* My Bookings Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["bar", "area"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedChart === type
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {type === "bar" ? "Bookings" : "Revenue"}
                  </button>
                ))}
              </div>
              <span className="text-xs text-zinc-400">My Monthly Activity</span>
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
                      <linearGradient id="userRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#userRevenueGradient)" strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Info */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/explore"
                className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Browse Properties
              </Link>
              <Link
                href="/items/manage"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                Manage My Properties
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Get Support
              </Link>
            </div>
          </div>
        </div>

        {/* My Bookings Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">My Booking History</h3>
            {bookings.length > 0 && (
              <Link href="/explore" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                View All Properties
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Property</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Dates</th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? bookings.slice(0, 15).map((b, idx) => (
                  <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-2">
                      <Link href={`/items/${b.propertyId}`} className="hover:text-indigo-600 transition-colors">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{b.propertyTitle}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{b.propertyLocation}</p>
                      </Link>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <span className="text-xs text-zinc-500">
                        {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center"><StatusBadge status={b.status} /></td>
                    <td className="py-3 px-2 text-right font-medium text-zinc-900 dark:text-zinc-100">${b.totalPrice.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right text-xs text-zinc-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-zinc-200 dark:text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <p className="text-sm text-zinc-500 font-medium">No bookings yet</p>
                      <p className="text-xs text-zinc-400 mt-1">Browse properties and make your first booking!</p>
                      <Link href="/explore" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500">
                        Explore Properties
                      </Link>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/addListing" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-xl">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Property
          </Link>
          <Link href="/items/manage" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            Manage Properties
          </Link>
        </div>
      </div>
    </div>
  );
}

// =====================
// ADMIN DASHBOARD VIEW
// =====================
function AdminDashboard({ userName }: { userName: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalItems: 0,
  });
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<"bar" | "area">("bar");
  const [bookingPage, setBookingPage] = useState(1);
  const [totalBookingPages, setTotalBookingPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"bookings" | "users">("bookings");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, bookingsData, usersData] = await Promise.all([
          api.getAdminStats(),
          api.getAllBookingsAdmin(bookingPage, 20),
          api.getAllUsers(1, 10),
        ]);
        setStats(statsData);
        setBookings(bookingsData.bookings);
        setTotalBookingPages(bookingsData.totalPages);
        setUsers(usersData.users);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingPage]);

  // Monthly chart data from all bookings
  const monthlyData = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = new Array(12).fill(0);
    const revenue = new Array(12).fill(0);
    bookings.forEach((b) => {
      const date = new Date(b.createdAt);
      const m = date.getMonth();
      counts[m]++;
      revenue[m] += b.totalPrice;
    });
    return months.map((month, i) => ({ month, bookings: counts[i], revenue: revenue[i] }));
  })();

  const hasChartData = monthlyData.some((m) => m.bookings > 0);
  const chartData = hasChartData ? monthlyData : [{ month: "No data", bookings: 0, revenue: 0 }];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Admin Panel
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome, {userName.split(" ")[0] || "Admin"} — here&apos;s your platform overview.
          </p>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={loading ? "..." : String(stats.totalUsers)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Properties"
            value={loading ? "..." : String(stats.totalItems)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Bookings"
            value={loading ? "..." : String(stats.totalBookings)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Revenue"
            value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Confirmed"
            value={loading ? "..." : String(stats.confirmedBookings)}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Booking/Revenue Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["bar", "area"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedChart === type
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
                      <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#adminRevenueGradient)" strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Property Distribution */}
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

        {/* Tabs: Bookings / Users */}
        <div className="mb-6">
          <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 w-fit dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "bookings"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "users"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        {activeTab === "bookings" && (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="p-6 pb-0">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">All Bookings</h3>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Property</th>
                    <th className="text-left py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Guest</th>
                    <th className="text-left py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                    <th className="text-center py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                    <th className="text-right py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? bookings.map((b, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <Link href={`/items/${b.propertyId}`} className="hover:text-indigo-600 transition-colors">
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">{b.propertyTitle}</p>
                          <p className="text-xs text-zinc-400">{b.propertyLocation}</p>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell text-zinc-700 dark:text-zinc-300">{b.userName}</td>
                      <td className="py-3 pr-4 hidden lg:table-cell text-xs text-zinc-500">{b.userEmail}</td>
                      <td className="py-3 pr-4 text-center"><StatusBadge status={b.status} /></td>
                      <td className="py-3 pr-4 text-right font-medium text-zinc-900 dark:text-zinc-100">${b.totalPrice.toLocaleString()}</td>
                      <td className="py-3 text-right text-xs text-zinc-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-zinc-400">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalBookingPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                <span className="text-xs text-zinc-400">Page {bookingPage} of {totalBookingPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBookingPage((p) => Math.max(1, p - 1))}
                    disabled={bookingPage <= 1}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setBookingPage((p) => Math.min(totalBookingPages, p + 1))}
                    disabled={bookingPage >= totalBookingPages}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="p-6 pb-0">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Registered Users</h3>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="text-center py-3 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                    <th className="text-right py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((u) => (
                    <tr key={u.id} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">{u.name}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell text-xs text-zinc-500">{u.email}</td>
                      <td className="py-3 pr-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right text-xs text-zinc-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-12 text-center text-sm text-zinc-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/addListing" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-xl">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Property
          </Link>
          <Link href="/items/manage" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            Manage All Properties
          </Link>
          <Link href="/explore" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300">
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}

// =====================
// MAIN DASHBOARD - ROLE AWARE
// =====================
export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    // Try to get role from better-auth session first (if it has additionalFields)
    const sessionRole = (session.user as { role?: string }).role;
    if (sessionRole) {
      Promise.resolve().then(() => {
        setUserRole(sessionRole);
      });
      // Sync Express JWT token so API calls work (critical for admin)
      api.ensureExpressToken(session.user).finally(() => {
        setCheckingRole(false);
      });
      return;
    }

    // Fallback: get profile from the Express API to check role
    const fetchRole = async () => {
      try {
        // First ensure we have an Express token so getProfile can work
        await api.ensureExpressToken(session.user);
        const profile = await api.getProfile();
        setUserRole(profile.user.role);
        localStorage.setItem("wayfarer_role", profile.user.role);
      } catch {
        // Try from local storage
        const storedRole = localStorage.getItem("wayfarer_role");
        setUserRole(storedRole || "user");
      } finally {
        setCheckingRole(false);
      }
    };
    fetchRole();
  }, [session, router]);

  if (!session?.user || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const role = userRole || "user";

  if (role === "admin") {
    return <AdminDashboard userName={session.user.name || "Admin"} />;
  }

  return (
    <UserDashboard
      userName={session.user.name || "Explorer"}
    />
  );
}
