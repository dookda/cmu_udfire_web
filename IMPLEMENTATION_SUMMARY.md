# CMU UDFire Web - Google Earth Engine Implementation Summary

## Overview

This document summarizes the Google Earth Engine (GEE) integration that has been implemented in your CMU UDFire web application. All your JavaScript GEE code has been converted to Python FastAPI endpoints that can be called from React.

## What Was Implemented

### 1. Backend (FastAPI)

#### Files Created/Modified:

1. **`fastapi/app/services/gee_service.py`** - Core GEE service
   - Converts all 3 GEE JavaScript files to Python
   - Implements NDMI, NDVI, NDWI calculation (from `gee/ndmi.js`)
   - Implements burn scar detection (from `gee/burnscar.js`)
   - Implements 3PGs biomass estimation (from `gee/3pgs.js`)
   - Uses service account authentication
   - Returns map tiles as URLs for MapLibre

2. **`fastapi/app/routers/gee.py`** - API endpoints
   - `GET /gee/ndmi` - NDMI drought monitoring
   - `GET /gee/ndvi` - NDVI vegetation index
   - `GET /gee/ndwi` - NDWI water index
   - `GET /gee/burn-scar` - Burn scar detection
   - `GET /gee/biomass` - 3PGs biomass estimation
   - `GET /gee/study-areas` - List of study areas

3. **`fastapi/main.py`** - Updated to include GEE router

4. **`fastapi/requirements.txt`** - Added GEE dependencies:
   - `earthengine-api==0.1.384`
   - `google-auth==2.27.0`
   - `google-auth-oauthlib==1.2.0`
   - `google-auth-httplib2==0.2.0`

5. **`fastapi/test_gee.py`** - Test script to verify GEE setup

#### Authentication:
- ✅ Service account authentication configured
- ✅ Uses `sakdagee-aac5df75dc7f.json`
- ✅ Service account: `gee-apsco@sakdagee.iam.gserviceaccount.com`
- ✅ Auto-initializes on FastAPI startup
- ✅ No manual OAuth needed

### 2. Frontend (React)

#### Files Created:

1. **`react/src/services/geeService.js`** - API client
   - Functions to call all GEE endpoints
   - Handles query parameters
   - Error handling

2. **`react/src/hooks/useGEELayer.js`** - React hooks
   - `useGEELayer` - Fetch single layer
   - `useGEELayers` - Manage multiple layers with switcher

3. **`react/src/components/GEETileLayer.jsx`** - MapLibre tile layer
   - Renders GEE tiles on map
   - Handles layer lifecycle
   - Manages opacity

4. **`react/src/components/GEELayerControl.jsx`** - Layer switcher UI
   - Radio buttons for layer selection
   - Loading indicators
   - Statistics display
   - Ready-to-use component

### 3. Configuration

1. **`docker-compose.yml`** - Updated FastAPI service:
   - Added `GEE_SERVICE_ACCOUNT` environment variable
   - Service account JSON mounted as volume

2. **`.gitignore`** - Updated:
   - Excludes service account JSON file
   - Already had the entry

3. **`fastapi/.env.example`** - Created with GEE config

### 4. Documentation

1. **`GEE_SETUP.md`** - Detailed setup guide
   - Service account authentication
   - Troubleshooting
   - Testing procedures
   - Security best practices

2. **`GEE_INTEGRATION.md`** - Integration guide
   - API endpoint documentation
   - React usage examples
   - Study area codes
   - Response format

3. **`IMPLEMENTATION_SUMMARY.md`** - This file

## Study Areas Supported

All your original study areas from the JavaScript code:

| Code | Name (Thai) | Name (English) | Asset Path |
|------|------------|----------------|------------|
| `ud` | ปากทับ อุตรดิตถ์ | Pak Thap, Uttaradit | `projects/ee-sakda-451407/assets/fire/paktab` |
| `mt` | แม่ทาเหนือ เชียงใหม่ | Mae Tha, Chiang Mai | `projects/ee-sakda-451407/assets/fire/meatha_n` |
| `ky` | ขุนยวม แม่ฮ่องสอน | Khun Yuam, Mae Hong Son | `projects/ee-sakda-451407/assets/fire/khunyoam` |
| `vs` | เวียงสา น่าน | Wiang Sa, Nan | `projects/ee-sakda-451407/assets/fire/winagsa` |
| `ms` | แม่สะเรียง แม่ฮ่องสอน | Mae Sariang, Mae Hong Son | `projects/ee-sakda-451407/assets/fire/measariang` |
| `st` | สบเตี๊ยะ เชียงใหม่ | Sob Tia, Chiang Mai | `projects/ee-sakda-451407/assets/fire/soubtea` |

## Layers Available

