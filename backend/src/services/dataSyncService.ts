import cron from 'node-cron';
import { fetchLiveAirQualityData, fetchCPCBData } from '../integrations/airQualityIntegration';

/**
 * Scheduled Data Sync Service
 * Automatically fetches live government data at regular intervals
 */

export const startDataSync = () => {
    console.log('🚀 Starting automated data sync service...');

    // Fetch air quality data every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('\n⏰ [CRON] Running scheduled air quality data sync...');
        await fetchLiveAirQualityData();
    });

    // Initial fetch on startup
    setTimeout(async () => {
        console.log('\n🔄 Running initial data fetch...');
        await fetchLiveAirQualityData();
    }, 5000); // Wait 5 seconds after server start

    // Optional: Fetch CPCB data every hour
    cron.schedule('0 * * * *', async () => {
        console.log('\n⏰ [CRON] Running CPCB data sync...');
        await fetchCPCBData();
    });

    console.log('✅ Data sync scheduler initialized');
    console.log('   - Air Quality: Every 30 minutes');
    console.log('   - CPCB Data: Every hour');
};
