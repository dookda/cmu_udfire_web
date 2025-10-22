import { useState } from 'react'

export default function Timeline({ dates, selectedDate, onDateChange }) {
  const [currentIndex, setCurrentIndex] = useState(
    dates.findIndex(d => d.date === selectedDate) || dates.length - 1
  )

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      onDateChange(dates[newIndex])
    }
  }

  const handleNext = () => {
    if (currentIndex < dates.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      onDateChange(dates[newIndex])
    }
  }

  const handleDateClick = (index) => {
    setCurrentIndex(index)
    onDateChange(dates[index])
  }

  return (
    <div className="flex items-center gap-4">
      {/* Previous Button */}
      <button
        className="btn btn-circle btn-sm btn-ghost"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Timeline Dates */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto py-2">
        {dates.map((item, index) => {
          const isSelected = index === currentIndex
          const isPast = index < currentIndex
          const isFuture = index > currentIndex

          return (
            <button
              key={item.date}
              onClick={() => handleDateClick(index)}
              className="flex flex-col items-center min-w-[80px] group"
            >
              {/* Cloud Icon */}
              <div className={`mb-1 ${isSelected ? 'text-primary' : 'text-base-content/40'}`}>
                {item.cloudCover ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                )}
              </div>

              {/* Date Text */}
              <div className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-base-content/60'} group-hover:text-primary transition-colors`}>
                {new Date(item.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: '2-digit'
                })}
              </div>

              {/* Active Indicator */}
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Next Date Display */}
      <div className="text-sm text-base-content/60">
        Next image
        <div className="font-medium text-base-content">
          {currentIndex < dates.length - 1
            ? new Date(dates[currentIndex + 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A'
          }
        </div>
      </div>

      {/* Next Button */}
      <button
        className="btn btn-circle btn-sm btn-ghost"
        onClick={handleNext}
        disabled={currentIndex === dates.length - 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Expand Button */}
      <button className="btn btn-circle btn-sm btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </button>
    </div>
  )
}
