
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import EmployeeCard from "@/components/EmployeeCard";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with Supabase data
const mockEmployees = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@wisemonk.com",
    department: "Engineering",
    role: "Senior Developer",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@wisemonk.com",
    department: "Design",
    role: "UI/UX Designer",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@wisemonk.com",
    department: "Marketing",
    role: "Marketing Manager",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@wisemonk.com",
    department: "Engineering",
    role: "DevOps Engineer",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@wisemonk.com",
    department: "HR",
    role: "HR Specialist",
  },
  {
    id: "6",
    name: "James Rodriguez",
    email: "james.rodriguez@wisemonk.com",
    department: "Sales",
    role: "Sales Representative",
  },
];

const Dashboard = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { toast } = useToast();

  const departments = useMemo(() => {
    const depts = [...new Set(employees.map(emp => emp.department))];
    return depts.sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, departmentFilter]);

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    toast({
      title: "Employee deleted",
      description: "Employee has been removed from the directory.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Directory</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search employees by name, email, department, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredEmployees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || departmentFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by adding your first employee"}
            </p>
            {!searchTerm && departmentFilter === "all" && (
              <Button onClick={() => window.location.href = '/add-employee'}>
                Add First Employee
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
