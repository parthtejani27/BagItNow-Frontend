const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME,
    storageKey: import.meta.env.VITE_STORAGE_KEY,
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true",
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === "true",
    VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    REACT_APP_STRIPE_PUBLISHABLE_KEY: import.meta.env
      .REACT_APP_STRIPE_PUBLISHABLE_KEY,
  },

  // Environment Detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
