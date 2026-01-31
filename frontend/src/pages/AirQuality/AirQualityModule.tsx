import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import api from '../../services/api';
import type { LocationData } from '../../data/locations';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

// --- SKELETON LOADER ---
const LocationSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[220px] animate-pulse flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 w-2/3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded mb-2"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="h-8 bg-gray-100 rounded"></div>
            <div className="h-8 bg-gray-100 rounded"></div>
        </div>
    </div>
);

// Helper to fix map rendering issues
const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 100);
    }, [map]);
    return null;
};

const AirQualityModuleContent = () => {
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
    const [selectedCity, setSelectedCity] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;

    // Real-time Data State
    const [allLocations, setAllLocations] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<'live' | 'simulated'>('simulated');

    // Fetch Live Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Keep loading true only on first load if we want polling updates to be silent
                // But for "Refresh" feel, we show skeleton briefly
                if (allLocations.length === 0) setLoading(true);

                const response = await api.get('/air-quality/live');
                if (response?.data?.data && Array.isArray(response.data.data)) {
                    setAllLocations(response.data.data);
                    setSource(response.data.source || 'live');
                } else {
                    setAllLocations([]);
                }
            } catch (error) {
                console.error('Failed to fetch live data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60 * 1000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const filteredLocations = useMemo(() => {
        return allLocations.filter(location => {
            const matchesCity = selectedCity === 'All' || location.city === selectedCity;
            const matchesSearch = location.location.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCity && matchesSearch;
        });
    }, [allLocations, selectedCity, searchTerm]);

    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
    const paginatedLocations = filteredLocations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const cityAverageAQI = allLocations.length > 0 ? Math.round(allLocations.reduce((sum, s) => sum + s.aqi, 0) / allLocations.length) : 0;
    const avgPM25 = allLocations.length > 0 ? Math.round(allLocations.reduce((sum, s) => sum + s.pm25, 0) / allLocations.length) : 0;
    const severeCount = allLocations.filter(s => s.category === 'Severe').length;

    const cities = ['All', ...Array.from(new Set(allLocations.map(l => l.city))).sort()];

    const getAQIColor = (aqi: number) => {
        if (aqi <= 50) return '#22c55e';
        if (aqi <= 100) return '#eab308';
        if (aqi <= 200) return '#f97316';
        if (aqi <= 300) return '#ef4444';
        return '#9333ea';
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                            Air Quality <span className="text-blue-600">Live</span>
                        </h1>
                        <p className="text-slate-500 font-medium flex items-center gap-3">
                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">NCR Region</span>
                            {loading ? 'Syncing...' : `Monitoring ${allLocations.length} active stations`}
                            {source === 'live' && <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold px-2 py-0.5 bg-green-50 rounded-full animate-pulse">● Live API</span>}
                        </p>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Avg AQI', value: cityAverageAQI, sub: 'Regional Mean', color: 'blue' },
                        { label: 'PM 2.5', value: avgPM25, sub: 'µg/m³ Avg', color: 'orange' },
                        { label: 'Sensors', value: allLocations.length, sub: 'Online Now', color: 'indigo' },
                        { label: 'Severe', value: severeCount, sub: 'Hotspots', color: 'red' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150`}></div>
                            <div className="relative z-10">
                                <div className={`text-4xl font-black text-slate-800 mb-1`}>{stat.value || '--'}</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                                <div className={`text-xs font-medium text-${stat.color}-500 mt-2`}>{stat.sub}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Map Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-[550px] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative mb-8 z-0 group"
                >
                    <MapContainer
                        center={[28.6139, 77.2090]}
                        zoom={10}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <MapResizer />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <ZoomControl position="bottomright" />

                        {!loading && filteredLocations.map((sensor) => {
                            if (!sensor.lat || !sensor.lng || isNaN(sensor.lat)) return null;
                            const fillColor = sensor.aqi === -1 ? '#94a3b8' : getAQIColor(sensor.aqi);
                            return (
                                <CircleMarker
                                    key={sensor.id}
                                    center={[sensor.lat, sensor.lng]}
                                    pathOptions={{ color: 'white', fillColor: fillColor, fillOpacity: 0.9, weight: 2 }}
                                    radius={8}
                                    eventHandlers={{
                                        click: () => navigate(`/air-quality/location/${sensor.id}`),
                                        mouseover: (e) => e.target.openPopup(),
                                        mouseout: (e) => e.target.closePopup()
                                    }}
                                >
                                    <Popup offset={[0, -6]} closeButton={false} className="custom-popup">
                                        <div className="text-center p-1">
                                            <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{sensor.location}</div>
                                            <div className="font-black text-lg" style={{ color: fillColor }}>AQI {sensor.aqi}</div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                    </MapContainer>
                </motion.div>

                {/* Controls Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center"
                >
                    <div className="flex-1 w-full md:w-auto relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Find a station..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium placeholder-slate-400 transition-all"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            value={selectedCity}
                            onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                            className="px-4 py-2.5 bg-slate-50 border-none rounded-xl font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <div className="bg-slate-100 p-1 rounded-xl flex">
                            <button
                                onClick={() => setSelectedView('grid')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedView === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setSelectedView('list')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedView === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {loading && allLocations.length === 0 ? (
                        <motion.div key="loader" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <LocationSkeleton key={i} />)}
                        </motion.div>
                    ) : selectedView === 'grid' ? (
                        <motion.div
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                        >
                            {paginatedLocations.map((sensor) => (
                                <motion.div
                                    key={sensor.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                    onClick={() => navigate(`/air-quality/location/${sensor.id}`)}
                                    className="bg-white rounded-2xl p-0 border border-slate-100 shadow-sm cursor-pointer overflow-hidden group select-none"
                                >
                                    <div className="h-1.5 w-full" style={{ background: getAQIColor(sensor.aqi) }}></div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-1 pr-2">{sensor.location}</h3>
                                            <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider" style={{ backgroundColor: `${getAQIColor(sensor.aqi)}15`, color: getAQIColor(sensor.aqi) }}>
                                                {sensor.category}
                                            </span>
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-4xl font-black text-slate-900 tracking-tight">{sensor.aqi === -1 ? '--' : sensor.aqi}</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">AQI</span>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-slate-50">
                                            <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                                                <div className="text-slate-400 text-[10px] font-bold uppercase">PM 2.5</div>
                                                <div className="text-slate-700 font-bold">{sensor.pm25}</div>
                                            </div>
                                            <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                                                <div className="text-slate-400 text-[10px] font-bold uppercase">PM 10</div>
                                                <div className="text-slate-700 font-bold">{sensor.pm10}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Station</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AQI Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PM 2.5</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">View</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedLocations.map((sensor) => (
                                        <tr key={sensor.id} onClick={() => navigate(`/air-quality/location/${sensor.id}`)} className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 group-hover:text-blue-600">{sensor.location}</div>
                                                <div className="text-xs text-slate-500">{sensor.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${getAQIColor(sensor.aqi)}15`, color: getAQIColor(sensor.aqi) }}>
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getAQIColor(sensor.aqi) }}></span>
                                                    {sensor.aqi} · {sensor.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-slate-600">{sensor.pm25}</td>
                                            <td className="px-6 py-4 text-right text-slate-400 group-hover:text-blue-500">→</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Simple Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pb-8 mt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm text-gray-600"
                        >
                            Previous
                        </button>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-bold text-sm text-gray-800">
                            page {currentPage} of {totalPages}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium text-sm text-gray-600"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const AirQualityModule = () => (
    <ErrorBoundary>
        <AirQualityModuleContent />
    </ErrorBoundary>
);

export default AirQualityModule;
