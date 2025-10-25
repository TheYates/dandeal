"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

interface QuoteDetailDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuoteDetailDialog({
  quote,
  open,
  onOpenChange,
}: QuoteDetailDialogProps) {
  if (!quote) return null;

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div>
            <DialogTitle>Quote Request Details</DialogTitle>
            <p className="text-sm text-slate-500 mt-1">ID: {quote.id}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm font-medium text-slate-600">Status</span>
            <Badge className={getStatusColor(quote.status)}>
              {quote.status
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </Badge>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  First Name
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.firstName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Last Name
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Route */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Shipping Route
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Origin
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.origin}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Destination
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.destination}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Shipping Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Shipping Method
                </p>
                <Badge variant="outline" className="mt-1">
                  {quote.shippingMethod}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Cargo Type
                </p>
                <Badge variant="outline" className="mt-1">
                  {quote.cargoType}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Weight
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.weight || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Preferred Date
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {quote.preferredDate
                    ? new Date(quote.preferredDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          {quote.notes && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                Special Requirements
              </h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                {quote.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Submitted:</span>
              <span className="text-slate-700 font-medium">
                {formatDate(quote.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Last Updated:</span>
              <span className="text-slate-700 font-medium">
                {formatDate(quote.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
