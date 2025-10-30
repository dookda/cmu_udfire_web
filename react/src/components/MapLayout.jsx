import { useState, cloneElement } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function MapLayout({
  title,
  area,
  coordinates,
  children,
  sidePanel,
  bottomPanel
}) {
  const { theme, toggleTheme } = useTheme()
  const [showSidePanel, setShowSidePanel] = useState(true)
  const [showBottomPanel, setShowBottomPanel] = useState(true)
  const [basemap, setBasemap] = useState('satellite')

  return (
    <div className="h-full flex flex-col bg-base-200">
      {/* Top Toolbar */}
      <div className="bg-base-300 border-b border-base-content/10 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between z-20">
        {/* Left side buttons */}
        <div className="flex gap-2 items-center">
          {/* Side Panel Toggle Button */}
          <button
            className="btn btn-ghost btn-xs sm:btn-sm btn-circle flex-shrink-0"
            onClick={() => setShowSidePanel(!showSidePanel)}
            title={showSidePanel ? 'ซ่อนแผง' : 'แสดงแผง'}
          >
            {showSidePanel ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>

          {/* Chart Panel Toggle Button */}
          {bottomPanel && (
            <button
              className="btn btn-ghost btn-xs sm:btn-sm btn-circle flex-shrink-0"
              onClick={() => setShowBottomPanel(!showBottomPanel)}
              title={showBottomPanel ? 'ซ่อนกราฟ' : 'แสดงกราฟ'}
            >
              {showBottomPanel ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Basemap Switcher */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            className={`btn btn-xs btn-circle ${basemap === 'satellite' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBasemap('satellite')}
            title="Satellite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
              <path fillRule="evenodd" d="M4.606 12.97a.75.75 0 01-.134 1.051 2.494 2.494 0 00-.93 2.437 2.494 2.494 0 002.437-.93.75.75 0 111.186.918 3.995 3.995 0 01-4.482 1.332.75.75 0 01-.461-.461 3.994 3.994 0 011.332-4.482.75.75 0 011.052.134z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M5.752 12A13.07 13.07 0 008 14.248v4.002c0 .414.336.75.75.75a5 5 0 004.797-6.414 12.984 12.984 0 005.45-10.848.75.75 0 00-.735-.735 12.984 12.984 0 00-10.849 5.45A5 5 0 001 11.25c.001.414.337.75.751.75h4.002zM13 9a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className={`btn btn-xs btn-circle ${basemap === 'light' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBasemap('light')}
            title="Light"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
              <path fillRule="evenodd" d="M8.157 2.175a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.251v10.877a1.5 1.5 0 002.074 1.386l3.51-1.452 4.26 1.762a1.5 1.5 0 001.146 0l4.083-1.69A1.5 1.5 0 0018 14.748V3.873a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.763zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Side Panel with Toggle Button */}
        <div
          className={`flex flex-shrink-0 z-20 transition-all duration-300 ease-in-out ${
            showSidePanel ? 'w-full sm:w-64 md:w-72' : 'w-0'
          }`}
        >
          {/* Side Panel Content */}
          <div className="w-full sm:w-64 md:w-72 bg-base-100 border-r border-base-content/10 shadow-xl overflow-y-auto">
            <div className="sm:hidden flex justify-end p-2">
              <button
                className="btn btn-ghost btn-xs btn-square"
                onClick={() => setShowSidePanel(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidePanel}
          </div>
        </div>

        {/* Map Container - Grows to fill remaining space with Card */}
        <div className="flex-1 relative overflow-hidden p-2 sm:p-4">
          {/* Map Card */}
          <div className="card bg-base-100 shadow-xl h-full overflow-hidden">
            <div className="absolute inset-0">
              {cloneElement(children, { basemap })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel with Collapse Button */}
      {bottomPanel && (
        <div className={`relative bg-base-200 overflow-hidden transition-all duration-300 ${
          showBottomPanel ? 'h-[35vh]' : 'h-0'
        }`}>
          {/* Chart Card Container */}
          <div className="h-full p-2 sm:p-4 pt-0 sm:pt-2">
            <div className="card bg-base-100 shadow-xl h-full">
              <div className="card-body p-3 sm:p-4">
                {/* Collapse/Expand Button */}
                <button
                  className="absolute -top-10 sm:-top-12 right-6 sm:right-8 z-10 btn btn-xs btn-circle shadow-lg bg-base-100"
                  onClick={() => setShowBottomPanel(!showBottomPanel)}
                  title={showBottomPanel ? 'ซ่อนกราฟ' : 'แสดงกราฟ'}
                >
                  {showBottomPanel ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  )}
                </button>
                {bottomPanel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
