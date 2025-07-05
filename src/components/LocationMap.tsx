
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

        // Dynamically import Mapbox GL
        const mapboxgl = await import('mapbox-gl');
        await import('mapbox-gl/dist/mapbox-gl.css');

        if (!mounted) return;

        // Set Mapbox access token (using a placeholder - user should add their own)
        mapboxgl.default.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

        // Initialize the map
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 15,
          interactive: true
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

        // Create custom marker
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = markerColor === 'green' ? '#10b981' : '#3b82f6';
        markerElement.style.border = '3px solid white';
        markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Add marker to map
        new mapboxgl.default.Marker(markerElement)
          .setLngLat([lng, lat])
          .addTo(map.current);

        map.current.on('load', () => {
          if (mounted) {
            setIsLoading(false);
          }
        });

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
            Map unavailable
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
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default LocationMap;
