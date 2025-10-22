import { useState } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'

export default function BurnScar() {
  const [dateRange, setDateRange] = useState({ start: '2025-09-05', end: '2025-10-25' })
  const [severity, setSeverity] = useState('all')
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
      <h3 className="font-bold mb-3 text-sm">Fire Data Settings</h3>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Start Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">End Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Burn Severity</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="low">Low Severity</option>
          <option value="moderate">Moderate Severity</option>
          <option value="high">High Severity</option>
        </select>
      </div>

      <div className="divider text-xs">Legend</div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-yellow-400 rounded"></div>
          <span>Low Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-orange-500 rounded"></div>
          <span>Moderate Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-red-700 rounded"></div>
          <span>High Severity</span>
        </div>
      </div>
    </div>
  )

  const chartContent = (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Total Burn Area</div>
          <div className="stat-value text-xl text-error">48 km²</div>
          <div className="stat-desc">Last 30 days</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Active Fires</div>
          <div className="stat-value text-xl text-warning">12</div>
          <div className="stat-desc">Current incidents</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">High Severity</div>
          <div className="stat-value text-xl">18 km²</div>
          <div className="stat-desc">37.5% of total</div>
        </div>
      </div>
    </div>
  )

  const cropInfoContent = (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs text-base-content/60 mb-1">Detection Method</div>
          <div className="font-medium">NBR Analysis</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Last Updated</div>
          <div className="font-medium">Oct 7, 2025</div>
        </div>
      </div>
    </div>
  )

  const activitiesContent = (
    <div className="py-4">
      <div className="space-y-3 text-sm">
        <div className="flex gap-3">
          <div className="text-xs text-base-content/60 w-24">Oct 7, 2025</div>
          <div className="flex-1">
            <div className="font-medium text-error">New Burn Scar Detected</div>
            <div className="text-xs text-base-content/60">Area: 12 km² - High Severity</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-xs text-base-content/60 w-24">Sep 17, 2025</div>
          <div className="flex-1">
            <div className="font-medium text-warning">Fire Event</div>
            <div className="text-xs text-base-content/60">Multiple hotspots detected</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <MapLayout
      title="Burn Scar Tracking"
      area="48 km² affected"
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
