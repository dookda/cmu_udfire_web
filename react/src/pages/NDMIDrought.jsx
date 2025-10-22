import { useState, useEffect, useMemo, useRef } from 'react'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import BottomPanel from '../components/BottomPanel'
import NDVIChart from '../components/NDVIChart'
import GEETileLayer from '../components/GEETileLayer'
import LayerLegend from '../components/LayerLegend'
import { useGEELayer } from '../hooks/useGEELayer'

export default function NDMIDrought() {
  const [selectedDate, setSelectedDate] = useState('2024-12-31')
  const [selectedArea, setSelectedArea] = useState('ud')
  const [activeLayer, setActiveLayer] = useState('ndmi')
  const [daysComposite, setDaysComposite] = useState(30)
  const mapRef = useRef()

  // Fetch GEE layer data based on active layer
  const { loading, error, layerData } = useGEELayer(activeLayer, {
    area: selectedArea,
    endDate: selectedDate,
    days: daysComposite
  })

  // Study areas with coordinates (memoized to prevent recreation)
  const studyAreas = useMemo(() => [
    { value: 'ud', label: 'ปากทับ อุตรดิตถ์', longitude: 100.4945, latitude: 17.6152, zoom: 12 },
    { value: 'mt', label: 'แม่ทาเหนือ เชียงใหม่', longitude: 99.2568, latitude: 18.7885, zoom: 12 },
    { value: 'ky', label: 'ขุนยวม แม่ฮ่องสอน', longitude: 98.5375, latitude: 18.8046, zoom: 12 },
    { value: 'vs', label: 'เวียงสา น่าน', longitude: 100.7994, latitude: 18.5397, zoom: 12 },
    { value: 'ms', label: 'แม่สะเรียง แม่ฮ่องสอน', longitude: 98.2615, latitude: 18.1750, zoom: 12 }
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
      <h3 className="font-bold mb-3 text-sm">ติดตาม NDVI, NDMI, NDWI</h3>
      <p className="text-xs text-base-content/70 mb-4">ดัชนี้จากข้อมูล Sentinel-2</p>

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

      {/* Days Composite */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">จำนวนวันสำหรับ Composite</span>
        </label>
        <input
          type="number"
          className="input input-bordered input-sm"
          value={daysComposite}
          onChange={(e) => setDaysComposite(Number(e.target.value))}
          min="1"
          max="365"
        />
      </div>

      <div className="divider my-2"></div>

      {/* Layer Selector */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">เลือกดัชนี</span>
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
            <input
              type="radio"
              name="layer"
              className="radio radio-xs radio-primary"
              checked={activeLayer === 'ndmi'}
              onChange={() => setActiveLayer('ndmi')}
            />
            <span className="text-xs">NDMI (ความชื้น)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
            <input
              type="radio"
              name="layer"
              className="radio radio-xs radio-primary"
              checked={activeLayer === 'ndvi'}
              onChange={() => setActiveLayer('ndvi')}
            />
            <span className="text-xs">NDVI (พืชพรรณ)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
            <input
              type="radio"
              name="layer"
              className="radio radio-xs radio-primary"
              checked={activeLayer === 'ndwi'}
              onChange={() => setActiveLayer('ndwi')}
            />
            <span className="text-xs">NDWI (น้ำ)</span>
          </label>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="alert alert-info py-2">
          <span className="loading loading-spinner loading-xs"></span>
          <span className="text-xs">กำลังโหลดข้อมูล...</span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="alert alert-error py-2">
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Statistics */}
      {layerData && layerData.stats && (
        <div className="mt-4">
          <div className="text-xs font-bold mb-2">สถิติ:</div>
          <div className="space-y-1 text-xs">
            {Object.entries(layerData.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="opacity-70">{key}:</span>
                <span className="font-mono">{typeof value === 'number' ? value.toFixed(3) : value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divider my-2"></div>

      <div className="text-xs text-base-content/60 space-y-1">
        <p><strong>NDVI:</strong> ดัชนีความแตกต่างของพืชพรรณ</p>
        <p><strong>NDMI:</strong> ดัชนีความแตกต่างของความชื้น</p>
        <p><strong>NDWI:</strong> ดัชนีความแตกต่างของน้ำ</p>
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

  // Get area name in Thai
  const getAreaName = () => {
    const area = studyAreas.find(a => a.value === selectedArea)
    return area ? area.label : 'พื้นที่ศึกษา'
  }

  // Get layer name in Thai
  const getLayerName = () => {
    const names = {
      'ndmi': 'NDMI (ความชื้น)',
      'ndvi': 'NDVI (พืชพรรณ)',
      'ndwi': 'NDWI (น้ำ)'
    }
    return names[activeLayer] || activeLayer.toUpperCase()
  }

  return (
    <MapLayout
      title={`${getAreaName()} - ${getLayerName()}`}
      area={`ข้อมูล: Sentinel-2`}
      coordinates="18.7128° N • 98.9950° E"
      sidePanel={sidePanel}
      bottomPanel={
        <BottomPanel
          cropInfo={cropInfoContent}
          chartData={chartContent}
          activities={activitiesContent}
        />
      }
    >
      <Map ref={mapRef}>
        {/* Render GEE Tile Layer */}
        {layerData && layerData.tile_url && (
          <GEETileLayer
            tileUrl={layerData.tile_url}
            opacity={0.7}
          />
        )}

        {/* Dynamic Layer Legend - updates based on active layer */}
        {layerData && layerData.vis_params && (
          <div className="absolute bottom-4 left-2 sm:left-4 z-10">
            <LayerLegend
              layerType={activeLayer}
              visParams={layerData.vis_params}
            />
          </div>
        )}
      </Map>
    </MapLayout>
  )
}
