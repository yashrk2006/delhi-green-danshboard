// Comprehensive NCR Data with Real Coordinates
export interface LocationData {
    id: number;
    location: string;
    city: string;
    aqi: number;
    pm25: number;
    pm10: number;
    category: string;
    color: string;
    lat: number;
    lng: number;
}

// Dictionary of REAL approximated coordinates for Delhi NCR localities
const coordMap: { [key: string]: [number, number] } = {
    // North West
    'Adarsh Nagar': [28.7144, 77.1672],
    'Ashok Vihar': [28.6925, 77.1746],
    'Bawana': [28.8010, 77.0422],
    'Begum Pur': [28.7186, 77.0683],
    'Haqiqat Nagar': [28.6946, 77.1993],
    'Karala': [28.7350, 77.0450],
    'Keshav Puram': [28.6880, 77.1600],
    'Narela': [28.8543, 77.0910],
    'Pitampura': [28.6990, 77.1380],
    'Rohini': [28.7077, 77.1210],
    'Rani Bagh': [28.6840, 77.1300],
    'Shalimar Bagh': [28.7160, 77.1550],
    'Shastri Nagar': [28.6670, 77.1850], // Checking context, likely NW
    'Sunder Vihar': [28.6600, 77.0900],

    // North East
    'Babarpur': [28.6890, 77.2830],
    'Bhajanpura': [28.7040, 77.2640],
    'Dayal Pur': [28.7190, 77.2690],
    'Karawal Nagar': [28.7330, 77.2720],
    'Naveen Shahdara': [28.6800, 77.2850],
    'Nand Nagri': [28.7050, 77.3060],
    'Shahdara': [28.6750, 77.2900],
    'Shastri Park': [28.6660, 77.2500],
    'Seelampur': [28.6660, 77.2700],
    'Yamuna Vihar': [28.6940, 77.2680],
    'Gandhi Nagar': [28.6680, 77.2760],
    'Gokulpuri': [28.7050, 77.2850],
    'Dilshad Garden': [28.6840, 77.3190],

    // Central & New Delhi
    'Ashok Nagar': [28.6320, 77.1060], // Assuming West/Central logic
    'Chandni Chowk': [28.6505, 77.2300],
    'Civil Lines': [28.6810, 77.2270],
    'Daryaganj': [28.6460, 77.2400],
    'Dariba Kalan': [28.6540, 77.2340],
    'Karol Bagh': [28.6520, 77.1910],
    'Old Delhi': [28.6560, 77.2360],
    'Paharganj': [28.6430, 77.2130],
    'Rajender Nagar': [28.6420, 77.1820],
    'South Patel Nagar': [28.6470, 77.1680],
    'Connaught Place': [28.6304, 77.2177],
    'ITO': [28.6290, 77.2420],
    'Kashmere Gate': [28.6670, 77.2300],
    'Mandi House': [28.6250, 77.2340],
    'Barakhamba Road': [28.6280, 77.2240],
    'Rajpath': [28.6140, 77.2150],
    'India Gate': [28.6129, 77.2295],

    // South Delhi
    'Saket': [28.5240, 77.2060],
    'Vasant Kunj': [28.5290, 77.1540],
    'Malviya Nagar': [28.5350, 77.2100],
    'Sarita Vihar': [28.5280, 77.2910],
    'South Moti Bagh': [28.5770, 77.1690],
    'Sheikh Sarai': [28.5370, 77.2210],
    'Lajpat Nagar': [28.5680, 77.2430],
    'Nehru Place': [28.5500, 77.2520],
    'Kalkaji': [28.5410, 77.2560],
    'RK Puram': [28.5660, 77.1810],
    'Hauz Khas': [28.5490, 77.2000],
    'Green Park': [28.5580, 77.2050],
    'Safdarjung': [28.5670, 77.2040],
    'Lodhi Road': [28.5910, 77.2260],
    'Mehrauli': [28.5190, 77.1810],
    'Greater Kailash': [28.5450, 77.2390],
    'Defence Colony': [28.5740, 77.2350],
    'Chittaranjan Park': [28.5360, 77.2530],
    'Khanpur': [28.5140, 77.2290],

    // East Delhi
    'Laxmi Nagar': [28.6320, 77.2790],
    'Mayur Vihar': [28.6010, 77.2970],
    'Anand Vihar': [28.6460, 77.3160],
    'Preet Vihar': [28.6410, 77.2940],
    'Patparganj': [28.6270, 77.3000],
    'Krishna Nagar': [28.6580, 77.2760],
    'Vivek Vihar': [28.6650, 77.3150],
    'Trilokpuri': [28.6060, 77.3030],
    'Kondli': [28.6050, 77.3290],
    'Geeta Colony': [28.6530, 77.2660],
    'Mandawali': [28.6250, 77.2890],
    'Pandav Nagar': [28.6180, 77.2880],
    'Karkardooma': [28.6500, 77.3010],

    // West Delhi
    'Dwarka': [28.5920, 77.0460],
    'Uttam Nagar': [28.6210, 77.0650],
    'Janakpuri': [28.6210, 77.0980],
    'Tilak Nagar': [28.6360, 77.0980],
    'Rajouri Garden': [28.6490, 77.1210],
    'Punjabi Bagh': [28.6680, 77.1330],
    'Vikaspuri': [28.6350, 77.0700],
    'Najafgarh': [28.6090, 76.9850],
    'Mundka': [28.6790, 77.0260],
    'Nangloi': [28.6810, 77.0640],
    'Mayapuri': [28.6310, 77.1300],
    'Paschim Vihar': [28.6700, 77.1000],
    'Peera Garhi': [28.6760, 77.0910],
    'Moti Nagar': [28.6530, 77.1470],

    // Noida (Systematic Grid)
    'Sector 1': [28.5866, 77.3094], 'Sector 15': [28.5816, 77.3134], 'Sector 16': [28.5783, 77.3175],
    'Sector 18': [28.5708, 77.3245], 'Sector 19': [28.5786, 77.3263], 'Sector 21': [28.5886, 77.3363],
    'Sector 50': [28.5700, 77.3600], 'Sector 51': [28.5770, 77.3630], 'Sector 52': [28.5820, 77.3670],
    'Sector 61': [28.5950, 77.3650], 'Sector 62': [28.6200, 77.3640], 'Sector 63': [28.6250, 77.3780],
    'Sector 75': [28.5720, 77.3800], 'Sector 76': [28.5700, 77.3820], 'Sector 78': [28.5680, 77.3880],
    'Sector 93': [28.5300, 77.3750], 'Sector 125': [28.5450, 77.3300], 'Sector 137': [28.5100, 77.4000],
    'Sector 150': [28.4500, 77.4900], 'Pari Chowk': [28.4680, 77.5130],

    // Gurugram (Systematic)
    'Sector 14': [28.4730, 77.0420], 'Sector 29': [28.4650, 77.0690], 'Cyber City': [28.4950, 77.0890],
    'MG Road': [28.4800, 77.0780], 'Sector 43': [28.4520, 77.0830], 'Sector 56': [28.4210, 77.0970],
    'Sohna Road': [28.4100, 77.0430], 'Manesar': [28.3540, 76.9400], 'Udyog Vihar': [28.5000, 77.0760],
    'DLF Phase 1': [28.4780, 77.1000], 'DLF Phase 2': [28.4870, 77.0900], 'DLF Phase 3': [28.4930, 77.0980],
    'Golf Course Road': [28.4600, 77.0960], 'NH-8': [28.4880, 77.0500],

    // Ghaziabad
    'Vaishali': [28.6430, 77.3380], 'Indirapuram': [28.6400, 77.3680], 'Kaushambi': [28.6350, 77.3230],
    'Raj Nagar': [28.6880, 77.4330], 'Sahibabad': [28.6650, 77.3500], 'Vasundhara': [28.6600, 77.3770],
    'Crossings Republik': [28.6330, 77.4420], 'Mohan Nagar': [28.6680, 77.3880], 'Loni': [28.7490, 77.2910],

    // Faridabad
    'Sector 15A': [28.4010, 77.3200], 'Sector 21': [28.4180, 77.2960], 'NIT Faridabad': [28.3970, 77.3000],
    'Old Faridabad': [28.4140, 77.3190], 'Badarpur': [28.5030, 77.3050], 'Surajkund': [28.4820, 77.2790]
};

