/**
 * Mock ArcGIS API for local development
 * This file is only used when running `npm run dev` locally
 */

export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { lng, lat } = req.body;

	console.log("[Mock API] Received coordinates:", { lng, lat });

	// Mock response based on coordinates
	// This simulates a parcel at the clicked location
	const mockResponse = {
		features: [
			{
				attributes: {
					OWNER: "John Smith",
					ACRES_CALC: 2.5,
					PARCEL_ID: "MOCK-001",
					OBJECTID: 1234,
				},
				geometry: {
					rings: [
						[
							[lng - 0.001, lat - 0.001],
							[lng + 0.001, lat - 0.001],
							[lng + 0.001, lat + 0.001],
							[lng - 0.001, lat + 0.001],
							[lng - 0.001, lat - 0.001],
						],
					],
				},
			},
		],
	};

	// Simulate network delay
	setTimeout(() => {
		res.status(200).json(mockResponse);
	}, 300);
}
