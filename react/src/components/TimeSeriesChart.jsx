import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

/**
 * TimeSeriesChart Component with ECharts
 * Displays timeseries data for different indices (NDMI, NDVI, NDWI)
 * Updates based on selected layer type and study area
 */
export default function TimeSeriesChart({ data, layerType, areaLabel }) {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  // Layer-specific configurations
  const layerConfig = {
    ndmi: {
      label: 'NDMI (ความชื้น)',
      color: '#3b82f6'
    },
    ndvi: {
      label: 'NDVI (พืชพรรณ)',
      color: '#22c55e'
    },
    ndwi: {
      label: 'NDWI (น้ำ)',
      color: '#06b6d4'
    }
  }

  const config = layerConfig[layerType] || layerConfig.ndmi

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    // Initialize chart
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current)
    }

    const chart = chartInstanceRef.current

    // Prepare data
    const dates = data.map(item => item.date)
    const values = data.map(item => item.value)

    // Chart options
    const option = {
      textStyle: {
        fontFamily: 'Noto Sans Thai, sans-serif'
      },
      title: {
        text: config.label,
        subtext: areaLabel,
        left: 'left',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#999',
          fontFamily: 'Noto Sans Thai, sans-serif'
        }
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        formatter: (params) => {
          const param = params[0]
          return `${param.name}<br/>${param.seriesName}: ${param.value.toFixed(3)}`
        }
      },
      grid: {
        left: '60px',
        right: '20px',
        top: '60px',
        bottom: '40px'
      },
      xAxis: {
        type: 'category',
        data: dates,
        name: 'วันที่',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        axisLabel: {
          formatter: (value) => {
            const date = new Date(value)
            const month = date.toLocaleDateString('th-TH', { month: 'short' })
            const day = date.getDate()
            return `${day} ${month}`
          },
          rotate: 45,
          fontSize: 10,
          fontFamily: 'Noto Sans Thai, sans-serif'
        }
      },
      yAxis: {
        type: 'value',
        min: -1,
        max: 1,
        axisLabel: {
          formatter: '{value}',
          fontFamily: 'Noto Sans Thai, sans-serif'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#ddd'
          }
        }
      },
      series: [
        {
          name: config.label,
          type: 'line',
          data: values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: config.color
          },
          lineStyle: {
            width: 2,
            color: config.color
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: config.color + '40'
              },
              {
                offset: 1,
                color: config.color + '00'
              }
            ])
          },
          markLine: {
            silent: true,
            lineStyle: {
              color: '#999',
              type: 'dashed'
            },
            data: [{ yAxis: 0, label: { formatter: '0', fontFamily: 'Noto Sans Thai, sans-serif' } }]
          }
        }
      ]
    }

    chart.setOption(option)

    // Resize handler
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, layerType, areaLabel, config])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
    }
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="py-4">
        <div className="bg-base-200 rounded-lg p-8 border border-base-content/10 text-center">
          <p className="text-base-content/50">ไม่มีข้อมูลสำหรับพื้นที่นี้</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
    </div>
  )
}
