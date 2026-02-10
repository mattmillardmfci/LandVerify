import { useState, useRef } from "react";
import { fetchParcelByCoordinates, formatParcelAsGeoJSON } from "../services/arcgisService";
import { logQuery } from "../services/queryLogger";

/**
 * Custom hook to manage Missouri parcel data
 * Fetches parcel data from Boone County ArcGIS REST API on click
 */
const useMissouriParcels = () => {
	const [parcels, setParcels] = useState({
		type: "FeatureCollection",
		features: [],
	});
	const [selectedParcelData, setSelectedParcelData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const mapRef = useRef(null);

	/**
	 * Handle map click to fetch parcel data from ArcGIS API
	 * Sends lat/lng to Boone County ArcGIS REST API
	 */
	const handleMapClick = async (event) => {
		// Get the clicked coordinates
		const { lng, lat } = event.lngLat;

		console.log("Map clicked at:", lng, lat);

		setIsLoading(true);

		try {
			// Fetch parcel data from ArcGIS API
			const parcelData = await fetchParcelByCoordinates(lng, lat);

			if (!parcelData) {
				// No parcel found at this location
				setSelectedParcelData(null);
				setParcels({
					type: "FeatureCollection",
					features: [],
				});
				setIsLoading(false);
				return null;
			}

			// Convert to GeoJSON feature for display
			const geoJsonFeature = formatParcelAsGeoJSON(parcelData);

			console.log("GeoJSON feature created:", geoJsonFeature);

			if (geoJsonFeature) {
				// Update parcels to show the selected parcel
				const parcelCollection = {
					type: "FeatureCollection",
					features: [geoJsonFeature],
				};
				console.log("Setting parcels:", parcelCollection);
				setParcels(parcelCollection);

				console.log("Setting selected parcel data:", geoJsonFeature);
				setSelectedParcelData(geoJsonFeature);

				// Log this query to Firebase
				await logQuery({
					lat,
					lng,
					address: null,
					result: {
						owner: geoJsonFeature.properties.OWNER,
						acres: geoJsonFeature.properties.ACRES_CALC,
						parcelId: geoJsonFeature.properties.PARCEL_ID,
					},
					source: "map_click",
				});
				setIsLoading(false);
				return geoJsonFeature;
			}

			console.warn("GeoJSON feature is null");

			setIsLoading(false);
			return null;
		} catch (error) {
			console.error("Error fetching parcel data:", error);
			setSelectedParcelData(null);
			setParcels({
				type: "FeatureCollection",
				features: [],
			});
			setIsLoading(false);
			return null;
		}
	};

	return {
		parcels,
		selectedParcelData,
		handleMapClick,
		mapRef,
		isLoading,
	};
};

export default useMissouriParcels;
