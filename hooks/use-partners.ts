import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Partner } from "@/lib/db/schema";
import { toast } from "sonner";

// API functions
async function fetchPartners(): Promise<Partner[]> {
  const response = await fetch("/api/admin/partners");
  const data = await response.json();
  return data.partners || [];
}

async function createPartner({ name, icon, image }: { name: string; icon?: string; image?: string }): Promise<Partner> {
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
  return data.partner;
}

async function patchPartner({ id, updates }: { id: string; updates: { name?: string; icon?: string; image?: string; isActive?: boolean } }): Promise<Partner> {
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
  return data.partner;
}

async function removePartner(id: string): Promise<void> {
  const response = await fetch("/api/admin/partners", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete partner");
  }
}

export function usePartners() {
  const queryClient = useQueryClient();

  // Fetch partners
  const { data, isLoading, error } = useQuery({
    queryKey: ["partners"],
    queryFn: fetchPartners,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add partner mutation
  const addMutation = useMutation({
    mutationFn: createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner added successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add partner");
    },
  });

  // Update partner mutation
  const updateMutation = useMutation({
    mutationFn: patchPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update partner");
    },
  });

  // Delete partner mutation
  const deleteMutation = useMutation({
    mutationFn: removePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete partner");
    },
  });

  return {
    partners: data || [],
    loading: isLoading,
    error: error?.message || null,
    addPartner: (name: string, icon?: string, image?: string) => 
      addMutation.mutateAsync({ name, icon, image }),
    updatePartner: (id: string, updates: { name?: string; icon?: string; image?: string; isActive?: boolean }) =>
      updateMutation.mutateAsync({ id, updates }),
    deletePartner: (id: string) => deleteMutation.mutateAsync(id),
    refetch: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  };
}

