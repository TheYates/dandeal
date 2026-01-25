"use client";

import { useState } from "react";
import { useAdminUsers, useAdminUserMutations } from "@/hooks/use-convex-admin";
import { useInvitations, useInvitationMutations } from "@/hooks/use-invitations";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Trash2, Loader2, AlertTriangle, Mail, RefreshCw, XCircle, Clock } from "lucide-react";
import { UserManagementSkeleton } from "@/components/admin/management/table-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle } from "lucide-react";

interface User {
  _id: Id<"adminUsers">;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Viewer";
  status: "Active" | "Inactive";
  joined: string;
}

// Map Convex user to display format
const mapConvexUser = (user: any): User => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role:
    user.role === "super_admin"
      ? "Super Admin"
      : user.role === "admin"
      ? "Admin"
      : "Viewer",
  status: user.isActive ? "Active" : "Inactive",
  joined: new Date(user.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
});

const ROLE_PERMISSIONS = {
  // "Super Admin": {
  //   title: "Full Access",
  //   description: "Can manage all submissions, modify user roles, manage user accounts, and access all settings",
  // },
  Admin: {
    title: "Manage Submissions & Users",
    description:
      "Can view, update, and manage all consultation and quote submissions, and manage user accounts",
  },
  Viewer: {
    title: "Read-Only Access",
    description: "Can only view submissions without making any modifications",
  },
};

