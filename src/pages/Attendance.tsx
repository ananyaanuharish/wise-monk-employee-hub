
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import AttendanceStatus from '@/components/AttendanceStatus';
import AttendanceTimeDisplay from '@/components/AttendanceTimeDisplay';
import AttendanceLocationSection from '@/components/AttendanceLocationSection';
import AttendanceActions from '@/components/AttendanceActions';
import WorkHourLogsTable from '@/components/WorkHourLogsTable';
import ClockInModal from '@/components/ClockInModal';
import ClockOutModal from '@/components/ClockOutModal';
import AttendanceLogModal from '@/components/AttendanceLogModal';
import { useAttendance, AttendanceLog } from '@/hooks/useAttendance';
import { Button } from '@/components/ui/button';

const Attendance = () => {
  const navigate = useNavigate();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceLog | null>(null);
  const [allLogs, setAllLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const { 
    getTodayAttendance, 
    getAllAttendanceLogs, 
    clockIn, 
    clockOut, 
    pauseWork, 
    resumeWork, 
    isLoading 
  } = useAttendance();

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    setIsLoadingData(true);
    const [todayData, allLogsData] = await Promise.all([
      getTodayAttendance(),
      getAllAttendanceLogs()
    ]);
    setTodayAttendance(todayData);
    setAllLogs(allLogsData);
    setIsLoadingData(false);
  };

  const handleClockIn = async (location: string) => {
    const result = await clockIn(location);
    if (result.success) {
      setIsClockInModalOpen(false);
      await loadAttendanceData();
    }
  };

  const handleClockOut = async () => {
    const result = await clockOut();
    if (result.success) {
      setIsClockOutModalOpen(false);
      await loadAttendanceData();
    }
  };

  const handlePause = async () => {
    const result = await pauseWork();
    if (result.success) {
      await loadAttendanceData();
    }
  };

  const handleResume = async () => {
    const result = await resumeWork();
    if (result.success) {
      await loadAttendanceData();
    }
  };

  const handleLogClick = (log: AttendanceLog) => {
    setSelectedLog(log);
    setIsLogModalOpen(true);
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

  // Filter out today's attendance from all logs for history display
  const historyLogs = allLogs.filter(log => {
    if (!todayAttendance) return true;
    return log.id !== todayAttendance.id;
  });

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
                    onLogClick={handleLogClick} 
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
                onClockIn={() => setIsClockInModalOpen(true)}
                onClockOut={() => setIsClockOutModalOpen(true)}
                onPause={handlePause}
                onResume={handleResume}
              />
            </CardContent>
          </Card>

          {/* Work Hour Logs Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">📅 Work Hour Logs</CardTitle>
              <CardDescription>
                View your complete attendance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkHourLogsTable 
                logs={historyLogs} 
                onLogClick={handleLogClick} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ClockInModal
        isOpen={isClockInModalOpen}
        onClose={() => setIsClockInModalOpen(false)}
        onConfirm={handleClockIn}
        isLoading={isLoading}
      />

      {todayAttendance && (
        <ClockOutModal
          isOpen={isClockOutModalOpen}
          onClose={() => setIsClockOutModalOpen(false)}
          onConfirm={handleClockOut}
          isLoading={isLoading}
          todayAttendance={todayAttendance}
        />
      )}

      <AttendanceLogModal
        log={selectedLog}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
};

export default Attendance;
