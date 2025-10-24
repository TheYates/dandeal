import { useState, useEffect } from "react";

export interface SiteSettings {
  phonePrimary: string | null;
  phoneSecondary: string | null;
  whatsapp: string | null;
  emailPrimary: string | null;
  emailSupport: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  officeKumasi: string | null;
  officeObuasi: string | null;
  officeChina: string | null;
  businessHours: string | null;
}

const defaultSettings: SiteSettings = {
  phonePrimary: "+233 25 608 8845",
  phoneSecondary: "+233 25 608 8846",
  whatsapp: "+49 15212203183",
  emailPrimary: "info@dandealimportation.com",
  emailSupport: "support@dandealimportation.com",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  officeKumasi: "Santasi",
  officeObuasi: "Mangoase",
  officeChina: "Guangzhou",
  businessHours: "Monday - Friday: 9:00 AM - 6:00 PM",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/settings");
        
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = await response.json();
        setSettings(data.settings || defaultSettings);
      } catch (err) {
        console.error("Error fetching site settings:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Keep default settings on error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

