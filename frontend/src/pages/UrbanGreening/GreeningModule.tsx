import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GreenZonesMap from '../../components/maps/GreenZonesMap';
import { Trees, Leaf, TrendingUp, Cloud, Thermometer, RefreshCw, Download, Layers, Wind } from 'lucide-react';
import { greenZones, dashboardStats } from '../../data/mockData';
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

const GreeningModule = () => {
    const [useSatellite, setUseSatellite] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const totalTrees = greenZones.reduce((sum, zone) => sum + zone.trees, 0);

    const greenCoverGrowthData = [
        { year: '2001', cover: 10.2 },
        { year: '2005', cover: 12.5 },
        { year: '2009', cover: 15.8 },
        { year: '2013', cover: 18.2 },
        { year: '2017', cover: 20.6 },
        { year: '2019', cover: 21.88 },
        { year: '2026', cover: 22.8 }
    ];

    const tempReductionData = [
        { area: 'Central Ridge', reduction: 3.2 },
        { area: 'Sanjay Van', reduction: 2.8 },
        { area: 'Lodhi Garden', reduction: 2.1 },
        { area: 'Buddha Park', reduction: 1.9 }
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success('Latest satellite data synced!');
        }, 1200);
    };

    const handleExport = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(22, 163, 74);
            doc.text('Smart Green Delhi - Urban Greening Report', 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Total Trees Tracked: ${totalTrees.toLocaleString()}`, 14, 36);
            doc.setDrawColor(200);
            doc.line(14, 40, 196, 40);

            const tableColumn = ["Zone Name", "Location", "Type", "Area (Ha)", "Trees", "Green Cover %"];
            const tableRows: any[] = [];
            greenZones.forEach(zone => {
                tableRows.push([
                    zone.name, zone.location.zone, zone.type.toUpperCase(),
                    zone.area, zone.trees.toLocaleString(), `${zone.greenCover}%`
                ]);
            });

            autoTable(doc, {
                head: [tableColumn], body: tableRows, startY: 60, theme: 'grid',
                headStyles: { fillColor: [22, 163, 74] }, styles: { fontSize: 10 },
            });
            doc.save(`Greening_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Report exported successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to export PDF');
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8 bg-[#F5FBF7] min-h-screen space-y-8">
                {/* Fluid Sticky Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <Trees className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Urban Greening <span className="text-green-600">Analytics</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-medium">Forest cover & heat island monitoring</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                            title="Sync Satellite Data"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Report</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Staggered Metrics */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={showContent ? "show" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    {[
                        { icon: Leaf, value: `${dashboardStats.greening.greenCover}%`, label: 'Green Cover', color: 'green', sub: 'Target: 33%' },
                        { icon: TrendingUp, value: '+115%', label: 'Growth', color: 'emerald', sub: 'Since 2001' },
                        { icon: Cloud, value: '19.3m²', label: 'Per Capita Cover', color: 'teal', sub: 'Total Area' },
                        { icon: Thermometer, value: '4.8m²', label: 'Park Space', color: 'red', sub: 'WHO Rec: 9.5m²' }
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

                {/* Accessibility Gap Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                                <Trees className="w-6 h-6 text-green-300" />
                                The Urban Green Disparity
                            </h3>
                            <p className="text-green-50 text-base mb-6 leading-relaxed max-w-2xl">
                                While Delhi’s total green cover is robust at <strong>21.88%</strong> (19.32 m²/person), accessible public spaces like parks only account for <strong>4.84 m² per person</strong>—significantly below the WHO recommendation of 9.5 m².
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md">6 Biodiversity Parks</span>
                                <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md">740 Hectares Ecosystem</span>
                                <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md">Heat Island Mitigation</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20">
                                <span className="text-3xl font-bold">21.9%</span>
                                <span className="text-[10px] uppercase font-bold text-green-200 mt-1">Total Coverage</span>
                            </div>
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20">
                                <span className="text-3xl font-bold text-red-200">4.8m²</span>
                                <span className="text-[10px] uppercase font-bold text-green-200 mt-1">Accessible / Cap</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Green Cover Expansion
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={greenCoverGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <YAxis stroke="#94a3b8" domain={[0, 25]} axisLine={false} tickLine={false} tickMargin={10} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="cover" stroke="#16a34a" strokeWidth={4} name="Green Cover %" dot={{ fill: '#16a34a', r: 5 }} activeDot={{ r: 8 }} />
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
                            <Thermometer className="w-5 h-5 text-orange-500" />
                            Heat Island Mitigation (Temp Drop)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tempReductionData} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="area" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                <Tooltip cursor={{ fil: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="reduction" fill="#f97316" name="Temp Reduction (°C)" radius={[8, 8, 8, 8]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-slate-500" />
                            <h3 className="text-lg font-bold text-slate-800">Geospatial Analysis</h3>
                        </div>
                        <button
                            onClick={() => setUseSatellite(!useSatellite)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${useSatellite ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {useSatellite ? 'Satellite Mode ON' : 'Switch to Satellite'}
                        </button>
                    </div>
                    <div className="h-[450px] w-full relative">
                        <GreenZonesMap zones={greenZones} useSatellite={useSatellite} />
                    </div>
                </motion.div>

                {/* Impact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Oxygen Production', val: '42,500 kg', unit: '/day', desc: 'Sustains healthy air levels', icon: Wind, color: 'blue' },
                        { title: 'Air Filtration', val: '8.2 tons', unit: '/day', desc: 'Particulate matter captured', icon: Cloud, color: 'gray' },
                        { title: 'Cooling Effect', val: '-2.5°C', unit: 'avg', desc: 'Reduction in surface temp', icon: Thermometer, color: 'orange' }
                    ].map((card, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-500`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{card.title}</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-800">{card.val}</span>
                                        <span className="text-xs font-bold text-slate-500">{card.unit}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GreeningModule;
