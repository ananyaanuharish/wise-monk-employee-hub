
import ClockInModal from '@/components/ClockInModal';
import ClockOutModal from '@/components/ClockOutModal';
import AttendanceLogModal from '@/components/AttendanceLogModal';
import { AttendanceLog } from '@/hooks/useAttendance';

interface AttendanceModalsProps {
  isClockInModalOpen: boolean;
  setIsClockInModalOpen: (open: boolean) => void;
  isClockOutModalOpen: boolean;
  setIsClockOutModalOpen: (open: boolean) => void;
  isLogModalOpen: boolean;
  setIsLogModalOpen: (open: boolean) => void;
  selectedLog: AttendanceLog | null;
  todayAttendance: AttendanceLog | null;
  isLoading: boolean;
  onClockIn: (location: string) => void;
  onClockOut: () => void;
}

const AttendanceModals = ({
  isClockInModalOpen,
  setIsClockInModalOpen,
  isClockOutModalOpen,
  setIsClockOutModalOpen,
  isLogModalOpen,
  setIsLogModalOpen,
  selectedLog,
  todayAttendance,
  isLoading,
  onClockIn,
  onClockOut
}: AttendanceModalsProps) => {
  return (
    <>
      <ClockInModal
        isOpen={isClockInModalOpen}
        onClose={() => setIsClockInModalOpen(false)}
        onConfirm={onClockIn}
        isLoading={isLoading}
      />

      {todayAttendance && (
        <ClockOutModal
          isOpen={isClockOutModalOpen}
          onClose={() => setIsClockOutModalOpen(false)}
          onConfirm={onClockOut}
          isLoading={isLoading}
          todayAttendance={todayAttendance}
        />
      )}

      <AttendanceLogModal
        log={selectedLog}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </>
  );
};

export default AttendanceModals;
