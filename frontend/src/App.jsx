import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { uploadData, processData, getPredictions, getHotspots } from './api/client';
import './styles/app.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load existing predictions on mount
  useEffect(() => {
    loadPredictions();
    loadHotspots();
  }, []);

  const loadPredictions = async () => {
    try {
      const res = await getPredictions();
      setPredictions(res.data);
    } catch (error) {
      console.log('No existing predictions found.');
    }
  };

  const loadHotspots = async () => {
    try {
      const res = await getHotspots();
      setHotspots(res.data.hotspots);
    } catch (error) {
      console.log('No hotspots found.');
    }
  };

  const handleUpload = async (file) => {
    setStatus('Uploading data...');
    try {
      const res = await uploadData(file);
      setStatus(res.data.message);
      // Clear existing to avoid confusion
      setPredictions([]);
      setHotspots([]);
    } catch (error) {
      setStatus(`Upload failed: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleProcess = async () => {
    setStatus('Processing data and engineering features...');
    try {
      const res = await processData();
      setStatus(res.data.message);
    } catch (error) {
      setStatus(`Processing failed: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handlePredict = async () => {
    setStatus('Fetching predictions...');
    try {
      await loadPredictions();
      await loadHotspots();
      setStatus('Predictions loaded successfully!');
    } catch (error) {
      setStatus(`Prediction failed: ${error.message}`);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="app-container">
      <Sidebar 
        onUpload={handleUpload}
        onProcess={handleProcess}
        onPredict={handlePredict}
        hotspots={hotspots}
        onLocationSelect={handleLocationSelect}
        status={status}
      />
      <MapView 
        predictions={predictions}
        selectedLocation={selectedLocation}
      />
    </div>
  );
}

export default App;
