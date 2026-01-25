"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UseDashboardDataOptions {
  include?: string[];
  enabled?: boolean;
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { include = ["submissions", "dropdowns"], enabled = true } = options;

  const data = useQuery(
    api.dashboard.getData,
    enabled ? { include } : "skip"
  );

  return {
    data: data ?? undefined,
    isLoading: data === undefined,
    error: null, // Convex handles errors differently
  };
}

// Helper hooks for specific data types
export function useQuotesData() {
  const data = useQuery(api.quotes.list, { limit: 50 });
  const counts = useQuery(api.quotes.countByStatus, {});

  return {
    data: data ?? [],
    isLoading: data === undefined,
    error: null,
    stats: {
      total: counts?.total ?? 0,
      pending: counts?.pending ?? 0,
    },
  };
}

export function useConsultationsData() {
  const data = useQuery(api.consultations.list, { limit: 50 });
  const counts = useQuery(api.consultations.countByStatus, {});

  return {
    data: data ?? [],
    isLoading: data === undefined,
    error: null,
    stats: {
      total: counts?.total ?? 0,
      pending: counts?.pending ?? 0,
    },
  };
}

export function useContactsData() {
  const data = useQuery(api.contacts.list, { limit: 50 });
  const counts = useQuery(api.contacts.countByStatus, {});

  return {
    data: data ?? [],
    isLoading: data === undefined,
    error: null,
    stats: {
      total: counts?.total ?? 0,
      unread: counts?.unread ?? 0,
    },
  };
}

export function useDropdownsData() {
  const data = useQuery(api.dropdownOptions.listGrouped, { activeOnly: true });

  return {
    services: data?.services ?? [],
    shipping_methods: data?.shipping_methods ?? [],
    cargo_types: data?.cargo_types ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function useEmailData() {
  const settings = useQuery(api.emailSettings.list, {});
  const logs = useQuery(api.emailLogs.list, { limit: 100 });

  return {
    settings: settings ?? [],
    logs: logs ?? [],
    isLoading: settings === undefined || logs === undefined,
    error: null,
  };
}

export function useTestimonialsAdminData() {
  const data = useQuery(api.testimonials.list, {});
  const counts = useQuery(api.testimonials.counts, {});

  return {
    data: data ?? [],
    isLoading: data === undefined,
    error: null,
    stats: {
      total: counts?.total ?? 0,
      published: counts?.published ?? 0,
    },
  };
}
