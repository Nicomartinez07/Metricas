'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MetricsBreakdown } from '@/types/queries'

interface MetricsComparisonProps {
  venta: MetricsBreakdown
  postventa: MetricsBreakdown
}

export function MetricsComparison({ venta, postventa }: MetricsComparisonProps) {
  const data = [
    {
      metrica: 'Conformidad',
      Venta: venta.conformidad,
      Postventa: postventa.conformidad
    },
    {
      metrica: 'Atención',
      Venta: venta.atencionCliente,
      Postventa: postventa.atencionCliente
    },
    {
      metrica: 'Satisfacción',
      Venta: venta.satisfaccion,
      Postventa: postventa.satisfaccion
    },
    {
      metrica: 'Recomendación',
      Venta: venta.recomendacion,
      Postventa: postventa.recomendacion
    },
    {
      metrica: 'Experiencia',
      Venta: venta.experiencia,
      Postventa: postventa.experiencia
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comparación: Venta vs Postventa
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="metrica" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 10]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
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
          <Bar dataKey="Venta" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Postventa" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}