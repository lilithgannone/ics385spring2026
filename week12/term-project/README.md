# Term Project

## Project Title
Full Stack  Website: Lava Birds B&B 

## Name 
Lily Gannone

## Chosen Island & Property Type
- **Island:** Big Island, Hawai'i (Hawaii Island) 
- **Property Type:** Vacation Rental (B&B) 

## Target Visitor Segment
Honeymooners: The target visitor segment for Lava Birds B&B is budget conscious honeymooning couples. Lava Birds B&B will cater to honeymooners, anniversary celebrators, and those looking for an affordable, cozy getaway that highlights the natural beauty of the local environment. Families and solo travelers will also be targeted, but the primary focus will be on honeymooning couples. Per the tourism dashboard, this is a niche market. Tailoring the offerings to this segment will allow for a focused approach. There are many opportunities to expand offerings to other segments.

## AI Disclosure
Generated with the help of ChatGPT and Codex. I handled all of the planning and file structural changes. I also handled the majority of coding entry for this portion of the assignment (Week 12), but I used ChatGPT and Codex to help with brainstorming, structuring the project, and refining the content. I did use Codex for complex coding, to resolve the bugs I encountered, and to implement the fetch() call as I went with option b this week. For example, I used Codex to help with the implementation of the review schema and the filtering by rating. All AI additions are labeled. The css styling was primarily done with AI assistance, some of it I manually edited after generation to fix specific issues. 

## Week 11 Updates
During week 11, the following features were implemented:
- Review schema (guestName, rating 1–5, comment, date) embedded in the Property document.
- Express routes: GET /properties, GET /properties/:id, POST /properties/:id/reviews.
- Mongoose query operators ($gte, $lte) added to filter properties by minimum/ maximumrating.
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

Challanges this week:
- Understanding how to structure the review schema and embed it in the Property document.
- Navigating Postman to test the new routes and ensure they were working as expected. Now understood.
- Understanding ($gte, $lte) operators and how to implement them for filtering by rating.

## Week 12 Updates
During week 12, the following features were implemented:
- I went with option b to prepare for week 13: ensured local Express server is running and implemented a fetch() call to /api/properties/:id using AI assistance to understand the needed syntax and structure.
- Added all the needed files and updated my database with the new fields for the marketing page.
- Added React functional components and JSX throughout.
- Each major section added as its own component file under src/components/: About, Amenities, Gallery, CTA, Hero, Header, Special Offer, Carousel, and Footer.
- Implemented responsive layout: readable on both desktop and mobile
- Tested routes in Postman. Verified property ID in MongoDB Compass matches the ID in the URL.
- Added alt attributes to all images and ensured color contrast meets WCAG 2.1 AA standards.
- Prompted AI to assist with API calls. Manually coded what I could using Keeper code, W3Schools, Udemy, and other linked React resources.
- Tested local express server and fetch() call in the browser. Verified data is being pulled from the backend and rendered on the marketing page throughout the coding process. 
- Added const cors = require("cors"); to server.js and app.use(cors()); to allow cross-origin requests from the React frontend to the Express backend as fetch was being blocked by CORS policy.
- Added in more extensive marketing and property info to my schema and database to align with my PRD. Decided on tagline, amenities, and a package offering.
- Updated README to remove information that goes in the PRD.
- Manually added almost all comments to code (some using autofill from VS code) to increase my understanding and highlight what I manually coded (without AI assistance). Code I manually entered but used AI to help with structuring, syntax, or debugging is not labeled as manually coded, but I did make sure to understand all of the code I entered and the changes I made.
- Designed the wireframe and logo.
- Created property photos using some stock images and some GenAI. 
- Manually coded some of my jsx files after I used AI to help me understand how to structure the components and what code to use. After the first few sections, I was able to understand the structure and code needed and manually code some sections without AI assistance. 

Challenges this week:
- Understanding how to set up the React project and structure the files.
- Understanding how to implement the needed changes without hardcoding as I wanted to go with option b and prepare for week 13.
- Understandign what exactly needed to be done and what changes were fesible for me to make without AI assistance. 
- Implementing the fetch() call to pull data from the Express backend and render it on the marketing page.
- Ensuring the marketing page is responsive and meets accessibility standards.  
- Navigating the issues I encountered with the cors policy and understanding how to resolve it by allowing cross-origin requests in the Express server.
- Troubleshooting MongoDb Compass to verify the property ID and ensure it matches the ID in the URL for the fetch() call.
- Figuring out how to add navigation links to my header.jsx file.
- CSS styling and layout. I wanted to do as much as I could manually, but if I wanted a complex and asthetically pleasing design, I needed to use some AI assistance to understand how to implement the design I wanted. 

Wireframe:

Logo:


