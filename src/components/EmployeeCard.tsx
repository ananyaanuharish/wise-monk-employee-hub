
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Mail, Phone, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Employee } from "@/hooks/useEmployees";
import EmployeeDeleteDialog from "./EmployeeDeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: string) => void;
}

const EmployeeCard = ({ employee, onDelete }: EmployeeCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return "Recently added";
    }
    return date.toLocaleDateString();
  };

  const formatJoiningDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete(employee.id);
    toast({
      title: "✨ Employee removed successfully!",
      description: `${employee.full_name} has been removed from the directory.`,
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {employee.profile_picture ? (
                <img
                  src={employee.profile_picture}
                  alt={employee.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(employee.full_name)}
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {employee.full_name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {employee.email}
              </p>
              {employee.phone && (
                <p className="text-sm text-muted-foreground mb-2 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {employee.phone}
                </p>
              )}
              {employee.joining_date && (
                <p className="text-sm text-muted-foreground mb-2 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined: {formatJoiningDate(employee.joining_date)}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {employee.department}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {employee.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(employee.created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/edit-employee/${employee.id}`)}
              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 hover:scale-105 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 hover:scale-105 transition-all duration-200"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmployeeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employee={employee}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default EmployeeCard;
