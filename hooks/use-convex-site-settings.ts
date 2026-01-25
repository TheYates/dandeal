"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface SiteSettings {
  phonePrimary?: string | null;
  phoneSecondary?: string | null;
  whatsapp?: string | null;
  whatsappLabel?: string | null;
  showWhatsappInHeader?: boolean;
  emailPrimary?: string | null;
  emailSupport?: string | null;
  displayPhonePrimary?: boolean;
  displayPhoneSecondary?: boolean;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  displayFacebook?: boolean;
  displayInstagram?: boolean;
  displayLinkedin?: boolean;
  displayTwitter?: boolean;
  displayTiktok?: boolean;
  officeKumasi?: string | null;
  officeObuasi?: string | null;
  officeChina?: string | null;
  businessHours?: string | null;
  globalEmailEnabled?: boolean;
  globalEmail?: string | null;
  overrideIndividualEmailSettings?: boolean;
}

export function useSiteSettings() {
  const data = useQuery(api.siteSettings.get, {});

  return {
    settings: data as SiteSettings | null,
    isLoading: data === undefined,
    error: null,
  };
}

export function useSiteSettingsMutations() {
  const updateSettings = useMutation(api.siteSettings.update);
  const initSettings = useMutation(api.siteSettings.init);

  return {
    update: async (data: {
      phonePrimary?: string;
      phoneSecondary?: string;
      whatsapp?: string;
      whatsappLabel?: string;
      showWhatsappInHeader?: boolean;
      emailPrimary?: string;
      emailSupport?: string;
      displayPhonePrimary?: boolean;
      displayPhoneSecondary?: boolean;
      facebookUrl?: string;
      instagramUrl?: string;
      linkedinUrl?: string;
      twitterUrl?: string;
      tiktokUrl?: string;
      displayFacebook?: boolean;
      displayInstagram?: boolean;
      displayLinkedin?: boolean;
      displayTwitter?: boolean;
      displayTiktok?: boolean;
      officeKumasi?: string;
      officeObuasi?: string;
      officeChina?: string;
      businessHours?: string;
      globalEmailEnabled?: boolean;
      globalEmail?: string;
      overrideIndividualEmailSettings?: boolean;
      updatedBy?: string;
    }) => {
      return await updateSettings(data);
    },
    init: async () => {
      return await initSettings({});
    },
  };
}
