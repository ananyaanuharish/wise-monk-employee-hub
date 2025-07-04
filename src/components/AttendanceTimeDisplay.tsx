
import { Clock } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { AttendanceLog } from '@/hooks/useAttendance';

interface AttendanceTimeDisplayProps {
  todayAttendance: AttendanceLog;
  onLogClick: (log: AttendanceLog) => void;
}

const AttendanceTimeDisplay = ({ todayAttendance, onLogClick }: AttendanceTimeDisplayProps) => {
  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'h:mm a');
  };

  const calculateDuration = (clockIn: string, clockOut?: string) => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-green-700 dark:text-green-400 mb-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Clock In</span>
        </div>
        <p className="text-2xl font-bold text-green-800 dark:text-green-300">
          {formatTime(todayAttendance.clock_in_time)}
        </p>
      </div>

      <div className={`p-4 rounded-lg ${
        todayAttendance.clock_out_time 
          ? 'bg-blue-50 dark:bg-blue-900/20' 
          : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <div className={`flex items-center space-x-2 mb-2 ${
          todayAttendance.clock_out_time 
            ? 'text-blue-700 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          <Clock className="w-4 h-4" />
          <span className="font-medium">Clock Out</span>
        </div>
        <p className={`text-2xl font-bold ${
          todayAttendance.clock_out_time 
            ? 'text-blue-800 dark:text-blue-300' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {todayAttendance.clock_out_time ? formatTime(todayAttendance.clock_out_time) : '- - : - -'}
        </p>
      </div>

      <div 
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => onLogClick(todayAttendance)}
      >
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Duration</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {calculateDuration(todayAttendance.clock_in_time, todayAttendance.clock_out_time)}
        </p>
      </div>
    </div>
  );
};

export default AttendanceTimeDisplay;
