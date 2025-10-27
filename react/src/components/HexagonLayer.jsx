import { useEffect, useRef } from 'react'

/**
 * Hexagon Layer Component for Hotspot Predictions
 * Displays hexagon polygons with predicted hotspot counts
 */
export default function HexagonLayer({ map, visible = true, selectedMonth, onHexagonClick }) {
  const sourceIdRef = useRef('hexagon-source')
  const fill2DLayerIdRef = useRef('hexagon-fill')
  const fill3DLayerIdRef = useRef('hexagon-extrusion')
  const hasInitializedRef = useRef(false)
  const geojsonDataRef = useRef(null)
  const onHexagonClickRef = useRef(onHexagonClick)

  // Keep the callback ref up to date
  useEffect(() => {
    onHexagonClickRef.current = onHexagonClick
  }, [onHexagonClick])

  useEffect(() => {
    if (!map) return

    let isMounted = true

    // Get the actual MapLibre map instance
    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.addSource !== 'function') {
      console.warn('Map instance not ready or invalid')
      return
    }

    // Load hexagon data
    const loadHexagonData = async () => {
      try {
        // Check if component is still mounted and map is still valid
        if (!isMounted || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        console.log('Loading hexagon data...')
        const response = await fetch('http://localhost:8000/hotspot/hexagon-predictions')
        const geojsonData = await response.json()

        // Check again if component is still mounted and map is still valid after the request
        if (!isMounted || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        console.log(`✓ Loaded ${geojsonData.features?.length || 0} hexagon features`)

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

        // Add source
        if (mapInstance && typeof mapInstance.getSource === 'function' && !mapInstance.getSource(sourceIdRef.current)) {
          mapInstance.addSource(sourceIdRef.current, {
            type: 'geojson',
            data: geojsonData
          })
          console.log('✓ Added hexagon source')
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
          console.log('✓ Added 2D fill layer')
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
          console.log('✓ Added 3D extrusion layer')
        }

        // Add click handlers and cursor pointers
        if (mapInstance && typeof mapInstance.on === 'function') {
          mapInstance.on('click', fill2DLayerIdRef.current, handleClick)
          mapInstance.on('click', fill3DLayerIdRef.current, handleClick)

          mapInstance.on('mouseenter', fill2DLayerIdRef.current, () => {
            if (mapInstance && mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = 'pointer'
            }
          })
          mapInstance.on('mouseenter', fill3DLayerIdRef.current, () => {
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
        }

        hasInitializedRef.current = true
        console.log('Hexagon layer initialized successfully')
      } catch (error) {
        console.error('Error loading hexagon data:', error)
      }
    }

    const handleClick = (e) => {
      if (e.features && e.features.length > 0 && onHexagonClickRef.current) {
        onHexagonClickRef.current(e.features[0])
      }
    }

    const addLayers = () => {
      if (!geojsonDataRef.current) return

      // Add source if missing
      if (!mapInstance.getSource(sourceIdRef.current)) {
        console.log('Re-adding hexagon source after basemap change')
        mapInstance.addSource(sourceIdRef.current, {
          type: 'geojson',
          data: geojsonDataRef.current
        })
      }

      // Add 2D layer if missing
      if (!mapInstance.getLayer(fill2DLayerIdRef.current)) {
        console.log('Re-adding 2D hexagon layer after basemap change')
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
        console.log('Re-adding 3D hexagon layer after basemap change')
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
    }

    const handleStyleData = (e) => {
      if (e.dataType === 'style' && hasInitializedRef.current) {
        console.log('Style changed, checking if layers need to be re-added...')
        const layerMissing = !mapInstance.getLayer(fill2DLayerIdRef.current) ||
          !mapInstance.getLayer(fill3DLayerIdRef.current)
        console.log('Layers missing:', layerMissing)
        if (layerMissing) {
          setTimeout(() => {
            if (mapInstance.isStyleLoaded()) {
              const still2DMissing = !mapInstance.getLayer(fill2DLayerIdRef.current)
              const still3DMissing = !mapInstance.getLayer(fill3DLayerIdRef.current)
              console.log('After delay - 2D missing:', still2DMissing, '3D missing:', still3DMissing)
              if (still2DMissing || still3DMissing) {
                console.log('Re-adding hexagon layers after basemap change')
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
        if (typeof mapInstance.getLayer === 'function') {
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
      console.log(`→ Switching to 3D view (month: ${selectedMonth})`)
      if (mapInstance.getLayer(fill2DLayerIdRef.current)) {
        mapInstance.setLayoutProperty(fill2DLayerIdRef.current, 'visibility', 'none')
      }
      if (mapInstance.getLayer(fill3DLayerIdRef.current)) {
        mapInstance.setLayoutProperty(fill3DLayerIdRef.current, 'visibility', visibility)
      }
    } else {
      // Show 2D layer when no month selected
      console.log('→ Switching to 2D view')
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
    console.log(`→ Updating colors (key: ${monthKey})`)

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
    console.log('✓ Updated layer styles')
  }, [map, selectedMonth])

  return null
}
