"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useDashboardDataPrefetch } from "./use-dashboard-data";

// Critical tabs that should be preloaded immediately
const CRITICAL_TABS = ['quotes', 'consultations', 'contacts'];

// Secondary tabs that should be preloaded after a delay
const SECONDARY_TABS = ['users', 'email', 'dropdowns', 'testimonials'];

// Tab sequence patterns for predictive preloading
const TAB_SEQUENCE_PATTERNS: Record<string, string[]> = {
  'quotes': ['consultations', 'contacts', 'email'],
  'consultations': ['quotes', 'email', 'contacts'],
  'contacts': ['quotes', 'consultations', 'email'],
  'email': ['settings', 'quotes', 'consultations'],
  'dropdowns': ['settings', 'quotes'],
  'testimonials': ['settings', 'quotes'],
  'users': ['settings', 'email'],
  'settings': ['email', 'users']
};

interface AdminPreloaderOptions {
  enabled?: boolean;
  criticalDelay?: number;
  secondaryDelay?: number;
}

export function useAdminPreloader(options: AdminPreloaderOptions = {}) {
  const {
    enabled = true,
    criticalDelay = 0,
    secondaryDelay = 1000
  } = options;
  
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { prefetchDashboardData } = useDashboardDataPrefetch();

  // Preload submissions data (quotes, consultations, contacts)
  const prefetchSubmissions = async (type: string) => {
    const queryKey = [type];
    
    // Check if already cached
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            throw new Error("Not authenticated");
          }

          const response = await fetch(`/api/admin/submissions?type=${type}`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const data = await response.json();
          return data.submissions || [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes
      });
    } catch (error) {
      console.warn(`Failed to prefetch ${type}:`, error);
    }
  };

  // Preload dropdown options
  const prefetchDropdowns = async () => {
    const dropdownTypes = ['services', 'shipping_methods', 'cargo_types'];
    
    for (const type of dropdownTypes) {
      const queryKey = ['dropdown-options', type];
      
      // Check if already cached
      const existingData = queryClient.getQueryData(queryKey);
      if (existingData) continue;

      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const response = await fetch(`/api/admin/dropdowns?type=${type}`);
            if (!response.ok) {
              throw new Error("Failed to fetch dropdown options");
            }
            const data = await response.json();
            return data.options || [];
          },
          staleTime: 2 * 60 * 1000,
          gcTime: 5 * 60 * 1000,
        });
      } catch (error) {
        console.warn(`Failed to prefetch ${type} dropdowns:`, error);
      }
    }
  };

  // Preload email settings
  const prefetchEmailSettings = async () => {
    const queryKey = ['email-settings'];
    
    // Check if already cached
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await fetch("/api/admin/email-settings", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch email settings");
          }

          const data = await response.json();
          return data;
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    } catch (error) {
      console.warn("Failed to prefetch email settings:", error);
    }
  };

  // Preload testimonials
  const prefetchTestimonials = async () => {
    const queryKey = ['testimonials'];

    // Check if already cached
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await fetch('/api/testimonials');
          if (!response.ok) {
            throw new Error('Failed to fetch testimonials');
          }
          const data = await response.json();
          return data.testimonials || [];
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    } catch (error) {
      console.warn("Failed to prefetch testimonials:", error);
    }
  };

  // Preload users data
  const prefetchUsers = async () => {
    const queryKey = ['users'];

    // Check if already cached
    const existingData = queryClient.getQueryData(queryKey);
    if (existingData) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await fetch("/api/admin/users", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }

          const data = await response.json();
          return data.users || [];
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    } catch (error) {
      console.warn("Failed to prefetch users:", error);
    }
  };

  // Critical path preloading - most important data using batch endpoint
  useEffect(() => {
    if (!enabled) return;

    const preloadCriticalData = async () => {
      // Wait for specified delay (usually 0 for critical)
      await new Promise(resolve => setTimeout(resolve, criticalDelay));

      // Preload critical submissions data in one batch request
      await prefetchDashboardData(['submissions']);
      console.log('✅ Critical admin data preloaded (batch)');
    };

    preloadCriticalData();
  }, [enabled, criticalDelay, prefetchDashboardData]);

  // Secondary preloading - less critical data using batch endpoint
  useEffect(() => {
    if (!enabled) return;

    const preloadSecondaryData = async () => {
      // Wait for secondary delay to not interfere with critical loading
      await new Promise(resolve => setTimeout(resolve, secondaryDelay));

      // Preload secondary data in batches
      await Promise.allSettled([
        prefetchDashboardData(['dropdowns']),
        prefetchDashboardData(['email']),
        prefetchDashboardData(['testimonials']),
        prefetchDashboardData(['settings']),
      ]);

      // Also preload users specifically
      await prefetchUsers();

      console.log('✅ Secondary admin data preloaded (batch)');
    };

    preloadSecondaryData();
  }, [enabled, secondaryDelay, prefetchDashboardData]);

  // Predictive preloading based on current tab using batch endpoint
  const prefetchForTab = async (currentTab: string) => {
    if (!enabled) return;

    const nextTabs = TAB_SEQUENCE_PATTERNS[currentTab] || [];
    
    // Group tabs by data type for efficient batching
    const dataTypesToPrefetch = new Set<string>();
    
    for (const tab of nextTabs.slice(0, 2)) {
      switch (tab) {
        case 'quotes':
        case 'consultations': 
        case 'contacts':
          dataTypesToPrefetch.add('submissions');
          break;
        case 'dropdowns':
          dataTypesToPrefetch.add('dropdowns');
          break;
        case 'email':
          dataTypesToPrefetch.add('email');
          break;
        case 'testimonials':
          dataTypesToPrefetch.add('testimonials');
          break;
        case 'settings':
          dataTypesToPrefetch.add('settings');
          break;
        case 'users':
          dataTypesToPrefetch.add('users');
          break;
      }
    }
    
    // Prefetch each data type (batched internally)
    for (const dataType of dataTypesToPrefetch) {
      await prefetchDashboardData([dataType]);
    }
  };

  return {
    prefetchForTab,
    prefetchSubmissions,
    prefetchDropdowns,
    prefetchEmailSettings,
    prefetchTestimonials,
    prefetchUsers,
  };
}