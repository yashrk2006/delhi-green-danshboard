import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import {
    airQualitySensors,
    wasteBins,
    wasteVehicles,
    waterSensors,
    greenZones,
    delhiLandmarks,
    noiseSensors
} from '../../data/mockData';
import { Wifi, WifiOff, Maximize, Landmark as LandmarkIcon, Cloud, Trash2, Droplets, Trees, Volume2 } from 'lucide-react';

const createCustomIcon = (color: string, IconComponent: any) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            <div style="color: white; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    ${IconComponent}
                </svg>
            </div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

const icons = {
    aqi: createCustomIcon('linear-gradient(135deg, #3b82f6, #2563eb)', '<path d="M17.5 19c.7 0 1.2-.6 1.2-1.2s-.5-1.2-1.2-1.2c-1 0-1.2-1.2-1.2-1.2-1 0-1.2-1.2-1.2-1.2s-.2 1.2-1.2 1.2c-1 0-1.2 1.2-1.2 1.2s-.5 1.2-1.2 1.2c-1 0-1.2 1.2-1.2 1.2"/><path d="M12 12s-1.5 4-5 4"/><path d="M12 12s1.5 4 5 4"/><circle cx="12" cy="12" r="3"/><path d="M12 9s0-4 0-4"/><path d="M12 15s0 4 0 4"/>'),
    waste: createCustomIcon('linear-gradient(135deg, #f97316, #ea580c)', '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>'),
    water: createCustomIcon('linear-gradient(135deg, #06b6d4, #0891b2)', '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7Z"/>'),
    greening: createCustomIcon('linear-gradient(135deg, #10b981, #059669)', '<path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8q0 1.8.6 3.4c.7 1.8 1.4 3.6 2 5.4c.5 1.4 1 2.8 1.4 4.2h8c.4-1.4.9-2.8 1.4-4.2c.6-1.8 1.3-3.6 2-5.4q.6-1.6.6-3.4Z"/><path d="M12 2v19"/><path d="M12 15c-2.2 0-4-1.8-4-4"/><path d="M12 11c2.2 0 4-1.8 4-4"/>'),
    landmark: createCustomIcon('linear-gradient(135deg, #8b5cf6, #7c3aed)', '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    noise: createCustomIcon('linear-gradient(135deg, #f43f5e, #e11d48)', '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>'),
};

const UnifiedCityMap = () => {
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

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={`relative transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100] bg-white' : 'w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200'}`}>
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 hover:bg-white transition-all group"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    <Maximize className={`w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform ${isFullscreen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border backdrop-blur-md transition-colors ${isOffline ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {isOffline ? 'Offline Mode' : 'Live: Local Cache Active'}
                    </span>
                </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 max-w-[200px]">
                <h4 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-widest">Map Legend</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs text-gray-600">AQI Stations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-gray-600">Waste/Fleet</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        <span className="text-xs text-gray-600">Water Sensors</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-600">Green Zones</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-xs text-gray-600">Landmarks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-gray-600">Noise Stations</span>
                    </div>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={11}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />

                {/* AQI Markers */}
                {airQualitySensors.map(s => (
                    <Marker key={s.id} position={[s.location.latitude, s.location.longitude]} icon={icons.aqi}>
                        <Popup className="premium-popup">
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Cloud className="w-4 h-4 text-blue-500" />
                                    <h3 className="font-bold text-gray-800">{s.name}</h3>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="flex justify-between"><span>AQI:</span> <span className="font-bold text-blue-600">{s.lastReading.aqi}</span></p>
                                    <p className="flex justify-between"><span>Category:</span> <span className="font-semibold text-gray-600 uppercase">{s.lastReading.category}</span></p>
                                    <p className="text-gray-400 mt-2">{s.location.address}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Waste Bins */}
                {wasteBins.map(b => (
                    <Marker key={b.id} position={[b.location.latitude, b.location.longitude]} icon={icons.waste}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trash2 className="w-4 h-4 text-orange-500" />
                                    <h3 className="font-bold text-gray-800">Smart Bin: {b.id}</h3>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="flex justify-between"><span>Fill Level:</span> <span className="font-bold text-orange-600">{b.fillLevel}%</span></p>
                                    <p className="flex justify-between"><span>Status:</span> <span className="font-semibold text-gray-600 uppercase">{b.status}</span></p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Waste Fleet (Trucks) */}
                {wasteVehicles.map(v => (
                    <Marker key={v.id} position={[v.location.latitude, v.location.longitude]} icon={icons.waste}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trash2 className="w-4 h-4 text-orange-600" />
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-gray-800">{v.name}</h3>
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded">{v.type}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="flex justify-between"><span>Route:</span> <span className="font-semibold text-gray-700">{v.route}</span></p>
                                    <p className="flex justify-between"><span>Driver:</span> <span className="text-gray-600">{v.driver}</span></p>
                                    <p className={`mt-2 font-bold ${v.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>{v.status.toUpperCase()}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Water Sensors */}
                {waterSensors.map(s => (
                    <Marker key={s.id} position={[s.location.latitude, s.location.longitude]} icon={icons.water}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-4 h-4 text-cyan-500" />
                                    <h3 className="font-bold text-gray-800">{s.name}</h3>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="flex justify-between"><span>Health Score:</span> <span className="font-bold text-cyan-600">{s.lastReading.healthScore}</span></p>
                                    <p className="flex justify-between"><span>Status:</span> <span className="font-semibold text-gray-600 uppercase">{s.lastReading.status}</span></p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Green Zones */}
                {greenZones.map(z => (
                    <Marker key={z.id} position={[z.location.latitude, z.location.longitude]} icon={icons.greening}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trees className="w-4 h-4 text-green-500" />
                                    <h3 className="font-bold text-gray-800">{z.name}</h3>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="flex justify-between"><span>Green Cover:</span> <span className="font-bold text-green-600">{z.greenCover}%</span></p>
                                    <p className="flex justify-between"><span>Trees:</span> <span className="font-semibold text-gray-600">{z.trees.toLocaleString()}</span></p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Landmarks */}
                {delhiLandmarks.map(l => (
                    <Marker key={l.id} position={[l.location.latitude, l.location.longitude]} icon={icons.landmark}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <LandmarkIcon className="w-4 h-4 text-purple-500" />
                                    <h3 className="font-bold text-gray-800">{l.name}</h3>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p className="capitalize">{l.type} Landmark</p>
                                    <p className="mt-1">{l.location.address}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Noise Sensors */}
                {noiseSensors.map(n => (
                    <Marker key={n.id} position={[n.location.latitude, n.location.longitude]} icon={icons.noise}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Volume2 className="w-4 h-4 text-red-500" />
                                    <h3 className="font-bold text-gray-800">{n.name}</h3>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="flex justify-between font-semibold text-red-600"><span>Day Level:</span> <span>{n.lastReading.dayLevel}dB</span></p>
                                    <p className="flex justify-between text-gray-600"><span>Limit:</span> <span>{n.lastReading.limitDay}dB</span></p>
                                    <p className="text-gray-400 mt-2 italic">{n.location.address}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default UnifiedCityMap;
