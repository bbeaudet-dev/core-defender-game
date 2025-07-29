// API Configuration
export const API_CONFIG = {
  // Development (local)
  development: {baseURL: 'https://core-access-api.onrender.com'},
  production: {baseURL: 'https://core-access-api.onrender.com'},
};

// Get the current environment - always use production for now since backend is on Render
const isProduction = true; // Force production mode since backend is on Render

// Export the current config
export const currentConfig = isProduction ? API_CONFIG.production : API_CONFIG.development;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${currentConfig.baseURL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  health: '/health',
  signin: '/api/auth/signin',
  signup: '/api/auth/signup',
} as const;

// Default export to satisfy Expo Router
export default API_ENDPOINTS;

// Game configuration constants
export const GAME_CONFIG = {
  ALARM_DURATION: 2000, // 2 seconds (reduced from 3 seconds)
  VIDEO_DURATION: 7733, // 7.733 seconds (7 seconds + 22 frames at 30fps)
  REBOOT_DURATION: 5000, // 5 seconds (5 steps × 800ms + 1000ms final delay)
  BATTERY_UNLOCK_THRESHOLD: 0.5, // 50%
} as const; 