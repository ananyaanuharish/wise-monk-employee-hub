
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { AttendanceLog } from '@/hooks/useAttendance';

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  todayAttendance: AttendanceLog;
}

const ClockOutModal = ({ isOpen, onClose, onConfirm, isLoading, todayAttendance }: ClockOutModalProps) => {
  const [useLocation, setUseLocation] = useState(false);
  const [confirmWorkplace, setConfirmWorkplace] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (useLocation) {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        setUseLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationError(null);
        },
        (error) => {
          setLocationError('Location permission denied or unavailable');
          setUseLocation(false);
          setConfirmWorkplace(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setCoordinates(null);
      setConfirmWorkplace(false);
      setLocationError(null);
    }
  }, [useLocation]);

  const handleSubmit = () => {
    if (coordinates && confirmWorkplace) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setUseLocation(false);
    setConfirmWorkplace(false);
    setLocationError(null);
    setCoordinates(null);
    onClose();
  };

  const minutesWorked = differenceInMinutes(currentTime, new Date(todayAttendance.clock_in_time));
  const isSubmitEnabled = useLocation && confirmWorkplace && coordinates && !locationError;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Clock Out</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">CLOCK IN:</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              {format(new Date(todayAttendance.clock_in_time), 'h:mm a')} - {minutesWorked} minutes ago
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Time:</p>
            <p className="text-lg font-semibold">
              {format(currentTime, 'EEEE, MMMM d, yyyy - h:mm:ss a')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="use-location" className="text-sm font-medium">
                Use current location
              </label>
              <Switch
                id="use-location"
                checked={useLocation}
                onCheckedChange={setUseLocation}
              />
            </div>

            {locationError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {locationError}
              </p>
            )}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirm-workplace"
                checked={confirmWorkplace}
                onCheckedChange={(checked) => setConfirmWorkplace(checked as boolean)}
                disabled={!useLocation || !coordinates}
              />
              <label 
                htmlFor="confirm-workplace" 
                className={`text-sm ${
                  !useLocation || !coordinates 
                    ? 'text-gray-400 dark:text-gray-600' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                I confirm that I am currently located in my designated work place
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isSubmitEnabled || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Clocking Out...' : 'Clock Out'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClockOutModal;
