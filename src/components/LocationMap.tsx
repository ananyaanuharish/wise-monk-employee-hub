
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  location: string;
  title?: string;
  markerColor?: 'green' | 'blue';
  height?: number;
  width?: number;
}

const LocationMap = ({ location, title, markerColor = 'blue', height = 200, width = 300 }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!mapContainer.current || !location) return;

      try {
        // Parse coordinates
        const [latStr, lngStr] = location.split(', ').map(coord => coord.trim());
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) {
          throw new Error('Invalid coordinates');
        }

        // Dynamically import Leaflet to prevent initial loading issues
        const [L, { MapContainer, TileLayer, Marker }] = await Promise.all([
          import('leaflet'),
          import('react-leaflet')
        ]);

        // Fix for default markers - ensure this runs after Leaflet is loaded
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mounted) return;

        // Create custom icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${markerColor === 'green' ? '#10b981' : '#3b82f6'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        // Initialize the map
        map.current = L.map(mapContainer.current).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.current);

        L.marker([lat, lng], { icon: customIcon }).addTo(map.current);

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (map.current) {
        map.current.remove();
      }
    };
  }, [location, markerColor]);

  // Fallback for invalid coordinates or errors
  if (hasError || !location) {
    return (
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <div className="text-center">
          <MapPin className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {location || 'Location not available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border" style={{ width: `${width}px` }}>
      {title && (
        <div className={`px-3 py-2 text-sm font-medium ${
          markerColor === 'green' 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
        }`}>
          {title}
        </div>
      )}
      <div style={{ height: `${height}px`, position: 'relative' }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default LocationMap;
