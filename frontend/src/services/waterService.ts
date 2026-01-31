import api from './api';

export interface WaterSensor {
    _id: string;
    sensorId: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
        riverPoint: string;
    };
    lastReading: {
        ph: number;
        dissolvedOxygen: number;
        bod: number;
        healthScore: number;
        status: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
        timestamp: string;
    };
}

export interface WaterStats {
    totalSensors: number;
    avgHealthScore: number;
    criticalZones: number;
    activeSensors: number;
}

export const waterService = {
    getAllSensors: async (): Promise<WaterSensor[]> => {
        const response = await api.get('/water');
        return response.data;
    },

    getSensorById: async (id: string): Promise<WaterSensor> => {
        const response = await api.get(`/water/${id}`);
        return response.data;
    },

    getCriticalSensors: async (): Promise<WaterSensor[]> => {
        const response = await api.get('/water/critical');
        return response.data;
    },

    getStats: async (): Promise<WaterStats> => {
        const response = await api.get('/water/stats');
        return response.data;
    },

    createSensor: async (data: Partial<WaterSensor>): Promise<WaterSensor> => {
        const response = await api.post('/water', data);
        return response.data;
    },

    updateReading: async (id: string, data: any): Promise<WaterSensor> => {
        const response = await api.put(`/water/${id}`, data);
        return response.data;
    },
};
