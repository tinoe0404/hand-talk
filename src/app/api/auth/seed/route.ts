import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPin } from '@/lib/auth-utils';

/**
 * CLINICAL SEED API
 * ONLY FOR DEVELOPMENT USE.
 * Seeds the default radiographer with PIN 1234.
 */
export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not permitted in production' }, { status: 403 });
    }

    try {
        const pin = "1234";
        const hashedPin = await hashPin(pin);

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

        return NextResponse.json({
            success: true,
            message: 'Clinical Radiographer Seeded',
            radiographerId: radiographer.id,
            pin: '1234'
        });
    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
    }
}
