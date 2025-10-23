import { useState } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'

export default function HotspotPredicting() {
  const [predictionDays, setPredictionDays] = useState(7)
  const [confidence, setConfidence] = useState('all')
  const [showHistorical, setShowHistorical] = useState(false)
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
      <h3 className="font-bold mb-3 text-sm">Prediction Settings</h3>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Prediction Period: {predictionDays} days</span>
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={predictionDays}
          className="range range-error range-xs"
          step="1"
          onChange={(e) => setPredictionDays(Number(e.target.value))}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Confidence Level</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="high">High (&gt;80%)</option>
          <option value="medium">Medium (50-80%)</option>
          <option value="low">Low (&lt;50%)</option>
        </select>
      </div>

      <div className="form-control mb-4">
        <label className="label cursor-pointer">
          <span className="label-text text-xs">Show Historical Hotspots</span>
          <input
            type="checkbox"
            className="toggle toggle-accent toggle-sm"
            checked={showHistorical}
            onChange={(e) => setShowHistorical(e.target.checked)}
          />
        </label>
      </div>

      <div className="divider text-xs">Model Parameters</div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Temperature</span>
          <span className="badge badge-xs">Active</span>
        </div>
        <div className="flex justify-between">
          <span>Humidity</span>
          <span className="badge badge-xs">Active</span>
        </div>
        <div className="flex justify-between">
          <span>Wind Speed</span>
          <span className="badge badge-xs">Active</span>
        </div>
        <div className="flex justify-between">
          <span>Vegetation NDVI</span>
          <span className="badge badge-xs">Active</span>
        </div>
        <div className="flex justify-between">
          <span>Historical Data</span>
          <span className="badge badge-xs">Active</span>
        </div>
      </div>

      <button className="btn btn-primary btn-sm w-full mt-4">
        Update Prediction
      </button>
      <button className="btn btn-outline btn-accent btn-sm w-full mt-2">
        Download Alert List
      </button>
    </div>
  )

  const chartContent = (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Predicted Hotspots</div>
          <div className="stat-value text-xl text-error">23</div>
          <div className="stat-desc">Next {predictionDays} days</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Model Accuracy</div>
          <div className="stat-value text-xl text-success">87%</div>
          <div className="stat-desc">Last 30 days validation</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">High Risk Areas</div>
          <div className="stat-value text-xl text-warning">8</div>
          <div className="stat-desc">Immediate attention</div>
        </div>
      </div>
    </div>
  )

  return (
    <MapLayout
      title="Hotspot Predicting"
      area="200 km² coverage"
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
          chartData={chartContent}
        />
      }
    >
      <Map />
    </MapLayout>
  )
}
