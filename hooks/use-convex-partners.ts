"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePartners(activeOnly: boolean = true) {
  const data = useQuery(api.partners.list, { activeOnly });

  return {
    partners: data ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function usePartnerMutations() {
  const createPartner = useMutation(api.partners.create);
  const updatePartner = useMutation(api.partners.update);
  const deletePartner = useMutation(api.partners.remove);

  return {
    create: async (data: {
      name: string;
      icon?: string;
      image?: string;
      order?: string;
    }) => {
      return await createPartner(data);
    },
    update: async (
      id: Id<"partners">,
      data: {
        name?: string;
        icon?: string;
        image?: string;
        order?: string;
        isActive?: boolean;
      }
    ) => {
      return await updatePartner({ id, ...data });
    },
    delete: async (id: Id<"partners">) => {
      return await deletePartner({ id });
    },
  };
}
