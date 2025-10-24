"use client";

import { useState, useEffect } from "react";
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
import { UserPlus, Trash2, Loader2, AlertTriangle } from "lucide-react";
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
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Viewer";
  status: "Active" | "Inactive";
  joined: string;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/admin/users");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to UI format
        const transformedUsers: User[] = (data.users || []).map(
          (user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role:
              user.role === "super_admin"
                ? "Super Admin"
                : user.role === "admin"
                ? "Admin"
                : "Viewer",
            status: user.is_active ? "Active" : "Inactive",
            joined: new Date(user.created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          })
        );

        setUsers(transformedUsers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
        console.error("Error fetching users:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const addUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setMessageDialog({
        isOpen: true,
        type: "error",
        title: "Missing Fields",
        message: "Please fill in all required fields (Name and Email)",
      });
      return;
    }

    try {
      // Send confirmation email if checkbox is checked
      if (newUser.sendEmail) {
        console.log("Sending invite email for:", newUser.email);
        const response = await fetch("/api/send-invite-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          }),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          const errorMessage = data.error || data.message || "Unknown error";
          console.error("API Error:", errorMessage);
          setMessageDialog({
            isOpen: true,
            type: "error",
            title: "Failed to Create User",
            message: errorMessage,
          });
          return;
        }
      }

      // Only add to local state after successful API call
      const user: User = {
        id: `user_${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "Active",
        joined: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      setUsers([...users, user]);
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
      const response = await fetch(
        `/api/admin/users?id=${deleteConfirmDialog.userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => u.id !== deleteConfirmDialog.userId));
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
      const roleMap = {
        "Super Admin": "super_admin",
        Admin: "admin",
        Viewer: "viewer",
      };

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: roleConfirmDialog.userId,
          updates: {
            role: roleMap[roleConfirmDialog.newRole],
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      setUsers(
        users.map((u) =>
          u.id === roleConfirmDialog.userId
            ? { ...u, role: roleConfirmDialog.newRole! }
            : u
        )
      );
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
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: statusConfirmDialog.userId,
          updates: {
            isActive: statusConfirmDialog.newStatus === "Active",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      setUsers(
        users.map((u) =>
          u.id === statusConfirmDialog.userId
            ? { ...u, status: statusConfirmDialog.newStatus! }
            : u
        )
      );
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

  return (
    <div className="space-y-6">
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
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addUser}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Create User
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
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
                        key={user.id}
                        className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-accent"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white">
                          {user.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-white">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          {editingRole === user.id ? (
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
                                setEditingRole(user.id);
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
                            {editingRole === user.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openRoleConfirm(user.id, selectedRole)
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
                                      user.id,
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
                                    openDeleteConfirm(user.id, user.name)
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
          )}
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
