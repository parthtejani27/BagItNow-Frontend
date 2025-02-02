# BagItNow - Modern Grocery Shopping Platform

![BagItNow Banner]([public/assets/images/banner.png](https://github.com/user-attachments/assets/33e4cc23-6f84-418c-be32-2f3224c102e4))

BagItNow is a modern, full-featured grocery shopping platform built with React, Redux, and Tailwind CSS. It provides a seamless shopping experience with features like dark mode support, real-time order tracking, and secure payment processing.

[Live Demo](https://bag-it-now-frontend.vercel.app/)

## Features

- 🛒 Intuitive shopping cart management
- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- 🔐 Secure authentication flow
- 📍 Location-based delivery
- 💳 Stripe payment integration
- 🚚 Real-time order tracking
- 🗺️ Google Maps integration

## Tech Stack

- React 18
- Redux Toolkit
- Tailwind CSS
- Vite
- React Router v6
- Stripe Elements
- Google Maps API

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Maps API key
- Stripe publishable key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/parthtejani27/BagItNow-Frontend.git
cd bagit-now-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create environment files:

Create `.env.development` for development:

```env
VITE_APP_NAME=BagItNow
VITE_API_URL=http://localhost:5001/api/v1
VITE_ENABLE_LOGGING=true
VITE_ENABLE_MOCK_DATA=true
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Create `.env.production` for production:

```env
VITE_API_URL=https://api.yourgroceryapp.com/api
VITE_ENABLE_LOGGING=false
VITE_ENABLE_MOCK_DATA=false
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Key Features Implementation

### Theme Support

- Uses CSS variables for theming
- Theme toggle persists across sessions
- Smooth transitions between themes

### Authentication Flow

- Email/Phone verification
- JWT token management
- Secure password recovery

### Shopping Experience

- Real-time cart updates
- Address management
- Payment processing

## Acknowledgments

- Design inspiration from modern e-commerce platforms
- Icons from [Lucide Icons](https://lucide.dev)
