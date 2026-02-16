import { prisma } from './prisma'
import { ServiceType as PrismaServiceType } from '@prisma/client'
import { DateRange, DashboardMetrics, TimeSeriesData } from '@/types/queries'

export async function getDashboardMetrics(
  dateRange: DateRange,
  serviceType?: string
): Promise<DashboardMetrics> {
  const startDate = getStartDate(dateRange)
  
  const whereBase = {
    createdAt: { gte: startDate }
  }

  const whereWithService = {
    ...whereBase,
    ...(serviceType && serviceType !== 'ALL' ? { serviceType: serviceType as PrismaServiceType } : {})
  }

  const [totalSurveys, avgRating, ventaAvg, postventaAvg] = await Promise.all([
    prisma.survey.count({ where: whereWithService }),
    prisma.survey.aggregate({
      where: whereWithService,
      _avg: { rating: true }
    }),
    prisma.survey.aggregate({
      where: { ...whereBase, serviceType: PrismaServiceType.VENTA },
      _avg: { rating: true }
    }),
    prisma.survey.aggregate({
      where: { ...whereBase, serviceType: PrismaServiceType.POSTVENTA },
      _avg: { rating: true }
    })
  ])

  return {
    totalSurveys,
    averageRating: avgRating._avg.rating || 0,
    ventaAverage: ventaAvg._avg.rating || 0,
    postventaAverage: postventaAvg._avg.rating || 0
  }
}

export async function getTimeSeriesData(
  dateRange: DateRange,
  serviceType?: string
): Promise<TimeSeriesData[]> {
  const startDate = getStartDate(dateRange)
  
  const surveys = await prisma.survey.findMany({
    where: {
      createdAt: { gte: startDate },
      ...(serviceType && serviceType !== 'ALL' ? { serviceType: serviceType as PrismaServiceType } : {})
    },
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      rating: true
    }
  })

  // Agrupar por día/semana/mes según el rango
  const groupedData = new Map<string, { total: number; count: number }>()
  
  surveys.forEach(survey => {
    const dateKey = formatDateForRange(survey.createdAt, dateRange)
    const existing = groupedData.get(dateKey) || { total: 0, count: 0 }
    groupedData.set(dateKey, {
      total: existing.total + survey.rating,
      count: existing.count + 1
    })
  })

  return Array.from(groupedData.entries()).map(([date, data]) => ({
    date,
    rating: data.total / data.count,
    count: data.count
  }))
}

export async function getRatingDistribution(
  dateRange: DateRange,
  serviceType?: string
) {
  const startDate = getStartDate(dateRange)
  
  const surveys = await prisma.survey.groupBy({
    by: ['rating'],
    where: {
      createdAt: { gte: startDate },
      ...(serviceType && serviceType !== 'ALL' ? { serviceType: serviceType as PrismaServiceType } : {})
    },
    _count: { rating: true },
    orderBy: { rating: 'asc' }
  })

  return surveys.map(s => ({
    rating: s.rating,
    count: s._count.rating
  }))
}

function getStartDate(range: DateRange): Date {
  const now = new Date()
  switch (range) {
    case '14d':
      return new Date(now.setDate(now.getDate() - 14))
    case '1m':
      return new Date(now.setMonth(now.getMonth() - 1))
    case '6m':
      return new Date(now.setMonth(now.getMonth() - 6))
    case '1y':
      return new Date(now.setFullYear(now.getFullYear() - 1))
  }
}

function formatDateForRange(date: Date, range: DateRange): string {
  if (range === '14d') {
    // Por día
    return date.toISOString().split('T')[0]
  } else if (range === '1m') {
    // Por día
    return date.toISOString().split('T')[0]
  } else {
    // Por mes para 6m y 1y
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }
}