
import { MapPin, ArrowRight } from 'lucide-react';
import LocationMap from './LocationMap';
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
      
      <div className="flex justify-center">
        <LocationMap
          location={todayAttendance.location}
          markerColor="blue"
          height={200}
          width={300}
        />
      </div>
      
      <div 
        className="bg-white dark:bg-gray-800 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => onLogClick(todayAttendance)}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            View detailed attendance log
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceLocationSection;
