import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Cloud,
    Trash2,
    Droplets,
    Trees,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Leaf,
    Moon,
    Sun
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { recentAlerts } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Cloud, label: 'Air Quality', path: '/air-quality' },
        { icon: Trash2, label: 'Waste Management', path: '/waste-management' },
        { icon: Droplets, label: 'Yamuna Monitoring', path: '/yamuna-monitoring' },
        { icon: Trees, label: 'Urban Greening', path: '/urban-greening' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    const isActive = (path: string) => location.pathname === path;
    const unacknowledgedAlerts = recentAlerts.filter(a => !a.acknowledged);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            <header className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg border-b sticky top-0 z-50`}>
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            {sidebarOpen ? <X className={`w-6 h-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} /> : <Menu className={`w-6 h-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} />}
                        </button>

                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gradient'}`}>Smart Green Delhi</h1>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Admin Dashboard</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-700'}`}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={`p-2 rounded-lg transition-colors relative ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <Bell className={`w-6 h-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                                {unacknowledgedAlerts.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unacknowledgedAlerts.length}
                                    </span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {recentAlerts.slice(0, 5).map((alert) => (
                                            <div key={alert.id} className={`p-3 border-b last:border-0 ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{alert.title}</p>
                                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <Settings className={`w-6 h-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                        </button>

                        <div className={`h-8 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin User</div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>System Administrator</div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                AU
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                            title="Logout"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside
                    className={`${sidebarOpen ? 'w-72' : 'w-0'} ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300 overflow-hidden sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto`}
                >
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(item.path)}
                                whileHover={{
                                    scale: 1.05,
                                    x: 5,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                                    style={{
                                        background: `radial-gradient(100px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15), transparent 80%)`
                                    }}
                                />
                                <item.icon className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">{item.label}</span>
                            </motion.button>
                        ))}
                    </nav>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="p-4 mt-8"
                    >
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'glass'}`}>
                            <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>System Status</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Sensors Online</span>
                                    <span className="font-semibold text-green-500">98%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Data Quality</span>
                                    <span className="font-semibold text-green-500">99.5%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>API Health</span>
                                    <span className="font-semibold text-green-500">100%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </aside>

                <main className={`flex-1 p-8 ${isDarkMode ? 'text-white' : ''}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
