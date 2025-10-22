import { useState } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'

export default function FloodSim() {
  const [scenario, setScenario] = useState('normal')
  const [rainfall, setRainfall] = useState(100)
  const [duration, setDuration] = useState(24)
  const [selectedDate, setSelectedDate] = useState('2025-10-07')

  const timelineDates = [
    { date: '2025-09-05', cloudCover: false },
    { date: '2025-09-17', cloudCover: true },
    { date: '2025-10-07', cloudCover: false },
    { date: '2025-10-17', cloudCover: false },
    { date: '2025-10-25', cloudCover: false }
  ]

  const sidePanel = (
    <div className="p-4">
      <h3 className="font-bold mb-3 text-sm">Simulation Parameters</h3>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Rainfall Scenario</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        >
          <option value="normal">Normal Rainfall</option>
          <option value="heavy">Heavy Rainfall</option>
          <option value="extreme">Extreme Rainfall</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Rainfall Amount: {rainfall} mm</span>
        </label>
        <input
          type="range"
          min="0"
          max="500"
          value={rainfall}
          className="range range-primary range-xs"
          step="10"
          onChange={(e) => setRainfall(Number(e.target.value))}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Duration: {duration} hours</span>
        </label>
        <input
          type="range"
          min="1"
          max="72"
          value={duration}
          className="range range-secondary range-xs"
          step="1"
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      <div className="divider text-xs">Flood Risk Levels</div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-400 rounded"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-yellow-400 rounded"></div>
          <span>Moderate Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-orange-500 rounded"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-red-700 rounded"></div>
          <span>Extreme Risk</span>
        </div>
      </div>

      <button className="btn btn-primary btn-sm w-full mt-4">
        Run Simulation
      </button>
      <button className="btn btn-outline btn-secondary btn-sm w-full mt-2">
        Export Results
      </button>
    </div>
  )

  const chartContent = (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">At-Risk Area</div>
          <div className="stat-value text-xl text-warning">32 km²</div>
          <div className="stat-desc">Under current scenario</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Population</div>
          <div className="stat-value text-xl">15,420</div>
          <div className="stat-desc">People in risk zones</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Max Depth</div>
          <div className="stat-value text-xl text-error">2.8 m</div>
          <div className="stat-desc">Predicted maximum</div>
        </div>
      </div>
    </div>
  )

  const cropInfoContent = (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs text-base-content/60 mb-1">Model Type</div>
          <div className="font-medium">HEC-RAS 2D</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Resolution</div>
          <div className="font-medium">10m DEM</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Confidence</div>
          <div className="font-medium text-success">High (85%)</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Last Run</div>
          <div className="font-medium">Oct 7, 2025</div>
        </div>
      </div>
    </div>
  )

  return (
    <MapLayout
      title="Flood Simulation"
      area="125 km² study area"
      coordinates="18.7128° N • 98.9950° E"
      sidePanel={sidePanel}
      timelineData={
        <Timeline
          dates={timelineDates}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date.date)}
        />
      }
      bottomPanel={
        <BottomPanel
          cropInfo={cropInfoContent}
          chartData={chartContent}
        />
      }
    >
      <Map />
    </MapLayout>
  )
}
