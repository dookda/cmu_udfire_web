# Google Earth Engine Integration Guide

This guide explains how to integrate Google Earth Engine (GEE) layers into the CMU UDFire web application.

## Setup Instructions

### 1. Google Earth Engine Authentication

**✅ Already Configured!** This project uses service account authentication with the file `fastapi/sakdagee-aac5df75dc7f.json`.

**No manual authentication needed.** The service automatically authenticates when FastAPI starts.

To verify it's working:

```bash
# Start the services
docker-compose up --build

# In another terminal, test GEE authentication
docker-compose exec fastapi python test_gee.py
```

You should see:
```
✓ GEE Service initialized successfully!
✓ NDMI layer retrieved successfully!
✓ All tests passed! GEE is working correctly.
```

For detailed setup information, see [GEE_SETUP.md](GEE_SETUP.md).

### 2. Backend Setup (Already Done)

The following files have been created:

- `fastapi/app/services/gee_service.py` - GEE service with all layer processing logic
- `fastapi/app/routers/gee.py` - API endpoints for GEE layers
- `fastapi/requirements.txt` - Updated with GEE dependencies

### 3. Frontend Setup (Already Done)

The following React files have been created:

- `react/src/services/geeService.js` - API client for GEE endpoints
- `react/src/hooks/useGEELayer.js` - React hook for managing GEE layers
- `react/src/components/GEETileLayer.jsx` - Component to render GEE tiles on map
- `react/src/components/GEELayerControl.jsx` - UI control for layer switching

## Available API Endpoints

### 1. NDMI Drought Layer
```
GET /gee/ndmi?area=ud&end_date=2024-12-31&days=30
```

### 2. NDVI Vegetation Layer
```
GET /gee/ndvi?area=ud&end_date=2024-12-31&days=30
```

### 3. NDWI Water Layer
```
GET /gee/ndwi?area=ud&end_date=2024-12-31&days=30
```

### 4. Burn Scar Detection
```
GET /gee/burn-scar?area=ud&start_date=2024-01-01&end_date=2024-01-31&cloud_cover=30
```

### 5. Biomass Estimation (3PGs)
```
GET /gee/biomass?area=ud&end_date=2024-12-31&days=30
```

### 6. Study Areas List
```
GET /gee/study-areas
```

## Study Area Codes

| Code | Name (English) | Name (Thai) |
|------|---------------|-------------|
| `ud` | Pak Thap, Uttaradit | ปากทับ อุตรดิตถ์ |
| `mt` | Mae Tha, Chiang Mai | แม่ทาเหนือ เชียงใหม่ |
| `ky` | Khun Yuam, Mae Hong Son | ขุนยวม แม่ฮ่องสอน |
| `vs` | Wiang Sa, Nan | เวียงสา น่าน |
| `ms` | Mae Sariang, Mae Hong Son | แม่สะเรียง แม่ฮ่องสอน |
| `st` | Sob Tia, Chiang Mai | สบเตี๊ยะ เชียงใหม่ |

## Usage in React Components

### Method 1: Using the GEELayerControl Component

```jsx
import Map from '../components/Map'
import GEELayerControl from '../components/GEELayerControl'

export default function MyPage() {
  return (
    <Map>
      <GEELayerControl
        studyArea="ud"
        endDate="2024-12-31"
        layerTypes={['ndmi', 'ndvi', 'ndwi']}
        onLayerChange={(layer) => console.log('Layer changed:', layer)}
      />
    </Map>
  )
}
```

### Method 2: Using the Hook Directly

```jsx
import { useState } from 'react'
import Map from '../components/Map'
import GEETileLayer from '../components/GEETileLayer'
import { useGEELayer } from '../hooks/useGEELayer'

export default function MyPage() {
  const [selectedDate, setSelectedDate] = useState('2024-12-31')

  const { loading, error, layerData } = useGEELayer('ndmi', {
    area: 'ud',
    endDate: selectedDate,
    days: 30
  })

  return (
    <div>
      <Map>
        {layerData && (
          <GEETileLayer
            tileUrl={layerData.tile_url}
            opacity={0.7}
          />
        )}
      </Map>

      {loading && <p>Loading layer...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
```

