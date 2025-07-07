
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        '<html><body><h1>Error</h1><p>Invalid or missing token</p></body></html>',
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the attendance log with this token
    const { data: attendanceLog, error } = await supabaseClient
      .from('attendance_logs')
      .select('*')
      .eq('clockout_token', token)
      .is('clock_out_time', null)
      .single();

    if (error || !attendanceLog) {
      console.error('Token validation error:', error);
      return new Response(
        '<html><body><h1>Error</h1><p>Invalid or expired token</p></body></html>',
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    // Check if token has expired
    const now = new Date();
    const tokenExpiry = new Date(attendanceLog.token_expires_at);
    
    if (now > tokenExpiry) {
      return new Response(
        '<html><body><h1>Error</h1><p>This clock-out link has expired</p></body></html>',
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    // Perform the clock-out
    const clockOutTime = new Date().toISOString();
    const { error: updateError } = await supabaseClient
      .from('attendance_logs')
      .update({
        clock_out_time: clockOutTime,
        status: 'completed',
        auto_clockout: true,
        clockout_token: null, // Clear the token after use
        token_expires_at: null,
      })
      .eq('id', attendanceLog.id);

    if (updateError) {
      console.error('Error updating attendance:', updateError);
      return new Response(
        '<html><body><h1>Error</h1><p>Failed to update attendance record</p></body></html>',
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    console.log(`Successfully clocked out user ${attendanceLog.full_name} via email`);

    // Return success page
    const successPage = `
      <html>
        <head>
          <title>Clock Out Successful</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
              background-color: #f8f9fa;
            }
            .container {
              background-color: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .success-title {
              color: #28a745;
              font-size: 24px;
              margin-bottom: 15px;
            }
            .success-message {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .time-info {
              background-color: #e8f5e8;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1 class="success-title">Clock Out Successful!</h1>
            <p class="success-message">
              Hi ${attendanceLog.full_name}, you've been successfully clocked out.
            </p>
            <div class="time-info">
              <strong>Clock-out time:</strong> ${new Date(clockOutTime).toLocaleString()}
            </div>
            <p class="success-message">
              Your attendance has been automatically updated in the Wisemonk app.
            </p>
          </div>
        </body>
      </html>
    `;

    return new Response(successPage, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      '<html><body><h1>Error</h1><p>An unexpected error occurred</p></body></html>',
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      }
    );
  }
});
