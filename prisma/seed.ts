import { PrismaClient, ServiceType } from '@prisma/client'

const prisma = new PrismaClient()
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function main() {
  await prisma.$connect()

  const surveys = []
  const now = new Date()

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 365)
    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - daysAgo)

    const baseQuality = Math.random() * 3 + 6.5

    const conformidad = Math.min(10, Math.max(1, Math.round(baseQuality + (Math.random() - 0.5))))
    const atencionCliente = Math.min(10, Math.max(1, Math.round(baseQuality + (Math.random() - 0.5))))
    const satisfaccion = Math.min(10, Math.max(1, Math.round(baseQuality + (Math.random() - 0.5))))
    const recomendacion = Math.min(10, Math.max(1, Math.round(baseQuality + (Math.random() - 0.5) * 1.5)))
    const experiencia = Math.min(10, Math.max(1, Math.round(baseQuality + (Math.random() - 0.5))))

    const promedioGeneral =
      (conformidad + atencionCliente + satisfaccion + recomendacion + experiencia) / 5

    surveys.push({
      email: `cliente${i}@ejemplo.com`,
      serviceType: Math.random() > 0.5 ? ServiceType.VENTA : ServiceType.POSTVENTA,
      conformidad,
      atencionCliente,
      satisfaccion,
      recomendacion,
      experiencia,
      promedioGeneral,
      createdAt,
      source: 'seed',
    })
  }

  await prisma.survey.createMany({ data: surveys })
  console.log(`✅ ${surveys.length} encuestas creadas`)
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })