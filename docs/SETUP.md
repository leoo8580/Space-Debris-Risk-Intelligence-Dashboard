# Space Debris Risk Intelligence Dashboard
# Developer Setup Guide

## System Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0
- Modern web browser (Chrome 90+, Firefox 88+)
- 4GB RAM minimum
- Stable internet connection for API calls

## Installation & Setup

### Step 1: Clone/Setup Repository
```bash
cd c:\Users\HP\OneDrive\Documents\space
```

### Step 2: Backend Installation
```bash
cd backend
npm install
```

**Expected output:** 
```
added X packages
```

### Step 3: Frontend Installation
```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment

#### Backend Configuration
`backend/.env`:
```env
PORT=5000
NODE_ENV=development
SPACETRACK_USERNAME=your_username
SPACETRACK_PASSWORD=your_password
CELESTRAK_BASE_URL=https://celestrak.org/NORAD/elements/
```

#### Frontend Configuration
`frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected: `Space Debris API Server Running on Port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Expected: Browser opens to `http://localhost:3000`

## Common Issues

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### CORS Errors
Verify `backend/server.js` has:
```javascript
app.use(cors());
```

### Module Not Found
```bash
# Reinstall dependencies
rm -r node_modules
npm install
```

### Hot Reload Not Working
```bash
# Check for watchers limit
# Increase on Linux: echo 32000 | sudo tee /proc/sys/fs/inotify/max_user_watches
```

## Data Formats

### TLE Data Input
```json
{
  "debris": [
    {
      "NORAD_CAT_ID": "25544",
      "OBJECT_NAME": "ISS (ZARYA)",
      "MEAN_MOTION": 15.5,
      "ECCENTRICITY": 0.0003,
      "INCLINATION": 51.64
    }
  ],
  "timestamp": "2026-02-07T00:00:00Z"
}
```

### Analytics Output
```json
{
  "riskEvolution": [{
    "date": "2026-02-01",
    "collisionRisk": 0.247,
    "debrisDensity": 3420
  }],
  "summary": {
    "avgRisk": 0.235,
    "maxRisk": 0.278,
    "trend": "increasing"
  }
}
```

## Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:5000/api/health

# Get risk evolution
curl "http://localhost:5000/api/analytics/risk-evolution?timeWindow=30"

# Get anomalies
curl "http://localhost:5000/api/analytics/anomalies?sensitivityLevel=medium"

# Get forecast
curl "http://localhost:5000/api/analytics/forecast?forecastDays=30"

# Get explainability
curl "http://localhost:5000/api/analytics/explainability?timeRange=7d"
```

### Using Postman
Import these requests:

1. **GET** `/api/analytics/dashboard-summary`
2. **GET** `/api/analytics/risk-evolution`
3. **GET** `/api/analytics/anomalies`
4. **GET** `/api/analytics/forecast`
5. **GET** `/api/analytics/explainability`
6. **POST** `/api/analytics/compare` (Raw JSON body)

## Performance Tips

### Frontend Optimization
- Use React DevTools Profiler to identify slow renders
- Implement virtualization for large datasets
- Enable gzip compression in production

### Backend Optimization
- Add caching headers for static endpoints
- Implement rate limiting
- Use database indexes for frequent queries

### Dashboard Best Practices
- Limit time-window to 90 days for better performance
- Use medium sensitivity for anomaly detection
- Refresh every 5 minutes (not more frequent)

## Deployment

### Production Build
```bash
cd frontend
npm run build
# Creates optimized build in ./build

cd backend
NODE_ENV=production npm start
```

### Docker (Optional)
Backend Dockerfile example:
```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
API_RATE_LIMIT=100
DB_CONNECTION_POOL_SIZE=10
LOG_LEVEL=info
```

## Monitoring & Debugging

### Check API Health
```bash
curl http://localhost:5000/api/health
```

### Backend Logs
Look for errors in terminal where `npm run dev` is running

### Frontend Console
Open browser DevTools (F12) → Console tab

### Network Requests
DevTools → Network tab → Monitor API calls

## Useful Commands

```bash
# Kill all node processes on Windows
taskkill /F /IM node.exe

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# View Node processes
Get-Process node

# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
npm install --legacy-peer-deps
```

## Integration with Real Data

### Space-Track API
1. Register at: https://www.space-track.org
2. Add credentials to `.env`
3. Uncomment data ingestion in `server.js`

### CelesTrak
No authentication required. Data is publicly available.

## Documentation

- `README.md` - Project overview and features
- `docs/ARCHITECTURE.md` (to create) - System design
- `docs/API.md` (to create) - API reference
- Component files have JSDoc comments

## Getting Help

1. Check browser console for error messages
2. Check terminal output for backend errors
3. Enable verbose logging: `DEBUG=* npm start`
4. Check GitHub issues or documentation
5. Review component prop types in source

---

**Last Updated:** Feb 2026
**Version:** 1.0.0
