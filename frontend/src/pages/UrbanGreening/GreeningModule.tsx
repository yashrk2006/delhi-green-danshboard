import DashboardLayout from '../../components/layout/DashboardLayout';
import { Trees, Leaf, TrendingUp, Cloud, MapPin, Thermometer } from 'lucide-react';
import { greenZones, dashboardStats } from '../../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GreeningModule = () => {
    const totalGreenCover = greenZones.reduce((sum, zone) => sum + zone.area, 0);
    const totalTrees = greenZones.reduce((sum, zone) => sum + zone.trees, 0);
    const avgGreenCover = greenZones.reduce((sum, zone) => sum + zone.greenCover, 0) / greenZones.length;

    // Green cover by type
    const coverByType = [
        { name: 'Forest', value: 1307, color: '#059669' },
        { name: 'Parks', value: 152, color: '#10b981' },
        { name: 'Gardens', value: 90, color: '#34d399' }
    ];

    // Monthly plantation data
    const plantationData = [
        { month: 'Jan', trees: 4500 },
        { month: 'Feb', trees: 5200 },
        { month: 'Mar', trees: 6800 },
        { month: 'Apr', trees: 5900 },
        { month: 'May', trees: 7100 },
        { month: 'Jun', trees: 6500 }
    ];

    // Temperature reduction data
    const tempReductionData = [
        { area: 'Central Ridge', reduction: 3.2 },
        { area: 'Sanjay Van', reduction: 2.8 },
        { area: 'Lodhi Garden', reduction: 2.1 },
        { area: 'Buddha Park', reduction: 1.9 }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <Trees className="inline w-10 h-10 mr-3 text-green-600" />
                        <span className="text-gradient">Urban Greening</span>
                    </h1>
                    <p className="text-gray-600">
                        Green cover tracking, temperature reduction analytics & CO₂ absorption metrics
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="metric-card from-green-500 to-emerald-600">
                        <div className="flex items-center justify-between mb-4">
                            <Leaf className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{dashboardStats.greening.greenCover}%</div>
                        <div className="text-sm opacity-90">Green Cover</div>
                    </div>

                    <div className="metric-card from-emerald-500 to-teal-600">
                        <div className="flex items-center justify-between mb-4">
                            <Trees className="w-10 h-10" />
                            <div className="text-sm font-semibold">+2.3%</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{totalTrees.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Trees Planted</div>
                    </div>

                    <div className="metric-card from-blue-500 to-cyan-600">
                        <div className="flex items-center justify-between mb-4">
                            <Cloud className="w-10 h-10" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{dashboardStats.greening.co2}kg</div>
                        <div className="text-sm opacity-90">CO₂ Absorbed/day</div>
                    </div>

                    <div className="metric-card from-orange-500 to-red-500">
                        <div className="flex items-center justify-between mb-4">
                            <Thermometer className="w-10 h-10" />
                            <div className="text-sm font-semibold">-2.5°C</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">Cooling</div>
                        <div className="text-sm opacity-90">Avg Temperature Drop</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Green Cover Distribution */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Green Cover Distribution (Hectares)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={coverByType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}ha`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {coverByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Plantation */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Monthly Tree Plantation
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={plantationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="trees"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Temperature Reduction Chart */}
                <div className="card-premium p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Temperature Reduction by Area (°C)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={tempReductionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="area" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Bar dataKey="reduction" fill="#f97316" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Green Zone Grid */}
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            Tracked Green Zones ({greenZones.length})
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Active Monitoring</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {greenZones.map((zone) => (
                            <div
                                key={zone.id}
                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg mb-1">{zone.name}</h4>
                                        <p className="text-sm text-gray-600">{zone.location.zone}</p>
                                        <p className="text-xs text-gray-500 mt-1 capitalize">{zone.type}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${zone.type === 'forest' ? 'bg-green-100' :
                                            zone.type === 'park' ? 'bg-emerald-100' :
                                                zone.type === 'garden' ? 'bg-teal-100' :
                                                    'bg-lime-100'
                                        }`}>
                                        <Trees className={`w-6 h-6 ${zone.type === 'forest' ? 'text-green-600' :
                                                zone.type === 'park' ? 'text-emerald-600' :
                                                    zone.type === 'garden' ? 'text-teal-600' :
                                                        'text-lime-600'
                                            }`} />
                                    </div>
                                </div>

                                {/* Green Cover Percentage */}
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Green Cover</span>
                                        <span className="text-2xl font-bold text-green-700">{zone.greenCover}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                                            style={{ width: `${zone.greenCover}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                                        <div className="text-xs text-gray-600 mb-1">Area</div>
                                        <div className="font-bold text-gray-800">{zone.area}</div>
                                        <div className="text-xs text-gray-500">hectares</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                                        <div className="text-xs text-gray-600 mb-1">Trees</div>
                                        <div className="font-bold text-gray-800">{zone.trees.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">count</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 text-center border border-green-100">
                                        <div className="text-xs text-gray-600 mb-1">CO₂</div>
                                        <div className="font-bold text-gray-800">{Math.round(zone.trees * 0.25)}</div>
                                        <div className="text-xs text-gray-500">kg/day</div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-green-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Density</span>
                                        <span className="font-semibold text-gray-800">
                                            {Math.round(zone.trees / zone.area)} trees/hectare
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Environmental Impact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-premium p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                                <Leaf className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Oxygen Production</div>
                                <div className="text-2xl font-bold text-gray-800">42,500 kg/day</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">
                            Estimated daily oxygen production from tracked green zones
                        </p>
                    </div>

                    <div className="card-premium p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                                <Cloud className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Air Purification</div>
                                <div className="text-2xl font-bold text-gray-800">8.2 tons/day</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">
                            Total pollutants filtered from the atmosphere
                        </p>
                    </div>

                    <div className="card-premium p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                                <Thermometer className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Cooling Effect</div>
                                <div className="text-2xl font-bold text-gray-800">-2.5°C</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">
                            Average temperature reduction in green zones
                        </p>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="card-premium p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Green Cover Heatmap
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl h-96 flex items-center justify-center border border-green-200">
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-semibold">Interactive Green Zone Map</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Visual representation of green cover density across Delhi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GreeningModule;
