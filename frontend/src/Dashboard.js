import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';
import Header from './components/Header';
import RiskEvolutionPanel from './components/RiskEvolutionPanel';
import AnomalyDetectionPanel from './components/AnomalyDetectionPanel';
import ForecastingPanel from './components/ForecastingPanel';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import DecisionSupportPanel from './components/DecisionSupportPanel';
import api from './utils/api';
import DebrisGlobe from './components/DebrisGlobe';
import LiveTicker from './components/LiveTicker';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('30');
  const [selectedAltitudeRange, setSelectedAltitudeRange] = useState({ min: 300, max: 2000 });

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedTimeWindow]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/analytics/dashboard-summary');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="space-background"></div>

      <Header
        data={dashboardData}
        onRefresh={fetchDashboardData}
      />

      {loading && <div className="loading-overlay">Loading Dashboard...</div>}
      {error && <div className="error-banner">{error}</div>}

      <LiveTicker />

      <div className="dashboard-controls">
        <div className="control-group">
          <label>Time Window (days):</label>
          <select
            value={selectedTimeWindow}
            onChange={(e) => setSelectedTimeWindow(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 180 days</option>
          </select>
        </div>
        <div className="control-group">
          <label>Altitude Range (km):</label>
          <input
            type="range"
            min="200"
            max="2000"
            value={selectedAltitudeRange.min}
            onChange={(e) => setSelectedAltitudeRange({ ...selectedAltitudeRange, min: parseInt(e.target.value) })}
          />
          <span>{selectedAltitudeRange.min} - {selectedAltitudeRange.max}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <DebrisGlobe />
        <RiskEvolutionPanel
          timeWindow={selectedTimeWindow}
          altitudeRange={selectedAltitudeRange}
        />
        <AnomalyDetectionPanel />
        <ForecastingPanel />
        <ExplainabilityPanel />
        <DecisionSupportPanel />
      </div>

      <footer className="dashboard-footer">
        <p>⚠️ Analytics-only platform. No satellite control or collision avoidance recommendations.</p>
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

export default Dashboard;
