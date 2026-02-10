# Missouri Parcel Data Sources

## Current Status
The Boone County ArcGIS service (`https://maps.boonecountymo.org/arcgis/rest/services/AS_ParcelMapping/MapServer/0/query`) is currently **UNREACHABLE** (DNS resolution fails).

We are using **mock data** as a fallback, which is causing performance issues when trying to display viewport-wide parcels.

## Real Data Sources to Investigate

### 1. Missouri Spatial Data Information Service (MSDIS)
**URL:** https://msdis.missouri.edu/  
**Description:** Official state GIS data portal  
**Potential Datasets:**
- County parcel boundaries
- Property ownership records
- Tax assessment data

**How to Access:**
1. Visit MSDIS website
2. Look for "Parcel" or "Cadastral" datasets
3. Check if they offer:
   - GeoJSON/Shapefile downloads
   - WFS (Web Feature Service) API
   - REST API endpoint

### 2. Boone County GIS Department
**Contact:** Boone County Resource Management  
**Phone:** (573) 886-4305  
**Website:** https://www.showmeboone.com/resource-management/

**Request:**
- Working ArcGIS REST API endpoint
- Alternative data access methods (WFS, WMS, file downloads)
- API documentation

### 3. Missouri Open Data Portal
**URL:** https://data.mo.gov/  
**Description:** State-level open data initiative  
**Search For:**
- "Parcels"
- "Property"
- "Cadastral"
- "Land ownership"

### 4. Alternative Boone County GIS Services
Try alternative endpoints on the Boone County server:
```
https://maps.boonecountymo.org/arcgis/rest/services/
```

Check for:
- Different service names
- Updated URLs
- Mirror servers

### 5. Commercial Data Providers

#### Esri ArcGIS Online
- **URL:** https://www.arcgis.com/
- **Search:** "Boone County Missouri Parcels"
- May have publicly shared layers

#### OpenStreetMap (OSM)
- **URL:** https://www.openstreetmap.org/
- **API:** Overpass API
- Limited parcel data but may have property boundaries

#### CoreLogic / First American
- Commercial property data providers
- Requires paid subscription
- Comprehensive parcel and ownership data

## Recommended Implementation Strategy

### Phase 1: Verify Boone County Service
1. Contact Boone County GIS department directly
2. Verify if `maps.boonecountymo.org` is the correct domain
3. Request updated API documentation
4. Check if firewall or authentication is required

### Phase 2: Explore MSDIS
1. Download sample parcel data for Boone County
2. Host static GeoJSON on your own server/CDN
3. Implement file-based parcel lookup
4. Update quarterly or as needed

### Phase 3: Implement Tiling System
Instead of loading all parcels at once:
1. Pre-process parcel data into **vector tiles** (MVT format)
2. Use **Tippecanoe** to create tile pyramid
3. Serve tiles via **Mapbox** or self-hosted **TileServer GL**
4. Only visible parcels load based on zoom level

### Phase 4: Optimize Query Strategy
For click-based queries:
1. Keep single parcel query on click (current system)
2. Add spatial index to speed up lookups
3. Cache frequently accessed parcels
4. Disable viewport-wide loading until tiling is ready

## Technical Requirements for New Source

### Must Have:
- ✅ GeoJSON or compatible format
- ✅ Owner name field
- ✅ Acreage/area field
- ✅ Parcel ID field
- ✅ Geometry (polygon boundaries)

### Nice to Have:
- Address field
- Assessed value
- Last sale date/price
- Zoning information
- API with spatial query support

### Performance Considerations:
- Vector tiles preferred for viewport display
- REST API for click queries
- Maximum 1000 parcels per request
- Response time < 2 seconds

## Example: Vector Tile Workflow

```bash
# 1. Download/export parcel data as GeoJSON
wget https://data-source.com/boone-county-parcels.geojson

# 2. Convert to vector tiles using Tippecanoe
tippecanoe -o parcels.mbtiles \
  --maximum-zoom=18 \
  --minimum-zoom=12 \
  --drop-densest-as-needed \
  --extend-zooms-if-still-dropping \
  boone-county-parcels.geojson

# 3. Host tiles on Mapbox or TileServer GL
# 4. Add as layer in Mapbox GL JS
map.addSource('parcels-tiles', {
  type: 'vector',
  url: 'mapbox://yourusername.parcels'
});
```

## Immediate Action Items

1. ✅ **DONE:** Disable viewport parcel loading to prevent crashes
2. ⏳ **TODO:** Contact Boone County GIS department
3. ⏳ **TODO:** Search MSDIS for downloadable parcel data
4. ⏳ **TODO:** Implement vector tile pipeline if static data available
5. ⏳ **TODO:** Re-enable viewport loading with zoom restrictions and tile-based approach

## Contact Information

**Boone County Resource Management**
- Address: 613 E. Ash St., Columbia, MO 65201
- Phone: (573) 886-4305
- Email: resource@boonecountymo.org

**MSDIS Support**
- Website: https://msdis.missouri.edu/
- Email: Use contact form on website

## Notes
- Mock data is only suitable for **development/testing**
- Production requires **real, verified parcel data**
- Consider legal requirements for displaying property ownership data
- Ensure compliance with county/state data usage policies
