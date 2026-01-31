import type {
    AirQualitySensor,
    WasteBin,
    WasteVehicle,
    WaterSensor,
    GreenZone,
    DashboardStats,
    Alert,
    Landmark,
    NoiseSensor
} from '../types';

// Air Quality Sensors - Strategic locations across Delhi
export const airQualitySensors: AirQualitySensor[] = [
    {
        id: 'AQ-001',
        name: 'Connaught Place',
        location: { latitude: 28.6304, longitude: 77.2177, address: 'Connaught Place, New Delhi', zone: 'Central Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date().toISOString(),
            pm25: 179,
            pm10: 310,
            no2: 85,
            so2: 42,
            co: 2.1,
            o3: 45,
            aqi: 245,
            category: 'severe'
        }
    },
    {
        id: 'AQ-002',
        name: 'Anand Vihar',
        location: { latitude: 28.6469, longitude: 77.3165, address: 'Anand Vihar, East Delhi', zone: 'East Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date().toISOString(),
            pm25: 315,
            pm10: 480,
            no2: 120,
            so2: 55,
            co: 3.5,
            o3: 52,
            aqi: 412,
            category: 'severe'
        }
    },
    {
        id: 'AQ-003',
        name: 'Punjabi Bagh',
        location: { latitude: 28.6675, longitude: 77.1259, address: 'Punjabi Bagh, West Delhi', zone: 'West Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date().toISOString(),
            pm25: 195,
            pm10: 340,
            no2: 92,
            so2: 38,
            co: 2.4,
            o3: 48,
            aqi: 268,
            category: 'severe'
        }
    }
];

// Waste Bins
export const wasteBins: WasteBin[] = [
    {
        id: 'BIN-001',
        location: { latitude: 28.6139, longitude: 77.2090, address: 'India Gate Area', zone: 'Central Delhi' },
        fillLevel: 85,
        capacity: 240,
        lastCollection: new Date(Date.now() - 6 * 3600000).toISOString(),
        type: 'mixed',
        status: 'full'
    },
    {
        id: 'BIN-002',
        location: { latitude: 28.6542, longitude: 77.2373, address: 'Kashmere Gate', zone: 'North Delhi' },
        fillLevel: 42,
        capacity: 240,
        lastCollection: new Date(Date.now() - 18 * 3600000).toISOString(),
        type: 'dry',
        status: 'normal'
    },
    {
        id: 'BIN-003',
        location: { latitude: 28.5355, longitude: 77.2495, address: 'Nehru Place', zone: 'South Delhi' },
        fillLevel: 95,
        capacity: 240,
        lastCollection: new Date(Date.now() - 3 * 3600000).toISOString(),
        type: 'wet',
        status: 'overflow'
    },
    {
        id: 'BIN-004',
        location: { latitude: 28.6692, longitude: 77.4538, address: 'Noida Sector 18', zone: 'East Delhi' },
        fillLevel: 58,
        capacity: 360,
        lastCollection: new Date(Date.now() - 12 * 3600000).toISOString(),
        type: 'mixed',
        status: 'normal'
    }
];

// Waste Collection Vehicles
export const wasteVehicles: WasteVehicle[] = [
    {
        id: 'VEH-001',
        vehicleNumber: 'DL-1CAA-2345',
        type: 'Compactor Truck',
        location: { latitude: 28.6289, longitude: 77.2177, address: 'Connaught Place', zone: 'Central Delhi' },
        status: 'active',
        route: 'Central Delhi Route 1',
        capacity: 10000,
        filled: 6500
    },
    {
        id: 'VEH-002',
        vehicleNumber: 'DL-1CAB-8923',
        type: 'Tipper Truck',
        location: { latitude: 28.7041, longitude: 77.1025, address: 'Pitampura', zone: 'North Delhi' },
        status: 'active',
        route: 'North Delhi Route 2',
        capacity: 8000,
        filled: 3200
    },
    {
        id: 'VEH-003',
        vehicleNumber: 'DL-1CAC-5612',
        type: 'Compactor Truck',
        location: { latitude: 28.5494, longitude: 77.2501, address: 'Lajpat Nagar', zone: 'South Delhi' },
        status: 'idle',
        route: 'South Delhi Route 1',
        capacity: 10000,
        filled: 9200
    }
];

