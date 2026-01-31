import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import LandingPage from './pages/Landing/LandingPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AirQualityModule from './pages/AirQuality/AirQualityModule';
import LocationDetail from './pages/AirQuality/LocationDetail';
import SensorDetailPage from './pages/AirQuality/SensorDetailPage';
import WasteModule from './pages/WasteManagement/WasteModule';
import YamunaModule from './pages/YamunaMonitoring/YamunaModule';
import GreeningModule from './pages/UrbanGreening/GreeningModule';
import ReportsModule from './pages/Reports/ReportsModule';
import DocumentationPage from './pages/Documentation/DocumentationPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#1f2937' : '#fff',
            color: isDarkMode ? '#fff' : '#1f2937',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/air-quality" element={<AirQualityModule />} />
          <Route path="/air-quality/location/:id" element={<LocationDetail />} />
          <Route path="/air-quality/sensor/:id" element={<SensorDetailPage />} />
          <Route path="/waste-management" element={<WasteModule />} />
          <Route path="/yamuna-monitoring" element={<YamunaModule />} />
          <Route path="/urban-greening" element={<GreeningModule />} />
          <Route path="/reports" element={<ReportsModule />} />
          <Route path="/docs" element={<DocumentationPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
