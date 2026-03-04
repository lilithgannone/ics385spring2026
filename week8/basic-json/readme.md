# ICS 385 Week 8 - Basic JSON: University Course Catalog System

## Assignment Details

**Name:** Lilith Gannone<br>
**Date:** 03/06/2026<br>
**Course:** ICS 385 Spring 2026<br>
**Assignment:** Week 8a - University Course Catalog System<br>

## Overview

This project is an introductory assignment to JSON fundementals. From the assignment details, the program is a "University of Hawaii Maui College Course Catalog system that demonstrates core JSON manipulation skills including parsing, validation, searching, and dynamic content generation". 

I began this assignment by reviewing the existing code listed in the assigment details PDF. I then reviewed the full PDF and uploaded the PDF document to Codex as a .txt file to set up the starter code. Next, I assessed all the changes that needed to be made. I then began propting Codex on VS Code to make the needed changes detailed in the "Step by Step Implmentation" guide. Throughout this process, I tested the program on desktop. I then tested the program on mobile using a Chrome extension. I verified the testing requirments via manual tests and AI-ran tests. Finally, I did final fixes and asked that comments be made to the code explaining all functionalities. I reviewed the code, made some fixes, and then prompted for some final reviews to ensure all needed requirments had been met. I made a couple of final fixes then completed an AI code review. I then ran the program to ensure css met the needed requirments and that the program was still functional. All requirments were met, so I reviewed the code and then uploaded the basic-json folder to Github. 

## GitHub URL
- Live URL: `https://<lilithgannone>.github.io/<ics385spring2026>/week8/basic-json/`

<!-- AI CHANGE: Replaced scaffold README with assignment-ready setup and usage guide -->
<!-- AI COMMENT: This README gives beginner-friendly local run instructions, feature checklist, and deployment placeholder required by the assignment. -->

## Project Structure
- `index.html` - main UI structure (controls, statistics, cards, modal, add-course form)
- `styles.css` - responsive and accessible styling
- `course-catalog.js` - `CourseCatalogManager` class and app logic
- `sample-data.json` - course catalog dataset

## Setup Instructions (Local)
1. Open the `week8/basic-json/` folder in VS Code.
2. Install the **Live Server** extension (if not already installed).
3. Right-click `index.html` and choose **Open with Live Server**.
4. Use the app controls in the browser to load/search/filter/add/export courses.

## Features Implemented
- Load and parse JSON data with user-friendly error handling
- Display course cards in a responsive grid layout (mobile to desktop)
- Multi-field search (course code, title, description, instructor, topics, department)
- Combined filters (department + credits + search)
- Search result caching with `Map` for better performance
- Course details modal with keyboard close (`Escape`) and accessible close button
- Add new course form with validation and UI error feedback
- Enrollment statistics display
- Export current catalog to formatted JSON (2-space indentation)

## AI GENERATED CONTENT
<!-- AI CHANGE (REVISION): Added explicit AI-generated content disclosure section. -->
<!-- AI COMMENT: The review checklist requires a clearly labeled AI-generated content section in the README. -->
- Portions of this project implementation and comments were generated with AI assistance and then reviewed/edited for assignment compliance.

## AI GENERATED NOTES
<!-- AI COMMENT: JSON cannot contain comments, so this section documents the schema fields for beginners without breaking sample-data.json validity. -->
- `university` (string): College name shown at catalog level.
- `semester` (string): Term label for the dataset.
- `lastUpdated` (string date): Last data update date in `YYYY-MM-DD`.
- `departments` (array): List of department objects.
- `departments[].code` (string): Short department code used by filters (example: `ICS`).
- `departments[].name` (string): Full department name shown in UI.
- `departments[].chair` (string): Chair name for department metadata.
- `departments[].courses` (array): Course objects under each department.
- `courses[].courseCode` (string): Human-readable course identifier.
- `courses[].title` (string): Course title displayed on cards/modal.
- `courses[].credits` (number): Credit value used in filtering and display.
- `courses[].description` (string): Short summary used in card and modal views.
- `courses[].prerequisites` (array of strings): Requirement list displayed in modal.
- `courses[].instructor` (object): Nested instructor record.
- `courses[].instructor.name` (string): Instructor display name.
- `courses[].instructor.email` (string): Instructor email; validation expects `@hawaii.edu`.
- `courses[].instructor.office` (string): Office location shown in details.
- `courses[].schedule` (object): Nested schedule and enrollment data.
- `courses[].schedule.days` (array of strings): Meeting days used for card/detail text.
- `courses[].schedule.time` (string): Meeting time range.
- `courses[].schedule.location` (string): Room/online location.
- `courses[].schedule.capacity` (number): Maximum seats.
- `courses[].schedule.enrolled` (number): Current enrolled count.
- `courses[].isActive` (boolean): Active/inactive course status value.
- `courses[].topics` (array of strings): Keywords used in search matching.
- `courses[].assignments` (array): Assignment objects for detail display.
- `courses[].assignments[].name` (string): Assignment title.
- `courses[].assignments[].points` (number): Point value for assignment.
- `courses[].assignments[].dueDate` (string date): Due date in `YYYY-MM-DD`.
- `metadata` (object): Summary counters and academic year metadata.
