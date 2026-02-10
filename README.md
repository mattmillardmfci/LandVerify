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

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

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
│   └── enformion.js         # Enformion API proxy
├── public/
│   └── data/
│       └── missouri_parcels.json  # Missouri parcel GeoJSON data
├── src/
│   ├── components/          # React components
│   │   ├── ContactCard.jsx  # Landowner contact modal
│   │   └── VerifiedBadge.jsx # Verified status badge
│   ├── hooks/               # Custom React hooks
│   │   └── useMissouriParcels.js  # Parcel data management
│   ├── services/            # API services
│   │   └── enformionService.js    # Enformion API client
│   ├── App.jsx              # Main application
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── vercel.json              # Vercel configuration
└── package.json             # Dependencies and scripts
```

## Features

- 🗺️ Interactive Mapbox map centered on Missouri
- 📍 Click parcels to view owner information
- 🔓 Unlock verified contact data (phone, email, address)
- ✅ Verified badge for confirmed data
- 🔒 Secure API key management with Vercel Serverless Functions
- 💎 Glassmorphism UI design
- 🟢 Neon green parcel highlighting

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS + react-map-gl
- **Deployment**: Vercel
- **APIs**: Enformion (Direct Owner Search)

## License

Proprietary - All rights reserved
