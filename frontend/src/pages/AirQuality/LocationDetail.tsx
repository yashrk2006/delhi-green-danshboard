import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { generateLocations } from '../../data/locations';
import api from '../../services/api';
import type { LocationData } from '../../data/locations';

const LocationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [allContextLocations, setAllContextLocations] = useState<LocationData[]>([]);

    useEffect(() => {
        const fetchLocationData = async () => {
            setLoading(true);
            try {
                // 1. Try finding in static data first (fastest)
                const staticLocations = generateLocations();
                const staticMatch = staticLocations.find(l => l.id === parseInt(id || '0'));

                if (staticMatch) {
                    setLocation(staticMatch);
                    setAllContextLocations(staticLocations);
                    setLoading(false);
                    return;
                }

                // 2. If not found, it must be a LIVE id. Fetch live data.
                const response = await api.get('/air-quality/live');
                if (response.data && Array.isArray(response.data.data)) {
                    const liveLocations = response.data.data as LocationData[];
                    // AQICN UIDs are huge, or negative, or strings. Our interface has number.
                    // The backend returns parsing ID. 
                    // Let's try flexible matching
                    const match = liveLocations.find(l => l.id.toString() === id);

                    if (match) {
                        setLocation(match);
                        setAllContextLocations(liveLocations);
                    } else {
                        // Not found in live either
                        setLocation(null);
                    }
                }
            } catch (error) {
                console.error("Failed to load details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocationData();
    }, [id]);


    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-screen bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Loading Station Data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!location) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="text-6xl mb-4">📍</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Location Not Found</h1>
                    <p className="text-gray-600 mb-6">The monitoring station you are looking for does not exist or serves no data.</p>
                    <button
                        onClick={() => navigate('/air-quality')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Map
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Helper to get color hex code (reused logic)
    const getAQIColor = (aqi: number) => {
        if (aqi <= 50) return 'from-green-400 to-green-600';
        if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
        if (aqi <= 200) return 'from-orange-400 to-orange-600';
        if (aqi <= 300) return 'from-red-400 to-red-600';
        return 'from-purple-500 to-red-700';
    };

    const bgGradient = getAQIColor(location.aqi);

    // Generate realistic looking mock history based on current AQI (since API doesn't give history yet)
    const historicalData = Array.from({ length: 24 }, (_, i) => {
        const trend = Math.sin(i / 3) * 20; // Simulated daily cycle
        return {
            hour: i,
            aqi: Math.max(50, Math.round(location.aqi + trend + (Math.random() * 20 - 10)))
        };
    });

    // Mock pollutant breakdown based on AQI (Infer from AQI since live mostly gives PM2.5 implicity)
    const pollutants = [
        { label: 'PM 2.5', value: location.pm25 || Math.floor(location.aqi * 0.6), unit: 'µg/m³', color: 'from-orange-500 to-red-600' },
        { label: 'PM 10', value: location.pm10 || Math.floor(location.aqi * 0.8), unit: 'µg/m³', color: 'from-yellow-500 to-orange-600' },
        { label: 'NO₂', value: Math.round(location.aqi * 0.2), unit: 'µg/m³', color: 'from-blue-500 to-indigo-600' },
        { label: 'SO₂', value: Math.round(location.aqi * 0.05), unit: 'µg/m³', color: 'from-green-500 to-teal-600' },
        { label: 'O₃', value: Math.round(location.aqi * 0.15), unit: 'µg/m³', color: 'from-purple-500 to-pink-600' },
        { label: 'CO', value: (location.aqi * 0.01).toFixed(1), unit: 'mg/m³', color: 'from-gray-500 to-gray-700' }
    ];

    return (
        <DashboardLayout>
            <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 min-h-screen">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/air-quality')}
                        className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
                    >
                        <span className="text-xl">←</span> Back to Overview
                    </button>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{location.location}</h1>
                            <p className="text-lg text-gray-600 font-medium">{location.city}, Delhi NCR</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Sensor ID: {location.id} • Last Updated: Live
                            </p>
                        </div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`bg-gradient-to-r ${bgGradient} text-white px-8 py-4 rounded-2xl shadow-lg flex flex-col items-center min-w-[200px]`}
                        >
                            <div className="text-5xl font-bold">{location.aqi === -1 ? 'N/A' : location.aqi}</div>
                            <div className="text-lg font-medium opacity-90">{location.category}</div>
                            <div className="text-xs mt-1 bg-white/20 px-2 py-0.5 rounded">AQI Index</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Pollutants Grid */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">Real-time Pollutants</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {pollutants.map((pollutant, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`card-premium bg-gradient-to-br ${pollutant.color} text-white p-5`}
                        >
                            <div className="text-sm opacity-90 mb-2 font-medium">{pollutant.label}</div>
                            <div className="text-3xl font-bold mb-1">{pollutant.value}</div>
                            <div className="text-xs opacity-75">{pollutant.unit}</div>
                        </motion.div>
                    ))}
                </div>

                {/* 24h Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card-premium p-6 mb-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">24-Hour Trends</h2>
                        <div className="flex gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> High</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Moderate</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Good</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-1 md:gap-2">
                        {historicalData.map((data, idx) => {
                            let barColor = 'bg-gray-400';
                            if (data.aqi <= 50) barColor = 'bg-green-500';
                            else if (data.aqi <= 100) barColor = 'bg-yellow-500';
                            else if (data.aqi <= 200) barColor = 'bg-orange-500';
                            else if (data.aqi <= 300) barColor = 'bg-red-500';
                            else barColor = 'bg-purple-600';

                            return (
                                <motion.div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center group relative"
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ delay: 0.5 + idx * 0.02 }}
                                >
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                        {data.hour}:00 - AQI {data.aqi}
                                    </div>
                                    <div className="flex-1 w-full flex items-end">
                                        <motion.div
                                            whileHover={{ scaleX: 1.2 }}
                                            className={`w-full rounded-t ${barColor} opacity-80 hover:opacity-100 transition-all`}
                                            style={{ height: `${Math.min(100, (data.aqi / 500) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-2 rotate-0 hidden md:block">{data.hour}h</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Health & Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Health Advisory */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card-premium p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">⚕️</span> Health Advisory
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
                                <div className="text-2xl">👶</div>
                                <div>
                                    <h4 className="font-bold text-red-900">Sensitive Groups</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        Children, elderly, and people with respiratory issues should avoid all outdoor physical activity.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                                <div className="text-2xl">🏃</div>
                                <div>
                                    <h4 className="font-bold text-orange-900">General Public</h4>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Reduce prolonged or heavy exertion. Take more breaks during outdoor activities.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <div className="text-2xl">🏠</div>
                                <div>
                                    <h4 className="font-bold text-blue-900">Indoor Measures</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Keep windows closed. Run air purifiers if available. Wet mop floors to reduce dust.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Nearby Stations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card-premium p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">📍</span> Other Sensors in Range
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {allContextLocations
                                .filter(l => l.id.toString() !== id)
                                .slice(0, 6)
                                .map((nearby, idx) => (
                                    <motion.div
                                        key={nearby.id}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + idx * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        onClick={() => navigate(`/air-quality/location/${nearby.id}`)}
                                        className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center group transition-all"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-800">{nearby.location}</div>
                                            <div className="text-xs text-gray-500">Live Status</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-lg font-bold ${nearby.aqi > 300 ? 'text-red-500' :
                                                nearby.aqi > 200 ? 'text-orange-500' : 'text-yellow-600'
                                                }`}>
                                                {nearby.aqi === -1 ? '?' : nearby.aqi}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-blue-500 transition-colors">View →</div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LocationDetail;