export function UserManagement() {
  // Session for getting current user info
  const { data: session } = useSession();
  
  // Convex hooks
  const { users: convexUsers, isLoading, error } = useAdminUsers();
  const { create: createUser, update: updateUser, delete: deleteUser } = useAdminUserMutations();
  
  // Invitation hooks
  const { invitations, stats: invitationStats } = useInvitations();
  const { create: createInvitation, revoke: revokeInvitation, resend: resendInvitation, delete: deleteInvitationRecord } = useInvitationMutations();

  // Map Convex users to display format
  const users = convexUsers?.map(mapConvexUser) || [];
  
  // Filter pending invitations
  const pendingInvitations = invitations.filter(inv => inv.status === "pending");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer" as const,
    sendEmail: true,
  });
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<
    "Super Admin" | "Admin" | "Viewer"
  >("Viewer");
  const [messageDialog, setMessageDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // Confirmation dialogs
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const [roleConfirmDialog, setRoleConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    newRole: "Super Admin" | "Admin" | "Viewer" | null;
  }>({
    isOpen: false,
    userId: null,
    newRole: null,
  });

  const [statusConfirmDialog, setStatusConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
    newStatus: "Active" | "Inactive" | null;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
    newStatus: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const addUser = async () => {
    if (!newUser.email.trim()) {
      setMessageDialog({
        isOpen: true,
        type: "error",
        title: "Missing Fields",
        message: "Please enter an email address",
      });
      return;
    }

    try {
      setIsCreating(true);
      
      // Map role to Convex format
      const roleMap: Record<string, "super_admin" | "admin" | "viewer"> = {
        "Super Admin": "super_admin",
        "Admin": "admin",
        "Viewer": "viewer",
      };
      
      // Create invitation using Convex
      const result = await createInvitation({
        email: newUser.email.trim(),
        role: roleMap[newUser.role],
        invitedBy: session?.user?.id || "unknown",
        invitedByName: session?.user?.name || "Admin",
      });

      if (!result.emailSent) {
        // Invitation created but email failed
        setMessageDialog({
          isOpen: true,
          type: "error",
          title: "Invitation Created, But Email Failed",
          message: `The invitation was created but the email could not be sent: ${result.emailError || "Unknown error"}. You can try resending the email from the pending invitations list.`,
        });
        setNewUser({ name: "", email: "", role: "Viewer", sendEmail: true });
        setIsDialogOpen(false);
        return;
      }

      // Success!
      setNewUser({ name: "", email: "", role: "Viewer", sendEmail: true });
      setIsDialogOpen(false);
      setMessageDialog({
        isOpen: true,
        type: "success",
        title: "User Created Successfully",
        message: `${newUser.name} has been invited. They will receive an email with instructions to set their password.`,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      setMessageDialog({
        isOpen: true,
        type: "error",
        title: "Error Creating User",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      userId: id,
      userName: name,
    });
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirmDialog.userId) return;

    try {
      setIsDeleting(true);
      await deleteUser(deleteConfirmDialog.userId as Id<"adminUsers">);

      setDeleteConfirmDialog({ isOpen: false, userId: null, userName: "" });
      setMessageDialog({
        isOpen: true,
        type: "success",
        title: "User Deleted",
        message: `${deleteConfirmDialog.userName} has been removed from the system.`,
      });
    } catch (error) {
      setMessageDialog({
        isOpen: true,
        type: "error",
        title: "Failed to Delete User",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openRoleConfirm = (
    id: string,
    newRole: "Super Admin" | "Admin" | "Viewer"
  ) => {
    setRoleConfirmDialog({
      isOpen: true,
      userId: id,
      newRole,
    });
  };

  const confirmUpdateRole = async () => {
    if (!roleConfirmDialog.userId || !roleConfirmDialog.newRole) return;

    try {
      setIsUpdating(true);
      const roleMap: Record<string, "super_admin" | "admin" | "viewer"> = {
        "Super Admin": "super_admin",
        Admin: "admin",
        Viewer: "viewer",
      };

      await updateUser(roleConfirmDialog.userId as Id<"adminUsers">, {
        role: roleMap[roleConfirmDialog.newRole],
      });

      setRoleConfirmDialog({ isOpen: false, userId: null, newRole: null });
      setEditingRole(null);
      setMessageDialog({
        isOpen: true,
        type: "success",
        title: "Role Updated",
        message: "User role has been updated successfully.",
      });
    } catch (error) {
      setMessageDialog({
        isOpen: true,
        type: "error",
        title: "Failed to Update Role",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusConfirm = (
    id: string,
    name: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setStatusConfirmDialog({
      isOpen: true,
      userId: id,
      userName: name,
      newStatus,
    });
  };

  const confirmUpdateStatus = async () => {
    if (!statusConfirmDialog.userId || !statusConfirmDialog.newStatus) return;

    try {
      setIsUpdating(true);
      await updateUser(statusConfirmDialog.userId as Id<"adminUsers">, {
        isActive: statusConfirmDialog.newStatus === "Active",
      });

      setStatusConfirmDialog({
        isOpen: false,
        userId: null,
        userName: "",
        newStatus: null,
      });
      setMessageDialog({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `User has been ${
          statusConfirmDialog.newStatus === "Active"
            ? "activated"
            : "deactivated"
        }.`,
      });
    } catch (error) {
      setMessageDialog({
        isOpen: true,
        type: "error",
        title: "Failed to Update Status",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <UserManagementSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Pending Invitations Section */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Invitations ({pendingInvitations.length})
            </CardTitle>
            <CardDescription>
              Users who have been invited but haven't accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Invited By
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Sent
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Expires
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvitations.map((invitation) => {
                    const isExpired = invitation.expiresAt < Date.now();
                    const formatRole = (role: string) => {
                      return role === "super_admin" ? "Super Admin" : 
                             role === "admin" ? "Admin" : "Viewer";
                    };
                    const formatDate = (timestamp: number) => {
                      return new Date(timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    };

                    return (
                      <tr
                        key={invitation._id}
                        className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-accent"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white">
                          {invitation.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {formatRole(invitation.role)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-white">
                          {invitation.invitedByName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-white">
                          {formatDate(invitation.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          {isExpired ? (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Expired
                            </Badge>
                          ) : (
                            <span className="text-slate-600 dark:text-white">
                              {formatDate(invitation.expiresAt)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  await resendInvitation(
                                    invitation._id,
                                    invitation.email,
                                    invitation.role,
                                    invitation.invitedByName
                                  );
                                  toast.success("Invitation resent successfully");
                                } catch (error) {
                                  toast.error("Failed to resend invitation");
                                }
                              }}
                              className="gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Resend
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                try {
                                  await revokeInvitation(invitation._id);
                                  toast.success("Invitation revoked");
                                } catch (error) {
                                  toast.error("Failed to revoke invitation");
                                }
                              }}
                              className="text-red-600 hover:text-red-900 gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Revoke
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>
              Manage user roles and permissions.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                <UserPlus className="w-4 h-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. Choose to send a confirmation email
                  or activate immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="mt-1"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="mt-1"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Role
                  </label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: any) =>
                      setNewUser({ ...newUser, role: value })
                    }
                    disabled={isCreating}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sendEmail"
                    checked={newUser.sendEmail}
                    onCheckedChange={(checked) =>
                      setNewUser({ ...newUser, sendEmail: checked as boolean })
                    }
                    disabled={isCreating}
                  />
                  <label
                    htmlFor="sendEmail"
                    className="text-sm text-slate-700 dark:text-slate-100 cursor-pointer"
                  >
                    Send confirmation email (user must verify and change
                    password before signing in)
                  </label>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Note:</strong> New users will be required to change
                    their password on first login for security purposes.
                  </p>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addUser}
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        <CardContent>
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role !== "Super Admin")
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-accent"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white">
                          {user.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-white">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          {editingRole === user._id ? (
                            <Select
                              value={selectedRole}
                              onValueChange={(value: any) =>
                                setSelectedRole(value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => {
                                setEditingRole(user._id);
                                setSelectedRole(user.role);
                              }}
                            >
                              {user.role}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              user.status === "Active" ? "default" : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-white">
                          {user.joined}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {editingRole === user._id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openRoleConfirm(user._id, selectedRole)
                                  }
                                  className="bg-green-500 hover:bg-green-600"
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingRole(null)}
                                  disabled={isUpdating}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openStatusConfirm(
                                      user._id,
                                      user.name,
                                      user.status
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  {user.status === "Active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    openDeleteConfirm(user._id, user.name)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>

      {/* Role Permissions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Understanding different admin roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(Object.entries(ROLE_PERMISSIONS) as Array<[string, any]>).map(
              ([role, perms]) => (
                <div
                  key={role}
                  className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0"
                >
                  <div className="font-semibold text-slate-900 dark:text-white min-w-24">
                    {role}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {perms.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {perms.description}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteConfirmDialog({
            ...deleteConfirmDialog,
            isOpen: open,
          })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <DialogTitle>Delete User</DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{deleteConfirmDialog.userName}</strong>? This action cannot
            be undone.
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmDialog({
                  isOpen: false,
                  userId: null,
                  userName: "",
                })
              }
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={roleConfirmDialog.isOpen}
        onOpenChange={(open) =>
          setRoleConfirmDialog({
            ...roleConfirmDialog,
            isOpen: open,
          })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to change this user's role to{" "}
            <strong>{roleConfirmDialog.newRole}</strong>?
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setRoleConfirmDialog({
                  isOpen: false,
                  userId: null,
                  newRole: null,
                })
              }
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUpdateRole}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={statusConfirmDialog.isOpen}
        onOpenChange={(open) =>
          setStatusConfirmDialog({
            ...statusConfirmDialog,
            isOpen: open,
          })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to{" "}
            <strong>
              {statusConfirmDialog.newStatus === "Active"
                ? "activate"
                : "deactivate"}
            </strong>{" "}
            <strong>{statusConfirmDialog.userName}</strong>?
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setStatusConfirmDialog({
                  isOpen: false,
                  userId: null,
                  userName: "",
                  newStatus: null,
                })
              }
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUpdateStatus}
              className={
                statusConfirmDialog.newStatus === "Active"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={messageDialog.isOpen}
        onOpenChange={(open) =>
          setMessageDialog({ ...messageDialog, isOpen: open })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {messageDialog.type === "success" ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <DialogTitle>{messageDialog.title}</DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {messageDialog.message}
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() =>
                setMessageDialog({ ...messageDialog, isOpen: false })
              }
              className={
                messageDialog.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {messageDialog.type === "success" ? "Great!" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
