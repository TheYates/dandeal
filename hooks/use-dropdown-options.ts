import { useState, useEffect } from "react";

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

export function useDropdownOptions(type: string) {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/dropdowns?type=${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dropdown options");
        }
        const data = await response.json();
        setOptions(data.options || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchOptions();
    }
  }, [type]);

  const addOption = async (label: string, value: string) => {
    try {
      const response = await fetch("/api/admin/dropdowns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, label, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to add option");
      }

      const data = await response.json();
      setOptions([...options, data.option]);
      return data.option;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const updateOption = async (
    id: string,
    updates: Partial<DropdownOption>
  ) => {
    try {
      const response = await fetch("/api/admin/dropdowns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update option");
      }

      const data = await response.json();
      setOptions(
        options.map((opt) => (opt.id === id ? data.option : opt))
      );
      return data.option;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const deleteOption = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/dropdowns?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete option");
      }

      setOptions(options.filter((opt) => opt.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  return {
    options,
    loading,
    error,
    addOption,
    updateOption,
    deleteOption,
  };
}

