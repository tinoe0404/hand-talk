const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const pin = "1234";
    const hashedPin = await bcrypt.hash(pin, 10);

    const radiographer = await prisma.radiographer.upsert({
        where: { id: 'default-radiographer' },
        update: {
            pin: hashedPin
        },
        create: {
            id: 'default-radiographer',
            name: 'Clinical Staff',
            pin: hashedPin,
        },
    });

    console.log('Seeded Radiographer:', radiographer.name);
    console.log('PIN set to: 1234');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seed error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
