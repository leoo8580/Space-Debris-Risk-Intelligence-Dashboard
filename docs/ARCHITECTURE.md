# Space Debris Risk Intelligence Dashboard - Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SPACE-TRACK / CELESTRAK API               │
│                    (TLE Data Source)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────▼────────────┐
            │   Backend API Server    │
            │   (Express.js/Node)     │
            └─┬──────────────────────┬┘
              │                      │
    ┌─────────▼─────────┐   ┌───────▼────────────┐
    │ Analytics Engine  │   │  Data Ingestion    │
    │ (Risk Calc,       │   │  & Filtering       │
    │  Forecasting,     │   │                    │
    │  Anomaly Detect)  │   │                    │
    └─────────┬─────────┘   └────────────────────┘
              │
    ┌─────────▼──────────────────────────┐
    │   REST API Endpoints               │
    │ (Risk Evolution, Anomalies, etc)   │
    └─────────┬──────────────────────────┘
              │
    ┌─────────▼──────────────────────────┐
    │      React Frontend Dashboard      │
    │    (Interactive Visualizations)    │
    └────────────────────────────────────┘
```

## Component Architecture

### Backend (Node.js/Express)

```
server.js
├── Middleware (CORS, Body Parser)
├── Routes
│   ├── /api/health
│   ├── /api/ingest-debris-data (POST)
│   ├── /api/debris-data (GET)
│   ├── /api/analytics/risk-evolution
│   ├── /api/analytics/anomalies
│   ├── /api/analytics/forecast
│   ├── /api/analytics/explainability
│   ├── /api/analytics/compare (POST)
│   └── /api/analytics/dashboard-summary
└── Error Handling
```

### Frontend (React)

```
Dashboard.js (Main Container)
├── Header.js (KPI Display & Orbital Animation)
│   ├── Global Risk Metric
│   ├── 24h Change Indicator
│   ├── Critical Alerts Count
│   └── Orbital Ring Animations
│
├── Dashboard Controls
│   ├── Time Window Selector
│   └── Altitude Range Slider
│
└── Dashboard Grid (5 Panels)
    ├── RiskEvolutionPanel
    │   ├── Risk/Density Timeline (Line Chart)
    │   └── Summary Metrics
    │
    ├── AnomalyDetectionPanel
    │   ├── Alert List
    │   ├── Severity Indicators
    │   └── Recommendations
    │
    ├── ForecastingPanel
    │   ├── Projected Density/Risk
    │   └── Hotspot Grid
    │
    ├── ExplainabilityPanel
    │   ├── Risk Summary
    │   ├── Factor Contribution Bars
    │   └── Affected Regions Tags
    │
    └── DecisionSupportPanel
        ├── Region Comparison Controls
        ├── Metrics Table
        └── Insights List
```

## Data Flow

### Risk Evolution Analysis
```
TLE Data → Altitude/Inclination Binning 
        → Debris Density Calculation
        → Risk Score Computation
        → Time-Series Generation
        → Chart Rendering
```

### Anomaly Detection
```
Historical Density Series → Statistical Analysis
                         → Z-Score Calculation
                         → Threshold Comparison
                         → Anomaly Identification
                         → Alert Generation
```

### Forecasting
```
Recent Data Series → Exponential Smoothing
                  → Trend Projection
                  → Confidence Calculation
                  → Hotspot Identification
```

### Explainability
```
Risk Increase Detection → Factor Decomposition
                       → Contribution Scoring
                       → Affected Region ID
                       → Explanation Generation
```

## Key Algorithms

### 1. Collision Risk Calculation
```
Risk = 0.3 × log(Density/1000) + 0.4 × (Count/50000) + 0.3 × Clustering

Where:
- Density: Objects per volume unit
- Count: Total object count in region
- Clustering: Spatial concentration metric (0-1)
- Result: Risk score (0-1)
```

### 2. Anomaly Detection (Z-Score)
```
Z = (Value - Mean) / StdDev

If |Z| > Threshold:
  - Low sensitivity: |Z| > 3
  - Medium: |Z| > 2
  - High: |Z| > 1.5
```

### 3. Exponential Smoothing Forecast
```
F(t+1) = α × D(t) + (1-α) × D(t-1)

