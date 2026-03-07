// dashboard.js - Main dashboard controller
// AI change: dashboard-runtime-state
// AI Comment: Adds minimal state tracking needed for settings, export payloads, and latest API data snapshots.
class CampusDashboard {
constructor() {
// AI change: use-resolved-config-object
// AI Comment: Fixes dashboard startup by passing the actual configuration object shape expected by UnifiedApiClient instead of the SecureConfig wrapper instance.
this.config = (appConfig && appConfig.config) ? appConfig.config : appConfig;
this.apiClient = new UnifiedApiClient(this.config);
this.courseCatalog = null;
this.widgets = new Map();
this.refreshTimers = new Map();
this.lastUpdated = new Map();
this.latestWeather = null;
this.latestJokes = null;
// AI change: course-panel-edit-state
// AI Comment: Tracks whether the shared course panel is in add or edit mode so Edit can reuse the integrated fillable panel.
this.editingCourseCode = null;
this.userSettings = this.loadUserSettings();
this.initialize();
}
async initialize() {
try {
this.setupEventListeners();
this.createDashboardLayout();
this.initializeApiKeySetup();
await this.loadInitialData();
this.startAutoRefresh();
this.showWelcomeMessage();
} catch (error) {
this.handleInitializationError(error);
}
}
initializeApiKeySetup() {
// Show API key setup modal if keys are missing
const hasOpenWeather = localStorage.getItem('openweather_api_key');
const hasRapidApi = localStorage.getItem('rapidapi_api_key');
if (!hasOpenWeather || !hasRapidApi) {
this.showApiKeySetupModal();
}
}
async loadInitialData() {
// Show loading state
this.showLoadingState();
try {
// Load course data (from previous assignment)
await this.loadCourseData();
// Load weather data
await this.loadWeatherData();
// Load jokes
await this.loadHumorData();
// Update dashboard statistics
this.updateDashboardStats();
} catch (error) {
console.error('Failed to load initial data:', error);
this.showErrorState('Failed to load dashboard data');
} finally {
this.hideLoadingState();
}
}
// AI change: weather-state-capture
// AI Comment: Stores latest weather response so export can include current dashboard API data.
// Comment: Helps to avoid displaying fallback error messages when valid weather data is present.
async loadWeatherData() {
try {
const weatherData = await this.apiClient.getWeather('Kahului');
// AI change: normalize-weather-success-in-dashboard
// AI Comment: Forces valid weather payloads into non-fallback state so the fallback error message does not render when real data is present.
const normalizedWeatherData = weatherData && weatherData.coord
? Object.assign({}, weatherData, { isFallback: false, error: false, message: '' })
: weatherData;
this.latestWeather = normalizedWeatherData;
this.displayWeatherWidget(normalizedWeatherData);
this.lastUpdated.set('weather', Date.now());
this.updateDashboardStats();
} catch (error) {
console.error('Weather loading failed:', error);
this.displayWeatherError();
}
}
// AI change: humor-state-capture
// AI Comment: Stores latest joke responses for export and keeps dashboard stats fresh.
// AI change: humor-load-force-refresh-support
// AI Comment: Accepts a forceRefresh flag so manual New Jokes requests can bypass cache and update widget content immediately.
async loadHumorData(forceRefresh = false) {
try {
const jokes = await this.apiClient.getAllJokes(forceRefresh);
this.latestJokes = jokes;
this.displayHumorWidget(jokes);
this.lastUpdated.set('humor', Date.now());
this.updateDashboardStats();
} catch (error) {
console.error('Humor loading failed:', error);
this.displayHumorError();
}
}
displayWeatherWidget(data) {
const weatherContainer = document.getElementById('weather-widget');
// AI change: strict-weather-error-flag
// AI Comment: Prevents fallback error messaging from displaying unless the response is explicitly marked as an error.
const isError = data && data.isFallback === true && !data.coord;
weatherContainer.innerHTML =
'<div class="widget-header">' +
'<h3>Campus Weather</h3>' +
'<span class="last-updated">' + this.getTimeAgo('weather') + '</span>' +
'</div>' +
'<div class="weather-content ' + (isError ? 'error-state' : '') + '">' +
'<div class="location">' + data.name + '</div>' +
'<div class="temperature">' + Math.round(data.main.temp) + 'Â°F</div>' +
'<div class="description">' + data.weather[0].description + '</div>' +
'<div class="details">' +
'<span>Humidity: ' + data.main.humidity + '%</span>' +
'<span>Wind: ' + data.wind.speed + ' mph</span>' +
'</div>' +
(isError ? '<div class="error-message">' + data.message + '</div>' : '') +
'</div>';
}
displayHumorWidget(jokes) {
const humorContainer = document.getElementById('humor-widget');
const chuckJoke = jokes.chuck ? (jokes.chuck.value || jokes.chuck.joke) : 'Chuck Norris joke unavailable';
const progJoke = jokes.programming ? (jokes.programming.joke || jokes.programming.setup + ' ' + jokes.programming.delivery) : 'Programming joke unavailable';
humorContainer.innerHTML =
'<div class="widget-header">' +
'<h3>Daily Humor</h3>' +
'<button class="refresh-btn" onclick="dashboard.refreshHumor()">New Jokes</button>' +
'</div>' +
'<div class="humor-content">' +
'<div class="joke-section">' +
'<h4>Chuck Norris Joke</h4>' +
'<p class="joke-text">' + chuckJoke + '</p>' +
'</div>' +
'<div class="joke-section">' +
'<h4>Programming Joke</h4>' +
'<p class="joke-text">' + progJoke + '</p>' +
'</div>' +
'</div>';
}
updateDashboardStats() {
if (!this.courseCatalog) return;
const totalCourses = this.getAllCourses().length;
const totalStudents = this.calculateTotalEnrollment();
const averageCapacity = this.calculateAverageCapacity();
// AI CHANGE: api-status-from-response-health
// AI COMMENT: Uses latest API response health flags instead of only timestamps so status better reflects real connectivity.
const weatherStatus = this.getApiConnectionStatus();
document.getElementById('total-courses').textContent = totalCourses;
document.getElementById('total-students').textContent = totalStudents;
document.getElementById('avg-capacity').textContent = averageCapacity + '%';
document.getElementById('api-status').textContent = weatherStatus;
}
// AI change: configurable-auto-refresh
// AI Comment: Uses user-configured refresh interval and safely resets timers when settings change.
// Comment: Refreshes the weaher data at the user-defined interval. Also updates the "last updated" time every minute without needing to refetch data. Also recreates timers if the user changes the refresh interval in settings.
startAutoRefresh() {
if (this.refreshTimers.has('weather')) clearInterval(this.refreshTimers.get('weather'));
if (this.refreshTimers.has('time')) clearInterval(this.refreshTimers.get('time'));
const refreshMs = Math.max(60000, Number(this.userSettings.weatherRefreshMinutes) * 60000);
// Refresh weather every 10 minutes
this.refreshTimers.set('weather', setInterval(() => {
this.loadWeatherData();
}, refreshMs));
// Update time displays every minute
this.refreshTimers.set('time', setInterval(() => {
this.updateTimeDisplays();
}, 60 * 1000));
}
// AI change: robust-humor-button-state
// AI Comment: Guards against missing refresh button during edge render states to avoid runtime errors.
async refreshHumor() {
const button = document.querySelector('.refresh-btn');
if (!button) {
await this.loadHumorData(true);
return;
}
button.textContent = 'Loading...';
button.disabled = true;
try {
// AI change: force-refresh-on-new-jokes
// AI Comment: Ensures New Jokes button bypasses cached joke responses so the humor widget updates with fresh content.
await this.loadHumorData(true);
} finally {
button.textContent = 'New Jokes';
button.disabled = false;
}
}
showApiKeySetupModal() {
const modal = document.getElementById('apiKeyModal');
modal.style.display = 'block';
}
// AI CHANGE: open-api-key-update-modal
// AI COMMENT: Reuses existing API key modal for manual key updates and prefills fields from localStorage for easier editing.
openApiKeyUpdateModal() {
const modal = document.getElementById('apiKeyModal');
const openWeatherInput = document.getElementById('openWeatherKey');
const rapidApiInput = document.getElementById('rapidApiKey');
if (openWeatherInput) openWeatherInput.value = localStorage.getItem('openweather_api_key') || '';
if (rapidApiInput) rapidApiInput.value = localStorage.getItem('rapidapi_api_key') || '';
if (modal) modal.style.display = 'block';
}
//Comment: Trims and stores the user key inputs to localStorage, then reloads the page to apply the new keys.
saveApiKeys() {
// AI change: trim-api-keys-on-save
// AI Comment: Trims pasted key input before saving to localStorage to prevent hidden whitespace from breaking API authentication.
const openWeatherKey = document.getElementById('openWeatherKey').value.trim();
const rapidApiKey = document.getElementById('rapidApiKey').value.trim();
if (openWeatherKey) localStorage.setItem('openweather_api_key', openWeatherKey);
if (rapidApiKey) localStorage.setItem('rapidapi_api_key', rapidApiKey);
document.getElementById('apiKeyModal').style.display = 'none';
// Reload the page to initialize with new keys
window.location.reload();
}
handleInitializationError(error) {
console.error('Dashboard initialization failed:', error);
document.getElementById('dashboard-container').innerHTML =
'<div class="initialization-error">' +
'<h2>Dashboard Initialization Failed</h2>' +
'<p>' + error.message + '</p>' +
'<button onclick="location.reload()">Retry</button>' +
'</div>';
}
getTimeAgo(service) {
if (!this.lastUpdated.has(service)) return 'Last Refreshed: N/A';
const minutes = Math.floor((Date.now() - this.lastUpdated.get(service)) / 60000);
return minutes === 0 ? 'Just now' : minutes + ' min ago';
}

// AI change: dashboard-event-wiring
// AI Comment: Connects header controls and course filters so required interactions work from the existing UI.
setupEventListeners() {
const refreshAllBtn = document.getElementById('refreshAllBtn');
if (refreshAllBtn) {
refreshAllBtn.addEventListener('click', () => {
this.loadWeatherData();
this.loadHumorData();
this.loadCourseData();
});
}
const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
settingsBtn.addEventListener('click', () => this.openSettings());
}
// AI CHANGE: update-api-keys-button-wiring
// AI COMMENT: Wires the new header button to reopen the existing API key modal so users can update stored keys anytime.
const updateApiKeysBtn = document.getElementById('updateApiKeysBtn');
if (updateApiKeysBtn) {
updateApiKeysBtn.addEventListener('click', () => this.openApiKeyUpdateModal());
}
// AI change: panel-button-wiring
// AI Comment: Hooks up integrated Add Course and Settings panel buttons for open/close/save actions in the existing dashboard page.
const closeAddCoursePanelBtn = document.getElementById('closeAddCoursePanelBtn');
if (closeAddCoursePanelBtn) {
closeAddCoursePanelBtn.addEventListener('click', () => this.closeAddCoursePanel());
}
const saveCourseBtn = document.getElementById('saveCourseBtn');
if (saveCourseBtn) {
saveCourseBtn.addEventListener('click', () => this.submitAddCourseFromPanel());
}
const closeSettingsPanelBtn = document.getElementById('closeSettingsPanelBtn');
if (closeSettingsPanelBtn) {
closeSettingsPanelBtn.addEventListener('click', () => this.closeSettingsPanel());
}
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
saveSettingsBtn.addEventListener('click', () => this.saveSettingsFromPanel());
}
const searchInput = document.getElementById('courseSearch');
if (searchInput) {
// AI change: wired-search-to-catalog-pipeline
// AI Comment: Routes dashboard search input through the merged CourseCatalogManager search/filter logic from the original course system.
searchInput.addEventListener('input', () => this.renderCourseList());
}
const departmentFilter = document.getElementById('departmentFilter');
if (departmentFilter) {
departmentFilter.addEventListener('change', () => this.renderCourseList());
}
// AI change: wired-credits-filter
// AI Comment: Adds minimal listener for credits filter so the existing course manager's credit filtering works in the dashboard widget.
const creditsFilter = document.getElementById('creditsFilter');
if (creditsFilter) {
creditsFilter.addEventListener('change', () => this.renderCourseList());
}
// AI CHANGE: wired-availability-filter
// AI COMMENT: Adds listener for the new available/unavailable course filter using the same render flow as existing filters.
const availabilityFilter = document.getElementById('availabilityFilter');
if (availabilityFilter) {
availabilityFilter.addEventListener('change', () => this.renderCourseList());
}
}

