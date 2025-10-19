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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote form submitted:", formData);
    // Add your form submission logic here
    
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
    
    // Close dialog
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Get Your Quote</DialogTitle>
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
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-semibold text-sm transition-colors"
            >
              Request Quote
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              * Required fields
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

