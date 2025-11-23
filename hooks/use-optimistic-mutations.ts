"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Generic optimistic update hook
export function useOptimisticUpdate<T extends { id: string }>(
  queryKey: string[],
  mutationFn: (data: Partial<T>) => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (newData: Partial<T>) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.data) return old;

        // For dashboard data structure
        if (queryKey[0] === 'dashboard-data') {
          const dataType = queryKey[1] === 'submissions' ? getDataTypeFromId(newData.id!) : queryKey[1];
          return {
            ...old,
            data: {
              ...old.data,
              [dataType]: old.data[dataType]?.map((item: T) =>
                item.id === newData.id ? { ...item, ...newData } : item
              ) || []
            }
          };
        }

        // For direct array data
        return old.map((item: T) =>
          item.id === newData.id ? { ...item, ...newData } : item
        );
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, context?.previousData);
      
      const errorMessage = options?.errorMessage || 'Operation failed. Changes reverted.';
      toast.error(errorMessage);
      
      options?.onError?.(err);
    },
    onSuccess: (data, variables, context) => {
      const successMessage = options?.successMessage || 'Updated successfully';
      toast.success(successMessage);
      
      options?.onSuccess?.(data);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Helper function to determine data type from ID pattern
function getDataTypeFromId(id: string): string {
  // This is a simple heuristic - adjust based on your ID patterns
  if (id.startsWith('quote_')) return 'quotes';
  if (id.startsWith('consultation_')) return 'consultations';
  if (id.startsWith('contact_')) return 'contacts';
  return 'quotes'; // fallback
}

// Optimistic status update hook
export function useOptimisticStatusUpdate(dataType: 'quotes' | 'consultations' | 'contacts') {
  const supabase = createClient();
  
  const queryKey = ['dashboard-data', 'submissions'];
  
  return useOptimisticUpdate(
    queryKey,
    async ({ id, status }: { id: string; status: string }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const tableName = `${dataType.slice(0, -1)}_submissions`; // quotes -> quote_submissions
      
      const response = await fetch(`/api/admin/submissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id,
          status,
          type: dataType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
    {
      successMessage: `Status updated successfully`,
      errorMessage: 'Failed to update status. Changes reverted.',
    }
  );
}

// Optimistic delete hook
export function useOptimisticDelete(dataType: 'quotes' | 'consultations' | 'contacts') {
  const queryClient = useQueryClient();
  const supabase = createClient();
  
  const queryKey = ['dashboard-data', 'submissions'];

  return useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`/api/admin/submissions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id,
          type: dataType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return { id };
    },
    onMutate: async (deletedId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically remove the item
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            [dataType]: old.data[dataType]?.filter((item: any) => item.id !== deletedId) || []
          }
        };
      });

      return { previousData };
    },
    onError: (err, deletedId, context) => {
      // Rollback
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error('Failed to delete. Item restored.');
    },
    onSuccess: () => {
      toast.success('Deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Optimistic mark as read/unread hook
export function useOptimisticReadStatus(dataType: 'contacts' | 'consultations') {
  const supabase = createClient();
  
  const queryKey = ['dashboard-data', 'submissions'];
  
  return useOptimisticUpdate(
    queryKey,
    async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`/api/admin/submissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id,
          is_read,
          type: dataType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
    {
      successMessage: is_read => `Marked as ${is_read ? 'read' : 'unread'}`,
      errorMessage: 'Failed to update read status. Changes reverted.',
    }
  );
}