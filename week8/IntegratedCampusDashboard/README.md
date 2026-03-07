# Integrated Campus Dashboard (ICS 385 Week 8 Intermediate)

## Assignment Details

**Name:** Lilith Gannone<br>
**Date:** 03/08/2026<br>
**Course:** ICS 385 Spring 2026<br>
**Assignment:** Week 8b - Integrated Campus Dashboard<br>

## Assignment Process
This project is an intermediate assignment, building upon assignment 8a, which covered JSON fundamentals. From assignment details, assignment 8n builds upon JSON fundamental knowledge via the creation of a comprehensive dashboard that integrates multiple APIs with secure credential management. 

I began this assignment by reviewing the existing code listed in the assignment details PDF. I then reviewed the full PDF and manually created blank files. I then uploaded the PDF document to Codex as a .txt file to set up the starter code. Next, I assessed all the changes that needed to be made. I started by manually adding a .env file and updating the .gitignore file to include the .env file. I then manually updated my keys in the .env file. I ran the HTML file in Live Server to both assess functionality and see what the current UI looked like. Next, I prompted Codex to integrate the starter code with the existing basic-JSON course catalog code. All changes are labeled "AI Change". I then asked that comments be added to the entirety of the code, explaining it so I could properly review and understand the syntax. I then prompted Codex to make the initial basic changes using a lengthy prompt describing what needed to be done. Next, I began propting Codex on VS Code to make the needed changes detailed in the "Technical Requirements", "Required Functionality", and "Submission Requirements" sections. Throughout this process, I tested the program on a desktop. I also tested the program on mobile using a Chrome extension. At this point, I noticed an error with my weather API code, so I went into DevTools and attempted to troubleshoot. I was able to fix the issue with a few Codex prompts. I verified the testing requirements via manual tests and AI-run tests to satisfy the testing requirements. 

I then did some enhancements like adding an "Update API Keys" button, adding an extra filter, and making the jokes refreshable as there was initially a bug preventing refreshes. I then asked that comments be added to the code explaining all added functionalities. I reviewed the code, made some additional changes, and then prompted for a final review to ensure all needed requirements had been met. I made a couple of final fixes and then conducted an AI code review to test the functionalities and ensure all requirements were met. I manually updated the README file with a section titled "Feature List" explaining the added features. "Security Checklist" also added to the readme, AI-generated but reviewed and altered manually. I ran the program again to ensure CSS met the needed requirements and that the program was still functional. All requirements were met, so I reviewed the code and added some manual comments labeled "comment" using what I learned from W3Schools and some autofill info from VSCode where applicable. I ran the final tests listed below in "Testing Checklist". I then uploaded the folder to GitHub.

## Overview
This project integrates:
- Local course management data and CRUD actions
- OpenWeatherMap current weather (API key required)
- JokeAPI programming jokes (no API key required)
- RapidAPI Chuck Norris jokes (API key + host headers required)

The dashboard combines local and live API data into one interface with caching, rate limiting, fallback responses, and export support.

## Project Files
- `index.html`
- `styles.css`
- `config.js`
- `api-client.js`
- `course-catalog.js`
- `dashboard.js`
- `sample-data.json`
- `.env.example`
- `.gitignore`
- `README.md`

## Setup Instructions
1. Clone/open the project folder.
2. Create a local `.env` file (do not commit it) using `.env.example`.
3. Add your API keys:
   - `OPENWEATHER_API_KEY`
   - `RAPIDAPI_KEY`
   - `RAPIDAPI_HOST`
4. This dashboard uses a client-side development approach for keys:
   - Enter keys in the API setup modal, which stores them in `localStorage` as:
     - `openweather_api_key`
     - `rapidapi_api_key`
5. Confirm `.gitignore` includes `.env` so secrets are excluded from Git.

## Local Run
1. Open with VS Code Live Server, or any local static server.
2. Load `index.html`.
3. If prompted, enter OpenWeather and RapidAPI keys in the modal.

## Feature List (Manual Rubric Check)
Technical Requirements
- Multi-API Integration: Successfully integrate OpenWeatherMap, JokeAPI, and Chuck
Norris (RapidAPI)
  - Yes: all three APIs are integrated. Data is successfully returned. 
- Security Implementation: Use environment variables and secure configuration
management
  - Yes: per the below security note and the comments in the original code file reading "for demo purposes, we'll use a secure client-side approach", configuration is correct. .env is in .gitignore. As we are using purley frontend architecture for this assignment, the users API codes are visable in DevTools. That said, it does comply with the rubric instructions to my understanding as this is a demo without the full backend proxy with server setup.  
- Error Handling: Comprehensive error handling with fallback data for all APIs
  - Yes: API requests use try/catch. Fallback data present for all APIs.
- Caching Strategy: Implement caching to reduce API calls and improve performance
  - Yes: cache map, expiry window, and manual joke refresh support cache bypass.
- Rate Limiting: Respect API rate limits with proper request management
  - Yes: request timestamp tracking. Enforcement occurs before request execution.
- Responsive Design: Dashboard must work on desktop, tablet, and mobile devices
  - Yes: Yes, all modes tested using live preview and Chrome extensions. 
- Data Integration: Combine local JSON course data with live API responses
  - Yes: Local JSON course data is loaded and merged into the same dashboard alongside live API widgets. The export feature includes courses, weather, jokes, and timestamp.
- Real-time Updates: Automatic refresh of weather data and manual joke refresh
  - Yes: 10-minute weather auto-refresh timer. Users can manually refresh weather data or change the refresh interval in settings. Jokes can be manually refreshed. Last update times visable on UI. 
