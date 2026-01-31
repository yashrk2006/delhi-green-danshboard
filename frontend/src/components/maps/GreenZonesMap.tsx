import { MapContainer, TileLayer, Circle, Popup, ZoomControl } from 'react-leaflet';
import type { GreenZone } from '../../types';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Maximize } from 'lucide-react';

interface GreenZonesMapProps {
  zones: GreenZone[];
  useSatellite?: boolean;
}

const GreenZonesMap = ({ zones, useSatellite = false }: GreenZonesMapProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const center: [number, number] = [28.6139, 77.2090];

  const getRadius = (area: number) => Math.sqrt(area * 10000 / Math.PI);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-[100] bg-white' : 'w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100'}`}>
      {/* Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-md border border-gray-200 hover:bg-white transition-all"
        >
          <Maximize className="w-4 h-4 text-gray-700" />
        </button>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg shadow-md border backdrop-blur-md transition-colors ${isOffline ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isOffline ? 'Offline' : 'Cache Active'}
          </span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={11}
        zoomControl={false}
        style={{ height: isFullscreen ? '100dvh' : '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={useSatellite
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <ZoomControl position="bottomright" />
        {zones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.location.latitude, zone.location.longitude]}
            radius={getRadius(zone.area)}
            pathOptions={{
              color: '#16a34a',
              fillColor: '#22c55e',
              fillOpacity: 0.4,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Type:</strong> {zone.type}</p>
                  <p><strong>Area:</strong> {zone.area} hectares</p>
                  <p><strong>Green Cover:</strong> {zone.greenCover}%</p>
                  <p><strong>Trees:</strong> {zone.trees.toLocaleString()}</p>
                  <p><strong>Zone:</strong> {zone.location.zone}</p>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default GreenZonesMap;
