import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import api from '../utils/api';
import '../styles/ForecastingPanel.css';

function ForecastingPanel() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastDays, setForecastDays] = useState('30');

  useEffect(() => {
    fetchForecast();
  }, [forecastDays]);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/analytics/forecast', {
        params: { forecastDays }
      });
      setForecast(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHotspotIntensityColor = (intensity) => {
    if (intensity > 0.8) return '#ff0033';
    if (intensity > 0.6) return '#ffaa00';
    return '#00ff9f';
  };

  return (
    <div className="panel forecasting-panel">
      <div className="panel-header">
        <h2>🔮 Future Risk Hotspots (Forecast)</h2>
        <button onClick={fetchForecast} className="refresh-btn">↻</button>
      </div>

      <div className="forecast-controls">
        <label>Forecast Horizon:</label>
        <select value={forecastDays} onChange={(e) => setForecastDays(e.target.value)}>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
          <option value="60">60 days</option>
        </select>
      </div>

      {loading && <p className="loading">Loading forecast...</p>}

      {forecast && (
        <div className="panel-content">
          <div className="forecast-header">
            <p className="confidence">Forecast Confidence: <strong>{(forecast.confidence * 100).toFixed(0)}%</strong></p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast.forecast.slice(-forecastDays)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#00ff9f', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#00ff9f', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#ff00ff', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #00ff9f' }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="projectedDensity" 
                stroke="#00ff9f" 
                dot={false}
                strokeWidth={2}
                name="Projected Density"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="projectedRisk" 
                stroke="#ff00ff" 
                dot={false}
                strokeWidth={2}
                name="Projected Risk"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="hotspots-section">
            <h3>🎯 Predicted Hotspots (Next {forecastDays} days)</h3>
            <div className="hotspots-grid">
              {forecast.forecast[Math.floor(forecast.forecast.length / 2)]?.hotspots?.map((spot, idx) => (
                <div 
                  key={idx}
                  className="hotspot-card"
                  style={{ borderLeft: `4px solid ${getHotspotIntensityColor(spot.intensity)}` }}
                >
                  <div className="hotspot-title">
                    <strong>{spot.altitude}</strong>
                  </div>
                  <div className="hotspot-detail">
                    <span>Inclination: {spot.inclination}</span>
                  </div>
                  <div className="hotspot-intensity">
                    <span>Intensity: {(spot.intensity * 100).toFixed(0)}%</span>
                    <div className="intensity-bar">
                      <div 
                        className="intensity-fill"
                        style={{ 
                          width: `${spot.intensity * 100}%`,
                          background: getHotspotIntensityColor(spot.intensity)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForecastingPanel;
