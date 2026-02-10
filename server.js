/**
 * Local development server for LandVerify API endpoints
 * Run with: node server.js
 */

import express from "express";
import axios from "axios";

const app = express();
const PORT = 3001;

app.use(express.json());

// Real Boone County ArcGIS service URL (fallback to mock if unreachable)
const BOONE_COUNTY_ARCGIS_URL =
	"https://maps.boonecountymo.org/arcgis/rest/services/AS_ParcelMapping/MapServer/0/query";

// Mock parcel database - simulates real Boone County data
const MOCK_PARCELS = [
	{
		owner: "Smith, John & Mary",
		acres: 3.45,
		parcelId: "BC-2024-001245",
		address: "3708 N Oakland Gravel Road",
	},
	{
		owner: "Johnson Family Trust",
		acres: 15.2,
		parcelId: "BC-2024-001246",
		address: "405 Bear Creek Road",
	},
	{
		owner: "Columbia Municipal Utilities",
		acres: 2.1,
		parcelId: "BC-2024-001247",
		address: "Downtown District",
	},
	{
		owner: "Stephens College Foundation",
		acres: 87.5,
		parcelId: "BC-2024-001248",
		address: "College Avenue Campus",
	},
];

// Function to generate realistic parcel polygon around coordinates
const generateParcelGeometry = (lng, lat, acres) => {
	// Approximate acres to polygon size
	// 1 acre ≈ 0.000013 degrees square
	const size = Math.sqrt(acres * 0.000013);

	return {
		rings: [
			[
				[lng - size, lat - size],
				[lng + size, lat - size],
				[lng + size, lat + size],
				[lng - size, lat + size],
				[lng - size, lat - size],
			],
		],
	};
};

// Mock/Real ArcGIS API endpoint
app.post("/api/arcgis", async (req, res) => {
	const { lng, lat } = req.body;

	console.log("[API] Received coordinates:", { lng, lat });

	try {
		// Build ArcGIS query parameters
		const params = {
			geometry: `${lng},${lat}`,
			geometryType: "esriGeometryPoint",
			spatialRel: "esriSpatialRelIntersects",
			inSR: "4326",
			outSR: "4326",
			outFields: "*",
			returnGeometry: "true",
			f: "json",
		};

		console.log("[API] Attempting to fetch from real ArcGIS service...");

		const response = await axios.get(BOONE_COUNTY_ARCGIS_URL, {
			params: params,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				Accept: "application/json",
			},
			timeout: 5000,
		});

		console.log(`[API] Real ArcGIS data received`);
		console.log("[API] Features found:", response.data.features?.length || 0);

		if (response.data.error) {
			console.error("[API] ArcGIS error response:", response.data.error);
			throw new Error(response.data.error.message);
		}

		// Return the real data
		res.json(response.data);
	} catch (error) {
		console.warn("[API] Real ArcGIS request failed:", error.message);
		console.log("[API] Falling back to realistic mock data...");

		// Select a random parcel from mock database
		const mockParcel = MOCK_PARCELS[Math.floor(Math.random() * MOCK_PARCELS.length)];
		const mockResponse = {
			objectIdFieldName: "OBJECTID",
			globalIdFieldName: "",
			geometryType: "esriGeometryPolygon",
			spatialReference: {
				wkid: 4326,
				latestWkid: 4326,
			},
			features: [
				{
					attributes: {
						OBJECTID: Math.floor(Math.random() * 999999),
						OWNER: mockParcel.owner,
						ACRES_CALC: mockParcel.acres,
						PARCEL_ID: mockParcel.parcelId,
						ADDRESS: mockParcel.address,
						ASSESSED_VALUE: Math.floor(mockParcel.acres * 45000),
						LAST_SALE_PRICE: Math.floor(mockParcel.acres * 50000),
						LAST_SALE_DATE: "2023-06-15",
					},
					geometry: generateParcelGeometry(lng, lat, mockParcel.acres),
				},
			],
		};

		console.log("[API] Mock parcel owner:", mockParcel.owner);
		console.log("[API] Mock parcel acres:", mockParcel.acres);

		res.json(mockResponse);
	}
});

// Get all parcels in viewport (for displaying parcel boundaries)
app.post("/api/parcels/bounds", async (req, res) => {
	const { bounds } = req.body; // [[west, south], [east, north]]
	console.log("[API] Getting parcels for bounds:", bounds);

	// Generate a grid of parcels across the bounds
	const parcels = [];
	const [west, south] = bounds[0];
	const [east, north] = bounds[1];

	// Create a grid of parcels (e.g., 0.01 degree spacing)
	const spacing = 0.008; // approximately 500m
	for (let lng = west; lng < east; lng += spacing) {
		for (let lat = south; lat < north; lat += spacing) {
			const mockParcel = MOCK_PARCELS[Math.floor(Math.random() * MOCK_PARCELS.length)];
			parcels.push({
				type: "Feature",
				properties: {
					OBJECTID: Math.floor(Math.random() * 999999),
					OWNER: mockParcel.owner,
					ACRES_CALC: mockParcel.acres,
					PARCEL_ID: `${mockParcel.parcelId}-${Math.floor(lng * 1000)}-${Math.floor(lat * 1000)}`,
				},
				geometry: {
					type: "Polygon",
					coordinates: [
						[
							[lng, lat],
							[lng + spacing, lat],
							[lng + spacing, lat + spacing],
							[lng, lat + spacing],
							[lng, lat],
						],
					],
				},
			});
		}
	}

	const geoJson = {
		type: "FeatureCollection",
		features: parcels,
	};

	console.log(`[API] Generated ${parcels.length} parcels for viewport`);
	res.json(geoJson);
});

app.listen(PORT, () => {
	console.log(`🚀 Local API server running on http://localhost:${PORT}`);
	console.log(`   Proxying to Boone County ArcGIS service`);
});
