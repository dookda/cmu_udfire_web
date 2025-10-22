import { useState } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'
import NDVIChart from '../components/NDVIChart'

export default function NDMIDrought() {
  const [selectedDate, setSelectedDate] = useState('2025-10-07')

  // Sample timeline data
  const timelineDates = [
    { date: '2025-09-05', cloudCover: false },
    { date: '2025-09-17', cloudCover: true },
    { date: '2025-10-07', cloudCover: false },
    { date: '2025-10-17', cloudCover: true },
    { date: '2025-10-25', cloudCover: false }
  ]

  // Sample NDVI data for chart
  const ndviData = {
    '2025': {
      values: Array.from({ length: 19 }, (_, i) => ({ value: 0.5 + Math.random() * 0.1 })),
      locked: false
    },
    '2024': {
      values: Array.from({ length: 19 }, (_, i) => ({ value: 0.45 + Math.random() * 0.1 })),
      locked: true
    },
    '2023': {
      values: Array.from({ length: 19 }, (_, i) => ({ value: 0.4 + Math.random() * 0.1 })),
      locked: true
    },
    '2022': {
      values: Array.from({ length: 19 }, (_, i) => ({ value: 0.48 + Math.random() * 0.1 })),
      locked: true
    },
    '2021': {
      values: Array.from({ length: 19 }, (_, i) => ({ value: 0.42 + Math.random() * 0.1 })),
      locked: true
    }
  }

  const sidePanel = (
    <div className="p-4">
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-warning mt-0.5">
            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <div className="text-xs">
            <strong>Season 2024</strong> season has ended. To select another season, click here.
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-3">Weather Data</h3>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Select data</span>
        </label>
        <select className="select select-bordered select-sm">
          <option>Sentinel-2 and 3</option>
        </select>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Start date</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          defaultValue="2025-07-22"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">End date</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          defaultValue="2025-10-21"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Data Source:</span>
        </label>
        <div className="text-sm">Sentinel-2 and 3</div>
      </div>
    </div>
  )

  const chartContent = (
    <NDVIChart data={ndviData} />
  )

  const cropInfoContent = (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-base-content/60 mb-1">Crop Type</div>
          <div className="font-medium">Rice Paddy</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Growth Stage</div>
          <div className="font-medium">Vegetative</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Health Index</div>
          <div className="font-medium text-success">Good (0.65)</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Water Stress</div>
          <div className="font-medium text-warning">Moderate</div>
        </div>
      </div>
    </div>
  )

  const activitiesContent = (
    <div className="py-4">
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="text-xs text-base-content/60 w-24">Oct 15, 2025</div>
          <div className="flex-1">
            <div className="font-medium">Irrigation</div>
            <div className="text-sm text-base-content/60">Applied 50mm water</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-xs text-base-content/60 w-24">Oct 10, 2025</div>
          <div className="flex-1">
            <div className="font-medium">Fertilization</div>
            <div className="text-sm text-base-content/60">NPK 15-15-15</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <MapLayout
      title="Field 1"
      area="26.2 ha"
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
          activities={activitiesContent}
        />
      }
    >
      <Map />
    </MapLayout>
  )
}
