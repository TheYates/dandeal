"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface QuoteFormProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function QuoteForm({
  trigger,
  open,
  onOpenChange,
}: QuoteFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    shippingMethod: "",
    cargoType: "",
    weight: "",
    date: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [messageDialog, setMessageDialog] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log("Quote form submitted, data:", formData);

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.origin || !formData.destination || !formData.shippingMethod || !formData.cargoType) {
      setMessageDialog({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending request to /api/quote");
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Show success message
        setMessageDialog({
          type: "success",
          message:
            "Thank you! Your quote request has been submitted successfully. We'll get back to you soon.",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          origin: "",
          destination: "",
          shippingMethod: "",
          cargoType: "",
          weight: "",
          date: "",
          notes: "",
        });

        // Close dialog after 2 seconds
        setTimeout(() => {
          if (onOpenChange) {
            onOpenChange(false);
          }
          setMessageDialog({ type: null, message: "" });
        }, 2000);
      } else {
        setMessageDialog({
          type: "error",
          message: data.error || "Failed to submit quote request",
        });
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      setMessageDialog({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Get Your Quote
          </DialogTitle>
          <DialogDescription>
            Fill out the form and we'll contact you shortly with a customized
            shipping solution.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Contact Information Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  First Name *
                </Label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Last Name *
                </Label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-700 text-xs mb-1 block">
                  Email Address *
                </Label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-700 text-xs mb-1 block">
                  Phone Number *
                </Label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipment Details Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Shipment Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Origin Location *
                </Label>
                <input
                  type="text"
                  name="origin"
                  placeholder="Origin Location"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Destination Location *
                </Label>
                <input
                  type="text"
                  name="destination"
                  placeholder="Destination Location"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Shipping Method *
                </Label>
                <select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                  required
                >
                  <option value="">Select Method</option>
                  <option value="air">Air Freight</option>
                  <option value="sea">Sea Freight</option>
                  <option value="land">Land Transport</option>
                  <option value="multimodal">Multimodal</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Cargo Type *
                </Label>
                <input
                  type="text"
                  name="cargoType"
                  placeholder="Cargo Type"
                  value={formData.cargoType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Weight/Volume
                </Label>
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight/Volume"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <Label className="text-gray-700 text-xs mb-1 block">
                  Preferred Date
                </Label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Additional Information
            </h4>
            <Label className="text-gray-700 text-xs mb-1 block">
              Special Requirements
            </Label>
            <textarea
              name="notes"
              placeholder="Special requirements or additional notes..."
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Request Quote"}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              * Required fields
            </p>
          </div>
        </form>
      </DialogContent>

      {/* Message Dialog */}
      <Dialog
        open={messageDialog.type !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setMessageDialog({ type: null, message: "" });
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle
              className={
                messageDialog.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {messageDialog.type === "success" ? "Success!" : "Error"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">{messageDialog.message}</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setMessageDialog({ type: null, message: "" })}
              className={
                messageDialog.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {messageDialog.type === "success" ? "Close" : "Try Again"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
