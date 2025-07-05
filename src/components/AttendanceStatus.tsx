
import { CheckCircle, XCircle, Clock, Pause } from 'lucide-react';
import { AttendanceLog } from '@/hooks/useAttendance';

interface AttendanceStatusProps {
  todayAttendance: AttendanceLog | null;
}

const AttendanceStatus = ({ todayAttendance }: AttendanceStatusProps) => {
  const getStatusInfo = () => {
    if (!todayAttendance) {
      return {
        status: 'Not Clocked In',
        statusColor: 'text-gray-500',
        icon: XCircle,
        iconColor: 'text-gray-400'
      };
    }

    if (todayAttendance.clock_out_time) {
      return {
        status: 'Completed',
        statusColor: 'text-green-600',
        icon: CheckCircle,
        iconColor: 'text-green-500'
      };
    }

    if (todayAttendance.status === 'paused') {
      return {
        status: 'Paused',
        statusColor: 'text-yellow-600',
        icon: Pause,
        iconColor: 'text-yellow-500'
      };
    }

    return {
      status: 'Working',
      statusColor: 'text-blue-600',
      icon: Clock,
      iconColor: 'text-blue-500'
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex items-center space-x-2">
      <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
      <span className={`font-medium ${statusInfo.statusColor}`}>
        {statusInfo.status}
      </span>
    </div>
  );
};

export default AttendanceStatus;
