import axios from 'axios';
import AirQuality from '../models/AirQuality';

/**
 * OpenAQ API Integration
 * Fetches real-time air quality data from government monitoring stations
 * Documentation: https://docs.openaq.org/
 */

const OPENAQ_API = 'https://api.openaq.org/v2';

interface OpenAQMeasurement {
    parameter: string;
    value: number;
    lastUpdated: string;
    unit: string;
    location: string;
    city: string;
    country: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

// Map AQI values to categories
const getAQICategory = (aqi: number): string => {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'satisfactory';
    if (aqi <= 200) return 'moderate';
    if (aqi <= 300) return 'poor';
    if (aqi <= 400) return 'very poor';
    return 'severe';
};

// Calculate AQI from PM2.5 (simplified Indian AQI formula)
const calculateAQI = (pm25: number): number => {
    if (pm25 <= 30) return pm25 * 50 / 30;
    if (pm25 <= 60) return 50 + (pm25 - 30) * 50 / 30;
    if (pm25 <= 90) return 100 + (pm25 - 60) * 100 / 30;
    if (pm25 <= 120) return 200 + (pm25 - 90) * 100 / 30;
    if (pm25 <= 250) return 300 + (pm25 - 120) * 100 / 130;
    return 400 + (pm25 - 250) * 100 / 130;
};

export const fetchLiveAirQualityData = async () => {
    try {
        console.log('🔄 Fetching live air quality data from OpenAQ...');

        // Fetch latest measurements for Delhi
        const response = await axios.get(`${OPENAQ_API}/latest`, {
            params: {
                city: 'Delhi',
                country: 'IN',
                limit: 100,
                parameter: 'pm25', // Primary pollutant for AQI
            }
        });

        const measurements = response.data.results;
        console.log(`✅ Fetched ${measurements.length} station readings`);

        // Process each station
        for (const station of measurements) {
            const location = station.location;
            const coordinates = station.coordinates || { latitude: 28.6139, longitude: 77.2090 };

            // Extract pollutant values
            const pm25Value = station.measurements.find((m: any) => m.parameter === 'pm25')?.value || 0;
            const pm10Value = station.measurements.find((m: any) => m.parameter === 'pm10')?.value || 0;
            const no2Value = station.measurements.find((m: any) => m.parameter === 'no2')?.value || 0;

            const aqi = Math.round(calculateAQI(pm25Value));
            const category = getAQICategory(aqi);

            // Create or update station in database
            const stationId = location.toLowerCase().replace(/\s+/g, '-');

            await AirQuality.findOneAndUpdate(
                { stationId },
                {
                    stationId,
                    name: location,
                    location: {
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        address: `${location}, Delhi`,
                        zone: 'Delhi NCR'
                    },
                    status: 'active',
                    lastReading: {
                        aqi,
                        pm25: Math.round(pm25Value),
                        pm10: Math.round(pm10Value),
                        no2: Math.round(no2Value),
                        category,
                        timestamp: new Date()
                    },
                    $push: {
                        history: {
                            $each: [{
                                aqi,
                                pm25: Math.round(pm25Value),
                                timestamp: new Date()
                            }],
                            $slice: -50 // Keep last 50 readings
                        }
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log('✅ Database updated with live government data');
        return { success: true, count: measurements.length };
    } catch (error) {
        console.error('❌ Error fetching air quality data:', error);
        return { success: false, error };
    }
};

/**
 * CPCB (Central Pollution Control Board) Integration
 * Alternative data source for official government data
 */
export const fetchCPCBData = async () => {
    try {
        console.log('🔄 Fetching CPCB data...');

        // CPCB API endpoint (example - you may need API key)
        const response = await axios.get('https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69', {
            params: {
                'api-key': process.env.CPCB_API_KEY || '', // Add to .env
                format: 'json',
                limit: 100
            }
        });

        // Process CPCB data similar to OpenAQ
        console.log('✅ CPCB data fetched');
        return { success: true };
    } catch (error) {
        console.error('❌ CPCB API error:', error);
        return { success: false, error };
    }
};
