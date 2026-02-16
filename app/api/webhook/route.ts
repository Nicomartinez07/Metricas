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
  console.log('🔔 Webhook recibido')
  
  try {
    // Verificar secreto
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header:', authHeader ? 'Presente' : 'Ausente')
    
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.log('❌ Autenticación fallida')
      console.log('Expected:', `Bearer ${WEBHOOK_SECRET}`)
      console.log('Received:', authHeader)
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📦 Body recibido:', JSON.stringify(body, null, 2))
    
    // Validar datos
    const validatedData = SurveySchema.parse(body)
    console.log('✅ Datos validados:', JSON.stringify(validatedData, null, 2))

    // Calcular promedio
    const promedioGeneral = (
      validatedData.conformidad +
      validatedData.atencionCliente +
      validatedData.satisfaccion +
      validatedData.recomendacion +
      validatedData.experiencia
    ) / 5

    console.log('📊 Promedio calculado:', promedioGeneral)
    console.log('💾 Intentando guardar en DB...')

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

    console.log('✅ Survey guardado con ID:', survey.id)

    return NextResponse.json({
      success: true,
      surveyId: survey.id,
      promedio: promedioGeneral
    })

  } catch (error) {
    console.error('❌ Error en webhook:', error)
    
    if (error instanceof z.ZodError) {
      console.error('Errores de validación:', error.issues)
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    // Log del error completo
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error')

    return NextResponse.json(
      { error: 'Error interno', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook activo - Dashboard Automotriz',
    endpoint: '/api/webhook',
    method: 'POST',
    webhookSecretConfigured: !!process.env.WEBHOOK_SECRET,
    databaseConnected: !!process.env.DATABASE_URL,
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