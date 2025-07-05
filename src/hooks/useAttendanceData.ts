
import { useState, useEffect } from 'react';
import { useAttendance, AttendanceLog } from '@/hooks/useAttendance';

export const useAttendanceData = () => {
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

  useEffect(() => {
    loadAttendanceData();
  }, []);

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

  // Filter logs for history display - only exclude today's attendance if it's not completed yet
  const historyLogs = allLogs.filter(log => {
    if (!todayAttendance) return true;
    // If today's attendance is completed (has clock_out_time), include it in history
    if (todayAttendance.clock_out_time) return true;
    // If today's attendance is not completed, exclude it from history
    return log.id !== todayAttendance.id;
  });

  return {
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
  };
};
