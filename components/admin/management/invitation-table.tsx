"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RefreshCw, Ban, Trash2, Search } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { TableSkeleton } from "./table-skeleton";

interface Invitation {
  _id: Id<"invitations">;
  email: string;
  role: "super_admin" | "admin" | "viewer";
  status: "pending" | "accepted" | "expired" | "revoked";
  invitedBy: string;
  invitedByName: string;
  expiresAt: number;
  acceptedAt?: number;
  createdAt: number;
}

interface InvitationTableProps {
  invitations: Invitation[];
  isLoading: boolean;
  processingId: Id<"invitations"> | null;
  onResend: (id: Id<"invitations">, email: string, role: string, invitedByName: string) => void;
  onRevoke: (id: Id<"invitations">) => void;
  onDelete: (id: Id<"invitations">) => void;
}

export function InvitationTable({
  invitations,
  isLoading,
  processingId,
  onResend,
  onRevoke,
  onDelete,
}: InvitationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"createdAt" | "expiresAt">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredInvitations = useMemo(() => {
    let filtered = invitations.filter((invitation) => {
      const matchesSearch =
        !searchTerm ||
        invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.invitedByName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const multiplier = sortDirection === "asc" ? 1 : -1;
      return (aValue - bValue) * multiplier;
    });

    return filtered;
  }, [invitations, searchTerm, sortField, sortDirection]);

  const toggleSort = (field: "createdAt" | "expiresAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
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

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: "default", label: "Pending" },
      accepted: { variant: "default", label: "Accepted" },
      expired: { variant: "secondary", label: "Expired" },
      revoked: { variant: "destructive", label: "Revoked" },
    };

    const config = variants[status] || { variant: "default", label: status };
    
    return (
      <Badge 
        variant={config.variant}
        className={
          status === "pending" ? "bg-yellow-600 hover:bg-yellow-700" :
          status === "accepted" ? "bg-green-600 hover:bg-green-700" :
          status === "expired" ? "bg-gray-600 hover:bg-gray-700" :
          ""
        }
      >
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or inviter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                Created {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("expiresAt")}
              >
                Expires {sortField === "expiresAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No invitations found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvitations.map((invitation) => (
                <TableRow key={invitation._id}>
                  <TableCell className="font-medium">{invitation.email}</TableCell>
                  <TableCell>{formatRole(invitation.role)}</TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>{invitation.invitedByName}</TableCell>
                  <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                  <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={processingId === invitation._id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {invitation.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                onResend(
                                  invitation._id,
                                  invitation.email,
                                  invitation.role,
                                  invitation.invitedByName
                                )
                              }
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRevoke(invitation._id)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Revoke
                            </DropdownMenuItem>
                          </>
                        )}
                        {invitation.status !== "pending" && (
                          <DropdownMenuItem
                            onClick={() => onDelete(invitation._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
