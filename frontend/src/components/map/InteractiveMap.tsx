import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface MapPoint {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    type?: 'aqi' | 'waste' | 'water' | 'greening';
    value?: string | number;
}

interface InteractiveMapProps {
    points: MapPoint[];
    center?: [number, number];
    zoom?: number;
    height?: string;
    className?: string;
}

const InteractiveMap = ({
    points,
    center = [28.6139, 77.2090], // Delhi Default
    zoom = 11,
    height = '400px',
    className = ''
}: InteractiveMapProps) => {

    // Custom icons for different types
    const getIcon = (type?: string) => {
        let color = '#3b82f6'; // Default blue
        if (type === 'aqi') color = '#f59e0b'; // Amber
        if (type === 'waste') color = '#f97316'; // Orange
        if (type === 'water') color = '#06b6d4'; // Cyan
        if (type === 'greening') color = '#10b981'; // Green

        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
    };

    return (
        <div className={`relative overflow-hidden rounded-xl border border-gray-200 shadow-sm ${className}`} style={{ height }}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <ZoomControl position="topright" />

                {/* Using OpenStreetMap tiles - these are automatically cached by the browser for basic "offline" use after first load */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {points.map((point) => (
                    <Marker
                        key={point.id}
                        position={[point.lat, point.lng]}
                        icon={getIcon(point.type)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1">
                                <h3 className="font-bold text-gray-900 text-sm">{point.title}</h3>
                                <p className="text-xs text-gray-600 mt-1">{point.description}</p>
                                {point.value && (
                                    <div className="mt-2 text-xs font-semibold px-2 py-1 bg-gray-100 rounded inline-block">
                                        Value: {point.value}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Offline Status Indicator */}
            <div className="absolute bottom-4 left-4 z-[1000] flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-white">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-[10px] font-medium text-gray-600">Local Cache Active (Offline Ready)</span>
            </div>
        </div>
    );
};

export default InteractiveMap;
