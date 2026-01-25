import { v } from "convex/values";
import { query } from "./_generated/server";

// Get comprehensive dashboard data
export const getData = query({
  args: {
    include: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const include = args.include ?? ["submissions", "dropdowns"];
    const data: Record<string, unknown> = {};
    const errors: Record<string, string> = {};

    // Helper to safely fetch data
    const safeFetch = async <T>(key: string, fetcher: () => Promise<T>) => {
      try {
        data[key] = await fetcher();
      } catch (error) {
        errors[key] = error instanceof Error ? error.message : "Unknown error";
      }
    };

    // Fetch submissions if requested
    if (include.includes("submissions")) {
      await Promise.all([
        safeFetch("quotes", () => ctx.db.query("quotes").order("desc").take(50)),
        safeFetch("consultations", () => ctx.db.query("consultations").order("desc").take(50)),
        safeFetch("contacts", () => ctx.db.query("contacts").order("desc").take(50)),
      ]);
    }

    // Fetch dropdowns if requested
    if (include.includes("dropdowns")) {
      const allOptions = await ctx.db.query("dropdownOptions").collect();
      data.services = allOptions.filter((o) => o.type === "services" && o.isActive);
      data.shipping_methods = allOptions.filter((o) => o.type === "shipping_methods" && o.isActive);
      data.cargo_types = allOptions.filter((o) => o.type === "cargo_types" && o.isActive);
    }

    // Fetch email data if requested
    if (include.includes("email")) {
      await Promise.all([
        safeFetch("email_settings", () => ctx.db.query("emailNotificationSettings").collect()),
        safeFetch("email_logs", () => ctx.db.query("emailLogs").order("desc").take(100)),
      ]);
    }

    // Fetch testimonials if requested
    if (include.includes("testimonials")) {
      await safeFetch("testimonials", () => ctx.db.query("testimonials").collect());
    }

    // Fetch site settings if requested
    if (include.includes("settings")) {
      await safeFetch("site_settings", () => ctx.db.query("siteSettings").first());
    }

    // Fetch partners if requested
    if (include.includes("partners")) {
      await safeFetch("partners", () => ctx.db.query("partners").collect());
    }

    // Fetch users if requested
    if (include.includes("users")) {
      await safeFetch("users", () => ctx.db.query("adminUsers").collect());
    }

    // Calculate stats
    const quotes = (data.quotes as any[]) || [];
    const consultations = (data.consultations as any[]) || [];
    const contacts = (data.contacts as any[]) || [];
    const testimonials = (data.testimonials as any[]) || [];

    const stats = {
      totalQuotes: quotes.length,
      pendingQuotes: quotes.filter((q) => q.status === "new").length,
      totalConsultations: consultations.length,
      pendingConsultations: consultations.filter((c) => c.status === "new").length,
      totalContacts: contacts.length,
      unreadContacts: contacts.filter((c) => c.status === "new").length,
      totalTestimonials: testimonials.length,
      publishedTestimonials: testimonials.filter((t) => t.isActive).length,
      lastUpdated: new Date().toISOString(),
    };

    return {
      success: true,
      data,
      stats,
      metadata: {
        timestamp: new Date().toISOString(),
        requestedData: include,
        fetchedKeys: Object.keys(data),
        errors: Object.keys(errors).length > 0 ? errors : undefined,
      },
    };
  },
});
