
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface MonthlyJoiningData {
  month: string;
  count: number;
  fullDate: Date;
}

export const useEmployeeAnalytics = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('joining_date, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees for analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyJoiningData = useMemo(() => {
    const now = new Date();
    const monthsData: MonthlyJoiningData[] = [];

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const count = employees.filter(emp => {
        if (!emp.joining_date) return false;
        
        const joiningDate = parseISO(emp.joining_date);
        return joiningDate >= monthStart && joiningDate <= monthEnd;
      }).length;

      monthsData.push({
        month: format(monthDate, 'MMM yyyy'),
        count,
        fullDate: monthDate
      });
    }

    return monthsData;
  }, [employees]);

  useEffect(() => {
    fetchEmployees();

    // Set up real-time subscription
    const channel = supabase
      .channel('analytics-employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          fetchEmployees();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    monthlyJoiningData,
    loading
  };
};
