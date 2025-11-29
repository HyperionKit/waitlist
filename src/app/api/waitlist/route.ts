import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

// Use anon key (works with RLS policies)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Resend if API key is provided
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { email, walletAddress } = await request.json();

    // Validation
    if (!email || !walletAddress) {
      return NextResponse.json(
        { error: 'Email and wallet address are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Wallet address validation (basic Ethereum address check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedWallet = walletAddress.toLowerCase();

    // Check for duplicate email
    const { data: existingEmail } = await supabase
      .from('waitlist_entries')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Check for duplicate wallet
    const { data: existingWallet } = await supabase
      .from('waitlist_entries')
      .select('id')
      .eq('wallet_address', normalizedWallet)
      .single();

    if (existingWallet) {
      return NextResponse.json(
        { error: 'This wallet is already registered' },
        { status: 409 }
      );
    }

    // Insert new waitlist entry
    const { data: entry, error: insertError } = await supabase
      .from('waitlist_entries')
      .insert({
        email: normalizedEmail,
        wallet_address: normalizedWallet,
        status: 'pending',
        email_confirmed: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to register. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email
    if (resend && entry) {
      try {
        const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/confirm?token=${entry.confirmation_token}&id=${entry.id}`;
        
        await resend.emails.send({
          from: 'Hyperkit <onboarding@resend.dev>', // Change to your verified domain later
          to: entry.email,
          subject: '🎉 Your Spot is Secured - Hyperkit Waitlist Confirmation',
          html: generateConfirmationEmail(entry.email, entry.wallet_address, confirmationUrl, entry.id),
          // Priority headers for email importance
          headers: {
            'X-Priority': '1', // High priority (1 = High, 3 = Normal, 5 = Low)
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'Priority': 'urgent',
          },
          // Tags for tracking
          tags: [
            { name: 'category', value: 'waitlist-confirmation' },
            { name: 'user_id', value: entry.id },
          ],
        });

        // Update confirmation_sent_at
        await supabase
          .from('waitlist_entries')
          .update({ confirmation_sent_at: new Date().toISOString() })
          .eq('id', entry.id);

        // Log email send (optional)
        await supabase
          .from('email_logs')
          .insert({
            waitlist_entry_id: entry.id,
            email_type: 'confirmation',
            status: 'sent',
          });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Log failed email attempt
        await supabase
          .from('email_logs')
          .insert({
            waitlist_entry_id: entry.id,
            email_type: 'confirmation',
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
          });
        // Don't fail the request if email fails, but log it
      }
    } else if (!resend) {
      console.warn('Resend API key not configured. Email not sent.');
    }

    return NextResponse.json({
      success: true,
      message: 'Spot secured! Check your email for confirmation.',
      entry: {
        id: entry.id,
        position: entry.position,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

function generateConfirmationEmail(
  email: string,
  walletAddress: string,
  confirmationUrl: string,
  entryId: string
): string {
  const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  // Get app URL for logo (use your production domain in production)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // URL encode the space in the filename for proper URL handling
  const logoUrl = `${appUrl}/logo/brand/hyperkit/Hyperkit Header White.svg`.replace(/ /g, '%20');
  
  // Add tracking parameters to confirmation link
  const trackedConfirmationUrl = `${confirmationUrl}&utm_source=email&utm_medium=confirmation&utm_campaign=waitlist&entry_id=${entryId}`;
  
  // Add tracking to any other links (like website, social media, etc.)
  const websiteUrl = `${appUrl}?utm_source=email&utm_medium=confirmation&utm_campaign=waitlist`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Email priority meta tags -->
        <meta name="X-Priority" content="1">
        <meta name="Importance" content="high">
        <meta name="Priority" content="urgent">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0c; color: #ffffff; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #050507, #0f0720); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
          
          <!-- Brand Logo Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img 
              src="${logoUrl}" 
              alt="Hyperkit Logo" 
              style="max-width: 300px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;"
              width="300"
              height="100"
            />
            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 600;">🎉 Spot Secured!</h1>
            <p style="color: #a0a0a0; font-size: 16px; margin: 0;">Your Hyperkit Waitlist Confirmation</p>
          </div>
          
          <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for joining the Hyperkit waitlist! Your spot has been secured.
          </p>
          
          <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            This email serves as <strong style="color: #ffffff;">proof that you've successfully registered</strong> for early access to Hyperkit Studio.
          </p>
          
          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 20px; margin: 30px 0;">
            <p style="color: #e9d5ff; font-size: 14px; margin: 0 0 10px 0;">
              <strong style="color: #ffffff;">Registration Details:</strong>
            </p>
            <p style="color: #d1d5db; font-size: 14px; margin: 5px 0;">
              <strong>Email:</strong> ${email}
            </p>
            <p style="color: #d1d5db; font-size: 14px; margin: 5px 0;">
              <strong>Wallet:</strong> ${shortWallet}
            </p>
          </div>
          
          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 20px; margin: 30px 0;">
            <p style="color: #e9d5ff; font-size: 14px; margin: 0;">
              <strong style="color: #ffffff;">What's Next?</strong><br>
              We'll notify you when Beta Wave 1 launches. Stay tuned for updates!
            </p>
          </div>
          
          <!-- Primary CTA Button with Trackable Link -->
          <div style="text-align: center; margin-top: 40px;">
            <a href="${trackedConfirmationUrl}" 
               style="display: inline-block; background: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.2s;">
              Confirm Your Email
            </a>
          </div>
          
          <!-- Additional Links with Tracking -->
          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 15px;">Learn more about Hyperkit:</p>
            <a href="${websiteUrl}" 
               style="color: #a78bfa; text-decoration: none; font-size: 14px; margin: 0 15px;">
              Visit Website
            </a>
            <span style="color: #666; margin: 0 5px;">•</span>
            <a href="${websiteUrl}#features" 
               style="color: #a78bfa; text-decoration: none; font-size: 14px; margin: 0 15px;">
              Features
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px; line-height: 1.5;">
            If you didn't request this, please ignore this email.<br>
            This is an automated message from Hyperkit.
          </p>
        </div>
      </body>
    </html>
  `;
}

