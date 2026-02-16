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

  const [totalSurveys, avgGeneral, ventaAvg, postventaAvg] = await Promise.all([
    prisma.survey.count({ where: whereWithService }),
    prisma.survey.aggregate({
      where: whereWithService,
      _avg: { promedioGeneral: true }
    }),
    prisma.survey.aggregate({
      where: { ...whereBase, serviceType: PrismaServiceType.VENTA },
      _avg: { promedioGeneral: true }
    }),
    prisma.survey.aggregate({
      where: { ...whereBase, serviceType: PrismaServiceType.POSTVENTA },
      _avg: { promedioGeneral: true }
    })
  ])

  return {
    totalSurveys,
    averageRating: avgGeneral._avg.promedioGeneral || 0,
    ventaAverage: ventaAvg._avg.promedioGeneral || 0,
    postventaAverage: postventaAvg._avg.promedioGeneral || 0
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
      promedioGeneral: true
    }
  })

  // Agrupar por día/semana/mes según el rango
  const groupedData = new Map<string, { total: number; count: number }>()
  
  surveys.forEach(survey => {
    const dateKey = formatDateForRange(survey.createdAt, dateRange)
    const existing = groupedData.get(dateKey) || { total: 0, count: 0 }
    groupedData.set(dateKey, {
      total: existing.total + survey.promedioGeneral,
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
  
  const surveys = await prisma.survey.findMany({
    where: {
      createdAt: { gte: startDate },
      ...(serviceType && serviceType !== 'ALL' ? { serviceType: serviceType as PrismaServiceType } : {})
    },
    select: {
      promedioGeneral: true
    }
  })

  // Agrupar por rating redondeado
  const distribution = new Map<number, number>()
  
  surveys.forEach(survey => {
    const rounded = Math.round(survey.promedioGeneral)
    distribution.set(rounded, (distribution.get(rounded) || 0) + 1)
  })

  // Convertir a array y ordenar
  return Array.from(distribution.entries())
    .map(([rating, count]) => ({ rating, count }))
    .sort((a, b) => a.rating - b.rating)
}

// NUEVA: Obtener métricas detalladas por categoría
export async function getMetricsBreakdown(
  dateRange: DateRange,
  serviceType?: string
) {
  const startDate = getStartDate(dateRange)
  
  const whereCondition = {
    createdAt: { gte: startDate },
    ...(serviceType && serviceType !== 'ALL' ? { serviceType: serviceType as PrismaServiceType } : {})
  }

  const result = await prisma.survey.aggregate({
    where: whereCondition,
    _avg: {
      conformidad: true,
      atencionCliente: true,
      satisfaccion: true,
      recomendacion: true,
      experiencia: true
    }
  })

  return {
    conformidad: result._avg.conformidad || 0,
    atencionCliente: result._avg.atencionCliente || 0,
    satisfaccion: result._avg.satisfaccion || 0,
    recomendacion: result._avg.recomendacion || 0,
    experiencia: result._avg.experiencia || 0
  }
}

// NUEVA: Time series por métrica específica
export async function getMetricTimeSeries(
  metric: 'conformidad' | 'atencionCliente' | 'satisfaccion' | 'recomendacion' | 'experiencia',
  dateRange: DateRange,
  serviceType?: string
) {
  const startDate = getStartDate(dateRange)
  
  const surveys = await prisma.survey.findMany({
    where: {
      createdAt: { gte: startDate },
      ...(serviceType && serviceType !== 'ALL' ? { serviceType: serviceType as PrismaServiceType } : {})
    },
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      [metric]: true
    }
  })

  // Agrupar por fecha
  const groupedData = new Map<string, { total: number; count: number }>()
  
  surveys.forEach(survey => {
    const dateKey = formatDateForRange(survey.createdAt, dateRange)
    const value = survey[metric] as number
    const existing = groupedData.get(dateKey) || { total: 0, count: 0 }
    groupedData.set(dateKey, {
      total: existing.total + value,
      count: existing.count + 1
    })
  })

  return Array.from(groupedData.entries()).map(([date, data]) => ({
    date,
    value: data.total / data.count
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