
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { useEmployees } from "@/hooks/useEmployees";
import { supabase } from "@/integrations/supabase/client";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    department: "",
    role: "",
    phone: "",
    joining_date: "",
  });
  const [joiningDate, setJoiningDate] = useState<Date>();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addEmployee, uploadProfilePicture } = useEmployees();

  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const employeeData = {
        ...formData,
        // Fix: Convert selected date to YYYY-MM-DD format without timezone issues
        joining_date: joiningDate ? 
          new Date(joiningDate).toISOString().split('T')[0] : ""
      };

      // First add the employee
      const { data: employee, error } = await addEmployee(employeeData);
      
      if (error || !employee) {
        setIsLoading(false);
        return;
      }

      // If there's a profile picture, upload it and update the employee
      if (profilePicture) {
        const { url } = await uploadProfilePicture(profilePicture, employee.id);
        if (url) {
          // Update employee with profile picture URL using Supabase client
          const { error: updateError } = await supabase
            .from('employees')
            .update({ profile_picture: url })
            .eq('id', parseInt(employee.id));
          
          if (updateError) {
            console.error('Error updating profile picture:', updateError);
          }
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Add New Employee</CardTitle>
              <CardDescription>
                Add a new team member to your employee directory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Upload className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      placeholder="Enter full name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => handleInputChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Role *</Label>
                    <Input
                      id="role"
                      placeholder="Enter job role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Joining Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !joiningDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {joiningDate ? format(joiningDate, "PPP") : <span>Pick a joining date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={joiningDate}
                        onSelect={setJoiningDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.full_name || !formData.email || !formData.department || !formData.role}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isLoading ? (
                      "Adding..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Add Employee
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
