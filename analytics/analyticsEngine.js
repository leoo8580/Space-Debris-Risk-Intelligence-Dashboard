/**
 * Analytics Engine - Core Algorithms
 * Handles all risk calculations, anomaly detection, and forecasting
 */

class DebrisAnalyticsEngine {
  /**
   * Calculate collision risk based on debris density and orbital parameters
   */
  static calculateCollisionRisk(debrisDensity, objectCount, clusteringIndex) {
    const densityFactor = Math.log(debrisDensity / 1000) * 0.3;
    const countFactor = (objectCount / 50000) * 0.4;
    const clusterFactor = clusteringIndex * 0.3;
    
    return Math.min(1, Math.max(0, densityFactor + countFactor + clusterFactor));
  }

  /**
   * Detect anomalies in debris density using statistical methods
   */
  static detectAnomalies(timeSeries, sensitivity = 'medium') {
    const threshold = sensitivity === 'high' ? 1.5 : sensitivity === 'low' ? 3 : 2;
    
    const mean = timeSeries.reduce((a, b) => a + b, 0) / timeSeries.length;
    const variance = timeSeries.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / timeSeries.length;
    const stdDev = Math.sqrt(variance);
    
    const anomalies = [];
    for (let i = 1; i < timeSeries.length; i++) {
      const zScore = Math.abs((timeSeries[i] - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push({
          index: i,
          value: timeSeries[i],
          zScore: zScore,
          anomalyScore: Math.min(1, zScore / (threshold * 2))
        });
      }
    }
    
    return anomalies;
  }

  /**
   * Forecast debris density using exponential smoothing
   */
  static forecastDebrisDensity(historicalData, forecastPeriods, alpha = 0.3) {
    if (historicalData.length === 0) return [];
    
    const forecast = [];
    let currentValue = historicalData[historicalData.length - 1];
    
    for (let i = 0; i < forecastPeriods; i++) {
      const nextValue = alpha * currentValue + (1 - alpha) * historicalData[historicalData.length - 1];
      forecast.push(nextValue);
      currentValue = nextValue;
    }
    
    return forecast;
  }

  /**
   * Calculate factor contributions to risk
   */
  static explainRiskFactors(metrics) {
    const factors = [
      { name: 'Debris Growth', weight: metrics.growthRate / 0.1 },
      { name: 'Object Count', weight: metrics.objectCount / 50000 },
      { name: 'Clustering', weight: metrics.clusteringIndex },
      { name: 'Orbital Decay', weight: 0.05 },
      { name: 'Inclination Impact', weight: metrics.inclinationFactor || 0.2 }
    ];
    
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    return factors.map(f => ({
      ...f,
      contribution: f.weight / totalWeight
    }));
  }

  /**
   * Trend analysis for risk evolution
   */
  static analyzeTrend(timeSeries) {
    if (timeSeries.length < 2) return 'insufficient_data';
    
    const recent = timeSeries.slice(-7);
    const older = timeSeries.slice(-14, -7);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (changePercent > 10) return 'increasing';
    if (changePercent < -10) return 'decreasing';
    return 'stable';
  }

  /**
   * Identify high-risk orbital regions
   */
  static identifyHotspots(debrisMap, threshold = 0.7) {
    const hotspots = [];
    
    for (const [region, data] of Object.entries(debrisMap)) {
      const riskScore = this.calculateCollisionRisk(
        data.density,
        data.objectCount,
        data.clustering
      );
      
      if (riskScore > threshold) {
        hotspots.push({
          region,
          riskScore,
          density: data.density,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return hotspots.sort((a, b) => b.riskScore - a.riskScore);
  }
}

module.exports = DebrisAnalyticsEngine;
