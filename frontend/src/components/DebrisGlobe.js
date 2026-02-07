import React, { useEffect, useRef } from 'react';
import '../styles/DebrisGlobe.css';

const DebrisGlobe = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Globe parameters
    const globeRadius = 150;
    const dots = [];
    const particles = [];
    const numDots = 400; // Points on the sphere
    const numParticles = 150; // Debris
    
    // Initialize rotating globe dots
    for (let i = 0; i < numDots; i++) {
      const theta = Math.random() * 2 * Math.PI; // Longitude
      const phi = Math.acos((Math.random() * 2) - 1); // Latitude
      dots.push({ theta, phi });
    }

    // Initialize debris particles
    for (let i = 0; i < numParticles; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        const altitude = globeRadius + 20 + Math.random() * 80;
        const speed = 0.005 + Math.random() * 0.015;
        particles.push({ theta, phi, altitude, speed, color: Math.random() > 0.8 ? '#ff0055' : '#00f3ff' });
    }

    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      rotation += 0.002;

      // Draw Globe Wireframe (dots)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      dots.forEach(dot => {
        let x = globeRadius * Math.sin(dot.phi) * Math.cos(dot.theta + rotation);
        let z = globeRadius * Math.sin(dot.phi) * Math.sin(dot.theta + rotation);
        let y = globeRadius * Math.cos(dot.phi);

        // Simple perspective projection
        const scale = 300 / (300 - z);
        const x2d = x * scale + centerX;
        const y2d = y * scale + centerY;
        const size = Math.max(0.5, 1.5 * scale);

        if (z < 100) { // Only draw front-ish dots
            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      // Draw Connecting Lines (Latitude/Longitude hint)
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Debris Particles
      particles.forEach(p => {
        p.theta += p.speed;
        
        let x = p.altitude * Math.sin(p.phi) * Math.cos(p.theta);
        let z = p.altitude * Math.sin(p.phi) * Math.sin(p.theta);
        let y = p.altitude * Math.cos(p.phi) * Math.sin(rotation * 0.5); // Add some wobble

        // Rotate whole system
        const rotX = x * Math.cos(rotation) - z * Math.sin(rotation);
        const rotZ = x * Math.sin(rotation) + z * Math.cos(rotation);
        
        const scale = 300 / (300 - rotZ);
        const x2d = rotX * scale + centerX;
        const y2d = y * scale + centerY;
        
        if (rotZ < 100) {
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            
            const size = Math.max(1, 4 * scale);
            ctx.beginPath();
            ctx.arc(x2d, y2d, size * (p.color === '#ff0055' ? 1.5 : 1), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="panel debris-globe-container" ref={containerRef}>
      <div className="panel-header" style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 10 }}>
        <h2>Real-time Debris Visualizer</h2>
        <div className="refresh-btn">⟳</div>
      </div>
      
      <div className="globe-canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>

      <div className="scanning-line"></div>

      <div className="globe-overlay">
        <div className="globe-stat">
          <span className="label">Active Objects</span>
          <span className="value">24,931</span>
        </div>
        <div className="globe-stat">
          <span className="label">Critical Alerts</span>
          <span className="value" style={{ color: '#ff0055' }}>3</span>
        </div>
      </div>
    </div>
  );
};

export default DebrisGlobe;
