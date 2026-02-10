/**
 * Geocoding Service
 * Converts addresses to coordinates using Mapbox Geocoding API
 */

export const geocodeAddress = async (address) => {
	try {
		const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
		if (!token) {
			throw new Error("Mapbox token not configured");
		}

		const encodedAddress = encodeURIComponent(address);
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?proximity=-92.33,38.95&country=us&limit=5&access_token=${token}`;

		console.log("Geocoding address:", address);
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Geocoding failed with status ${response.status}`);
		}

		const data = await response.json();
		console.log("Geocoding results:", data);

		if (!data.features || data.features.length === 0) {
			return null;
		}

		// Get the first (most relevant) result
		const feature = data.features[0];
		const [lng, lat] = feature.center;

		return {
			address: feature.place_name,
			latitude: lat,
			longitude: lng,
			coordinates: { lat, lng },
		};
	} catch (error) {
		console.error("Error geocoding address:", error);
		throw error;
	}
};
