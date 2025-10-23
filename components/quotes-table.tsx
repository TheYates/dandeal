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
} from "lucide-react";
import { QuoteDetailDialog } from "./quote-detail-dialog";
import { useSubmissionsCache } from "@/hooks/use-submissions-cache";
import { toast } from "sonner";

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
  createdAt: string;
  updatedAt: string;
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

  const {
    data: quotes,
    loading,
    invalidateCache,
  } = useSubmissionsCache<Quote>("quotes", async () => {
    const response = await fetch("/api/admin/submissions?type=quotes");
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
    const start = id.substring(0, visibleChars / 1);
    const end = id.substring(id.length - visibleChars / 2);
    return `${start}`;
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        quote.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || quote.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || quote.shippingMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [quotes, searchTerm, statusFilter, methodFilter]);

  const updateStatus = async (id: string, newStatus: Quote["status"]) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, type: "quotes" }),
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

  const deleteQuote = async (id: string) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "quotes" }),
      });
      if (response.ok) {
        invalidateCache();
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
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
        new Date(q.createdAt).toLocaleString(),
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quote Requests</CardTitle>
          <CardDescription>
            Manage and track all quote submissions
          </CardDescription>
        </CardHeader>
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
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono" title={quote.id}>
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
                          {new Date(quote.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(quote.createdAt).toLocaleTimeString(
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
                          {new Date(quote.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {new Date(quote.updatedAt).toLocaleTimeString(
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
                              onClick={() => deleteQuote(quote.id)}
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
    </>
  );
}
