"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTestimonials(activeOnly: boolean = true) {
  const data = useQuery(api.testimonials.list, { activeOnly });

  return {
    testimonials: data ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function useTestimonialMutations() {
  const createTestimonial = useMutation(api.testimonials.create);
  const updateTestimonial = useMutation(api.testimonials.update);
  const deleteTestimonial = useMutation(api.testimonials.remove);

  return {
    create: async (data: {
      clientName: string;
      content: string;
      clientTitle?: string;
      clientCompany?: string;
      rating?: string;
      image?: string;
      order?: string;
    }) => {
      return await createTestimonial(data);
    },
    update: async (
      id: Id<"testimonials">,
      data: {
        clientName?: string;
        content?: string;
        clientTitle?: string;
        clientCompany?: string;
        rating?: string;
        image?: string;
        order?: string;
        isActive?: boolean;
      }
    ) => {
      return await updateTestimonial({ id, ...data });
    },
    delete: async (id: Id<"testimonials">) => {
      return await deleteTestimonial({ id });
    },
  };
}
