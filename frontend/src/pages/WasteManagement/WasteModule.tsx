import DashboardLayout from '../../components/layout/DashboardLayout';
import { Trash2, Truck, MapPin, TrendingUp, Leaf, DollarSign, Zap } from 'lucide-react';
import { wasteBins, wasteVehicles } from '../../data/mockData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WasteModule = () => {
    const totalBins = wasteBins.length;
    const fullBins = wasteBins.filter(b => b.fillLevel >= 80).length;
    const activeVehicles = wasteVehicles.filter(v => v.status === 'active').length;

    // Waste segregation data
    const segregationData = [
        { name: 'Dry Waste', value: 42, color: '#f97316' },
        { name: 'Wet Waste', value: 38, color: '#10b981' },
        { name: 'Mixed', value: 20, color: '#6b7280' }
    ];

    // Collection efficiency
    const efficiencyData = [
        { day: 'Mon', efficiency: 85 },
        { day: 'Tue', efficiency: 88 },
        { day: 'Wed', efficiency: 82 },
        { day: 'Thu', efficiency: 92 },
        { day: 'Fri', efficiency: 89 },
        { day: 'Sat', efficiency: 95 },
        { day: 'Sun', efficiency: 86 }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <Trash2 className="inline w-10 h-10 mr-3 text-orange-600" />
                        <span className="text-gradient">Waste Management</span>
                    </h1>
                    <p className="text-gray-600">
                        Smart bin monitoring, route optimization & Bio-CNG production tracking
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="metric-card from-orange-500 to-amber-500">
                        <div className="flex items-center justify-between mb-4">
                            <Truck className="w-10 h-10" />
                            <Activity className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{activeVehicles}</div>
                        <div className="text-sm opacity-90">Vehicles Active</div>
                    </div>

                    <div className="metric-card from-green-500 to-emerald-500">
                        <div className="flex items-center justify-between mb-4">
                            <Trash2 className="w-10 h-10" />
                            <div className="text-sm font-semibold">Today</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">8,450</div>
                        <div className="text-sm opacity-90">Tons Collected</div>
                    </div>

                    <div className="metric-card from-blue-500 to-cyan-500">
                        <div className="flex items-center justify-between mb-4">
                            <Zap className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">425.8</div>
                        <div className="text-sm opacity-90">Bio-CNG (kg/day)</div>
                    </div>

                    <div className="metric-card from-purple-500 to-pink-500">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="w-10 h-10" />
                            <div className="text-sm font-semibold">+12%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">₹2.8L</div>
                        <div className="text-sm opacity-90">Revenue (Monthly)</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Waste Segregation */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Waste Segregation Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={segregationData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {segregationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Collection Efficiency */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Collection Efficiency (%)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={efficiencyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="efficiency" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bin Status Grid */}
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            Smart Bin Network ({totalBins} bins, {fullBins} need attention)
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Live Monitoring</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {wasteBins.map((bin) => (
                            <div
                                key={bin.id}
                                className={`border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ${bin.status === 'overflow'
                                        ? 'border-red-500 bg-red-50'
                                        : bin.status === 'full'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 mb-1">{bin.id}</h4>
                                        <p className="text-xs text-gray-600">{bin.location.address}</p>
                                    </div>
                                    <Trash2 className={`w-5 h-5 ${bin.type === 'dry' ? 'text-orange-500' :
                                            bin.type === 'wet' ? 'text-green-500' :
                                                'text-gray-500'
                                        }`} />
                                </div>

                                {/* Fill Level Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Fill Level</span>
                                        <span className="font-bold text-gray-800">{bin.fillLevel}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${bin.fillLevel >= 90 ? 'bg-red-500' :
                                                    bin.fillLevel >= 80 ? 'bg-orange-500' :
                                                        'bg-green-500'
                                                }`}
                                            style={{ width: `${bin.fillLevel}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Capacity</span>
                                        <span className="font-semibold text-gray-800">{bin.capacity}L</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-semibold text-gray-800 capitalize">{bin.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Collection</span>
                                        <span className="font-semibold text-gray-800">
                                            {Math.round((Date.now() - new Date(bin.lastCollection).getTime()) / 3600000)}h ago
                                        </span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bin.status === 'overflow' ? 'bg-red-100 text-red-700' :
                                            bin.status === 'full' ? 'bg-orange-100 text-orange-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {bin.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Tracking */}
                <div className="card-premium p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Live Vehicle Tracking
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {wasteVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 mb-1">{vehicle.vehicleNumber}</h4>
                                        <p className="text-xs text-gray-600">{vehicle.type}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${vehicle.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                        }`}></div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Route</span>
                                        <span className="font-semibold text-gray-800">{vehicle.route}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Filled</span>
                                        <span className="font-semibold text-gray-800">
                                            {Math.round((vehicle.filled / vehicle.capacity) * 100)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`font-semibold ${vehicle.status === 'active' ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                            {vehicle.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 rounded-full"
                                        style={{ width: `${(vehicle.filled / vehicle.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl h-80 flex items-center justify-center border border-orange-200">
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-semibold">Live Route Tracking Map</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Real-time vehicle locations and optimized routes
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

export default WasteModule;
