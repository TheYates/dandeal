import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
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
        supabase
          .from('quote_submissions')
          .select('*')
          .order('created_at', { ascending: false })
      );
    }

    if (shouldInclude('submissions') || shouldInclude('consultations')) {
      dataKeys.push('consultations');
      dataPromises.push(
        supabase
          .from('consultation_submissions')
          .select('*')
          .order('created_at', { ascending: false })
      );
    }

    if (shouldInclude('submissions') || shouldInclude('contacts')) {
      dataKeys.push('contacts');
      dataPromises.push(
        supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
      );
    }

    // 2. Dropdown options
    if (shouldInclude('dropdowns')) {
      dataKeys.push('services');
      dataPromises.push(
        supabase
          .from('dropdown_options')
          .select('*')
          .eq('type', 'services')
          .order('display_order', { ascending: true })
      );

      dataKeys.push('shipping_methods');
      dataPromises.push(
        supabase
          .from('dropdown_options')
          .select('*')
          .eq('type', 'shipping_methods')
          .order('display_order', { ascending: true })
      );

      dataKeys.push('cargo_types');
      dataPromises.push(
        supabase
          .from('dropdown_options')
          .select('*')
          .eq('type', 'cargo_types')
          .order('display_order', { ascending: true })
      );
    }

    // 3. Email settings
    if (shouldInclude('email')) {
      dataKeys.push('email_settings');
      dataPromises.push(
        supabase
          .from('global_email_settings')
          .select('*')
          .single()
      );

      dataKeys.push('email_logs');
      dataPromises.push(
        supabase
          .from('email_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
      );
    }

    // 4. Testimonials
    if (shouldInclude('testimonials')) {
      dataKeys.push('testimonials');
      dataPromises.push(
        supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
      );
    }

    // 5. Site settings
    if (shouldInclude('settings')) {
      dataKeys.push('site_settings');
      dataPromises.push(
        supabase
          .from('site_settings')
          .select('*')
      );

      dataKeys.push('partners');
      dataPromises.push(
        supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: false })
      );
    }

    // 6. Users (admin only)
    if (shouldInclude('users')) {
      dataKeys.push('users');
      dataPromises.push(
        supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
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
        const { data, error } = result.value;
        
        if (error) {
          console.error(`Error fetching ${key}:`, error);
          errors[key] = error.message;
          dashboardData[key] = [];
        } else {
          dashboardData[key] = data;
        }
      } else {
        console.error(`Promise rejected for ${key}:`, result.reason);
        errors[key] = result.reason?.message || 'Unknown error';
        dashboardData[key] = [];
      }
    });

    // Generate statistics
    const stats = {
      totalQuotes: dashboardData.quotes?.length || 0,
      pendingQuotes: dashboardData.quotes?.filter((q: any) => q.status === 'pending')?.length || 0,
      totalConsultations: dashboardData.consultations?.length || 0,
      pendingConsultations: dashboardData.consultations?.filter((c: any) => c.status === 'pending')?.length || 0,
      totalContacts: dashboardData.contacts?.length || 0,
      unreadContacts: dashboardData.contacts?.filter((c: any) => !c.is_read)?.length || 0,
      totalTestimonials: dashboardData.testimonials?.length || 0,
      publishedTestimonials: dashboardData.testimonials?.filter((t: any) => t.is_published)?.length || 0,
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