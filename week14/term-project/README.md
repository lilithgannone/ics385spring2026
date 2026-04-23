# Term Project

## Project Title
Full Stack  Website: Lava Birds B&B 

## Name 
Lily Gannone

## Chosen Island & Property Type
- **Island:** Big Island, Hawai'i (Hawaii Island) 
- **Property Type:** Vacation Rental (B&B) 

## Target Visitor Segment
Honeymooners: The target visitor segment for Lava Birds B&B is budget-conscious honeymooning couples. Lava Birds B&B will cater to honeymooners, anniversary celebrators, and those looking for an affordable, cozy getaway that highlights the natural beauty of the local environment. Families and solo travelers will also be targeted, but the primary focus will be on honeymooning couples. Per the tourism dashboard, this is a niche market. Tailoring the offerings to this segment will allow for a focused approach. There are many opportunities to expand offerings to other segments.

## AI Disclosure
Generated with the help of ChatGPT and Codex. I handled all of the planning and file structure changes. Please see the reflection for details. I also handled the majority of coding entries (actual insertion) for this portion of the assignment (Week 13), but I used ChatGPT and Codex to help with brainstorming, structuring the project, writing complex code, error resolution, updating some jsx files, and refining the content. The CSS styling was primarily done with AI assistance, although some of it I manually edited after generation to fix specific issues (font sizing, margin issues, etc). 

## Setup Steps
1. Install Node.js and have a MongoDB database available.
2. From the repo root, run npm install.
3. Create a .env file from .env.example (line 1) with:
    - MONGO_URI=...
    - VITE_WEATHER_KEY=...
4. Seed the database with npm run seed.
5. Start the Express backend with npm start.
6. In a second terminal, start the Vite frontend with npm run client.
7. Open the frontend in the browser, usually http://localhost:5173/.

## Week 14 Updates (See Data Folder for Screenshots and PRD)
During week 14, the following features were implemented:
- Created the admin dashboard page with EJS and added a protected route for it in Express.
- Protected admin dashboard route using isAuthenticated
- Added a one-hour session timeout in the existing session config
- Styled the admin login and dashboard pages with CSS
- Added admin header/navigation for the admin pages
- Created the admin special offer editing form on the dashboard
- Ensures that the marketing page special offer content updates from admin changes
- Added a public review posting form on the marketing page
- Review submission saves into MongoDB and updates the average rating and review count for the property
- Updated the review calculation
- Added a public contact popup form replacing the old mailto logic. Sumbissions will post on the admin dashboard and save to MongoDB. Admins can clear the messages through a checkbox-based delete function.
- Added an admin “View Reviews” popup on the dashboard
- Did some minor UI fixes on the marketing page like spacing and placeholder text.
- Ensured there was placeholder text on the review form and contact form, and that the review form only accepts ratings between 1 and 5.
- Tested out the password hashing and salting with bcrypt in the admin registration route.
- Original logic allowed people to go back after logout and view the dashboard. I added logic to prevent this.
- Tested formatting in mobile. 


## Challenges this week:
- Understanding how to implement authentication and protected routes.
- Understanding how to use bcrypt for password hashing and salting.
- Handling some errors I encountered with the new features, such as ensuring the review form only accepts ratings between 1 and 5 and that the contact form submissions are properly saved and displayed on the admin dashboard.
- Implementing the admin features and ensuring that changes made in the admin dashboard properly update the marketing page content.
- CSS styling and layout for the new admin pages and popups. I had an idea of what I wanted, but I needed AI assistance to understand how to implement the design I had in mind.
- General learning curves with new concepts and technologies, such as authentication, bcrypt, and protected routes. The hw14b really helped me understand how to implement these features, though. 
- I initially had a hard time understanding how the seed-admin.js logic worked. 

## Reflection:
One challange I had intgrating the passport.js logic was understanding how it work work within existing application. I was initially confused about how to structure the files and format the code and routes. Because we are using React and Express, I had difficulty conceptualizing how to set up the authentication logic accross both the frontend and the backend. I also initially had troible understanding how the seed-admin.js logic worked. The h14b assignment really set me up for sucess. I was able to use my hw14b file as a reference and template for how to structure my authentication logic. I also utlized AI tools to understand what changes I needed to make to my existing code to implement the new features. AI tools were very helpful in this week, but I also feel like I came away with a better understanding of the concepts. I feel very positive about this week. I had a lot of fun developing the admin dashboard. I actually had to hold back on adding features because I had so many ideas for the admin dashboard and wanted to make sure I had time to implement the core features first. All in all, this week was a great learning experience.

