import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Code, Layers, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentationPage = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Layers,
            title: 'System Architecture',
            content: 'The platform follows a microservices-inspired architecture on the frontend, with distinct modules for Air Quality, Waste, Water, and Greening. Each module operates independently but shares a common design system and state management layer via Zustand.'
        },
        {
            icon: Shield,
            title: 'Security Protocols',
            content: 'All API requests are secured using JWT tokens. Sensor data is encrypted in transit using TLS 1.3. Role-based access control (RBAC) ensures only authorized personnel can trigger critical actions like waste collection alerts or drone deployments.'
        },
        {
            icon: Zap,
            title: 'Real-time Data Streams',
            content: 'We utilize WebSocket connections for live sensor feeds. The dashboard updates at 30-second intervals for AQI data and 5-minute intervals for waste bin fill levels to optimize bandwidth while maintaining situational awareness.'
        },
        {
            icon: Code,
            title: 'API Integration',
            content: 'External agencies can integrate with our platform using our REST API. Endpoints are versioned (v1) and follow standard HTTP status codes. Rate limiting is applied at 1000 requests/hour per API key.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Book className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Platform Docs
                                </h1>
                                <p className="text-xs text-gray-500">Technical Reference</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
                        Smart Green Delhi <span className="text-blue-600">Documentation</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Comprehensive guide to the Environmental Intelligence Platform's architecture, data flows, and integration points.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <section.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {section.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-xl"
                >
                    <h2 className="text-3xl font-bold mb-4">Need Developer Access?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Request API keys and sandbox access to start building integrations with the Smart Green Delhi platform.
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                        Contact Developer Support
                    </button>
                </motion.div>
            </main>
        </div>
    );
};

export default DocumentationPage;
