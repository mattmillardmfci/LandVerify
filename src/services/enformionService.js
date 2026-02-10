/**
 * Enformion API Service
 * Proxy service to fetch landowner contact data securely
 */

/**
 * Fetch owner data from Enformion API via Vercel serverless function
 * @param {string} ownerName - The name of the property owner
 * @param {string} parcelId - The parcel identifier
 * @returns {Promise<Object>} Contact information (phone, email, address)
 */
export const fetchOwnerData = async (ownerName, parcelId) => {
	try {
		// Call Vercel serverless function instead of direct API call
		const response = await fetch("/api/enformion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ownerName,
				parcelId,
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to fetch owner data");
		}

		const data = await response.json();

		// Return the contact data
		return {
			phone: data.phone || null,
			email: data.email || null,
			address: data.address || null,
			verified: data.verified || false,
		};
	} catch (error) {
		console.error("Error in fetchOwnerData:", error);

		// For development/demo purposes, return mock data
		// Remove this in production once Enformion API is integrated
		if (import.meta.env.DEV) {
			return {
				phone: "(573) 555-0123",
				email: "landowner@missouri.com",
				address: "123 Farm Road, Jefferson City, MO 65101",
				verified: true,
			};
		}

		throw error;
	}
};
