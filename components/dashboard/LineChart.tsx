'use client'

import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TimeSeriesData } from '@/types/queries'

interface LineChartProps {
  data: TimeSeriesData[]
}

export function LineChart({ data }: LineChartProps) {
  const chartData = data.map(item => ({
    fecha: new Date(item.date).toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: 'short' 
    }),
    calificación: parseFloat(item.rating.toFixed(1)),
    respuestas: item.count
  }))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Temporal (5 metricas en conjunto)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLine data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="fecha" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 10]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            label={{ value: 'Calificación', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="calificación" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}