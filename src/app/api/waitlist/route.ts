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

// Helper function to get app URL with smart fallback
function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback based on environment
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    ? 'https://waitlist.hyperionkit.xyz'
    : 'http://localhost:3000';
}

// Email template functions - defined before POST handler to avoid reference errors
function generateConfirmationEmail(
  email: string,
  walletAddress: string,
  confirmationUrl: string,
  entryId: string
): string {
  const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  // Get app URL with smart fallback (production or localhost)
  const appUrl = getAppUrl();
  const logoUrl = `${appUrl}/logo/brand/hyperkit/Hyperkit-logo.png`;
  
  // Add tracking parameters to confirmation link
  const trackedConfirmationUrl = `${confirmationUrl}&utm_source=email&utm_medium=confirmation&utm_campaign=waitlist&entry_id=${entryId}`;
  
  // Add tracking to any other links (like website, social media, etc.)
  const websiteUrl = `${appUrl}?utm_source=email&utm_medium=confirmation&utm_campaign=waitlist`;
  
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark only">
    <title>Waitlist Confirmation</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #050508;
            color: #cbd5e1;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .glow-text { 
            text-shadow: 0 0 20px rgba(129, 140, 248, 0.3); 
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        /* Email client resets */
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; outline: none; text-decoration: none; display: block; }
        a { text-decoration: none; }
        /* Prevent iOS auto-linking */
        .no-link a { color: inherit !important; text-decoration: none !important; }
    </style>