Where:
- α = smoothing factor (typically 0.3)
- D(t) = actual demand at time t
- Repeated for desired forecast horizon
```

### 4. Factor Contribution
```
Contribution(i) = Weight(i) / Sum(All Weights)

Where:
- Weight proportional to metric influence on risk
- Normalized to 0-1 range
- Displays as percentage
```

## Database Schema (Optional MongoDB)

```javascript
// Debris Records
{
  _id: ObjectId,
  timestamp: DateTime,
  noradCatId: String,
  objectName: String,
  altitude: Number,
  inclination: Number,
  eccentricity: Number,
  meanMotion: Number
}

// Risk Metrics (Time-series)
{
  _id: ObjectId,
  date: DateTime,
  regionId: String,
  collisionRisk: Number,
  debrisDensity: Number,
  objectCount: Number,
  anomalyScore: Number
}

// Anomalies
{
  _id: ObjectId,
  timestamp: DateTime,
  type: String,
  severity: String,
  altitude: String,
  description: String,
  affectedObjects: Number
}
```

## API Response Structure

### Risk Evolution Response
```json
{
  "riskEvolution": [
    {
      "date": "2026-02-01",
      "timestamp": 1738454400000,
      "collisionRisk": 0.247,
      "debrisDensity": 2847,
      "altitudeRange": "750-800 km"
    }
  ],
  "summary": {
    "avgRisk": 0.235,
    "maxRisk": 0.278,
    "trend": "increasing"
  }
}
```

### Anomaly Response
```json
{
  "anomalyCount": 3,
  "anomalies": [
    {
      "id": "anom_001",
      "timestamp": "2026-02-02T00:00:00Z",
      "type": "density_spike",
      "severity": "high",
      "anomalyScore": 0.87,
      "description": "Sudden debris density increase detected"
    }
  ],
  "alerts": [/* high severity items */]
}
```

## Performance Considerations

### Frontend
- **Charts render**: <500ms for 30-day window
- **Grid layout**: CSS Grid for responsive design
- **Virtual scrolling**: For large anomaly lists
- **Debounced updates**: API calls throttled to 5-min intervals

### Backend
- **In-memory storage**: Suitable for <10K records
- **Query response**: <200ms for most endpoints
- **Concurrent requests**: Handles ~100 simultaneous connections

### Scalability Path
- Add MongoDB for persistent storage
- Implement caching layer (Redis)
- Use WebSockets for real-time updates
- Deploy to microservices architecture

## Security Considerations

### Current Implementation
- No authentication (development mode)
- CORS enabled for all origins (development)
- No rate limiting
- No data encryption

### Production Recommendations
- Add JWT authentication
- Restrict CORS to known origins
- Implement rate limiting (100 req/min)
- Use HTTPS/TLS
- Add input validation
- Sanitize error messages
- Add audit logging

## Testing Strategy

### Unit Tests (Recommended)
```bash
# Analytics engine tests
npm test -- analyticsEngine.test.js

# API endpoint tests
npm test -- server.test.js
```

### Integration Tests
- Test full data flow: API → Analytics → Frontend
- Verify response formatting
- Check error handling

### UI/E2E Tests
- Test panel interactions
- Verify chart rendering
- Check responsive behavior

## Deployment Strategy

### Development
- Local: `npm run dev` (both backend & frontend)

### Staging
- Docker containers
- Staging API keys
- MongoDB test instance

### Production
- Docker Compose or Kubernetes
- CDN for frontend assets
- Load balancer for API
- Production Space-Track credentials
- Monitoring & alerting

## Monitoring & Observability

### Metrics to Track
- API response times
- Error rates
- Chart render times
- Data ingestion frequency
- Active users

### Logging
```javascript
// Backend logging
console.log(`[${new Date().toISOString()}] ${level}: ${message}`);
```

### Error Tracking
- Sentry integration (recommended)
- Error rate alerts
- Stack trace collection

## Known Limitations

### Current Version
- Synthetic data only (not real Space-Track integration)
- Single user mode
- No historical data persistence
- No real-time updates (5-min refresh interval)

### Roadmap
- Real Space-Track data integration
- Multi-user collaboration
- MongoDB persistence
- WebSocket real-time updates
- 3D orbital visualization
- ML-based forecasting

---

**Architecture Version:** 1.0
**Last Updated:** Feb 2026
