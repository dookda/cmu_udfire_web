import { useState, useMemo, useRef, useEffect } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import BottomPanel from '../components/BottomPanel'
import GEETileLayer from '../components/GEETileLayer'
import LayerLegend from '../components/LayerLegend'
import { useGEELayer } from '../hooks/useGEELayer'
import { fitMapToBounds } from '../utils/mapUtils'
import ErrorBoundary from '../components/ErrorBoundary'

export default function FloodSim() {
  const [beforeDate, setBeforeDate] = useState('2024-08-01')
  const [afterDate, setAfterDate] = useState('2024-09-30')
  const [selectedArea, setSelectedArea] = useState('ud')
  const [showLayer, setShowLayer] = useState(true)
  const [analysisRun, setAnalysisRun] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const mapRef = useRef()
  const mapLayoutRef = useRef()

  // Study areas
  const studyAreas = useMemo(() => [
    { value: 'ud', label: 'อุตรดิตถ์', longitude: 100.4945, latitude: 17.6152, zoom: 12 },
    { value: 'mt', label: 'แม่ทาเหนือ เชียงใหม่', longitude: 99.2568, latitude: 18.7885, zoom: 12 },
    { value: 'ky', label: 'ขุนยวม แม่ฮ่องสอน', longitude: 98.5375, latitude: 18.8046, zoom: 12 },
    { value: 'vs', label: 'เวียงสา น่าน', longitude: 100.7994, latitude: 18.5397, zoom: 12 },
    { value: 'msr', label: 'แม่สะเรียง แม่ฮ่องสอน', longitude: 98.2615, latitude: 18.1750, zoom: 12 }
  ], [])

  // Fetch GEE flood layer only when analysis is run
  const { loading, error, layerData } = useGEELayer(
    analysisRun ? 'flood' : null,
    {
      area: selectedArea,
      beforeDate: beforeDate,
      afterDate: afterDate
    }
  )

  // Auto-zoom to study area using bounds from GEE data when available
  useEffect(() => {
    fitMapToBounds({ mapRef, layerData, studyAreas, selectedArea })
  }, [selectedArea, studyAreas, layerData])

  // Auto-close modal when GEE data loads successfully
  useEffect(() => {
    if (!loading && !error && layerData && analysisRun && mapLayoutRef.current) {
      // Show success state briefly before closing
      setShowSuccess(true)
      const timer = setTimeout(() => {
        mapLayoutRef.current.closeModal()
        setShowSuccess(false)
      }, 1000) // Show success for 1 second before closing

      return () => clearTimeout(timer)
    }
  }, [loading, error, layerData, analysisRun])

  // Get area name in Thai
  const getAreaName = () => {
    const area = studyAreas.find(a => a.value === selectedArea)
    return area ? area.label : 'พื้นที่ศึกษา'
  }

  const handleRunAnalysis = () => {
    setAnalysisRun(true)
  }

  const handleClearAnalysis = () => {
    setAnalysisRun(false)
    setShowLayer(true)
  }

  const sidePanel = (
    <div className="p-4">
      <h3 className="font-bold mb-3 text-sm">การวิเคราะห์น้ำท่วม</h3>
      <p className="text-xs text-base-content/70 mb-4">ใช้ข้อมูล Sentinel-1 SAR เพื่อตรวจจับพื้นที่น้ำท่วม</p>

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

      {/* Before Flood Date */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">วันที่ก่อนน้ำท่วม</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={beforeDate}
          onChange={(e) => setBeforeDate(e.target.value)}
        />
      </div>

      {/* After Flood Date */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">วันที่หลังน้ำท่วม</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={afterDate}
          onChange={(e) => setAfterDate(e.target.value)}
        />
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

      {/* Loading/Error/Success Status */}
      {loading && !showSuccess && (
        <div className="mt-4 p-4 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary">กำลังประมวลผล...</div>
              <div className="text-xs text-base-content/60 mt-1">กำลังโหลดข้อมูลจาก Google Earth Engine</div>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="mt-4 p-4 bg-success/5 backdrop-blur-sm rounded-lg border border-success/10">
          <div className="flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-center">
              <div className="text-sm font-semibold text-success">โหลดข้อมูลสำเร็จ!</div>
              <div className="text-xs text-base-content/60 mt-1">กำลังแสดงผลบนแผนที่...</div>
            </div>
          </div>
        </div>
      )}
      {error && !loading && !showSuccess && (
        <div className="mt-4 alert alert-error alert-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  )

  const chartContent = (
    <div className="py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="stat bg-base-300 rounded-lg p-4">
          <div className="stat-title text-xs sm:text-sm">พื้นที่น้ำท่วม</div>
          <div className="stat-value text-2xl sm:text-3xl text-info">
            {layerData?.flood_area ? `${layerData.flood_area.toFixed(2)} km²` : '-'}
          </div>
          <div className="stat-desc text-xs">Flooded Area</div>
        </div>
        <div className="stat bg-base-300 rounded-lg p-4">
          <div className="stat-title text-xs sm:text-sm">การเปลี่ยนแปลง</div>
          <div className="stat-value text-2xl sm:text-3xl text-warning">
            {layerData?.difference ? `${layerData.difference.toFixed(1)} dB` : '-'}
          </div>
          <div className="stat-desc text-xs">SAR Difference</div>
        </div>
        <div className="stat bg-base-300 rounded-lg p-4">
          <div className="stat-title text-xs sm:text-sm">ความเชื่อมั่น</div>
          <div className="stat-value text-2xl sm:text-3xl text-success">
            {layerData?.confidence ? `${layerData.confidence}%` : '-'}
          </div>
          <div className="stat-desc text-xs">Detection Confidence</div>
        </div>
      </div>
    </div>
  )

  return (
    <ErrorBoundary>
      <MapLayout
        ref={mapLayoutRef}
        title={`${getAreaName()} - การวิเคราะห์น้ำท่วม`}
        area="ข้อมูล: Sentinel-1"
        coordinates="18.7128° N • 98.9950° E"
        sidePanel={sidePanel}
        bottomPanel={
          <BottomPanel
            chartData={chartContent}
          />
        }
      >
        <Map key="flood-map" ref={mapRef}>
          {/* Render GEE Flood Layer */}
          {analysisRun && showLayer && layerData && layerData.tile_url && (
            <>
              <GEETileLayer
                tileUrl={layerData.tile_url}
                opacity={0.7}
              />
              {/* Layer Legend - Bottom Left */}
              <div className="absolute bottom-4 left-2 sm:left-4 z-10">
                <LayerLegend
                  layerType="flood"
                  visParams={layerData.vis_params}
                />
              </div>
            </>
          )}
        </Map>
      </MapLayout>
    </ErrorBoundary>
  )
}
