import { useState, useEffect, useMemo, useRef } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BottomPanel from '../components/BottomPanel'
import GEETileLayer from '../components/GEETileLayer'
import LayerLegend from '../components/LayerLegend'
import { useGEELayer } from '../hooks/useGEELayer'

export default function Biomass() {
  const [selectedDate, setSelectedDate] = useState('2024-12-31')
  const [selectedArea, setSelectedArea] = useState('ud')
  const [daysComposite, setDaysComposite] = useState(30)
  const [activeLayer, setActiveLayer] = useState('biomass_3pgs')
  const [showLayer, setShowLayer] = useState(true)
  const mapRef = useRef()

  // Study areas matching 3pgs.js
  const studyAreas = useMemo(() => [
    { value: 'ud', label: 'อุตรดิตถ์', longitude: 100.4945, latitude: 17.6152, zoom: 12 },
    { value: 'mt', label: 'แม่ทาเหนือ เชียงใหม่', longitude: 99.2568, latitude: 18.7885, zoom: 12 },
    { value: 'ky', label: 'ขุนยวม แม่ฮ่องสอน', longitude: 98.5375, latitude: 18.8046, zoom: 12 },
    { value: 'vs', label: 'เวียงสา น่าน', longitude: 100.7994, latitude: 18.5397, zoom: 12 },
    { value: 'msr', label: 'แม่สะเรียง แม่ฮ่องสอน', longitude: 98.2615, latitude: 18.1750, zoom: 12 }
  ], [])

  // Auto-zoom to study area when selection changes
  useEffect(() => {
    const area = studyAreas.find(a => a.value === selectedArea)
    if (area && mapRef.current) {
      mapRef.current.flyTo({
        center: [area.longitude, area.latitude],
        zoom: area.zoom,
        duration: 1000
      })
    }
  }, [selectedArea, studyAreas])

  // Fetch GEE biomass layer data
  const { loading, error, layerData } = useGEELayer('biomass', {
    area: selectedArea,
    endDate: selectedDate,
    days: daysComposite
  })

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

      <div className="divider text-xs">สัญลักษณ์</div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-purple-600 rounded"></div>
          <span>ต่ำ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-purple-300 rounded"></div>
          <span>ปานกลาง</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-yellow-100 rounded"></div>
          <span>สูง</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-orange-300 rounded"></div>
          <span>สูงมาก</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-orange-600 rounded"></div>
          <span>สูงที่สุด</span>
        </div>
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

  return (
    <MapLayout
      title={`${getAreaName()} - ติดตามปริมาณเชื้อเพลิง`}
      area="ข้อมูล: MODIS"
      coordinates="18.7128° N • 98.9950° E"
      sidePanel={sidePanel}
      bottomPanel={
        <BottomPanel
          cropInfo={cropInfoContent}
          chartData={chartContent}
        />
      }
    >
      <Map ref={mapRef}>
        {/* Render GEE Layer based on active layer selection and visibility toggle */}
        {showLayer && layerData && layerData[activeLayer] && layerData[activeLayer].tile_url && (
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
