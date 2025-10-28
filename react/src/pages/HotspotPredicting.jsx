import { useState, useRef, useEffect } from 'react'
import { Popup } from 'react-map-gl/maplibre'
import MapLayout from '../components/MapLayout'
import Map from '../components/Map'
import BottomPanel from '../components/BottomPanel'
import HexagonLayer from '../components/HexagonLayer'
import FIRMSHotspotLayer from '../components/FIRMSHotspotLayer'
import PredictionChart from '../components/PredictionChart'
import ErrorBoundary from '../components/ErrorBoundary'

export default function HotspotPredicting() {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('2026-01-01')
  const [showHexagonLayer, setShowHexagonLayer] = useState(true)
  const [showHotspotLayer, setShowHotspotLayer] = useState(true)
  const [selectedHexagon, setSelectedHexagon] = useState(null)
  const [popupInfo, setPopupInfo] = useState(null)
  const [isHexagonLoading, setIsHexagonLoading] = useState(false)

  // Update map pitch when month selection changes
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current
    if (!map || typeof map.easeTo !== 'function') return

    if (selectedMonth) {
      // Show 3D view with pitch
      map.easeTo({ pitch: 45, duration: 1000 })
    } else {
      // Reset to 2D view
      map.easeTo({ pitch: 0, duration: 1000 })
    }
  }, [selectedMonth])

  const handleHexagonClick = (feature, lngLat) => {
    console.log('🟢 handleHexagonClick called in HotspotPredicting')
    console.log('🟢 Feature received:', feature)
    console.log('🟢 lngLat:', lngLat)

    const props = feature.properties

    // Parse predictions if it's a string
    let predictions
    try {
      predictions = typeof props.predictions === 'string'
        ? JSON.parse(props.predictions)
        : props.predictions
      console.log('🟢 Parsed predictions:', predictions)
    } catch (error) {
      console.error('❌ Error parsing predictions:', error)
      return
    }

    if (!Array.isArray(predictions) || predictions.length === 0) {
      console.warn('❌ Invalid predictions data:', predictions)
      return
    }

    // Get unique ID for the hexagon
    const hexagonId = props.id || props.OBJECTID || props.FID || props.gid || Date.now()

    console.log('✅ Hexagon selected - ID:', hexagonId, '- Predictions:', predictions.length, 'months')

    // Set selected hexagon with unique key for React re-rendering
    const hexagonData = {
      id: hexagonId,
      timestamp: Date.now(),
      predictions
    }
    console.log('🟢 Setting selectedHexagon to:', hexagonData)
    setSelectedHexagon(hexagonData)

    // Set popup info
    setPopupInfo({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
      properties: props
    })
  }

  const handleHexagonLoadingChange = (loading) => {
    setIsHexagonLoading(loading)
  }

  const sidePanel = (
    <div className="p-4">
      <h3 className="font-bold mb-3 text-sm">การคาดการณ์จุดความร้อน</h3>

      {/* Month Selector */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-xs font-bold">เลือกเดือน</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">-- ดูทั้งหมด --</option>
          <option value="2026-01-01">มกราคม 2026</option>
          <option value="2026-02-01">กุมภาพันธ์ 2026</option>
          <option value="2026-03-01">มีนาคม 2026</option>
          <option value="2026-04-01">เมษายน 2026</option>
          <option value="2026-05-01">พฤษภาคม 2026</option>
          <option value="2026-06-01">มิถุนายน 2026</option>
          <option value="2026-07-01">กรกฎาคม 2026</option>
          <option value="2026-08-01">สิงหาคม 2026</option>
          <option value="2026-09-01">กันยายน 2026</option>
          <option value="2026-10-01">ตุลาคม 2026</option>
          <option value="2026-11-01">พฤศจิกายน 2026</option>
          <option value="2026-12-01">ธันวาคม 2026</option>
        </select>
      </div>

      <div className="divider text-xs">ชั้นข้อมูล</div>

      {/* Layer Toggles */}
      <div className="form-control mb-3">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={showHexagonLayer}
            onChange={(e) => setShowHexagonLayer(e.target.checked)}
          />
          <span className="label-text text-xs font-bold">พื้นที่ป่าไม้ (Hexagons)</span>
        </label>
      </div>

      <div className="form-control mb-4">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-error toggle-sm"
            checked={showHotspotLayer}
            onChange={(e) => setShowHotspotLayer(e.target.checked)}
          />
          <span className="label-text text-xs font-bold">จุดความร้อน FIRMS (24 ชม.)</span>
        </label>
      </div>

      {/* Legend */}
      <div className="divider text-xs">สัญลักษณ์</div>

      <div className="text-xs space-y-2">
        <h4 className="font-bold">จำนวนจุดความร้อนที่คาดการณ์</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d7f4d7' }}></div>
            <span>0-10 จุด (ต่ำมาก)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#b8e6b8' }}></div>
            <span>10-25 จุด (ต่ำ)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffe066' }}></div>
            <span>25-50 จุด (ปานกลาง)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffb366' }}></div>
            <span>50-75 จุด (ค่อนข้างสูง)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff8566' }}></div>
            <span>75-100 จุด (สูง)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff5566' }}></div>
            <span>100-150 จุด (สูงมาก)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#cc0000' }}></div>
            <span>150+ จุด (อันตราย)</span>
          </div>
        </div>
      </div>
    </div>
  )

  console.log('🎯 HotspotPredicting render')
  console.log('  - selectedHexagon:', selectedHexagon)
  console.log('  - selectedHexagon?.predictions:', selectedHexagon?.predictions)

  const chartContent = selectedHexagon ? (
    <PredictionChart
      key={`${selectedHexagon.id}-${selectedHexagon.timestamp}`}
      predictions={selectedHexagon.predictions}
    />
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">
      <p>คลิกที่พื้นที่บนแผนที่เพื่อดูการคาดการณ์</p>
    </div>
  )

  console.log('🎯 chartContent type:', typeof chartContent)
  console.log('🎯 chartContent:', chartContent)

  return (
    <ErrorBoundary>
      <MapLayout
        sidePanel={sidePanel}
        bottomPanel={
          <BottomPanel chartData={chartContent} />
        }
      >
        <Map
          key="hotspot-map"
          ref={mapRef}
          initialViewState={{ longitude: 100.0, latitude: 18.5, zoom: 7 }}
          onMapLoad={() => setMapLoaded(true)}
        >
          <FIRMSHotspotLayer
            map={mapRef.current}
            visible={showHotspotLayer}
          />
          <HexagonLayer
            map={mapRef.current}
            visible={showHexagonLayer}
            selectedMonth={selectedMonth}
            onHexagonClick={handleHexagonClick}
            onLoadingChange={handleHexagonLoadingChange}
          />
          {isHexagonLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-white mt-2">Loading hexagon data...</p>
              </div>
            </div>
          )}
          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              onClose={() => setPopupInfo(null)}
              closeOnClick={false}
              anchor="bottom"
              offset={15}
            >
              <div className="p-1 text-xs">
                <div className="font-bold">{popupInfo.properties.PROV_NAM_T}</div>
                <div>{popupInfo.properties.PROV_NAM_E}</div>
                <div>พิกัด: {popupInfo.latitude.toFixed(4)}, {popupInfo.longitude.toFixed(4)}</div>
              </div>
            </Popup>
          )}
        </Map>
      </MapLayout>
    </ErrorBoundary>
  )
}