import { ReactNode } from 'react';
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
    Leaf
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState(3);

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Cloud, label: 'Air Quality', path: '/air-quality' },
        { icon: Trash2, label: 'Waste Management', path: '/waste-management' },
        { icon: Droplets, label: 'Yamuna Monitoring', path: '/yamuna-monitoring' },
        { icon: Trees, label: 'Urban Greening', path: '/urban-greening' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Top Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gradient">Smart Green Delhi</h1>
                                <p className="text-xs text-gray-600">Admin Dashboard</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                                <Bell className="w-6 h-6 text-gray-700" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-6 h-6 text-gray-700" />
                        </button>

                        <div className="h-8 w-px bg-gray-300"></div>

                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-800">Admin User</div>
                                <div className="text-xs text-gray-600">System Administrator</div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                                AU
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            title="Logout"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? 'w-72' : 'w-0'
                        } bg-white border-r border-gray-200 min-h-screen transition-all duration-300 overflow-hidden`}
                >
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 mt-8">
                        <div className="glass p-4 rounded-xl">
                            <h3 className="font-bold text-sm mb-2">System Status</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Sensors Online</span>
                                    <span className="font-semibold text-green-600">98%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Data Quality</span>
                                    <span className="font-semibold text-green-600">99.5%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">API Health</span>
                                    <span className="font-semibold text-green-600">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
