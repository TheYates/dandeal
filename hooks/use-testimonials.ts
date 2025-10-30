import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  content: string;
  rating: string;
  image?: string;
  order: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/testimonials");

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTestimonial = useCallback(
    async (
      clientName: string,
      content: string,
      clientTitle?: string,
      clientCompany?: string,
      rating?: string,
      image?: string
    ) => {
      try {
        const response = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName,
            clientTitle,
            clientCompany,
            content,
            rating: rating || "5",
            image,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add testimonial");
        }

        const data = await response.json();
        setTestimonials((prev) => [data.testimonial, ...prev]);
        toast.success("Testimonial added successfully");
        return data.testimonial;
      } catch (error) {
        console.error("Error adding testimonial:", error);
        toast.error("Failed to add testimonial");
        throw error;
      }
    },
    []
  );

  const updateTestimonial = useCallback(
    async (id: string, updates: Partial<Testimonial>) => {
      try {
        const response = await fetch("/api/admin/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, updates }),
        });

        if (!response.ok) {
          throw new Error("Failed to update testimonial");
        }

        const data = await response.json();
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? data.testimonial : t))
        );
        toast.success("Testimonial updated successfully");
        return data.testimonial;
      } catch (error) {
        console.error("Error updating testimonial:", error);
        toast.error("Failed to update testimonial");
        throw error;
      }
    },
    []
  );

  const deleteTestimonial = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success("Testimonial deleted successfully");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
      throw error;
    }
  }, []);

  return {
    testimonials,
    loading,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
}

