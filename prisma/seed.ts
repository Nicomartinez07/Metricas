import { PrismaClient, ServiceType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar datos existentes
  await prisma.survey.deleteMany()

  // Generar datos de los últimos 12 meses
  const surveys = []
  const now = new Date()

  for (let i = 0; i < 120; i++) { // 120 encuestas (~10/mes)
    const daysAgo = Math.floor(Math.random() * 365)
    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - daysAgo)

    surveys.push({
      email: `cliente${i}@ejemplo.com`,
      serviceType: Math.random() > 0.5 ? ServiceType.VENTA : ServiceType.POSTVENTA,
      rating: Math.floor(Math.random() * 4) + 7, // Mayoría entre 7-10
      createdAt,
      source: 'seed'
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