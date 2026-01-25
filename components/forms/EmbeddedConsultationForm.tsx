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
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDropdownsData } from "@/hooks/use-convex-dashboard";
import { useConsultationSubmit } from "@/hooks/use-convex-submissions";

export default function EmbeddedConsultationForm() {
  const { services, isLoading: servicesLoading } = useDropdownsData();
  const { submit: submitConsultation } = useConsultationSubmit();
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
    console.log("Form submitted, data:", formData);

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
      await submitConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message || undefined,
      });

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
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6 sm:p-8 w-full max-w-md shadow-lg backdrop-blur-xs">
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
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-gray-200"
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
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-gray-200"
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
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-gray-200"
            required
          />
        </div>

        {/* Service Dropdown */}
        <div>
          <Label className="text-white text-sm mb-2 block">
            Service Requested *
          </Label>
          <Select
            value={formData.service}
            onValueChange={handleServiceChange}
            disabled={servicesLoading}
          >
            <SelectTrigger className="w-full bg-white/20 border border-white/30 text-white">
              <SelectValue
                placeholder={
                  servicesLoading ? "Loading services..." : "Select a service"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service._id} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
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
            className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-gray-200 resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-md py-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Book Free Consultation"
          )}
        </Button>
      </form>
    </div>
  );
}
