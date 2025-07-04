
import { MapPin } from 'lucide-react';
import { AttendanceLog } from '@/hooks/useAttendance';

interface AttendanceLocationSectionProps {
  todayAttendance: AttendanceLog;
  onLogClick: (log: AttendanceLog) => void;
}

const AttendanceLocationSection = ({ todayAttendance, onLogClick }: AttendanceLocationSectionProps) => {
  if (!todayAttendance.location) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
        <MapPin className="w-5 h-5" />
        <span className="font-medium">Work Location</span>
      </div>
      
      <div className="text-center py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Coordinates: {todayAttendance.location}
        </p>
      </div>
    </div>
  );
};

export default AttendanceLocationSection;
