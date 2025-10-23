export default function BottomPanel({ chartData }) {
  return (
    <div className="h-full flex flex-col">
      {/* Content Display Area */}
      <div className="h-full px-4 py-4 overflow-hidden">
        {chartData}
      </div>
    </div>
  )
}
