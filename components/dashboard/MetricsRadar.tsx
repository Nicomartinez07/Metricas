'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { MetricsBreakdown } from '@/types/queries'

interface MetricsRadarProps {
  data: MetricsBreakdown
  ventaData?: MetricsBreakdown
  postventaData?: MetricsBreakdown
}

export function MetricsRadar({ data, ventaData, postventaData }: MetricsRadarProps) {
  const chartData = [
    { metrica: 'Conformidad', General: data.conformidad, Venta: ventaData?.conformidad, Postventa: postventaData?.conformidad },
    { metrica: 'Atención', General: data.atencionCliente, Venta: ventaData?.atencionCliente, Postventa: postventaData?.atencionCliente },
    { metrica: 'Satisfacción', General: data.satisfaccion, Venta: ventaData?.satisfaccion, Postventa: postventaData?.satisfaccion },
    { metrica: 'Recomendación', General: data.recomendacion, Venta: ventaData?.recomendacion, Postventa: postventaData?.recomendacion },
    { metrica: 'Experiencia', General: data.experiencia, Venta: ventaData?.experiencia, Postventa: postventaData?.experiencia }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vista de Radar - Todas las Métricas
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="metrica" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <Radar
            name="General"
            dataKey="General"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {ventaData && (
            <Radar
              name="Venta"
              dataKey="Venta"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          )}
          {postventaData && (
            <Radar
              name="Postventa"
              dataKey="Postventa"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          )}
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}