// Fallback generator if exact locality missing
const getRandomOffset = (lat: number, lng: number) => {
    return [
        lat + (Math.random() - 0.5) * 0.02,
        lng + (Math.random() - 0.5) * 0.02
    ];
};

export const generateLocations = (): LocationData[] => {
    const cities = [
        {
            name: 'North West Delhi',
            locations: [
                'Adarsh Nagar', 'Ashok Vihar', 'Bawana', 'Begum Pur', 'Haqiqat Nagar',
                'Karala', 'Keshav Puram', 'Narela', 'Pitampura', 'Rohini',
                'Rani Bagh', 'Shalimar Bagh', 'Shastri Nagar', 'Sunder Vihar'
            ]
        },
        {
            name: 'North East Delhi',
            locations: [
                'Babarpur', 'Bhajanpura', 'Dayal Pur', 'Karawal Nagar', 'Naveen Shahdara',
                'Nand Nagri', 'Shahdara', 'Shastri Park', 'Seelampur', 'Yamuna Vihar',
                'Gandhi Nagar', 'Gokulpuri', 'Dilshad Garden'
            ]
        },
        {
            name: 'Central Delhi',
            locations: [
                'Ashok Nagar', 'Chandni Chowk', 'Civil Lines', 'Daryaganj', 'Dariba Kalan',
                'Karol Bagh', 'Old Delhi', 'Paharganj', 'Rajender Nagar', 'South Patel Nagar',
                'Connaught Place', 'ITO', 'Kashmere Gate', 'Mandi House', 'Barakhamba Road',
                'Rajpath', 'India Gate'
            ]
        },
        {
            name: 'South Delhi',
            locations: [
                'Saket', 'Vasant Kunj', 'Malviya Nagar', 'Sarita Vihar', 'South Moti Bagh',
                'Sheikh Sarai', 'Lajpat Nagar', 'Nehru Place', 'Kalkaji', 'RK Puram',
                'Hauz Khas', 'Green Park', 'Safdarjung', 'Lodhi Road', 'Mehrauli',
                'Greater Kailash', 'Defence Colony', 'Chittaranjan Park', 'Khanpur'
            ]
        },
        {
            name: 'East Delhi',
            locations: [
                'Laxmi Nagar', 'Mayur Vihar', 'Anand Vihar', 'Preet Vihar', 'Patparganj',
                'Krishna Nagar', 'Vivek Vihar', 'Trilokpuri', 'Kondli', 'Geeta Colony',
                'Mandawali', 'Pandav Nagar', 'Karkardooma'
            ]
        },
        {
            name: 'West Delhi',
            locations: [
                'Dwarka', 'Uttam Nagar', 'Janakpuri', 'Tilak Nagar', 'Rajouri Garden',
                'Punjabi Bagh', 'Vikaspuri', 'Najafgarh', 'Mundka', 'Nangloi',
                'Mayapuri', 'Paschim Vihar', 'Peera Garhi', 'Moti Nagar'
            ]
        },
        {
            name: 'Noida',
            locations: [
                'Sector 1', 'Sector 15', 'Sector 16', 'Sector 18', 'Sector 19', 'Sector 21',
                'Sector 50', 'Sector 51', 'Sector 52', 'Sector 61', 'Sector 62', 'Sector 63',
                'Sector 75', 'Sector 76', 'Sector 78', 'Sector 79', 'Sector 82',
                'Sector 92', 'Sector 93', 'Sector 94', 'Sector 96', 'Sector 100',
                'Sector 104', 'Sector 107', 'Sector 110', 'Sector 121', 'Sector 125',
                'Sector 128', 'Sector 135', 'Sector 137', 'Sector 142', 'Sector 144',
                'Sector 150', 'Pari Chowk'
            ]
        },
        {
            name: 'Greater Noida',
            locations: [
                'Sector 1', 'Sector 4', 'Sector 10', 'Sector 17A', 'Sector 22B',
                'Chi-3', 'Chi-5', 'Alpha-1', 'Alpha-2', 'Beta-1', 'Beta-2',
                'Gamma-1', 'Gamma-2', 'Delta-1', 'Pari Chowk', 'Kasna',
                'Surajpur', 'Dankaur', 'Ecotech-1', 'Knowledge Park'
            ]
        },
        {
            name: 'Gurugram',
            locations: [
                'Sector 14', 'Sector 25', 'Sector 29', 'Sector 43', 'Sector 47', 'Sector 48',
                'Sector 49', 'Sector 50', 'Sector 54', 'Sector 55', 'Sector 56', 'Sector 57',
                'Sector 58', 'Sector 82', 'Sector 83', 'Sector 84', 'Sector 86', 'Sector 92',
                'Sector 95', 'DLF Phase 1', 'DLF Phase 2', 'DLF Phase 3', 'DLF Phase 4',
                'DLF Phase 5', 'Cyber City', 'MG Road', 'Golf Course Road', 'Sohna Road',
                'Manesar', 'Palam Vihar', 'Udyog Vihar', 'IMT Manesar', 'Dwarka Expressway',
                'New Gurgaon', 'Sushant Lok', 'South City', 'HUDA City Centre', 'NH-8', 'Basai'
            ]
        },
        {
            name: 'Ghaziabad',
            locations: [
                'Vaishali', 'Indirapuram', 'Kaushambi', 'Raj Nagar', 'Sahibabad',
                'Vasundhara', 'Crossings Republik', 'Mohan Nagar', 'Loni',
                'Muradnagar', 'Dundahera', 'Govindpuram', 'Kavi Nagar',
                'Rajendra Nagar', 'Nyay Khand', 'Vijay Nagar', 'Shastri Nagar',
                'Pratap Vihar', 'Wave City', 'Link Road'
            ]
        },
        {
            name: 'Faridabad',
            locations: [
                'Sector 15A', 'Sector 16', 'Sector 21', 'NIT Faridabad',
                'Old Faridabad', 'New Industrial Township', 'Sector 37', 'Sector 46',
                'Sector 55', 'Sector 62', 'Sector 81', 'BPTP', 'Neharpar',
                'Greater Faridabad', 'Ballabgarh', 'Surajkund', 'Badarpur'
            ]
        },
        {
            name: 'Other NCR',
            locations: [
                'Sonipat', 'Meerut', 'Rohtak', 'Hapur', 'Baghpat', 'Panipat',
                'Palwal', 'Rewari', 'Jhajjar', 'Karnal', 'Bhiwani', 'Nuh',
                'Muzaffarnagar', 'Bahadurgarh', 'Kundli', 'Ballabhgarh'
            ]
        }
    ];

    const allLocs: LocationData[] = [];
    let id = 1;

    // Region fallback centers for anything not in the dictionary
    const regionCenters: { [key: string]: [number, number] } = {
        'North West Delhi': [28.7186, 77.0683],
        'North East Delhi': [28.7130, 77.2718],
        'Central Delhi': [28.6139, 77.2090],
        'South Delhi': [28.5089, 77.1890],
        'East Delhi': [28.6322, 77.3005],
        'West Delhi': [28.6477, 77.0792],
        'Noida': [28.5555, 77.3610],
        'Greater Noida': [28.4744, 77.5040],
        'Gurugram': [28.4595, 77.0266],
        'Ghaziabad': [28.6692, 77.4138],
        'Faridabad': [28.4089, 77.3178],
        'Other NCR': [28.8909, 76.6120]
    };

    cities.forEach(city => {
        city.locations.forEach((location, index) => {
            // Seeded AQI generation
            const seed = location.length + index;
            const aqi = Math.max(50, Math.min(450, 100 + (seed * 15) % 250)); // Pseudo-random AQI 100-350 range
            const pm25 = Math.floor(aqi * 0.72);
            const pm10 = Math.floor(pm25 * 1.3);

            // Determine coordinates
            let lat, lng;
            if (coordMap[location]) {
                [lat, lng] = coordMap[location];
            } else {
                // Fallback: Use region center + random jitter based on name hash (to be consistent but distributed)
                const center = regionCenters[city.name] || [28.6139, 77.2090];
                // Deterministic pseudo-random offset
                const latOff = ((location.charCodeAt(0) % 10) - 5) / 200;
                const lngOff = ((location.charCodeAt(1) % 10) - 5) / 200;
                lat = center[0] + latOff;
                lng = center[1] + lngOff;
            }

            // Determine Color/Category
            let category = 'Poor';
            let color = 'from-red-400 to-red-600';

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
                color = 'from-purple-500 to-red-700';
            }

            allLocs.push({
                id: id++,
                location,
                city: city.name,
                aqi,
                pm25,
                pm10,
                category,
                color,
                lat,
                lng
            });
        });
    });

    return allLocs;
};
