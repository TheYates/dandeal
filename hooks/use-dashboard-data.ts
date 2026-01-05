"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

interface DashboardData {
  quotes?: any[];
  consultations?: any[];
  contacts?: any[];
  services?: any[];
  shipping_methods?: any[];
  cargo_types?: any[];
  email_settings?: any;
  email_logs?: any[];
  testimonials?: any[];
  site_settings?: any[];
  partners?: any[];
  users?: any[];
}

interface DashboardStats {
  totalQuotes: number;
  pendingQuotes: number;
  totalConsultations: number;
  pendingConsultations: number;
  totalContacts: number;
  unreadContacts: number;
  totalTestimonials: number;
  publishedTestimonials: number;
  lastUpdated: string;
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  stats: DashboardStats;
  metadata: {
    timestamp: string;
    requestedData: string[];
    fetchedKeys: string[];
    errors?: Record<string, string>;
  };
}

interface UseDashboardDataOptions {
  include?: string[];
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const {
    include = ['submissions', 'dropdowns'],
    enabled = true,
    staleTime = 2 * 60 * 1000,  // 2 minutes
    gcTime = 10 * 60 * 1000,    // 10 minutes
  } = options;

  return useQuery<DashboardResponse>({
    queryKey: ['dashboard-data', ...include.sort()],
    queryFn: async () => {
      const params = new URLSearchParams({
        include: include.join(',')
      });

      const response = await fetch(`/api/admin/dashboard-data?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
    enabled,
    staleTime,
    gcTime,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Helper hooks for specific data types with optimized selectors
export function useQuotesData() {
  const { data, isLoading, error } = useDashboardData({
    include: ['submissions']
  });

  return {
    data: data?.data?.quotes || [],
    isLoading,
    error,
    stats: {
      total: data?.stats?.totalQuotes || 0,
      pending: data?.stats?.pendingQuotes || 0,
    }
  };
}

export function useConsultationsData() {
  const { data, isLoading, error } = useDashboardData({
    include: ['submissions']
  });

  return {
    data: data?.data?.consultations || [],
    isLoading,
    error,
    stats: {
      total: data?.stats?.totalConsultations || 0,
      pending: data?.stats?.pendingConsultations || 0,
    }
  };
}

export function useContactsData() {
  const { data, isLoading, error } = useDashboardData({
    include: ['submissions']
  });

  return {
    data: data?.data?.contacts || [],
    isLoading,
    error,
    stats: {
      total: data?.stats?.totalContacts || 0,
      unread: data?.stats?.unreadContacts || 0,
    }
  };
}

export function useDropdownsData() {
  const { data, isLoading, error } = useDashboardData({
    include: ['dropdowns']
  });

  return {
    services: data?.data?.services || [],
    shipping_methods: data?.data?.shipping_methods || [],
    cargo_types: data?.data?.cargo_types || [],
    isLoading,
    error,
  };
}

export function useEmailData() {
  const { data, isLoading, error } = useDashboardData({
    include: ['email']
  });

  return {
    settings: data?.data?.email_settings || {},
    logs: data?.data?.email_logs || [],
    isLoading,
    error,
  };
}

export function useTestimonialsData() {
  const { data, isLoading, error } = useDashboardData({
    include: ['testimonials']
  });

  return {
    data: data?.data?.testimonials || [],
    isLoading,
    error,
    stats: {
      total: data?.stats?.totalTestimonials || 0,
      published: data?.stats?.publishedTestimonials || 0,
    }
  };
}

// Prefetch helper for the new batch endpoint
export function useDashboardDataPrefetch() {
  const queryClient = useQueryClient();

  const prefetchDashboardData = async (include: string[] = ['submissions', 'dropdowns']) => {
    const queryKey = ['dashboard-data', ...include.sort()];
    
    // Check if already cached
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const params = new URLSearchParams({
            include: include.join(',')
          });

          const response = await fetch(`/api/admin/dashboard-data?${params}`);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          return response.json();
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    } catch (error) {
      console.warn('Failed to prefetch dashboard data:', error);
    }
  };

  return { prefetchDashboardData };
}