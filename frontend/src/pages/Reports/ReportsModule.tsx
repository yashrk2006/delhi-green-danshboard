import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BarChart3, Download, FileText, Cloud, Trash2, Droplets, Trees, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { dashboardStats, recentAlerts } from '../../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsModule = () => {
    const [selectedReport, setSelectedReport] = useState<'overview' | 'air' | 'waste' | 'water' | 'green'>('overview');
    const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('7d');

    const reportTypes = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'air', label: 'Air Quality', icon: Cloud },
        { id: 'waste', label: 'Waste', icon: Trash2 },
        { id: 'water', label: 'Water', icon: Droplets },
        { id: 'green', label: 'Greening', icon: Trees },
    ];

    const ranges = [
        { id: '24h', label: '24 Hours' },
        { id: '7d', label: '7 Days' },
        { id: '30d', label: '30 Days' },
        { id: '90d', label: '90 Days' },
        { id: '1y', label: '1 Year' },
    ];

    // --- Dynamic Data Generators based on Range ---

    const generateTrendData = (range: string) => {
        let points = 7;
        let pLabel = 'Day';

        switch (range) {
            case '24h': points = 24; pLabel = 'Hour'; break;
            case '7d': points = 7; pLabel = 'Day'; break;
            case '30d': points = 30; pLabel = 'Day'; break;
            case '90d': points = 12; pLabel = 'Week'; break;
            case '1y': points = 12; pLabel = 'Month'; break;
        }

        return Array.from({ length: points }, (_, i) => {
            let label = `${i + 1}`;
            if (range === '24h') label = `${i}:00`;
            if (range === '1y') {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                label = months[i % 12];
            }
            if (range === '7d') {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                label = days[i % 7];
            }

            // Simulated Realistic Variance
            const baseAQI = 180 - (i * 2) + (Math.random() * 40 - 20);
            const baseWaste = 7000 + (i * 50) + (Math.random() * 500);

            return {
                label,
                aqi: Math.max(50, Math.round(baseAQI)),
                waste: Math.round(baseWaste),
                wqi: Math.max(10, Math.min(100, 30 + (i % 10) + Math.random() * 10)),
                green: 20 + (i * 0.1)
            };
        });
    };

    const trendData = useMemo(() => generateTrendData(dateRange), [dateRange]);

    const kpiData = [
        { name: 'AQI Improvement', current: 178, target: 150, progress: 76, trend: 'up' },
        { name: 'Waste Segregation', current: 68.5, target: 80, progress: 85, trend: 'up' },
        { name: 'Water Quality Index', current: 42, target: 60, progress: 70, trend: 'up' },
        { name: 'Green Cover', current: 22.8, target: 25, progress: 91, trend: 'up' },
    ];

    const alertSummary = [
        { type: 'Critical', count: recentAlerts.filter(a => a.severity === 'critical').length, color: '#ef4444' },
        { type: 'Warning', count: recentAlerts.filter(a => a.severity === 'warning').length, color: '#f97316' },
        { type: 'Info', count: recentAlerts.filter(a => a.severity === 'info').length, color: '#3b82f6' },
    ];

    const handleExport = (format: string) => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(147, 51, 234);
            doc.text('Smart Green Delhi - Analytics Report', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Period: ${ranges.find(r => r.id === dateRange)?.label}`, 14, 36);

            doc.setDrawColor(200);
            doc.line(14, 40, 196, 40);

            // KPIs
            const kpiColumns = ["Metric", "Current", "Target", "Progress", "Trend"];
            const kpiRows = kpiData.map(k => [k.name, k.current, k.target, `${k.progress}%`, k.trend.toUpperCase()]);

            autoTable(doc, {
                head: [kpiColumns], body: kpiRows, startY: 55, theme: 'grid',
                headStyles: { fillColor: [147, 51, 234] }, styles: { fontSize: 10 },
            });

            // Trend Data
            const finalY = ((doc as any).lastAutoTable?.finalY || 80) + 15;
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`${ranges.find(r => r.id === dateRange)?.label} Trend Data`, 14, finalY);

            const trendColumns = ["Time", "AQI", "Waste (Tons)", "WQI", "Green %"];
            const trendRows = trendData.slice(0, 15).map(m => [ // Limit rows for PDF if 24h/30d
                m.label, m.aqi, m.waste, Math.round(m.wqi), m.green.toFixed(1)
            ]);

            autoTable(doc, {
                head: [trendColumns], body: trendRows, startY: finalY + 5, theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] }, styles: { fontSize: 10 },
            });

            doc.save(`Analytics_${dateRange}_${new Date().toISOString().split('T')[0]}.${format}`);
            toast.success(`Report exported successfully!`);

        } catch (error) {
            console.error(error);
            toast.error('Export failed');
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                                <BarChart3 className="w-8 h-8" />
                            </div>
                            <span className="text-gray-900">Analytics & Reports</span>
                        </h1>
                        <p className="text-slate-500 font-medium ml-1">
                            Comprehensive environmental insights and historical data analysis
                        </p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        {ranges.map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setDateRange(range.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${dateRange === range.id
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Report Type Tabs */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {reportTypes.map((report) => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all border ${selectedReport === report.id
                                    ? 'bg-white border-purple-200 text-purple-700 shadow-md ring-2 ring-purple-100'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-purple-200 hover:text-purple-600'
                                }`}
                        >
                            <report.icon className="w-4 h-4" />
                            {report.label}
                        </button>
                    ))}
                    <div className="flex-1"></div>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>

                {/* Animated Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={dateRange} // Re-animate when date range changes
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="card-premium p-6 border-l-4 border-l-blue-500">
                                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Avg Air Quality</div>
                                <div className="text-3xl font-black text-slate-800 mb-1">
                                    {Math.round(trendData.reduce((a, b) => a + b.aqi, 0) / trendData.length)}
                                </div>
                                <div className="text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded">
                                    -12% vs last period
                                </div>
                            </div>
                            <div className="card-premium p-6 border-l-4 border-l-orange-500">
                                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Waste Collected</div>
                                <div className="text-3xl font-black text-slate-800 mb-1">
                                    {(trendData.reduce((a, b) => a + b.waste, 0) / 1000).toFixed(1)}k
                                </div>
                                <div className="text-xs font-medium text-slate-400">Tons Total</div>
                            </div>
                            <div className="card-premium p-6 border-l-4 border-l-cyan-500">
                                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Avg Water Health</div>
                                <div className="text-3xl font-black text-slate-800 mb-1">
                                    {Math.round(trendData.reduce((a, b) => a + b.wqi, 0) / trendData.length)}
                                </div>
                                <div className="text-xs font-medium text-cyan-600">/ 100 Index</div>
                            </div>
                            <div className="card-premium p-6 border-l-4 border-l-green-500">
                                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Green Growth</div>
                                <div className="text-3xl font-black text-slate-800 mb-1">
                                    +{((trendData[trendData.length - 1].green - trendData[0].green) / trendData[0].green * 100).toFixed(1)}%
                                </div>
                                <div className="text-xs font-medium text-green-600">Positive Trend</div>
                            </div>
                        </div>

                        {/* Main Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                                    <span>AQI vs Water Quality Trend</span>
                                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {ranges.find(r => r.id === dateRange)?.label}
                                    </span>
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorWqi" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="label" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" name="Air Quality (AQI)" />
                                        <Area type="monotone" dataKey="wqi" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWqi)" name="Water Quality (WQI)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Waste Management Volume</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="label" stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} minTickGap={30} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickMargin={10} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="waste" fill="#f97316" radius={[4, 4, 0, 0]} name="Waste Collected (tons)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Alerts & KPIs */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-1">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Alert Distribution</h3>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={alertSummary}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {alertSummary.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">KPI Performance Targets</h3>
                                <div className="space-y-6">
                                    {kpiData.map((kpi, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-slate-700">{kpi.name}</span>
                                                <span className="text-sm font-medium text-slate-500">{kpi.progress}% Achieved</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${kpi.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className={`h-full rounded-full ${kpi.progress > 80 ? 'bg-green-500' : 'bg-purple-500'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default ReportsModule;
