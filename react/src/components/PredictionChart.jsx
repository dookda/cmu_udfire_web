import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

/**
 * Prediction Chart Component
 * Displays monthly hotspot predictions as a line chart using ECharts
 */
export default function PredictionChart({ predictions }) {
  console.log('📊 PredictionChart rendered with predictions:', predictions)

  // Month abbreviations in Thai
  const monthAbbr = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

  const chartOption = useMemo(() => {
    console.log('📊 ChartOption useMemo called with predictions:', predictions)
    if (!predictions || predictions.length === 0) {
      console.log('📊 No predictions, returning empty option')
      return {}
    }

    const values = predictions.map(p => Math.round(p.predicted_hotspot_count))
    console.log('📈 Chart updated - Values:', values)
    const months = predictions.map(p => {
      const monthIndex = new Date(p.date).getMonth()
      return monthAbbr[monthIndex]
    })

    return {
      textStyle: {
        fontFamily: 'Noto Sans Thai, sans-serif'
      },
      title: {
        text: 'การคาดการณ์จุดความร้อน 2026',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Noto Sans Thai, sans-serif'
        }
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        formatter: (params) => {
          const data = params[0]
          return `${data.name}<br/>${data.value} จุด`
        }
      },
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: 11,
          fontFamily: 'Noto Sans Thai, sans-serif'
        }
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนจุด',
        nameTextStyle: {
          fontSize: 11,
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        axisLabel: {
          fontSize: 10,
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        splitLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        }
      },
      series: [
        {
          name: 'จุดความร้อน',
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: {
            color: '#ff6b6b',
            width: 2
          },
          itemStyle: {
            color: '#ff6b6b'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(255, 107, 107, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 107, 107, 0.05)'
                }
              ]
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: 'สูงสุด' },
              { type: 'min', name: 'ต่ำสุด' }
            ],
            label: {
              fontSize: 10,
              fontFamily: 'Noto Sans Thai, sans-serif'
            }
          }
        }
      ]
    }
  }, [predictions])

  if (!predictions || predictions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>คลิกที่พื้นที่บนแผนที่เพื่อดูการคาดการณ์</p>
      </div>
    )
  }

  // Calculate statistics
  const totalPredicted = predictions.reduce((sum, p) => sum + p.predicted_hotspot_count, 0)
  const avgMonthly = Math.round(totalPredicted / predictions.length)
  const maxMonth = predictions.reduce((max, p) =>
    p.predicted_hotspot_count > max.predicted_hotspot_count ? p : max
  )
  const minMonth = predictions.reduce((min, p) =>
    p.predicted_hotspot_count < min.predicted_hotspot_count ? p : min
  )

  return (
    <div className="h-full flex flex-col gap-3">
      {/* ECharts Chart */}
      <div className="flex-1 min-h-0">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs flex-shrink-0">
        <div className="bg-base-200 p-3 rounded">
          <div className="text-gray-500 mb-1">รวมทั้งปี</div>
          <div className="text-xl sm:text-2xl font-bold text-error">{Math.round(totalPredicted)} จุด</div>
        </div>
        <div className="bg-base-200 p-3 rounded">
          <div className="text-gray-500 mb-1">เฉลี่ยต่อเดือน</div>
          <div className="text-xl sm:text-2xl font-bold">{avgMonthly} จุด</div>
        </div>
        <div className="bg-base-200 p-3 rounded">
          <div className="text-gray-500 mb-1">เดือนสูงสุด</div>
          <div className="text-base sm:text-lg font-bold text-warning">
            {monthAbbr[new Date(maxMonth.date).getMonth()]} ({Math.round(maxMonth.predicted_hotspot_count)} จุด)
          </div>
        </div>
        <div className="bg-base-200 p-3 rounded">
          <div className="text-gray-500 mb-1">เดือนต่ำสุด</div>
          <div className="text-base sm:text-lg font-bold text-success">
            {monthAbbr[new Date(minMonth.date).getMonth()]} ({Math.round(minMonth.predicted_hotspot_count)} จุด)
          </div>
        </div>
      </div>
    </div>
  )
}
