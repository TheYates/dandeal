"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSkeleton } from "./table-skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Save,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface OfficeLocation {
  city: string;
  region: string;
  country: string;
}

interface Settings {
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  emailPrimary: string;
  emailSupport: string;
  displayPhonePrimary: boolean;
  displayPhoneSecondary: boolean;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  officeLocations: OfficeLocation[];
  businessHours: string;
}

export function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    phonePrimary: "",
    phoneSecondary: "",
    whatsapp: "",
    emailPrimary: "",
    emailSupport: "",
    displayPhonePrimary: true,
    displayPhoneSecondary: false,
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    officeLocations: [
      { city: "", region: "Kumasi", country: "Ghana" },
      { city: "", region: "Obuasi - Ashanti Region", country: "Ghana" },
      { city: "", region: "China Office", country: "China" },
    ],
    businessHours: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOfficeLocationChange = (index: number, city: string) => {
    setSettings((prev) => {
      const updatedLocations = [...prev.officeLocations];
      updatedLocations[index] = { ...updatedLocations[index], city };
      return { ...prev, officeLocations: updatedLocations };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: settings }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Contact & Email */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Manage phone numbers and WhatsApp contact
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="phonePrimary">Primary Phone</Label>
                <Input
                  id="phonePrimary"
                  name="phonePrimary"
                  value={settings.phonePrimary || ""}
                  onChange={handleInputChange}
                  placeholder="+233 25 608 8845"
                  className="mt-1"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="displayPhonePrimary"
                    name="displayPhonePrimary"
                    checked={settings.displayPhonePrimary}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor="displayPhonePrimary"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Display on header
                  </Label>
                </div>
              </div>
              <div>
                <Label htmlFor="phoneSecondary">Secondary Phone</Label>
                <Input
                  id="phoneSecondary"
                  name="phoneSecondary"
                  value={settings.phoneSecondary || ""}
                  onChange={handleInputChange}
                  placeholder="+233 25 608 8846"
                  className="mt-1"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="displayPhoneSecondary"
                    name="displayPhoneSecondary"
                    checked={settings.displayPhoneSecondary}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor="displayPhoneSecondary"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Display on header
                  </Label>
                </div>
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={settings.whatsapp || ""}
                  onChange={handleInputChange}
                  placeholder="+49 15212203183"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Addresses */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle>Email Addresses</CardTitle>
                <CardDescription>
                  Manage primary and support email addresses
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="emailPrimary">Primary Email</Label>
                <Input
                  id="emailPrimary"
                  name="emailPrimary"
                  type="email"
                  value={settings.emailPrimary || ""}
                  onChange={handleInputChange}
                  placeholder="info@dandealimportation.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emailSupport">Support Email</Label>
                <Input
                  id="emailSupport"
                  name="emailSupport"
                  type="email"
                  value={settings.emailSupport || ""}
                  onChange={handleInputChange}
                  placeholder="support@dandealimportation.com"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Links - Full Width */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-orange-600" />
            <div>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage social media profile URLs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={settings.facebookUrl || ""}
                onChange={handleInputChange}
                placeholder="https://facebook.com/dandeal"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={settings.instagramUrl || ""}
                onChange={handleInputChange}
                placeholder="https://instagram.com/dandeal"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                value={settings.linkedinUrl || ""}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/dandeal"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl">Twitter URL</Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                type="url"
                value={settings.twitterUrl || ""}
                onChange={handleInputChange}
                placeholder="https://twitter.com/dandeal"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row - Office Locations & Business Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Office Locations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle>Office Locations</CardTitle>
                <CardDescription>
                  Manage office addresses and locations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {settings.officeLocations.map((location, index) => (
                <div key={index}>
                  <Label htmlFor={`office-${index}`}>
                    {location.region} - {location.country}
                  </Label>
                  <Input
                    id={`office-${index}`}
                    value={location.city}
                    onChange={(e) =>
                      handleOfficeLocationChange(index, e.target.value)
                    }
                    placeholder={
                      index === 0
                        ? "Santasi"
                        : index === 1
                        ? "Mangoase"
                        : "Guangzhou"
                    }
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>
                  Set your business operating hours
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="businessHours">Business Hours</Label>
            <Textarea
              id="businessHours"
              name="businessHours"
              value={settings.businessHours || ""}
              onChange={handleInputChange}
              placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
              rows={3}
              className="mt-1"
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
