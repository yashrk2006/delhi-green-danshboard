import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WasteManagementMap from '../../components/maps/WasteManagementMap';
import { Trash2, Truck, TrendingUp, Zap, RefreshCw, Download, Activity } from 'lucide-react';
import { wasteBins, wasteVehicles } from '../../data/mockData';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

const WasteModule = () => {
    const [activeTab, setActiveTab] = useState<'bins' | 'vehicles'>('bins');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const totalBins = wasteBins.length;
    const activeVehicles = wasteVehicles.filter(v => v.status === 'active').length;

    const segregationData = [
        { name: 'Dry Waste', value: 42, color: '#f97316' },
        { name: 'Wet Waste', value: 38, color: '#10b981' },
        { name: 'Mixed', value: 20, color: '#6b7280' }
    ];

    const bioCNGData = [
        { month: 'Jan', production: 380 },
        { month: 'Feb', production: 395 },
        { month: 'Mar', production: 410 },
        { month: 'Apr', production: 398 },
        { month: 'May', production: 420 },
        { month: 'Jun', production: 425 }
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success('Real-time data synced successfully!');
        }, 1200);
    };

    const handleExport = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(234, 88, 12);
            doc.text('Smart Green Delhi - Waste Management Report', 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Active Tab: ${activeTab === 'bins' ? 'Smart Bins' : 'Collection Vehicles'}`, 14, 36);
            doc.setDrawColor(200);
            doc.line(14, 40, 196, 40);

            let tableColumn: string[] = [];
            let tableRows: any[] = [];

            if (activeTab === 'bins') {
                tableColumn = ["Bin ID", "Location", "Type", "Fill Level", "Capacity", "Status"];
                wasteBins.forEach(bin => {
                    tableRows.push([
                        bin.id, bin.location.address, bin.type.toUpperCase(),
                        `${bin.fillLevel}%`, `${bin.capacity}L`, bin.status.toUpperCase()
                    ]);
                });
            } else {
                tableColumn = ["Vehicle No.", "Type", "Route", "Fill %", "Status"];
                wasteVehicles.forEach(vehicle => {
                    tableRows.push([
                        vehicle.vehicleNumber, vehicle.type, vehicle.route,
                        `${Math.round((vehicle.filled / vehicle.capacity) * 100)}%`, vehicle.status.toUpperCase()
                    ]);
                });
            }

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 60,
                theme: 'grid',
                headStyles: { fillColor: [234, 88, 12] },
                styles: { fontSize: 10 },
            });

            doc.save(`Waste_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Report downloaded successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export PDF');
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8">
                {/* Glassmorphism Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Waste Management <span className="text-orange-600">Live</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-medium">Smart route optimization & bin monitoring</p>
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
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Report</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Staggered Metrics Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={showContent ? "show" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    {[
                        { icon: Truck, value: activeVehicles, label: 'Active Vehicles', color: 'orange' },
                        { icon: Trash2, value: '11,450', label: 'Tons Collected', color: 'emerald' },
                        { icon: Zap, value: '585.5', label: 'Bio-CNG (kg)', color: 'blue' },
                        { icon: Activity, value: '98%', label: 'Resolution Rate', color: 'purple' }
                    ].map((metric, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className={`metric-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group`}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${metric.color}-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>
                            <div className="relative z-10 flex items-center justify-between mb-4">
                                <div className={`p-3 bg-${metric.color}-50 rounded-xl text-${metric.color}-600`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-slate-800 mb-1">{metric.value}</div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{metric.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Animated Power Plants Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { name: 'Tehkhand Plant', cap: '45 MW', status: 'Expanding', desc: 'Capacity boosted +80%', color: 'orange' },
                        { name: 'Bawana Plant', cap: '60 MW', status: 'Operational', desc: 'Key energy provider', color: 'green' },
                        { name: 'Narela Project', cap: '30 MW', status: 'Proposed', desc: 'Future infrastructure', color: 'blue' }
                    ].map((plant, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${plant.color}-500`}></div>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 text-lg">{plant.name}</h4>
                                <span className={`px-2 py-1 bg-${plant.color}-100 text-${plant.color}-700 text-[10px] font-bold uppercase rounded-full`}>{plant.status}</span>
                            </div>
                            <div className="text-3xl font-black text-slate-900 mb-1">{plant.cap}</div>
                            <p className="text-slate-500 text-sm font-medium">{plant.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Waste Segregation Analytics</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={segregationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {segregationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Bio-CNG Production (Monthly)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={bioCNGData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={4} dot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Live Map */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Real-time Fleet Tracking</h3>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Live Updates</span>
                        </div>
                    </div>
                    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200">
                        <WasteManagementMap vehicles={wasteVehicles} bins={wasteBins} />
                    </div>
                </motion.div>

                {/* List/Grid View */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('bins')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'bins' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Smart Bins</button>
                            <button onClick={() => setActiveTab('vehicles')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'vehicles' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Fleet</button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {isRefreshing ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-40 bg-slate-50 rounded-xl border border-slate-100"></div>
                                ))}
                            </div>
                        ) : activeTab === 'bins' ? (
                            <motion.div
                                key="bins"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                            >
                                {wasteBins.map((bin) => (
                                    <motion.div
                                        key={bin.id}
                                        whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        className={`border rounded-xl p-5 bg-white transition-all select-none group ${bin.status === 'overflow' ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{bin.id}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{bin.location.address}</p>
                                            </div>
                                            <Trash2 className={`w-5 h-5 ${bin.status === 'overflow' ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                                <span>Fill Level</span>
                                                <span className={`${bin.fillLevel > 80 ? 'text-red-600' : 'text-slate-700'}`}>{bin.fillLevel}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${bin.fillLevel}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className={`h-full rounded-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="vehicles"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                                {wasteVehicles.map((vehicle) => (
                                    <motion.div
                                        key={vehicle.id}
                                        whileHover={{ y: -4 }}
                                        className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <Truck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{vehicle.vehicleNumber}</h4>
                                                    <p className="text-xs text-slate-500">{vehicle.type}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${vehicle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {vehicle.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t border-slate-50 pt-3 mt-3">
                                            <span className="text-slate-500">Route: <span className="font-semibold text-slate-700">{vehicle.route}</span></span>
                                            <span className="text-slate-500">Load: <span className="font-semibold text-slate-700">{Math.round((vehicle.filled / vehicle.capacity) * 100)}%</span></span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WasteModule;
