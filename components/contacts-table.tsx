"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Download,
  Trash2,
  Search,
  Loader2,
  Eye,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { ContactDetailDialog } from "./contact-detail-dialog";
import { useSubmissionsCache } from "@/hooks/use-submissions-cache";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "responded" | "archived";
  createdAt: string;
  updatedAt: string;
}

export function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: contacts,
    loading,
    invalidateCache,
  } = useSubmissionsCache<Contact>("contacts", async () => {
    const response = await fetch("/api/admin/submissions?type=contacts");
    const data = await response.json();
    return data.submissions || [];
  });

  const toTitleCase = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const truncateId = (id: string, visibleChars: number = 8) => {
    if (id.length <= visibleChars) return id;
    return id.substring(0, visibleChars);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const updateStatus = async (id: string, newStatus: Contact["status"]) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, type: "contacts" }),
      });
      if (response.ok) {
        invalidateCache();
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "contacts" }),
      });
      if (response.ok) {
        invalidateCache();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>
            Manage and track all contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-400" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-800 rounded-md text-sm bg-white dark:bg-background"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:bg-background">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Subject
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Submitted
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Last Updated
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-slate-200 hover:bg-slate-50 dark:hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedContact(contact);
                        setDialogOpen(true);
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {contact.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono" title={contact.id}>
                          {truncateId(contact.id)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white">
                        {contact.email}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white">
                        <div className="truncate max-w-xs">
                          {contact.subject}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(contact.status)}>
                          {toTitleCase(contact.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white text-xs">
                        <div>
                          {new Date(contact.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(contact.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white text-xs">
                        <div>
                          {new Date(contact.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(contact.updatedAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedContact(contact);
                                setDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(contact.id, "read")}
                              className="flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Mark as Read
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(contact.id, "responded")
                              }
                              className="flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Mark as Responded
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(contact.id, "archived")
                              }
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteContact(contact.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredContacts.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-300">
              No contact messages found matching your criteria.
            </div>
          )}

          {!loading && (
            <div className="text-xs text-slate-500 dark:text-slate-300 pt-2">
              Showing {filteredContacts.length} of {contacts.length} submissions
            </div>
          )}
        </CardContent>
      </Card>

      <ContactDetailDialog
        contact={selectedContact}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
