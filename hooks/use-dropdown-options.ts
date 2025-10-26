import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface DropdownOption {
  id: string;
  type: string;
  label: string;
  value: string;
  order: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API functions
async function fetchDropdownOptions(type: string): Promise<DropdownOption[]> {
  const response = await fetch(`/api/admin/dropdowns?type=${type}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dropdown options");
  }
  const data = await response.json();
  return data.options || [];
}

async function createDropdownOption({ type, label, value }: { type: string; label: string; value: string }): Promise<DropdownOption> {
  const response = await fetch("/api/admin/dropdowns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, label, value }),
  });

  if (!response.ok) {
    throw new Error("Failed to add option");
  }

  const data = await response.json();
  return data.option;
}

async function patchDropdownOption({ id, updates }: { id: string; updates: Partial<DropdownOption> }): Promise<DropdownOption> {
  const response = await fetch("/api/admin/dropdowns", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) {
    throw new Error("Failed to update option");
  }

  const data = await response.json();
  return data.option;
}

async function removeDropdownOption(id: string): Promise<void> {
  const response = await fetch(`/api/admin/dropdowns?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete option");
  }
}

export function useDropdownOptions(type: string) {
  const queryClient = useQueryClient();

  // Fetch dropdown options
  const { data, isLoading, error } = useQuery({
    queryKey: ["dropdown-options", type],
    queryFn: () => fetchDropdownOptions(type),
    enabled: !!type,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add option mutation
  const addMutation = useMutation({
    mutationFn: createDropdownOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdown-options", type] });
      toast.success("Option added successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add option");
    },
  });

  // Update option mutation
  const updateMutation = useMutation({
    mutationFn: patchDropdownOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdown-options", type] });
      toast.success("Option updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update option");
    },
  });

  // Delete option mutation
  const deleteMutation = useMutation({
    mutationFn: removeDropdownOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdown-options", type] });
      toast.success("Option deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete option");
    },
  });

  return {
    options: data || [],
    loading: isLoading,
    error: error?.message || null,
    addOption: (label: string, value: string) => 
      addMutation.mutateAsync({ type, label, value }),
    updateOption: (id: string, updates: Partial<DropdownOption>) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteOption: (id: string) => deleteMutation.mutateAsync(id),
  };
}

