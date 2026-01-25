"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useInvitationMutations } from "@/hooks/use-invitations";

interface CreateInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvitationDialog({
  open,
  onOpenChange,
}: CreateInvitationDialogProps) {
  const { data: session } = useSession();
  const { create } = useInvitationMutations();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"super_admin" | "admin" | "viewer">("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const userRole = session?.user?.role as "super_admin" | "admin" | "viewer" | undefined;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    if (!session?.user?.id || !session?.user?.name) {
      toast.error("User session not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create({
        email: email.trim(),
        role,
        invitedBy: session.user.id,
        invitedByName: session.user.name,
      });

      if (result.emailSent) {
        toast.success("Invitation sent successfully");
        setEmail("");
        setRole("admin");
        onOpenChange(false);
      } else {
        toast.error(`Invitation created but email failed: ${result.emailError}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invitation</DialogTitle>
          <DialogDescription>
            Send an invitation to a new admin user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isSubmitting}
              required
            />
            {emailError && (
              <p className="text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "super_admin" | "admin" | "viewer")}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {userRole === "super_admin" && (
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                )}
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            {userRole === "admin" && (
              <p className="text-sm text-muted-foreground">
                Admins can only create Admin and Viewer roles
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
