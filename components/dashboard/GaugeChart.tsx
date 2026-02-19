'use client'

interface GaugeChartProps {
  value: number
  max?: number
  title: string
}

export function GaugeChart({ value, max = 10, title }: GaugeChartProps) {
  const percentage = (value / max) * 100
  const rotation = (percentage / 100) * 180 - 90

  const getColor = (val: number) => {
    if (val >= 8) return '#10b981' // green
    if (val >= 6) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const color = getColor(value)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      <div className="relative w-full max-w-[280px] mx-auto">
        {/* Gauge background */}
        <svg viewBox="0 0 200 120" className="w-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.51} 251`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 1s ease'
            }}
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="6" fill="#374151" />
        </svg>

        {/* Value display */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color }}>
              {value.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">de {max}</div>
          </div>
        </div>
      </div>
    </div>
  )
}