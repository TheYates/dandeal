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
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  CheckCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { QuoteDetailDialog } from "@/components/admin/dialogs/quote-detail-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useQuotesData } from "@/hooks/use-dashboard-data";
import { useOptimisticStatusUpdate, useOptimisticDelete } from "@/hooks/use-optimistic-mutations";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/admin/management/table-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Quote {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  shippingMethod: string;
  cargoType: string;
  weight: string | null;
  preferredDate: string | null;
  notes: string | null;
  status: "new" | "quoted" | "accepted" | "declined" | "completed";
  created_at: string;
  updated_at: string;
}

const shippingMethods = [
  "Land Transport",
  "Air Freight",
  "Sea Freight",
  "Multimodal",
  "Rail Transport",
];

export function QuotesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    quoteId: string | null;
    quoteName: string;
  }>({
    isOpen: false,
    quoteId: null,
    quoteName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch quotes using batched dashboard data
  const {
    data: quotes,
    isLoading: loading,
    error,
    stats
  } = useQuotesData();

  // Optimistic mutation hooks
  const statusUpdateMutation = useOptimisticStatusUpdate('quotes');
  const deleteMutation = useOptimisticDelete('quotes');

  // Legacy invalidateCache function for compatibility
  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
  };

  const toTitleCase = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const truncateId = (id: string, visibleChars: number = 8) => {
    if (id.length <= visibleChars) return id;
    const start = id.substring(0, visibleChars / 1);
    const end = id.substring(id.length - visibleChars / 2);
    return `${start}`;
  };

  const filteredQuotes = useMemo(() => {
    if (!quotes || !Array.isArray(quotes)) return [];
    
    return quotes.filter((quote) => {
      if (!quote) return false;
      
      const matchesSearch = !searchTerm || 
        (quote.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (quote.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (quote.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (quote.phone || '').includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || quote.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || quote.shippingMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [quotes, searchTerm, statusFilter, methodFilter]);

  const updateStatus = async (id: string, newStatus: Quote["status"]) => {
    statusUpdateMutation.mutate({ id, status: newStatus });
  };

  const deleteQuote = (id: string, quoteName: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      quoteId: id,
      quoteName: quoteName,
    });
  };

  const confirmDeleteQuote = async () => {
    if (!deleteConfirmDialog.quoteId) return;

    setIsDeleting(true);
    deleteMutation.mutate(deleteConfirmDialog.quoteId, {
      onSuccess: () => {
        setDeleteConfirmDialog({ isOpen: false, quoteId: null, quoteName: "" });
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
        "Origin",
        "Destination",
        "Method",
        "Cargo Type",
        "Weight",
        "Preferred Date",
        "Special Requirements",
        "Status",
        "Submitted",
      ],
      ...filteredQuotes.map((q) => [
        q.id,
        `${q.firstName} ${q.lastName}`,
        q.email,
        q.phone,
        q.origin,
        q.destination,
        q.shippingMethod,
        q.cargoType,
        q.weight || "",
        q.preferredDate || "",
        q.notes || "",
        q.status,
        new Date(q.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
    toast.success('Data refreshed');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quote Requests</CardTitle>
          <CardDescription>
            Manage and track all quote submissions
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
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 border border-slate-800 rounded-md text-sm bg-white dark:bg-background"
            >
              <option value="all">All Methods</option>
              {shippingMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-800 rounded-md text-sm  bg-white dark:bg-background"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="quoted">Quoted</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
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
                      Route
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-white">
                      Method
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
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="border-b border-slate-200 hover:bg-slate-50 dark:hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedQuote(quote);
                        setDialogOpen(true);
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {quote.firstName} {quote.lastName}
                        </div>
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 font-mono"
                          title={quote.id}
                        >
                          {truncateId(quote.id)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white">
                        {quote.email}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white">
                        <div className="text-xs dark:text-white">
                          {quote.origin}
                        </div>
                        <div className="text-xs dark:text-white">
                          → {quote.destination}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white">
                        {quote.shippingMethod}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(quote.status)}>
                          {toTitleCase(quote.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white text-xs">
                        <div>
                          {new Date(quote.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(quote.created_at).toLocaleTimeString(
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
                          {new Date(quote.updated_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(quote.updated_at).toLocaleTimeString(
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
                                setSelectedQuote(quote);
                                setDialogOpen(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(quote.id, "new")}
                              className="flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Mark New
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(quote.id, "quoted")}
                              className="flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              Mark Quoted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(quote.id, "accepted")}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark Accepted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(quote.id, "declined")}
                              className="flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Mark Declined
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(quote.id, "completed")
                              }
                              className="flex items-center gap-2"
                            >
                              <CheckCheck className="w-4 h-4" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                deleteQuote(
                                  quote.id,
                                  `${quote.firstName} ${quote.lastName}`
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

          {!loading && filteredQuotes.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-300">
              No quote requests found matching your criteria.
            </div>
          )}

          {!loading && (
            <div className="text-xs text-slate-500 dark:text-slate-300 pt-2">
              Showing {filteredQuotes.length} of {quotes.length} submissions
            </div>
          )}
        </CardContent>
      </Card>

      <QuoteDetailDialog
        quote={selectedQuote}
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
              <DialogTitle>Delete Quote</DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the quote from{" "}
            <strong>{deleteConfirmDialog.quoteName}</strong>? This action cannot
            be undone.
          </DialogDescription>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmDialog({
                  isOpen: false,
                  quoteId: null,
                  quoteName: "",
                })
              }
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteQuote}
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
