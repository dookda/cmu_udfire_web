import { useMap } from 'react-map-gl/maplibre'
import { useState } from 'react'

export default function CustomNavigationControl() {
  const { current: map } = useMap()
  const [isTracking, setIsTracking] = useState(false)

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut()
    }
  }

  const handleResetNorth = () => {
    if (map) {
      map.resetNorth()
    }
  }

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      setIsTracking(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map) {
            map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 14
            })
          }
          setIsTracking(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsTracking(false)
        }
      )
    }
  }

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
      {/* Navigation Controls Group */}
      <div className="bg-base-100/80 backdrop-blur-md shadow-xl rounded-2xl p-2 border border-base-content/10">
        <div className="flex flex-col gap-2">
          {/* Zoom In */}
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          {/* Zoom Out */}
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>

          {/* Reset North */}
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleResetNorth}
            title="Reset bearing to north"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Geolocate */}
          <button
            className={`btn btn-sm btn-circle ${isTracking ? 'btn-primary' : 'btn-ghost'}`}
            onClick={handleGeolocate}
            title="Find my location"
            disabled={isTracking}
          >
            {isTracking ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
