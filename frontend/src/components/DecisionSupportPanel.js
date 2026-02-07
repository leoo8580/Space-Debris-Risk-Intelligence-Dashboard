import React, { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import '../styles/DecisionSupportPanel.css';

function DecisionSupportPanel() {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState('regions');
  const [region1, setRegion1] = useState('750-800 km');
  const [region2, setRegion2] = useState('600-650 km');

  const performComparison = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/analytics/compare', {
        comparisonMode,
        region1,
        region2
      });
      setComparison(response.data);
    } catch (error) {
      console.error('Error performing comparison:', error);
    } finally {
      setLoading(false);
    }
  }, [comparisonMode, region1, region2]);

  useEffect(() => {
    performComparison();
  }, [performComparison]);

  const regionOptions = [
    '300-400 km',
    '400-500 km',
    '500-600 km',
    '600-650 km',
    '650-700 km',
    '750-800 km',
    '800-850 km',
    '850-950 km',
    '950-1100 km',
    '1100-1300 km'
  ];

  const getComparisonColor = (value1, value2) => {
    if (value1 > value2) return 'higher';
    if (value1 < value2) return 'lower';
    return 'equal';
  };

  return (
    <div className="panel decision-support-panel">
      <div className="panel-header">
        <h2>🎯 Decision Support & Comparison</h2>
        <button onClick={performComparison} className="refresh-btn">↻</button>
      </div>

      <div className="comparison-setup">
        <div className="control-group">
          <label>Comparison Type:</label>
          <select value={comparisonMode} onChange={(e) => setComparisonMode(e.target.value)}>
            <option value="regions">Region Comparison</option>
            <option value="periods">Time Period Comparison</option>
          </select>
        </div>

        <div className="region-selection">
          <div className="region-select">
            <label>Region 1 (Left):</label>
            <select value={region1} onChange={(e) => setRegion1(e.target.value)}>
              {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="region-select">
            <label>Region 2 (Right):</label>
            <select value={region2} onChange={(e) => setRegion2(e.target.value)}>
              {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <button onClick={performComparison} className="compare-btn">Compare Now</button>
      </div>

      {loading && <p className="loading">Comparing regions...</p>}

      {comparison && (
        <div className="panel-content">
          <div className="comparison-header">
            <h3>{comparison.region1} vs {comparison.region2}</h3>
          </div>

          <div className="comparison-table">
            <div className="metric-row">
              <div className="metric-name">Debris Density</div>
              <div className={`metric-value value1 ${getComparisonColor(comparison.metrics.region1.debrisDensity, comparison.metrics.region2.debrisDensity)}`}>
                {comparison.metrics.region1.debrisDensity}
              </div>
              <div className="metric-divider">vs</div>
              <div className={`metric-value value2 ${getComparisonColor(comparison.metrics.region2.debrisDensity, comparison.metrics.region1.debrisDensity)}`}>
                {comparison.metrics.region2.debrisDensity}
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-name">Collision Risk</div>
              <div className={`metric-value value1 ${getComparisonColor(comparison.metrics.region1.collisionRisk, comparison.metrics.region2.collisionRisk)}`}>
                {comparison.metrics.region1.collisionRisk}
              </div>
              <div className="metric-divider">vs</div>
              <div className={`metric-value value2 ${getComparisonColor(comparison.metrics.region2.collisionRisk, comparison.metrics.region1.collisionRisk)}`}>
                {comparison.metrics.region2.collisionRisk}
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-name">Growth Rate</div>
              <div className={`metric-value value1 ${getComparisonColor(comparison.metrics.region1.growthRate, comparison.metrics.region2.growthRate)}`}>
                {(comparison.metrics.region1.growthRate * 100).toFixed(2)}%
              </div>
              <div className="metric-divider">vs</div>
              <div className={`metric-value value2 ${getComparisonColor(comparison.metrics.region2.growthRate, comparison.metrics.region1.growthRate)}`}>
                {(comparison.metrics.region2.growthRate * 100).toFixed(2)}%
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-name">Object Count</div>
              <div className={`metric-value value1 ${getComparisonColor(comparison.metrics.region1.objectCount, comparison.metrics.region2.objectCount)}`}>
                {comparison.metrics.region1.objectCount}
              </div>
              <div className="metric-divider">vs</div>
              <div className={`metric-value value2 ${getComparisonColor(comparison.metrics.region2.objectCount, comparison.metrics.region1.objectCount)}`}>
                {comparison.metrics.region2.objectCount}
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-name">Clustering Index</div>
              <div className={`metric-value value1 ${getComparisonColor(comparison.metrics.region1.clusteringIndex, comparison.metrics.region2.clusteringIndex)}`}>
                {comparison.metrics.region1.clusteringIndex}
              </div>
              <div className="metric-divider">vs</div>
              <div className={`metric-value value2 ${getComparisonColor(comparison.metrics.region2.clusteringIndex, comparison.metrics.region1.clusteringIndex)}`}>
                {comparison.metrics.region2.clusteringIndex}
              </div>
            </div>
          </div>

          <div className="insights-section">
            <h4>📊 Key Insights</h4>
            <ul className="insights-list">
              {comparison.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DecisionSupportPanel;
