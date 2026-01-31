import api from './api';

export interface GreenZone {
    _id: string;
    zoneId: string;
    name: string;
    location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    type: string;
    areaSize: number;
    greenCoverPercentage: number;
    totalTrees: number;
    lastAudit: string;
}

export interface GreenStats {
    totalZones: number;
    totalArea: string;
    totalTrees: number;
    avgGreenCover: string;
}

export const greenService = {
    getAllZones: async (): Promise<GreenZone[]> => {
        const response = await api.get('/green');
        return response.data;
    },

    getZoneById: async (id: string): Promise<GreenZone> => {
        const response = await api.get(`/green/${id}`);
        return response.data;
    },

    getZonesByType: async (type: string): Promise<GreenZone[]> => {
        const response = await api.get(`/green/type/${type}`);
        return response.data;
    },

    getStats: async (): Promise<GreenStats> => {
        const response = await api.get('/green/stats');
        return response.data;
    },

    createZone: async (data: Partial<GreenZone>): Promise<GreenZone> => {
        const response = await api.post('/green', data);
        return response.data;
    },

    updateZone: async (id: string, data: any): Promise<GreenZone> => {
        const response = await api.put(`/green/${id}`, data);
        return response.data;
    },
};
