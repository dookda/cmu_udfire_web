export default function NDVIChart({ data }) {
  const maxValue = 1.0
  const minValue = 0.0
  const chartHeight = 180

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

  const years = ['2025', '2024', '2023', '2022', '2021']
  const colors = {
    '2025': '#4ade80',
    '2024': '#60a5fa',
    '2023': '#fbbf24',
    '2022': '#f87171',
    '2021': '#a78bfa'
  }

  return (
    <div className="py-4">
      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 flex-wrap">
        {Object.entries(data).map(([year, dataset]) => (
          <div key={year} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[year] }}></div>
              <span className="text-sm font-medium">NDVI ({year})</span>
            </div>
            {dataset.locked && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-warning">
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative bg-base-200 rounded-lg p-4 border border-base-content/10">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-4 bottom-8 w-12 flex flex-col justify-between text-xs text-base-content/50">
          <span>1</span>
          <span>0.8</span>
          <span>0.6</span>
          <span>0.4</span>
          <span>0.2</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="ml-12 mr-4">
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            className="w-full"
            style={{ height: `${chartHeight}px` }}
          >
            {/* Grid lines */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((value) => (
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

            {/* Data lines */}
            {Object.entries(data).map(([year, dataset]) => (
              <g key={year}>
                <path
                  d={generatePath(dataset.values)}
                  fill="none"
                  stroke={colors[year]}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Data points */}
                {dataset.values.map((point, index) => {
                  const x = (index / (dataset.values.length - 1 || 1)) * 100
                  const y = getYPosition(point.value)

                  return (
                    <circle
                      key={`${year}-${index}`}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={colors[year]}
                    />
                  )
                })}
              </g>
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-base-content/50">
            <span>Jul 22</span>
            <span>Jul 27</span>
            <span>Aug 1</span>
            <span>Aug 6</span>
            <span>Aug 11</span>
            <span>Aug 16</span>
            <span>Aug 21</span>
            <span>Aug 26</span>
            <span>Aug 31</span>
            <span>Sep 5</span>
            <span>Sep 10</span>
            <span>Sep 15</span>
            <span>Sep 20</span>
            <span>Sep 25</span>
            <span>Sep 30</span>
            <span>Oct 5</span>
            <span>Oct 10</span>
            <span>Oct 15</span>
            <span>Oct 20</span>
          </div>
        </div>
      </div>
    </div>
  )
}