// Water Quality Sensors in Yamuna
export const waterSensors: WaterSensor[] = [
    {
        id: 'WS-001',
        name: 'Wazirabad Barrage',
        location: { latitude: 28.7132, longitude: 77.2378, address: 'Wazirabad', zone: 'North Delhi' },
        segment: 'Upper Yamuna',
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            ph: 7.8,
            dissolvedOxygen: 5.2,
            bod: 8.5,
            cod: 42,
            turbidity: 28,
            temperature: 24.5,
            healthScore: 62,
            status: 'fair'
        }
    },
    {
        id: 'WS-002',
        name: 'ITO Bridge',
        location: { latitude: 28.6289, longitude: 77.2495, address: 'ITO', zone: 'Central Delhi' },
        segment: 'Mid Yamuna',
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
            ph: 7.2,
            dissolvedOxygen: 3.1,
            bod: 18.5,
            cod: 98,
            turbidity: 65,
            temperature: 26.2,
            healthScore: 38,
            status: 'poor'
        }
    },
    {
        id: 'WS-003',
        name: 'Okhla Barrage',
        location: { latitude: 28.5355, longitude: 77.3025, address: 'Okhla', zone: 'South Delhi' },
        segment: 'Lower Yamuna',
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
            ph: 6.9,
            dissolvedOxygen: 2.2,
            bod: 32.8,
            cod: 185,
            turbidity: 142,
            temperature: 28.1,
            healthScore: 22,
            status: 'critical'
        }
    },
    {
        id: 'WS-004',
        name: 'Nizamuddin Bridge',
        location: { latitude: 28.5906, longitude: 77.2500, address: 'Nizamuddin', zone: 'South Delhi' },
        segment: 'Mid Yamuna',
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
            ph: 7.4,
            dissolvedOxygen: 3.8,
            bod: 14.2,
            cod: 72,
            turbidity: 48,
            temperature: 25.8,
            healthScore: 45,
            status: 'poor'
        }
    }
];

// Green Zones
export const greenZones: GreenZone[] = [
    {
        id: 'GZ-001',
        name: 'Yamuna Biodiversity Park',
        location: { latitude: 28.7132, longitude: 77.2378, address: 'Main Jagatpur Rd', zone: 'North Delhi' },
        area: 185.0,
        greenCover: 94.2,
        trees: 42000,
        type: 'forest'
    },
    {
        id: 'GZ-002',
        name: 'Aravalli Biodiversity Park',
        location: { latitude: 28.5524, longitude: 77.1432, address: 'Vasant Vihar', zone: 'South West Delhi' },
        area: 280.0,
        greenCover: 91.5,
        trees: 65000,
        type: 'forest'
    },
    {
        id: 'GZ-003',
        name: 'Tilpath Valley Biodiversity Park',
        location: { latitude: 28.4982, longitude: 77.2624, address: 'Sainik Farm', zone: 'South Delhi' },
        area: 70.0,
        greenCover: 89.8,
        trees: 12000,
        type: 'forest'
    },
    {
        id: 'GZ-004',
        name: 'Neela Hauz Biodiversity Park',
        location: { latitude: 28.5385, longitude: 77.1610, address: 'Aruna Asaf Ali Marg', zone: 'South Delhi' },
        area: 10.0,
        greenCover: 85.2,
        trees: 2500,
        type: 'park'
    }
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
    airQuality: {
        avgAQI: 245,
        trend: 'up',
        sensorsActive: 42
    },
    waste: {
        collected: 11450,
        segregation: 90.0,
        bioCNG: 585.5
    },
    water: {
        avgHealthScore: 28,
        sensorsActive: 12,
        alerts: 8
    },
    greening: {
        greenCover: 21.88,
        trees: 1250000,
        co2: 45240
    }
};

