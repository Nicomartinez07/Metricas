import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number | string
  format?: 'number' | 'rating' | 'percentage'
  trend?: number
  icon?: React.ReactNode
}

export function MetricCard({ title, value, format = 'number', trend, icon }: MetricCardProps) {
  const formattedValue = format === 'rating' 
    ? typeof value === 'number' ? value.toFixed(1) : value
    : value

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4" />
    if (trend < 0) return <ArrowDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
            {format === 'rating' && <span className="text-lg text-gray-500">/10</span>}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              <span>{Math.abs(trend)}% vs período anterior</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}