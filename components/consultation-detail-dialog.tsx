"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

interface ConsultationDetailDialogProps {
  consultation: Consultation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationDetailDialog({
  consultation,
  open,
  onOpenChange,
}: ConsultationDetailDialogProps) {
  if (!consultation) return null;

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

  const formatDate = (dateString: string) => {
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div>
            <DialogTitle>Consultation Request Details</DialogTitle>
            <p className="text-sm text-slate-500 mt-1">ID: {consultation.id}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm font-medium text-slate-600">Status</span>
            <Badge className={getStatusColor(consultation.status)}>
              {consultation.status
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
                  Name
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {consultation.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {consultation.email}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {consultation.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Service & Message */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Request Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Service Requested
                </p>
                <Badge variant="outline" className="mt-1">
                  {consultation.service}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Message
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded mt-1">
                  {consultation.message || "No message provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Submitted:</span>
              <span className="text-slate-700 font-medium">
                {formatDate(consultation.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Last Updated:</span>
              <span className="text-slate-700 font-medium">
                {formatDate(consultation.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
