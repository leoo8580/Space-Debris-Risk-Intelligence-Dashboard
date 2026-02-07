import React from 'react';
import '../styles/LiveTicker.css';

const LiveTicker = () => {
    const events = [
        "⚠️ CRITICAL: Debris fragmentation detected in LEO (ID: 48291)",
        "ℹ️ ISS conjunction warning: High probability event in 48h",
        "🚀 Starlink-3456 orbit raising maneuver completed",
        "📡 Deep Space Network: Signal acquired from Voyager 1",
        "☄️ Meteor shower 'Perseids' peaking tonight - increasing sensor noise",
        "🛑 Space Force alert: Anti-satellite test simulation active",
    ];

    return (
        <div className="live-ticker-container">
            <div className="ticker-label">LIVE INTELLIGENCE</div>
            <div className="ticker-track">
                <div className="ticker-content">
                    {events.map((event, index) => (
                        <span key={index} className="ticker-item">
                            {event} <span className="separator">///</span>
                        </span>
                    ))}
                    {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                    {/* Duplicate for seamless loop */}
                    {events.map((event, index) => (
                        <span key={`dup-${index}`} className="ticker-item">
                            {event} <span className="separator">///</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveTicker;
