/**
 * Vercel Serverless Function - ArcGIS Parcel API Proxy
 * This function proxies requests to the Boone County ArcGIS server
 * Avoids CORS issues by running on the backend
 */

export default async function handler(req, res) {
	// Only allow POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { lng, lat } = req.body;

	if (typeof lng !== "number" || typeof lat !== "number") {
		return res.status(400).json({ error: "Invalid coordinates" });
	}

	try {
		const params = new URLSearchParams({
			geometry: `${lng},${lat}`,
			geometryType: "esriGeometryPoint",
			spatialRel: "esriSpatialRelIntersects",
			outFields: "*",
			returnGeometry: "true",
			f: "json",
			inSR: "4326",
			outSR: "4326",
		});

		const arcgisUrl = `https://maps.boonecountymo.org/arcgis/rest/services/AS_ParcelMapping/MapServer/0/query?${params.toString()}`;

		console.log("Fetching from ArcGIS:", arcgisUrl);

		const response = await fetch(arcgisUrl, {
			method: "GET",
			headers: {
				"User-Agent": "LandVerify/1.0",
			},
		});

		if (!response.ok) {
			console.error(`ArcGIS returned status: ${response.status}`);
			return res.status(response.status).json({
				error: `ArcGIS API error: ${response.status}`,
			});
		}

		const data = await response.json();

		// Check for ArcGIS errors
		if (data.error) {
			console.error("ArcGIS error:", data.error);
			return res.status(400).json({ error: data.error });
		}

		// Return the data
		res.status(200).json(data);
	} catch (error) {
		console.error("Error proxying ArcGIS request:", error);
		res.status(500).json({
			error: "Failed to fetch parcel data",
			message: error.message,
		});
	}
}