// AI change: no-op-layout-hook
// AI Comment: Keeps initialize flow stable with a minimal method so missing method errors do not break app startup.
createDashboardLayout() {
}

// AI change: initial-status-message
// AI Comment: Provides user feedback after successful initialization.
showWelcomeMessage() {
const target = document.getElementById('api-status');
if (target && target.textContent === '-') {
target.textContent = 'Ready';
}
}

// AI change: loading-state-handlers
// AI Comment: Adds lightweight loading/error state toggles referenced by initialize and data load methods.
showLoadingState() {
const container = document.getElementById('dashboard-container');
if (container) container.classList.add('is-loading');
}
hideLoadingState() {
const container = document.getElementById('dashboard-container');
if (container) container.classList.remove('is-loading');
}
showErrorState(message) {
const weatherContainer = document.getElementById('weather-widget');
if (weatherContainer) {
weatherContainer.innerHTML = '<div class="error-message">' + message + '</div>';
}
}

// AI change: course-data-loader
// AI Comment: Loads local sample JSON, initializes the course catalog model, and updates related UI sections.
async loadCourseData() {
const response = await fetch('sample-data.json');
if (!response.ok) throw new Error('Failed to load course data.');
const data = await response.json();
// AI change: load-nested-course-catalog
// AI Comment: Initializes the integrated catalog using the original nested departments/courses data format instead of a flat array.
this.courseCatalog = new CourseCatalog(data);
this.populateDepartmentFilter();
this.renderCourseList();
this.updateDashboardStats();
}

