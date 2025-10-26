"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { useDropdownOptions } from "@/hooks/use-dropdown-options";

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
  const { options: services, loading: servicesLoading } =
    useDropdownOptions("services");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
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

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.service
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

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
        toast.success(
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

        // Close dialog after 2 seconds
        setTimeout(() => {
          if (onOpenChange) {
            onOpenChange(false);
          }
        }, 2000);
      } else {
        toast.error(data.error || "Failed to submit consultation request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
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

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-4"
          action="#"
          method="POST"
        >
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
              disabled={servicesLoading}
            >
              <SelectTrigger className="w-full">
                {servicesLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading services...
                  </div>
                ) : (
                  <SelectValue placeholder="Select a service" />
                )}
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
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
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-md py-2 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Book Free Consultation"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
