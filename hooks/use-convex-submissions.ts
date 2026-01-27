"use client";

import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Form submission actions (for public forms)
// We use Convex actions instead of mutations so we can send notification emails
// immediately after creating the submission.
export function useConsultationSubmit() {
  const submitConsultation = useAction(api.notifications.submitConsultation);

  return {
    submit: async (data: {
      name: string;
      email: string;
      phone: string;
      service: string;
      message?: string;
    }) => {
      return await submitConsultation(data);
    },
  };
}

export function useQuoteSubmit() {
  const submitQuote = useAction(api.notifications.submitQuote);

  return {
    submit: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      origin: string;
      destination: string;
      shippingMethod: string;
      cargoType: string;
      weight?: string;
      preferredDate?: string;
      notes?: string;
    }) => {
      return await submitQuote(data);
    },
  };
}

export function useContactSubmit() {
  const submitContact = useAction(api.notifications.submitContact);

  return {
    submit: async (data: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }) => {
      return await submitContact(data);
    },
  };
}

// Admin submission mutations
export function useSubmissionMutations() {
  const updateConsultation = useMutation(api.consultations.update);
  const updateQuote = useMutation(api.quotes.update);
  const updateContact = useMutation(api.contacts.update);
  const deleteConsultation = useMutation(api.consultations.remove);
  const deleteQuote = useMutation(api.quotes.remove);
  const deleteContact = useMutation(api.contacts.remove);

  return {
    updateConsultation: async (
      id: Id<"consultations">,
      data: { status?: "new" | "contacted" | "in_progress" | "completed" | "cancelled"; assignedTo?: string }
    ) => {
      return await updateConsultation({ id, ...data });
    },
    updateQuote: async (
      id: Id<"quotes">,
      data: { status?: "new" | "quoted" | "accepted" | "declined" | "completed"; assignedTo?: string }
    ) => {
      return await updateQuote({ id, ...data });
    },
    updateContact: async (
      id: Id<"contacts">,
      data: { status?: "new" | "read" | "responded" | "archived" }
    ) => {
      return await updateContact({ id, ...data });
    },
    deleteConsultation: async (id: Id<"consultations">) => {
      return await deleteConsultation({ id });
    },
    deleteQuote: async (id: Id<"quotes">) => {
      return await deleteQuote({ id });
    },
    deleteContact: async (id: Id<"contacts">) => {
      return await deleteContact({ id });
    },
  };
}
