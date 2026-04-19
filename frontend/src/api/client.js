import axios from 'axios';

// Uses VITE_API_URL from environment variables for production, otherwise defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadData = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/upload-data', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const processData = async () => {
  return apiClient.post('/process-data');
};

export const getPredictions = async () => {
  return apiClient.get('/predict-growth');
};

export const getHotspots = async () => {
  return apiClient.get('/get-hotspots');
};
