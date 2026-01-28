import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AirQualityModule from './pages/AirQuality/AirQualityModule';
import WasteModule from './pages/WasteManagement/WasteModule';
import YamunaModule from './pages/YamunaMonitoring/YamunaModule';
import GreeningModule from './pages/UrbanGreening/GreeningModule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/air-quality" element={<AirQualityModule />} />
        <Route path="/waste-management" element={<WasteModule />} />
        <Route path="/yamuna-monitoring" element={<YamunaModule />} />
        <Route path="/urban-greening" element={<GreeningModule />} />
      </Routes>
    </Router>
  );
}

export default App;
