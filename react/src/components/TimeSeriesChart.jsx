/**
 * TimeSeriesChart Component
 * Displays timeseries data for different indices (NDMI, NDVI, NDWI)
 * Updates based on selected layer type and study area
 */
export default function TimeSeriesChart({ data, layerType, areaLabel }) {
  const chartHeight = 180

  // Layer-specific configurations
  const layerConfig = {
    ndmi: {
      label: 'NDMI (ความชื้น)',
      color: '#3b82f6',
      range: { min: -1, max: 1 }
    },
    ndvi: {
      label: 'NDVI (พืชพรรณ)',
      color: '#22c55e',
      range: { min: -1, max: 1 }
    },
    ndwi: {
      label: 'NDWI (น้ำ)',
      color: '#06b6d4',
      range: { min: -1, max: 1 }
    }
  }

  const config = layerConfig[layerType] || layerConfig.ndmi
  const { min: minValue, max: maxValue } = config.range

  const getYPosition = (value) => {
    const normalized = (value - minValue) / (maxValue - minValue)
    return chartHeight - (normalized * chartHeight)
  }

  // Generate path for the line
  const generatePath = (dataset) => {
    if (!dataset || dataset.length === 0) return ''

    const width = 100 / (dataset.length - 1 || 1)
    let path = ''

    dataset.forEach((point, index) => {
      const x = index * width
      const y = getYPosition(point.value)

      if (index === 0) {
        path += `M ${x} ${y}`
      } else {
        path += ` L ${x} ${y}`
      }
    })

    return path
  }

  // Format date labels
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const month = date.toLocaleDateString('th-TH', { month: 'short' })
    const day = date.getDate()
    return `${day} ${month}`
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-4">
        <div className="bg-base-200 rounded-lg p-8 border border-base-content/10 text-center">
          <p className="text-base-content/50">ไม่มีข้อมูลสำหรับพื้นที่นี้</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }}></div>
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <span className="text-xs text-base-content/50">{areaLabel}</span>
      </div>

      {/* Chart */}
      <div className="relative bg-base-200 rounded-lg p-4 border border-base-content/10">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-4 bottom-8 w-12 flex flex-col justify-between text-xs text-base-content/50">
          <span>{maxValue.toFixed(1)}</span>
          <span>{((maxValue + minValue) * 0.75 / 2).toFixed(1)}</span>
          <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
          <span>{((maxValue + minValue) * 0.25 / 2).toFixed(1)}</span>
          <span>{minValue.toFixed(1)}</span>
        </div>

        {/* Chart Area */}
        <div className="ml-12 mr-4">
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            className="w-full"
            style={{ height: `${chartHeight}px` }}
          >
            {/* Grid lines */}
            {[1.0, 0.5, 0, -0.5, -1.0].map((value) => (
              <line
                key={value}
                x1="0"
                x2="100"
                y1={getYPosition(value)}
                y2={getYPosition(value)}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />
            ))}

            {/* Zero line - emphasized */}
            <line
              x1="0"
              x2="100"
              y1={getYPosition(0)}
              y2={getYPosition(0)}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Data line */}
            <path
              d={generatePath(data)}
              fill="none"
              stroke={config.color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1 || 1)) * 100
              const y = getYPosition(point.value)

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill={config.color}
                  />
                  {/* Hover area */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="transparent"
                  >
                    <title>{`${point.date}: ${point.value.toFixed(3)}`}</title>
                  </circle>
                </g>
              )
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-base-content/50">
            {data.map((point, index) => {
              // Show every 3rd label to avoid crowding
              if (index % 3 === 0 || index === data.length - 1) {
                return <span key={index}>{formatDate(point.date)}</span>
              }
              return <span key={index}></span>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
