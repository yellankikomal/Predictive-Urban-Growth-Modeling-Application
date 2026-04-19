import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';

// Component to recenter map when hotspots change
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

const MapView = ({ predictions, selectedLocation }) => {
  // Bangalore coordinates as default center
  const defaultCenter = [12.9716, 77.5946];
  const defaultZoom = 11;

  // Determine center based on selected location or default
  const mapCenter = selectedLocation 
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : defaultCenter;
    
  const mapZoom = selectedLocation ? 14 : defaultZoom;

  const getMarkerColor = (score, isHotspot) => {
    if (isHotspot) return '#10b981'; // Emerald for hotspots
    if (score > 5) return '#f59e0b'; // Amber for medium growth
    return '#ef4444'; // Red for low growth
  };

  const getMarkerRadius = (score) => {
    return Math.max(8, score * 1.5);
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Dark theme Map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {predictions.map((loc, idx) => (
          <CircleMarker
            key={idx}
            center={[loc.latitude, loc.longitude]}
            radius={getMarkerRadius(loc.growth_score)}
            pathOptions={{ 
              fillColor: getMarkerColor(loc.growth_score, loc.is_hotspot),
              color: loc.is_hotspot ? '#fff' : 'transparent',
              weight: loc.is_hotspot ? 2 : 0,
              fillOpacity: 0.7
            }}
          >
            <Popup>
              <div className="popup-title">{loc.location}</div>
              <div className="popup-stat">
                <span>Growth Score</span>
                <span>{loc.growth_score.toFixed(2)} / 10</span>
              </div>
              {loc.prediction_ml !== null && (
                <div className="popup-stat">
                  <span>ML Prediction</span>
                  <span>{loc.prediction_ml.toFixed(2)}</span>
                </div>
              )}
              {loc.is_hotspot && (
                <div className="growth-badge">🔥 High Growth Hotspot</div>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
