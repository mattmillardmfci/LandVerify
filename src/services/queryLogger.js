/**
 * Query Logging Service
 * Logs all parcel queries to Firestore
 */

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Log a parcel query to Firestore
 * @param {Object} queryData - Data about the query
 * @param {number} queryData.lat - Latitude
 * @param {number} queryData.lng - Longitude
 * @param {string} queryData.address - Address searched (if applicable)
 * @param {Object} queryData.result - Parcel result data
 * @param {string} queryData.source - "map_click" or "address_search"
 */
export const logQuery = async (queryData) => {
	try {
		const logEntry = {
			...queryData,
			timestamp: serverTimestamp(),
			userAgent: navigator.userAgent,
			ipAddress: "auto-detected", // Will be set by backend if needed
		};

		const docRef = await addDoc(collection(db, "queries"), logEntry);
		console.log("[Logger] Query logged with ID:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("[Logger] Error logging query:", error);
		// Don't throw - logging failures shouldn't break the app
		return null;
	}
};

/**
 * Log a geolocation access
 * @param {Object} location - Geolocation data
 * @param {number} location.latitude - Latitude
 * @param {number} location.longitude - Longitude
 * @param {number} location.accuracy - Accuracy in meters
 */
export const logGeolocation = async (location) => {
	try {
		const logEntry = {
			latitude: location.latitude,
			longitude: location.longitude,
			accuracy: location.accuracy,
			timestamp: serverTimestamp(),
			type: "geolocation_access",
			userAgent: navigator.userAgent,
		};

		const docRef = await addDoc(collection(db, "geolocations"), logEntry);
		console.log("[Logger] Geolocation logged with ID:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("[Logger] Error logging geolocation:", error);
		return null;
	}
};
