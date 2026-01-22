require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const bcrypt = require('bcryptjs')
const { URL } = require('url')

const connectionString = process.env.DATABASE_URL
const url = new URL(connectionString)

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  connectionLimit: 5
})

const prisma = new PrismaClient({ adapter })

console.log('Seed starting...')


async function main() {
  const password = await bcrypt.hash('admin', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password,
      role: 'admin',
      name: 'Admin User',
      isActive: true,
    },
  })
  
  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
