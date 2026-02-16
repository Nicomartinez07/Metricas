export type DateRange = '14d' | '1m' | '6m' | '1y'
export type ServiceType = 'VENTA' | 'POSTVENTA' | 'ALL'

export interface DashboardMetrics {
  totalSurveys: number
  averageRating: number
  ventaAverage: number
  postventaAverage: number
}

export interface TimeSeriesData {
  date: string
  rating: number
  count: number
}

export interface RatingDistribution {
  rating: number
  count: number
}