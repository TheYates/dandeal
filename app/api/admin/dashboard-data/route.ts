import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  consultationSubmissions,
  quoteSubmissions,
  contactSubmissions,
  dropdownOptions,
  emailNotificationSettings,
  emailLogs,
  testimonials,
  siteSettings,
  partners,
  adminUsers,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Check authentication with NextAuth
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters to determine what data to include
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include')?.split(',') || ['all'];
    const shouldInclude = (type: string) => include.includes('all') || include.includes(type);

    // Parallel data fetching for optimal performance
    const dataPromises: Promise<any>[] = [];
    const dataKeys: string[] = [];

    // 1. Submissions data (quotes, consultations, contacts)
    if (shouldInclude('submissions') || shouldInclude('quotes')) {
      dataKeys.push('quotes');
      dataPromises.push(
        db.query.quoteSubmissions.findMany({
          orderBy: [desc(quoteSubmissions.createdAt)],
        })
      );
    }

    if (shouldInclude('submissions') || shouldInclude('consultations')) {
      dataKeys.push('consultations');
      dataPromises.push(
        db.query.consultationSubmissions.findMany({
          orderBy: [desc(consultationSubmissions.createdAt)],
        })
      );
    }

    if (shouldInclude('submissions') || shouldInclude('contacts')) {
      dataKeys.push('contacts');
      dataPromises.push(
        db.query.contactSubmissions.findMany({
          orderBy: [desc(contactSubmissions.createdAt)],
        })
      );
    }

    // 2. Dropdown options
    if (shouldInclude('dropdowns')) {
      dataKeys.push('services');
      dataPromises.push(
        db.query.dropdownOptions.findMany({
          where: eq(dropdownOptions.type, 'services'),
          orderBy: [desc(dropdownOptions.createdAt)],
        })
      );

      dataKeys.push('shipping_methods');
      dataPromises.push(
        db.query.dropdownOptions.findMany({
          where: eq(dropdownOptions.type, 'shipping_methods'),
          orderBy: [desc(dropdownOptions.createdAt)],
        })
      );

      dataKeys.push('cargo_types');
      dataPromises.push(
        db.query.dropdownOptions.findMany({
          where: eq(dropdownOptions.type, 'cargo_types'),
          orderBy: [desc(dropdownOptions.createdAt)],
        })
      );
    }

    // 3. Email settings
    if (shouldInclude('email')) {
      dataKeys.push('email_settings');
      dataPromises.push(
        db.query.emailNotificationSettings.findMany({
          orderBy: [desc(emailNotificationSettings.createdAt)],
        })
      );

      dataKeys.push('email_logs');
      dataPromises.push(
        db.query.emailLogs.findMany({
          orderBy: [desc(emailLogs.createdAt)],
          limit: 50,
        })
      );
    }

    // 4. Testimonials
    if (shouldInclude('testimonials')) {
      dataKeys.push('testimonials');
      dataPromises.push(
        db.query.testimonials.findMany({
          orderBy: [desc(testimonials.createdAt)],
        })
      );
    }

    // 5. Site settings
    if (shouldInclude('settings')) {
      dataKeys.push('site_settings');
      dataPromises.push(
        db.query.siteSettings.findMany()
      );

      dataKeys.push('partners');
      dataPromises.push(
        db.query.partners.findMany({
          orderBy: [desc(partners.createdAt)],
        })
      );
    }

    // 6. Users (admin only)
    if (shouldInclude('users')) {
      dataKeys.push('users');
      dataPromises.push(
        db.query.adminUsers.findMany({
          orderBy: [desc(adminUsers.createdAt)],
        })
      );
    }

    // Execute all queries in parallel
    const results = await Promise.allSettled(dataPromises);

    // Process results and build response
    const dashboardData: Record<string, any> = {};
    const errors: Record<string, string> = {};
    
    results.forEach((result, index) => {
      const key = dataKeys[index];
      
      if (result.status === 'fulfilled') {
        dashboardData[key] = result.value || [];
      } else {
        console.error(`Promise rejected for ${key}:`, result.reason);
        errors[key] = result.reason?.message || 'Unknown error';
        dashboardData[key] = [];
      }
    });

    // Generate statistics
    const stats = {
      totalQuotes: dashboardData.quotes?.length || 0,
      pendingQuotes: dashboardData.quotes?.filter((q: any) => q.status === 'new')?.length || 0,
      totalConsultations: dashboardData.consultations?.length || 0,
      pendingConsultations: dashboardData.consultations?.filter((c: any) => c.status === 'new')?.length || 0,
      totalContacts: dashboardData.contacts?.length || 0,
      unreadContacts: dashboardData.contacts?.filter((c: any) => c.status === 'new')?.length || 0,
      totalTestimonials: dashboardData.testimonials?.length || 0,
      publishedTestimonials: dashboardData.testimonials?.filter((t: any) => t.isActive)?.length || 0,
      lastUpdated: new Date().toISOString(),
    };

    // Construct response
    const response = {
      success: true,
      data: dashboardData,
      stats,
      metadata: {
        timestamp: new Date().toISOString(),
        requestedData: include,
        fetchedKeys: dataKeys,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
      },
    };

    // Set cache headers for optimal performance
    const headers = {
      'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
      'Content-Type': 'application/json',
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}