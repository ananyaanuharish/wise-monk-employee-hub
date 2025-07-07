
-- Add columns to track email reminders and auto clock-outs
ALTER TABLE public.attendance_logs 
ADD COLUMN reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN auto_clockout BOOLEAN DEFAULT FALSE,
ADD COLUMN clockout_token TEXT,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient querying of pending reminders
CREATE INDEX idx_attendance_logs_reminder_check 
ON public.attendance_logs (clock_in_time, clock_out_time, reminder_sent_at) 
WHERE clock_out_time IS NULL AND reminder_sent_at IS NULL;

-- Create index for token lookups
CREATE INDEX idx_attendance_logs_token 
ON public.attendance_logs (clockout_token) 
WHERE clockout_token IS NOT NULL;
