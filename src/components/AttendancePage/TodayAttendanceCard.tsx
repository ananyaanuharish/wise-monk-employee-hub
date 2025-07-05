
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import AttendanceStatus from '@/components/AttendanceStatus';
import AttendanceTimeDisplay from '@/components/AttendanceTimeDisplay';
import AttendanceLocationSection from '@/components/AttendanceLocationSection';
import AttendanceActions from '@/components/AttendanceActions';
import { AttendanceLog } from '@/hooks/useAttendance';

interface TodayAttendanceCardProps {
  todayAttendance: AttendanceLog | null;
  isLoading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  onPause: () => void;
  onResume: () => void;
  onLogClick: (log: AttendanceLog) => void;
}

const TodayAttendanceCard = ({
  todayAttendance,
  isLoading,
  onClockIn,
  onClockOut,
  onPause,
  onResume,
  onLogClick
}: TodayAttendanceCardProps) => {
  return (
    <Card className="border-0 shadow-lg mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Today's Attendance</CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </div>
          <AttendanceStatus todayAttendance={todayAttendance} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {todayAttendance ? (
          <div className="space-y-6">
            <AttendanceTimeDisplay todayAttendance={todayAttendance} />
            <AttendanceLocationSection 
              todayAttendance={todayAttendance} 
              onLogClick={onLogClick} 
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              You haven't clocked in today yet
            </p>
          </div>
        )}

        <AttendanceActions
          todayAttendance={todayAttendance}
          isLoading={isLoading}
          onClockIn={onClockIn}
          onClockOut={onClockOut}
          onPause={onPause}
          onResume={onResume}
        />
      </CardContent>
    </Card>
  );
};

export default TodayAttendanceCard;
