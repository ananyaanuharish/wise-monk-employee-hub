
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import { AttendanceLog } from '@/hooks/useAttendance';

interface AttendanceActionsProps {
  todayAttendance: AttendanceLog | null;
  isLoading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

const AttendanceActions = ({ todayAttendance, isLoading, onClockIn, onClockOut }: AttendanceActionsProps) => {
  if (!todayAttendance) {
    return (
      <div className="flex justify-center space-x-4 pt-6 border-t">
        <Button
          onClick={onClockIn}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          size="lg"
        >
          {isLoading ? (
            "Clocking In..."
          ) : (
            <>
              <Clock className="w-5 h-5 mr-2" />
              Clock In
            </>
          )}
        </Button>
      </div>
    );
  }

  if (!todayAttendance.clock_out_time) {
    return (
      <div className="flex justify-center space-x-4 pt-6 border-t">
        <Button
          onClick={onClockOut}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          size="lg"
        >
          {isLoading ? (
            "Clocking Out..."
          ) : (
            <>
              <Clock className="w-5 h-5 mr-2" />
              Clock Out
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4 pt-6 border-t">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <p className="text-green-600 dark:text-green-400 font-medium">
          Today's work is complete!
        </p>
      </div>
    </div>
  );
};

export default AttendanceActions;
