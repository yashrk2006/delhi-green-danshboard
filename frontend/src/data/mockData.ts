import type {
    AirQualitySensor,
    WasteBin,
    WasteVehicle,
    WaterSensor,
    GreenZone,
    DashboardStats,
    Alert
} from '../types';

// Air Quality Sensors - Strategic locations across Delhi
export const airQualitySensors: AirQualitySensor[] = [
    {
        id: 'AQ-001',
        name: 'Connaught Place',
        location: { latitude: 28.6304, longitude: 77.2177, address: 'Connaught Place, New Delhi', zone: 'Central Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            pm25: 145,
            pm10: 220,
            no2: 65,
            so2: 28,
            co: 1.2,
            o3: 35,
            aqi: 198,
            category: 'moderate'
        }
    },
    {
        id: 'AQ-002',
        name: 'Anand Vihar',
        location: { latitude: 28.6469, longitude: 77.3165, address: 'Anand Vihar, East Delhi', zone: 'East Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
            pm25: 285,
            pm10: 410,
            no2: 95,
            so2: 48,
            co: 2.8,
            o3: 42,
            aqi: 342,
            category: 'very poor'
        }
    },
    {
        id: 'AQ-003',
        name: 'Dwarka Sector 8',
        location: { latitude: 28.5706, longitude: 77.0593, address: 'Dwarka Sector 8, West Delhi', zone: 'West Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
            pm25: 98,
            pm10: 165,
            no2: 45,
            so2: 18,
            co: 0.9,
            o3: 28,
            aqi: 156,
            category: 'moderate'
        }
    },
    {
        id: 'AQ-004',
        name: 'Rohini',
        location: { latitude: 28.7499, longitude: 77.0662, address: 'Rohini, North West Delhi', zone: 'North West Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
            pm25: 122,
            pm10: 195,
            no2: 58,
            so2: 22,
            co: 1.5,
            o3: 31,
            aqi: 178,
            category: 'moderate'
        }
    },
    {
        id: 'AQ-005',
        name: 'Lodhi Road',
        location: { latitude: 28.5926, longitude: 77.2197, address: 'Lodhi Road, South Delhi', zone: 'South Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
            pm25: 68,
            pm10: 112,
            no2: 32,
            so2: 12,
            co: 0.6,
            o3: 22,
            aqi: 98,
            category: 'satisfactory'
        }
    },
    {
        id: 'AQ-006',
        name: 'ITO',
        location: { latitude: 28.6289, longitude: 77.2413, address: 'ITO, Central Delhi', zone: 'Central Delhi' },
        status: 'active',
        lastReading: {
            timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
            pm25: 178,
            pm10: 265,
            no2: 78,
            so2: 38,
            co: 1.8,
            o3: 38,
            aqi: 232,
            category: 'poor'
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
        name: 'Central Ridge Forest',
        location: { latitude: 28.6442, longitude: 77.1934, address: 'Ridge Road', zone: 'Central Delhi' },
        area: 864.0,
        greenCover: 92.5,
        trees: 28500,
        type: 'forest'
    },
    {
        id: 'GZ-002',
        name: 'Lodhi Garden',
        location: { latitude: 28.5931, longitude: 77.2197, address: 'Lodhi Road', zone: 'South Delhi' },
        area: 90.0,
        greenCover: 88.3,
        trees: 8200,
        type: 'garden'
    },
    {
        id: 'GZ-003',
        name: 'Sanjay Van',
        location: { latitude: 28.5243, longitude: 77.1731, address: 'Vasant Kunj', zone: 'South Delhi' },
        area: 443.0,
        greenCover: 94.8,
        trees: 15600,
        type: 'forest'
    },
    {
        id: 'GZ-004',
        name: 'Buddha Jayanti Park',
        location: { latitude: 28.6442, longitude: 77.1947, address: 'Ridge Road', zone: 'Central Delhi' },
        area: 62.0,
        greenCover: 86.2,
        trees: 5800,
        type: 'park'
    }
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
    airQuality: {
        avgAQI: 178,
        trend: 'down',
        sensorsActive: 6
    },
    waste: {
        collected: 8450,
        segregation: 68.5,
        bioCNG: 425.8
    },
    water: {
        avgHealthScore: 42,
        sensorsActive: 4,
        alerts: 3
    },
    greening: {
        greenCover: 22.8,
        trees: 58100,
        co2: 15240
    }
};

// Recent Alerts
export const recentAlerts: Alert[] = [
    {
        id: 'AL-001',
        type: 'air',
        severity: 'critical',
        title: 'Very Poor Air Quality',
        message: 'AQI exceeds 300 at Anand Vihar sensor',
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
        title: 'Poor Air Quality',
        message: 'AQI reaching 232 at ITO monitoring station',
        timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
        location: airQualitySensors[5].location,
        acknowledged: true
    }
];
