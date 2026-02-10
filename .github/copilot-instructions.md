# LandVerify Project Guidelines

## Core Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Mapping: Mapbox GL JS (Web)
- Data Source: MSDIS (Missouri Spatial Data) GeoJSON
- Contact API: Enformion (Direct Owner Search)

## UI Logic
- All landowner contact data must display a "Verified" badge (Green Checkmark) if found.
- Phone numbers and emails should be blurred by default behind a "Unlock Outreach" button.
- Parcel boundaries should be highlighted in neon green (#39FF14) when selected.

## Missouri Context
- Only allow the map to zoom and pan within Missouri state boundaries.
- Default map center: 38.5767° N, 92.1735° W (Jefferson City, MO).

## Architecture
- **components/**: Reusable UI components (ContactCard, VerifiedBadge, etc.)
- **hooks/**: Custom React hooks (useMissouriParcels, etc.)
- **services/**: API integration services (Enformion proxy, parcel data fetching)

## Security
- Never expose API keys on the client side
- Use Vercel Serverless Functions to proxy sensitive API calls
- Store API keys in environment variables

## Styling
- Use Tailwind CSS utility classes for all styling
- Glassmorphism effect for modal overlays
- Neon green (#39FF14) for selected parcels
- Responsive design for mobile and desktop
