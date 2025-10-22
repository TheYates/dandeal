"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";

type AdminUser = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function SettingsPage() {
  const { user } = useUser();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data.users || []);

        // Find current user's role
        const currentUser = data.users?.find(
          (u: AdminUser) => u.clerkUserId === user?.id
        );
        if (currentUser) {
          setCurrentUserRole(currentUser.role);
        }
      } else if (response.status === 403) {
        toast.error("You don't have permission to manage users");
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          updates: { role: newRole },
        }),
      });

      if (response.ok) {
        toast.success("User role updated successfully");
        fetchAdminUsers();
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("An error occurred");
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          updates: { isActive: !currentStatus },
        }),
      });

      if (response.ok) {
        toast.success(
          `User ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
        fetchAdminUsers();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "default";
      case "viewer":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (currentUserRole !== "super_admin" && !loading) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">
          You need super admin privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage admin users and permissions</p>
      </div>

      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Admin Users</CardTitle>
          <CardDescription className="text-gray-400">
            Manage user roles and permissions. Only super admins can modify user
            roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No admin users found
                    </TableCell>
                  </TableRow>
                ) : (
                  adminUsers.map((adminUser) => (
                    <TableRow key={adminUser.id}>
                      <TableCell className="font-medium">
                        {adminUser.name}
                      </TableCell>
                      <TableCell>{adminUser.email}</TableCell>
                      <TableCell>
                        <Select
                          value={adminUser.role}
                          onValueChange={(value) =>
                            updateUserRole(adminUser.id, value)
                          }
                          disabled={adminUser.clerkUserId === user?.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">
                              Super Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={adminUser.isActive ? "default" : "secondary"}
                        >
                          {adminUser.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(adminUser.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleUserStatus(adminUser.id, adminUser.isActive)
                          }
                          disabled={adminUser.clerkUserId === user?.id}
                        >
                          {adminUser.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Role Permissions</CardTitle>
          <CardDescription className="text-gray-400">Understanding different admin roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive" className="mt-1">
                Super Admin
              </Badge>
              <div>
                <p className="font-medium text-white">Full Access</p>
                <p className="text-sm text-gray-400">
                  Can manage all submissions, modify user roles, and access all
                  settings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-1">
                Admin
              </Badge>
              <div>
                <p className="font-medium text-white">Manage Submissions</p>
                <p className="text-sm text-gray-400">
                  Can view, update, and manage all consultation and quote
                  submissions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-1">
                Viewer
              </Badge>
              <div>
                <p className="font-medium text-white">Read-Only Access</p>
                <p className="text-sm text-gray-400">
                  Can only view submissions without making any modifications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
