"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type QuoteSubmission = {
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
  status: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [submission, setSubmission] = useState<QuoteSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch("/api/admin/submissions?type=quotes");
      const data = await response.json();
      const found = data.submissions?.find((s: any) => s.id === id);
      setSubmission(found || null);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          type: "quote",
          updates: { status: newStatus },
        }),
      });

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchSubmission();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Quote not found</p>
        <Link href="/admin/quotes">
          <Button className="mt-4">Back to Quotes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quotes">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Quote Request Details
          </h1>
          <p className="text-gray-400 mt-1">
            Submitted on {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Request Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Name</p>
                  <p className="text-base font-semibold text-white">
                    {submission.firstName} {submission.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="text-base text-gray-300">{submission.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Phone</p>
                  <p className="text-base text-gray-300">{submission.phone}</p>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Shipment Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Origin</p>
                  <p className="text-base text-gray-300">{submission.origin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Destination
                  </p>
                  <p className="text-base text-gray-300">{submission.destination}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Shipping Method
                  </p>
                  <p className="text-base capitalize text-gray-300">
                    {submission.shippingMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Cargo Type
                  </p>
                  <p className="text-base text-gray-300">{submission.cargoType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Weight/Volume
                  </p>
                  <p className="text-base text-gray-300">
                    {submission.weight || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Preferred Date
                  </p>
                  <p className="text-base text-gray-300">
                    {submission.preferredDate
                      ? new Date(submission.preferredDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Special Requirements
              </h3>
              <p className="text-base bg-gray-900 p-4 rounded-lg text-gray-300">
                {submission.notes || "No special requirements"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status & Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Status & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                Current Status
              </p>
              <Badge className="text-base px-3 py-1">{submission.status}</Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                Update Status
              </p>
              <Select
                value={submission.status}
                onValueChange={updateStatus}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">Last Updated</p>
              <p className="text-sm font-medium text-white">
                {new Date(submission.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
