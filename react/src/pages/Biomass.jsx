import { useState } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'

export default function Biomass() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [modelParams, setModelParams] = useState({
    soilType: 'sandy',
    fertility: 'medium'
  })
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
      <h3 className="font-bold mb-3 text-sm">3PG Model Parameters</h3>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Year</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[2025, 2024, 2023, 2022, 2021, 2020].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Soil Type</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={modelParams.soilType}
          onChange={(e) => setModelParams({ ...modelParams, soilType: e.target.value })}
        >
          <option value="sandy">Sandy</option>
          <option value="loamy">Loamy</option>
          <option value="clay">Clay</option>
        </select>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs">Soil Fertility</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={modelParams.fertility}
          onChange={(e) => setModelParams({ ...modelParams, fertility: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="divider text-xs">Biomass Density</div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-yellow-200 rounded"></div>
          <span>0-50 t/ha</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-300 rounded"></div>
          <span>50-100 t/ha</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-600 rounded"></div>
          <span>100-200 t/ha</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-900 rounded"></div>
          <span>&gt;200 t/ha</span>
        </div>
      </div>

      <button className="btn btn-primary btn-sm w-full mt-4">
        Run Simulation
      </button>
    </div>
  )

  const chartContent = (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Avg Biomass</div>
          <div className="stat-value text-xl text-success">142 t/ha</div>
          <div className="stat-desc">Tons per hectare</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Total Carbon</div>
          <div className="stat-value text-xl">71 tC/ha</div>
          <div className="stat-desc">Carbon storage</div>
        </div>
        <div className="stat bg-base-300 rounded-lg">
          <div className="stat-title text-xs">Growth Rate</div>
          <div className="stat-value text-xl">+8.2%</div>
          <div className="stat-desc">Annual increase</div>
        </div>
      </div>
    </div>
  )

  const cropInfoContent = (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs text-base-content/60 mb-1">Forest Type</div>
          <div className="font-medium">Mixed Deciduous</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Stand Age</div>
          <div className="font-medium">18 years</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Model Accuracy</div>
          <div className="font-medium text-success">92.5%</div>
        </div>
        <div>
          <div className="text-xs text-base-content/60 mb-1">Last Calibrated</div>
          <div className="font-medium">Jan 2025</div>
        </div>
      </div>
    </div>
  )

  const activitiesContent = (
    <div className="py-4">
      <div className="space-y-3 text-sm">
        <div className="flex gap-3">
          <div className="text-xs text-base-content/60 w-24">Oct 15, 2025</div>
          <div className="flex-1">
            <div className="font-medium">Model Update</div>
            <div className="text-xs text-base-content/60">Seasonal parameters adjusted</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-xs text-base-content/60 w-24">Sep 1, 2025</div>
          <div className="flex-1">
            <div className="font-medium">Field Measurement</div>
            <div className="text-xs text-base-content/60">Ground truth data collected</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <MapLayout
      title="3PGs Biomass Model"
      area="150 ha forest"
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
