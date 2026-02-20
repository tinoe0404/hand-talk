import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const pin = "1234";
    const hashedPin = await bcrypt.hash(pin, 10);

    const radiographer = await prisma.radiographer.upsert({
        where: { id: 'default-radiographer' },
        update: {},
        create: {
            id: 'default-radiographer',
            name: 'Clinical Staff',
            pin: hashedPin,
        },
    });

    console.log({ radiographer });
    console.log('Seeded Radiographer PIN: 1234');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
