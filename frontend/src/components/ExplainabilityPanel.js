import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import '../styles/ExplainabilityPanel.css';

function ExplainabilityPanel() {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchExplanation = useCallback(async () => {
    try {
      setLoading(true);
      // Map time range format to backend parameter
      const backendTimeRange = timeRange === '1d' ? '1d' : timeRange === '7d' ? '7d' : '30d';
      const response = await api.get('/api/analytics/explainability', {
        params: { timeRange: backendTimeRange }
      });
      setExplanation(response.data);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      // Set mock data on error to ensure UI updates
      setExplanation({
        summary: 'Unable to load explanation data',
        keyFactors: [],
        affectedAltitudes: [],
        affectedInclinations: [],
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchExplanation();
  }, [fetchExplanation]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#ff0033';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff9f';
      default: return '#888';
    }
  };

  return (
    <div className="panel explainability-panel">
      <div className="panel-header">
        <h2>🧠 Why Did Risk Increase?</h2>
        <button onClick={fetchExplanation} className="refresh-btn">↻</button>
      </div>

      <div className="explanation-controls">
        <label>Time Range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="1d">Last 1 day</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {loading && <p className="loading">Analyzing risk factors...</p>}

      {explanation && (
        <div className="panel-content">
          <div className="explanation-summary">
            <p className="summary-text">{explanation.summary}</p>
            <div className="confidence-badge">Confidence: {(explanation.confidence * 100).toFixed(0)}%</div>
          </div>

          <div className="factors-section">
            <h3>Contributing Factors</h3>
            <div className="factors-list">
              {explanation.keyFactors.map((factor, idx) => (
                <div key={idx} className="factor-item">
                  <div className="factor-header">
                    <span className="factor-name">{factor.factor}</span>
                    <span
                      className="factor-impact"
                      style={{ background: getImpactColor(factor.impact) }}
                    >
                      {factor.impact}
                    </span>
                  </div>

                  <p className="factor-description">{factor.description}</p>

                  <div className="contribution-bar">
                    <div
                      className="contribution-fill"
                      style={{ width: `${factor.contribution * 100}%` }}
                    ></div>
                  </div>
                  <span className="contribution-percent">
                    Contribution: {(factor.contribution * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="affected-regions">
            <div className="region-group">
              <h4>🔴 Affected Altitudes</h4>
              <div className="tag-list">
                {explanation.affectedAltitudes.map((alt, idx) => (
                  <span key={idx} className="tag altitude-tag">{alt}</span>
                ))}
              </div>
            </div>

            <div className="region-group">
              <h4>📍 Affected Inclinations</h4>
              <div className="tag-list">
                {explanation.affectedInclinations.map((inc, idx) => (
                  <span key={idx} className="tag inclination-tag">{inc}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExplainabilityPanel;
