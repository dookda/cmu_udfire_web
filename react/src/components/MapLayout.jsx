import { useState, cloneElement, useRef, useImperativeHandle, forwardRef } from 'react'

const MapLayout = forwardRef(({
  title,
  area,
  coordinates,
  children,
  sidePanel,
  bottomPanel
}, ref) => {
  const sidePanelModalRef = useRef(null)
  const [basemap, setBasemap] = useState('satellite')

  const openSidePanelModal = () => {
    if (sidePanelModalRef.current) {
      sidePanelModalRef.current.showModal()
    }
  }

  const closeSidePanelModal = () => {
    if (sidePanelModalRef.current) {
      sidePanelModalRef.current.close()
    }
  }

  // Expose close function to parent components
  useImperativeHandle(ref, () => ({
    closeModal: closeSidePanelModal
  }))

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Container to match navbar width */}
      <div className="w-[95%] max-w-5xl mx-auto flex-1 flex flex-col">
        {/* Page Header */}
        {title && (
          <div className="px-2 sm:px-4 pt-4 pb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-base-content">
              {title}
            </h1>
            {(area || coordinates) && (
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-base-content/70">
                {area && <span>{area}</span>}
                {coordinates && <span>{coordinates}</span>}
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Map Container - Grows to fill remaining space with Card */}
          <div className="flex-1 relative p-2 sm:p-4 pb-2 sm:pb-3">
            {/* Map Card */}
            <div className="card bg-base-100 shadow-lg h-[55vh] sm:h-[60vh] lg:h-[65vh] overflow-hidden">
              <div className="absolute inset-0">
                {cloneElement(children, { basemap })}
              </div>

              {/* Floating Action Bar - Bottom Right */}
              <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
                {/* Settings Button */}
                <div className="bg-base-100/80 backdrop-blur-md shadow-xl rounded-2xl p-2 border border-base-content/10">
                  <button
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={openSidePanelModal}
                    title="เปิดตั้งค่า"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </button>
                </div>

                {/* Basemap Switcher Group */}
                <div className="bg-base-100/80 backdrop-blur-md shadow-xl rounded-2xl p-2 border border-base-content/10">
                  <div className="flex flex-col gap-2">
                    <button
                      className={`btn btn-sm btn-circle ${basemap === 'satellite' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setBasemap('satellite')}
                      title="Satellite"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.606 12.97a.75.75 0 01-.134 1.051 2.494 2.494 0 00-.93 2.437 2.494 2.494 0 002.437-.93.75.75 0 111.186.918 3.995 3.995 0 01-4.482 1.332.75.75 0 01-.461-.461 3.994 3.994 0 011.332-4.482.75.75 0 011.052.134z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M5.752 12A13.07 13.07 0 008 14.248v4.002c0 .414.336.75.75.75a5 5 0 004.797-6.414 12.984 12.984 0 005.45-10.848.75.75 0 00-.735-.735 12.984 12.984 0 00-10.849 5.45A5 5 0 001 11.25c.001.414.337.75.751.75h4.002zM13 9a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      className={`btn btn-sm btn-circle ${basemap === 'light' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setBasemap('light')}
                      title="Light"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8.157 2.175a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.251v10.877a1.5 1.5 0 002.074 1.386l3.51-1.452 4.26 1.762a1.5 1.5 0 001.146 0l4.083-1.69A1.5 1.5 0 0018 14.748V3.873a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.763zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel with Chart Card - Always Visible */}
        {bottomPanel && (
          <div className="relative">
            {/* Chart Card Container */}
            <div className="px-2 sm:px-4 pt-1 sm:pt-2 pb-2 sm:pb-4">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body p-4 sm:p-6">
                  {bottomPanel}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel Modal */}
      <dialog ref={sidePanelModalRef} className="modal">
        <div className="modal-box max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <h3 className="font-bold text-lg mb-4">ตั้งค่าและเครื่องมือ</h3>

          <div className="max-h-[60vh] overflow-y-auto">
            {sidePanel}
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary btn-sm">ปิด</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
})

MapLayout.displayName = 'MapLayout'

export default MapLayout
