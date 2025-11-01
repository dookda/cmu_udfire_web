import { useEffect, useRef } from 'react'

/**
 * District Boundary Layer Component
 * Displays district boundaries from GeoServer WFS as GeoJSON
 */
export default function DistrictBoundaryLayer({
  map,
  visible = true,
  wfsUrl = 'http://127.0.0.1:8080/geoserver/udfire/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=udfire%3Anoth4prov_district_4326&maxFeatures=5000&outputFormat=application%2Fjson'
}) {
  const sourceIdRef = useRef('district-boundary-source')
  const lineLayerIdRef = useRef('district-boundary-line')
  const hasInitializedRef = useRef(false)
  const geojsonDataRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    if (!map) return

    // Reset mounted flag
    isMountedRef.current = true

    // Get the actual MapLibre map instance
    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.addSource !== 'function') {
      console.warn('DistrictBoundaryLayer: Map instance not ready or invalid')
      return
    }

    console.log('🗺️ DistrictBoundaryLayer: Initializing...')

    // Helper: Find the first symbol layer to insert before
    const findFirstSymbolLayer = () => {
      const layers = mapInstance.getStyle().layers
      // Find first symbol or label layer (these should be on top)
      const symbolLayer = layers.find(layer => layer.type === 'symbol')
      return symbolLayer?.id
    }

    // Load district boundary data
    const loadDistrictData = async () => {
      try {
        // Check if component is still mounted and map is still valid
        if (!isMountedRef.current || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        console.log('📥 Loading district boundary data from:', wfsUrl)
        const response = await fetch(wfsUrl)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const geojsonData = await response.json()
        console.log('📥 Received district boundaries:', geojsonData.features?.length, 'features')

        if (!geojsonData.features || geojsonData.features.length === 0) {
          console.warn('⚠️ No features in district boundary data')
          return
        }

        // Check again if component is still mounted and map is still valid after the request
        if (!isMountedRef.current || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        // Store the data for re-adding layers after basemap changes
        geojsonDataRef.current = geojsonData

        // Find where to insert layer (before first symbol layer, or at the top) to ensure it's above basemap
        const beforeId = findFirstSymbolLayer()
        console.log('🔍 DistrictBoundaryLayer beforeId:', beforeId)

        // Add source
        if (mapInstance && typeof mapInstance.getSource === 'function' && !mapInstance.getSource(sourceIdRef.current)) {
          mapInstance.addSource(sourceIdRef.current, {
            type: 'geojson',
            data: geojsonData
          })
          console.log('✅ Added district boundary source with', geojsonData.features.length, 'features')
        }

        // Add line layer for boundaries - ensure it's above basemap and hexagon
        if (mapInstance && typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(lineLayerIdRef.current)) {
          console.log('➕ Adding district boundary line layer...')
          mapInstance.addLayer({
            id: lineLayerIdRef.current,
            type: 'line',
            source: sourceIdRef.current,
            paint: {
              'line-color': '#ff0000', // Changed to red for visibility testing
              'line-width': 3, // Increased width for visibility testing
              'line-opacity': 1 // Full opacity for visibility testing
            },
            layout: {
              visibility: visible ? 'visible' : 'none'
            }
          }, beforeId)
          console.log('✅ District boundary line layer added')
          console.log('   - Layer ID:', lineLayerIdRef.current)
          console.log('   - Visibility:', visible ? 'visible' : 'none')
          console.log('   - Inserted before:', beforeId || 'top of stack')

          // Verify layer was added
          setTimeout(() => {
            const layer = mapInstance.getLayer(lineLayerIdRef.current)
            console.log('🔍 Verifying layer exists:', !!layer)
            if (layer) {
              console.log('   - Layer type:', layer.type)
              console.log('   - Layer visibility:', mapInstance.getLayoutProperty(lineLayerIdRef.current, 'visibility'))
            }
          }, 100)
        }

        hasInitializedRef.current = true
        console.log('✅ DistrictBoundaryLayer initialized')
      } catch (error) {
        console.error('❌ Error loading district boundary data:', error)
      }
    }

    const addLayer = () => {
      if (!geojsonDataRef.current || !mapInstance) return

      // Find where to insert layer (before first symbol layer, or at the top) to ensure it's above basemap
      const beforeId = findFirstSymbolLayer()

      // Add source if missing
      if (typeof mapInstance.getSource === 'function' && !mapInstance.getSource(sourceIdRef.current)) {
        console.log('Re-adding district boundary source after basemap change')
        mapInstance.addSource(sourceIdRef.current, {
          type: 'geojson',
          data: geojsonDataRef.current
        })
      }

      // Add layer if missing - ensure it's above basemap
      if (typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(lineLayerIdRef.current)) {
        console.log('Re-adding district boundary layer after basemap change')
        mapInstance.addLayer({
          id: lineLayerIdRef.current,
          type: 'line',
          source: sourceIdRef.current,
          paint: {
            'line-color': '#ff0000', // Changed to red for visibility testing
            'line-width': 3, // Increased width for visibility testing
            'line-opacity': 1 // Full opacity for visibility testing
          },
          layout: {
            visibility: visible ? 'visible' : 'none'
          }
        }, beforeId)
      }
    }

    const handleStyleData = (e) => {
      if (e.dataType === 'style' && hasInitializedRef.current && mapInstance && typeof mapInstance.getLayer === 'function') {
        const layerMissing = !mapInstance.getLayer(lineLayerIdRef.current)
        if (layerMissing) {
          setTimeout(() => {
            if (mapInstance && typeof mapInstance.isStyleLoaded === 'function' && mapInstance.isStyleLoaded() && typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(lineLayerIdRef.current)) {
              addLayer()
            }
          }, 100)
        }
      }
    }

    if (!hasInitializedRef.current) {
      if (mapInstance.isStyleLoaded()) {
        loadDistrictData()
      } else {
        mapInstance.once('load', loadDistrictData)
      }
    }

    // Listen for basemap changes
    mapInstance.on('styledata', handleStyleData)

    // Cleanup
    return () => {
      isMountedRef.current = false
      try {
        if (!mapInstance || typeof mapInstance.off !== 'function') return
        mapInstance.off('styledata', handleStyleData)
      } catch (error) {
        console.warn('Error during DistrictBoundaryLayer cleanup:', error)
      }
    }
  }, [map, wfsUrl])

  // Update layer visibility
  useEffect(() => {
    if (!map || !hasInitializedRef.current) return

    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.setLayoutProperty !== 'function' || !mapInstance.getLayer(lineLayerIdRef.current)) return

    mapInstance.setLayoutProperty(
      lineLayerIdRef.current,
      'visibility',
      visible ? 'visible' : 'none'
    )
  }, [map, visible])

  return null
}
