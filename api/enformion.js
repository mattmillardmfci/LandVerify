/**
 * Vercel Serverless Function - Enformion API Proxy
 * This function securely calls the Enformion API without exposing the API key to the client
 */

export default async function handler(req, res) {
	// Only allow POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	// Get API key from environment variables
	const apiKey = process.env.ENFORMION_API_KEY;

	if (!apiKey) {
		console.error("ENFORMION_API_KEY not configured");
		return res.status(500).json({ error: "API key not configured" });
	}

	const { ownerName, parcelId } = req.body;

	if (!ownerName) {
		return res.status(400).json({ error: "Owner name is required" });
	}

	try {
		// TODO: Replace with actual Enformion API endpoint and implementation
		// This is a placeholder structure

		// Example Enformion API call structure:
		// const response = await fetch('https://api.enformion.com/v1/direct-owner-search', {
		//   method: 'POST',
		//   headers: {
		//     'Authorization': `Bearer ${apiKey}`,
		//     'Content-Type': 'application/json',
		//   },
		//   body: JSON.stringify({
		//     name: ownerName,
		//     parcel_id: parcelId,
		//   }),
		// });
		//
		// if (!response.ok) {
		//   throw new Error('Enformion API request failed');
		// }
		//
		// const data = await response.json();

		// For now, return mock data until Enformion integration is complete
		// Remove this section when implementing real API
		const mockData = {
			phone: "(573) 555-0123",
			email: "landowner@missouri.com",
			address: "123 Farm Road, Jefferson City, MO 65101",
			verified: true,
		};

		return res.status(200).json(mockData);

		// When implementing real API, return actual data:
		// return res.status(200).json({
		//   phone: data.phone || null,
		//   email: data.email || null,
		//   address: data.address || null,
		//   verified: data.verified || false,
		// });
	} catch (error) {
		console.error("Error calling Enformion API:", error);
		return res.status(500).json({
			error: "Failed to fetch owner data",
			message: error.message,
		});
	}
}
