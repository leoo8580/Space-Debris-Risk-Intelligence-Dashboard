import React from 'react';
import '../styles/Header.css';

function Header({ data, onRefresh }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-title">
          <h1>🛰️ Space Debris Risk Intelligence Dashboard</h1>
          <p className="subtitle">Spatio-temporal Risk Evolution | Anomaly Detection | Forecasting | Explainability</p>
        </div>

        <div className="header-stats">
          {data && (
            <>
              <div className="stat-item">
                <span className="stat-label">Global Collision Risk</span>
                <span className="stat-value">{data.riskMetrics?.globalCollisionRisk?.toFixed(3)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">24h Change</span>
                <span className="stat-value trend">{data.riskMetrics?.riskChange24h}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Critical Alerts</span>
                <span className="stat-value alert">{data.overview?.criticalAlerts}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">High-Risk Regions</span>
                <span className="stat-value">{data.overview?.highRiskRegions}</span>
              </div>
            </>
          )}
          <button onClick={onRefresh} className="refresh-main-btn" title="Refresh all data">
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="orbital-animation">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
      </div>
    </header>
  );
}

export default Header;