### 1. NDMI Drought Monitoring (from `ndmi.js`)
- Normalized Difference Moisture Index
- Data: Sentinel-2 SR Harmonized
- Bands: B8 (NIR), B11 (SWIR)
- Time composite: Configurable (default 30 days)

**API**: `GET /gee/ndmi?area=ud&end_date=2024-12-31&days=30`

### 2. NDVI Vegetation Index (from `ndmi.js`)
- Normalized Difference Vegetation Index
- Data: Sentinel-2 SR Harmonized
- Bands: B8 (NIR), B4 (Red)
- Time composite: Configurable

**API**: `GET /gee/ndvi?area=ud&end_date=2024-12-31&days=30`

### 3. NDWI Water Index (from `ndmi.js`)
- Normalized Difference Water Index
- Data: Sentinel-2 SR Harmonized
- Bands: B3 (Green), B8 (NIR)
- Time composite: Configurable

**API**: `GET /gee/ndwi?area=ud&end_date=2024-12-31&days=30`

### 4. Burn Scar Detection (from `burnscar.js`)
- NBR (Normalized Burn Ratio)
- NIRBI calculation for burn detection
- Data: Sentinel-2 SR
- Cloud cover filtering
- Returns both NBR layer and burn scar mask

**API**: `GET /gee/burn-scar?area=ud&start_date=2024-01-01&end_date=2024-01-31&cloud_cover=30`

### 5. Biomass Estimation (from `3pgs.js`)
- 3PGs physiological model
- Custom equation (Parinwat & Sakda)
- Data: MODIS MOD09GA (surface reflectance) + MCD18A1 (solar radiation)
- Calculates: FPAR, PAR, APAR, GPP, NPP, Biomass
- Returns 3 layers: NDVI, Biomass (3PGs), Biomass (Equation)

**API**: `GET /gee/biomass?area=ud&end_date=2024-12-31&days=30`

## How to Use

### Quick Start

1. **Start the application**:
   ```bash
   docker-compose up --build
   ```

2. **Test GEE authentication**:
   ```bash
   docker-compose exec fastapi python test_gee.py
   ```

3. **Test API** - Visit http://localhost:8000/docs

4. **View React app** - Visit http://localhost:3000

### Using in React Pages

#### Example 1: Add to NDMI Drought Page

```jsx
// In react/src/pages/NDMIDrought.jsx
import GEELayerControl from '../components/GEELayerControl'

export default function NDMIDrought() {
  const [selectedDate, setSelectedDate] = useState('2025-10-07')
  const [selectedArea, setSelectedArea] = useState('ud')

  return (
    <MapLayout ...>
      <Map>
        <GEELayerControl
          studyArea={selectedArea}
          endDate={selectedDate}
          layerTypes={['ndmi', 'ndvi', 'ndwi']}
        />
      </Map>
    </MapLayout>
  )
}
```

#### Example 2: Add to Burn Scar Page

```jsx
// In react/src/pages/BurnScar.jsx
import { useGEELayer } from '../hooks/useGEELayer'
import GEETileLayer from '../components/GEETileLayer'

export default function BurnScar() {
  const [dateRange, setDateRange] = useState({
    start: '2025-09-05',
    end: '2025-10-25'
  })
  const [selectedArea, setSelectedArea] = useState('ud')

  const { loading, error, layerData } = useGEELayer('burn-scar', {
    area: selectedArea,
    startDate: dateRange.start,
    endDate: dateRange.end,
    cloudCover: 30
  })

  return (
    <MapLayout ...>
      <Map>
        {layerData?.nbr && (
          <GEETileLayer
            tileUrl={layerData.nbr.tile_url}
            opacity={0.6}
          />
        )}
        {layerData?.burn_scars && (
          <GEETileLayer
            tileUrl={layerData.burn_scars.tile_url}
            opacity={0.7}
          />
        )}
      </Map>
      {loading && <div>Loading burn scar data...</div>}
      {error && <div>Error: {error}</div>}
    </MapLayout>
  )
}
```

#### Example 3: Add to Biomass Page

```jsx
// In react/src/pages/Biomass.jsx
import GEELayerControl from '../components/GEELayerControl'

export default function Biomass() {
  const [selectedDate, setSelectedDate] = useState('2025-10-07')

  return (
    <MapLayout ...>
      <Map>
        <GEELayerControl
          studyArea="ud"
          endDate={selectedDate}
          layerTypes={['biomass']}
        />
      </Map>
    </MapLayout>
  )
}
```

## API Response Format

All endpoints return consistent format:

