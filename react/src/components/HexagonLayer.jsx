import { useEffect, useRef } from 'react'

/**
 * Hexagon Layer Component for Hotspot Predictions
 * Displays hexagon polygons with predicted hotspot counts
 */
export default function HexagonLayer({ map, visible = true, selectedMonth, onHexagonClick, onLoadingChange }) {
  const sourceIdRef = useRef('hexagon-source')
  const fill2DLayerIdRef = useRef('hexagon-fill')
  const fill3DLayerIdRef = useRef('hexagon-extrusion')
  const hasInitializedRef = useRef(false)
  const geojsonDataRef = useRef(null)
  const onHexagonClickRef = useRef(onHexagonClick)
  const onLoadingChangeRef = useRef(onLoadingChange)

  // Keep the callback ref up to date
  useEffect(() => {
    onHexagonClickRef.current = onHexagonClick
  }, [onHexagonClick])

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange
  }, [onLoadingChange])

  useEffect(() => {
    if (!map) return

    let isMounted = true

    // Get the actual MapLibre map instance
    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.addSource !== 'function') {
      return
    }

    // Define click handler at component scope so it can be reused
    const handleClick = (e) => {
      console.log('🔵 Hexagon layer clicked');

      if (!e.features?.length) {
        console.log('❌ No features in click event')
        return
      }

      if (!geojsonDataRef.current) {
        console.log('❌ No geojsonDataRef.current')
        return
      }

      if (!onHexagonClickRef.current) {
        console.log('❌ No onHexagonClickRef.current callback')
        return
      }

      const clickedProps = e.features[0].properties
      console.log('🔍 Clicked props:', clickedProps)

      // Find the unique identifier - check common ID fields
      const idField = clickedProps.id ?? clickedProps.OBJECTID ?? clickedProps.FID ??
        clickedProps.gid ?? clickedProps.Shape_Area

      if (idField === undefined) {
        console.log('❌ No ID field found in clicked properties')
        return
      }

      console.log('🔑 ID field:', idField)

      // Find the original feature from stored data using a non-strict comparison
      const originalFeature = geojsonDataRef.current.features.find(f => {
        const props = f.properties
        // Use == to handle potential type mismatches (e.g., '123' vs 123)
        /* eslint-disable eqeqeq */
        return props.id == idField || props.OBJECTID == idField ||
          props.FID == idField || props.gid == idField ||
          props.Shape_Area == idField
        /* eslint-enable eqeqeq */
      })

      if (originalFeature?.properties?.predictions) {
        console.log('✅ Found feature with predictions:', originalFeature.properties.predictions)
        onHexagonClickRef.current(originalFeature, e.lngLat)
      } else {
        console.log('❌ Original feature not found or has no predictions')
        console.log('  - Original feature:', originalFeature)
        console.log('  - Has predictions?:', originalFeature?.properties?.predictions)
        console.log('  - Total features in geojsonDataRef:', geojsonDataRef.current.features.length)
      }
    }

    const attachEventHandlers = () => {
      console.log('🔧 Attaching event handlers to layers')
      console.log('  - fill2DLayerId:', fill2DLayerIdRef.current)
      console.log('  - fill3DLayerId:', fill3DLayerIdRef.current)

      if (!mapInstance || typeof mapInstance.on !== 'function') {
        console.log('❌ mapInstance or mapInstance.on not available')
        return
      }

      // Check if layers exist
      const has2DLayer = mapInstance.getLayer(fill2DLayerIdRef.current)
      const has3DLayer = mapInstance.getLayer(fill3DLayerIdRef.current)
      console.log('  - 2D layer exists?', !!has2DLayer)
      console.log('  - 3D layer exists?', !!has3DLayer)

      // Remove existing handlers first to avoid duplicates
      if (has2DLayer) {
        try {
          mapInstance.off('click', fill2DLayerIdRef.current, handleClick)
          mapInstance.off('mouseenter', fill2DLayerIdRef.current)
          mapInstance.off('mouseleave', fill2DLayerIdRef.current)
        } catch (e) {
          console.log('  - Error removing 2D handlers (might not exist):', e.message)
        }
      }
      if (has3DLayer) {
        try {
          mapInstance.off('click', fill3DLayerIdRef.current, handleClick)
          mapInstance.off('mouseenter', fill3DLayerIdRef.current)
          mapInstance.off('mouseleave', fill3DLayerIdRef.current)
        } catch (e) {
          console.log('  - Error removing 3D handlers (might not exist):', e.message)
        }
      }

      // Add click handlers
      if (has2DLayer) {
        console.log('  - Adding click handler to 2D layer')
        mapInstance.on('click', fill2DLayerIdRef.current, handleClick)
      }
      if (has3DLayer) {
        console.log('  - Adding click handler to 3D layer')
        mapInstance.on('click', fill3DLayerIdRef.current, handleClick)
      }

      // Add cursor pointers
      mapInstance.on('mouseenter', fill2DLayerIdRef.current, () => {
        console.log('🖱️ Mouse entered 2D layer')
        if (mapInstance && mapInstance.getCanvas()) {
          mapInstance.getCanvas().style.cursor = 'pointer'
        }
      })
      mapInstance.on('mouseenter', fill3DLayerIdRef.current, () => {
        console.log('🖱️ Mouse entered 3D layer')
        if (mapInstance && mapInstance.getCanvas()) {
          mapInstance.getCanvas().style.cursor = 'pointer'
        }
      })
      mapInstance.on('mouseleave', fill2DLayerIdRef.current, () => {
        if (mapInstance && mapInstance.getCanvas()) {
          mapInstance.getCanvas().style.cursor = ''
        }
      })
      mapInstance.on('mouseleave', fill3DLayerIdRef.current, () => {
        if (mapInstance && mapInstance.getCanvas()) {
          mapInstance.getCanvas().style.cursor = ''
        }
      })
      console.log('✅ Event handlers attached successfully')
    }

    const addLayers = () => {
      console.log('🔧 addLayers called')
      if (!geojsonDataRef.current) {
        console.log('❌ No geojsonDataRef.current in addLayers')
        return
      }

      // Add source if missing
      if (!mapInstance.getSource(sourceIdRef.current)) {
        console.log('➕ Adding source')
        mapInstance.addSource(sourceIdRef.current, {
          type: 'geojson',
          data: geojsonDataRef.current
        })
      }

      // Add 2D layer if missing
      if (!mapInstance.getLayer(fill2DLayerIdRef.current)) {
        console.log('➕ Adding 2D layer')
        mapInstance.addLayer({
          id: fill2DLayerIdRef.current,
          type: 'fill',
          source: sourceIdRef.current,
          paint: {
            'fill-color': [
              'case',
              ['has', 'Shape_Area'],
              [
                'interpolate',
                ['linear'],
                ['get', 'Shape_Area'],
                0, '#feedde',
                1000, '#fdd49e',
                5000, '#fdbb84',
                10000, '#fc8d59',
                20000, '#ef6548',
                50000, '#d7301f',
                100000, '#990000'
              ],
              '#cccccc'
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': '#ffffff'
          },
          layout: {
            visibility: selectedMonth ? 'none' : (visible ? 'visible' : 'none')
          }
        })
      }

      // Add 3D layer if missing
      if (!mapInstance.getLayer(fill3DLayerIdRef.current)) {
        console.log('➕ Adding 3D layer')
        mapInstance.addLayer({
          id: fill3DLayerIdRef.current,
          type: 'fill-extrusion',
          source: sourceIdRef.current,
          paint: {
            'fill-extrusion-color': '#cccccc',
            'fill-extrusion-height': 100,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.8
          },
          layout: {
            visibility: selectedMonth ? (visible ? 'visible' : 'none') : 'none'
          }
        })
      }

      // Re-attach event handlers after adding layers
      attachEventHandlers()
    }

    // Load hexagon data
    const loadHexagonData = async () => {
      console.log('📥 Loading hexagon data...')
      if (onLoadingChangeRef.current) {
        onLoadingChangeRef.current(true)
      }

      try {
        // Check if component is still mounted and map is still valid
        if (!isMounted || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        const response = await fetch('http://localhost:8000/hotspot/hexagon-predictions')
        const geojsonData = await response.json()
        console.log('📥 Received hexagon data:', geojsonData.features?.length, 'features')

        // Check again if component is still mounted and map is still valid after the request
        if (!isMounted || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        // Process features to add simplified prediction properties
        geojsonData.features.forEach((feature) => {
          if (feature.properties.predictions) {
            let predictions
            try {
              predictions = typeof feature.properties.predictions === 'string'
                ? JSON.parse(feature.properties.predictions)
                : feature.properties.predictions
            } catch (e) {
              predictions = feature.properties.predictions
            }

            // Add simplified properties for each month
            if (Array.isArray(predictions)) {
              predictions.forEach(pred => {
                const monthKey = `pred_${pred.date.replace(/-/g, '_')}`
                feature.properties[monthKey] = pred.predicted_hotspot_count
              })
            }
          }
        })

        // Store the processed data for re-adding layers after basemap changes
        geojsonDataRef.current = geojsonData
        console.log('✅ Stored geojsonData in ref')

        // Add source
        if (mapInstance && typeof mapInstance.getSource === 'function' && !mapInstance.getSource(sourceIdRef.current)) {
          mapInstance.addSource(sourceIdRef.current, {
            type: 'geojson',
            data: geojsonData
          })
          console.log('✅ Added source')
        }

        // Add 2D fill layer (for default view without month selection)
        if (mapInstance && typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(fill2DLayerIdRef.current)) {
          mapInstance.addLayer({
            id: fill2DLayerIdRef.current,
            type: 'fill',
            source: sourceIdRef.current,
            paint: {
              'fill-color': [
                'case',
                ['has', 'Shape_Area'],
                [
                  'interpolate',
                  ['linear'],
                  ['get', 'Shape_Area'],
                  0, '#feedde',
                  1000, '#fdd49e',
                  5000, '#fdbb84',
                  10000, '#fc8d59',
                  20000, '#ef6548',
                  50000, '#d7301f',
                  100000, '#990000'
                ],
                '#cccccc'
              ],
              'fill-opacity': 0.7,
              'fill-outline-color': '#ffffff'
            },
            layout: {
              visibility: 'visible'
            }
          })
          console.log('✅ Added 2D layer')
        }

        // Add 3D extrusion layer (for month-specific predictions)
        if (mapInstance && typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(fill3DLayerIdRef.current)) {
          mapInstance.addLayer({
            id: fill3DLayerIdRef.current,
            type: 'fill-extrusion',
            source: sourceIdRef.current,
            paint: {
              'fill-extrusion-color': '#cccccc',
              'fill-extrusion-height': 100,
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.8
            },
            layout: {
              visibility: 'none'
            }
          })
          console.log('✅ Added 3D layer')
        }

        // Attach event handlers
        attachEventHandlers()

        // Add a global click handler to test if any map clicks work
        const globalClickHandler = (e) => {
          console.log('🗺️ Global map clicked at:', e.lngLat)

          // Query rendered features at the click point
          const features2D = mapInstance.queryRenderedFeatures(e.point, {
            layers: [fill2DLayerIdRef.current]
          })
          const features3D = mapInstance.queryRenderedFeatures(e.point, {
            layers: [fill3DLayerIdRef.current]
          })

          console.log('  - 2D layer features at point:', features2D.length)
          console.log('  - 3D layer features at point:', features3D.length)

          // If we found features, manually trigger our handler
          if (features2D.length > 0 || features3D.length > 0) {
            console.log('  - Manually triggering handleClick')
            handleClick({
              features: features2D.length > 0 ? features2D : features3D,
              lngLat: e.lngLat,
              point: e.point
            })
          }
        }
        mapInstance.on('click', globalClickHandler)

        hasInitializedRef.current = true
        console.log('✅ Hexagon layer initialized')
      } catch (error) {
        console.error('❌ Error loading hexagon data:', error)
      } finally {
        // Ensure loading is set to false even if there's an error
        if (isMounted && onLoadingChangeRef.current) {
          onLoadingChangeRef.current(false)
        }
      }
    }

    const handleStyleData = (e) => {
      if (e.dataType === 'style' && hasInitializedRef.current) {
        const layerMissing = !mapInstance.getLayer(fill2DLayerIdRef.current) ||
          !mapInstance.getLayer(fill3DLayerIdRef.current)
        if (layerMissing) {
          console.log('⚠️ Layers missing after style change, re-adding...')
          setTimeout(() => {
            if (mapInstance.isStyleLoaded()) {
              const still2DMissing = !mapInstance.getLayer(fill2DLayerIdRef.current)
              const still3DMissing = !mapInstance.getLayer(fill3DLayerIdRef.current)
              if (still2DMissing || still3DMissing) {
                addLayers()
              }
            }
          }, 100)
        }
      }
    }

    if (!hasInitializedRef.current) {
      if (mapInstance.isStyleLoaded()) {
        loadHexagonData()
      } else {
        mapInstance.once('load', loadHexagonData)
      }
    }

    // Listen for basemap changes
    mapInstance.on('styledata', handleStyleData)

    // Cleanup
    return () => {
      isMounted = false
      try {
        if (!mapInstance || typeof mapInstance.off !== 'function') return;
        mapInstance.off('styledata', handleStyleData)
        if (mapInstance && typeof mapInstance.getLayer === 'function') {
          if (mapInstance.getLayer(fill2DLayerIdRef.current)) {
            mapInstance.off('click', fill2DLayerIdRef.current, handleClick)
            mapInstance.off('mouseenter', fill2DLayerIdRef.current)
            mapInstance.off('mouseleave', fill2DLayerIdRef.current)
          }
          if (mapInstance.getLayer(fill3DLayerIdRef.current)) {
            mapInstance.off('click', fill3DLayerIdRef.current, handleClick)
            mapInstance.off('mouseenter', fill3DLayerIdRef.current)
            mapInstance.off('mouseleave', fill3DLayerIdRef.current)
          }
        }
      } catch (error) {
        console.warn('Error during HexagonLayer cleanup:', error)
      }
    }
  }, [map])

  // Update layer visibility
  useEffect(() => {
    if (!map || !hasInitializedRef.current) return

    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.setLayoutProperty !== 'function') return

    const visibility = visible ? 'visible' : 'none'

    if (selectedMonth) {
      // Show 3D layer when month is selected
      if (mapInstance.getLayer(fill2DLayerIdRef.current)) {
        mapInstance.setLayoutProperty(fill2DLayerIdRef.current, 'visibility', 'none')
      }
      if (mapInstance.getLayer(fill3DLayerIdRef.current)) {
        mapInstance.setLayoutProperty(fill3DLayerIdRef.current, 'visibility', visibility)
      }
    } else {
      // Show 2D layer when no month selected
      if (mapInstance.getLayer(fill2DLayerIdRef.current)) {
        mapInstance.setLayoutProperty(fill2DLayerIdRef.current, 'visibility', visibility)
      }
      if (mapInstance.getLayer(fill3DLayerIdRef.current)) {
        mapInstance.setLayoutProperty(fill3DLayerIdRef.current, 'visibility', 'none')
      }
    }
  }, [map, visible, selectedMonth])

  // Update colors based on selected month
  useEffect(() => {
    if (!map || !hasInitializedRef.current || !selectedMonth) return

    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.setPaintProperty !== 'function') return

    const monthKey = `pred_${selectedMonth.replace(/-/g, '_')}`

    // Debug: Check if the property exists in the data
    if (geojsonDataRef.current?.features?.length > 0) {
    }

    const fillColorExpression = [
      'case',
      ['has', 'predictions'],
      [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', monthKey], 0],
        0, '#d7f4d7',
        10, '#b8e6b8',
        25, '#ffe066',
        50, '#ffb366',
        75, '#ff8566',
        100, '#ff5566',
        150, '#cc0000',
        200, '#990000'
      ],
      '#cccccc'
    ]

    const extrusionHeightExpression = [
      'case',
      ['has', 'predictions'],
      [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', monthKey], 0],
        0, 100,
        10, 300,
        25, 600,
        50, 1200,
        75, 2000,
        100, 3000,
        150, 5000,
        200, 8000,
        300, 12000
      ],
      100
    ]

    if (mapInstance.getLayer(fill2DLayerIdRef.current)) {
      mapInstance.setPaintProperty(fill2DLayerIdRef.current, 'fill-color', fillColorExpression)
    }

    if (mapInstance.getLayer(fill3DLayerIdRef.current)) {
      mapInstance.setPaintProperty(fill3DLayerIdRef.current, 'fill-extrusion-color', fillColorExpression)
      mapInstance.setPaintProperty(fill3DLayerIdRef.current, 'fill-extrusion-height', extrusionHeightExpression)
    }
  }, [map, selectedMonth])

  return null
}
