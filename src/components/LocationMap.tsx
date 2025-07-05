
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
        const [latStr, lngStr] = location.split(', ').map(coord => coord.trim());
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) throw new Error('Invalid coordinates');

        // Use Leaflet instead of Mapbox (no API key needed)
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!mounted) return;

        // Initialize Leaflet map with OpenStreetMap tiles (free)
        map.current = L.default.map(mapContainer.current).setView([lat, lng], 16);

        // Add OpenStreetMap tiles (completely free, no token needed)
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map.current);

        // Create custom marker
        const markerIcon = L.default.divIcon({
          html: `<div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${markerColor === 'green' ? '#10b981' : '#3b82f6'}; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.default.marker([lat, lng], { icon: markerIcon }).addTo(map.current);

        if (mounted) {
          setIsLoading(false);
          setHasError(false);
        }

      } catch (error) {
        console.error('Map error:', error);
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

  if (hasError || !location) {
    return (
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <div className="text-center">
          <MapPin className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Location: {location}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-md" style={{ width: `${width}px` }}>
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
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-xs text-gray-500">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default LocationMap;
