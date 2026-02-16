'use client'

import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface BarChartProps {
  data: Array<{ rating: number; count: number }>
}

export function BarChart({ data }: BarChartProps) {
  const chartData = data.map(item => ({
    rating: `${item.rating}★`,
    cantidad: item.count
  }))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Calificaciones</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBar data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="rating" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Bar 
            dataKey="cantidad" 
            fill="#3b82f6" 
            radius={[8, 8, 0, 0]}
          />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}