// AI change: course-list-render
// AI Comment: Renders filterable course cards and basic CRUD action buttons for dashboard course management.
// Comment: Applies the filters from the dashboard controls and renders the resulting course list with Edit/Delete buttons for each course.
renderCourseList() {
if (!this.courseCatalog) return;
const searchInput = document.getElementById('courseSearch');
const departmentFilter = document.getElementById('departmentFilter');
const creditsFilter = document.getElementById('creditsFilter');
// AI CHANGE: availability-filter-read
// AI COMMENT: Reads the new availability dropdown selection and applies it after existing catalog filters.
const availabilityFilter = document.getElementById('availabilityFilter');
const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
const selectedDepartment = departmentFilter ? departmentFilter.value : 'all';
const selectedCredits = creditsFilter ? creditsFilter.value : 'all';
const selectedAvailability = availabilityFilter ? availabilityFilter.value : 'all';
// AI change: apply-original-filter-methods
// AI Comment: Uses the course manager's original search/department/credits methods so dashboard filtering behavior matches the basic-json system.
this.courseCatalog.searchCourses(query);
this.courseCatalog.filterByDepartment(selectedDepartment);
let courses = this.courseCatalog.filterByCredits(selectedCredits);
// AI CHANGE: availability-filter-logic
// AI COMMENT: Adds minimal availability filtering where Available means enrolled is less than capacity, and Unavailable means enrolled is at or above capacity.
if (selectedAvailability !== 'all') {
courses = courses.filter((course) => {
const capacity = Number(course.schedule && course.schedule.capacity || 0);
const enrolled = Number(course.schedule && course.schedule.enrolled || 0);
if (selectedAvailability === 'available') return capacity > 0 && enrolled < capacity;
if (selectedAvailability === 'unavailable') return capacity > 0 && enrolled >= capacity;
return true;
});
}
const container = document.getElementById('coursesContainer');
if (!container) return;
if (courses.length === 0) {
container.innerHTML = '<div class="error-message">No matching courses found.</div>';
return;
}
container.innerHTML = courses.map((course) =>
'<div class="course-card">' +
'<strong>' + course.courseCode + ': ' + course.title + '</strong>' +
'<div>Department: ' + course.departmentName + ' (' + course.departmentCode + ')</div>' +
'<div>Credits: ' + course.credits + '</div>' +
'<div>Enrollment: ' + (course.schedule ? course.schedule.enrolled : 0) + '/' + (course.schedule ? course.schedule.capacity : 0) + '</div>' +
'<div class="course-actions">' +
'<button onclick="dashboard.editCoursePrompt(\'' + course.courseCode + '\')">Edit</button>' +
'<button onclick="dashboard.deleteCourse(\'' + course.courseCode + '\')">Delete</button>' +
'</div>' +
'</div>'
).join('');
}

