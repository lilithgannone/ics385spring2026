# Term Project

## Project Title
Full Stack  Website: Lava Birds B&B 

## Name 
Lily Gannone

## Chosen Island & Property Type
- **Island:** Big Island, Hawai'i (Hawaii Island) 
- **Property Type:** Vacation Rental (B&B) 

## Disclaimer: 
Readme will be cleaned up in the final submission for user friendliness. Temporary formatting to organize thoughts, content, and document satisfaction of submission requirements. Each week's updates will be documented in the README to track progress and ensure all requirements are met. The final version will be organized as if intended for a user audience.

## Target Visitor Segment
Honeymooners: The target visitor segment for Lava Birds B&B is budget-conscious honeymooning couples. Lava Birds B&B will cater to honeymooners, anniversary celebrators, and those looking for an affordable, cozy getaway that highlights the natural beauty of the local environment. Families and solo travelers will also be targeted, but the primary focus will be on honeymooning couples. Per the tourism dashboard, this is a niche market. Tailoring the offerings to this segment will allow for a focused approach. There are many opportunities to expand offerings to other segments.

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

## Potential Pages/ Features to Include
- API: Volcanic Data
- API: Local Weather
- Package Deals Marketing Highlight Panel: Local Tours and Activities
- Marketing Page: Highlighting Unique Location, Affordable Pricing, Amenities, Packages, and Themed Suites
- Peak Season Calendar (peak honeymoon travel months): Highlighting Best Times to Visit and Local Events

## Potential Ways to Differentiate from Competitors
1. Unique Location and Themed Suites: Lava Birds B&B will be located a short distance from Kilauea Volcano. The rooms will be themed around the local environment, with decor inspired by the volcanic landscape in the hopes of creating an immersive experience for guests.
2. Cozy Luxury Feel at an Affordable Price: Mid-range, competitive pricing with cozy amenities and personalized service to create a luxurious feel without the high cost. Simple amenities like a hot tub, on-suite private outdoor space, included local tea and coffee tastings, and comfortable bedding will be provided to enhance the guest experience while keeping costs manageable. The focus will be on the natural beauty of the surroundings, allowing guests to enjoy the unique location without the need for expensive amenities.
3. Local Experiences: Partnerships with local tour companies offering affordable package deals for guests, such as guided hikes and volcano tours.
4. A Focus on Comfort: Rooms will be designed to maximize comfort and truly immerse guests into the local environment: large windows offering views of the surrounding landscape, natural materials in the decor, and a cozy atmosphere.
5. Personalized Service: Emphasis on personalized service, with staff trained to be especially welcoming and attentive to the needs of honeymooning couples. This could include special touches like welcome gifts, room setups, and personalized recommendations for local activities and dining.
6. Packages Offerings for Different Types of Travelers: Packages tailored to different types of travelers, such as romantic getaways for couples, family-friendly packages, and solo traveler specials, to attract a wider range of guests while still maintaining a focus on the primary target segment. The primary offerings will be packages for honeymooning couples, which will include special amenities, upgraded suites, and personalized services. Couples can opt in or out, allowing for price flexibility while still offering the opportunity for an enhanced experience.

## AI Disclosure
Generated with the help of ChatGPT and Codex. I handled the primary coding/ structural changes for this portion of the assignment (Week 11), but I used ChatGPT and Codex to help with brainstorming, structuring the project, and refining the content. I did use Codex for coding that was complex for me. For example, I used Codex to help with the implementation of the review schema and the filtering by rating. All AI additions are labeled. I manually moved code over from the study guide where possible. 

