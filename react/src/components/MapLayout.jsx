import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'

export default function MapLayout({
  title,
  area,
  coordinates,
  children,
  sidePanel,
  bottomPanel
}) {
  const { theme, toggleTheme } = useTheme()
  const [showSidePanel, setShowSidePanel] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-base-200">
      {/* Top Toolbar */}
      <div className="bg-base-300 border-b border-base-content/10 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto">
          <Link
            to="/"
            className="btn btn-ghost btn-xs sm:btn-sm btn-circle flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 bg-base-100 rounded border border-base-content/20 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-base-content/70">
              <path fillRule="evenodd" d="M8.157 2.175a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.251v10.877a1.5 1.5 0 002.074 1.386l3.51-1.452 4.26 1.762a1.5 1.5 0 001.146 0l4.083-1.69A1.5 1.5 0 0018 14.748V3.873a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.763zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{title}</span>
          </div>

          {area && (
            <span className="text-xs sm:text-sm text-base-content/60 whitespace-nowrap hidden sm:inline">{area}</span>
          )}

          <button className="btn btn-xs btn-ghost gap-1 sm:gap-1.5 text-warning hidden md:flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
            </svg>
            <span className="hidden lg:inline">Upgrade Plan</span>
          </button>

          <button className="btn btn-ghost btn-xs sm:btn-sm btn-circle hidden lg:flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </button>

          <button className="btn btn-ghost btn-xs sm:btn-sm btn-circle hidden lg:flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>

          <button className="btn btn-primary btn-xs sm:btn-sm gap-1 sm:gap-1.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
            </svg>
            <span className="hidden sm:inline">Get Overview</span>
          </button>

          <select className="select select-bordered select-xs sm:select-sm hidden md:flex">
            <option>All fields</option>
            <option>Field 1</option>
            <option>Field 2</option>
          </select>

          <label className="swap swap-rotate btn btn-ghost btn-xs sm:btn-sm btn-circle">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === 'dark'}
            />
            <svg className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
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

        {/* Map Container - Grows to fill remaining space */}
        <div className="flex-1 relative overflow-hidden">
          {/* Coordinates Display - Top Left */}
          {coordinates && (
            <div className="absolute left-2 sm:left-4 top-2 sm:top-4 z-10 bg-base-100/90 backdrop-blur-sm px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded text-[10px] sm:text-xs font-mono border border-base-content/20 shadow-lg">
              {coordinates}
            </div>
          )}

          {/* Toggle Button - Positioned over map */}
          {/* Hidden on small devices when panel is open, always visible on larger screens */}
          <button
            className={`absolute left-2 sm:left-4 top-12 sm:top-16 z-10 btn btn-xs sm:btn-sm btn-square ${
              showSidePanel ? 'hidden sm:flex' : 'flex'
            }`}
            onClick={() => setShowSidePanel(!showSidePanel)}
            title={showSidePanel ? 'ซ่อนแผง' : 'แสดงแผง'}
          >
            {showSidePanel ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>

          {/* Map */}
          <div className="absolute inset-0">
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      {bottomPanel && (
        <div className="h-48 sm:h-56 md:h-64 bg-base-100 border-t border-base-content/10 overflow-hidden">
          {bottomPanel}
        </div>
      )}
    </div>
  )
}