// AI change: department-filter-population
// AI Comment: Ensures department dropdown reflects loaded course data and supports rubric filtering behavior.
populateDepartmentFilter() {
if (!this.courseCatalog) return;
const filter = document.getElementById('departmentFilter');
if (!filter) return;
const current = filter.value || 'all';
const options = ['<option value="all">All Departments</option>'].concat(
// AI change: department-options-from-manager
// AI Comment: Builds department filter options from the merged manager's department metadata so names/codes stay aligned with source data.
this.courseCatalog.getDepartmentsDetailed().map((department) => '<option value="' + department.code + '">' + department.name + '</option>')
);
filter.innerHTML = options.join('');
filter.value = current;
}

// AI change: stats-helper-methods
// AI Comment: Supplies statistics calculations used by existing dashboard summary cards.
getAllCourses() {
return this.courseCatalog ? this.courseCatalog.getAllCourses() : [];
}
calculateTotalEnrollment() {
// AI change: enrollment-from-schedule
// AI Comment: Reads enrollment from `schedule.enrolled` to match the original course data format.
return this.getAllCourses().reduce((total, course) => total + Number(course.schedule && course.schedule.enrolled || 0), 0);
}
calculateAverageCapacity() {
const courses = this.getAllCourses();
if (courses.length === 0) return 0;
const average = courses.reduce((total, course) => {
const capacity = Number(course.schedule && course.schedule.capacity || 0);
const enrolled = Number(course.schedule && course.schedule.enrolled || 0);
if (!capacity) return total;
return total + (enrolled / capacity) * 100;
}, 0) / courses.length;
return Math.round(average);
}
// AI CHANGE: api-status-helper
// AI COMMENT: Computes Connected/Partial/Disconnected from latest weather and humor responses, treating fallback/error payloads as disconnected.
getApiConnectionStatus() {
const weatherConnected = !!(this.latestWeather && this.latestWeather.error !== true && this.latestWeather.isFallback !== true);
const chuckConnected = !!(this.latestJokes && this.latestJokes.chuck && this.latestJokes.chuck.error !== true);
const programmingConnected = !!(this.latestJokes && this.latestJokes.programming && this.latestJokes.programming.error !== true);
const connectedCount = [weatherConnected, chuckConnected, programmingConnected].filter(Boolean).length;
if (connectedCount === 3) return 'Connected';
if (connectedCount > 0) return 'Partial';
return 'Disconnected';
}

