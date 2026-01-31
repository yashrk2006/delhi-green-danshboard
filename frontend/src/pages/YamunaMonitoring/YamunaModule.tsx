import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import YamunaMap from '../../components/maps/YamunaMap';
import { Droplets, TrendingDown, TrendingUp, AlertCircle, MapPin, Activity, RefreshCw, Download, Waves } from 'lucide-react';
import { waterSensors } from '../../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

const YamunaModule = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            excellent: 'bg-green-100 text-green-700',
            good: 'bg-blue-100 text-blue-700',
            fair: 'bg-yellow-100 text-yellow-700',
            poor: 'bg-orange-100 text-orange-700',
            critical: 'bg-red-100 text-red-700'
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusGradient = (status: string) => {
        const gradients: Record<string, string> = {
            excellent: 'from-green-500 to-emerald-500',
            good: 'from-blue-500 to-cyan-500',
            fair: 'from-yellow-500 to-amber-500',
            poor: 'from-orange-500 to-red-500',
            critical: 'from-red-600 to-pink-600'
        };
        return gradients[status] || 'from-gray-500 to-gray-600';
    };

    const avgHealthScore = Math.round(
        waterSensors.reduce((sum, sensor) => sum + sensor.lastReading.healthScore, 0) / waterSensors.length
    );

    const activeSensors = waterSensors.filter(s => s.status === 'active').length;

    // Mock robust time-series data
    const wqiTrendData = [
        { month: 'Jan', wqi: 35 },
        { month: 'Feb', wqi: 38 },
        { month: 'Mar', wqi: 42 },
        { month: 'Apr', wqi: 40 },
        { month: 'May', wqi: 37 },
        { month: 'Jun', wqi: 42 }
    ];

    const bodDoData = waterSensors.map(sensor => ({
        name: sensor.name.split(' ')[0],
        bod: sensor.lastReading.bod,
        do: sensor.lastReading.dissolvedOxygen
    }));

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success('Water quality readings updated!');
        }, 1200);
    };

    const handleExport = () => {
        // ... (Using existing export logic for brevity, functional but wrapped visually)
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(8, 145, 178);
            doc.text('Smart Green Delhi - Yamuna Water Quality', 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.setDrawColor(200);
            doc.line(14, 40, 196, 40);

            const tableColumn = ["Station Name", "Segment", "Health Score", "pH", "DO (mg/L)", "BOD (mg/L)", "Status"];
            const tableRows: any[] = [];
            waterSensors.forEach(sensor => {
                tableRows.push([
                    sensor.name, sensor.segment, sensor.lastReading.healthScore,
                    sensor.lastReading.ph, sensor.lastReading.dissolvedOxygen,
                    sensor.lastReading.bod, sensor.lastReading.status.toUpperCase()
                ]);
            });

            autoTable(doc, {
                head: [tableColumn], body: tableRows, startY: 60, theme: 'grid',
                headStyles: { fillColor: [8, 145, 178] }, styles: { fontSize: 10 },
            });
            doc.save(`Yamuna_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Report downloaded successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to export PDF');
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8 bg-[#F0F9FF] min-h-screen space-y-8">
                {/* Fluid Sticky Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
                            <Droplets className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Yamuna Monitoring <span className="text-cyan-600">Live</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-medium">Real-time river health & pollution tracking</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                            title="Sync Data"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Data</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Staggered Quick Stats */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={showContent ? "show" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    {[
                        { icon: Activity, value: avgHealthScore, label: 'Avg Health Score', color: 'cyan', sub: '/100 Index' },
                        { icon: MapPin, value: activeSensors, label: 'Active Sensors', color: 'blue', sub: 'Monitoring Now' },
                        { icon: AlertCircle, value: '+445%', label: 'BOD Load', color: 'red', sub: 'Najafgarh Drain' },
                        { icon: Waves, value: '-7%', label: 'Water Body Area', color: 'indigo', sub: 'Since 1999' }
                    ].map((metric, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group"
                        >
                            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${metric.color}-50 rounded-full transition-transform group-hover:scale-150`}></div>
                            <div className="relative z-10">
                                <div className={`inline-flex p-3 rounded-xl bg-${metric.color}-50 text-${metric.color}-600 mb-4`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl font-black text-slate-800 mb-1">{metric.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{metric.label}</div>
                                <div className={`text-xs font-medium text-${metric.color}-500 mt-1`}>{metric.sub}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Feature / Notification */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 flex-shrink-0 animate-pulse">
                            <span className="text-3xl font-bold">70%</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Critical Pollution Load Disparity</h2>
                            <p className="opacity-90 leading-relaxed text-lg">
                                Only <strong>2% (54 km)</strong> of the Yamuna's length flows through Delhi, yet this segment contributes <strong>70% of the river's total pollution load</strong>. We are maintaining high alert surveillance at the Najafgarh drain confluence.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 min-w-[200px]">
                            <div className="text-sm font-medium opacity-75 mb-1">Surveillance Status</div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
                                <span className="font-bold uppercase tracking-wider">High Alert</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-500" />
                            Water Quality Index (6 Months)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={wqiTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="wqi" stroke="#06b6d4" strokeWidth={4} dot={{ r: 6, strokeWidth: 0, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-orange-500" />
                            Dissolved Oxygen vs BOD
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bodDoData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend iconType="circle" />
                                <Bar dataKey="bod" fill="#f97316" name="BOD (Pollution)" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="do" fill="#06b6d4" name="DO (Oxygen)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800">River Segment Map</h3>
                        <span className="text-xs font-bold bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-500">Interactive</span>
                    </div>
                    <div className="h-[400px] w-full">
                        <YamunaMap sensors={waterSensors} />
                    </div>
                </motion.div>

                {/* Station Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800">Monitoring Stations</h3>
                        {isRefreshing && <span className="text-sm font-medium text-cyan-600 animate-pulse">Updating...</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {waterSensors.map((sensor, idx) => (
                                <motion.div
                                    key={sensor.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{sensor.name}</h4>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {sensor.segment}
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusBadge(sensor.lastReading.status).replace('bg-', 'border-').replace('text-', 'text-opacity-80 text-')}`}>
                                            {sensor.lastReading.status}
                                        </span>
                                    </div>

                                    <div className="mb-6 relative">
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-4xl font-black text-slate-900">{sensor.lastReading.healthScore}</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">Health Score</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${sensor.lastReading.healthScore}%` }}
                                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                                className={`h-full rounded-full bg-gradient-to-r ${getStatusGradient(sensor.lastReading.status)}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'pH', val: sensor.lastReading.ph, color: 'blue' },
                                            { label: 'DO', val: sensor.lastReading.dissolvedOxygen, color: 'cyan' },
                                            { label: 'BOD', val: sensor.lastReading.bod, color: 'orange' }
                                        ].map((s, i) => (
                                            <div key={i} className={`bg-${s.color}-50 rounded-xl p-2 text-center`}>
                                                <div className={`text-[10px] font-bold text-${s.color}-400 uppercase`}>{s.label}</div>
                                                <div className={`font-bold text-${s.color}-700`}>{s.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default YamunaModule;
