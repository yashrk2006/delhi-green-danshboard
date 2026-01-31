import api from './api';

export interface WasteBin {
    _id: string;
    binId: string;
    location: {
        latitude: number;
        longitude: number;
        address: string;
        zone: string;
    };
    fillLevel: number;
    status: 'active' | 'full' | 'maintenance';
    lastPickup?: string;
    type: string;
}

export interface WasteStats {
    totalBins: number;
    fullBins: number;
    avgFillLevel: number;
    activeBins: number;
}

export const wasteService = {
    getAllBins: async (): Promise<WasteBin[]> => {
        const response = await api.get('/waste');
        return response.data;
    },

    getBinById: async (id: string): Promise<WasteBin> => {
        const response = await api.get(`/waste/${id}`);
        return response.data;
    },

    getBinsByZone: async (zone: string): Promise<WasteBin[]> => {
        const response = await api.get(`/waste/zone/${zone}`);
        return response.data;
    },

    getBinsNeedingPickup: async (): Promise<WasteBin[]> => {
        const response = await api.get('/waste/pickup');
        return response.data;
    },

    getStats: async (): Promise<WasteStats> => {
        const response = await api.get('/waste/stats');
        return response.data;
    },

    createBin: async (data: Partial<WasteBin>): Promise<WasteBin> => {
        const response = await api.post('/waste', data);
        return response.data;
    },

    updateBin: async (id: string, data: any): Promise<WasteBin> => {
        const response = await api.put(`/waste/${id}`, data);
        return response.data;
    },
};
