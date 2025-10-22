import { useState } from 'react'

export default function BottomPanel({ cropInfo, chartData, activities }) {
  const [activeTab, setActiveTab] = useState('chart')

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="tabs tabs-boxed bg-transparent gap-2 px-4 pt-3">
        <a
          className={`tab ${activeTab === 'cropInfo' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('cropInfo')}
        >
          Crop info
        </a>
        <a
          className={`tab ${activeTab === 'chart' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          Chart
        </a>
        <a
          className={`tab ${activeTab === 'activities' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </a>

        {/* Download button */}
        <button className="ml-auto btn btn-ghost btn-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>

        <button className="btn btn-ghost btn-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {activeTab === 'cropInfo' && cropInfo}
        {activeTab === 'chart' && chartData}
        {activeTab === 'activities' && activities}
      </div>
    </div>
  )
}
