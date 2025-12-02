import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Error fetching total count:', totalError);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Get confirmed count (email_confirmed = true OR status = 'confirmed')
    const { count: confirmedCount, error: confirmedError } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true })
      .or('email_confirmed.eq.true,status.eq.confirmed');

    if (confirmedError) {
      console.error('Error fetching confirmed count:', confirmedError);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Get pending count (email_confirmed = false AND status = 'pending')
    const { count: pendingCount, error: pendingError } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true })
      .eq('email_confirmed', false)
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Error fetching pending count:', pendingError);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      total: totalCount || 0,
      confirmed: confirmedCount || 0,
      pending: pendingCount || 0,
    });
  } catch (error) {
    console.error('Unexpected error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

