export default function BottomPanel({ chartData }) {
  console.log('📊 BottomPanel rendered with chartData:', chartData)
  return (
    <div className="w-full">
      {/* Content Display Area */}
      <div className="py-2">
        {chartData}
      </div>
    </div>
  )
}
