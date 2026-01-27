/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminUsers from "../adminUsers.js";
import type * as auth from "../auth.js";
import type * as consultations from "../consultations.js";
import type * as contacts from "../contacts.js";
import type * as dashboard from "../dashboard.js";
import type * as dropdownOptions from "../dropdownOptions.js";
import type * as emailLogs from "../emailLogs.js";
import type * as emailSettings from "../emailSettings.js";
import type * as emailTemplates from "../emailTemplates.js";
import type * as invitations from "../invitations.js";
import type * as migrations from "../migrations.js";
import type * as notifications from "../notifications.js";
import type * as partners from "../partners.js";
import type * as quotes from "../quotes.js";
import type * as sendInvitationEmail from "../sendInvitationEmail.js";
import type * as siteSettings from "../siteSettings.js";
import type * as testimonials from "../testimonials.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminUsers: typeof adminUsers;
  auth: typeof auth;
  consultations: typeof consultations;
  contacts: typeof contacts;
  dashboard: typeof dashboard;
  dropdownOptions: typeof dropdownOptions;
  emailLogs: typeof emailLogs;
  emailSettings: typeof emailSettings;
  emailTemplates: typeof emailTemplates;
  invitations: typeof invitations;
  migrations: typeof migrations;
  notifications: typeof notifications;
  partners: typeof partners;
  quotes: typeof quotes;
  sendInvitationEmail: typeof sendInvitationEmail;
  siteSettings: typeof siteSettings;
  testimonials: typeof testimonials;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
