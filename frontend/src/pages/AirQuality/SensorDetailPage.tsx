import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, Wind, Thermometer, Droplets, Activity, CloudRain, Clock, AlertTriangle, Cpu } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { useState, useEffect } from 'react';

// Mock data generator for specific sensor
const generateSensorData = (id: string) => {
    return {
        id,
        name: `Sensor Station ${id.toUpperCase()}`,
        location: 'Connaught Place, Central Delhi',
        status: 'Active',
        lastMaintenance: '2024-01-15',
        model: 'EcoSense Pro X5',
        installDate: '2023-06-10',
        currentReadings: {
            aqi: 245,
            pm25: 112,
            pm10: 180,
            no2: 45,
            so2: 12,
            co: 0.8,
            temp: 28,
            humidity: 45
        },
        forecast: [
            { time: 'Now', aqi: 245 },
            { time: '+1h', aqi: 250 },
            { time: '+2h', aqi: 255 },
            { time: '+3h', aqi: 240 },
            { time: '+4h', aqi: 230 },
            { time: '+5h', aqi: 215 },
        ],
        history: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            aqi: 150 + Math.random() * 100,
            pm25: 80 + Math.random() * 50
        }))
    };
};

const SensorDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Simulate API fetch
        const sensorData = generateSensorData(id || 'unknown');
        setData(sensorData);
    }, [id]);

    if (!data) return <div>Loading...</div>;

    const radarData = [
        { subject: 'PM2.5', A: data.currentReadings.pm25, fullMark: 300 },
        { subject: 'PM10', A: data.currentReadings.pm10, fullMark: 300 },
        { subject: 'NO2', A: data.currentReadings.no2 * 3, fullMark: 300 }, // Scaled for visual
        { subject: 'SO2', A: data.currentReadings.so2 * 5, fullMark: 300 },
        { subject: 'CO', A: data.currentReadings.co * 50, fullMark: 300 },
        { subject: 'O3', A: 90, fullMark: 300 },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/air-quality')}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {data.name}
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                {data.status}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm">{data.location}</p>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-premium p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
                    >
                        <div className="flex items-center gap-3 mb-2 opacity-80">
                            <Wind className="w-5 h-5" />
                            <span className="text-sm font-medium">Current AQI</span>
                        </div>
                        <div className="text-4xl font-bold mb-1">{data.currentReadings.aqi}</div>
                        <div className="text-sm opacity-90">Poor Conditions</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-premium p-6"
                    >
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <Thermometer className="w-5 h-5" />
                            <span className="text-sm font-medium">Temperature</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{data.currentReadings.temp}°C</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-premium p-6"
                    >
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <Droplets className="w-5 h-5" />
                            <span className="text-sm font-medium">Humidity</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{data.currentReadings.humidity}%</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-premium p-6"
                    >
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm font-medium">Uptime</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800">99.8%</div>
                    </motion.div>
                </div>

                {/* Analytical Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 24h Trend */}
                    <div className="lg:col-span-2 card-premium p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">24-Hour Pollutant Analysis</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.history}>
                                <defs>
                                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                                <Area type="monotone" dataKey="pm25" stroke="#ec4899" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pollutant Radar */}
                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Pollutant Composition</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                                <Radar
                                    name="Pollutants"
                                    dataKey="A"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    fill="#8884d8"
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Prediction & Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-premium p-6 bg-gradient-to-r from-purple-50 to-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-800">AI Predictive Model</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Based on current wind patterns and traffic data, AQI is expected to spike in the next 2 hours.
                        </p>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.forecast}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="time" />
                                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="aqi" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, fill: '#9333ea' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Device Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Device Model</span>
                                <span className="font-medium">{data.model}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Last Maintenance</span>
                                <span className="font-medium">{data.lastMaintenance}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Next Service</span>
                                <span className="text-orange-600 font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Due in 15 days
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-sm">Firmware</span>
                                <span className="font-medium">v4.2.1 (Up to date)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SensorDetailPage;
