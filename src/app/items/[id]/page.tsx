"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { authClient } from "@/lib/auth-client";
import type { ItemDetailResponse } from "@/types";
import { DetailSkeleton } from "@/components/SkeletonLoader";
import ListingCard from "@/components/ListingCard";
import toast from "react-hot-toast";

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<ItemDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [booking, setBooking] = useState(false);
  const [defaultCheckIn] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [defaultCheckOut] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]);

  const handleBook = async () => {
    if (!session?.user) {
      toast.error("Please sign in to book a property");
      router.push("/signin");
      return;
    }
    setBooking(true);
    try {
      const checkIn = (document.getElementById("checkIn") as HTMLInputElement).value;
      const checkOut = (document.getElementById("checkOut") as HTMLInputElement).value;
      const guestsEl = document.getElementById("guests") as HTMLInputElement;
      const guests = guestsEl ? Number(guestsEl.value) : 1;
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
      const totalPrice = item ? item.price * Math.max(nights, 1) : 0;

      await api.createBooking({
        propertyId: id as string,
        propertyTitle: item?.title || "Property",
        propertyImage: item?.images?.[0] || "",
        propertyLocation: item?.location || "",
        checkIn,
        checkOut,
        guests,
        totalPrice,
      });
      toast.success("Booking confirmed! 🎉");
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Booking failed";
      toast.error(message);
      console.error("Booking error:", err);
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getItem(id as string);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Something went wrong</h2>
          <p className="mt-2 text-zinc-500">{error || "Item not found"}</p>
          <Link href="/explore" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const { item, relatedItems } = data;
  const images = item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <Link href="/explore" className="hover:text-indigo-600 transition-colors">Explore</Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-zinc-800 dark:text-zinc-200 truncate">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <img
                src={images[selectedImage]}
                alt={item.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800";
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      idx === selectedImage
                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                        : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-20 w-24 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {item.category}
                </span>
                <h1 className="mt-3 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">{item.title}</h1>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{item.rating}</span>
                <span className="text-sm text-zinc-400">({item.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {item.location}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {item.date}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Hosted by {item.userName}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                ${item.price}
                <span className="text-base font-normal text-zinc-400">/night</span>
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">About this property</h2>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                {item.fullDescription || item.shortDescription}
              </p>
            </div>

            {/* Booking Dates */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Check In</label>
                <input
                  id="checkIn"
                  type="date"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                  defaultValue={defaultCheckIn}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Check Out</label>
                <input
                  id="checkOut"
                  type="date"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                  defaultValue={defaultCheckOut}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Guests</label>
                <input
                  id="guests"
                  type="number"
                  min={1}
                  defaultValue={2}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
              </div>
              <div className="flex items-end">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  ${item.price}
                  <span className="text-sm font-normal text-zinc-400">/night</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBook}
                disabled={booking}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? "Booking..." : "Book This Property"}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-6 py-3.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Reviews ({item.reviews.length})
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.reviews.length > 0 ? (
              item.reviews.map((review, idx) => (
                <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                        {review.userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{review.userName}</p>
                        <p className="text-xs text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">&ldquo;{review.comment}&rdquo;</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-sm col-span-2">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Related Properties</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((relatedItem) => (
                <ListingCard key={relatedItem._id} item={relatedItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
