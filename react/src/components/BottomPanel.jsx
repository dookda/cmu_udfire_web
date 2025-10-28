export default function BottomPanel({ chartData }) {
  console.log('📊 BottomPanel rendered with chartData:', chartData)
  return (
    <div className="h-full flex flex-col">
      {/* Content Display Area */}
      <div className="h-full px-4 py-4 overflow-hidden">
        {chartData}
      </div>
    </div>
  )
}
