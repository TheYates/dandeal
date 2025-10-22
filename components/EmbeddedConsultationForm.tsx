"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmbeddedConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
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
    <div className="bg-white/10 rounded-lg p-6 sm:p-8 w-full max-w-md shadow-lg backdrop-blur-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Book A Free Consultation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label className="text-white text-sm mb-2 block">Name *</Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60"
            required
          />
        </div>

        {/* Email */}
        <div>
          <Label className="text-white text-sm mb-2 block">Email *</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <Label className="text-white text-sm mb-2 block">Phone *</Label>
          <Input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60"
            required
          />
        </div>

        {/* Service Dropdown */}
        <div>
          <Label className="text-white text-sm mb-2 block">
            Service Requested *
          </Label>
          <Select value={formData.service} onValueChange={handleServiceChange}>
            <SelectTrigger className="w-full bg-white/20 border border-white/30 text-white">
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
          <Label className="text-white text-sm mb-2 block">Message</Label>
          <Textarea
            name="message"
            placeholder="Tell us more about your needs..."
            value={formData.message}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60 resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-md py-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Book Free Consultation"}
          <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
        </Button>
      </form>

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
    </div>
  );
}