// AI change: weather-refresh-action
// AI Comment: Implements the manual weather refresh action used by quick actions.
async refreshWeather() {
await this.loadWeatherData();
}

// AI change: humor-error-display
// AI Comment: Adds explicit fallback rendering for humor widget failures with user-friendly messaging.
displayHumorError() {
const humorContainer = document.getElementById('humor-widget');
if (!humorContainer) return;
humorContainer.innerHTML = '<div class="error-message">Humor service is temporarily unavailable. Please try again.</div>';
}

// AI change: weather-error-display
// AI Comment: Adds explicit fallback rendering for weather widget failures with user-friendly messaging.
displayWeatherError() {
const weatherContainer = document.getElementById('weather-widget');
if (!weatherContainer) return;
weatherContainer.innerHTML = '<div class="error-message">Weather service is temporarily unavailable. Please try again.</div>';
}

// AI change: time-refresh-update
// AI Comment: Keeps "last updated" labels current without additional API requests.
updateTimeDisplays() {
const weatherUpdated = document.querySelector('#weather-widget .last-updated');
if (weatherUpdated) weatherUpdated.textContent = this.getTimeAgo('weather');
}

// AI change: add-course-action
// AI Comment: Provides minimal add-course flow to preserve CRUD behavior in the dashboard.
addNewCourse() {
// AI change: open-add-course-panel
// AI Comment: Replaces prompt-based add flow by opening the integrated in-page Add Course panel for fillable CRUD input.
this.openAddCoursePanel();
}

