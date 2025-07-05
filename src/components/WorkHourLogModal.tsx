
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import LocationMap from './LocationMap';
import { AttendanceLog } from '@/hooks/useAttendance';

interface WorkHourLogModalProps {
  log: AttendanceLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const WorkHourLogModal = ({ log, isOpen, onClose }: WorkHourLogModalProps) => {
  if (!log) return null;

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'h:mm a');
  };

  const calculateDuration = (clockIn: string, clockOut?: string) => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60)) - (log.total_paused_minutes || 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {format(new Date(log.clock_in_time), 'MMMM d, yyyy')} - Total: {calculateDuration(log.clock_in_time, log.clock_out_time)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Clock In Section */}
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Clock In</h3>
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-900 dark:text-green-200">
                {format(new Date(log.clock_in_time), 'h:mm a')}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">Work Place Confirmation</span>
              </div>
            </div>
            
            {log.location && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Clock In Location</span>
                </div>
                <LocationMap
                  location={log.location}
                  title="Clock In Location"
                  markerColor="green"
                  height={200}
                  width={300}
                />
              </div>
            )}
          </div>

          {/* Clock Out Section */}
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              log.clock_out_time 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-semibold ${
                  log.clock_out_time 
                    ? 'text-blue-800 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Clock Out
                </h3>
                <Clock className={`w-5 h-5 ${
                  log.clock_out_time 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`} />
              </div>
              <p className={`text-xl font-bold ${
                log.clock_out_time 
                  ? 'text-blue-900 dark:text-blue-200' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {log.clock_out_time ? format(new Date(log.clock_out_time), 'h:mm a') : '- - : - -'}
              </p>
              {log.clock_out_time && (
                <div className="flex items-center space-x-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">Work Place Confirmation</span>
                </div>
              )}
            </div>
            
            {log.clock_out_time && log.location && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Clock Out Location</span>
                </div>
                <LocationMap
                  location={log.location}
                  title="Clock Out Location"
                  markerColor="blue"
                  height={200}
                  width={300}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkHourLogModal;
