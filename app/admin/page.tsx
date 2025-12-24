"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Dashboard } from "@/components/admin/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import toast, { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to access the admin dashboard");
        router.push("/sign-in");
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Error logging out");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background">
        <div className="flex">
          {/* Sidebar Skeleton */}
          <div className="w-64 min-h-screen bg-white dark:bg-card border-r border-gray-200 dark:border-border p-6">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 p-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-card rounded-lg p-6 border border-gray-200 dark:border-border">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border p-6">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Dashboard onLogout={handleLogout} />
    </>
  );
}

