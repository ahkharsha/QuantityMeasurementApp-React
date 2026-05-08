# Quantity Measurement App (React Frontend)

A clean, responsive React frontend for converting, comparing, and doing math with different physical measurements.

## Overview
This application provides an intuitive calculator interface that connects to a backend API to dynamically fetch units, evaluate conversions, and display a persistent history of operations.

## Tech Stack
* React 18
* React Hooks (useState, useEffect)
* Vanilla SCSS (Responsive Design)
* Fetch API (Network Requests)
* Jest & React Testing Library

## How to Run
1. Switch to the `dev` branch to access the full application source code.
2. Open the project terminal and run `npm install`.
3. Start the local development server with `npm start`.

## Features Implemented

### React Project Setup
- **App Initialization:** Scaffolded the base Create React App structure and configured package dependencies.
- **Global Styling:** Integrated SCSS files for global responsive design and styling resets.

### API & Utilities
- **Backend Integration:** Created `api.js` to securely communicate with the backend REST API using native Fetch.
- **Conversion Engine:** Built a strict utility class to evaluate mathematical expressions, apply conversion factors, and process unit comparisons directly on the client side.
