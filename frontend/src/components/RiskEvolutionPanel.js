import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import '../styles/RiskEvolutionPanel.css';

function RiskEvolutionPanel({ timeWindow, altitudeRange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchRiskEvolution();
  }, [timeWindow, altitudeRange]);

  const fetchRiskEvolution = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/analytics/risk-evolution', {
        params: {
          timeWindow: timeWindow,
          altitudeMin: altitudeRange.min,
          altitudeMax: altitudeRange.max
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching risk evolution:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel risk-evolution-panel">
      <div className="panel-header">
        <h2>📈 Risk Evolution Timeline</h2>
        <button onClick={fetchRiskEvolution} className="refresh-btn">↻</button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {data && (
        <div className="panel-content">
          <div className="risk-summary">
            <div className="metric">
              <span className="metric-label">Average Risk</span>
              <span className="metric-value">{data.summary.avgRisk}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Peak Risk</span>
              <span className="metric-value">{data.summary.maxRisk}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Trend</span>
              <span className="metric-value trend">{data.summary.trend}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.riskEvolution}>
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
                labelStyle={{ color: '#00ff9f' }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="collisionRisk" 
                stroke="#ff00ff" 
                dot={false}
                strokeWidth={2}
                name="Collision Risk"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="debrisDensity" 
                stroke="#00ff9f" 
                dot={false}
                strokeWidth={2}
                name="Debris Density"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="chart-info">
            <p>Time window: {timeWindow} days | Altitude: {altitudeRange.min}-{altitudeRange.max} km</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskEvolutionPanel;
