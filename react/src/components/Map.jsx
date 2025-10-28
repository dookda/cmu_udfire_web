import { useRef, forwardRef, useImperativeHandle, useState } from 'react'
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
  },
  light: {
    version: 8,
    sources: {
      'carto-light': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxzoom: 22
      }
    },
    layers: [
      {
        id: 'carto-light',
        type: 'raster',
        source: 'carto-light',
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
  basemap = 'satellite'
}, ref) {
  const mapRef = useRef()

  // Expose map methods via ref
  useImperativeHandle(ref, () => ({
    flyTo: (options) => {
      if (mapRef.current) {
        mapRef.current.flyTo(options)
      }
    },
    getMap: () => mapRef.current ? mapRef.current.getMap() : null
  }))

  const handleMapLoad = (event) => {
    if (onMapLoad) {
      onMapLoad(event.target)
    }
  }

  return (
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={BASEMAP_STYLES[basemap]}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
        className={className}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {children}
      </Map>
  )
})

export default MapComponent