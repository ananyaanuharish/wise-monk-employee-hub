import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  phone?: string;
  profile_picture?: string;
  joining_date?: string;
  created_at: string;
  updated_at: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Employee interface
      const transformedData = (data || []).map(emp => ({
        id: emp.id.toString(),
        full_name: emp.full_name || '',
        email: emp.email || '',
        department: emp.department || '',
        role: emp.role || '',
        phone: emp.phone || '',
        profile_picture: emp.profile_picture || '',
        joining_date: emp.joining_date || '',
        created_at: emp.created_at,
        updated_at: emp.updated_at || emp.created_at
      }));
      
      setEmployees(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching employees",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Create data object that matches the database schema
      const dbData = {
        full_name: employeeData.full_name,
        email: employeeData.email,
        department: employeeData.department,
        role: employeeData.role,
        phone: employeeData.phone || null,
        profile_picture: employeeData.profile_picture || null,
        joining_date: employeeData.joining_date || null
      };

      const { data, error } = await supabase
        .from('employees')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Employee added successfully",
        description: `${employeeData.full_name} has been added to the directory.`,
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error adding employee",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      // Create data object that matches the database schema, excluding id, created_at, updated_at
      const { id: _, created_at, updated_at, ...dbData } = employeeData;
      
      const { data, error } = await supabase
        .from('employees')
        .update(dbData)
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Employee updated successfully",
        description: `Employee information has been updated.`,
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating employee",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
      
      toast({
        title: "Employee deleted",
        description: "Employee has been removed from the directory.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error deleting employee",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const uploadProfilePicture = async (file: File, employeeId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('employee-photos')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return { url: null, error };
    }
  };

  useEffect(() => {
    fetchEmployees();

    // Set up real-time subscription
    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        (payload) => {
          console.log('Employee change received:', payload);
          fetchEmployees(); // Refetch all employees on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    uploadProfilePicture,
    refetch: fetchEmployees
  };
};
