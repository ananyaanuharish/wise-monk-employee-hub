
import { format } from 'date-fns';
import { AttendanceLog } from '@/hooks/useAttendance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LocationMap from './LocationMap';

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
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onLogClick(log)}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {format(new Date(log.clock_in_time), 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {calculateTotalHours(log)} hours
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Clock In</p>
              <p className="text-lg font-bold text-green-600">
                {formatTime(log.clock_in_time)}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Clock Out</p>
              <p className="text-lg font-bold text-blue-600">
                {log.clock_out_time ? formatTime(log.clock_out_time) : '- - : - -'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {log.location && (
                <>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Clock In</p>
                    <LocationMap
                      location={log.location}
                      markerColor="green"
                      height={60}
                      width={120}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Clock Out</p>
                    <LocationMap
                      location={log.location}
                      markerColor="blue"
                      height={60}
                      width={120}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkHourLogsTable;
