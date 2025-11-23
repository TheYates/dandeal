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
  Phone,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { ConsultationDetailDialog } from "@/components/admin/dialogs/consultation-detail-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useConsultationsData } from "@/hooks/use-dashboard-data";
import { useOptimisticStatusUpdate, useOptimisticDelete } from "@/hooks/use-optimistic-mutations";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string | null;
  status: "new" | "contacted" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const services = [
  "Shipping",
  "Logistics",
  "Import",
  "Export",
  "International Procurement",
  "Customs Clearance",
  "Warehousing",
];

export function ConsultationsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    consultationId: string | null;
    consultationName: string;
  }>({
    isOpen: false,
    consultationId: null,
    consultationName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch consultations using batched dashboard data
  const {
    data: consultations,
    isLoading: loading,
    error,
    stats
  } = useConsultationsData();

  // Optimistic mutation hooks
  const statusUpdateMutation = useOptimisticStatusUpdate('consultations');
  const deleteMutation = useOptimisticDelete('consultations');

  // Legacy invalidateCache function for compatibility
  const invalidateCache = () => {
    queryClient.invalidateQueries(['dashboard-data']);
  };

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

  const filteredConsultations = useMemo(() => {
    if (!consultations || !Array.isArray(consultations)) return [];
    
    return consultations.filter((consultation) => {
      if (!consultation) return false;
      
      const matchesSearch = !searchTerm ||
        (consultation.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (consultation.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (consultation.phone || '').includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || consultation.status === statusFilter;
      const matchesService =
        serviceFilter === "all" || consultation.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [consultations, searchTerm, statusFilter, serviceFilter]);

  const updateStatus = async (
    id: string,
    newStatus: Consultation["status"]
  ) => {
    statusUpdateMutation.mutate({ id, status: newStatus });
  };

  const deleteConsultation = (id: string, consultationName: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      consultationId: id,
      consultationName: consultationName,
    });
  };

  const confirmDeleteConsultation = async () => {
    if (!deleteConfirmDialog.consultationId) return;

    setIsDeleting(true);
    deleteMutation.mutate(deleteConfirmDialog.consultationId, {
      onSuccess: () => {
        setDeleteConfirmDialog({
          isOpen: false,
          consultationId: null,
          consultationName: "",
        });
      },
      onSettled: () => {
        setIsDeleting(false);
      }
    });
  };

  const exportData = () => {
    const csv = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Service",
        "Message",
        "Status",
        "Submitted",
      ],
      ...filteredConsultations.map((c) => [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.service,
        c.message || "",
        c.status,
        new Date(c.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consultations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: Consultation["status"]) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Consultation Requests</CardTitle>
          <CardDescription>
            Manage and track all consultation bookings
          </CardDescription>
        </CardHeader>
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error.message}
            </p>
          </div>
        )}
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 border border-slate-800 rounded-md text-sm bg-white dark:bg-background"
            >
              <option value="all">All Services</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-800 rounded-md text-sm bg-white dark:bg-background"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              onClick={exportData}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <TableSkeleton rows={5} columns={8} />
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
                      Service
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Message
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
                  {filteredConsultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="border-b border-slate-200 hover:bg-slate-50 dark:hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedConsultation(consultation);
                        setDialogOpen(true);
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {consultation.name}
                        </div>
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 font-mono"
                          title={consultation.id}
                        >
                          {truncateId(consultation.id)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white">
                        {consultation.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{consultation.service}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white max-w-xs truncate">
                        {consultation.message || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(consultation.status)}>
                          {toTitleCase(consultation.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white text-xs">
                        <div>
                          {new Date(consultation.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(consultation.createdAt).toLocaleTimeString(
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
                          {new Date(consultation.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(consultation.updatedAt).toLocaleTimeString(
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
                                setSelectedConsultation(consultation);
                                setDialogOpen(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(consultation.id, "new")
                              }
                              className="flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Mark New
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(consultation.id, "contacted")
                              }
                              className="flex items-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(consultation.id, "in_progress")
                              }
                              className="flex items-center gap-2"
                            >
                              <Zap className="w-4 h-4" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(consultation.id, "completed")
                              }
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(consultation.id, "cancelled")
                              }
                              className="flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Mark Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                deleteConsultation(
                                  consultation.id,
                                  consultation.name
                                )
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

          {!loading && filteredConsultations.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-300">
              No consultation requests found matching your criteria.
            </div>
          )}

          {!loading && (
            <div className="text-xs text-slate-500 dark:text-slate-300 pt-2">
              Showing {filteredConsultations.length} of {consultations.length}{" "}
              submissions
            </div>
          )}
        </CardContent>
      </Card>

      <ConsultationDetailDialog
        consultation={selectedConsultation}
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
              <DialogTitle>Delete Consultation</DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the consultation from{" "}
            <strong>{deleteConfirmDialog.consultationName}</strong>? This action
            cannot be undone.
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmDialog({
                  isOpen: false,
                  consultationId: null,
                  consultationName: "",
                })
              }
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteConsultation}
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
