import { useQuery } from "@tanstack/react-query";

export interface SiteSettings {
  phonePrimary: string | null;
  phoneSecondary: string | null;
  whatsapp: string | null;
  whatsappLabel: string | null;
  showWhatsappInHeader?: boolean;
  emailPrimary: string | null;
  emailSupport: string | null;
  displayPhonePrimary?: boolean;
  displayPhoneSecondary?: boolean;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  displayFacebook?: boolean;
  displayInstagram?: boolean;
  displayLinkedin?: boolean;
  displayTwitter?: boolean;
  displayTiktok?: boolean;
  officeKumasi: string | null;
  officeObuasi: string | null;
  officeChina: string | null;
  businessHours: string | null;
}

const defaultSettings: SiteSettings = {
  phonePrimary: "+233 25 608 8845",
  phoneSecondary: "+233 25 608 8846",
  whatsapp: "+49 15212203183",
  whatsappLabel: "WhatsApp Us",
  emailPrimary: "info@dandealimportation.com",
  emailSupport: "support@dandealimportation.com",
  displayPhonePrimary: true,
  displayPhoneSecondary: false,
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  tiktokUrl: "",
  displayFacebook: true,
  displayInstagram: true,
  displayLinkedin: true,
  displayTwitter: true,
  displayTiktok: true,
  officeKumasi: "Santasi",
  officeObuasi: "Mangoase",
  officeChina: "Guangzhou",
  businessHours: "Monday - Friday: 9:00 AM - 6:00 PM",
};

// Helper function to normalize settings from API response
function normalizeSettings(data: any): SiteSettings {
  // If data has officeLocations array, convert to individual fields
  if (data.officeLocations && Array.isArray(data.officeLocations)) {
    return {
      phonePrimary: data.phonePrimary || null,
      phoneSecondary: data.phoneSecondary || null,
      whatsapp: data.whatsapp || null,
      whatsappLabel: data.whatsappLabel || null,
      showWhatsappInHeader: data.showWhatsappInHeader ?? false,
      emailPrimary: data.emailPrimary || null,
      emailSupport: data.emailSupport || null,
      displayPhonePrimary: data.displayPhonePrimary ?? true,
      displayPhoneSecondary: data.displayPhoneSecondary ?? false,
      facebookUrl: data.facebookUrl || null,
      instagramUrl: data.instagramUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      twitterUrl: data.twitterUrl || null,
      tiktokUrl: data.tiktokUrl || null,
      displayFacebook: data.displayFacebook ?? true,
      displayInstagram: data.displayInstagram ?? true,
      displayLinkedin: data.displayLinkedin ?? true,
      displayTwitter: data.displayTwitter ?? true,
      displayTiktok: data.displayTiktok ?? true,
      officeKumasi: data.officeLocations[0]?.city || null,
      officeObuasi: data.officeLocations[1]?.city || null,
      officeChina: data.officeLocations[2]?.city || null,
      businessHours: data.businessHours || null,
    };
  }
  // Otherwise return as-is (old format)
  return data;
}

async function fetchSettings(): Promise<SiteSettings> {
  const response = await fetch("/api/settings");

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  const data = await response.json();
  return normalizeSettings(data.settings || defaultSettings);
}

export function useSiteSettings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    placeholderData: defaultSettings,
  });

  return {
    settings: data || defaultSettings,
    loading: isLoading,
    error: error?.message || null,
  };
}
