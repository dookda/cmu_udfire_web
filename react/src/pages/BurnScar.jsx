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
  const [analysisRun, setAnalysisRun] = useState(false)
  const mapRef = useRef()

  // Study areas with coordinates (matching GEE script)
  const studyAreas = useMemo(() => [
    { value: 'mt', label: 'แม่ทาเหนือ เชียงใหม่', longitude: 99.2568, latitude: 18.7885, zoom: 12 },
    { value: 'st', label: 'สบเตี๊ยะ เชียงใหม่', longitude: 99.1234, latitude: 18.6543, zoom: 12 },
    { value: 'ud', label: 'ป่าชุมชน อุตรดิตถ์', longitude: 100.4945, latitude: 17.6152, zoom: 12 },
    { value: 'ky', label: 'ขุนยวม แม่ฮ่องสอน', longitude: 98.5375, latitude: 18.8046, zoom: 12 },
    { value: 'vs', label: 'เวียงสา น่าน', longitude: 100.7994, latitude: 18.5397, zoom: 12 }
  ], [])

  // Fetch GEE burn scar layer data only when analysis is run
  const { loading, error, layerData } = useGEELayer(analysisRun ? 'burn-scar' : null, {
    area: selectedArea,
    startDate: dateRange.start,
    endDate: dateRange.end,
    cloudCover: cloudCover
  })

  const handleRunAnalysis = () => {
    setAnalysisRun(true)
  }

  const handleClearAnalysis = () => {
    setAnalysisRun(false)
    setShowLayer(true)
  }

  // Auto-zoom to study area using bounds from GEE data when available
  useEffect(() => {
    fitMapToBounds({ mapRef, layerData, studyAreas, selectedArea })
  }, [selectedArea, studyAreas, layerData])

  // Get area name in Thai
  const getAreaName = () => {
    const area = studyAreas.find(a => a.value === selectedArea)
    return area ? area.label : 'พื้นที่ศึกษา'
  }

  // Calculate burn area statistics from layerData
  const burnStats = useMemo(() => {
    if (!layerData?.burn_scars?.statistics) {
      return {
        totalArea: '0.00',
        lowSeverity: '0.00',
        moderateSeverity: '0.00',
        highSeverity: '0.00',
        totalPixels: 0,
        lowPixels: 0,
        moderatePixels: 0,
        highPixels: 0,
        highPercentage: '0.0'
      }
    }

    const stats = layerData.burn_scars.statistics

    // Backend now returns area in km² directly
    const totalArea = stats.total_area_km2 || 0
    const lowArea = stats.low_area_km2 || 0
    const moderateArea = stats.moderate_area_km2 || 0
    const highArea = stats.high_area_km2 || 0

    const totalPixels = stats.total_pixels || 0
    const lowPixels = stats.low_severity_pixels || 0
    const moderatePixels = stats.moderate_severity_pixels || 0
    const highPixels = stats.high_severity_pixels || 0

    const highPercentage = totalPixels > 0 ? ((highPixels / totalPixels) * 100).toFixed(1) : '0.0'

    return {
      totalArea: totalArea.toFixed(2),
      lowSeverity: lowArea.toFixed(2),
      moderateSeverity: moderateArea.toFixed(2),
      highSeverity: highArea.toFixed(2),
      totalPixels,
      lowPixels,
      moderatePixels,
      highPixels,
      highPercentage
    }
  }, [layerData])

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
      {analysisRun && (
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
      )}

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

      {/* Action Buttons */}
      <button
        className="btn btn-primary btn-sm w-full mt-4"
        onClick={handleRunAnalysis}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            กำลังวิเคราะห์...
          </>
        ) : (
          'รันการวิเคราะห์'
        )}
      </button>
      <button
        className="btn btn-outline btn-secondary btn-sm w-full mt-2"
        onClick={handleClearAnalysis}
        disabled={!analysisRun}
      >
        ล้างข้อมูล
      </button>

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
    <div className="py-2">
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <span className="ml-3 text-sm">คำนวณพื้นที่ไฟไหม้...</span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">ไม่สามารถโหลดข้อมูลได้</span>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {/* Total Burn Area Card */}
            <div className="card bg-gradient-to-br from-error/10 to-error/5 border border-error/20">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-base-content/70 mb-1">พื้นที่ไฟไหม้ทั้งหมด</div>
                    <div className="text-xl sm:text-2xl font-bold text-error">
                      {burnStats.totalArea}
                      <span className="text-xs sm:text-sm ml-1">km²</span>
                    </div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {burnStats.totalPixels.toLocaleString()} พิกเซล
                    </div>
                  </div>
                  <div className="bg-error/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderate Severity Card */}
            <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-base-content/70 mb-1">ไฟไหม้ระดับปานกลาง</div>
                    <div className="text-xl sm:text-2xl font-bold text-warning">
                      {burnStats.moderateSeverity}
                      <span className="text-xs sm:text-sm ml-1">km²</span>
                    </div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {burnStats.moderatePixels.toLocaleString()} พิกเซล
                    </div>
                  </div>
                  <div className="bg-warning/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* High Severity Card */}
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="card-body p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-base-content/70 mb-1">ไฟไหม้รุนแรง</div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {burnStats.highSeverity}
                      <span className="text-xs sm:text-sm ml-1">km²</span>
                    </div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {burnStats.highPercentage}% ของพื้นที่ทั้งหมด
                    </div>
                  </div>
                  <div className="bg-primary/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Low Severity Info - Secondary Row */}
          {burnStats.totalPixels > 0 && (
            <div className="mt-2 sm:mt-3 grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-base-200 rounded-lg">
                <span className="text-xs text-base-content/70">ไฟไหม้น้อย</span>
                <span className="text-xs sm:text-sm font-semibold">{burnStats.lowSeverity} km²</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-base-200 rounded-lg">
                <span className="text-xs text-base-content/70">ช่วงเวลา</span>
                <span className="text-xs sm:text-sm font-semibold">{dateRange.start} - {dateRange.end}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-base-200 rounded-lg">
                <span className="text-xs text-base-content/70">พื้นที่</span>
                <span className="text-xs sm:text-sm font-semibold">{getAreaName()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Data Message */}
      {!loading && !error && burnStats.totalPixels === 0 && (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-sm">ไม่พบข้อมูลพื้นที่ไฟไหม้ในช่วงเวลาที่เลือก</span>
        </div>
      )}
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
        {/* Loading Overlay for GEE Data */}
        {loading && (
          <div className="absolute inset-0 bg-base-100/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-base-100 p-6 rounded-lg shadow-xl flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <span className="text-sm font-medium">กำลังโหลดข้อมูลจาก Google Earth Engine...</span>
            </div>
          </div>
        )}

        {/* Render GEE Burn Scar Layer */}
        {analysisRun && showLayer && layerData && layerData.burn_scars && layerData.burn_scars.tile_url && (
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
