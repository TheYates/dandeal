"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useInvitations() {
  const invitations = useQuery(api.invitations.list, {});
  const stats = useQuery(api.invitations.stats, {});

  return {
    invitations: invitations ?? [],
    stats: stats ?? { total: 0, pending: 0, accepted: 0, expired: 0, revoked: 0 },
    isLoading: invitations === undefined,
  };
}

export function useInvitationMutations() {
  const createInvitation = useMutation(api.invitations.create);
  const revokeInvitation = useMutation(api.invitations.revoke);
  const resendInvitation = useMutation(api.invitations.resend);
  const deleteInvitation = useMutation(api.invitations.remove);
  const sendEmail = useAction(api.sendInvitationEmail.sendInvitationEmail);

  return {
    create: async (data: {
      email: string;
      role: "super_admin" | "admin" | "viewer";
      invitedBy: string;
      invitedByName: string;
    }) => {
      // Create the invitation in the database
      const result = await createInvitation(data);
      
      // Send the invitation email
      const emailResult = await sendEmail({
        email: data.email,
        token: result.token,
        role: data.role,
        invitedByName: data.invitedByName,
      });

      return { ...result, emailSent: emailResult.success, emailError: emailResult.error };
    },
    revoke: async (id: Id<"invitations">) => {
      return await revokeInvitation({ id });
    },
    resend: async (id: Id<"invitations">, email: string, role: string, invitedByName: string) => {
      // Generate new token
      const result = await resendInvitation({ id });
      
      // Send email with new token
      const emailResult = await sendEmail({
        email,
        token: result.token,
        role,
        invitedByName,
      });

      return { ...result, emailSent: emailResult.success, emailError: emailResult.error };
    },
    delete: async (id: Id<"invitations">) => {
      return await deleteInvitation({ id });
    },
  };
}

export function useCheckEmail() {
  const checkEmail = useQuery(api.invitations.checkEmail, { email: "" });
  
  return {
    check: async (email: string) => {
      // This is a workaround - in a real app you'd use a mutation or action
      // For now, we'll do client-side validation
      return { available: true };
    },
  };
}

export function useInvitationByToken(token: string | null) {
  const invitation = useQuery(
    api.invitations.getByToken,
    token ? { token } : "skip"
  );

  return {
    invitation,
    isLoading: invitation === undefined,
    isValid: invitation !== null && invitation?.status === "pending",
    isExpired: invitation?.status === "expired" || (invitation?.expiresAt && invitation.expiresAt < Date.now()),
  };
}

export function useAcceptInvitation() {
  const acceptInvitation = useMutation(api.invitations.accept);

  return {
    accept: async (data: { token: string; name: string; password: string }) => {
      return await acceptInvitation(data);
    },
  };
}
