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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        alert(
          "Thank you! Your consultation request has been submitted successfully. We'll contact you soon."
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });

        // Close dialog
        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        alert(
          "Error: " + (data.error || "Failed to submit consultation request")
        );
      }
    } catch (error) {
      console.error("Error submitting consultation:", error);
      alert("An error occurred. Please try again later.");
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
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-md py-2 flex items-center justify-center"
          >
            Book Free Consultation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
