// api-client.js - Unified API client with error handling and caching
class UnifiedApiClient {
constructor(config) {
this.config = config;
this.cache = new Map();
this.requestTimestamps = new Map();
this.rateLimiters = new Map();
this.initializeRateLimiters();
}
initializeRateLimiters() {
Object.keys(this.config.apis).forEach(service => {
this.rateLimiters.set(service, {
requests: [],
limit: this.config.apis[service].rateLimit.requests,
period: this.config.apis[service].rateLimit.period
});
});
}
// Comment: Cebtralized API request method. Built in error handling. Caches successful responses and enforces rate limits. Returns fallback data on failure.
async makeRequest(service, endpoint, params = {}, options = {}) {
try {
// Check rate limiting
if (!this.checkRateLimit(service)) {
throw new Error('Rate limit exceeded for ' + service + '. Please wait.');
}
// Check cache
const cacheKey = this.getCacheKey(service, endpoint, params);
// AI change: optional-cache-bypass
// AI Comment: Allows selective cache bypass for manual joke refresh while preserving normal caching behavior elsewhere.
// Comment: lets the "New Joke" button bypass the cache to fetch and populate new jokes. Cached data still used for weather and other requests.
if (!options.forceRefresh && this.isValidCache(cacheKey)) {
console.log('Returning cached data for', service, endpoint);
return this.cache.get(cacheKey).data;
}
// Build request
const requestConfig = this.buildRequest(service, endpoint, params, options);
// Make request with timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), this.config.apis[service].timeout);
const response = await fetch(requestConfig.url, {
...requestConfig.options,
signal: controller.signal
});
clearTimeout(timeoutId);
if (!response.ok) {
throw new Error(service + ' API error: ' + response.status + ' - ' + response.statusText);
}
const data = await response.json();
// AI change: normalize-success-responses
// AI Comment: Ensures successful API responses are explicitly marked non-fallback so weather UI does not show fallback error text for valid data.
const normalizedData = this.normalizeResponse(service, data);
// Cache successful response
this.cacheResponse(cacheKey, normalizedData);
// Update rate limiting
this.updateRateLimit(service);
return normalizedData;
} catch (error) {
console.error('API request failed:', error);
return this.handleApiError(service, endpoint, error);
}
}
// Comment: Builds the params based on the service requirements. 
buildRequest(service, endpoint, params, options) {
const apiConfig = this.config.apis[service];
let url = apiConfig.baseUrl + endpoint;
// AI Comment: Removed default Content-Type on GET requests to avoid triggering CORS preflight (OPTIONS), which caused 405 failures for OpenWeather.
//Comment: Had an error where my OpenWeather API calls were failing with 405 Method Not Allowed due to CORS preflight checks triggered by the presence of a Content-Type header on GET requests. I checked the DevTools myself and then asked for assitance for the official coding changes. 
// AI Comment: Keep weather requests as simple GET (no Content-Type) while preserving JSON Content-Type for other APIs.
const headers = service === 'openWeather' ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers };
switch (service) {
case 'openWeather':
const weatherParams = new URLSearchParams({
...params,
appid: apiConfig.key,
units: 'imperial'
});
url += '?' + weatherParams.toString();
break;
case 'rapidApi':
// AI Comment: Explicit Accept header helps RapidAPI return JSON consistently for refresh requests.
headers['Accept'] = 'application/json';
headers['X-RapidAPI-Key'] = apiConfig.key;
headers['X-RapidAPI-Host'] = apiConfig.host;
break;
case 'jokeApi':
if (Object.keys(params).length > 0) {
url += '?' + new URLSearchParams(params).toString();
}
break;
}
return {
url: url,
options: {
method: 'GET',
headers: headers
}
};
}
// Comment: Prevents API calls that exceed the configured rate limits.
checkRateLimit(service) {
const limiter = this.rateLimiters.get(service);
const now = Date.now();
// Remove old requests outside the time window
limiter.requests = limiter.requests.filter(time =>
now - time < limiter.period
);
return limiter.requests.length < limiter.limit;
}
updateRateLimit(service) {
this.rateLimiters.get(service).requests.push(Date.now());
}
getCacheKey(service, endpoint, params) {
return service + ':' + endpoint + ':' + JSON.stringify(params);
}
isValidCache(cacheKey) {
if (!this.cache.has(cacheKey)) return false;
const cached = this.cache.get(cacheKey);
return Date.now() - cached.timestamp < this.config.app.cacheExpiry;
}
cacheResponse(cacheKey, data) {
this.cache.set(cacheKey, {
data: data,
timestamp: Date.now()
});
}
// AI change: response-normalizer
// AI Comment: Adds minimal response normalization to separate successful weather payloads from fallback/error payloads.
// Commment:  Allows the dashboard to display valid weather data without showing fallback error messages, while still providing consistent error handling and fallback data for all APIs.
normalizeResponse(service, data) {
if (service === 'openWeather') {
return Object.assign({}, data, { error: false, isFallback: false, message: '' });
}
return data;
}
handleApiError(service, endpoint, error) {
console.error('API Error Details:', {
service: service,
endpoint: endpoint,
error: error.message,
timestamp: new Date().toISOString()
});
// Return fallback data based on service
switch (service) {
case 'openWeather':
return {
name: 'Kahului',
main: { temp: 78, humidity: 65 },
weather: [{ description: 'partly cloudy', icon: '02d' }],
wind: { speed: 12 },
error: true,
isFallback: true,
message: 'Weather data temporarily unavailable'
};
case 'rapidApi':
return {
value: 'Chuck Norris doesn\'t need the internet. The internet needs Chuck Norris.',
error: true,
message: 'Chuck Norris jokes temporarily unavailable'
};
case 'jokeApi':
return {
joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
error: true,
message: 'Programming jokes temporarily unavailable'
};
default:
throw error;
}
}
// Convenience methods for specific APIs
async getWeather(city = 'Kahului') {
// AI change: flexible-city-query
// AI Comment: Supports both simple city names and already-qualified city strings so settings-based city changes resolve more reliably.
const queryCity = String(city || 'Kahului').includes(',') ? String(city || 'Kahului') : String(city || 'Kahului') + ',US';
return this.makeRequest('openWeather', '/weather', { q: queryCity });
}
// AI change: joke-method-force-refresh-support
// AI Comment: Adds a forceRefresh parameter path for joke endpoints so New Jokes can fetch fresh content on demand.
async getChuckNorrisJoke(forceRefresh = false) {
return this.makeRequest('rapidApi', '/jokes/random', {}, { forceRefresh: forceRefresh });
}
async getProgrammingJoke(forceRefresh = false) {
return this.makeRequest('jokeApi', '/joke/Programming', { type: 'single' }, { forceRefresh: forceRefresh });
}
async getAllJokes(forceRefresh = false) {
try {
const [chuck, programming] = await Promise.allSettled([
this.getChuckNorrisJoke(forceRefresh),
this.getProgrammingJoke(forceRefresh)
]);
return {
chuck: chuck.status === 'fulfilled' ? chuck.value : null,
programming: programming.status === 'fulfilled' ? programming.value : null
};
} catch (error) {
console.error('Failed to fetch jokes:', error);
return { chuck: null, programming: null };
}
}
}