// AI change: add-course-panel-toggle
// AI Comment: Adds simple open/close behavior for the integrated Add Course panel without page reload.
openAddCoursePanel() {
const panel = document.getElementById('addCoursePanel');
const title = document.getElementById('coursePanelTitle');
const saveButton = document.getElementById('saveCourseBtn');
// AI change: add-mode-panel-state
// AI Comment: Resets shared course panel to add mode with cleared fields so Add and Edit can safely share one form.
this.editingCourseCode = null;
if (title) title.textContent = 'Add Course';
if (saveButton) saveButton.textContent = 'Save Course';
const formDefaults = {
newCourseCode: '',
newCourseTitle: '',
newCourseDepartment: '',
newCourseCredits: '3',
newCourseDescription: '',
newInstructorName: '',
newInstructorEmail: '',
newInstructorOffice: '',
newCourseDays: '',
newCourseTime: '',
newCourseLocation: '',
newCourseCapacity: '30',
newCourseEnrolled: '0'
};
Object.keys(formDefaults).forEach((id) => {
const input = document.getElementById(id);
if (input) input.value = formDefaults[id];
});
if (panel) panel.classList.add('is-open');
this.setPanelError('addCourseFormError', '');
}
closeAddCoursePanel() {
const panel = document.getElementById('addCoursePanel');
if (panel) panel.classList.remove('is-open');
// AI change: clear-edit-state-on-close
// AI Comment: Clears edit tracking when panel closes so future Add operations are not treated as updates.
this.editingCourseCode = null;
this.setPanelError('addCourseFormError', '');
}