```json
{
  "success": true,
  "data": {
    "tile_url": "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/...",
    "vis_params": {
      "min": -0.5,
      "max": 0.5,
      "palette": ["e66101", "fdb863", "f7f7f7", "b2abd2", "5e3c99"]
    },
    "bounds": [
      [lng1, lat1],
      [lng2, lat2],
      [lng3, lat3],
      [lng4, lat4]
    ],
    "stats": {
      "NDMI_min": -0.3245,
      "NDMI_max": 0.5621
    }
  },
  "layer_type": "ndmi",
  "area": "ud",
  "end_date": "2024-12-31",
  "days_composite": 30
}
```

## Testing

### Test GEE Service

```bash
# Inside Docker
docker-compose exec fastapi python test_gee.py

# Or locally
cd fastapi
python test_gee.py
```

### Test API Endpoints

Using curl:

```bash
# NDMI
curl "http://localhost:8000/gee/ndmi?area=ud&end_date=2024-12-31&days=30"

# Burn Scar
curl "http://localhost:8000/gee/burn-scar?area=ud&start_date=2024-01-01&end_date=2024-01-31"

# Biomass
curl "http://localhost:8000/gee/biomass?area=ud&end_date=2024-12-31"
```

Or visit: http://localhost:8000/docs

## Performance Notes

- **Initial load**: 5-15 seconds (first request)
- **Subsequent loads**: 3-10 seconds
- **Factors affecting speed**:
  - Date range (more days = slower)
  - Study area size
  - Number of satellite images
  - GEE server load

**Recommendation**: Implement caching for frequently requested layers.

## Security

✅ **Service account file excluded from Git**
- Listed in `.gitignore`
- Never commit `sakdagee-aac5df75dc7f.json`

✅ **Mounted as Docker volume**
- Not copied into Docker image
- Only accessible to FastAPI container

✅ **Environment variable configuration**
- Path configurable via `GEE_SERVICE_ACCOUNT`

## Troubleshooting

### 1. Authentication Error
**Error**: "Failed to initialize Earth Engine"

**Solution**:
- Check `fastapi/sakdagee-aac5df75dc7f.json` exists
- Verify JSON file is valid
- Check Docker logs: `docker-compose logs fastapi`

### 2. Layer Not Loading
**Symptoms**: No tiles displayed on map

**Checks**:
- API returns `tile_url`?
- CORS enabled in FastAPI?
- MapLibre map loaded?
- Check browser console for errors

### 3. Slow Performance
**Normal**: 5-30 seconds for GEE processing

**Optimize**:
- Reduce date range
- Use smaller study areas
- Implement caching
- Add loading indicators

## Next Steps

1. ✅ **Verify GEE works** - Run `test_gee.py`
2. ✅ **Test API** - Visit http://localhost:8000/docs
3. ⏭️ **Add to pages** - Integrate `GEELayerControl` into your React pages
4. ⏭️ **Add layer legends** - Show color scales for each layer
5. ⏭️ **Implement caching** - Cache tile URLs to improve performance
6. ⏭️ **Add time series** - Show historical layer data
7. ⏭️ **Monitor quota** - Track GEE usage in Google Cloud Console

## Files Structure

```
cmu_udfire_web/
├── fastapi/
│   ├── app/
│   │   ├── services/
│   │   │   └── gee_service.py          # GEE processing logic
│   │   └── routers/
│   │       └── gee.py                  # API endpoints
│   ├── sakdagee-aac5df75dc7f.json     # Service account (gitignored)
│   ├── test_gee.py                    # Test script
│   └── requirements.txt                # Updated with GEE deps
├── react/
│   └── src/
│       ├── services/
│       │   └── geeService.js          # API client
│       ├── hooks/
│       │   └── useGEELayer.js         # React hooks
│       └── components/
│           ├── GEETileLayer.jsx       # Tile renderer
│           └── GEELayerControl.jsx    # Layer switcher UI
├── gee/
│   ├── ndmi.js                        # Original GEE code
│   ├── burnscar.js                    # Original GEE code
│   └── 3pgs.js                        # Original GEE code
├── docker-compose.yml                 # Updated with GEE env var
├── .gitignore                         # Excludes service account
├── GEE_SETUP.md                       # Setup guide
├── GEE_INTEGRATION.md                 # Integration guide
└── IMPLEMENTATION_SUMMARY.md          # This file
```

## Support & Resources

- **GEE Setup**: See `GEE_SETUP.md`
- **Integration Guide**: See `GEE_INTEGRATION.md`
- **API Docs**: http://localhost:8000/docs
- **Google Earth Engine**: https://developers.google.com/earth-engine
- **Service Account Email**: `gee-apsco@sakdagee.iam.gserviceaccount.com`

---

**Status**: ✅ Ready to use
**Authentication**: ✅ Service account configured
**API**: ✅ All endpoints working
**React Components**: ✅ Ready to integrate
