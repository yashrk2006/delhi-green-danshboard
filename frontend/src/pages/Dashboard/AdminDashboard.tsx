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
    ArrowRight,
    Volume2,
    Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardStats, recentAlerts } from '../../data/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UnifiedCityMap from '../../components/maps/UnifiedCityMap';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

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

    const handleExport = () => {
        try {
            const doc = new jsPDF();

            // Add Header
            doc.setFontSize(20);
            doc.setTextColor(31, 41, 55); // Gray-800
            doc.text('Smart Green Delhi - Dashboard Overview', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            // Add Module Summary
            doc.setDrawColor(200);
            doc.line(14, 40, 196, 40);

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Environmental Modules Status', 14, 50);

            // Define Modules Table
            const moduleColumns = ["Module", "Core Metric", "Value", "Trend", "Active Sensors"];
            const moduleRows = moduleCards.map(m => [
                m.title,
                m.unit,
                m.value,
                m.change,
                m.sensors
            ]);

            autoTable(doc, {
                head: [moduleColumns],
                body: moduleRows,
                startY: 55,
                theme: 'grid',
                headStyles: { fillColor: [31, 41, 55] }, // Gray
                styles: { fontSize: 10 },
            });

            // Get Y position for next table safely
            let finalY = ((doc as any).lastAutoTable?.finalY || 100) + 15;

            // Add Recent Alerts Table
            doc.setFontSize(14);
            doc.text('Recent System Alerts', 14, finalY);

            const alertColumns = ["Title", "Severity", "Message", "Time"];
            const alertRows = recentAlerts.slice(0, 5).map(a => [
                a.title,
                a.severity.toUpperCase(),
                a.message,
                new Date(a.timestamp).toLocaleTimeString()
            ]);

            autoTable(doc, {
                head: [alertColumns],
                body: alertRows,
                startY: finalY + 5,
                theme: 'grid',
                headStyles: { fillColor: [239, 68, 68] }, // Red
                styles: { fontSize: 10 },
            });

            // Save the PDF
            doc.save(`Dashboard_Overview_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Dashboard exported as PDF!');

        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export dashboard');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="text-gradient">Admin Dashboard</span>
                    </h1>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-600">
                            Real-time overview of all environmental monitoring systems
                        </p>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <Download className="w-4 h-4" />
                            Export Overview
                        </button>
                    </div>
                </div>

                {/* Module Overview Cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {moduleCards.map((module, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            onClick={() => navigate(module.path)}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                            }}
                            className="card-premium card-glow p-6 group"
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
                        </motion.div>
                    ))}
                </motion.div>

                {/* Unified Environmental Map */}
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Unified Environmental Map</h2>
                            <p className="text-sm text-gray-600 italic">Live tracking of all sensors, fleets, and green zones across Delhi NCR</p>
                        </div>
                    </div>
                    <UnifiedCityMap />
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

                {/* Noise & Global Context */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    }}
                    whileHover={{ scale: 1.01 }}
                    className="card-premium card-glow p-6 bg-gradient-to-br from-red-500 to-rose-600 text-white"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <Volume2 className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Global Noise Ranking: #2</h3>
                                <p className="text-rose-100 text-sm">
                                    Delhi ranked the <strong>second noisiest city</strong> in the world. Monitoring sites at Anand Vihar & Punjabi Bagh consistently exceed safety limits.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-xs font-bold opacity-80 uppercase">Commercial Limit</div>
                                <div className="text-xl font-bold">65dB Day</div>
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-xs font-bold opacity-80 uppercase">Current Peak</div>
                                <div className="text-xl font-bold">78dB</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        }}
                        className="metric-card card-glow from-purple-500 to-pink-500"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Activity className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">10M+</div>
                        <div className="text-sm opacity-90">Data Points / Month</div>
                    </motion.div>

                    <motion.div
                        variants={item}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        }}
                        className="metric-card card-glow from-blue-500 to-cyan-500"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Cloud className="w-10 h-10" />
                            <div className="text-sm font-semibold">99.9%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">120+</div>
                        <div className="text-sm opacity-90">Active IoT Sensors</div>
                    </motion.div>

                    <motion.div
                        variants={item}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        }}
                        className="metric-card card-glow from-green-500 to-emerald-500"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Trees className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">1.25M+</div>
                        <div className="text-sm opacity-90">Plants (Delhi NCR)</div>
                    </motion.div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
