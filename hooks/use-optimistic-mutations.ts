"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
// Optimistic status update hook
export function useOptimisticStatusUpdate(dataType: 'quotes' | 'consultations' | 'contacts') {
  const queryKey = ['dashboard-data', 'submissions'];
  
  return useOptimisticUpdate(
    queryKey,
    async (data: Partial<any>) => {
      const { id, status } = data;
      
      // Validate required properties
      if (!id || !status) {
        throw new Error("id and status are required");
      }
      
      const response = await fetch(`/api/admin/submissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
  
  // Invalidate all dashboard-data queries, not just a specific key
  const queryKeyPrefix = ['dashboard-data'];

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('[MUTATION] Starting delete for:', dataType, id);

      console.log('[MUTATION] Sending DELETE request to API...');
      const response = await fetch(`/api/admin/submissions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          type: dataType,
        }),
      });

      console.log('[MUTATION] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[MUTATION] Delete failed:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('[MUTATION] Delete successful:', result);
      return { id };
    },
    onMutate: async (id: string) => {
      console.log('[DELETE] Optimistically removing item:', id);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeyPrefix });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKeyPrefix);

      // Optimistically remove the item from cache
      queryClient.setQueryData(['dashboard-data', 'submissions'], (old: any) => {
        if (!old?.data) return old;

        console.log('[DELETE] Removing from cache:', dataType, id);
        return {
          ...old,
          data: {
            ...old.data,
            [dataType]: old.data[dataType]?.filter((item: any) => item.id !== id) || []
          }
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      console.log('[DELETE] Success - confirming deletion');
      toast.success('Deleted successfully');
    },
    onError: (err, id, context) => {
      console.error('[DELETE] Error - rolling back:', err);
      
      // Rollback to previous data
      if (context?.previousData) {
        queryClient.setQueryData(queryKeyPrefix, context.previousData);
      }
      
      toast.error('Failed to delete: ' + err.message);
    },
    onSettled: () => {
      // Refetch to ensure we're in sync with the server
      console.log('[DELETE] Refetching to sync with server');
      queryClient.invalidateQueries({ queryKey: queryKeyPrefix });
    },
  });
}

// Optimistic mark as read/unread hook
export function useOptimisticReadStatus(dataType: 'contacts' | 'consultations') {
  const supabase = createClient();
  
  const queryKey = ['dashboard-data', 'submissions'];
  
  return useOptimisticUpdate(
    queryKey,
    async (data: Partial<any>) => {
      const { id, is_read } = data;
      
      // Validate required properties
      if (!id || is_read === undefined) {
        throw new Error("id and is_read are required");
      }
      
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
      successMessage: 'Read status updated successfully',
      errorMessage: 'Failed to update read status. Changes reverted.',
    }
  );
}