
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkHourLogsTable from '@/components/WorkHourLogsTable';
import { AttendanceLog } from '@/hooks/useAttendance';

interface WorkHourLogsCardProps {
  logs: AttendanceLog[];
  onLogClick: (log: AttendanceLog) => void;
}

const WorkHourLogsCard = ({ logs, onLogClick }: WorkHourLogsCardProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">📅 Work Hour Logs</CardTitle>
        <CardDescription>
          View your complete attendance history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkHourLogsTable 
          logs={logs} 
          onLogClick={onLogClick} 
        />
      </CardContent>
    </Card>
  );
};

export default WorkHourLogsCard;
