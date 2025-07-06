
import React from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { Employee } from '@/hooks/useEmployees';

interface EmployeeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onConfirm: () => void;
}

const EmployeeDeleteDialog = ({
  open,
  onOpenChange,
  employee,
  onConfirm
}: EmployeeDeleteDialogProps) => {
  if (!employee) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hold on! 🤔"
      description="Are you sure you want to remove this team member from the directory?"
      confirmText="Yes, Remove Them"
      cancelText="Keep Them Safe"
      onConfirm={onConfirm}
      variant="danger"
    >
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {employee.profile_picture ? (
          <img
            src={employee.profile_picture}
            alt={employee.full_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(employee.full_name)}
          </div>
        )}
        <div>
          <p className="font-medium text-foreground">
            This will permanently delete <strong>{employee.full_name}</strong>
          </p>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </div>
      </div>
    </ConfirmationDialog>
  );
};

export default EmployeeDeleteDialog;