## Week 13 Updates (See Data Folder for Screenshots)
During week 13, the following features were implemented:
- Created the dashboard page using multiple elements: Dashboard.jsx, chart jsx files, component jsx files, data JSON files, dashboard CSS file, marketing page and dashboard page jsx files, arrivals js file, metrics js file, and origin.js file.
- Updated the file structure and code to support a multi-page application.
- Decided on the structure of the site and needed elements using PRD and wireframes.
- Selected which islands I wanted to pull data on.
- Retrieved, formatted, and inserted JSON data (Hawai'i Island, Maui, and Oahu) from DBEDT.
- Added an island selector (slctIsland)
- Added the Arrival Chart, Origin Chart, and Metric Cards elements using API calls and Chart.js. 
- Decided on styling elements to be added to dashboard page: live stream, lava video, CTA, misc. strings
- Connected dashboard navigation from the site header.
- Updated the CSS files through multiple prompts as needed using GenAI. 
- Researched volcanic data APIs and added VolcWidget. Saw the opportunity to have the background color change according to the aviation code, so I implemented that. 
- Updated env: OpenWeatherMap API key in .env as VITE_WEATHER_KEY and tested API calls.
- Ran multiple tests on the app to ensure acceptance criteria are met. 
- Ensured that widget updates automatically when the island selector changes.
- Added comments to the code as needed.
- Updated the readme with a guide for users. 

## Challenges this week:
- Understanding how to set up the React project and structure the files.
- Understanding how to transition to a multi-page app.
- Resolving navigation button errors I encountered when paths changed.
- Understanding how to implement the weather widget.
- Understanding "react-router-dom"
- Fetching and formatting the correct data from DBDET.
- Deciding on CSS styling and formatting. Prompting GenAI was somewhat difficult as it struggled to render all of the elements in a pleasing way.
- CSS styling and layout. I wanted to do as much as I could manually, but if I wanted a complex and aesthetically pleasing design, I needed to use some AI assistance to understand how to implement the design I wanted. 
- Understanding what makes the widgets update automatically.

## Reflection:
This week was another challenging week for me. Implementing a large number of changes took quite some time, but I am satisfied with the results, and I better understand what it takes to create a multi-page application. I especially appreciate the knowledge I gained on Chart.js visualizations. In the areas of code that were AI-generated/ assisted, I manually wrote comments in, and this very much helped me better understand the concepts involved. I struggled with the CSS styling a bit this week, as the AI-generated code was not reflecting what I had in mind. Eventually, I remapped my wireframe and was able to get to something satisfactory through prompting and manual adjustments. I also reformatted my marketing page to better align with my brand. All in all, I am satisfied with my dashboard. 

Next week, I will implement admin authentication using Passport.js or JWT, create an admin login page, create a protected admin dashboard route, learn how to utlize bcrypt, use csurf middleware to implement CSRF protection on the login, decide on and develop my admin-only features, decide where my special offers and or announcements will post (admin-only feature), and design the layout of my admin page. 

## Week 12 Updates
During week 12, the following features were implemented:
- I went with option B to prepare for week 13: ensured the local Express server is running and implemented a fetch() call to /api/properties/:id using AI assistance to understand the needed syntax and structure.
- Added all the needed files and updated my database with the new fields for the marketing page.
- Added React functional components and JSX throughout.
- Each major section added as its own component file under src/components/: About, Amenities, Gallery, CTA, Hero, Header, Special Offer, Carousel, and Footer.
- Implemented responsive layout: readable on both desktop and mobile
- Tested routes in Postman. Verified property ID in MongoDB Compass matches the ID in the URL.
- Added alt attributes to all images and ensured color contrast meets WCAG 2.1 AA standards.
- Prompted AI to assist with API calls. Manually coded what I could using Keeper code, W3Schools, Udemy, and other linked React resources.
- Tested local express server and fetch() call in the browser. Verified data is being pulled from the backend and rendered on the marketing page throughout the coding process. 
- Added const cors = require("cors"); to server.js and app.use(cors()); to allow cross-origin requests from the React frontend to the Express backend, as fetch was being blocked by CORS policy.
- Added more extensive marketing and property info to my schema and database to align with my PRD. Decided on tagline, amenities, and a package offering.
- Updated README to remove information that goes in the PRD.
- Manually added almost all comments to code (some using autofill from VS code) to increase my understanding and highlight what I manually coded (without AI assistance). Code I manually entered but used AI to help with structuring, syntax, or debugging is not labeled as manually coded, but I did make sure to understand all of the code I entered and the changes I made.
- Designed the wireframe and logo.
- Created property photos using some stock images and some GenAI. 
- Manually coded some of my JSX files after I used AI to help me understand how to structure the components (using my local Express server) and what code to use. After the first few sections, I was able to understand the required structure and code and manually implement some sections without AI assistance. 

Challenges this week:
- Understanding how to set up the React project and structure the files.
- Understanding how to implement the needed changes without hardcoding, as I wanted to go with option B to prepare for week 13.
- Understanding what exactly needed to be done and what changes were feasible for me to make without AI assistance. 
- Implementing the fetch() call to pull data from the Express backend and render it on the marketing page.
- Ensuring the marketing page is responsive and meets accessibility standards.  
- Navigating the issues I encountered with the CORS policy and understanding how to resolve it by allowing cross-origin requests in the Express server.
- Troubleshooting MongoDB Compass to verify the property ID and ensure it matches the ID in the URL for the fetch() call.
- Figuring out how to add navigation links to my header.jsx file.
- CSS styling and layout. I wanted to do as much as I could manually, but if I wanted a complex and aesthetically pleasing design, I needed to use some AI assistance to understand how to implement the design I wanted. 

Reflection:
This week was very challenging but also very rewarding. I implemented all of the features above in my term project application. Although I did use AI tools, I began by creating all my files using Keeper code and Udemy as a reference to manually add what I could. As I went with option B, I needed some assistance with syntax. I decided to manually add/copy over all AI-generated code instead of prompting with Codex in VS Code for automated changes, and it really helped to increase my understanding of React. After a while, I began to better understand how to structure JSX files and was able to do some minor coding myself without any assistance. I also changed the information in my database to apply to the new one-property structure. I struggled a bit when it came to debugging and error handling, but I was able to use DevTools and AI assistance to figure out any errors I encountered. I did some back-and-forth prompting when it came to CSS styling, as I had a vision in mind that I could not feasibly accomplish without AI tools. I would write lengthy prompts, go over the code, copy the code over, run the program, and then start again. I am still not 100% satisfied with my styling and will probably change the styling a bit more next week as I add in my dashboard. Wireframing really helped me, so I will likely do the same next week. I also had fun making a Logo in Canva. I tried to find existing images online, but ended up using GenAI to create property images, which was more time consuming that I expected. It ended up being satisfying, though, as I could really tailor the images to apply to what was in my PRD. The PRD was also especially helpful this week as a planning tool. 

## Wireframe:
![IMG_1766](https://github.com/user-attachments/assets/413f182d-2e77-45a9-94cb-d007fe68188a)

## Logo First Draft:
![logo](https://github.com/user-attachments/assets/47f1ea2d-fcf6-4b43-a8bf-2eeb30f3bdca)

## Final Logo:
<img width="516" height="484" alt="logo" src="https://github.com/user-attachments/assets/68da0f12-6659-48c3-8005-107247f86e28" />

## Week 11 Updates
During week 11, the following features were implemented:
- Review schema (guestName, rating 1–5, comment, date) embedded in the Property document.
- Express routes: GET /properties, GET /properties/:id, POST /properties/:id/reviews.
- Mongoose query operators ($gte, $lte) added to filter properties by minimum/maximum rating.
- All routes tested in Postman. 
- Postman collection exported and committed to the repo. 
- Basic EJS template rendered at /properties listing all properties.
- Checked EJS rendering in browser.

Looking to week 12, the following features are ready to be implemented:
- React Marketing Page
    - Route is prepared in properties.js.
    - Endpoint returns all fields the marketing page will need: name, island, type, description, amenities, targetSegment, imageURL.
    - It will be important to meet the required sections, use React functional components, apply responsive CSS, and validate WCAG 2.1 AA compliance. 
    - The features below are proposed for the marketing page.

Challenges this week:
- Understanding how to structure the review schema and embed it in the Property document.
- Navigating Postman to test the new routes and ensure they were working as expected. Now understood.
- Understanding ($gte, $lte) operators and how to implement them for filtering by rating.