Required Functionality
- Course Management: Full CRUD operations from previous assignment
  - Yes: Create, Read, Update, and Delete functions. 
- Weather Display: Current weather for Kahului with refresh capability
  - Yes: Visible and refreshable. 
- Joke Integration: Both programming jokes (JokeAPI) and Chuck Norris facts (RapidAPI)
  - Yes: Both integrated and refreshable. 
- Dashboard Statistics: Real-time stats combining course data and API status
  - Yes: Real-time stats and API status visible on UI. 
- API Key Management: Secure setup and validation of API credentials
  - Yes: users manually input their API keys. If there is an error, they will get an error message on the portion of the UI displaying the affected data, but the fallback data will still dsiplay. 
- Error Recovery: Graceful degradation when APIs are unavailable
  - Yes: Default data in place for API issues.
- Data Export: Export combined dashboard data as JSON
  - Yes: Export function works. 
- Settings Management: User configuration for refresh intervals and preferences
  - Yes: Users can alter refresh time in settings. 
Multi-API Integration
- Combines three different APIs with varying authentication methods:
  - Yes
- OpenWeatherMap API: Weather data for Kahului campus (API key authentication)
  - Yes
- JokeAPI (sv443.net): Programming humor (no authentication required)
 - Yes
- Chuck Norris API (RapidAPI): Daily inspiration/humor (RapidAPI key + headers)
  - Yes
Enhanced Course Management
- Builds upon the basic JSON assignment:
  - Yes: builds upon past assignment using a combination of the code in the Week 8 Intermediate Assignment details and the original Basic-JSON code. 
- Inherits full course catalog functionality from Assignment 1
  - Yes: course catalog code merged and refactored.
- Integrates course data with live campus information
  - Yes: live weather data integrated. 
- Real-time statistics combining local and API data
  - Yes: Real-time statistics that update when a course is added/ deleted. 
- Enhanced search and filtering capabilities
  - All search and filtering capabilities retained. Added filter feature to display only available/ unavailable courses. 
Advanced Security Implementation
- Professional secrets management:
  - Yes, per the below security note and the comments in the original code file reading "for demo purposes, we'll use a secure client-side approach", configuration is correct. .env is in .gitignore. As we are using purley frontend architecture for this assignment, the users API codes are visable in DevTools. That said, it does comply with the rubric instructions to my understanding, as this is a demo without the full backend proxy with server setup.  
- Environment Variables: Secure API key storage using .env files
  - Yes: .env and .gitignore employed. 
- Configuration Management: SecureConfig class for credential validation
  - Yes: visible in config.js.
- API Key Setup Modal: User-friendly interface for key configuration
  - Yes: easy key configuration upon setup. Keys are easily configurable right in the UI using the "Update API Keys" button. 


## Testing Checklist
- API connectivity:
  - verify OpenWeatherMap responds with valid key YES
  - verify RapidAPI Chuck Norris endpoint responds with valid key/host YES
  - verify JokeAPI endpoint responds without key YES
- Invalid/missing keys:
  - clear `localStorage` and reload
  - enter invalid keys and confirm fallback messages render YES
- Network failure:
  - simulate offline mode in DevTools YES
  - verify weather and humor widgets show graceful fallback/error messages YES
- Cache behavior:
  - trigger repeated requests quickly and confirm cached responses are reused YES
  - wait past cache duration and verify new requests occur YES
- Rate limiting:
  - issue repeated requests and confirm rate limiter prevents excessive calls AI CONFIRMED
- CRUD behavior:
  - add, edit, delete course entries YES
  - confirm stats update accordingly YES
- Export:
  - click Export Data and verify downloaded JSON contains courses, weather, jokes, timestamp YES
- Responsiveness:
  - test at desktop, tablet, and mobile widths in DevTools YES


## Security Checklist
- `.env` is ignored by Git (`.gitignore` includes `.env`)
- No API keys hardcoded in source files
- API keys entered through modal and stored in localStorage for development
- Centralized API request construction and headers in `api-client.js`
- Fallback responses prevent exposing sensitive error details to users

## Security Note (Frontend Demo Limitation)
- `.env` is hidden from Git commits via `.gitignore`, which protects repository secrets.
- This project is a browser-based frontend demo, so runtime API keys entered by users are stored in `localStorage`.
- As a result, runtime keys can still be visible in browser developer tools/network requests.
- In a production deployment, API keys should be moved to server-side environment variables behind backend API proxy endpoints.

## Security Measures
- `.env` is excluded from version control using `.gitignore`.
- `.env.example` is provided as a safe template for required configuration keys.
- API keys are not hardcoded in application source files; keys are entered at runtime through the UI modal.
- API key input values are trimmed before saving to reduce auth failures from accidental whitespace.
- API keys are hidden using password masking, but because of the demo environment, user input is visible in DevTools.
- Runtime credential checks are implemented through centralized configuration validation.
- API credentials are centralized through `SecureConfig` and `UnifiedApiClient`.
- API request timeouts are enforced using `AbortController` to reduce hanging requests.
- Per-service rate limiting is implemented to reduce abuse and accidental overuse.
- API response caching is implemented to reduce repeated external calls and lower exposure surface.
- Service fallback data and user-safe error messaging are implemented to avoid exposing sensitive stack traces to end users.
- A security notes are included to document the frontend limitation that keys remain inspectable in browser developer tools (readme and lines 10 and 11 in config.js)
