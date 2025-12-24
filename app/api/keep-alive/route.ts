import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Keep-Alive Endpoint
 * 
 * This endpoint is designed to be called periodically (e.g., daily via GitHub Actions)
 * to prevent Supabase free tier from pausing the project after 7 days of inactivity.
 * 
 * It performs a simple database query to keep the connection active.
 */
export async function GET(request: Request) {
  try {
    // Verify the request is authorized (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.KEEP_ALIVE_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Perform a simple database query to keep it active
    // This just checks the database is responsive
    const result = await db.execute(sql`SELECT 1 as ping`);
    
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection active',
      timestamp,
      result: 'ok'
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to ping database',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Allow this endpoint to be called without authentication in development
export const dynamic = 'force-dynamic';
