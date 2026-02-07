# Space Debris Risk Intelligence Dashboard

## 🛰️ Overview

A conference-grade analytics dashboard integrating five novel analytics capabilities for understanding space debris collision risk:

1. **Risk Evolution Analytics** - Time-series visualization of risk and debris density changes
2. **Debris Growth Anomaly Detection** - Automatic detection of abnormal congestion patterns
3. **Future Hotspot Forecasting** - Trend-based prediction of high-risk orbital regions
4. **Explainable Risk Insights** - Human-readable explanations of risk factor contributions
5. **Decision-Support Dashboard** - Interactive comparison and visual reasoning tools

## 🎯 Key Features

✨ **Real-time Analytics** - Stream debris data and compute risk metrics dynamically
📊 **Spatio-temporal Visualization** - Track risk evolution across orbital altitudes and inclinations
🚨 **Early Warning System** - Detect abnormal congestion growth with configurable sensitivity
🔮 **Trend-based Forecasting** - Project future hotspots without physics simulation
🧠 **Explainability** - Feature contribution analysis for risk changes
🎨 **Space-themed UI** - Professional dark interface with neon orbital graphics

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Data APIs**: Space-Track, CelesTrak

### Frontend
- **Framework**: React.js
- **Charts**: Recharts + Chart.js  
- **Styling**: CSS3 with space theme
- **State**: React Hooks

### Analytics
- **Engine**: JavaScript/Node.js
- **Methods**: Statistical analysis, exponential smoothing, trend detection
- **Storage**: In-memory (can integrate MongoDB)

## 📁 Project Structure

```
space/
├── backend/
│   ├── server.js              # Express API server
│   ├── package.json           # Backend dependencies
│   └── .env                   # Configuration
├── frontend/
│   ├── src/
│   │   ├── Dashboard.js       # Main dashboard component
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── RiskEvolutionPanel.js
│   │   │   ├── AnomalyDetectionPanel.js
│   │   │   ├── ForecastingPanel.js
│   │   │   ├── ExplainabilityPanel.js
│   │   │   └── DecisionSupportPanel.js
│   │   ├── styles/            # Component-specific CSS
│   │   ├── utils/
│   │   │   └── api.js
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── public/
├── analytics/
│   ├── analyticsEngine.js
│   └── spaceTrackConnector.js
└── docs/
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. **Backend Setup**
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### API Endpoints

#### Analytics
- `GET /api/analytics/risk-evolution` - Risk & density timeline
- `GET /api/analytics/anomalies` - Detect debris growth anomalies
- `GET /api/analytics/forecast` - Forecast hotspots
- `GET /api/analytics/explainability` - Risk factor insights
- `POST /api/analytics/compare` - Compare regions/periods
- `GET /api/analytics/dashboard-summary` - Overview metrics

#### Data Management
- `POST /api/ingest-debris-data` - Ingest TLE records
- `GET /api/debris-data` - Retrieve debris with filters

## 📊 Dashboard Components

### 1. Risk Evolution Timeline
Time-series showing collision risk and debris density over configurable time windows with altitude/inclination filters.

**Query Parameters:**
- `timeWindow`: Days (7, 30, 90, 180)
- `altitudeMin/Max`: Altitude range in km

### 2. Anomaly & Growth Alerts
Real-time detection of sudden debris spikes with severity levels and actionable recommendations.

**Controls:**
- Sensitivity level (High/Medium/Low)
- Alert filtering by type

### 3. Future Risk Hotspots
Forecasts debris density and risk evolution across orbital regions using exponential smoothing.

**Output:**
- Projected density timeline
- Hotspot intensity maps
- Confidence score

### 4. Why Did Risk Increase?
Explainable AI panel showing factor contributions to risk changes with bar charts and affected regions.

**Factors:**
- Debris growth rate
- Object count changes
- Orbital clustering index
- Inclination impact
- Atmospheric decay

### 5. Decision Support & Comparison
Side-by-side comparison of orbital regions or time periods with key metrics.

**Comparisons:**
- Debris density
- Collision risk
- Growth rates
- Object counts
- Clustering patterns

## 🔌 Space API Integration

### Configuration
Edit `backend/.env`:
```env
SPACETRACK_USERNAME=your_username
SPACETRACK_PASSWORD=your_password
CELESTRAK_BASE_URL=https://celestrak.org/NORAD/elements/
```

### Data Sources
- **Space-Track**: Official NORAD TLE data
- **CelesTrak**: Historical TLE archives

## 📈 Analytics Methods

### Risk Calculation
```
Risk = 0.3 × log(Density/1000) + 0.4 × (ObjectCount/50000) + 0.3 × ClusteringIndex
```

### Anomaly Detection
Statistical z-score method with configurable sensitivity thresholds.

### Forecasting
Exponential smoothing (α = 0.3) for short-term trend projection.

### Explainability
Feature contribution scoring using normalized factor weighting.

## 🎨 UI/UX Features

- **Dark Space Theme**: Low-light design for 24/7 monitoring
- **Neon Accents**: #00FF9F (cyan) and #FF00FF (magenta) for visual hierarchy
- **Animated Orbital Rings**: Background animation in header
- **Responsive Grid**: Adapts from 2x panels on desktop to single column on mobile
- **Interactive Charts**: Hover tooltips and smooth animations
- **Real-time Refresh**: Background data updates every 5 minutes

## ⚖️ Ethics & Scope

### This Dashboard Is Not
- A satellite control system
- A collision avoidance calculator
- A physics simulator
- An automated decision-making system

### This Dashboard Is
- An analytics and visualization platform
- A visual reasoning tool for operators
- A decision-support aid (human-in-the-loop)
- An educational and research resource

**Disclaimer**: For operational space object tracking, use official SSA systems. This dashboard is for analysis and insights only.

## 📚 Conference Publication

**Recommended Abstract:**

*"We present an integrated space debris risk intelligence dashboard combining spatio-temporal risk evolution analysis, automated anomaly detection, trend-based forecasting, explainable risk interpretation, and interactive decision-support within a unified visual analytics platform. The system processes historical TLE records to identify debris density trends, detect congestion anomalies, forecast high-risk orbital regions, and provide interpretable insights into risk factor contributions. Unlike deterministic collision probability models, our analytics-first approach emphasizes risk understanding and visual reasoning, enabling operators to make informed decisions about orbital regions and time periods of concern."*

## 🔧 Development

### Running in Development Mode
Backend with auto-reload:
```bash
cd backend
npm run dev
```

### Building for Production
```bash
cd frontend
npm run build

cd backend
npm start
```

### Testing Analytics Engine
```javascript
const DebrisAnalyticsEngine = require('./analytics/analyticsEngine');

const risk = DebrisAnalyticsEngine.calculateCollisionRisk(3500, 2500, 0.72);
console.log('Collision Risk:', risk);
```

## 📝 Future Enhancements

- [ ] MongoDB integration for historical data caching
- [ ] Real-time WebSocket updates
- [ ] Machine learning-based forecasting (LSTM)
- [ ] 3D orbital visualization
- [ ] Export reports (PDF)
- [ ] Slack/Email alerts
- [ ] Multi-user collaboration features
- [ ] Historical replay mode

## 📄 License

MIT - See LICENSE file

## 👥 Contributing

Contributions welcome! Please see CONTRIBUTING.md

## 📧 Contact

For questions or feedback: [contact information]

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Conference-grade Production Ready
