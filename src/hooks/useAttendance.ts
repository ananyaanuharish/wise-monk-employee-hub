
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AttendanceLog {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  clock_in_time: string;
  clock_out_time?: string;
  location?: string;
  created_at: string;
}

export const useAttendance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getTodayAttendance = async (): Promise<AttendanceLog | null> => {
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('clock_in_time', `${today}T00:00:00`)
      .lt('clock_in_time', `${today}T23:59:59`)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching today attendance:', error);
      return null;
    }

    return data;
  };

  const clockIn = async (location?: string) => {
    if (!user) {
      toast.error('You must be logged in to clock in');
      return { success: false };
    }

    setIsLoading(true);

    try {
      // Check if already clocked in today
      const todayAttendance = await getTodayAttendance();
      if (todayAttendance) {
        toast.error('You have already clocked in today');
        setIsLoading(false);
        return { success: false };
      }

      const { data, error } = await supabase
        .from('attendance_logs')
        .insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email || '',
          email: user.email || '',
          clock_in_time: new Date().toISOString(),
          location: location,
        })
        .select()
        .single();

      if (error) {
        console.error('Error clocking in:', error);
        toast.error('Failed to clock in');
        setIsLoading(false);
        return { success: false };
      }

      toast.success('Successfully clocked in!');
      setIsLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error('Error clocking in:', error);
      toast.error('Failed to clock in');
      setIsLoading(false);
      return { success: false };
    }
  };

  const clockOut = async () => {
    if (!user) {
      toast.error('You must be logged in to clock out');
      return { success: false };
    }

    setIsLoading(true);

    try {
      // Get today's attendance record
      const todayAttendance = await getTodayAttendance();
      
      if (!todayAttendance) {
        toast.error('You must clock in before clocking out');
        setIsLoading(false);
        return { success: false };
      }

      if (todayAttendance.clock_out_time) {
        toast.error('You have already clocked out today');
        setIsLoading(false);
        return { success: false };
      }

      const { data, error } = await supabase
        .from('attendance_logs')
        .update({
          clock_out_time: new Date().toISOString(),
        })
        .eq('id', todayAttendance.id)
        .select()
        .single();

      if (error) {
        console.error('Error clocking out:', error);
        toast.error('Failed to clock out');
        setIsLoading(false);
        return { success: false };
      }

      toast.success('Successfully clocked out!');
      setIsLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error('Error clocking out:', error);
      toast.error('Failed to clock out');
      setIsLoading(false);
      return { success: false };
    }
  };

  const getLocation = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.log('Location access denied or failed:', error);
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  };

  return {
    getTodayAttendance,
    clockIn,
    clockOut,
    getLocation,
    isLoading,
  };
};
