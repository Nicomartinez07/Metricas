import { getDashboardMetrics, getTimeSeriesData, getRatingDistribution } from '@/lib/queries'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { BarChart } from '@/components/dashboard/BarChart'
import { LineChart } from '@/components/dashboard/LineChart'
import { GaugeChart } from '@/components/dashboard/GaugeChart'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { TrendingUp, MessageSquare, ShoppingCart, Wrench } from 'lucide-react'
import { DateRange, ServiceType } from '@/types/queries'

interface PageProps {
  searchParams: {
    range?: string
    service?: string
  }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // 👇 Desenrolla la Promise primero
  const params = await searchParams
  
  // Ahora puedes acceder a las propiedades
  const dateRange = (params.range || '1m') as DateRange
  const serviceType = (params.service || 'ALL') as ServiceType

  const [metrics, timeSeries, distribution] = await Promise.all([
    getDashboardMetrics(dateRange, serviceType),
    getTimeSeriesData(dateRange, serviceType),
    getRatingDistribution(dateRange, serviceType)
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Panel de Control</h2>
        <p className="text-gray-600 mt-1">Métricas de satisfacción del cliente</p>
      </div>

      {/* Filters */}
      <DashboardFilters />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Satisfacción General"
          value={metrics.averageRating}
          format="rating"
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Total Encuestas"
          value={metrics.totalSurveys}
          icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Ventas"
          value={metrics.ventaAverage}
          format="rating"
          icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
        />
        <MetricCard
          title="Postventa"
          value={metrics.postventaAverage}
          format="rating"
          icon={<Wrench className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChart data={timeSeries} />
        </div>
        <div>
          <GaugeChart 
            value={metrics.averageRating} 
            title="Satisfacción Promedio"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BarChart data={distribution} />
      </div>
    </div>
  )
}