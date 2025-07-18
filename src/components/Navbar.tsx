
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Moon, Sun, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import LogoutDialog from "./LogoutDialog";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Wisemonk</h1>
              <p className="text-xs text-muted-foreground">Managed by Bhargava T</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/attendance')}
              className="text-gray-700 dark:text-gray-300"
            >
              <Clock className="w-4 h-4 mr-2" />
              Attendance
            </Button>
            
            <Button
              onClick={() => navigate('/add-employee')}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleLogoutClick}
              className="hover:scale-105 transition-transform duration-200"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Navbar;
