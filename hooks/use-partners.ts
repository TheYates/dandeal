import { useState, useEffect } from "react";
import { Partner } from "@/lib/db/schema";
import { toast } from "sonner";

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/partners");
      const data = await response.json();
      setPartners(data.partners || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch partners";
      setError(errorMessage);
      console.error("Error fetching partners:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPartner = async (name: string, icon?: string, image?: string) => {
    try {
      const response = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, image }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add partner");
      }

      const data = await response.json();
      setPartners([...partners, data.partner]);
      toast.success("Partner added successfully");
      return data.partner;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add partner";
      toast.error(errorMessage);
      throw err;
    }
  };

  const updatePartner = async (
    id: string,
    updates: { name?: string; icon?: string; image?: string; isActive?: boolean }
  ) => {
    try {
      const response = await fetch("/api/admin/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update partner");
      }

      const data = await response.json();
      setPartners(
        partners.map((p) => (p.id === id ? data.partner : p))
      );
      toast.success("Partner updated successfully");
      return data.partner;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update partner";
      toast.error(errorMessage);
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const response = await fetch("/api/admin/partners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete partner");
      }

      setPartners(partners.filter((p) => p.id !== id));
      toast.success("Partner deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete partner";
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    partners,
    loading,
    error,
    addPartner,
    updatePartner,
    deletePartner,
    refetch: fetchPartners,
  };
}

