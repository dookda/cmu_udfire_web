import { useRef, useEffect, useState } from 'react'
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

export default function MapComponent({
  initialViewState = {
    longitude: 98.9519,
    latitude: 18.8025,
    zoom: 12
  },
  children,
  onMapLoad,
  className = "h-full w-full"
}) {
  const mapRef = useRef()
  const [mapStyle, setMapStyle] = useState('osm')

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

        {/* Basemap Switcher */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-xs md:btn-sm btn-primary">
              <span className="hidden sm:inline">Basemap</span>
              <span className="sm:hidden">Map</span>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 sm:w-52 mt-2">
              <li>
                <a
                  onClick={() => setMapStyle('osm')}
                  className={`${mapStyle === 'osm' ? 'active' : ''} text-xs sm:text-sm`}
                >
                  <span className="hidden sm:inline">OpenStreetMap</span>
                  <span className="sm:hidden">OSM</span>
                </a>
              </li>
              <li>
                <a
                  onClick={() => setMapStyle('satellite')}
                  className={`${mapStyle === 'satellite' ? 'active' : ''} text-xs sm:text-sm`}
                >
                  Satellite
                </a>
              </li>
            </ul>
          </div>
        </div>

        {children}
      </Map>
    </div>
  )
}
