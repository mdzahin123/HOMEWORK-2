Homework 2 — Asynchronous JavaScript and XML/JSON
Course: CMPSC 421 — Web Application Development
Topic: Consuming external APIs with asynchronous JavaScript and visualizing the results with D3.js.
This repository contains four small front-end applications, each pulling data from a different public API and rendering it in the browser. The goal of the assignment was to practice working with fetch / XMLHttpRequest, JSON parsing, and DOM manipulation, and to get hands-on experience with D3 as a visualization library.

Project Structure
Homework2/
├── index.html              # Vite landing page (boilerplate)
├── package.json            # Vite dev server config
├── Question1/              # Population Chart  (D3 line chart)
│   ├── index.html
│   ├── index.js
│   └── data/data.json
├── Question2/              # Word Cloud       (WordsAPI + d3-cloud)
│   ├── index.html
│   └── index.js
├── Question3/              # Weather Forecast (MapQuest + weather.gov)
│   ├── index.html
│   └── index.js
└── Question4/              # Imgur Client     (Imgur API)
    └── index.html
Each QuestionX/ folder is a standalone application — open its index.html in a browser (or serve it through Vite) and it runs on its own.

Running the Project
The project is set up with Vite for a quick local dev server.
bash# install dependencies
npm install

# start the dev server
npm run dev
Then navigate to the question you want to view, for example:

http://localhost:5173/Question1/index.html
http://localhost:5173/Question2/index.html
http://localhost:5173/Question3/index.html
http://localhost:5173/Question4/index.html

You can also just open any QuestionX/index.html directly in a browser, since each one is fully self-contained HTML/JS.

Question 1 — Population Chart (20 pts)
A D3 line chart showing the population of the United States year over year.

Data source: DataUSA API, cached locally as Question1/data/data.json.
Implementation: A custom XMLHttpRequest-based get() helper wrapped in a Promise loads the JSON, the data is mapped to { year, population } pairs, and D3 builds linear scales plus a d3.line() generator to draw the trend.
Features: Auto-scaled Y axis with 10% padding, integer-formatted year ticks, light horizontal gridlines, and a labeled axis.

Question 2 — Word Cloud (20 pts)
A simple word cloud generator. The user types a word, the app fetches its synonyms, and a cloud is rendered with d3-cloud.

API: WordsAPI via RapidAPI (/words/{word}/synonyms).
Implementation: Synonyms are fetched with fetch(), given randomized sizes, and laid out by d3.layout.cloud with random rotation (0° or 90°) and random HSL colors.
Note: Words from successive searches accumulate into the same cloud, so you can build it up by entering several seed words.


⚠️ This app requires a WordsAPI / RapidAPI key. The key currently embedded in Question2/index.js is for grading purposes and should be rotated before any public deployment.

Question 3 — Weather Forecast (30 pts)
A Bing-style weather screen that takes a US zip code and shows the forecast for that location.

APIs used:

MapQuest Geocoding API — converts a zip code into latitude/longitude plus city/state.
weather.gov /points/{lat},{lon} — resolves the forecast grid for those coordinates.
weather.gov /gridpoints/.../forecast — returns the actual forecast periods.


Output: A "current conditions" block (temperature, short forecast, wind, detailed forecast) followed by a horizontally scrollable strip of upcoming forecast periods.


⚠️ Requires a MapQuest API key. The key currently embedded in Question3/index.js is for grading purposes and should be rotated before any public deployment.

Question 4 — Imgur Client (30 pts)
A small Imgur browser that pulls a random gallery and lets you drill into individual posts.

API: Imgur API v3 using anonymous Client-ID authentication.
Gallery view: Fetches /gallery/random/random/, filters down to image-typed items, and renders each one with its title plus statistics (upvotes and comment count).
Detail view: Clicking an image hides the gallery, shows the full image, and fetches /gallery/{id}/comments to render the comment thread. A "Back to Gallery" button restores the original view.


⚠️ Requires an Imgur Client-ID. The one currently embedded in Question4/index.html is for grading purposes only.


Tech Stack

Vanilla JavaScript — no framework, just fetch / XMLHttpRequest and DOM APIs.
D3.js v7 — line chart (Q1), word cloud layout (Q2).
d3-cloud — word cloud positioning.
Vite — local dev server.


Notes on API Keys
Several of these apps require API keys (WordsAPI, MapQuest, Imgur Client-ID). Keys included in this repository were generated specifically for this assignment submission. If you fork or reuse this code, register your own keys with the respective services and replace the constants at the top of each index.js / index.html.
For any real deployment these should be moved out of client-side source — either into environment variables consumed at build time, or behind a small server-side proxy that adds the key to outgoing requests.

Assignment Summary
QuestionTopicPointsAPI(s)1Population Chart20DataUSA2Word Cloud20WordsAPI3Weather Forecast30MapQuest Geocoding + weather.gov4Imgur Client30Imgur API v3Total100
