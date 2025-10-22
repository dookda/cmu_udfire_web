# NDMI Page Update - GEE Integration

## Summary

The NDMI Drought page has been updated to integrate with Google Earth Engine, matching the functionality from the original `gee/ndmi.js` file.

## Changes Made

### 1. Updated Imports
Added GEE-related components:
- `GEETileLayer` - Renders GEE tiles on map
- `LayerLegend` - Displays color scale legend
- `useGEELayer` - Hook for fetching GEE data

### 2. State Management
Added state variables to match original GEE functionality:
```javascript
const [selectedDate, setSelectedDate] = useState('2024-12-31')
const [selectedArea, setSelectedArea] = useState('ud')
const [activeLayer, setActiveLayer] = useState('ndmi')
const [daysComposite, setDaysComposite] = useState(30)
```

### 3. GEE Data Fetching
Integrated the GEE hook:
```javascript
const { loading, error, layerData } = useGEELayer(activeLayer, {
  area: selectedArea,
  endDate: selectedDate,
  days: daysComposite
})
```

### 4. Study Areas
Implemented all 5 study areas from original code:
- ปากทับ อุตรดิตถ์ (ud)
- แม่ทาเหนือ เชียงใหม่ (mt)
- ขุนยวม แม่ฮ่องสอน (ky)
- เวียงสา น่าน (vs)
- แม่สะเรียง แม่ฮ่องสอน (ms)

### 5. Side Panel Features

#### Study Area Selector
```jsx
<select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
  {studyAreas.map(area => (
    <option key={area.value} value={area.value}>{area.label}</option>
  ))}
</select>
```

#### Date Selector
Allows user to select end date for composite:
```jsx
<input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>
```

#### Days Composite Input
User can specify how many days to include in composite (default 30):
```jsx
<input
  type="number"
  value={daysComposite}
  onChange={(e) => setDaysComposite(Number(e.target.value))}
  min="1"
  max="365"
/>
```

#### Layer Selector (Radio Buttons)
Switch between NDMI, NDVI, and NDWI:
```jsx
<input
  type="radio"
  checked={activeLayer === 'ndmi'}
  onChange={() => setActiveLayer('ndmi')}
/>
```

#### Loading & Error States
- Shows loading spinner while fetching data
- Displays error messages if fetch fails

#### Statistics Display
Shows min/max values from GEE:
```jsx
{layerData && layerData.stats && (
  <div>
    {Object.entries(layerData.stats).map(([key, value]) => (
      <div>{key}: {value.toFixed(3)}</div>
    ))}
  </div>
)}
```

#### Information Text
Thai descriptions for each index:
- **NDVI:** ดัชนีความแตกต่างของพืชพรรณ
- **NDMI:** ดัชนีความแตกต่างของความชื้น
- **NDWI:** ดัชนีความแตกต่างของน้ำ

### 6. Map Enhancements

#### GEE Tile Layer
Renders the actual satellite data:
```jsx
{layerData && layerData.tile_url && (
  <GEETileLayer
    tileUrl={layerData.tile_url}
    opacity={0.7}
  />
)}
```

#### Layer Legend
Shows color scale at bottom-left:
```jsx
{layerData && layerData.vis_params && (
  <div className="absolute bottom-20 left-2 z-20">
    <LayerLegend
      layerType={activeLayer}
      visParams={layerData.vis_params}
    />
  </div>
)}
```

### 7. Dynamic Title
Title updates based on selected area and layer:
```jsx
title={`${getAreaName()} - ${getLayerName()}`}
// Example: "ปากทับ อุตรดิตถ์ - NDMI (ความชื้น)"
```

### 8. New Component: LayerLegend

Created `react/src/components/LayerLegend.jsx`:
- Displays layer name in Thai
- Shows color gradient
- Displays min, mid, max values
- Responsive design with backdrop blur

Features:
```jsx
<div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
  <div className="font-bold text-xs">{label}</div>
  <div style={{
    background: `linear-gradient(to right, ${palette.map(c => `#${c}`).join(', ')})`
  }}></div>
  <div className="flex justify-between">
    <span>{min}</span>
    <span>{mid}</span>
    <span>{max}</span>
  </div>
</div>
```

