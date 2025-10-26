/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Settings API response
 */
export interface SettingsResponse {
  settings: {
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
  };
}

/**
 * Partner interface
 */
export interface Partner {
  id: string;
  name: string;
  icon: string | null;
  image: string | null;
  order: string;
  isActive: boolean;
}

/**
 * Partners API response
 */
export interface PartnersResponse {
  partners: Partner[];
}

/**
 * Form submission responses
 */
export interface SubmissionResponse {
  success: boolean;
  message: string;
  id: string;
}

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

