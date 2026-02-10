# ArcGIS Integration Documentation

## Boone County Parcel Data Integration

LandVerify now fetches real-time parcel data from the Boone County ArcGIS REST API.

### API Endpoint

```
https://maps.boonecountymo.org/arcgis/rest/services/AS_ParcelMapping/MapServer/0/query
```

### How It Works

1. **User Interaction**: When a user clicks anywhere on the map, the application captures the latitude and longitude coordinates.

2. **API Request**: The coordinates are sent to the Boone County ArcGIS REST API with the following parameters:
   - `geometry`: The clicked coordinates (lng, lat)
   - `geometryType`: `esriGeometryPoint`
   - `spatialRel`: `esriSpatialRelIntersects`
   - `outFields`: `*` (returns all fields)
   - `returnGeometry`: `true`
   - `f`: `json`
   - `inSR`: `4326` (WGS84 coordinate system)
   - `outSR`: `4326`

3. **Response Parsing**: The API returns JSON data containing:
   - `OWNER`: Property owner name
   - `ACRES_CALC`: Calculated parcel size in acres
   - `PARCEL_ID`: Unique parcel identifier
   - Additional parcel attributes

4. **Display**: The data is formatted and displayed in the ContactCard modal with:
   - Owner name
   - Parcel size (formatted to 2 decimal places)
   - Parcel ID
   - Neon green highlighting on the map

### Code Structure

#### Service Layer (`src/services/arcgisService.js`)

- `fetchParcelByCoordinates(lng, lat)`: Fetches parcel data from ArcGIS API
- `formatParcelAsGeoJSON(parcelData)`: Converts API response to GeoJSON format

#### Hook (`src/hooks/useMissouriParcels.js`)

- `handleMapClick(event)`: Async function that:
  1. Extracts coordinates from click event
  2. Calls ArcGIS API
  3. Updates state with parcel data
  4. Returns formatted GeoJSON feature

#### Component (`src/App.jsx`)

- Handles map click events
- Shows loading indicator during API requests
- Displays parcel data in ContactCard modal

### Example API Request

```javascript
const params = new URLSearchParams({
	geometry: "-92.1735,38.5767",
	geometryType: "esriGeometryPoint",
	spatialRel: "esriSpatialRelIntersects",
	outFields: "*",
	returnGeometry: "true",
	f: "json",
	inSR: "4326",
	outSR: "4326",
});

const url = `https://maps.boonecountymo.org/arcgis/rest/services/AS_ParcelMapping/MapServer/0/query?${params}`;
```

### Example API Response

```json
{
  "features": [
    {
      "attributes": {
        "OWNER": "John Smith",
        "ACRES_CALC": 40.5,
        "PARCEL_ID": "12-34-56-78",
        // ... other attributes
      },
      "geometry": {
        "rings": [[[x1, y1], [x2, y2], ...]]
      }
    }
  ]
}
```

### Error Handling

- If no parcel is found at the clicked location, the modal doesn't appear
- API errors are logged to console
- Loading states prevent multiple simultaneous requests
- Graceful fallback if API is unavailable

### Future Enhancements

- Cache recently fetched parcels to reduce API calls
- Add support for multiple counties (not just Boone County)
- Implement parcel search by address or owner name
- Add parcel boundary visualization on the map
