import React, { useState } from 'react';

const Sidebar = ({ 
  onUpload, 
  onProcess, 
  onPredict, 
  hotspots, 
  onLocationSelect,
  status 
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <h1 className="gradient-text">Urban Growth</h1>
        <p>Predictive Real Estate Analytics</p>
      </div>

      <div className="upload-section">
        <h3>1. Data Ingestion</h3>
        <div className="file-input-wrapper" style={{ marginBottom: '12px' }}>
          <div className="file-input-btn">
            {file ? file.name : 'Choose CSV File'}
          </div>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleUpload}
          disabled={!file}
        >
          Upload Data
        </button>
      </div>

      <div className="action-section">
        <h3>2. Analytics Engine</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onProcess}>
            Process & Engineer Features
          </button>
          <button className="btn btn-primary" onClick={onPredict}>
            Generate Predictions
          </button>
        </div>
      </div>

      {status && (
        <div className="status-message">
          {status}
        </div>
      )}

      {hotspots && hotspots.length > 0 && (
        <div className="hotspot-section">
          <h3>Top Investment Hotspots</h3>
          <div className="hotspot-list">
            {hotspots.map((spot, idx) => (
              <div 
                key={idx} 
                className="hotspot-card"
                onClick={() => onLocationSelect(spot)}
              >
                <div className="hotspot-header">
                  <span className="hotspot-name">{spot.location}</span>
                  <span className="hotspot-score">{spot.growth_score.toFixed(1)}</span>
                </div>
                <div className="hotspot-details">
                  <span>ML Predict: {spot.prediction_ml ? spot.prediction_ml.toFixed(2) : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
