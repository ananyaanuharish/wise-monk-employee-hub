
-- Create attendance_logs table
CREATE TABLE public.attendance_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  clock_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own attendance logs" 
  ON public.attendance_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attendance logs" 
  ON public.attendance_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance logs" 
  ON public.attendance_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for better performance when querying by user_id and date
CREATE INDEX idx_attendance_logs_user_date ON public.attendance_logs (user_id, DATE(clock_in_time));