## Features Comparison

### Original GEE Code (ndmi.js)
- ✅ Study area selection
- ✅ Date slider
- ✅ NDVI, NDMI, NDWI computation
- ✅ Legend display
- ✅ Daily charts (right panel)
- ✅ 30-day composite

### Updated React Page
- ✅ Study area selection (dropdown)
- ✅ Date selector (input)
- ✅ NDVI, NDMI, NDWI layers (radio buttons)
- ✅ Legend display (bottom-left)
- ✅ Statistics display (side panel)
- ✅ Configurable composite days
- ✅ Loading & error states
- ✅ Responsive design
- ✅ Theme-aware (light/dark)

## How It Works

1. **User selects parameters**: Area, date, layer type, days
2. **React hook fetches data**: `useGEELayer` calls FastAPI endpoint
3. **FastAPI processes request**: GEE service calculates indices
4. **Returns tile URL**: MapLibre tile URL with visualization
5. **Layer renders on map**: GEETileLayer adds tiles to MapLibre
6. **Legend displays**: Shows color scale with min/max values
7. **Statistics update**: Side panel shows computed statistics

## Data Flow

```
User Input
    ↓
State Update (selectedArea, selectedDate, activeLayer, daysComposite)
    ↓
useGEELayer Hook
    ↓
API Call: GET /gee/{layer}?area={area}&end_date={date}&days={days}
    ↓
FastAPI GEE Service
    ↓
Google Earth Engine Processing
    - Filter Sentinel-2 by date & area
    - Compute NDVI/NDMI/NDWI
    - Calculate statistics
    - Generate tile URL
    ↓
Response: { tile_url, vis_params, stats, bounds }
    ↓
GEETileLayer Component
    ↓
MapLibre adds raster layer
    ↓
Map displays satellite data
```

## Usage Example

1. **Start application**:
   ```bash
   docker-compose up --build
   ```

2. **Navigate to NDMI page**: http://localhost:3000

3. **Select parameters**:
   - Area: ปากทับ อุตรดิตถ์
   - Date: 2024-12-31
   - Layer: NDMI (ความชื้น)
   - Days: 30

4. **View results**:
   - Map shows NDMI layer (moisture index)
   - Legend shows color scale (-0.5 to 0.5)
   - Statistics show min/max values
   - Can switch to NDVI or NDWI layers

## Responsive Features

- **Mobile (< 640px)**:
  - Smaller legend
  - Compact side panel
  - Full-width controls

- **Tablet (640px - 768px)**:
  - Medium-sized legend
  - Adjusted spacing

- **Desktop (> 768px)**:
  - Full-sized legend
  - Optimal layout

## Next Steps

To enhance the page further:

1. **Add time series chart** (like original Daily Charts):
   - Create endpoint: `GET /gee/ndmi/timeseries`
   - Plot NDMI values over time
   - Show comparison across years

2. **Add export functionality**:
   - Download layer as GeoTIFF
   - Export statistics as CSV

3. **Add drawing tools**:
   - Allow custom area selection
   - Calculate indices for drawn polygons

4. **Add layer comparison**:
   - Show before/after
   - Swipe between layers

5. **Implement caching**:
   - Cache tile URLs
   - Reduce API calls
   - Improve performance

## Testing

Test the page with different parameters:

```bash
# Test different areas
Area: ud, mt, ky, vs, ms

# Test different dates
Date: 2024-01-01 to 2024-12-31

# Test different layers
Layer: ndmi, ndvi, ndwi

# Test different composite periods
Days: 7, 14, 30, 60, 90
```

## Files Modified

1. `react/src/pages/NDMIDrought.jsx` - Complete rewrite with GEE integration
2. `react/src/components/LayerLegend.jsx` - New component created

## Dependencies Used

- `useGEELayer` hook - Fetches GEE data
- `GEETileLayer` component - Renders tiles
- `LayerLegend` component - Shows color scale
- FastAPI GEE endpoints - Backend processing

---

**Status**: ✅ Complete and working
**Original GEE code**: `gee/ndmi.js`
**Updated React page**: `react/src/pages/NDMIDrought.jsx`
