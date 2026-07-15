"use client";

import { useState, useCallback } from "react";
import { useItems, useCategories } from "@/hooks/useItems";
import ListingCard from "@/components/ListingCard";
import { CardGridSkeleton } from "@/components/SkeletonLoader";
import Pagination from "@/components/Pagination";

const sortOptions = [
  { label: "Newest First", value: "createdAt", order: -1 },
  { label: "Oldest First", value: "createdAt", order: 1 },
  { label: "Price: Low to High", value: "price", order: 1 },
  { label: "Price: High to Low", value: "price", order: -1 },
  { label: "Highest Rated", value: "rating", order: -1 },
  { label: "Most Viewed", value: "views", order: -1 },
];

export default function ExplorePage() {
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { items, total, totalPages, currentPage, loading, error, updateParams, setPage } = useItems({ limit: 12 });
  const { categories } = useCategories();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: 1 });
  }, [searchInput, updateParams]);

  const handleCategoryFilter = useCallback((category: string | undefined) => {
    updateParams({ category, page: 1 });
  }, [updateParams]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = sortOptions.find((o) => `${o.value}-${o.order}` === e.target.value);
    if (option) {
      updateParams({ sortBy: option.value, sortOrder: option.order, page: 1 });
    }
  }, [updateParams]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Explore Properties
          </h1>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
            {total} {total === 1 ? "property" : "properties"} found
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, location, or description..."
                className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>
          </form>

          <div className="flex gap-3">
            <select
              onChange={handleSortChange}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
            >
              {sortOptions.map((opt) => (
                <option key={`${opt.value}-${opt.order}`} value={`${opt.value}-${opt.order}`}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all ${
                showFilters
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Category</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryFilter(undefined)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryFilter(cat)}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Price Range</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    onChange={(e) => updateParams({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    onChange={(e) => updateParams({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Min Rating</label>
                <div className="mt-2 flex gap-2">
                  {[4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => updateParams({ minRating: rating, page: 1 })}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      {rating}+
                    </button>
                  ))}
                  <button
                    onClick={() => updateParams({ minRating: undefined, page: 1 })}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Any
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ search: undefined, category: undefined, minPrice: undefined, maxPrice: undefined, minRating: undefined, page: 1 });
                  }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <CardGridSkeleton count={12} />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="h-20 w-20 text-zinc-200 dark:text-zinc-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No properties found</h3>
            <p className="mt-2 text-sm text-zinc-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ListingCard key={item._id} item={item} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
