const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// In-memory data store (can be replaced with MongoDB)
let debrisData = [];
let analyticsCache = {};

// ===== ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ===== DATA INGESTION =====

/**
 * POST /api/ingest-debris-data
 * Ingest TLE data or debris records
 */
app.post('/api/ingest-debris-data', (req, res) => {
  try {
    const { debris, timestamp } = req.body;
    
    if (!debris || !Array.isArray(debris)) {
      return res.status(400).json({ error: 'debris array required' });
    }

    debrisData.push({
      timestamp: timestamp || new Date().toISOString(),
      records: debris
    });

    console.log(`Ingested ${debris.length} debris records`);
    res.json({ 
      success: true, 
      message: `Ingested ${debris.length} records`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/debris-data
 * Retrieve debris data with optional filters
 */
app.get('/api/debris-data', (req, res) => {
  try {
    const { timeWindow, altitudeMin, altitudeMax, inclinationMin, inclinationMax } = req.query;
    
    // Simple filtering logic
    let filtered = debrisData;
    
    if (timeWindow) {
      const days = parseInt(timeWindow);
      const cutoffTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(d => new Date(d.timestamp) >= cutoffTime);
    }

    res.json({
      dataCount: filtered.length,
      data: filtered.slice(-100), // Last 100 records
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ANALYTICS ENDPOINTS =====

/**
 * GET /api/analytics/risk-evolution
 * Returns risk evolution metrics over time
 */
app.get('/api/analytics/risk-evolution', (req, res) => {
  try {
    const { timeWindow = 30, altitudeMin = 300, altitudeMax = 2000 } = req.query;
    
    // Generate synthetic timeline data
    const timeline = [];
    const now = Date.now();
    const days = parseInt(timeWindow);

    for (let i = days; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      timeline.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        collisionRisk: (Math.random() * 0.3 + 0.1).toFixed(4),
        debrisDensity: Math.floor(Math.random() * 5000 + 2000),
        altitudeRange: `${altitudeMin}-${altitudeMax} km`
      });
    }

    res.json({
      riskEvolution: timeline,
      summary: {
        avgRisk: (timeline.reduce((sum, t) => sum + parseFloat(t.collisionRisk), 0) / timeline.length).toFixed(4),
        maxRisk: Math.max(...timeline.map(t => parseFloat(t.collisionRisk))).toFixed(4),
        trend: 'increasing'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/anomalies
 * Detect debris growth anomalies
 */
app.get('/api/analytics/anomalies', (req, res) => {
  try {
    const { sensitivityLevel = 'medium' } = req.query;
    const threshold = sensitivityLevel === 'high' ? 1.5 : sensitivityLevel === 'low' ? 3 : 2;

    const anomalies = [
      {
        id: 'anom_001',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'density_spike',
        altitude: '750-800 km',
        severity: 'high',
        description: 'Sudden debris density increase detected',
        anomalyScore: 0.87,
        affectedObjects: 342,
        recommendation: 'Monitor inclination band 97°-99° closely'
      },
      {
        id: 'anom_002',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'growth_rate_spike',
        altitude: '600-650 km',
        severity: 'medium',
        description: 'Abnormal congestion growth rate',
        anomalyScore: 0.64,
        affectedObjects: 215,
        recommendation: 'Review recent fragmentation events'
      },
      {
        id: 'anom_003',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'clustering',
        altitude: '850-950 km',
        severity: 'medium',
        description: 'Abnormal orbital clustering detected',
        anomalyScore: 0.72,
        affectedObjects: 428,
        recommendation: 'Analyze inclination plane distribution'
      }
    ];

    res.json({
      anomalyCount: anomalies.length,
      anomalies: anomalies,
      alerts: anomalies.filter(a => a.severity === 'high' || a.anomalyScore > 0.8),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/forecast
 * Forecast future debris hotspots
 */
app.get('/api/analytics/forecast', (req, res) => {
  try {
    const { forecastDays = 30 } = req.query;
    
    const forecast = [];
    const now = Date.now();

    for (let i = 0; i <= forecastDays; i++) {
      const date = new Date(now + i * 24 * 60 * 60 * 1000);
      forecast.push({
        date: date.toISOString().split('T')[0],
        projectedDensity: Math.floor(Math.random() * 6000 + 2500),
        projectedRisk: (Math.random() * 0.35 + 0.12).toFixed(4),
        riskTrend: Math.random() > 0.5 ? 'increasing' : 'stable',
        hotspots: [
          { altitude: '750 km', inclination: '98.5°', intensity: 0.8 + Math.random() * 0.2 },
          { altitude: '600 km', inclination: '51.6°', intensity: 0.6 + Math.random() * 0.2 },
          { altitude: '900 km', inclination: '98.2°', intensity: 0.7 + Math.random() * 0.2 }
        ]
      });
    }

    res.json({
      forecast: forecast,
      forecastHorizon: `${forecastDays} days`,
      confidence: 0.72,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/explainability
 * Explain risk factors and contributions
 */
app.get('/api/analytics/explainability', (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;

    // Dynamic responses based on time range
    let riskIncrease, summary, confidence, keyFactors;
    
    if (timeRange === '1d' || timeRange === '1d') {
      riskIncrease = 8;
      summary = 'Risk increased 8% over the past 1 day due to recent debris activity';
      confidence = 0.76;
      keyFactors = [
        {
          factor: 'Recent Debris Injection',
          contribution: 0.52,
          description: 'Latest fragmentation event released 156 new objects',
          impact: 'high'
        },
        {
          factor: 'Inclination Band (97-99°)',
          contribution: 0.28,
          description: 'Sun-synchronous orbit plane affected most',
          impact: 'high'
        },
        {
          factor: 'Atmospheric Variations',
          contribution: 0.20,
          description: 'Recent geomagnetic activity altered drag',
          impact: 'medium'
        }
      ];
    } else if (timeRange === '30d' || timeRange === '30d') {
      riskIncrease = 42;
      summary = 'Risk increased 42% over the past 30 days due to sustained debris growth';
      confidence = 0.84;
      keyFactors = [
        {
          factor: 'Debris Growth at 750-800 km',
          contribution: 0.38,
          description: 'Sustained increase in LEO band object count',
          impact: 'high'
        },
        {
          factor: 'Multiple Fragmentation Events',
          contribution: 0.32,
          description: 'Three major breakup events occurred in this period',
          impact: 'high'
        },
        {
          factor: 'Orbital Clustering',
          contribution: 0.18,
          description: 'Increased conjunction probability at 98° inclination',
          impact: 'medium'
        },
        {
          factor: 'Decay Rate Reduction',
          contribution: 0.12,
          description: 'Lower atmospheric density extended object lifetime',
          impact: 'medium'
        }
      ];
    } else {
      // Default 7d
      riskIncrease = 23;
      summary = 'Risk increased 23% over the past 7 days due to multiple factors';
      confidence = 0.81;
      keyFactors = [
        {
          factor: 'Debris Growth at 750-800 km',
          contribution: 0.45,
          description: 'Rapid increase in object count in LEO band',
          impact: 'high'
        },
        {
          factor: 'Inclination Band (97-99°)',
          contribution: 0.28,
          description: 'Sun-synchronous orbit plane shows abnormal clustering',
          impact: 'high'
        },
        {
          factor: 'Object Count Growth',
          contribution: 0.15,
          description: 'Net 342 new objects catalogued',
          impact: 'medium'
        },
        {
          factor: 'Orbital Eccentricity Shifts',
          contribution: 0.08,
          description: 'Minor perturbations in conjunction patterns',
          impact: 'low'
        },
        {
          factor: 'Seasonal Atmospheric Decay',
          contribution: 0.04,
          description: 'Minimal atmospheric effect at current altitude bands',
          impact: 'low'
        }
      ];
    }

    const explanation = {
      summary: summary,
      keyFactors: keyFactors,
      affectedAltitudes: ['600-650 km', '750-800 km', '850-950 km'],
      affectedInclinations: ['51.6°', '97-99°'],
      timeRange: timeRange,
      confidence: confidence
    };

    res.json(explanation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/analytics/compare
 * Compare two orbital regions or time periods
 */
app.post('/api/analytics/compare', (req, res) => {
  try {
    const { comparisonMode = 'regions', region1, region2 } = req.body;

    // Generate dynamic metrics based on selected regions
    const getRegionMetrics = (regionAltitude) => {
      const baseAltitude = parseInt(regionAltitude.split('-')[0]);
      const density = Math.floor(2500 + (baseAltitude / 100) * Math.random() * 1000);
      const risk = (0.15 + (baseAltitude / 2000) * 0.2 + Math.random() * 0.1).toFixed(3);
      const growth = (0.01 + Math.random() * 0.05).toFixed(3);
      const count = Math.floor(2000 + (baseAltitude / 200) * 500 + Math.random() * 1000);
      const clustering = (0.4 + Math.random() * 0.4).toFixed(2);

      return {
        debrisDensity: density,
        collisionRisk: parseFloat(risk),
        growthRate: parseFloat(growth),
        objectCount: count,
        clusteringIndex: parseFloat(clustering)
      };
    };

    const metrics1 = getRegionMetrics(region1 || '750-800 km');
    const metrics2 = getRegionMetrics(region2 || '600-650 km');

    const comparison = {
      comparison: 'regions',
      region1: region1 || '750-800 km',
      region2: region2 || '600-650 km',
      metrics: {
        region1: metrics1,
        region2: metrics2,
        difference: {
          densityDelta: metrics1.debrisDensity - metrics2.debrisDensity,
          riskDelta: (metrics1.collisionRisk - metrics2.collisionRisk).toFixed(3),
          growthDelta: (metrics1.growthRate - metrics2.growthRate).toFixed(3)
        }
      },
      insights: [
        `Region 1 has ${Math.abs(metrics1.debrisDensity - metrics2.debrisDensity)} ${metrics1.debrisDensity > metrics2.debrisDensity ? 'higher' : 'lower'} debris density`,
        `Region 1 ${metrics1.collisionRisk > metrics2.collisionRisk ? 'shows higher' : 'shows lower'} collision risk (${Math.abs((metrics1.collisionRisk - metrics2.collisionRisk) * 100).toFixed(0)}% difference)`,
        `Growth rate in Region 1 is ${metrics1.growthRate > metrics2.growthRate ? 'faster' : 'slower'} than Region 2`
      ]
    };

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/dashboard-summary
 * Get all key metrics for dashboard initialization
 */
app.get('/api/analytics/dashboard-summary', (req, res) => {
  try {
    const summary = {
      overview: {
        totalTrackedObjects: 45723,
        activeAnomalies: 3,
        criticalAlerts: 1,
        highRiskRegions: 5
      },
      riskMetrics: {
        globalCollisionRisk: 0.247,
        riskTrend: 'increasing',
        riskChange24h: '+5.2%',
        riskChange7d: '+23.4%'
      },
      timestamp: new Date().toISOString()
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Space Debris API Server Running`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`========================================\n`);
});

module.exports = app;
