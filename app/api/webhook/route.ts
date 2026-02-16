import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ServiceType } from '@prisma/client'
import { z } from 'zod'

// Schema de validación
const SurveySchema = z.object({
  email: z.string().email(),
  serviceType: z.enum(['VENTA', 'POSTVENTA']),
  rating: z.number().min(1).max(10),
  formId: z.string().optional(),
})

// Secret para autenticar requests
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'tu-secreto-aqui'

export async function POST(request: NextRequest) {
  try {
    // Verificar secreto en header
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar datos
    const validatedData = SurveySchema.parse(body)

    // Guardar en DB
    const survey = await prisma.survey.create({
      data: {
        email: validatedData.email,
        serviceType: validatedData.serviceType as ServiceType,
        rating: validatedData.rating,
        formId: validatedData.formId,
        source: 'google_forms'
      }
    })

    return NextResponse.json({
      success: true,
      surveyId: survey.id
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

// Endpoint GET para testear que funciona
export async function GET() {
  return NextResponse.json({
    message: 'Webhook activo',
    endpoint: '/api/webhook',
    method: 'POST',
    requiredHeaders: {
      'Authorization': 'Bearer YOUR_SECRET',
      'Content-Type': 'application/json'
    },
    bodyExample: {
      email: 'cliente@ejemplo.com',
      serviceType: 'VENTA',
      rating: 9,
      formId: 'form-123'
    }
  })
}