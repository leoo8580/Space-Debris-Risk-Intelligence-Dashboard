import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/AnomalyDetectionPanel.css';

function AnomalyDetectionPanel() {
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sensitivityLevel, setSensitivityLevel] = useState('medium');

  useEffect(() => {
    fetchAnomalies();
  }, [sensitivityLevel]);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/analytics/anomalies', {
        params: { sensitivityLevel }
      });
      setAnomalies(response.data);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ff0033';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff9f';
      default: return '#888';
    }
  };

  return (
    <div className="panel anomaly-panel">
      <div className="panel-header">
        <h2>⚠️ Anomaly & Growth Alerts</h2>
        <button onClick={fetchAnomalies} className="refresh-btn">↻</button>
      </div>

      <div className="sensitivity-control">
        <label>Sensitivity:</label>
        <select value={sensitivityLevel} onChange={(e) => setSensitivityLevel(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading && <p className="loading">Loading anomalies...</p>}

      {anomalies && (
        <div className="panel-content">
          <div className="alert-summary">
            <div className="alert-count critical">
              <span className="count">{anomalies.alerts.length}</span>
              <span className="label">Critical Alerts</span>
            </div>
            <div className="alert-count warning">
              <span className="count">{anomalies.anomalyCount}</span>
              <span className="label">Total Anomalies</span>
            </div>
          </div>

          <div className="anomaly-list">
            {anomalies.anomalies.map((anom) => (
              <div 
                key={anom.id} 
                className={`anomaly-card severity-${anom.severity}`}
                style={{ borderLeft: `4px solid ${getSeverityColor(anom.severity)}` }}
              >
                <div className="anomaly-header">
                  <span className="anomaly-type">{anom.type.replace(/_/g, ' ')}</span>
                  <span 
                    className="severity-badge"
                    style={{ background: getSeverityColor(anom.severity) }}
                  >
                    {anom.severity}
                  </span>
                </div>
                
                <p className="anomaly-description">{anom.description}</p>
                
                <div className="anomaly-details">
                  <div className="detail">
                    <span className="detail-label">Altitude:</span>
                    <span className="detail-value">{anom.altitude}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Score:</span>
                    <span className="detail-value">{(anom.anomalyScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Objects:</span>
                    <span className="detail-value">{anom.affectedObjects}</span>
                  </div>
                </div>

                <div className="anomaly-recommendation">
                  <strong>💡 Recommendation:</strong> {anom.recommendation}
                </div>

                <div className="anomaly-timestamp">
                  Updated: {new Date(anom.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnomalyDetectionPanel;
