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
    // Redirect to error page or show error
    return NextResponse.redirect(
      new URL('/confirmed?error=missing_params', request.url)
    );
  }

  try {
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
      console.error('Confirmation error:', error);
      // Redirect to error page
      return NextResponse.redirect(
        new URL('/confirmed?error=invalid_token', request.url)
      );
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/confirmed?success=true', request.url)
    );
  } catch (error) {
    console.error('Unexpected confirmation error:', error);
    return NextResponse.redirect(
      new URL('/confirmed?error=server_error', request.url)
    );
  }
}

