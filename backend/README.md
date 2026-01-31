# Smart Green Delhi - Backend API

## Overview
RESTful API for Smart Green Delhi environmental monitoring platform.

## Tech Stack
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **CORS**: Enabled for frontend integration

## Project Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.ts        # Entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## API Endpoints

### Air Quality (`/api/air-quality`)
- `GET /` - Get all sensors
- `GET /stats` - Get AQI statistics
- `GET /:id` - Get sensor by ID
- `GET /zone/:zone` - Get sensors by zone
- `POST /` - Create new sensor
- `PUT /:id` - Update sensor reading

### Waste Management (`/api/waste`)
- `GET /` - Get all bins
- `GET /stats` - Get waste statistics
- `GET /pickup` - Get bins needing pickup (>75% full)
- `GET /:id` - Get bin by ID
- `GET /zone/:zone` - Get bins by zone
- `POST /` - Create new bin
- `PUT /:id` - Update bin status

### Water Quality (`/api/water`)
- `GET /` - Get all sensors
- `GET /stats` - Get water quality statistics
- `GET /critical` - Get critical sensors (health < 40)
- `GET /:id` - Get sensor by ID
- `POST /` - Create new sensor
- `PUT /:id` - Update sensor reading

### Urban Greening (`/api/green`)
- `GET /` - Get all zones
- `GET /stats` - Get green zone statistics
- `GET /:id` - Get zone by ID
- `GET /type/:type` - Get zones by type
- `POST /` - Create new zone
- `PUT /:id` - Update zone

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-green-delhi
NODE_ENV=development
```

### 3. Start MongoDB
Ensure MongoDB is running on your system.

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Build for Production
```bash
npm run build
npm start
```

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## Database Models

### AirQuality
- Station ID, Name, Location (lat/lng, address, zone)
- Status (active/inactive/maintenance)
- Last Reading (AQI, PM2.5, PM10, NO2, category)
- History array

### WasteBin
- Bin ID, Location (lat/lng, address, zone)
- Fill Level (%), Status, Last Pickup
- Type (General/Recyclable)

### WaterSensor
- Sensor ID, Name, Location (lat/lng, river point)
- Last Reading (pH, DO, BOD, health score, status)

### GreenZone
- Zone ID, Name, Location (lat/lng, address)
- Type (Park/Forest/Urban Garden)
- Area Size, Green Cover %, Total Trees

## CORS Configuration
CORS is enabled for frontend integration. Update `src/server.ts` to restrict origins in production.

## Development
- Use `npm run dev` for hot-reloading with nodemon
- TypeScript compilation happens automatically
- Logs display in console

## Production Deployment
1. Build TypeScript: `npm run build`
2. Set `NODE_ENV=production`
3. Use PM2 or similar for process management
4. Configure reverse proxy (Nginx/Apache)

## Notes
- All timestamps are in ISO format
- Statistics endpoints provide aggregated data
- Update endpoints accept partial data
- Database indexes recommended for production
