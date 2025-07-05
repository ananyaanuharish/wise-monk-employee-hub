
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AttendanceHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-0 h-auto font-normal"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Attendance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your daily work hours
        </p>
      </div>
    </div>
  );
};

export default AttendanceHeader;
