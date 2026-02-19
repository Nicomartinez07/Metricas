import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth-utils'

const prisma = new PrismaClient()

async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email
    }
  })

  console.log('✅ Usuario creado:')
  console.log(`   Email: ${user.email}`)
  console.log(`   Nombre: ${user.name}`)
  console.log(`   ID: ${user.id}`)
}

// Obtener argumentos de línea de comandos
const email = process.argv[2]
const password = process.argv[3]
const name = process.argv[4]

if (!email || !password) {
  console.error('❌ Error: Debes proporcionar email y contraseña')
  console.log('Uso: npm run create-user <email> <password> [nombre]')
  console.log('Ejemplo: npm run create-user admin@empresa.com password123 "Admin"')
  process.exit(1)
}

createUser(email, password, name)
  .catch((e) => {
    console.error('❌ Error creando usuario:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })