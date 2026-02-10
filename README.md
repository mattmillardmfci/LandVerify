# LandVerify

Missouri land owner verification platform built with React, Vite, and Mapbox GL JS.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Mapbox account and access token
- Enformion API key (optional for development)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your tokens:
   - `VITE_MAPBOX_ACCESS_TOKEN`: Your Mapbox access token
   - `ENFORMION_API_KEY`: Your Enformion API key (server-side only)

4. Add Missouri parcel data:
   - Place your Missouri parcel GeoJSON file at `/public/data/missouri_parcels.json`
   - The file should follow GeoJSON format with `OWNER_NAME` and `PARCEL_ID` properties

### Development

Run the full development environment (frontend + backend API):

```bash
npm run dev:full
```

This will start:
- **Vite dev server** at `http://localhost:3000`
- **Express API server** at `http://localhost:3001`

You can also run them separately:

```bash
# Frontend only
npm run dev

# API server only
npm run dev:api
```

The Express API server provides:
- Mock parcel data fallback when ArcGIS is unavailable
- Parcel boundary generation for the map viewport
- CORS proxy for ArcGIS requests

### Building for Production

```bash
npm run build
```

### Deploying to Vercel

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `VITE_MAPBOX_ACCESS_TOKEN`
   - `ENFORMION_API_KEY`

## Project Structure

```
LandVerify/
├── api/                      # Vercel Serverless Functions
│   ├── arcgis.js            # ArcGIS API proxy with mock fallback
│   ├── enformion.js         # Enformion API proxy
│   └── parcels-bounds.js    # Parcel boundary generation for viewport
├── src/
│   ├── components/          # React components
│   │   ├── AdminPanel.jsx   # Password-protected admin dashboard
│   │   ├── ContactCard.jsx  # Landowner contact modal
│   │   └── VerifiedBadge.jsx # Verified status badge
│   ├── config/
│   │   └── firebase.js      # Firebase initialization
│   ├── hooks/               # Custom React hooks
│   │   └── useMissouriParcels.js  # Parcel data management
│   ├── services/            # API services
│   │   ├── arcgisService.js      # ArcGIS API client
│   │   ├── enformionService.js   # Enformion API client
│   │   ├── geocodingService.js   # Mapbox Geocoding API
│   │   └── queryLogger.js        # Firebase logging service
│   ├── App.jsx              # Main application
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles (Tailwind)
├── server.js                # Local Express API server (development)
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── FIREBASE_SETUP.md        # Firebase setup instructions
└── package.json             # Dependencies and scripts
```

## Features

- 🗺️ Interactive Mapbox map centered on Missouri
- 🏘️ **Always-visible parcel boundaries** across the entire map viewport
- 📍 Click parcels to view detailed owner information
- 🔍 Address search with autocomplete (powered by Mapbox Geocoding)
- 📍 Auto-zoom to user's geolocation on load
- 🔓 Unlock verified contact data (phone, email, address)
- ✅ Verified badge for confirmed data
- 🔥 Firebase Firestore integration for query logging
- 🔐 Admin panel with password protection to view all queries
- 🔒 Secure API key management with Vercel Serverless Functions
- 💎 Glassmorphism UI design
- 🟢 Neon green (#39FF14) parcel highlighting

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3.4
- **Mapping**: Mapbox GL JS 3.1 + react-map-gl 7.1
- **Backend**: Express 4.18 (local) + Vercel Serverless Functions (production)
- **Database**: Firebase Firestore (query logging)
- **APIs**: 
  - Boone County ArcGIS REST API (parcel data)
  - Mapbox Geocoding API (address search)
  - Enformion API (contact data - planned)

## License

Proprietary - All rights reserved
