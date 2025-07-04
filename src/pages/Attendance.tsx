
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import AttendanceLogModal from '@/components/AttendanceLogModal';
import AttendanceStatus from '@/components/AttendanceStatus';
import AttendanceTimeDisplay from '@/components/AttendanceTimeDisplay';
import AttendanceLocationSection from '@/components/AttendanceLocationSection';
import AttendanceActions from '@/components/AttendanceActions';
import { useAttendance, AttendanceLog } from '@/hooks/useAttendance';
import { Button } from '@/components/ui/button';

const Attendance = () => {
  const navigate = useNavigate();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceLog | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getTodayAttendance, clockIn, clockOut, getLocation, isLoading } = useAttendance();

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    setIsLoadingData(true);
    const attendance = await getTodayAttendance();
    setTodayAttendance(attendance);
    setIsLoadingData(false);
  };

  const handleClockIn = async () => {
    const location = await getLocation();
    const result = await clockIn(location);
    if (result.success) {
      await loadTodayAttendance();
    }
  };

  const handleClockOut = async () => {
    const result = await clockOut();
    if (result.success) {
      await loadTodayAttendance();
    }
  };

  const handleLogClick = (log: AttendanceLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Attendance
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your daily work hours
            </p>
          </div>

          <Card className="border-0 shadow-lg">
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
                    onLogClick={handleLogClick} 
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    You haven't clocked in today yet
                  </p>
                </div>
              )}

              <AttendanceActions
                todayAttendance={todayAttendance}
                isLoading={isLoading}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AttendanceLogModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Attendance;