### Method 3: Multiple Layers with Switcher

```jsx
import { useGEELayers } from '../hooks/useGEELayer'
import Map from '../components/Map'
import GEETileLayer from '../components/GEETileLayer'

export default function MyPage() {
  const { activeLayer, switchLayer, loading, layerData } = useGEELayers('ndmi', {
    area: 'ud',
    endDate: '2024-12-31',
    days: 30
  })

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => switchLayer('ndmi')}>NDMI</button>
        <button onClick={() => switchLayer('ndvi')}>NDVI</button>
        <button onClick={() => switchLayer('ndwi')}>NDWI</button>
      </div>

      <Map>
        {layerData && (
          <GEETileLayer
            tileUrl={layerData.tile_url}
            opacity={0.7}
          />
        )}
      </Map>
    </div>
  )
}
```

## Integration into Existing Pages

### NDMIDrought.jsx

```jsx
import GEELayerControl from '../components/GEELayerControl'

// In your NDMIDrought component, inside the Map component:
<Map>
  <GEELayerControl
    studyArea="ud"
    endDate={selectedDate}
    layerTypes={['ndmi', 'ndvi', 'ndwi']}
  />
</Map>
```

### BurnScar.jsx

```jsx
import { useGEELayer } from '../hooks/useGEELayer'
import GEETileLayer from '../components/GEETileLayer'

// In your BurnScar component:
const { loading, layerData } = useGEELayer('burn-scar', {
  area: selectedArea,
  startDate: dateRange.start,
  endDate: dateRange.end,
  cloudCover: 30
})

// Inside Map component:
<Map>
  {layerData?.nbr && (
    <GEETileLayer tileUrl={layerData.nbr.tile_url} opacity={0.6} />
  )}
  {layerData?.burn_scars && (
    <GEETileLayer tileUrl={layerData.burn_scars.tile_url} opacity={0.7} />
  )}
</Map>
```

### Biomass.jsx

```jsx
const { loading, layerData } = useGEELayer('biomass', {
  area: selectedArea,
  endDate: selectedDate,
  days: 30
})

<Map>
  {layerData?.biomass_3pgs && (
    <GEETileLayer tileUrl={layerData.biomass_3pgs.tile_url} opacity={0.7} />
  )}
</Map>
```

## API Response Format

All GEE endpoints return data in this format:

```json
{
  "success": true,
  "data": {
    "tile_url": "https://earthengine.googleapis.com/v1/...",
    "vis_params": {
      "min": -0.5,
      "max": 0.5,
      "palette": ["e66101", "fdb863", "f7f7f7", "b2abd2", "5e3c99"]
    },
    "bounds": [[lng1, lat1], [lng2, lat2], ...],
    "stats": {
      "NDMI_min": -0.3,
      "NDMI_max": 0.5
    }
  },
  "layer_type": "ndmi",
  "area": "ud",
  "end_date": "2024-12-31"
}
```

## Troubleshooting

### 1. Authentication Error
```
Error: Failed to initialize Earth Engine
```
**Solution**: Run the authentication command inside the FastAPI container:
```bash
docker-compose exec fastapi python -c "import ee; ee.Authenticate()"
```

### 2. Layer Not Displaying
- Check browser console for errors
- Verify the API endpoint is returning tile_url
- Check CORS settings in FastAPI
- Ensure MapLibre map is fully loaded before adding layers

### 3. Slow Layer Loading
- GEE processing can take 5-30 seconds depending on:
  - Date range (more days = slower)
  - Study area size
  - Number of satellite images available
  - GEE server load

## Next Steps

1. **Authenticate GEE**: Run the authentication command
2. **Test API**: Visit http://localhost:8000/docs to test endpoints
3. **Update Pages**: Add GEELayerControl to your existing pages
4. **Customize**: Adjust layer opacity, add legends, create layer switchers

## Resources

- [Google Earth Engine Python API](https://developers.google.com/earth-engine/guides/python_install)
- [Sentinel-2 Data](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED)
- [MODIS Data](https://developers.google.com/earth-engine/datasets/catalog/modis)
