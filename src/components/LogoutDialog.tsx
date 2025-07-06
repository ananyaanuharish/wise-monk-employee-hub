
import React from 'react';
import ConfirmationDialog from './ConfirmationDialog';

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const LogoutDialog = ({
  open,
  onOpenChange,
  onConfirm
}: LogoutDialogProps) => {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Taking a break? 👋"
      description="Are you sure you want to sign out of your session?"
      confirmText="Yes, Sign Me Out"
      cancelText="Stay Logged In"
      onConfirm={onConfirm}
      variant="default"
    />
  );
};

export default LogoutDialog;
