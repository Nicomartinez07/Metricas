import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ServiceType } from '@prisma/client'
import { z } from 'zod'

const SurveySchema = z.object({
  email: z.string().email(),
  serviceType: z.enum(['VENTA', 'POSTVENTA']),
  conformidad: z.number().min(1).max(10),
  atencionCliente: z.number().min(1).max(10),
  satisfaccion: z.number().min(1).max(10),
  recomendacion: z.number().min(1).max(10),
  experiencia: z.number().min(1).max(10),
  formId: z.string().optional(),
})

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'tu-secreto-aqui'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = SurveySchema.parse(body)

    // Calcular promedio
    const promedioGeneral = (
      validatedData.conformidad +
      validatedData.atencionCliente +
      validatedData.satisfaccion +
      validatedData.recomendacion +
      validatedData.experiencia
    ) / 5

    const survey = await prisma.survey.create({
      data: {
        email: validatedData.email,
        serviceType: validatedData.serviceType as ServiceType,
        conformidad: validatedData.conformidad,
        atencionCliente: validatedData.atencionCliente,
        satisfaccion: validatedData.satisfaccion,
        recomendacion: validatedData.recomendacion,
        experiencia: validatedData.experiencia,
        promedioGeneral,
        formId: validatedData.formId,
        source: 'google_forms'
      }
    })

    return NextResponse.json({
      success: true,
      surveyId: survey.id,
      promedio: promedioGeneral
    })

  } catch (error) {
    console.error('Error en webhook:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook activo - Dashboard Automotriz',
    endpoint: '/api/webhook',
    method: 'POST',
    requiredHeaders: {
      'Authorization': 'Bearer YOUR_SECRET',
      'Content-Type': 'application/json'
    },
    bodyExample: {
      email: 'cliente@ejemplo.com',
      serviceType: 'VENTA',
      conformidad: 9,
      atencionCliente: 8,
      satisfaccion: 9,
      recomendacion: 10,
      experiencia: 9,
      formId: 'form-123'
    }
  })
}