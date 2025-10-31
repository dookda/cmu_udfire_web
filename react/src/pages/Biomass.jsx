import { useState, useEffect, useMemo, useRef } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'
import GEETileLayer from '../components/GEETileLayer'
import LayerLegend from '../components/LayerLegend'
import { useGEELayer } from '../hooks/useGEELayer'
import { fitMapToBounds } from '../utils/mapUtils'

export default function Biomass() {
  const [selectedDate, setSelectedDate] = useState('2024-12-31')
  const [selectedArea, setSelectedArea] = useState('ud')
  const [daysComposite, setDaysComposite] = useState(30)
  const [activeLayer, setActiveLayer] = useState('biomass_3pgs')
  const [showLayer, setShowLayer] = useState(true)
  const [analysisRun, setAnalysisRun] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const mapRef = useRef()
  const mapLayoutRef = useRef()

  // Study areas matching 3pgs.js
  const studyAreas = useMemo(() => [
    { value: 'ud', label: 'อุตรดิตถ์', longitude: 100.4945, latitude: 17.6152, zoom: 12 },
    { value: 'mt', label: 'แม่ทาเหนือ เชียงใหม่', longitude: 99.2568, latitude: 18.7885, zoom: 12 },
    { value: 'ky', label: 'ขุนยวม แม่ฮ่องสอน', longitude: 98.5375, latitude: 18.8046, zoom: 12 },
    { value: 'vs', label: 'เวียงสา น่าน', longitude: 100.7994, latitude: 18.5397, zoom: 12 },
    { value: 'msr', label: 'แม่สะเรียง แม่ฮ่องสอน', longitude: 98.2615, latitude: 18.1750, zoom: 12 }
  ], [])

  // Fetch GEE biomass layer data only when analysis is run
  const { loading, error, layerData } = useGEELayer(analysisRun ? 'biomass' : null, {
    area: selectedArea,
    endDate: selectedDate,
    days: daysComposite
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

  // Get layer name in Thai
  const getLayerName = () => {
    const names = {
      'ndvi': 'NDVI',
      'biomass_3pgs': 'Biomass 3PGs',
      'biomass_equation': 'Biomass (Parinwat & Sakda Equation)'
    }
    return names[activeLayer] || activeLayer
  }

  const sidePanel = (
    <div className="p-4">
      <h3 className="font-bold mb-3 text-sm">ติดตามปริมาณเชื้อเพลิง</h3>
      <p className="text-xs text-base-content/70 mb-4">คำนวณปริมาณเชื้อเพลิงด้วยวิธี 3PGs และสมการที่พัฒนาขึ้น</p>

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

      {/* Layer Type Selector */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">เลือกชั้นข้อมูล</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={activeLayer}
          onChange={(e) => setActiveLayer(e.target.value)}
        >
          <option value="ndvi">NDVI</option>
          <option value="biomass_3pgs">Biomass 3PGs</option>
          <option value="biomass_equation">Biomass (สมการ Parinwat & Sakda)</option>
        </select>
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

      {/* Date Selector */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">เลือกวันที่</span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Days Composite Selector */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">จำนวนวัน Composite</span>
          <span className="label-text-alt text-xs">{daysComposite} วัน</span>
        </label>
        <input
          type="range"
          min="7"
          max="90"
          value={daysComposite}
          onChange={(e) => setDaysComposite(Number(e.target.value))}
          className="range range-sm range-primary"
        />
        <div className="w-full flex justify-between text-xs px-2 mt-1">
          <span>7</span>
          <span>30</span>
          <span>90</span>
        </div>
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
          <div className="stat-title text-xs sm:text-sm">Avg Biomass</div>
          <div className="stat-value text-2xl sm:text-3xl text-success">142 t/ha</div>
          <div className="stat-desc text-xs">Tons per hectare</div>
        </div>
        <div className="stat bg-base-300 rounded-lg p-4">
          <div className="stat-title text-xs sm:text-sm">Total Carbon</div>
          <div className="stat-value text-2xl sm:text-3xl">71 tC/ha</div>
          <div className="stat-desc text-xs">Carbon storage</div>
        </div>
        <div className="stat bg-base-300 rounded-lg p-4">
          <div className="stat-title text-xs sm:text-sm">Growth Rate</div>
          <div className="stat-value text-2xl sm:text-3xl">+8.2%</div>
          <div className="stat-desc text-xs">Annual increase</div>
        </div>
      </div>
    </div>
  )

  return (
    <MapLayout
      ref={mapLayoutRef}
      title={`${getAreaName()} - ติดตามปริมาณเชื้อเพลิง`}
      area="ข้อมูล: MODIS"
      coordinates="18.7128° N • 98.9950° E"
      sidePanel={sidePanel}
      bottomPanel={
        <BottomPanel
          chartData={chartContent}
        />
      }
    >
      <Map ref={mapRef}>
        {/* Render GEE Layer based on active layer selection and visibility toggle */}
        {analysisRun && showLayer && layerData && layerData[activeLayer] && layerData[activeLayer].tile_url && (
          <>
            <GEETileLayer
              tileUrl={layerData[activeLayer].tile_url}
              opacity={0.7}
            />
            {/* Layer Legend - Bottom Left */}
            <div className="absolute bottom-4 left-2 sm:left-4 z-10">
              <LayerLegend
                layerType={activeLayer}
                visParams={layerData[activeLayer].vis_params}
              />
            </div>
          </>
        )}
      </Map>
    </MapLayout>
  )
}
