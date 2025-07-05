
import { format } from 'date-fns';
import { AttendanceLog } from '@/hooks/useAttendance';
import { Clock } from 'lucide-react';

interface WorkHourLogsTableProps {
  logs: AttendanceLog[];
  onLogClick: (log: AttendanceLog) => void;
}

const WorkHourLogsTable = ({ logs, onLogClick }: WorkHourLogsTableProps) => {
  const calculateTotalHours = (log: AttendanceLog) => {
    if (!log.clock_out_time) return '0.0';
    
    const start = new Date(log.clock_in_time);
    const end = new Date(log.clock_out_time);
    const diffMs = end.getTime() - start.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60)) - (log.total_paused_minutes || 0);
    const hours = totalMinutes / 60;
    return hours.toFixed(1);
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'h:mm a');
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No work hour logs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
          onClick={() => onLogClick(log)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {format(new Date(log.clock_in_time), 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {calculateTotalHours(log)} hours worked
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Clock In</p>
                <p className="text-lg font-bold text-green-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(log.clock_in_time)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Clock Out</p>
                <p className="text-lg font-bold text-blue-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {log.clock_out_time ? formatTime(log.clock_out_time) : '- - : - -'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkHourLogsTable;
