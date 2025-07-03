
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  location: string;
  title: string;
  markerColor: 'green' | 'blue';
  height?: number;
}

const LocationMap = ({ location, title, markerColor, height = 200 }: LocationMapProps) => {
  const [lat, lng] = location.split(', ').map(coord => parseFloat(coord.trim()));

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">Location not available</p>
      </div>
    );
  }

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${markerColor === 'green' ? '#10b981' : '#3b82f6'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="rounded-lg overflow-hidden border">
      <div className={`px-3 py-2 text-sm font-medium ${
        markerColor === 'green' 
          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      }`}>
        {title}
      </div>
      <div style={{ height: `${height}px` }}>
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMap;