</head>
<body style="background-color: #050508; color: #cbd5e1; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    
    <!-- Background Gradient/Glow Effects -->
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%; background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(5, 5, 8, 0) 70%); position: relative;">
        <tr>
            <td style="padding: 0;">
                <!-- Main Wrapper -->
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
                    <tr>
                        <td align="center" style="padding: 48px 16px;">
                            
                            <!-- Card Container -->
                            <!--[if mso]>
                            <table align="center" border="0" cellspacing="0" cellpadding="0" width="560">
                            <tr>
                            <td align="center" valign="top" width="560">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="max-width: 560px; width: 100%; margin: 0 auto; position: relative; background-color: #0A0A0F; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                                
                                <!-- Header / Logo -->
                                <tr>
                                    <td align="center" style="padding: 40px 32px 24px 32px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td align="center" style="font-size: 0;">
                                                    <!-- Hexagon Icon SVG -->
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                                    </svg>
                                                    <span style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em; color: #ffffff; vertical-align: middle; display: inline-block;">Hyperkit</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Main Content -->
                                <tr>
                                    <td align="center" style="padding: 0 32px 32px 32px;">
                                        <!-- Success Icon with Glow -->
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto 24px auto;">
                                            <tr>
                                                <td align="center" style="position: relative;">
                                                    <!-- Glow effect -->
                                                    <div style="position: absolute; inset: 0; background-color: #6366f1; filter: blur(16px); opacity: 0.2; border-radius: 50%; width: 64px; height: 64px; margin: 0 auto;"></div>
                                                    <!-- Icon container -->
                                                    <div style="position: relative; background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50%; padding: 12px; display: inline-block;">
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="1.5">
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                                        </svg>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>

                                        <h1 style="font-size: 30px; font-weight: 600; letter-spacing: -0.025em; color: #ffffff; margin: 0 0 16px 0; text-shadow: 0 0 20px rgba(129, 140, 248, 0.3);">
                                            You're on the list
                                        </h1>
                                        <p style="font-size: 16px; color: #94a3b8; line-height: 1.625; font-weight: 400; max-width: 448px; margin: 0 auto;">
                                            We've reserved your spot. Access is rolling out gradually to ensure the best experience for our early adopters.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Details Card -->
                                <tr>
                                    <td align="center" style="padding: 0 32px 32px 32px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 20px;">
                                                    
                                                    <!-- Card Label -->
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 8px;">
                                                        <tr>
                                                            <td>
                                                                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; margin: 0;">
                                                                    Registration Details
                                                                </p>
                                                            </td>
                                                            <td align="right" style="text-align: right;">
                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="display: inline-block;">
                                                                    <tr>
                                                                        <td style="width: 4px; height: 4px; background-color: #6366f1; border-radius: 50%; padding-right: 4px;">
                                                                            <div style="width: 4px; height: 4px; background-color: #6366f1; border-radius: 50%;"></div>
                                                                        </td>
                                                                        <td style="width: 4px; height: 4px; background-color: #475569; border-radius: 50%; padding-right: 4px;">
                                                                            <div style="width: 4px; height: 4px; background-color: #475569; border-radius: 50%;"></div>
                                                                        </td>
                                                                        <td style="width: 4px; height: 4px; background-color: #475569; border-radius: 50%;">
                                                                            <div style="width: 4px; height: 4px; background-color: #475569; border-radius: 50%;"></div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Detail Row 1: Email -->
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom: 12px;">
                                                        <tr>
                                                            <td width="32" style="width: 32px; vertical-align: top; padding-right: 12px;">
                                                                <div style="width: 32px; height: 32px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; display: table-cell; vertical-align: middle; text-align: center;">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="display: inline-block; vertical-align: middle;">
                                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                                        <polyline points="22,6 12,13 2,6"/>
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                            <td style="vertical-align: top;">
                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                    <tr>
                                                                        <td style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 500; padding-bottom: 4px;">
                                                                            Email Address
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-size: 14px; color: #e2e8f0; font-weight: 500; letter-spacing: -0.01em; font-family: 'Courier New', Courier, monospace;">
                                                                            ${email}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Detail Row 2: Wallet -->
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                        <tr>
                                                            <td width="32" style="width: 32px; vertical-align: top; padding-right: 12px;">
                                                                <div style="width: 32px; height: 32px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; display: table-cell; vertical-align: middle; text-align: center;">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="display: inline-block; vertical-align: middle;">
                                                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                            <td style="vertical-align: top;">
                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                    <tr>
                                                                        <td style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 500; padding-bottom: 4px;">
                                                                            Connected Wallet
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="font-size: 14px; color: #e2e8f0; font-weight: 500; letter-spacing: -0.01em; font-family: 'Courier New', Courier, monospace;">
                                                                            ${shortWallet}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- CTA Section -->
                                <tr>
                                    <td align="center" style="padding: 0 32px 40px 32px;">
                                        <!-- Button -->
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; width: 100%; max-width: 100%;">
                                            <tr>
                                                <td align="center" style="padding-bottom: 24px;">
                                                    <a href="${trackedConfirmationUrl}" target="_blank" style="display: inline-block; width: 100%; max-width: 100%; background: linear-gradient(to right, #4f46e5, #7c3aed); color: #ffffff; padding: 14px 32px; border-radius: 9999px; font-weight: 500; font-size: 14px; letter-spacing: 0.05em; text-align: center; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 0 20px -5px rgba(99, 102, 241, 0.4);">
                                                        Confirm Email Address
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Fallback Link -->
                                        <p style="margin: 0; font-size: 12px; color: #475569; text-align: center; font-weight: 400; line-height: 1.5;">
                                            Or paste this link into your browser:<br>
                                            <a href="${trackedConfirmationUrl}" style="color: #818cf8; text-decoration: underline; text-underline-offset: 4px; word-break: break-all;">${trackedConfirmationUrl}</a>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer Area -->
                                <tr>
                                    <td style="background-color: #08080c; border-top: 1px solid rgba(255, 255, 255, 0.05); padding: 32px; text-align: center;">
                                        <!-- Social Icons -->
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto 24px auto;">
                                            <tr>
                                                <td style="padding: 0 12px;">
                                                    <a href="#" style="color: #64748b; text-decoration: none;">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                                                        </svg>
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="#" style="color: #64748b; text-decoration: none;">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                                                            <circle cx="12" cy="12" r="10"/>
                                                        </svg>
                                                    </a>
                                                </td>
                                                <td style="padding: 0 12px;">
                                                    <a href="#" style="color: #64748b; text-decoration: none;">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                        </svg>
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 0 0 16px 0; font-size: 12px; color: #475569; line-height: 1.625; max-width: 320px; margin-left: auto; margin-right: auto;">
                                            You are receiving this because you signed up for the Hyperkit beta.
                                        </p>
                                        <div style="margin-top: 16px;">
                                            <a href="${websiteUrl}" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
                                            <span style="color: #1e293b;">•</span>
                                            <a href="${websiteUrl}" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; text-decoration: none; margin: 0 8px;">Privacy</a>
                                        </div>
                                    </td>
                                </tr>

                            </table>
                            <!--[if mso]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
}

