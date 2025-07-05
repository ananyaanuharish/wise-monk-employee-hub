
import Navbar from '@/components/Navbar';
import AttendanceHeader from '@/components/AttendancePage/AttendanceHeader';
import TodayAttendanceCard from '@/components/AttendancePage/TodayAttendanceCard';
import WorkHourLogsCard from '@/components/AttendancePage/WorkHourLogsCard';
import AttendanceModals from '@/components/AttendancePage/AttendanceModals';
import { useAttendanceData } from '@/hooks/useAttendanceData';

const Attendance = () => {
  const {
    todayAttendance,
    historyLogs,
    isLoadingData,
    selectedLog,
    isLogModalOpen,
    setIsLogModalOpen,
    isClockInModalOpen,
    setIsClockInModalOpen,
    isClockOutModalOpen,
    setIsClockOutModalOpen,
    isLoading,
    handleClockIn,
    handleClockOut,
    handlePause,
    handleResume,
    handleLogClick
  } = useAttendanceData();

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
          <AttendanceHeader />

          <TodayAttendanceCard
            todayAttendance={todayAttendance}
            isLoading={isLoading}
            onClockIn={() => setIsClockInModalOpen(true)}
            onClockOut={() => setIsClockOutModalOpen(true)}
            onPause={handlePause}
            onResume={handleResume}
            onLogClick={handleLogClick}
          />

          <WorkHourLogsCard 
            logs={historyLogs} 
            onLogClick={handleLogClick} 
          />
        </div>
      </div>

      <AttendanceModals
        isClockInModalOpen={isClockInModalOpen}
        setIsClockInModalOpen={setIsClockInModalOpen}
        isClockOutModalOpen={isClockOutModalOpen}
        setIsClockOutModalOpen={setIsClockOutModalOpen}
        isLogModalOpen={isLogModalOpen}
        setIsLogModalOpen={setIsLogModalOpen}
        selectedLog={selectedLog}
        todayAttendance={todayAttendance}
        isLoading={isLoading}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
      />
    </div>
  );
};

export default Attendance;
