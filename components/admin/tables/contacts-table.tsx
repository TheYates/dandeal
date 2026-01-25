"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/management/table-skeleton";
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
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { ContactDetailDialog } from "@/components/admin/dialogs/contact-detail-dialog";
import { useContactsData } from "@/hooks/use-convex-dashboard";
import { useSubmissionMutations } from "@/hooks/use-convex-submissions";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Contact {
  _id: Id<"contacts">;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "responded" | "archived";
  createdAt: number;
  updatedAt: number;
}

export function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    contactId: string | null;
    contactName: string;
  }>({
    isOpen: false,
    contactId: null,
    contactName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch contacts using Convex
  const {
    data: contacts,
    isLoading: loading,
    error,
    stats
  } = useContactsData();

  // Convex mutation hooks
  const { updateContact, deleteContact: deleteContactMutation } = useSubmissionMutations();

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
    if (!contacts || !Array.isArray(contacts)) return [];
    
    return contacts.filter((contact) => {
      if (!contact) return false;
      
      const matchesSearch = !searchTerm ||
        (contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (contact.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const updateStatus = async (id: Id<"contacts">, newStatus: Contact["status"]) => {
    try {
      await updateContact(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const deleteContact = (id: string, contactName: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      contactId: id,
      contactName: contactName,
    });
  };

  const confirmDeleteContact = async () => {
    if (!deleteConfirmDialog.contactId) return;

    try {
      setIsDeleting(true);
      await deleteContactMutation(deleteConfirmDialog.contactId as Id<"contacts">);
      setDeleteConfirmDialog({
        isOpen: false,
        contactId: null,
        contactName: "",
      });
      toast.success(
        `Contact message from ${deleteConfirmDialog.contactName} deleted successfully`
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Error deleting contact");
    } finally {
      setIsDeleting(false);
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

  const handleRefresh = () => {
    // Convex handles reactivity automatically
    toast.success('Data refreshed');
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
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {String(error)}
            </p>
          </div>
        )}
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
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <TableSkeleton rows={5} columns={7} />
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
                      key={contact._id}
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
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 font-mono"
                          title={contact._id}
                        >
                          {truncateId(contact._id)}
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
                              onClick={() => updateStatus(contact._id, "read")}
                              className="flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Mark as Read
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(contact._id, "responded")
                              }
                              className="flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Mark as Responded
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(contact._id, "archived")
                              }
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                deleteContact(contact._id, contact.name)
                              }
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
              <DialogTitle>Delete Contact Message</DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the contact message from{" "}
            <strong>{deleteConfirmDialog.contactName}</strong>? This action
            cannot be undone.
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmDialog({
                  isOpen: false,
                  contactId: null,
                  contactName: "",
                })
              }
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteContact}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
