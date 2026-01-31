import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import type { WasteVehicle, WasteBin } from '../../types';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Maximize } from 'lucide-react';

interface WasteManagementMapProps {
  vehicles: WasteVehicle[];
  bins: WasteBin[];
}

const truckIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background: linear-gradient(135deg, #f97316, #ea580c); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M10 17h4V5H2v12h3m5 0a3 3 0 1 0 6 0m-6 0a3 3 0 1 1 6 0"/>
      <path d="M20 17V9a2 2 0 0 0-2-2h-4v10h3m3 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const getBinIcon = (fillLevel: number) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background: ${fillLevel >= 90 ? '#ef4444' : fillLevel >= 80 ? '#f97316' : '#22c55e'}; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const WasteManagementMap = ({ vehicles, bins }: WasteManagementMapProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
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
        style={{ height: isFullscreen ? '100dvh' : '350px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.location.latitude, vehicle.location.longitude]}
            icon={truckIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{vehicle.vehicleNumber}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Type:</strong> {vehicle.type}</p>
                  <p><strong>Route:</strong> {vehicle.route}</p>
                  <p><strong>Status:</strong> <span className={vehicle.status === 'active' ? 'text-green-600' : 'text-gray-500'}>{vehicle.status.toUpperCase()}</span></p>
                  <p><strong>Fill Level:</strong> {Math.round((vehicle.filled / vehicle.capacity) * 100)}%</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={[bin.location.latitude, bin.location.longitude]}
            icon={getBinIcon(bin.fillLevel)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold mb-2">{bin.id}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Location:</strong> {bin.location.address}</p>
                  <p><strong>Fill Level:</strong> {bin.fillLevel}%</p>
                  <p><strong>Type:</strong> {bin.type}</p>
                  <p><strong>Status:</strong> <span className={bin.status === 'overflow' ? 'text-red-600' : bin.status === 'full' ? 'text-orange-600' : 'text-green-600'}>{bin.status.toUpperCase()}</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WasteManagementMap;
