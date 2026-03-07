// config.js - Secure configuration management
// AI change: tolerant-key-loading
// AI Comment: Prevents full app crash before the API key modal appears by allowing empty keys during initial boot.
class SecureConfig {
constructor() {
this.config = this.loadConfiguration();
this.validateConfiguration();
}
loadConfiguration() {
// In a real application, these would come from environment variables
// For demo purposes, we'll use a secure client-side approach
return {
apis: {
openWeather: {
key: this.getSecureApiKey('openweather'),
baseUrl: 'https://api.openweathermap.org/data/2.5',
endpoints: {
current: '/weather',
forecast: '/forecast'
},
rateLimit: {
requests: 60,
period: 60000 // 1 minute
},
timeout: 5000
},
rapidApi: {
key: this.getSecureApiKey('rapidapi'),
host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
endpoints: {
random: '/jokes/random',
categories: '/jokes/categories'
},
rateLimit: {
requests: 100,
period: 60000
},
timeout: 3000
},
jokeApi: {
baseUrl: 'https://sv443.net/jokeapi/v2',
endpoints: {
joke: '/joke/Programming',
categories: '/categories'
},
rateLimit: {
requests: 120,
period: 60000
},
timeout: 3000
}
},
app: {
name: 'UH Maui Campus Dashboard',
version: '1.0.0',
defaultCity: 'Kahului',
refreshInterval: 10 * 60 * 1000, // 10 minutes
cacheExpiry: 10 * 60 * 1000, // 10 minutes
maxRetries: 3,
retryDelay: 1000
},
ui: {
animationDuration: 300,
toastDuration: 5000,
modalTimeout: 10000,
loadingDelay: 500
}
};
}
// AI change: nonfatal-key-retrieval
// AI Comment: Keeps configuration load nonfatal so UI can present key setup and fallback behavior.
// Comment: Reads the runtime keys from LocalStorage for the demo.
getSecureApiKey(service) {
// In production, this would retrieve from secure storage
// For development, use localStorage with warning
// AI change: consistent-storage-key-mapping
// AI Comment: Normalizes service names to the exact localStorage key names used by saveApiKeys() so OpenWeather auth does not mismatch and cause 401s.
const storageKey = this.getStorageKeyName(service);
// AI change: trim-stored-api-key
// AI Comment: Removes accidental leading/trailing whitespace from pasted keys that can cause OpenWeather 401 responses.
const key = localStorage.getItem(storageKey);
return key ? key.trim() : '';
}
// AI change: storage-key-helper
// AI Comment: Provides one source of truth for API key localStorage names, including case-variant service aliases.
getStorageKeyName(service) {
const map = {
openweather: 'openweather_api_key',
openWeather: 'openweather_api_key',
rapidapi: 'rapidapi_api_key',
rapidApi: 'rapidapi_api_key'
};
return map[service] || (service + '_api_key');
}
// AI change: nonblocking-validation
// AI Comment: Maintains validation checks while avoiding a hard throw that would prevent dashboard initialization.
validateConfiguration() {
// AI change: validation-uses-mapped-keys
// AI Comment: Ensures validation checks the same exact storage key names used by retrieval and saveApiKeys().
const required = [
this.getStorageKeyName('openweather'),
this.getStorageKeyName('rapidapi')
];
const missing = required.filter(key => !localStorage.getItem(key));
if (missing.length > 0) {
console.warn('Missing required API keys: ' + missing.join(', ') + '. Please configure your API keys in the settings.');
}
}
getApiConfig(service) {
if (!this.config.apis[service]) {
throw new Error('Unknown API service: ' + service);
}
return this.config.apis[service];
}
getAppConfig() {
return this.config.app;
}
getUiConfig() {
return this.config.ui;
}
}
// Initialize configuration
const appConfig = new SecureConfig();
