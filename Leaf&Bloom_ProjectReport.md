# Leaf & Bloom Project Report

## 1. Project Title
Leaf & Bloom (PlantNest)

## 2. Introduction
Leaf & Bloom is a React-based web application designed as an online plant store for indoor and ornamental plant enthusiasts. The platform combines product discovery, wishlist management, plant care guidance, order placement, and community interaction into a single user-friendly experience.

## 3. Problem Statement
Many plant buyers face difficulty choosing the right species, understanding plant care, and accessing a single platform that supports both shopping and learning. Existing e-commerce solutions often lack detailed care guidance and community support for beginner plant parents.

## 4. Objectives
- Provide a visually engaging platform for browsing and purchasing plants.
- Enable users to save favorite plants in a wishlist.
- Support checkout with delivery details and order placement.
- Offer beginner-friendly plant care guidance and tips.
- Create a community section for plant lovers to share updates.
- Deliver a responsive interface for desktop and mobile users.

## 5. Scope
Leaf & Bloom includes:
- Product browsing and filtering
- Wishlist management
- Plant details and care recommendations
- Checkout and order handling
- Community discussion space
- Authentication through basic sign-in/sign-up flow

## 6. Existing System
Most online plant stores are limited to product listings and payment flows. They usually do not provide:
- integrated care guidance
- community sharing tools
- clear beginner-oriented shopping support

## 7. Proposed System
Leaf & Bloom integrates these capabilities into one platform. Users can search and filter plants, save favorites, read care tips, place orders, and post community updates without leaving the app.

## 8. Modules and Features

### 8.1 Plant Catalog Module
- Displays plant cards from `plantsData.js`.
- Supports search, category filtering, size filtering, light requirement filtering, and price range selection.
- Includes sorting options: featured, price low-high, price high-low, name A-Z, and name Z-A.
- Shows beginner-friendly and room collection recommendations.

### 8.2 Plant Details Module
- Displays detailed plant information, including description, price, light, difficulty, size, and care specifics.
- Provides watering tips, beginner notes, humidity guidance, pet safety, and best placement suggestions.
- Offers related plant recommendations.
- Allows users to save a plant to the wishlist or proceed to checkout.

### 8.3 Wishlist Module
- Stores favorite plants in `localStorage`.
- Allows removal of saved plants.
- Provides quick access to view details and buy now from wishlist items.

### 8.4 Checkout and Order Module
- Captures user shipping information, payment selection, and order summary.
- Sends order data to the backend API at `http://localhost:9001/orders`.
- Stores order metadata such as payment method, plant details, and date.

### 8.5 Plant Care Guide Module
- Provides beginner rules for watering, light, leaf observation, and airflow.
- Lists common plant problems and fixes.
- Recommends low-stress starter plants for new users.

### 8.6 Community Module
- Allows users to create posts with mood, location, caption, and optional image.
- Persists community posts in `localStorage` under `plantnest-community-posts`.
- Displays community statistics such as stories, likes, and image posts.
- Enables likes for shared posts.

### 8.7 Authentication Module
- Uses basic local storage-based sign-in and sign-up flow.
- Stores `username` in `localStorage`.

## 9. System Architecture
- Frontend: React, React Router, React Icons, Vite
- Backend: Express, Node.js
- Database: MongoDB with Mongoose
- HTTP requests: Axios
- Local persistence: browser `localStorage`

### 9.1 Frontend Routes
- `/` or `/plants` — Plant catalog
- `/plants/:plantId` — Plant detail page
- `/wishlist` — Wishlist
- `/checkout` — Checkout page
- `/orders` — Order history
- `/community` — Community feed
- `/care-guide` — Plant care guide
- `/signin` — Sign in
- `/signup` — Sign up

### 9.2 Backend APIs
- `GET /orders` — fetch orders
- `POST /orders` — submit a new order
- `GET /wishlist-items` — fetch saved wishlist records
- `POST /wishlist-items` — add wishlist item
- `DELETE /wishlist-items/:id` — remove wishlist item
- `POST /plants` — add plant data

## 10. Implementation Highlights
- `Plants.jsx` supports search, multi-field filtering, and sorting.
- `PlantDetails.jsx` presents a comprehensive care snapshot and related products.
- `Wishlist.jsx` persists saved items and supports direct checkout.
- `PlantCheckout.jsx` includes shipping form fields and payment mode selection.
- `Community.jsx` supports image uploads using `FileReader` and stores posts locally.
- `CareGuide.jsx` provides beginner guidance and common problem solutions.
- `server.js` connects to MongoDB and exposes REST routes for orders and wishlist management.

## 11. Technologies Used
- React 19
- Vite 6
- React Router DOM 7
- Axios
- Express 5
- MongoDB
- Mongoose
- CORS
- Concurrently
- React Icons

## 12. Limitations
- Authentication is basic and not secure for production.
- Payment flow is simulated and does not integrate with real payment gateways.
- Community posts are stored locally in the browser, not shared between users.
- Wishlist persistence is browser-based and not fully synchronized with backend.
- No admin dashboard or product management interface.

## 13. Future Enhancements
- Add secure user authentication and authorization.
- Integrate a real payment gateway.
- Persist community posts and wishlist items in the backend.
- Add admin controls for managing products and orders.
- Implement real-time community interactions like comments and chat.
- Add image upload storage with cloud-backed assets.
- Expand plant recommendations using user preferences.

## 14. Conclusion
Leaf & Bloom is a complete plant shopping experience aimed at beginner plant parents. It combines catalog browsing, wishlist management, checkout, care guidance, and a community sharing feature in a single application. The project demonstrates a strong foundation for a full-featured plant commerce platform with room to grow into a scalable e-commerce and social experience.

## 15. Run Instructions
1. Install dependencies: `npm install`
2. Start the backend server: `npm run server`
3. Start the development server: `npm run dev`
4. Open the app in the browser at `http://localhost:5173` (or the host shown by Vite)
