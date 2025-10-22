import { useRef, forwardRef, useImperativeHandle } from 'react'
import Map, { NavigationControl, ScaleControl, GeolocateControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

const BASEMAP_STYLES = {
  satellite: {
    version: 8,
    sources: {
      satellite: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri',
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'satellite',
        type: 'raster',
        source: 'satellite',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  }
}

const MapComponent = forwardRef(function MapComponent({
  initialViewState = {
    longitude: 98.9519,
    latitude: 18.8025,
    zoom: 12
  },
  children,
  onMapLoad,
  className = "h-full w-full"
}, ref) {
  const mapRef = useRef()

  // Expose map methods via ref
  useImperativeHandle(ref, () => ({
    flyTo: (options) => {
      if (mapRef.current) {
        mapRef.current.flyTo(options)
      }
    },
    getMap: () => mapRef.current
  }))

  const handleMapLoad = (event) => {
    if (onMapLoad) {
      onMapLoad(event.target)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={BASEMAP_STYLES.satellite}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        <ScaleControl />

        {children}
      </Map>
    </div>
  )
})

export default MapComponent
