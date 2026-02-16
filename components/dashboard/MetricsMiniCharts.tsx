'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { MetricTimeSeries, MetricType } from '@/types/queries'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricsMiniChartsProps {
  data: Record<MetricType, MetricTimeSeries[]>
}

const METRICS_INFO = [
  { key: 'conformidad' as const, label: 'Conformidad', color: '#3b82f6' },
  { key: 'atencionCliente' as const, label: 'Atención', color: '#10b981' },
  { key: 'satisfaccion' as const, label: 'Satisfacción', color: '#8b5cf6' },
  { key: 'recomendacion' as const, label: 'Recomendación', color: '#f59e0b' },
  { key: 'experiencia' as const, label: 'Experiencia', color: '#ec4899' }
]

export function MetricsMiniCharts({ data }: MetricsMiniChartsProps) {
  const getTrend = (values: MetricTimeSeries[]) => {
    if (values.length < 2) return 0
    const first = values[0].value
    const last = values[values.length - 1].value
    return ((last - first) / first) * 100
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Evolución Temporal por Métrica
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {METRICS_INFO.map((metric) => {
          const metricData = data[metric.key]
          const trend = getTrend(metricData)
          const currentValue = metricData[metricData.length - 1]?.value || 0
          
          return (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentValue.toFixed(1)}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : trend < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span>{Math.abs(trend).toFixed(1)}%</span>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={metricData}>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number | undefined) => [value?.toFixed(1) ?? 'N/A', metric.label]}
                    labelFormatter={(label) => `Fecha: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}