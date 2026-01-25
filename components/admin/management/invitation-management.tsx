"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useInvitations, useInvitationMutations } from "@/hooks/use-invitations";
import { Id } from "@/convex/_generated/dataModel";
import { CreateInvitationDialog } from "./create-invitation-dialog";
import { InvitationTable } from "./invitation-table";

export function InvitationManagement() {
  const { invitations, stats, isLoading } = useInvitations();
  const { revoke, resend, delete: deleteInvitation } = useInvitationMutations();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [processingId, setProcessingId] = useState<Id<"invitations"> | null>(null);

  const handleResend = async (id: Id<"invitations">, email: string, role: string, invitedByName: string) => {
    setProcessingId(id);
    try {
      const result = await resend(id, email, role, invitedByName);
      if (result.emailSent) {
        toast.success("Invitation resent successfully");
      } else {
        toast.error(`Invitation updated but email failed: ${result.emailError}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevoke = async (id: Id<"invitations">) => {
    setProcessingId(id);
    try {
      await revoke(id);
      toast.success("Invitation revoked successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: Id<"invitations">) => {
    setProcessingId(id);
    try {
      await deleteInvitation(id);
      toast.success("Invitation deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete invitation");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revoked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.revoked}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invitations</CardTitle>
              <CardDescription>Manage admin panel invitations</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invitation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <InvitationTable
            invitations={invitations}
            isLoading={isLoading}
            processingId={processingId}
            onResend={handleResend}
            onRevoke={handleRevoke}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Create Invitation Dialog */}
      <CreateInvitationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
