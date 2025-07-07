
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AttendanceLog {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  clock_in_time: string;
  clockout_token: string;
  token_expires_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { attendanceLog }: { attendanceLog: AttendanceLog } = await req.json();

    if (!attendanceLog) {
      return new Response(JSON.stringify({ error: 'Missing attendance log data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Gmail API credentials from environment
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !refreshToken) {
      console.error('Missing Gmail API credentials');
      return new Response(JSON.stringify({ error: 'Gmail API credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get access token using refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return new Response(JSON.stringify({ error: 'Failed to authenticate with Gmail API' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format clock-in time
    const clockInTime = new Date(attendanceLog.clock_in_time).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Create clock-out URL
    const clockOutUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/email-clockout?token=${attendanceLog.clockout_token}`;

    // Create email content
    const emailSubject = 'You forgot to clock out 😴 | Quick clock-out option inside';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Hi ${attendanceLog.full_name},</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          It looks like you haven't clocked out today. For your convenience, you can clock out directly from this email.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Your clock-in time today:</strong> ${clockInTime}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${clockOutUrl}" 
             style="background-color: #28a745; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 8px; font-size: 16px; 
                    font-weight: bold; display: inline-block;">
            ✅ Clock Out Now
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          This will automatically update your attendance in the Wisemonk app.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          This link will expire in 12 hours for security purposes.
        </p>
      </div>
    `;

    // Create email message in Gmail API format
    const emailMessage = [
      `To: ${attendanceLog.email}`,
      `Subject: ${emailSubject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailBody,
    ].join('\n');

    // Encode the message in base64
    const encodedMessage = btoa(emailMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send email via Gmail API
    const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    });

    const gmailResult = await gmailResponse.json();

    if (!gmailResponse.ok) {
      console.error('Gmail API error:', gmailResult);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Email sent successfully to ${attendanceLog.email}`);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: gmailResult.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
