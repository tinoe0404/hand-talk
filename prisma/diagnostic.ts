import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.radiographer.count();
        console.log(`Total Radiographers in database: ${count}`);
        if (count > 0) {
            const first = await prisma.radiographer.findFirst();
            console.log(`First Radiographer ID: ${first?.id}`);
        }
    } catch (e) {
        console.error('Diagnostic error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
