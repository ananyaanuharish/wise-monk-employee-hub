
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import LocationMap from './LocationMap';
import { AttendanceLog } from '@/hooks/useAttendance';

interface AttendanceLogModalProps {
  log: AttendanceLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceLogModal = ({ log, isOpen, onClose }: AttendanceLogModalProps) => {
  if (!log) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Attendance Details - {format(new Date(log.clock_in_time), 'MMMM d, yyyy')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Time Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Clock In</span>
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                {formatTime(log.clock_in_time)}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${
              log.clock_out_time 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <div className={`flex items-center space-x-2 mb-2 ${
                log.clock_out_time 
                  ? 'text-blue-700 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-medium">Clock Out</span>
              </div>
              <p className={`text-2xl font-bold ${
                log.clock_out_time 
                  ? 'text-blue-800 dark:text-blue-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {log.clock_out_time ? formatTime(log.clock_out_time) : '- - : - -'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Duration</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateDuration(log.clock_in_time, log.clock_out_time)}
              </p>
            </div>
          </div>

          {/* Location Maps */}
          {log.location && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5" />
                <span className="font-medium text-lg">Location Details</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationMap
                  location={log.location}
                  title="Clock In Location"
                  markerColor="green"
                  height={250}
                />
                
                {log.clock_out_time && (
                  <LocationMap
                    location={log.location}
                    title="Clock Out Location"
                    markerColor="blue"
                    height={250}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceLogModal;
