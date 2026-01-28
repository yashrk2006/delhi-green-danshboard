import DashboardLayout from '../../components/layout/DashboardLayout';
import { Cloud, MapPin, Activity, TrendingUp, AlertCircle, Wind } from 'lucide-react';
import { airQualitySensors } from '../../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AirQualityModule = () => {
    const getCategoryColor = (category: string) => {
        const colors = {
            good: 'bg-green-500',
            satisfactory: 'bg-yellow-500',
            moderate: 'bg-orange-500',
            poor: 'bg-red-500',
            'very poor': 'bg-purple-500',
            severe: 'bg-maroon-800'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-500';
    };

    const getCategoryBadge = (category: string) => {
        const badges = {
            good: 'badge-good',
            satisfactory: 'badge-moderate',
            moderate: 'badge-moderate',
            poor: 'badge-poor',
            'very poor': 'badge-severe',
            severe: 'badge-severe'
        };
        return badges[category as keyof typeof badges] || 'badge-moderate';
    };

    // Mock prediction data
    const predictionData = [
        { time: 'Now', aqi: 178 },
        { time: '+6h', aqi: 165 },
        { time: '+12h', aqi: 145 },
        { time: '+18h', aqi: 132 },
        { time: '+24h', aqi: 125 },
        { time: '+30h', aqi: 138 },
        { time: '+36h', aqi: 152 },
        { time: '+42h', aqi: 168 },
        { time: '+48h', aqi: 155 }
    ];

    // Pollutant comparison
    const avgSensor = airQualitySensors[0];
    const pollutantData = [
        { pollutant: 'PM2.5', value: avgSensor.lastReading.pm25, max: 300 },
        { pollutant: 'PM10', value: avgSensor.lastReading.pm10, max: 400 },
        { pollutant: 'NO₂', value: avgSensor.lastReading.no2, max: 100 },
        { pollutant: 'SO₂', value: avgSensor.lastReading.so2, max: 80 },
        { pollutant: 'CO', value: avgSensor.lastReading.co * 20, max: 50 },
        { pollutant: 'O₃', value: avgSensor.lastReading.o3, max: 100 }
    ];

    const avgAQI = Math.round(
        airQualitySensors.reduce((sum, sensor) => sum + sensor.lastReading.aqi, 0) / airQualitySensors.length
    );

    const activeStations = airQualitySensors.filter(s => s.status === 'active').length;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">
                            <Cloud className="inline w-10 h-10 mr-3 text-blue-600" />
                            <span className="text-gradient">Air Quality Monitoring</span>
                        </h1>
                        <p className="text-gray-600">
                            Real-time AQI tracking with predictive analytics across Delhi NCR
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Last Updated</div>
                        <div className="text-lg font-semibold text-gray-800">
                            {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="metric-card from-blue-500 to-cyan-500">
                        <div className="flex items-center justify-between mb-4">
                            <Gauge className="w-10 h-10" />
                            <Activity className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{avgAQI}</div>
                        <div className="text-sm opacity-90">Average AQI</div>
                    </div>

                    <div className="metric-card from-purple-500 to-pink-500">
                        <div className="flex items-center justify-between mb-4">
                            <MapPin className="w-10 h-10" />
                            <div className="text-sm font-semibold">100%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{activeStations}</div>
                        <div className="text-sm opacity-90">Active Stations</div>
                    </div>

                    <div className="metric-card from-orange-500 to-red-500">
                        <div className="flex items-center justify-between mb-4">
                            <AlertCircle className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">2</div>
                        <div className="text-sm opacity-90">Critical Zones</div>
                    </div>

                    <div className="metric-card from-green-500 to-emerald-500">
                        <div className="flex items-center justify-between mb-4">
                            <Wind className="w-10 h-10" />
                            <div className="text-sm font-semibold">-12%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">Improving</div>
                        <div className="text-sm opacity-90">24h Trend</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Prediction Chart */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            48-Hour AQI Prediction
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={predictionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="aqi"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pollutant Radar */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Pollutant Levels (Average)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={pollutantData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="pollutant" stroke="#9ca3af" />
                                <PolarRadiusAxis stroke="#9ca3af" />
                                <Radar
                                    name="Current"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sensor Grid */}
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            Sensor Network Status
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Live Updates</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {airQualitySensors.map((sensor) => (
                            <div
                                key={sensor.id}
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 mb-1">{sensor.name}</h4>
                                        <p className="text-xs text-gray-600">{sensor.location.zone}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${sensor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>

                                {/* AQI Display */}
                                <div className="mb-4">
                                    <div className="flex items-baseline space-x-2 mb-2">
                                        <span className="text-4xl font-bold text-gray-800">
                                            {sensor.lastReading.aqi}
                                        </span>
                                        <span className="text-sm text-gray-600">AQI</span>
                                    </div>
                                    <span className={`${getCategoryBadge(sensor.lastReading.category)}`}>
                                        {sensor.lastReading.category.toUpperCase()}
                                    </span>
                                </div>

                                {/* Pollutants */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <div className="text-gray-600">PM2.5</div>
                                        <div className="font-semibold text-gray-800">{sensor.lastReading.pm25}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <div className="text-gray-600">PM10</div>
                                        <div className="font-semibold text-gray-800">{sensor.lastReading.pm10}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2">
                                        <div className="text-gray-600">NO₂</div>
                                        <div className="font-semibold text-gray-800">{sensor.lastReading.no2}</div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                    Updated: {new Date(sensor.lastReading.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="card-premium p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        AQI Heatmap - Delhi NCR
                    </h3>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl h-96 flex items-center justify-center border border-blue-200">
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-semibold">Interactive Map View</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Sensor locations and AQI heatmap visualization
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Helper component for Gauge
function Gauge({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 14 4-4" />
            <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
    );
}

export default AirQualityModule;
