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

  useEffect(() => {
    if (!map) return

    // Get the actual MapLibre map instance
    const mapInstance = map.getMap ? map.getMap() : map
    if (!mapInstance || typeof mapInstance.addSource !== 'function') return

    // Load FIRMS hotspot data
    const loadFIRMSData = async () => {
      try {
        const response = await fetch('http://localhost:8000/hotspot/firms-hotspots')
        const geojsonData = await response.json()

        console.log(`Loaded ${geojsonData.features?.length || 0} FIRMS hotspots`)

        // Store the data for re-adding layers after basemap changes
        geojsonDataRef.current = geojsonData

        // Add source
        if (!mapInstance.getSource(sourceIdRef.current)) {
          mapInstance.addSource(sourceIdRef.current, {
            type: 'geojson',
            data: geojsonData
          })
        }

        // Add hotspot circle layer
        if (!mapInstance.getLayer(layerIdRef.current)) {
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

        // Add click handler
        mapInstance.on('click', layerIdRef.current, handleClick)

        // Add cursor pointer
        mapInstance.on('mouseenter', layerIdRef.current, () => {
          mapInstance.getCanvas().style.cursor = 'pointer'
        })
        mapInstance.on('mouseleave', layerIdRef.current, () => {
          mapInstance.getCanvas().style.cursor = ''
        })

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
      if (!geojsonDataRef.current) return

      // Add source if missing
      if (!mapInstance.getSource(sourceIdRef.current)) {
        console.log('Re-adding FIRMS source after basemap change')
        mapInstance.addSource(sourceIdRef.current, {
          type: 'geojson',
          data: geojsonDataRef.current
        })
      }

      // Add layer if missing
      if (!mapInstance.getLayer(layerIdRef.current)) {
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
      if (e.dataType === 'style' && hasInitializedRef.current) {
        const layerMissing = !mapInstance.getLayer(layerIdRef.current)
        if (layerMissing) {
          setTimeout(() => {
            if (mapInstance.isStyleLoaded() && !mapInstance.getLayer(layerIdRef.current)) {
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
      mapInstance.off('styledata', handleStyleData)
      if (mapInstance.getLayer(layerIdRef.current)) {
        mapInstance.off('click', layerIdRef.current, handleClick)
        mapInstance.off('mouseenter', layerIdRef.current)
        mapInstance.off('mouseleave', layerIdRef.current)
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
