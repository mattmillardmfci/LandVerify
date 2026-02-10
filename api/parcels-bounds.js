// Vercel serverless function to get parcels for map bounds
export default async function handler(req, res) {
	// Only allow POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { bounds } = req.body;

		if (!bounds || bounds.length !== 2) {
			return res.status(400).json({ error: "Invalid bounds format" });
		}

		console.log("[API] Getting parcels for bounds:", bounds);

		// Mock parcel database (same as server.js)
		const MOCK_PARCELS = [
			{
				OWNER: "SMITH, JOHN & JANE",
				ACRES_CALC: 2.5,
				PARCEL_ID: "12-345-678",
			},
			{
				OWNER: "JOHNSON, ROBERT L",
				ACRES_CALC: 1.8,
				PARCEL_ID: "12-345-679",
			},
			{
				OWNER: "COLUMBIA UTILITIES LLC",
				ACRES_CALC: 5.2,
				PARCEL_ID: "12-345-680",
			},
			{
				OWNER: "STEPHENS COLLEGE",
				ACRES_CALC: 12.0,
				PARCEL_ID: "12-345-681",
			},
		];

		// Helper function to generate realistic parcel geometry
		function generateParcelGeometry(lng, lat, acres) {
			// Approximate conversion: 1 acre ≈ 0.0015625 square degrees (rough approximation)
			const sizeInDegrees = Math.sqrt(acres * 0.0015625);

			// Create a polygon around the center point
			const halfSize = sizeInDegrees / 2;
			const polygon = [
				[
					[lng - halfSize, lat - halfSize],
					[lng + halfSize, lat - halfSize],
					[lng + halfSize, lat + halfSize],
					[lng - halfSize, lat + halfSize],
					[lng - halfSize, lat - halfSize], // Close the polygon
				],
			];

			return {
				type: "Polygon",
				coordinates: polygon,
			};
		}

		const parcels = [];
		const [west, south] = bounds[0];
		const [east, north] = bounds[1];

		// Generate a grid of parcels across the viewport
		const spacing = 0.008; // approximately 500 meters between parcels

		for (let lng = west; lng < east; lng += spacing) {
			for (let lat = south; lat < north; lat += spacing) {
				// Pick a random mock parcel from our database
				const mockParcel = MOCK_PARCELS[Math.floor(Math.random() * MOCK_PARCELS.length)];

				// Create a GeoJSON feature for this parcel
				const feature = {
					type: "Feature",
					properties: {
						OBJECTID: parcels.length + 1,
						OWNER: mockParcel.OWNER,
						ACRES_CALC: mockParcel.ACRES_CALC,
						PARCEL_ID: `${mockParcel.PARCEL_ID}-${parcels.length}`,
					},
					geometry: generateParcelGeometry(lng, lat, mockParcel.ACRES_CALC),
				};

				parcels.push(feature);
			}
		}

		console.log(`[API] Generated ${parcels.length} parcels`);

		// Return a GeoJSON FeatureCollection
		const geoJson = {
			type: "FeatureCollection",
			features: parcels,
		};

		return res.status(200).json(geoJson);
	} catch (error) {
		console.error("[API] Error generating parcels:", error);
		return res.status(500).json({
			error: "Error generating parcels",
			details: error.message,
		});
	}
}
