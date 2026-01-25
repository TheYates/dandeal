"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Admin users management
export function useAdminUsers() {
  const data = useQuery(api.adminUsers.list, {});

  return {
    users: data ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function useAdminUserMutations() {
  const createUser = useMutation(api.adminUsers.create);
  const updateUser = useMutation(api.adminUsers.update);
  const deleteUser = useMutation(api.adminUsers.remove);

  return {
    create: async (data: {
      email: string;
      password: string;
      name: string;
      role?: "super_admin" | "admin" | "viewer";
    }) => {
      return await createUser(data);
    },
    update: async (
      id: Id<"adminUsers">,
      data: {
        email?: string;
        name?: string;
        role?: "super_admin" | "admin" | "viewer";
        isActive?: boolean;
        password?: string;
      }
    ) => {
      return await updateUser({ id, ...data });
    },
    delete: async (id: Id<"adminUsers">) => {
      return await deleteUser({ id });
    },
  };
}

// Dropdown options management
export function useDropdownOptions(type?: "services" | "shipping_methods" | "cargo_types") {
  const data = useQuery(api.dropdownOptions.list, type ? { type } : {});

  return {
    options: data ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function useDropdownMutations() {
  const createOption = useMutation(api.dropdownOptions.create);
  const updateOption = useMutation(api.dropdownOptions.update);
  const deleteOption = useMutation(api.dropdownOptions.remove);

  return {
    create: async (data: {
      type: "services" | "shipping_methods" | "cargo_types";
      label: string;
      value: string;
      order?: string;
    }) => {
      return await createOption(data);
    },
    update: async (
      id: Id<"dropdownOptions">,
      data: {
        label?: string;
        value?: string;
        order?: string;
        isActive?: boolean;
      }
    ) => {
      return await updateOption({ id, ...data });
    },
    delete: async (id: Id<"dropdownOptions">) => {
      return await deleteOption({ id });
    },
  };
}

// Email settings management
export function useEmailSettings() {
  const data = useQuery(api.emailSettings.list, {});

  return {
    settings: data ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function useEmailSettingsMutations() {
  const upsertSetting = useMutation(api.emailSettings.upsert);
  const initSettings = useMutation(api.emailSettings.init);

  return {
    upsert: async (data: {
      formType: string;
      recipientEmails?: string;
      enabled?: boolean;
      subjectTemplate?: string;
      includeFormData?: boolean;
    }) => {
      return await upsertSetting(data);
    },
    init: async () => {
      return await initSettings({});
    },
  };
}

// Email logs
export function useEmailLogs(limit: number = 100) {
  const data = useQuery(api.emailLogs.list, { limit });
  const stats = useQuery(api.emailLogs.stats, {});

  return {
    logs: data ?? [],
    stats: stats ?? { total: 0, sent: 0, failed: 0, pending: 0 },
    isLoading: data === undefined,
    error: null,
  };
}
