'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { DateRange, ServiceType } from '@/types/queries'

export function DashboardFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentRange = (searchParams.get('range') || '1m') as DateRange
  const currentService = (searchParams.get('service') || 'ALL') as ServiceType

  const updateFilters = (range?: string, service?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (range) params.set('range', range)
    if (service) params.set('service', service)
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const dateRanges: { value: DateRange; label: string }[] = [
    { value: '14d', label: 'Últimos 14 días' },
    { value: '1m', label: 'Último mes' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' }
  ]

  const serviceTypes: { value: ServiceType; label: string }[] = [
    { value: 'ALL', label: 'Todos los servicios' },
    { value: 'VENTA', label: 'Solo Ventas' },
    { value: 'POSTVENTA', label: 'Solo Postventa' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período de tiempo
          </label>
          <select
            value={currentRange}
            onChange={(e) => updateFilters(e.target.value, undefined)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent transition"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de servicio
          </label>
          <select
            value={currentService}
            onChange={(e) => updateFilters(undefined, e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent transition"
          >
            {serviceTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}