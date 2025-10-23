/**
 * Calculate bounding box from GEE bounds array
 * @param {Array} bounds - Array of coordinate pairs [[lng, lat], ...]
 * @returns {Array} [[minLng, minLat], [maxLng, maxLat]]
 */
export function calculateBounds(bounds) {
  if (!bounds || !Array.isArray(bounds) || bounds.length === 0) {
    return null
  }

  const lngs = bounds.map(coord => coord[0])
  const lats = bounds.map(coord => coord[1])
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)

  return [[minLng, minLat], [maxLng, maxLat]]
}

/**
 * Fit map to GEE layer bounds with fallback to predefined coordinates
 * @param {Object} options - Configuration options
 * @param {Object} options.mapRef - React ref to the map component
 * @param {Object} options.layerData - GEE layer data with bounds
 * @param {Array} options.studyAreas - Array of study area definitions
 * @param {string} options.selectedArea - Currently selected area code
 * @param {number} options.padding - Padding around bounds (default: 50)
 * @param {number} options.duration - Animation duration (default: 1000)
 */
export function fitMapToBounds({
  mapRef,
  layerData,
  studyAreas,
  selectedArea,
  padding = 50,
  duration = 1000
}) {
  if (!mapRef || !mapRef.current) return

  if (layerData && layerData.bounds) {
    const bounds = calculateBounds(layerData.bounds)
    if (bounds) {
      mapRef.current.getMap().fitBounds(bounds, { padding, duration })
      return
    }
  }

  // Fallback to predefined coordinates
  const area = studyAreas.find(a => a.value === selectedArea)
  if (area) {
    mapRef.current.flyTo({
      center: [area.longitude, area.latitude],
      zoom: area.zoom,
      duration
    })
  }
}
