import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import Map, { NavigationControl, ScaleControl, GeolocateControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

const BASEMAP_STYLES = {
  osm: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  light: {
    version: 8,
    sources: {
      light: {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors, &copy; CARTO',
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'light',
        type: 'raster',
        source: 'light',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
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
  className = "h-full w-full",
  showBasemapSelector = true
}, ref) {
  const mapRef = useRef()
  const [mapStyle, setMapStyle] = useState('osm')

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
        mapStyle={BASEMAP_STYLES[mapStyle]}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        <ScaleControl />

        {/* Basemap Switcher - Bottom Right, above map credits */}
        {showBasemapSelector && (
          <div className="absolute bottom-8 right-2 sm:right-4 z-10">
            <div className="dropdown dropdown-top dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-xs sm:btn-sm gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <span className="hidden sm:inline text-xs">Basemap</span>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 sm:w-44 mb-2">
                <li>
                  <a
                    onClick={() => setMapStyle('osm')}
                    className={`${mapStyle === 'osm' ? 'active' : ''} text-xs`}
                  >
                    OpenStreetMap
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setMapStyle('light')}
                    className={`${mapStyle === 'light' ? 'active' : ''} text-xs`}
                  >
                    Light
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setMapStyle('satellite')}
                    className={`${mapStyle === 'satellite' ? 'active' : ''} text-xs`}
                  >
                    Satellite
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {children}
      </Map>
    </div>
  )
})

export default MapComponent
