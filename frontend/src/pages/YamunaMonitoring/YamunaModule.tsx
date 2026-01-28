import DashboardLayout from '../../components/layout/DashboardLayout';
import { Droplets, TrendingDown, TrendingUp, AlertCircle, MapPin } from 'lucide-react';
import { waterSensors } from '../../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const YamunaModule = () => {
    const getStatusColor = (status: string) => {
        const colors = {
            excellent: 'from-green-500 to-emerald-500',
            good: 'from-blue-500 to-cyan-500',
            fair: 'from-yellow-500 to-amber-500',
            poor: 'from-orange-500 to-red-500',
            critical: 'from-red-600 to-pink-600'
        };
        return colors[status as keyof typeof colors] || 'from-gray-500 to-gray-600';
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            excellent: 'badge-good',
            good: 'badge-good',
            fair: 'badge-moderate',
            poor: 'badge-poor',
            critical: 'badge-severe'
        };
        return badges[status as keyof typeof badges] || 'badge-moderate';
    };

    const avgHealthScore = Math.round(
        waterSensors.reduce((sum, sensor) => sum + sensor.lastReading.healthScore, 0) / waterSensors.length
    );

    const activeSensors = waterSensors.filter(s => s.status === 'active').length;
    const criticalZones = waterSensors.filter(s => s.lastReading.status === 'critical' || s.lastReading.status === 'poor').length;

    // Segment comparison
    const segmentData = waterSensors.map(sensor => ({
        name: sensor.name.split(' ')[0],
        healthScore: sensor.lastReading.healthScore,
        do: sensor.lastReading.dissolvedOxygen,
        bod: sensor.lastReading.bod
    }));

    // Historical trend (mock)
    const trendData = [
        { month: 'Jan', score: 35 },
        { month: 'Feb', score: 38 },
        { month: 'Mar', score: 42 },
        { month: 'Apr', score: 40 },
        { month: 'May', score: 37 },
        { month: 'Jun', score: 42 }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <Droplets className="inline w-10 h-10 mr-3 text-cyan-600" />
                        <span className="text-gradient">Yamuna Monitoring</span>
                    </h1>
                    <p className="text-gray-600">
                        Real-time water quality monitoring with health scores and alerts
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="metric-card from-cyan-500 to-blue-600">
                        <div className="flex items-center justify-between mb-4">
                            <Activity className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{avgHealthScore}</div>
                        <div className="text-sm opacity-90">Avg Health Score</div>
                    </div>

                    <div className="metric-card from-blue-500 to-indigo-600">
                        <div className="flex items-center justify-between mb-4">
                            <MapPin className="w-10 h-10" />
                            <div className="text-sm font-semibold">Live</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{activeSensors}</div>
                        <div className="text-sm opacity-90">Active Sensors</div>
                    </div>

                    <div className="metric-card from-red-500 to-orange-600">
                        <div className="flex items-center justify-between mb-4">
                            <AlertCircle className="w-10 h-10" />
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{criticalZones}</div>
                        <div className="text-sm opacity-90">Critical Zones</div>
                    </div>

                    <div className="metric-card from-purple-500 to-pink-500">
                        <div className="flex items-center justify-between mb-4">
                            <Droplets className="w-10 h-10" />
                            <div className="text-sm font-semibold">+5%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">Improving</div>
                        <div className="text-sm opacity-90">6-Month Trend</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Segment Comparison */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Health Score by Segment
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={segmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="healthScore" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Trend Chart */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            6-Month Health Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    dot={{ fill: '#06b6d4', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sensor Status Grid */}
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            Water Quality Monitoring Stations
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Real-time Updates</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {waterSensors.map((sensor) => (
                            <div
                                key={sensor.id}
                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-1">{sensor.name}</h4>
                                        <p className="text-sm text-gray-600">{sensor.segment}</p>
                                        <p className="text-xs text-gray-500 mt-1">{sensor.location.address}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${sensor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                </div>

                                {/* Health Score */}
                                <div className="mb-6">
                                    <div className="flex items-baseline space-x-2 mb-2">
                                        <span className="text-4xl font-bold text-gray-800">
                                            {sensor.lastReading.healthScore}
                                        </span>
                                        <span className="text-sm text-gray-600">/ 100</span>
                                    </div>
                                    <span className={`${getStatusBadge(sensor.lastReading.status)}`}>
                                        {sensor.lastReading.status.toUpperCase()}
                                    </span>

                                    {/* Health Bar */}
                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all bg-gradient-to-r ${getStatusColor(sensor.lastReading.status)}`}
                                            style={{ width: `${sensor.lastReading.healthScore}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Parameters Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-600 mb-1">pH</div>
                                        <div className="font-bold text-gray-800">{sensor.lastReading.ph}</div>
                                    </div>
                                    <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-600 mb-1">DO (mg/L)</div>
                                        <div className="font-bold text-gray-800">{sensor.lastReading.dissolvedOxygen}</div>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-600 mb-1">BOD (mg/L)</div>
                                        <div className="font-bold text-gray-800">{sensor.lastReading.bod}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-red-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-600 mb-1">COD (mg/L)</div>
                                        <div className="font-bold text-gray-800">{sensor.lastReading.cod}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-600 mb-1">Turbidity</div>
                                        <div className="font-bold text-gray-800">{sensor.lastReading.turbidity}</div>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-600 mb-1">Temp (°C)</div>
                                        <div className="font-bold text-gray-800">{sensor.lastReading.temperature}</div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                    Last updated: {new Date(sensor.lastReading.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* River Map */}
                <div className="card-premium p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Yamuna River Segment Map
                    </h3>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl h-96 flex items-center justify-center border border-cyan-200">
                        <div className="text-center">
                            <Droplets className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-semibold">Interactive River Segment View</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Sensor locations and water quality visualization along Yamuna
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Activity icon component
function Activity({ className }: { className?: string }) {
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
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}

export default YamunaModule;
