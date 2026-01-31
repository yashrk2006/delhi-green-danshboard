import { useNavigate } from 'react-router-dom';
import {
    Cloud,
    Trash2,
    Droplets,
    Trees,
    ArrowRight,
    Activity,
    TrendingDown,
    Leaf,
    Gauge
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const modules = [
        {
            icon: Cloud,
            title: 'Air Quality Monitoring',
            description: 'Real-time AQI tracking with 24-48 hour pollution predictions',
            color: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            path: '/air-quality'
        },
        {
            icon: Trash2,
            title: 'Waste Management',
            description: 'Smart bin tracking, route optimization & Bio-CNG production analytics',
            color: 'from-orange-500 to-amber-500',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            path: '/waste-management'
        },
        {
            icon: Droplets,
            title: 'Yamuna Monitoring',
            description: 'Water quality dashboard with real-time health scores & alerts',
            color: 'from-cyan-500 to-blue-600',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            path: '/yamuna-monitoring'
        },
        {
            icon: Trees,
            title: 'Urban Greening',
            description: 'Green cover tracking, temperature reduction & CO₂ absorption metrics',
            color: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            path: '/urban-greening'
        }
    ];

    const stats = [
        { icon: Gauge, label: 'Air Sensors', value: '100+', color: 'text-blue-600' },
        { icon: Activity, label: 'Data Points/Month', value: '10M+', color: 'text-purple-600' },
        { icon: TrendingDown, label: 'Response Time', value: '<5 min', color: 'text-orange-600' },
        { icon: Leaf, label: 'Green Cover', value: '22.8%', color: 'text-green-600' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gradient">Smart Green Delhi</h1>
                                <p className="text-xs text-gray-600">Environmental Intelligence Platform</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <span>Admin Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center space-y-6 animate-slide-up">
                    <div className="inline-block">
                        <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-semibold text-green-700 border border-green-200">
                            🌿 Making Delhi Greener & Cleaner
                        </span>
                    </div>

                    <h1 className="text-6xl font-display font-bold leading-tight">
                        Unified Platform for
                        <br />
                        <span className="text-gradient">Environmental Intelligence</span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Real-time monitoring and AI-powered insights for air quality, waste management,
                        water health, and urban greening across Delhi NCR
                    </p>

                    <div className="flex items-center justify-center space-x-4 pt-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Explore Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/docs')}
                            className="btn-outline text-lg px-8 py-4"
                        >
                            View Documentation
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="card-premium card-glow p-6 text-center hover:-translate-y-2 transition-all duration-300"
                        >
                            <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Input Sources Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-display font-bold mb-4">
                        <span className="text-gradient">Input Sources</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Connected sensors and data streams across Delhi NCR
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            className="card-premium card-glow p-8 cursor-pointer group"
                            onClick={() => navigate(module.path)}
                        >
                            <div className={`${module.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <module.icon className={`w-8 h-8 ${module.iconColor}`} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 transition-all">
                                {module.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {module.description}
                            </p>

                            <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                                <span>Explore Module</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Central Smart System */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="glass p-12 rounded-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-display font-bold mb-4">
                            <span className="text-gradient">Central Smart System</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            AI-powered analytics and real-time processing
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <Activity className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Data Storage</h3>
                            <p className="text-gray-600 text-sm">
                                Secure cloud storage with real-time synchronization
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <Gauge className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI Models</h3>
                            <p className="text-gray-600 text-sm">
                                Predictive analytics and anomaly detection
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <TrendingDown className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Backend APIs</h3>
                            <p className="text-gray-600 text-sm">
                                RESTful APIs for seamless integration
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary text-lg px-12 py-4"
                        >
                            Access Platform Dashboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Smart Green Delhi</h3>
                            <p className="text-gray-400 text-sm">
                                Building a sustainable and intelligent environmental monitoring system for Delhi NCR
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Modules</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Air Quality Monitoring</li>
                                <li>Waste Management</li>
                                <li>Yamuna Water Quality</li>
                                <li>Urban Greening</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>API Documentation</li>
                                <li>System Architecture</li>
                                <li>User Guide</li>
                                <li>Support</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                        © 2026 Smart Green Delhi Platform. Built for a sustainable future.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
