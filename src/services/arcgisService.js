/**
 * ArcGIS REST API Service
 * Fetches parcel data from Boone County ArcGIS server via Vercel serverless function
 */

import { addError } from "./errorTracker";

/**
 * Fetch parcel data from Boone County ArcGIS REST API based on clicked coordinates
 * Uses backend proxy to avoid CORS issues
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @returns {Promise<Object|null>} Parcel data with OWNER and ACRES_CALC fields
 */
export const fetchParcelByCoordinates = async (lng, lat) => {
	try {
		console.log("Fetching parcel data via backend proxy for coordinates:", { lng, lat });

		// Call Vercel serverless function instead of direct API call
		const response = await fetch("/api/arcgis", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ lng, lat }),
		});

		if (!response.ok) {
			const errorMsg = `Backend proxy error: ${response.status}`;
			console.error(errorMsg);
			addError(
				{
					message: `HTTP ${response.status}`,
					status: response.status,
				},
				{
					url: "/api/arcgis",
					method: "POST",
				}
			);
			throw new Error(errorMsg);
		}

		const data = await response.json();

		console.log("ArcGIS API Response (via backend):", data);
		return processArcGISResponse(data, lng, lat);
	} catch (error) {
		console.error("Error fetching parcel from ArcGIS:", error);

		// Provide user-friendly error messages
		if (error.message.includes("Failed to fetch")) {
			console.warn("Network error - unable to reach parcel service");
			addError(error, { context: "Network connectivity" });
		}

		throw error;
	}
};

/**
 * Process ArcGIS API response
 * @param {Object} data - Raw data from ArcGIS API
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @returns {Object|null} Processed parcel data
 */
const processArcGISResponse = (data, lng, lat) => {
	// Check if we got an error from ArcGIS
	if (data.error) {
		console.error("ArcGIS returned an error:", data.error);
		throw new Error(`ArcGIS Error: ${data.error.message}`);
	}

	// Check if we got any features back
	if (!data.features || data.features.length === 0) {
		console.warn("No parcel found at this location");
		return null;
	}

	// Get the first feature (closest match)
	const feature = data.features[0];

	console.log("Feature attributes:", feature.attributes);
	console.log("Feature geometry:", feature.geometry);

	// Extract relevant data
	const parcelData = {
		owner: feature.attributes?.OWNER || feature.attributes?.OWNER_NAME || "Unknown Owner",
		acres: feature.attributes?.ACRES_CALC || feature.attributes?.ACRES || 0,
		parcelId: feature.attributes?.PARCEL_ID || feature.attributes?.PIN || feature.attributes?.OBJECTID || "N/A",
		geometry: feature.geometry,
		allAttributes: feature.attributes || {}, // Keep all attributes for potential future use
		coordinates: { lng, lat },
	};

	console.log("Formatted parcel data:", parcelData);
	return parcelData;
};

/**
 * Format parcel data into GeoJSON feature for display on map
 * Converts Esri JSON geometry to standard GeoJSON
 * @param {Object} parcelData - Raw parcel data from ArcGIS
 * @returns {Object} GeoJSON feature
 */
export const formatParcelAsGeoJSON = (parcelData) => {
	if (!parcelData) {
		console.warn("No parcel data provided to formatParcelAsGeoJSON");
		return null;
	}

	console.log("Converting to GeoJSON:", parcelData);

	let geoJsonGeometry = null;

	// Handle Esri JSON geometry format (with rings for polygons)
	if (parcelData.geometry) {
		if (parcelData.geometry.rings) {
			// Polygon geometry - rings format from ArcGIS
			geoJsonGeometry = {
				type: "Polygon",
				coordinates: parcelData.geometry.rings,
			};
			console.log("Converted Esri Polygon to GeoJSON:", geoJsonGeometry);
		} else if (parcelData.geometry.x && parcelData.geometry.y) {
			// Point geometry
			geoJsonGeometry = {
				type: "Point",
				coordinates: [parcelData.geometry.x, parcelData.geometry.y],
			};
			console.log("Converted Esri Point to GeoJSON:", geoJsonGeometry);
		} else if (parcelData.geometry.type === "Polygon") {
			// Already in GeoJSON format
			geoJsonGeometry = parcelData.geometry;
			console.log("Geometry already in GeoJSON format");
		}
	}

	if (!geoJsonGeometry) {
		console.warn("Could not convert geometry to GeoJSON. Geometry:", parcelData.geometry);
		return null;
	}

	const feature = {
		type: "Feature",
		geometry: geoJsonGeometry,
		properties: {
			OWNER: parcelData.owner,
			OWNER_NAME: parcelData.owner, // Keep both for compatibility
			ACRES_CALC: parcelData.acres,
			PARCEL_ID: parcelData.parcelId,
			selected: true,
			...parcelData.allAttributes,
		},
	};

	console.log("Final GeoJSON feature:", feature);
	return feature;
};
