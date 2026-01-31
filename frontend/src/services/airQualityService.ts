import api from './api';

export interface AirQualitySensor {
    _id: string;
    stationId: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
        address: string;
        zone: string;
    };
    status: 'active' | 'inactive' | 'maintenance';
    lastReading: {
        aqi: number;
        pm25: number;
        pm10: number;
        no2: number;
        category: string;
        timestamp: string;
    };
    history: Array<{
        aqi: number;
        pm25: number;
        timestamp: string;
    }>;
}

export interface AQIStats {
    totalSensors: number;
    avgAQI: number;
    avgPM25: number;
    activeSensors: number;
}

export const airQualityService = {
    getAllSensors: async (): Promise<AirQualitySensor[]> => {
        const response = await api.get('/air-quality');
        return response.data;
    },

    getSensorById: async (id: string): Promise<AirQualitySensor> => {
        const response = await api.get(`/air-quality/${id}`);
        return response.data;
    },

    getSensorsByZone: async (zone: string): Promise<AirQualitySensor[]> => {
        const response = await api.get(`/air-quality/zone/${zone}`);
        return response.data;
    },

    getStats: async (): Promise<AQIStats> => {
        const response = await api.get('/air-quality/stats');
        return response.data;
    },

    createSensor: async (data: Partial<AirQualitySensor>): Promise<AirQualitySensor> => {
        const response = await api.post('/air-quality', data);
        return response.data;
    },

    updateReading: async (id: string, data: any): Promise<AirQualitySensor> => {
        const response = await api.put(`/air-quality/${id}`, data);
        return response.data;
    },
};
