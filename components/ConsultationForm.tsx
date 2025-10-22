"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConsultationFormProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ConsultationForm({
  trigger,
  open,
  onOpenChange,
}: ConsultationFormProps) {
  console.log("ConsultationForm component rendered");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [messageDialog, setMessageDialog] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log("Form submitted, data:", formData);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      setMessageDialog({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending request to /api/consultation");
      const response = await fetch("/api/consultation", {
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
            "Thank you! Your consultation request has been submitted successfully. We'll contact you soon.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
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
          message: data.error || "Failed to submit consultation request",
        });
      }
    } catch (error) {
      console.error("Error submitting consultation:", error);
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Book A Free Consultation
          </DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <Label className=" text-sm mb-2 block">Name *</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label className=" text-sm mb-2 block">Email *</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label className=" text-sm mb-2 block">Phone *</Label>
            <Input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* Service Dropdown */}
          <div>
            <Label className=" text-sm mb-2 block">Service Requested *</Label>
            <Select
              value={formData.service}
              onValueChange={handleServiceChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="procurement">
                  International Procurement
                </SelectItem>
                <SelectItem value="customs">Customs Clearance</SelectItem>
                <SelectItem value="warehousing">Warehousing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <Label className=" text-sm mb-2 block">Message</Label>
            <Textarea
              name="message"
              placeholder="Tell us more about your needs..."
              value={formData.message}
              onChange={handleInputChange}
              className="w-full resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-md py-2 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Book Free Consultation"}
          </button>
        </form>
      </DialogContent>

      {/* Message Dialog */}
      <Dialog open={messageDialog.type !== null} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setMessageDialog({ type: null, message: "" });
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className={messageDialog.type === "success" ? "text-green-600" : "text-red-600"}>
              {messageDialog.type === "success" ? "Success!" : "Error"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">{messageDialog.message}</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setMessageDialog({ type: null, message: "" })}
              className={messageDialog.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {messageDialog.type === "success" ? "Close" : "Try Again"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