// AI change: add-course-form-submit
// AI Comment: Reads Add Course panel inputs, submits through existing course-catalog addCourse logic, then rerenders list and stats.
submitAddCourseFromPanel() {
if (!this.courseCatalog) return;
const code = (document.getElementById('newCourseCode').value || '').trim();
const title = (document.getElementById('newCourseTitle').value || '').trim();
const department = (document.getElementById('newCourseDepartment').value || '').trim();
const credits = Number(document.getElementById('newCourseCredits').value || 3);
const description = (document.getElementById('newCourseDescription').value || 'Added from dashboard quick action.').trim();
const instructorName = (document.getElementById('newInstructorName').value || 'TBA').trim();
const instructorEmail = (document.getElementById('newInstructorEmail').value || 'tba@hawaii.edu').trim();
const instructorOffice = (document.getElementById('newInstructorOffice').value || 'TBA').trim();
const days = this.parseCommaList(document.getElementById('newCourseDays').value);
const time = (document.getElementById('newCourseTime').value || 'TBA').trim();
const location = (document.getElementById('newCourseLocation').value || 'TBA').trim();
const capacity = Number(document.getElementById('newCourseCapacity').value || 30);
const enrolled = Number(document.getElementById('newCourseEnrolled').value || 0);
// AI change: add-course-input-validation
// AI Comment: Validates incorrect Add Course form entries and shows inline feedback instead of allowing silent failures.
if (!code || !title || !department) {
this.setPanelError('addCourseFormError', 'Course Code, Title, and Department Code are required.');
return;
}
if (!Number.isFinite(credits) || credits < 1 || credits > 6) {
this.setPanelError('addCourseFormError', 'Credits must be a number between 1 and 6.');
return;
}
if (!Number.isFinite(capacity) || capacity < 1) {
this.setPanelError('addCourseFormError', 'Capacity must be a number greater than 0.');
return;
}
if (!Number.isFinite(enrolled) || enrolled < 0 || enrolled > capacity) {
this.setPanelError('addCourseFormError', 'Enrolled must be between 0 and Capacity.');
return;
}
if (instructorEmail && !instructorEmail.includes('@')) {
this.setPanelError('addCourseFormError', 'Instructor email must be a valid email address.');
return;
}
this.setPanelError('addCourseFormError', '');
// AI change: add-or-edit-submit-branch
// AI Comment: Reuses the same integrated panel submit path for both Add and Edit while calling existing course catalog CRUD methods.
if (this.editingCourseCode) {
this.courseCatalog.updateCourse(this.editingCourseCode, {
title: title,
credits: credits,
description: description,
instructor: { name: instructorName, email: instructorEmail, office: instructorOffice },
schedule: { days: days.length ? days : ['TBA'], time: time, location: location, capacity: capacity, enrolled: enrolled }
});
} else {
this.courseCatalog.addCourse({
courseCode: code,
title: title,
credits: credits,
departmentCode: department,
description: description,
instructor: { name: instructorName, email: instructorEmail, office: instructorOffice },
schedule: { days: days.length ? days : ['TBA'], time: time, location: location, capacity: capacity, enrolled: enrolled },
topics: [],
assignments: []
}, department);
}
this.populateDepartmentFilter();
this.renderCourseList();
this.updateDashboardStats();
this.closeAddCoursePanel();
}

// AI change: edit-course-action
// AI Comment: Adds minimal update flow required for CRUD completeness without restructuring existing UI.
editCoursePrompt(id) {
if (!this.courseCatalog) return;
const current = this.courseCatalog.findCourseByCode(id);
if (!current) return;
// AI change: edit-course-uses-panel
// AI Comment: Replaces prompt-based editing with prefilled integrated panel fields so Edit follows the required in-page form workflow.
this.editingCourseCode = id;
const title = document.getElementById('coursePanelTitle');
const saveButton = document.getElementById('saveCourseBtn');
if (title) title.textContent = 'Edit Course';
if (saveButton) saveButton.textContent = 'Save Changes';
const setValue = (id, value) => {
const input = document.getElementById(id);
if (input) input.value = value;
};
setValue('newCourseCode', current.courseCode || '');
setValue('newCourseTitle', current.title || '');
setValue('newCourseDepartment', current.departmentCode || '');
setValue('newCourseCredits', String(current.credits || 3));
setValue('newCourseDescription', current.description || '');
setValue('newInstructorName', current.instructor && current.instructor.name || '');
setValue('newInstructorEmail', current.instructor && current.instructor.email || '');
setValue('newInstructorOffice', current.instructor && current.instructor.office || '');
setValue('newCourseDays', Array.isArray(current.schedule && current.schedule.days) ? current.schedule.days.join(', ') : '');
setValue('newCourseTime', current.schedule && current.schedule.time || '');
setValue('newCourseLocation', current.schedule && current.schedule.location || '');
setValue('newCourseCapacity', String(current.schedule && current.schedule.capacity || 0));
setValue('newCourseEnrolled', String(current.schedule && current.schedule.enrolled || 0));
this.openCoursePanelForEditState();
}

// AI change: open-edit-panel-helper
// AI Comment: Centralizes panel opening for edit mode so prefilled values remain intact and panel state is consistent.
openCoursePanelForEditState() {
const panel = document.getElementById('addCoursePanel');
if (panel) panel.classList.add('is-open');
this.setPanelError('addCourseFormError', '');
}

