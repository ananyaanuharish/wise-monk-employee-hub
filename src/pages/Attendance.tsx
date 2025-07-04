
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LocationMap from '@/components/LocationMap';
import AttendanceLogModal from '@/components/AttendanceLogModal';
import { useAttendance, AttendanceLog } from '@/hooks/useAttendance';
import { format } from 'date-fns';

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

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'h:mm a');
  };

  const calculateDuration = (clockIn: string, clockOut?: string) => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

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

    return {
      status: 'Currently Working',
      statusColor: 'text-blue-600',
      icon: Clock,
      iconColor: 'text-blue-500'
    };
  };

  const handleLogClick = (log: AttendanceLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

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
          {/* Back to Dashboard Button */}
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
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                  <span className={`font-medium ${statusInfo.statusColor}`}>
                    {statusInfo.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {todayAttendance ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-700 dark:text-green-400 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Clock In</span>
                      </div>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                        {formatTime(todayAttendance.clock_in_time)}
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      todayAttendance.clock_out_time 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <div className={`flex items-center space-x-2 mb-2 ${
                        todayAttendance.clock_out_time 
                          ? 'text-blue-700 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Clock Out</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        todayAttendance.clock_out_time 
                          ? 'text-blue-800 dark:text-blue-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {todayAttendance.clock_out_time 
                          ? formatTime(todayAttendance.clock_out_time) 
                          : '- - : - -'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Duration
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {calculateDuration(todayAttendance.clock_in_time, todayAttendance.clock_out_time)}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Map */}
                  {todayAttendance.location && (
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
                      
                      {/* Clickable log entry */}
                      <div 
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleLogClick(todayAttendance)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            View detailed attendance log
                          </span>
                          <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    You haven't clocked in today yet
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4 pt-6 border-t">
                {!todayAttendance ? (
                  <Button
                    onClick={handleClockIn}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      "Clocking In..."
                    ) : (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Clock In
                      </>
                    )}
                  </Button>
                ) : !todayAttendance.clock_out_time ? (
                  <Button
                    onClick={handleClockOut}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      "Clocking Out..."
                    ) : (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Clock Out
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      Today's work is complete!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Log Modal */}
      <AttendanceLogModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Attendance;
