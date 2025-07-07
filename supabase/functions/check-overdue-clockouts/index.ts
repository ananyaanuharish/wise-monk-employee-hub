
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
  clock_out_time: string | null;
  reminder_sent_at: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Checking for overdue clock-outs...');

    // Calculate the cutoff time (9 hours ago)
    const nineHoursAgo = new Date();
    nineHoursAgo.setHours(nineHoursAgo.getHours() - 9);

    // Find attendance logs where:
    // 1. Clock-in was more than 9 hours ago
    // 2. No clock-out time
    // 3. No reminder sent yet
    const { data: overdueLogs, error } = await supabaseClient
      .from('attendance_logs')
      .select('*')
      .is('clock_out_time', null)
      .is('reminder_sent_at', null)
      .lt('clock_in_time', nineHoursAgo.toISOString());

    if (error) {
      console.error('Error fetching overdue logs:', error);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${overdueLogs?.length || 0} overdue clock-outs`);

    if (!overdueLogs || overdueLogs.length === 0) {
      return new Response(JSON.stringify({ message: 'No overdue clock-outs found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process each overdue log
    const results = [];
    for (const log of overdueLogs) {
      try {
        // Generate secure token for clock-out link
        const token = crypto.randomUUID();
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 12); // 12-hour expiry

        // Update the log with token and reminder timestamp
        const { error: updateError } = await supabaseClient
          .from('attendance_logs')
          .update({
            clockout_token: token,
            token_expires_at: tokenExpiry.toISOString(),
            reminder_sent_at: new Date().toISOString(),
          })
          .eq('id', log.id);

        if (updateError) {
          console.error('Error updating log:', updateError);
          results.push({ id: log.id, success: false, error: updateError.message });
          continue;
        }

        // Send email reminder
        const emailResult = await supabaseClient.functions.invoke('send-clockout-reminder', {
          body: {
            attendanceLog: {
              ...log,
              clockout_token: token,
              token_expires_at: tokenExpiry.toISOString(),
            },
          },
        });

        if (emailResult.error) {
          console.error('Error sending email:', emailResult.error);
          results.push({ id: log.id, success: false, error: emailResult.error.message });
        } else {
          console.log(`Email sent successfully for log ID: ${log.id}`);
          results.push({ id: log.id, success: true });
        }
      } catch (err) {
        console.error('Error processing log:', err);
        results.push({ id: log.id, success: false, error: err.message });
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Processed overdue clock-outs',
      results,
      total: overdueLogs.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
