
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.radiographer.count();
    console.log(`Radiographer count: ${count}`);
    const first = await prisma.radiographer.findFirst();
    console.log('First radiographer:', first ? { id: first.id, name: first.name } : 'None');
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
