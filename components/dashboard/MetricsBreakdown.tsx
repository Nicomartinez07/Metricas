'use client'

import { MetricsBreakdown as MetricsData } from '@/types/queries'
import { TrendingUp, Users, Star, ThumbsUp, Sparkles } from 'lucide-react'

interface MetricsBreakdownProps {
  data: MetricsData
}

const METRICS_CONFIG = [
  {
    key: 'conformidad' as const,
    label: 'Conformidad con el Servicio',
    icon: Star,
    color: 'blue' as const
  },
  {
    key: 'atencionCliente' as const,
    label: 'Atención al Cliente',
    icon: Users,
    color: 'green' as const
  },
  {
    key: 'satisfaccion' as const,
    label: 'Satisfacción General',
    icon: ThumbsUp,
    color: 'purple' as const
  },
  {
    key: 'recomendacion' as const,
    label: 'Recomendación (NPS)',
    icon: TrendingUp,
    color: 'orange' as const
  },
  {
    key: 'experiencia' as const,
    label: 'Experiencia General',
    icon: Sparkles,
    color: 'pink' as const
  }
]

const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    bar: 'bg-blue-500'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    bar: 'bg-green-500'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    bar: 'bg-purple-500'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    bar: 'bg-orange-500'
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    bar: 'bg-pink-500'
  }
}

export function MetricsBreakdown({ data }: MetricsBreakdownProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Desglose por Métrica
      </h3>
      
      <div className="space-y-4">
        {METRICS_CONFIG.map((metric) => {
          const value = data[metric.key]
          const percentage = (value / 10) * 100
          const Icon = metric.icon
          const colors = COLOR_CLASSES[metric.color]
          
          return (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </span>
                </div>
                <span className={`text-lg font-bold ${colors.text}`}>
                  {value.toFixed(1)}
                </span>
              </div>
              
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${colors.bar} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}