function generateConfirmationEmailText(
  email: string,
  walletAddress: string,
  confirmationUrl: string
): string {
  const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  return `
🎉 Spot Secured!

Your Hyperkit Waitlist Confirmation

Thank you for joining the Hyperkit waitlist! Your spot has been secured.

This email serves as proof that you've successfully registered for early access to Hyperkit Studio.

Registration Details:
Email: ${email}
Wallet: ${shortWallet}

What's Next?
We'll notify you when Beta Wave 1 launches. Stay tuned for updates!

Confirm Your Email:
${confirmationUrl}

If you didn't request this, please ignore this email.
This is an automated message from Hyperkit.
  `.trim();
}

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
      .select('id, email, wallet_address, confirmation_token, status, email_confirmed, position')
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to register. Please try again.' },
        { status: 500 }
      );
    }

    // Validate that confirmation_token exists
    if (!entry?.confirmation_token) {
      console.error('Confirmation token missing from entry:', entry);
      return NextResponse.json(
        { error: 'Failed to generate confirmation token. Please try again.' },
        { status: 500 }
      );
    }

    // Automatically add to newsletter (non-blocking - don't fail if this fails)
    try {
      const { error: newsletterError } = await supabase
        .from('newsletter')
        .upsert({
          email: normalizedEmail,
          status: 'active',
          source: 'waitlist',
          // subscribed_at will default to now() if not provided
          // unsubscribed_at will be null for new subscriptions
        }, {
          onConflict: 'email', // Handle duplicate emails gracefully
          ignoreDuplicates: false // Update existing records
        });

      if (newsletterError) {
        // Log error but don't fail the waitlist signup
        console.error('Failed to add to newsletter (non-critical):', newsletterError);
      } else {
        console.log('Successfully added to newsletter:', normalizedEmail);
      }
    } catch (newsletterErr) {
      console.error('Error adding to newsletter (non-critical):', newsletterErr);
      // Don't throw - continue with waitlist signup
    }

    // Send confirmation email
    if (resend && entry) {
      try {
        const appUrl = getAppUrl();
        
        const confirmationUrl = `${appUrl}/api/confirm?token=${entry.confirmation_token}&id=${entry.id}`;
        
        // Resend configuration
        // IMPORTANT: Use the verified subdomain (waitlist.hyperionkit.xyz) not the root domain
        // Based on your DNS records, waitlist.hyperionkit.xyz is verified
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'team@waitlist.hyperionkit.xyz';
        const testEmail = process.env.RESEND_TEST_EMAIL || 'hyperkitdev@gmail.com';
        const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
        
        // In development/testing mode, Resend only allows sending to verified email
        // In production with verified domain, you can send to any email
        const recipientEmail = isProduction ? entry.email : testEmail;
        
        // Add this logging
        console.log('[EMAIL DEBUG]', {
          isProduction,
          NODE_ENV: process.env.NODE_ENV,
          userEmail: entry.email,
          recipientEmail,
          fromEmail,
          confirmationUrl
        });
        
        // Log if we're using test email in development
        if (!isProduction && entry.email !== testEmail) {
          console.log(`[DEV MODE] Email would be sent to ${entry.email}, but redirecting to test email: ${testEmail}`);
        }
        
        await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          subject: '🎉 Your Spot is Secured - Hyperkit Waitlist Confirmation',
          html: generateConfirmationEmail(entry.email, entry.wallet_address, confirmationUrl, entry.id),
          // Text version for better deliverability
          text: generateConfirmationEmailText(entry.email, entry.wallet_address, confirmationUrl),
          // Priority headers for email importance
          headers: {
            'X-Priority': '1', // High priority (1 = High, 3 = Normal, 5 = Low)
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'Priority': 'urgent',
            // Add reply-to to improve deliverability
            'Reply-To': fromEmail.includes('<') 
              ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail 
              : fromEmail,
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
        try {
          const { error: logError } = await supabase
            .from('email_logs')
            .insert({
              waitlist_entry_id: entry.id,
              email_type: 'confirmation',
              status: 'sent',
            });
          
          if (logError) {
            console.error('Failed to log email send:', logError);
            // Don't fail the request, just log the error
          }
        } catch (logErr) {
          console.error('Error logging email send:', logErr);
          // Don't fail the request, just log the error
        }
      } catch (emailError: any) {
        console.error('Email sending error:', emailError);
        
        // Check if it's a Resend validation error (testing mode restriction)
        if (emailError?.message?.includes('testing emails') || emailError?.name === 'validation_error') {
          console.warn('Resend testing mode restriction: Email can only be sent to verified address in testing mode.');
          console.warn('To send to all recipients, verify your domain at: https://resend.com/domains');
        }
        
        // Log failed email attempt
        try {
          const { error: logError } = await supabase
            .from('email_logs')
            .insert({
              waitlist_entry_id: entry.id,
              email_type: 'confirmation',
              status: 'failed',
              error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
            });
          
          if (logError) {
            console.error('Failed to log email failure:', logError);
          }
        } catch (logErr) {
          console.error('Error logging email failure:', logErr);
        }
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

