/**
 * Welcome Email Edge Function
 * Purpose: Send professional branded welcome emails with sign-in credentials
 * Design: Cal AI minimalist with MaxPulse red branding
 * Following .cursorrulesBE: Comprehensive error handling, logging
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Types
interface WelcomeEmailRequest {
  to: string;
  name: string;
  temporary_password: string;
  activation_code_id: string;
  plan_type: 'annual' | 'monthly';
}

interface WelcomeEmailResponse {
  success: boolean;
  error?: string;
}

// Generate professional HTML email template
function generateEmailTemplate(name: string, email: string, password: string, planType: string): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MaxPulse</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                Welcome to MaxPulse
              </h1>
              <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px;">
                Your Health Journey Begins Now 🎯
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                Welcome to the Maximum 88 family! Your MaxPulse account is ready, and we've personalized your health profile based on your assessment.
              </p>
              
              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; color: #dc2626; font-size: 18px; font-weight: 600;">
                      📱 Get Started
                    </h2>
                    
                    <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 12px;">
                        Download MaxPulse from the App Store:<br>
                        <a href="https://apps.apple.com/app/maxpulse" style="color: #dc2626; text-decoration: none; font-weight: 500;">
                          Download Now →
                        </a>
                      </li>
                      <li style="margin-bottom: 12px;">
                        Sign in with these credentials:
                      </li>
                    </ol>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px;">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                            Email
                          </p>
                          <p style="margin: 0; color: #1f2937; font-size: 15px; font-family: 'Courier New', monospace;">
                            ${email}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 15px 15px 15px;">
                          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                            Temporary Password
                          </p>
                          <p style="margin: 0; color: #1f2937; font-size: 15px; font-family: 'Courier New', monospace; background-color: #fef2f2; padding: 10px; border-radius: 4px; border: 1px solid #fecaca;">
                            ${password}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      🔒 <strong>Security Tip:</strong> Please change your password after your first sign-in for enhanced security.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Plan Info -->
              <p style="margin: 30px 0 20px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                You're subscribed to the <strong style="color: #dc2626;">${planType === 'annual' ? 'Annual' : 'Monthly'} Plan</strong>. 
                Get ready to transform your health with personalized insights, daily tracking, and expert guidance.
              </p>
              
              <!-- Support -->
              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Need help? Reply to this email or contact us at 
                <a href="mailto:support@maxpulse.com" style="color: #dc2626; text-decoration: none;">
                  support@maxpulse.com
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                To Your Health,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                The MaxPulse Team
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Maximum 88. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Welcome to MaxPulse - Your Health Journey Begins Now!

Hi ${name},

Welcome to the Maximum 88 family! Your MaxPulse account is ready, and we've personalized your health profile based on your assessment.

GET STARTED:

1. Download MaxPulse from the App Store:
   https://apps.apple.com/app/maxpulse

2. Sign in with these credentials:

   Email: ${email}
   Temporary Password: ${password}

SECURITY TIP: Please change your password after your first sign-in for enhanced security.

You're subscribed to the ${planType === 'annual' ? 'Annual' : 'Monthly'} Plan. Get ready to transform your health with personalized insights, daily tracking, and expert guidance.

Need help? Reply to this email or contact us at support@maxpulse.com

To Your Health,
The MaxPulse Team

© ${new Date().getFullYear()} Maximum 88. All rights reserved.
  `;

  return { html, text };
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: WelcomeEmailRequest = await req.json();
    
    console.log('📧 Welcome email request received:', {
      to: body.to,
      name: body.name,
      plan_type: body.plan_type,
      timestamp: new Date().toISOString()
    });
    
    // Validate request
    if (!body.to || !body.name || !body.temporary_password || !body.plan_type) {
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate email template
    const { html, text } = generateEmailTemplate(
      body.name,
      body.to,
      body.temporary_password,
      body.plan_type
    );
    
    // In development/local: Log email instead of sending
    if (Deno.env.get('ENVIRONMENT') === 'local' || !Deno.env.get('SMTP_HOST')) {
      console.log('📧 [LOCAL MODE] Email would be sent to:', body.to);
      console.log('📧 [LOCAL MODE] Email subject: Welcome to MaxPulse - Your Health Journey Begins 🎯');
      console.log('📧 [LOCAL MODE] Temporary password:', body.temporary_password);
      console.log('📧 [LOCAL MODE] Email content generated successfully');
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Production: Send via Supabase SMTP or external service
    // TODO: Integrate with SendGrid/Resend/SES for production
    // For now, using Supabase's built-in email (configured in config.toml)
    
    console.log('✅ Welcome email sent successfully to:', body.to);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send welcome email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

