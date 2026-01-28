// Common types
export interface Location {
    latitude: number;
    longitude: number;
    address: string;
    zone: string;
}

// Air Quality Module
export interface AirQualitySensor {
    id: string;
    name: string;
    location: Location;
    status: 'active' | 'maintenance' | 'offline';
    lastReading: AirQualityReading;
}

export interface AirQualityReading {
    timestamp: string;
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
    aqi: number;
    category: 'good' | 'satisfactory' | 'moderate' | 'poor' | 'very poor' | 'severe';
}

// Waste Management Module
export interface WasteBin {
    id: string;
    location: Location;
    fillLevel: number;
    capacity: number;
    lastCollection: string;
    type: 'dry' | 'wet' | 'mixed';
    status: 'normal' | 'full' | 'overflow';
}

export interface WasteVehicle {
    id: string;
    vehicleNumber: string;
    type: string;
    location: Location;
    status: 'active' | 'idle' | 'maintenance';
    route: string;
    capacity: number;
    filled: number;
}

export interface WasteMetrics {
    totalCollected: number;
    segregationRate: number;
    bioCNGProduced: number;
    revenue: number;
    efficiency: number;
}

// Yamuna Monitoring Module
export interface WaterSensor {
    id: string;
    name: string;
    location: Location;
    segment: string;
    status: 'active' | 'maintenance' | 'offline';
    lastReading: WaterQualityReading;
}

export interface WaterQualityReading {
    timestamp: string;
    ph: number;
    dissolvedOxygen: number;
    bod: number;
    cod: number;
    turbidity: number;
    temperature: number;
    healthScore: number;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

// Urban Greening Module
export interface GreenZone {
    id: string;
    name: string;
    location: Location;
    area: number;
    greenCover: number;
    trees: number;
    type: 'park' | 'forest' | 'garden' | 'street';
}

export interface GreeningMetrics {
    totalGreenCover: number;
    treesPlanted: number;
    co2Absorbed: number;
    temperatureReduction: number;
    microForests: number;
}

// Dashboard
export interface DashboardStats {
    airQuality: {
        avgAQI: number;
        trend: 'up' | 'down' | 'stable';
        sensorsActive: number;
    };
    waste: {
        collected: number;
        segregation: number;
        bioCNG: number;
    };
    water: {
        avgHealthScore: number;
        sensorsActive: number;
        alerts: number;
    };
    greening: {
        greenCover: number;
        trees: number;
        co2: number;
    };
}

// Alerts
export interface Alert {
    id: string;
    type: 'air' | 'waste' | 'water' | 'system';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    location?: Location;
    acknowledged: boolean;
}
