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
  // Alarm and video buffering duration (in milliseconds)
  ALARM_DURATION: 5000, // 5 seconds
  
  // Video playback duration (in milliseconds)
  VIDEO_DURATION: 7500, // 7.5 seconds (reduced from 8 to eliminate gap)
  
  // Reboot sequence duration (in milliseconds)
  REBOOT_DURATION: 5000, // 5 seconds (5 steps × 800ms + 1000ms final delay)
  
  // Battery threshold for puzzle completion (0.0 to 1.0)
  BATTERY_UNLOCK_THRESHOLD: 0.5, // 50%
} as const; 