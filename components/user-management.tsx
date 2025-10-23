"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Trash2, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface User {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Viewer"
  status: "Active" | "Inactive"
  joined: string
}

const ROLE_PERMISSIONS = {
  "Super Admin": {
    title: "Full Access",
    description: "Can manage all submissions, modify user roles, and access all settings",
  },
  Admin: {
    title: "Manage Submissions",
    description: "Can view, update, and manage all consultation and quote submissions",
  },
  Viewer: {
    title: "Read-Only Access",
    description: "Can only view submissions without making any modifications",
  },
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "hhh.3nree@gmail.com",
      role: "Super Admin",
      status: "Active",
      joined: "Oct 22, 2025, 06:24 PM",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Viewer" as const,
    sendEmail: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<"Super Admin" | "Admin" | "Viewer">("Viewer")

  const addUser = () => {
    if (newUser.name.trim() && newUser.email.trim() && newUser.password.trim()) {
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
      }
      setUsers([...users, user])
      setNewUser({ name: "", email: "", password: "", role: "Viewer", sendEmail: true })
      setIsDialogOpen(false)
    }
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const updateUserRole = (id: string, newRole: "Super Admin" | "Admin" | "Viewer") => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)))
    setEditingRole(null)
  }

  const toggleUserStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)))
  }

  return (
    <div className="space-y-6">
      {/* Admin Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>
              Manage user roles and permissions. Only super admins can modify user roles.
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
                <DialogTitle>Invite New Admin User</DialogTitle>
                <DialogDescription>
                  Create a new admin user account. Choose to send a confirmation email or activate immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Name</label>
                  <Input
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Email</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Password</label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Role</label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sendEmail"
                    checked={newUser.sendEmail}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, sendEmail: checked as boolean })}
                  />
                  <label htmlFor="sendEmail" className="text-sm text-slate-700 dark:text-slate-100 cursor-pointer">
                    Send confirmation email (user must verify before signing in)
                  </label>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addUser} className="bg-orange-500 hover:bg-orange-600">
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-accent">
                    <td className="py-3 px-4 text-slate-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-white">{user.email}</td>
                    <td className="py-3 px-4">
                      {editingRole === user.id ? (
                        <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => {
                            setEditingRole(user.id)
                            setSelectedRole(user.role)
                          }}
                        >
                          {user.role}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-white">{user.joined}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {editingRole === user.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateUserRole(user.id, selectedRole)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingRole(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toggleUserStatus(user.id)}>
                              {user.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
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
            {(Object.entries(ROLE_PERMISSIONS) as Array<[string, any]>).map(([role, perms]) => (
              <div key={role} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                <div className="font-semibold text-slate-900 dark:text-white min-w-24">{role}</div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{perms.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{perms.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