// AI change: delete-course-action
// AI Comment: Adds minimal delete flow to complete CRUD behavior and keep stats synchronized.
deleteCourse(id) {
if (!this.courseCatalog) return;
const confirmed = confirm('Delete course ' + id + '?');
if (!confirmed) return;
this.courseCatalog.deleteCourse(id);
this.populateDepartmentFilter();
this.renderCourseList();
this.updateDashboardStats();
}

// AI change: export-dashboard-data
// AI Comment: Implements rubric-required JSON export containing courses, latest API data, and timestamp.
exportData() {
const payload = {
timestamp: new Date().toISOString(),
courses: this.getAllCourses(),
weather: this.latestWeather,
jokes: this.latestJokes
};
const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const anchor = document.createElement('a');
anchor.href = url;
anchor.download = 'campus-dashboard-export.json';
document.body.appendChild(anchor);
anchor.click();
document.body.removeChild(anchor);
URL.revokeObjectURL(url);
}

// AI change: settings-storage
// AI Comment: Adds minimal user preferences (refresh interval and preferred city) with localStorage persistence.
loadUserSettings() {
const defaults = {
// AI change: settings-refresh-only-defaults
// AI Comment: Simplifies settings persistence to refresh interval only after removing editable city behavior.
weatherRefreshMinutes: 10
};
try {
const stored = localStorage.getItem('dashboard_settings');
if (!stored) return defaults;
return Object.assign({}, defaults, JSON.parse(stored));
} catch (error) {
return defaults;
}
}
saveUserSettings() {
localStorage.setItem('dashboard_settings', JSON.stringify(this.userSettings));
}
openSettings() {
// AI change: open-settings-panel
// AI Comment: Replaces prompt-based settings with an integrated hideable panel that preloads current user settings values.
const panel = document.getElementById('settingsPanel');
const refreshInput = document.getElementById('settingsRefreshMinutes');
if (refreshInput) refreshInput.value = String(this.userSettings.weatherRefreshMinutes || 10);
if (panel) panel.classList.add('is-open');
this.setPanelError('settingsFormError', '');
}

// AI change: close-settings-panel
// AI Comment: Adds explicit close behavior for settings panel without reloading or losing dashboard state.
closeSettingsPanel() {
const panel = document.getElementById('settingsPanel');
if (panel) panel.classList.remove('is-open');
this.setPanelError('settingsFormError', '');
}

// AI change: save-settings-panel
// AI Comment: Saves settings from panel inputs to localStorage and safely restarts refresh timers to avoid duplicates.
saveSettingsFromPanel() {
const refreshInput = document.getElementById('settingsRefreshMinutes');
const parsed = Number(refreshInput ? refreshInput.value : this.userSettings.weatherRefreshMinutes);
// AI change: settings-input-validation
// AI Comment: Prevents invalid settings form entries from saving and shows clear inline error feedback.
if (Number.isNaN(parsed) || parsed < 1) {
this.setPanelError('settingsFormError', 'Refresh interval must be a number greater than or equal to 1.');
return;
}
this.setPanelError('settingsFormError', '');
this.userSettings.weatherRefreshMinutes = parsed;
this.saveUserSettings();
this.startAutoRefresh();
this.loadWeatherData();
this.closeSettingsPanel();
}

// AI change: parse-comma-list-helper
// AI Comment: Provides minimal normalization for comma-separated form fields used by Add Course panel inputs.
parseCommaList(value) {
if (!value) return [];
return value.split(',').map((item) => item.trim()).filter(Boolean);
}
// AI change: panel-error-helper
// AI Comment: Centralizes inline panel validation message updates for Add Course and Settings forms.
setPanelError(elementId, message) {
const el = document.getElementById(elementId);
if (el) el.textContent = message || '';
}
}
// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
window.dashboard = new CampusDashboard();
});
