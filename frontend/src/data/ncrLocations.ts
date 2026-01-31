// Real NCR locations with sensor data
export const generateNCRLocations = () => {
    const cities = {
        'Delhi': [
            'Connaught Place', 'Chandni Chowk', 'Karol Bagh', 'Paharganj', 'Rajendra Place',
            'Anand Vihar', 'ITO', 'Kashmere Gate', 'Shastri Park', 'Mayapuri',
            'RK Puram', 'Saket', 'Nehru Place', 'Kalkaji', 'Lajpat Nagar',
            'Dwarka', 'Janakpuri', 'Tilak Nagar', 'Rajouri Garden', 'Punjabi Bagh',
            'Rohini', 'Pitampura', 'Shalimar Bagh', 'Model Town', 'Civil Lines',
            'Najafgarh', 'Mundka', 'Nangloi', 'Vikaspuri', 'Uttam Nagar',
            'Mayur Vihar', 'Laxmi Nagar', 'Preet Vihar', 'Patparganj', 'Shahdara',
            'Narela', 'Bawana', 'Alipur', 'Burari', 'Sultanpuri',
            'Vasant Kunj', 'Mehrauli', 'Hauz Khas', 'Green Park', 'Safdarjung',
            'Lodhi Road', 'India Gate', 'Rajpath', 'Barakhamba Road', 'Mandi House'
        ],
        'Noida': [
            'Sector 62', 'Sector 63', 'Sector 18', 'Sector 15', 'Sector 16',
            'Sector 52', 'Sector 50', 'Sector 51', 'Sector 1', 'Sector 76',
            'Sector 78', 'Sector 82', 'Sector 92', 'Sector 93', 'Sector 94',
            'Sector 96', 'Sector 100', 'Sector 104', 'Sector 107', 'Sector 110',
            'Sector 121', 'Sector 125', 'Sector 128', 'Sector 135', 'Sector 137',
            'Sector 142', 'Sector 144', 'Sector 150', 'Greater Noida West', 'Jewar'
        ],
        'Gurgaon': [
            'Cyber City', 'MG Road', 'Sector 14', 'Sector 29', 'DLF Phase 1',
            'DLF Phase 2', 'DLF Phase 3', 'DLF Phase 4', 'DLF Phase 5', 'Sohna Road',
            'Golf Course Road', 'Sector 54', 'Sector 56', 'Sector 57', 'Sector 58',
            'Sector 82', 'Sector 83', 'Sector 84', 'Sector 86', 'Sector 92',
            'Manesar', 'Palam Vihar', 'Udyog Vihar', 'IMT Manesar', 'Dwarka Expressway',
            'New Gurgaon', 'Sushant Lok', 'South City', 'Nirvana Country', 'HUDA City Centre'
        ],
        'Ghaziabad': [
            'Vaishali', 'Indirapuram', 'Kaushambi', 'Raj Nagar', 'Sahibabad',
            'Vasundhara', 'Crossings Republik', 'Noida Extension', 'Mohan Nagar', 'Loni',
            'Muradnagar', 'Dundahera', 'Govindpuram', 'Kavi Nagar', 'Rajendra Nagar',
            'Nyay Khand', 'Vijay Nagar', 'Shastri Nagar', 'Pratap Vihar', 'Wave City'
        ],
        'Faridabad': [
            'Sector 16', 'Sector 21', 'NIT', 'Old Faridabad', 'New Industrial Township',
            'Sector 37', 'Sector 46', 'Sector 55', 'Sector 62', 'Sector 81',
            'BPTP', 'Neharpar', 'Greater Faridabad', 'Ballabgarh', 'Surajkund'
        ]
    };

    const areas = {
        'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'New Delhi'],
        'Noida': ['Noida', 'Greater Noida', 'Noida Extension'],
        'Gurgaon': ['Gurgaon', 'New Gurgaon', 'Manesar'],
        'Ghaziabad': ['Ghaziabad', 'Vasundhara', 'Indirapuram'],
        'Faridabad': ['Faridabad', 'Ballabgarh', 'Greater Faridabad']
    };

    let allLocations: any[] = [];
    let id = 1;

    Object.entries(cities).forEach(([city, locations]) => {
        locations.forEach(location => {
            const baseAQI = Math.floor(Math.random() * 200) + 100; // 100-300
            const variation = Math.floor(Math.random() * 50) - 25;
            const aqi = Math.max(50, Math.min(500, baseAQI + variation));

            const pm25 = Math.floor(aqi * 0.72);
            const pm10 = Math.floor(pm25 * 1.3);
            const no2 = Math.floor(Math.random() * 80) + 20;
            const so2 = Math.floor(Math.random() * 50) + 10;
            const o3 = Math.floor(Math.random() * 100) + 30;
            const co = Math.floor(Math.random() * 3) + 0.5;

            let category: 'Good' | 'Moderate' | 'Unhealthy' | 'Poor' | 'Severe';
            let color: string;

            if (aqi <= 50) {
                category = 'Good';
                color = 'from-green-400 to-green-600';
            } else if (aqi <= 100) {
                category = 'Moderate';
                color = 'from-yellow-400 to-yellow-600';
            } else if (aqi <= 200) {
                category = 'Unhealthy';
                color = 'from-orange-400 to-orange-600';
            } else if (aqi <= 300) {
                category = 'Poor';
                color = 'from-red-400 to-red-600';
            } else {
                category = 'Severe';
                color = 'from-purple-500 to-red-600';
            }

            const randomArea = areas[city][Math.floor(Math.random() * areas[city].length)];

            allLocations.push({
                id: id++,
                location,
                city,
                area: randomArea,
                aqi,
                pm25,
                pm10,
                no2,
                so2,
                o3,
                co,
                category,
                color,
                lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
                latitude: 28.6 + (Math.random() * 0.5),
                longitude: 77.2 + (Math.random() * 0.5)
            });
        });
    });

    return allLocations;
};

export interface LocationData {
    id: number;
    location: string;
    city: string;
    area: string;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    o3: number;
    co: number;
    category: 'Good' | 'Moderate' | 'Unhealthy' | 'Poor' | 'Severe';
    color: string;
    lastUpdated: string;
    latitude: number;
    longitude: number;
}
