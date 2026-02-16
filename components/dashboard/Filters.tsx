'use client'

import { DateRange, ServiceType } from '@/types/queries'

interface FiltersProps {
  dateRange: DateRange
  serviceType: ServiceType
  onDateRangeChange: (range: DateRange) => void
  onServiceTypeChange: (type: ServiceType) => void
}

export function Filters({ dateRange, serviceType, onDateRangeChange, onServiceTypeChange }: FiltersProps) {
  const dateRanges: { value: DateRange; label: string }[] = [
    { value: '14d', label: 'Últimos 14 días' },
    { value: '1m', label: 'Último mes' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' }
  ]

  const serviceTypes: { value: ServiceType; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'VENTA', label: 'Venta' },
    { value: 'POSTVENTA', label: 'Postventa' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Servicio
          </label>
          <select
            value={serviceType}
            onChange={(e) => onServiceTypeChange(e.target.value as ServiceType)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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