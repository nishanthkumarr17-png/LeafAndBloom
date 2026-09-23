# Leaf & Bloom

Leaf & Bloom is a React-based plant store and care assistant web app built with Vite, Express, MongoDB, and local browser persistence. The project includes product browsing, plant detail pages, wishlist management, checkout, community sharing, and a plant care assistant.

## Features

- Product catalog with search, filters, and sorting
- Plant detail pages with care guidance and related products
- Wishlist persistence using `localStorage`
- Checkout flow with order submission to backend API
- Community feed with post creation, image upload, likes, and local persistence
- Interactive plant assistant for care advice
- Backend API server using Express and MongoDB

## Built With

- React 19
- Vite 6
- Express 5
- MongoDB / Mongoose
- React Router DOM 7
- Axios
- React Icons
- Concurrently

## Project Structure

- `App.jsx` — root app with route setup and footer
- `Plants.jsx` — plant browse page with search, filters, and wishlist logic
- `PlantDetails.jsx` — plant detail page with care snapshot and recommendations
- `PlantCheckout.jsx` — checkout form and order submission
- `Community.jsx` — community feed and post creation UI
- `PlantAssistant.jsx` — plant advice assistant logic
- `server.js` — backend Express API for orders and wishlist
- `plantsData.js` — product seed data

## Getting Started

### Prerequisites

- Node.js 20+ or compatible
- npm
- MongoDB running locally on `mongodb://localhost:27017`

### Install Dependencies

```sh
npm install
```

### Run Locally

```sh
npm run server
```

In another terminal:

```sh
npm run dev
```

Then open the app at `http://localhost:5173`.

### Run Both Backend and Frontend

```sh
npm start
```

## Available Scripts

- `npm run dev` — starts the Vite development server
- `npm run build` — builds the production bundle
- `npm run server` — starts the Express backend on port `9001`
- `npm start` — runs both backend and frontend concurrently

## Notes

- The checkout and wishlist features are supported by the local backend and browser storage.
- Community posts and wishlist items also persist in `localStorage` for the current browser.
- Authentication is implemented using simple username storage in `localStorage`.

## License

This project is available for educational use and can be adapted for coursework or portfolio demonstrations.
