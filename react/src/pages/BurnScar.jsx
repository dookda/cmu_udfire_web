import { useState, useEffect, useMemo, useRef } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'
import GEETileLayer from '../components/GEETileLayer'
import LayerLegend from '../components/LayerLegend'
import { useGEELayer } from '../hooks/useGEELayer'
import { fitMapToBounds } from '../utils/mapUtils'

export default function BurnScar() {
  const [dateRange, setDateRange] = useState({ start: '2025-09-05', end: '2025-10-25' })
  const [severity, setSeverity] = useState('all')
  const [selectedDate, setSelectedDate] = useState('2025-10-07')
  const [selectedArea, setSelectedArea] = useState('ud')
  const [cloudCover, setCloudCover] = useState(30)
  const [showLayer, setShowLayer] = useState(true)
  const mapRef = useRef()

  // Study areas with coordinates (matching GEE script)
  const studyAreas = useMemo(() => [
    { value: 'mt', label: 'แม่ทาเหนือ เชียงใหม่', longitude: 99.2568, latitude: 18.7885, zoom: 12 },
    { value: 'st', label: 'สบเตี๊ยะ เชียงใหม่', longitude: 99.1234, latitude: 18.6543, zoom: 12 },
    { value: 'ud', label: 'ป่าชุมชน อุตรดิตถ์', longitude: 100.4945, latitude: 17.6152, zoom: 12 },
    { value: 'ky', label: 'ขุนยวม แม่ฮ่องสอน', longitude: 98.5375, latitude: 18.8046, zoom: 12 },
    { value: 'vs', label: 'เวียงสา น่าน', longitude: 100.7994, latitude: 18.5397, zoom: 12 }
  ], [])

  // Fetch GEE burn scar layer data
  const { loading, error, layerData } = useGEELayer('burn-scar', {
    area: selectedArea,
    startDate: dateRange.start,
    endDate: dateRange.end,
    cloudCover: cloudCover
  })

  // Auto-zoom to study area using bounds from GEE data when available
  useEffect(() => {
    fitMapToBounds({ mapRef, layerData, studyAreas, selectedArea })
  }, [selectedArea, studyAreas, layerData])

  // Get area name in Thai
  const getAreaName = () => {
    const area = studyAreas.find(a => a.value === selectedArea)
    return area ? area.label : 'พื้นที่ศึกษา'
  }

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

      {/* Study Area Selector */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">เลือกพื้นที่</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          {studyAreas.map(area => (
            <option key={area.value} value={area.value}>{area.label}</option>
          ))}
        </select>
      </div>

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

      {/* Cloud Cover Slider */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">ระบุ % ปกคลุมของเมฆ</span>
          <span className="label-text-alt text-xs">{cloudCover}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={cloudCover}
          onChange={(e) => setCloudCover(Number(e.target.value))}
          className="range range-sm range-primary"
        />
        <div className="w-full flex justify-between text-xs px-2 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Show/Hide Layer Toggle */}
      <div className="form-control mb-4">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={showLayer}
            onChange={(e) => setShowLayer(e.target.checked)}
          />
          <span className="label-text text-xs font-bold">แสดงชั้นข้อมูล</span>
        </label>
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

      {/* Loading/Error Status */}
      {loading && (
        <div className="mt-4 text-xs text-info">
          <span className="loading loading-spinner loading-xs mr-1"></span>
          Loading layer...
        </div>
      )}
      {error && (
        <div className="mt-4 text-xs text-error">
          Error: {error}
        </div>
      )}
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

  return (
    <MapLayout
      title={`${getAreaName()} - Burn Scar Tracking`}
      area="ข้อมูล: Sentinel-2"
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
      <Map ref={mapRef}>
        {/* Render GEE Burn Scar Layer */}
        {showLayer && layerData && layerData.burn_scars && layerData.burn_scars.tile_url && (
          <>
            <GEETileLayer
              tileUrl={layerData.burn_scars.tile_url}
              opacity={0.7}
            />
            {/* Layer Legend - Bottom Left */}
            <div className="absolute bottom-4 left-2 sm:left-4 z-10">
              <LayerLegend
                layerType="burn"
                visParams={layerData.burn_scars.vis_params}
              />
            </div>
          </>
        )}
      </Map>
    </MapLayout>
  )
}
