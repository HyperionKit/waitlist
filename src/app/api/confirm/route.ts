import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  if (!token || !id) {
    // Get base URL for proper redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL('/confirmed?error=missing_params', baseUrl)
    );
  }

  try {
    // First, check if the entry exists and get the token
    const { data: entryData, error: fetchError } = await supabase
      .from('waitlist_entries')
      .select('id, confirmation_token, email_confirmed')
      .eq('id', id)
      .single();

    if (fetchError || !entryData) {
      console.error('Entry not found:', { id, error: fetchError });
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', baseUrl)
      );
    }

    // Check if already confirmed
    if (entryData.email_confirmed) {
      console.log('Email already confirmed:', id);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?success=true&already_confirmed=true', baseUrl)
      );
    }

    // Verify token matches
    if (entryData.confirmation_token !== token) {
      console.error('Token mismatch:', {
        provided: token,
        expected: entryData.confirmation_token,
        id
      });
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', baseUrl)
      );
    }

    // Verify token and confirm email
    const { data, error } = await supabase
      .from('waitlist_entries')
      .update({
        email_confirmed: true,
        confirmed_at: new Date().toISOString(),
        status: 'confirmed',
      })
      .eq('id', id)
      .eq('confirmation_token', token)
      .select()
      .single();

    if (error || !data) {
      console.error('Confirmation update error:', { error, id, token });
      // Get base URL for proper redirect
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', baseUrl)
      );
    }

    // Get base URL for proper redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    // Redirect to success page
    return NextResponse.redirect(
      new URL('/confirmed?success=true', baseUrl)
    );
  } catch (error) {
    console.error('Unexpected confirmation error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL('/confirmed?error=server_error', baseUrl)
    );
  }
}

