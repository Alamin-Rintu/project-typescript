"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import type { Booking } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    fill?: string;
  }>;
  label?: string;
}

// Custom styled tooltip for charts
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</p>
        {payload.map((pld, idx) => (
          <p key={idx} className="mt-1 text-sm font-bold animate-fade-in" style={{ color: pld.color || pld.fill }}>
            {pld.name === "revenue" ? `$${pld.value.toLocaleString()}` : `${pld.value} bookings`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card component
function StatCard({ label, value, icon, change, changeType, loading }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  loading?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-indigo-800">
      <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-indigo-50 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-indigo-950/20" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">{label}</span>
          <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 transition-colors duration-300">{icon}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {loading ? (
              <span className="inline-block w-16 h-7 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : value}
          </p>
          {change && !loading && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              changeType === "positive"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450"
                : changeType === "negative"
                ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-450"
                : "bg-zinc-105 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}>
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom status badge with colored pulse dots
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; dot: string; text: string }> = {
    confirmed: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      dot: "bg-emerald-500",
      text: "text-emerald-755 dark:text-emerald-400",
    },
    pending: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      dot: "bg-amber-500",
      text: "text-amber-755 dark:text-amber-400",
    },
    cancelled: {
      bg: "bg-red-50 dark:bg-red-950/30",
      dot: "bg-red-500",
      text: "text-red-755 dark:text-red-400",
    },
  };

  const current = styles[status] || styles.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${current.bg} ${current.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot} animate-pulse`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Confirmation Dialog Modal
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, actionLabel, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  actionLabel: string;
  isLoading: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-scale-up">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-650 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
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
  
  // Modal states for canceling
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  const fetchUserDashboardData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchUserDashboardData();
    });
  }, [fetchUserDashboardData]);

  // Determine user level milestones
  const bookingCount = bookings.filter(b => b.status === "confirmed").length;
  let levelTitle = "Bronze Explorer";
  let levelPerk = "Standard Member benefits";
  let progressPct = 0;
  let nextLevelGoal = 2;

  if (bookingCount >= 5) {
    levelTitle = "Gold Voyager";
    levelPerk = "10% stays discount & VIP host services";
    progressPct = 100;
  } else if (bookingCount >= 2) {
    levelTitle = "Silver Adventurer";
    levelPerk = "5% stays discount & priority support";
    progressPct = ((bookingCount - 2) / 3) * 100;
    nextLevelGoal = 5;
  } else {
    progressPct = (bookingCount / 2) * 100;
  }

  // Find the first confirmed upcoming trip
  const upcomingTrip = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.checkIn) > new Date())
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())[0];

  const daysToTrip = upcomingTrip
    ? Math.ceil((new Date(upcomingTrip.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleCancelClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    setCanceling(true);
    try {
      await api.updateBookingStatus(selectedBookingId, "cancelled");
      await fetchUserDashboardData();
      setCancelModalOpen(false);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setCanceling(false);
    }
  };

  // Build monthly chart data
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-end">
          {/* Greeting Banner */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">My Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400">
              Welcome back, {userName.split(" ")[0] || "Explorer"} — here&apos;s your curated travel overview.
            </p>
          </div>

          {/* Gamified Level Progress */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
                {levelTitle}
              </span>
              <span className="text-[10px] font-semibold text-zinc-405">
                {bookingCount} Stay{bookingCount === 1 ? "" : "s"}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{levelPerk}</p>
            {bookingCount < 5 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] font-medium text-zinc-450 mb-1">
                  <span>Progress to Next Level</span>
                  <span>{bookingCount} / {nextLevelGoal} stays</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Bookings"
            value={loading ? "..." : String(bookings.length)}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Confirmed Stays"
            value={loading ? "..." : String(stats.confirmedBookings)}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
            change={bookingCount > 0 ? "Active traveler" : undefined}
            changeType="positive"
          />
          <StatCard
            label="Total Spent"
            value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Pending Stays"
            value={loading ? "..." : String(bookings.filter((b) => b.status === "pending").length)}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
          />
        </div>

        {/* Dynamic Center Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["bar", "area"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      selectedChart === type
                        ? "bg-indigo-550 text-white shadow-md shadow-indigo-600/10"
                        : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-850"
                    }`}
                  >
                    {type === "bar" ? "Stays Count" : "Spent Trend"}
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">My Stays Analytics</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="userRevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="url(#userRevGradient)" strokeWidth={2.5} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Trip / Prompt Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between">
            {upcomingTrip ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Next Stay</h3>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-750 dark:bg-indigo-950/40 dark:text-indigo-400">
                    In {daysToTrip} Days
                  </span>
                </div>
                <div className="group relative h-36 w-full overflow-hidden rounded-xl bg-zinc-100">
                  <img
                    src={upcomingTrip.propertyImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"}
                    alt={upcomingTrip.propertyTitle}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-white/80">{upcomingTrip.propertyLocation}</p>
                    <p className="text-sm font-bold truncate mt-0.5">{upcomingTrip.propertyTitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <div>
                    <p className="font-semibold text-zinc-405">Check In</p>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{new Date(upcomingTrip.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-405">Check Out</p>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{new Date(upcomingTrip.checkOut).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col justify-center h-full text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-555">Where to next?</h3>
                  <p className="mt-1.5 text-xs text-zinc-400 max-w-[220px] mx-auto">
                    Search luxury estates, cozy lofts, or beach cabins on Wayfarer.
                  </p>
                </div>
                <Link
                  href="/explore"
                  className="mx-auto inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98]"
                >
                  Explore Stays
                </Link>
              </div>
            )}
            {upcomingTrip && (
              <Link
                href={`/items/${upcomingTrip.propertyId}`}
                className="w-full flex items-center justify-center rounded-xl bg-zinc-700 hover:bg-zinc-650 text-xs font-bold text-white py-3 mt-4 transition-colors"
              >
                View Booking Details
              </Link>
            )}
          </div>
        </div>

        {/* History Table Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Travel History</h3>
            <span className="text-xs text-zinc-400">{bookings.length} reservations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left py-3 px-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">Stay</th>
                  <th className="text-left py-3 px-2 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                  <th className="text-center py-3 px-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">Pricing</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-zinc-400 tracking-wider">Date</th>
                  <th className="text-right py-3 px-2 text-xs font-bold text-zinc-400 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-2">
                        <Link href={`/items/${b.propertyId}`} className="group block">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-105 group-hover:text-indigo-650 transition-colors">{b.propertyTitle}</p>
                          <p className="text-xs text-zinc-450 mt-0.5">{b.propertyLocation}</p>
                        </Link>
                      </td>
                      <td className="py-3.5 px-2 hidden sm:table-cell">
                        <span className="text-xs text-zinc-500">
                          {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-3.5 px-2 text-right font-bold text-zinc-900 dark:text-zinc-100">
                        ${b.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 text-right text-xs text-zinc-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        {(b.status === "confirmed" || b.status === "pending") ? (
                          <button
                            onClick={() => handleCancelClick(b._id || b.propertyId)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-650 hover:bg-red-50 transition-colors dark:border-red-900/30 dark:hover:bg-red-950/20 dark:text-red-400"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="h-10 w-10 text-zinc-200 dark:text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm font-semibold text-zinc-500">No bookings logged</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Explore stays to start logging journeys.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Cancel Reservation"
          message="Are you sure you want to cancel this booking? This action is permanent and will release the listing dates."
          actionLabel="Yes, Cancel Booking"
          isLoading={canceling}
        />
      </div>
    </div>
  );
}

// =====================
// ADMIN/HOST VIEW
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

  // Status modification states
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<"confirmed" | "cancelled">("confirmed");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchAdminDashboardData = useCallback(async () => {
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
  }, [bookingPage]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchAdminDashboardData();
    });
  }, [fetchAdminDashboardData]);

  // Aggregate top properties by bookings and revenue
  const topProperties = (() => {
    const propMap: Record<string, { id: string; title: string; location: string; count: number; revenue: number; image?: string }> = {};
    bookings.forEach((b) => {
      if (b.status !== "confirmed") return;
      if (!propMap[b.propertyId]) {
        propMap[b.propertyId] = {
          id: b.propertyId,
          title: b.propertyTitle,
          location: b.propertyLocation || "Explore Stay",
          count: 0,
          revenue: 0,
          image: b.propertyImage,
        };
      }
      propMap[b.propertyId].count++;
      propMap[b.propertyId].revenue += b.totalPrice;
    });

    return Object.values(propMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
  })();

  const handleUpdateStatusClick = (bookingId: string, status: "confirmed" | "cancelled") => {
    setSelectedBookingId(bookingId);
    setTargetStatus(status);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedBookingId) return;
    setStatusUpdating(true);
    try {
      await api.updateBookingStatus(selectedBookingId, targetStatus);
      await fetchAdminDashboardData();
      setStatusModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Occupancy logic (confirmed bookings / total bookings)
  const occupancyRate = stats.totalBookings > 0
    ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
    : 78;

  // Monthly stats calculations
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 animate-fade-in-up">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-755 dark:bg-indigo-950/40 dark:text-indigo-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Host Control Panel
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-550">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Welcome, {userName.split(" ")[0] || "Admin"} — here&apos;s your platform overview.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={loading ? "..." : String(stats.totalUsers)}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
            loading={loading}
            change="+4.2% MoM"
            changeType="positive"
          />
          <StatCard
            label="Properties"
            value={loading ? "..." : String(stats.totalItems)}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Bookings"
            value={loading ? "..." : String(stats.totalBookings)}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
            loading={loading}
          />
          <StatCard
            label="Revenue"
            value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            loading={loading}
            change="+14.2% MoM"
            changeType="positive"
          />
          <StatCard
            label="Occupancy"
            value={loading ? "..." : `${occupancyRate}%`}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
            loading={loading}
            change="Target 85%"
            changeType="neutral"
          />
        </div>

        {/* Charts & Top Performance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["bar", "area"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      selectedChart === type
                        ? "bg-indigo-550 text-white shadow-md shadow-indigo-650/10"
                        : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-850"
                    }`}
                  >
                    {type === "bar" ? "Monthly Bookings" : "Monthly Revenue"}
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Business Analytics</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="admRevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="url(#admRevGradient)" strokeWidth={2.5} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top stays list */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-5">
                Top Stays by Revenue
              </h3>
              <div className="space-y-4">
                {topProperties.length > 0 ? (
                  topProperties.map((tp, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0 last:pb-0">
                      <div className="h-12 w-16 overflow-hidden rounded-lg bg-zinc-105 relative shrink-0">
                        <img src={tp.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80"} alt={tp.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-400 truncate">{tp.location}</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">{tp.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-indigo-650 dark:text-indigo-400">${tp.revenue.toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{tp.count} booking{tp.count === 1 ? "" : "s"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 text-center py-10">No bookings compiled yet.</p>
                )}
              </div>
            </div>
            <Link
              href="/items/manage"
              className="w-full flex items-center justify-center rounded-xl border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 py-3 mt-6 transition-colors"
            >
              Configure Stays
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4 border-b border-zinc-105 dark:border-zinc-800 pb-4">
          <div className="flex gap-1.5 rounded-xl bg-zinc-150 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "bookings"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-705 dark:hover:text-zinc-200"
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "users"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-750 dark:hover:text-zinc-200"
              }`}
            >
              Registered Users
            </button>
          </div>
        </div>

        {/* Bookings Table view */}
        {activeTab === "bookings" && (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="overflow-x-auto p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Stay</th>
                    <th className="text-left py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Guest Details</th>
                    <th className="text-center py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Charge</th>
                    <th className="text-right py-3 pr-4 text-xs font-bold text-zinc-400 tracking-wider">Booked Date</th>
                    <th className="text-right py-3 text-xs font-bold text-zinc-400 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? bookings.map((b, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 pr-4">
                        <Link href={`/items/${b.propertyId}`} className="group block">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-650 transition-colors">{b.propertyTitle}</p>
                          <p className="text-xs text-zinc-450">{b.propertyLocation}</p>
                        </Link>
                      </td>
                      <td className="py-3.5 pr-4 hidden md:table-cell text-zinc-700 dark:text-zinc-300">
                        <p className="font-medium text-xs">{b.userName}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{b.userEmail}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-center">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-3.5 pr-4 text-right font-bold text-zinc-900 dark:text-zinc-100">${b.totalPrice.toLocaleString()}</td>
                      <td className="py-3.5 pr-4 text-right text-xs text-zinc-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          {b.status === "pending" && (
                            <button
                              onClick={() => handleUpdateStatusClick(b._id || b.propertyId, "confirmed")}
                              className="rounded-lg bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors dark:bg-indigo-950/30 dark:text-indigo-400"
                            >
                              Approve
                            </button>
                          )}
                          {(b.status === "confirmed" || b.status === "pending") ? (
                            <button
                              onClick={() => handleUpdateStatusClick(b._id || b.propertyId, "cancelled")}
                              className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-655 hover:bg-red-50 transition-colors dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-zinc-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-zinc-400">No bookings currently active.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {totalBookingPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                <span className="text-xs text-zinc-400">Page {bookingPage} of {totalBookingPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBookingPage((p) => Math.max(1, p - 1))}
                    disabled={bookingPage <= 1}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-350"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setBookingPage((p) => Math.min(totalBookingPages, p + 1))}
                    disabled={bookingPage >= totalBookingPages}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-350"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Table view */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="overflow-x-auto p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Email Address</th>
                    <th className="text-center py-3 pr-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Role Type</th>
                    <th className="text-right py-3 text-xs font-bold text-zinc-400 tracking-wider">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((u) => (
                    <tr key={u.id} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-zinc-900 dark:text-zinc-105">{u.name}</td>
                      <td className="py-3.5 pr-4 hidden sm:table-cell text-xs text-zinc-450">{u.email}</td>
                      <td className="py-3.5 pr-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-indigo-50 text-indigo-705 dark:bg-indigo-950/30 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-450"
                        }`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-xs text-zinc-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-12 text-center text-sm text-zinc-450">No users found on this platform.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dynamic Admin Actions Panel */}
        <div className="mt-8 flex flex-wrap gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <Link href="/addListing" className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-650/10 hover:bg-indigo-600 hover:shadow-indigo-600/20 transition-all active:scale-[0.98]">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Property
          </Link>
          <Link href="/items/manage" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors">
            Manage Properties
          </Link>
          <Link href="/explore" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors">
            View Market Site
          </Link>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onConfirm={handleConfirmStatusChange}
          title={targetStatus === "confirmed" ? "Approve Booking" : "Cancel Reservation"}
          message={
            targetStatus === "confirmed"
              ? "Are you sure you want to approve and confirm this platform booking?"
              : "Are you sure you want to cancel this reservation? This release will free up room listing availability."
          }
          actionLabel={targetStatus === "confirmed" ? "Approve Booking" : "Cancel Booking"}
          isLoading={statusUpdating}
        />
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

    const sessionRole = (session.user as { role?: string }).role;
    if (sessionRole) {
      Promise.resolve().then(() => {
        setUserRole(sessionRole);
      });
      api.ensureExpressToken(session.user).finally(() => {
        setCheckingRole(false);
      });
      return;
    }

    const fetchRole = async () => {
      try {
        await api.ensureExpressToken(session.user);
        const profile = await api.getProfile();
        setUserRole(profile.user.role);
        localStorage.setItem("wayfarer_role", profile.user.role);
      } catch {
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Syncing Dashboard Data...</p>
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
