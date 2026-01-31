import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import type { WaterSensor } from '../../types';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Maximize } from 'lucide-react';

interface YamunaMapProps {
  sensors: WaterSensor[];
}

const getHealthColor = (score: number): string => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
};

const YamunaMap = ({ sensors }: YamunaMapProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const center: [number, number] = [28.6289, 77.2495];

  const riverPath: [number, number][] = [
    [28.7132, 77.2378],
    [28.6800, 77.2400],
    [28.6500, 77.2450],
    [28.6289, 77.2495],
    [28.5906, 77.2500],
    [28.5355, 77.3025],
  ];

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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Polyline
          positions={riverPath}
          pathOptions={{ color: '#0ea5e9', weight: 6, opacity: 0.7 }}
        />
        {sensors.map((sensor) => (
          <CircleMarker
            key={sensor.id}
            center={[sensor.location.latitude, sensor.location.longitude]}
            radius={15}
            fillColor={getHealthColor(sensor.lastReading.healthScore)}
            color={getHealthColor(sensor.lastReading.healthScore)}
            weight={3}
            opacity={1}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{sensor.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Segment:</strong> {sensor.segment}</p>
                  <p><strong>Health Score:</strong> <span className={sensor.lastReading.healthScore < 40 ? 'text-red-600 font-bold' : ''}>{sensor.lastReading.healthScore}/100</span></p>
                  <p><strong>Status:</strong> {sensor.lastReading.status.toUpperCase()}</p>
                  <p><strong>DO:</strong> {sensor.lastReading.dissolvedOxygen} mg/L</p>
                  <p><strong>BOD:</strong> {sensor.lastReading.bod} mg/L</p>
                  <p><strong>pH:</strong> {sensor.lastReading.ph}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default YamunaMap;
