const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const pin = "1234";
    const hashedPin = await bcrypt.hash(pin, 10);

    // 1. Seed Radiographer
    const radiographer = await prisma.radiographer.upsert({
        where: { id: 'default-radiographer' },
        update: { pin: hashedPin },
        create: {
            id: 'default-radiographer',
            name: 'Clinical Staff',
            pin: hashedPin,
        },
    });

    // 2. Seed Test Patients
    const patients = [
        { mrn: 'P-1001', name: 'John Doe', gender: 'Male', dob: new Date('1985-05-15') },
        { mrn: 'P-1002', name: 'Jane Smith', gender: 'Female', dob: new Date('1992-11-23') },
        { mrn: 'P-1003', name: 'Robert Johnson', gender: 'Male', dob: new Date('1978-02-08') }
    ];

    for (const pData of patients) {
        await prisma.patient.upsert({
            where: { mrn: pData.mrn },
            update: {},
            create: {
                mrn: pData.mrn,
                name: pData.name,
                gender: pData.gender,
                dateOfBirth: pData.dob
            }
        });
    }

    console.log('Seeding complete.');
    console.log('Clinical Radiographer: PIN 1234');
    console.log('Seeded 3 test patients.');
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
