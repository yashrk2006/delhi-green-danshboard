import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { AirQualitySensor } from '../../services/airQualityService';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Maximize } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface AirQualityMapProps {
  sensors?: AirQualitySensor[];
}

const getAQIColor = (aqi: number | undefined): string => {
  if (aqi === undefined) return '#999';
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 150) return '#ff7e00';
  if (aqi <= 200) return '#ff0000';
  if (aqi <= 300) return '#8f3f97';
  return '#7e0023';
};

const AirQualityMap = ({ sensors = [] }: AirQualityMapProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  // ...
  const [isFullscreen, setIsFullscreen] = useState(false);
  const center: [number, number] = [28.6139, 77.2090];

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
        {sensors.map((sensor) => (
          (sensor.location && sensor.location.latitude && sensor.location.longitude) ? (
            <CircleMarker
              key={sensor._id || sensor.stationId}
              center={[sensor.location.latitude, sensor.location.longitude]}
              radius={20}
              fillColor={getAQIColor(sensor.lastReading?.aqi)}
              color={getAQIColor(sensor.lastReading?.aqi)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{sensor.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>AQI:</strong> {sensor.lastReading?.aqi} ({sensor.lastReading?.category})</p>
                    <p><strong>PM2.5:</strong> {sensor.lastReading?.pm25} ug/m3</p>
                    <p><strong>PM10:</strong> {sensor.lastReading?.pm10} ug/m3</p>
                    <p><strong>NOx:</strong> {sensor.lastReading?.no2} ppb</p>
                    <p><strong>Zone:</strong> {sensor.location?.zone}</p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
};

export default AirQualityMap;
