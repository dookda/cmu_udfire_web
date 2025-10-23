import { useState } from 'react'

/**
 * Layer Legend Component
 * Displays color scale legend for GEE layers with collapse/expand functionality
 */
export default function LayerLegend({ layerType, visParams }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!visParams) return null

  const { min, max, palette } = visParams

  // Layer labels
  const labels = {
    'ndmi': 'ดัชนีความแตกต่างของความชื้น: NDMI',
    'ndvi': 'ดัชนีความแตกต่างของพืชพรรณ: NDVI',
    'ndwi': 'ดัชนีความแตกต่างของน้ำ: NDWI',
    'burn': 'ดัชนีพื้นที่เปิดโล่ง',
    'biomass': 'Biomass (kg/m²)',
    'biomass_3pgs': 'Biomass 3PGs (kg/m²)',
    'biomass_equation': 'Biomass (Parinwat & Sakda) (kg/m²)',
    'flood': 'พื้นที่น้ำท่วม (Flooded Area)'
  }

  const label = labels[layerType] || layerType.toUpperCase()

  // Icon for burn scar layer
  const burnIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500">
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
    </svg>
  )

  return (
    <div className="bg-base-100/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300">
      {/* Header with collapse button */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-base-200/50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="font-bold text-xs leading-tight flex items-center gap-1.5">
          {layerType === 'burn' && burnIcon}
          <span>{label}</span>
        </div>
        <button className="btn btn-ghost btn-xs btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Collapsible content */}
      <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-24'}`}>
        <div className="px-3 pb-3">
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
      </div>
    </div>
  )
}
