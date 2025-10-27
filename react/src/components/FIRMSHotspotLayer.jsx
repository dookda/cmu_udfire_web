import { useEffect, useRef } from 'react'

/**
 * FIRMS Hotspot Layer Component
 * Displays real-time thermal anomalies from NASA FIRMS
 */
export default function FIRMSHotspotLayer({ map, visible = true }) {
  const sourceIdRef = useRef('firms-hotspots')
  const layerIdRef = useRef('firms-hotspot-points')
  const hasInitializedRef = useRef(false)
  const geojsonDataRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    if (!map) return

    // Get the actual MapLibre map instance
    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.addSource !== 'function') {
      console.warn('Map instance not ready or invalid')
      return
    }

    // Load FIRMS hotspot data
    const loadFIRMSData = async () => {
      try {
        // Check if component is still mounted and map is still valid
        if (!isMountedRef.current || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        const response = await fetch('http://localhost:8000/hotspot/firms-hotspots')
        const geojsonData = await response.json()

        // Check again if component is still mounted and map is still valid after the request
        if (!isMountedRef.current || !mapInstance || typeof mapInstance.addSource !== 'function') {
          return
        }

        console.log(`Loaded ${geojsonData.features?.length || 0} FIRMS hotspots`)

        // Store the data for re-adding layers after basemap changes
        geojsonDataRef.current = geojsonData

        // Add source
        if (mapInstance && typeof mapInstance.getSource === 'function' && !mapInstance.getSource(sourceIdRef.current)) {
          mapInstance.addSource(sourceIdRef.current, {
            type: 'geojson',
            data: geojsonData
          })
        }

        // Add hotspot circle layer
        if (mapInstance && typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(layerIdRef.current)) {
          mapInstance.addLayer({
            id: layerIdRef.current,
            type: 'circle',
            source: sourceIdRef.current,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5, 2,
                10, 5,
                15, 8
              ],
              'circle-color': [
                'case',
                ['has', 'confidence'],
                [
                  'interpolate',
                  ['linear'],
                  ['to-number', ['get', 'confidence']],
                  0, '#ffeb3b',
                  50, '#ff9800',
                  80, '#f44336',
                  100, '#b71c1c'
                ],
                '#ff4444'
              ],
              'circle-opacity': 0.9,
              'circle-stroke-width': 0.8,
              'circle-stroke-color': '#fff',
              'circle-stroke-opacity': 0.8
            },
            layout: {
              visibility: visible ? 'visible' : 'none'
            }
          })
        }

        // Add click handler and cursor pointer
        if (mapInstance && typeof mapInstance.on === 'function') {
          mapInstance.on('click', layerIdRef.current, handleClick)

          mapInstance.on('mouseenter', layerIdRef.current, () => {
            if (mapInstance && mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = 'pointer'
            }
          })
          mapInstance.on('mouseleave', layerIdRef.current, () => {
            if (mapInstance && mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = ''
            }
          })
        }

        hasInitializedRef.current = true
      } catch (error) {
        console.error('Error loading FIRMS data:', error)
      }
    }

    const handleClick = (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        const props = feature.properties

        let popupHTML = '<div style="font-family: sans-serif;">'
        popupHTML += '<h4 style="margin: 0 0 10px 0; color: #d32f2f;">🔥 FIRMS Hotspot</h4>'

        if (props.confidence) {
          const confidence = parseFloat(props.confidence)
          let confidenceColor = '#ffeb3b'
          if (confidence >= 80) confidenceColor = '#b71c1c'
          else if (confidence >= 50) confidenceColor = '#ff9800'

          popupHTML += `<p style="margin: 5px 0;"><strong>Confidence:</strong> <span style="color: ${confidenceColor}; font-weight: bold;">${confidence}%</span></p>`
        }

        if (props.bright_ti4) {
          popupHTML += `<p style="margin: 5px 0;"><strong>Brightness (4μm):</strong> ${props.bright_ti4}K</p>`
        }

        if (props.bright_ti5) {
          popupHTML += `<p style="margin: 5px 0;"><strong>Brightness (11μm):</strong> ${props.bright_ti5}K</p>`
        }

        if (props.acq_date) {
          popupHTML += `<p style="margin: 5px 0;"><strong>Date:</strong> ${props.acq_date}</p>`
        }

        if (props.acq_time) {
          const time = props.acq_time.toString().padStart(4, '0')
          const formattedTime = `${time.slice(0, 2)}:${time.slice(2)}`
          popupHTML += `<p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime} UTC</p>`
        }

        if (props.satellite) {
          popupHTML += `<p style="margin: 5px 0;"><strong>Satellite:</strong> ${props.satellite}</p>`
        }

        popupHTML += '</div>'

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupHTML)
          .addTo(mapInstance)
      }
    }

    const addLayer = () => {
      if (!geojsonDataRef.current || !mapInstance) return

      // Add source if missing
      if (typeof mapInstance.getSource === 'function' && !mapInstance.getSource(sourceIdRef.current)) {
        console.log('Re-adding FIRMS source after basemap change')
        mapInstance.addSource(sourceIdRef.current, {
          type: 'geojson',
          data: geojsonDataRef.current
        })
      }

      // Add layer if missing
      if (typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(layerIdRef.current)) {
        console.log('Re-adding FIRMS layer after basemap change')
        mapInstance.addLayer({
          id: layerIdRef.current,
          type: 'circle',
          source: sourceIdRef.current,
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5, 2,
              10, 5,
              15, 8
            ],
            'circle-color': [
              'case',
              ['has', 'confidence'],
              [
                'interpolate',
                ['linear'],
                ['to-number', ['get', 'confidence']],
                0, '#ffeb3b',
                50, '#ff9800',
                80, '#f44336',
                100, '#b71c1c'
              ],
              '#ff4444'
            ],
            'circle-opacity': 0.9,
            'circle-stroke-width': 0.8,
            'circle-stroke-color': '#fff',
            'circle-stroke-opacity': 0.8
          },
          layout: {
            visibility: visible ? 'visible' : 'none'
          }
        })
      }
    }

    const handleStyleData = (e) => {
      if (e.dataType === 'style' && hasInitializedRef.current && mapInstance && typeof mapInstance.getLayer === 'function') {
        const layerMissing = !mapInstance.getLayer(layerIdRef.current)
        if (layerMissing) {
          setTimeout(() => {
            if (mapInstance && typeof mapInstance.isStyleLoaded === 'function' && mapInstance.isStyleLoaded() && typeof mapInstance.getLayer === 'function' && !mapInstance.getLayer(layerIdRef.current)) {
              addLayer()
            }
          }, 100)
        }
      }
    }

    if (!hasInitializedRef.current) {
      if (mapInstance.isStyleLoaded()) {
        loadFIRMSData()
      } else {
        mapInstance.once('load', loadFIRMSData)
      }
    }

    // Listen for basemap changes
    mapInstance.on('styledata', handleStyleData)

    // Cleanup
    return () => {
      isMountedRef.current = false
      try {
        if (!mapInstance || typeof mapInstance.off !== 'function') return;
        mapInstance.off('styledata', handleStyleData)
        if (typeof mapInstance.getLayer === 'function' && mapInstance.getLayer(layerIdRef.current)) {
          mapInstance.off('click', layerIdRef.current, handleClick)
          mapInstance.off('mouseenter', layerIdRef.current)
          mapInstance.off('mouseleave', layerIdRef.current)
        }
      } catch (error) {
        console.warn('Error during FIRMSHotspotLayer cleanup:', error)
      }
    }
  }, [map, visible])

  // Update layer visibility
  useEffect(() => {
    if (!map || !hasInitializedRef.current) return

    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.setLayoutProperty !== 'function' || !mapInstance.getLayer(layerIdRef.current)) return

    mapInstance.setLayoutProperty(
      layerIdRef.current,
      'visibility',
      visible ? 'visible' : 'none'
    )
  }, [map, visible])

  return null
}
