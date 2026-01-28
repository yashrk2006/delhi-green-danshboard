import DashboardLayout from '../../components/layout/DashboardLayout';
import {
    Cloud,
    Trash2,
    Droplets,
    Trees,
    TrendingUp,
    TrendingDown,
    Activity,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardStats, recentAlerts } from '../../data/mockData';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const moduleCards = [
        {
            title: 'Air Quality',
            icon: Cloud,
            value: dashboardStats.airQuality.avgAQI.toString(),
            unit: 'AQI',
            trend: dashboardStats.airQuality.trend,
            change: '-12%',
            color: 'from-blue-500 to-cyan-500',
            path: '/air-quality',
            sensors: dashboardStats.airQuality.sensorsActive
        },
        {
            title: 'Waste Management',
            icon: Trash2,
            value: dashboardStats.waste.collected.toString(),
            unit: 'Tons',
            trend: 'up' as const,
            change: '+8%',
            color: 'from-orange-500 to-amber-500',
            path: '/waste-management',
            sensors: 45
        },
        {
            title: 'Yamuna Health',
            icon: Droplets,
            value: dashboardStats.water.avgHealthScore.toString(),
            unit: 'Score',
            trend: 'up' as const,
            change: '+5%',
            color: 'from-cyan-500 to-blue-600',
            path: '/yamuna-monitoring',
            sensors: dashboardStats.water.sensorsActive
        },
        {
            title: 'Green Cover',
            icon: Trees,
            value: dashboardStats.greening.greenCover.toString(),
            unit: '%',
            trend: 'up' as const,
            change: '+2.3%',
            color: 'from-green-500 to-emerald-600',
            path: '/urban-greening',
            sensors: 28
        }
    ];

    // Mock chart data
    const aqiData = [
        { time: '00:00', aqi: 145 },
        { time: '04:00', aqi: 132 },
        { time: '08:00', aqi: 198 },
        { time: '12:00', aqi: 215 },
        { time: '16:00', aqi: 189 },
        { time: '20:00', aqi: 162 },
        { time: '24:00', aqi: 178 }
    ];

    const wasteData = [
        { day: 'Mon', collected: 7800 },
        { day: 'Tue', collected: 8200 },
        { day: 'Wed', collected: 7600 },
        { day: 'Thu', collected: 8900 },
        { day: 'Fri', collected: 8450 },
        { day: 'Sat', collected: 9100 },
        { day: 'Sun', collected: 7900 }
    ];

    const waterHealthData = [
        { location: 'Wazirabad', score: 62 },
        { location: 'ITO', score: 38 },
        { location: 'Nizamuddin', score: 45 },
        { location: 'Okhla', score: 22 }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="text-gradient">Admin Dashboard</span>
                    </h1>
                    <p className="text-gray-600">
                        Real-time overview of all environmental monitoring systems
                    </p>
                </div>

                {/* Module Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {moduleCards.map((module, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(module.path)}
                            className="card-premium card-glow p-6 cursor-pointer group hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <module.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center space-x-1 text-sm font-semibold ${module.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {module.trend === 'up' ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span>{module.change}</span>
                                </div>
                            </div>

                            <h3 className="text-gray-600 text-sm font-medium mb-2">{module.title}</h3>

                            <div className="flex items-baseline space-x-2 mb-4">
                                <span className="text-3xl font-bold text-gray-800">{module.value}</span>
                                <span className="text-gray-500 text-sm">{module.unit}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{module.sensors} Sensors Active</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* AQI Trend Chart */}
                    <div className="card-premium p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Air Quality Trend</h3>
                                <p className="text-sm text-gray-600">Last 24 hours</p>
                            </div>
                            <Cloud className="w-8 h-8 text-blue-500" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={aqiData}>
                                <defs>
                                    <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="aqi"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#aqiGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Waste Collection Chart */}
                    <div className="card-premium p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Waste Collection</h3>
                                <p className="text-sm text-gray-600">Weekly overview (tons)</p>
                            </div>
                            <Trash2 className="w-8 h-8 text-orange-500" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={wasteData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="collected" fill="#f97316" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Second Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Yamuna Health Score */}
                    <div className="card-premium p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Yamuna Health Scores</h3>
                                <p className="text-sm text-gray-600">By location</p>
                            </div>
                            <Droplets className="w-8 h-8 text-cyan-500" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={waterHealthData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis type="category" dataKey="location" stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="score" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Alerts */}
                    <div className="card-premium p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Recent Alerts</h3>
                                <p className="text-sm text-gray-600">Last 2 hours</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-3 custom-scrollbar max-h-64 overflow-y-auto">
                            {recentAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-xl border-l-4 ${alert.severity === 'critical'
                                            ? 'bg-red-50 border-red-500'
                                            : alert.severity === 'warning'
                                                ? 'bg-yellow-50 border-yellow-500'
                                                : 'bg-blue-50 border-blue-500'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-gray-800 mb-1">
                                                {alert.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(alert.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        {!alert.acknowledged && (
                                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="metric-card from-purple-500 to-pink-500">
                        <div className="flex items-center justify-between mb-4">
                            <Activity className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">10M+</div>
                        <div className="text-sm opacity-90">Data Points / Month</div>
                    </div>

                    <div className="metric-card from-blue-500 to-cyan-500">
                        <div className="flex items-center justify-between mb-4">
                            <Cloud className="w-10 h-10" />
                            <div className="text-sm font-semibold">99.9%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">120+</div>
                        <div className="text-sm opacity-90">Active Sensors</div>
                    </div>

                    <div className="metric-card from-green-500 to-emerald-500">
                        <div className="flex items-center justify-between mb-4">
                            <Trees className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">58,100</div>
                        <div className="text-sm opacity-90">Trees Tracked</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
