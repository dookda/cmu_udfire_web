/**
 * Layer Legend Component
 * Displays color scale legend for GEE layers
 */
export default function LayerLegend({ layerType, visParams }) {
  if (!visParams) return null

  const { min, max, palette } = visParams

  // Layer labels
  const labels = {
    'ndmi': 'ดัชนีความแตกต่างของความชื้น: NDMI',
    'ndvi': 'ดัชนีความแตกต่างของพืชพรรณ: NDVI',
    'ndwi': 'ดัชนีความแตกต่างของน้ำ: NDWI',
    'burn': 'ดัชนีพื้นที่เปิดโล่ง',
    'biomass': 'Biomass (kg/m²)'
  }

  const label = labels[layerType] || layerType.toUpperCase()

  return (
    <div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-lg p-3 min-w-[180px]">
      <div className="font-bold text-xs mb-2">{label}</div>

      {/* Color gradient */}
      <div
        className="h-3 rounded mb-2"
        style={{
          background: `linear-gradient(to right, ${palette.map((c) => `#${c}`).join(', ')})`
        }}
      ></div>

      {/* Min, Mid, Max labels */}
      <div className="flex justify-between text-[10px] font-mono">
        <span>{min.toFixed(2)}</span>
        <span>{((max + min) / 2).toFixed(2)}</span>
        <span>{max.toFixed(2)}</span>
      </div>
    </div>
  )
}