// Recent Alerts
export const recentAlerts: Alert[] = [
    {
        id: 'AL-001',
        type: 'air',
        severity: 'critical',
        title: 'Very Poor Air Quality',
        message: 'AQI exceeds 400 at Anand Vihar sensor',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        location: airQualitySensors[1].location,
        acknowledged: false
    },
    {
        id: 'AL-002',
        type: 'waste',
        severity: 'warning',
        title: 'Bin Overflow',
        message: 'Waste bin at Nehru Place is overflowing (95% full)',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        location: wasteBins[2].location,
        acknowledged: false
    },
    {
        id: 'AL-003',
        type: 'water',
        severity: 'critical',
        title: 'Critical Water Quality',
        message: 'Yamuna health score critically low at Okhla Barrage (Score: 22)',
        timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
        location: waterSensors[2].location,
        acknowledged: true
    },
    {
        id: 'AL-004',
        type: 'air',
        severity: 'warning',
        title: 'High Noise Pollution',
        message: 'Noise levels exceeding 75dB at Anand Vihar Station',
        timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
        location: airQualitySensors[1].location,
        acknowledged: true
    }
];

// Important Landmarks of Delhi NCR
export const delhiLandmarks: Landmark[] = [
    {
        id: 'LM-001',
        name: 'India Gate',
        location: { latitude: 28.6129, longitude: 77.2295, address: 'Rajpath, New Delhi', zone: 'Central Delhi' },
        type: 'historical'
    },
    {
        id: 'LM-002',
        name: 'Red Fort',
        location: { latitude: 28.6562, longitude: 77.2410, address: 'Netaji Subhash Marg', zone: 'North Delhi' },
        type: 'historical'
    },
    {
        id: 'LM-003',
        name: 'Rashtrapati Bhavan',
        location: { latitude: 28.6143, longitude: 77.1994, address: 'Presidential Estate', zone: 'Central Delhi' },
        type: 'government'
    },
    {
        id: 'LM-004',
        name: 'Qutub Minar',
        location: { latitude: 28.5244, longitude: 77.1855, address: 'Mehrauli', zone: 'South Delhi' },
        type: 'historical'
    },
    {
        id: 'LM-005',
        name: 'IGI Airport',
        location: { latitude: 28.5562, longitude: 77.1000, address: 'Palam', zone: 'South West Delhi' },
        type: 'transport'
    },
    {
        id: 'LM-006',
        name: 'Connaught Place',
        location: { latitude: 28.6315, longitude: 77.2167, address: 'Rajiv Chowk', zone: 'Central Delhi' },
        type: 'other'
    }
];

// Noise Monitoring Sensors
export const noiseSensors: NoiseSensor[] = [
    {
        id: 'NS-001',
        name: 'Anand Vihar Noise Station',
        location: { latitude: 28.6469, longitude: 77.3165, address: 'Anand Vihar ISBT', zone: 'East Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date().toISOString(),
            dayLevel: 78,
            nightLevel: 68,
            limitDay: 65,
            limitNight: 55
        }
    },
    {
        id: 'NS-002',
        name: 'Punjabi Bagh Noise Station',
        location: { latitude: 28.6675, longitude: 77.1259, address: 'Punjabi Bagh Residential', zone: 'West Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date().toISOString(),
            dayLevel: 72,
            nightLevel: 62,
            limitDay: 65,
            limitNight: 55
        }
    }
];

// Waste to Energy Plants
export const wtePlants = [
    { id: 'WTE-001', name: 'Tehkhand Plant', targetCapacity: '45 MW', status: 'Expanding' },
    { id: 'WTE-002', name: 'Bawana Plant', targetCapacity: '60 MW', status: 'Expanding' },
    { id: 'WTE-003', name: 'Narela Project', targetCapacity: '30 MW', status: 'Proposed' }
];
