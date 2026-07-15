"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import type { Item, ItemsResponse, FilterParams } from "@/types";

export function useItems(initialParams: FilterParams = {}) {
  const [data, setData] = useState<ItemsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<FilterParams>(initialParams);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getItems(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateParams = useCallback((newParams: Partial<FilterParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page || 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return {
    items: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,
    loading,
    error,
    params,
    updateParams,
    setPage,
    refetch: fetchItems,
  };
}

export function useFeaturedItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const result = await api.getItems({ limit: 8, sortBy: "rating", sortOrder: -1 });
        setItems(result.items);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return { items, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await api.getCategories();
        setCategories(result.categories);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading };
}

export function useMyItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getMyItems();
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyItems();
  }, [fetchMyItems]);

  const deleteItem = async (id: string) => {
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { items, loading, error, refetch: fetchMyItems, deleteItem };
}
