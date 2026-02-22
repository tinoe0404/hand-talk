"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { startOfDay, endOfDay } from "date-fns";

/**
 * Clinical Telemetry Actions
 * Optimized for real-time dashboard updates and clinical auditing.
 */

export async function getDashboardStats() {
    const session = await getSession();
    if (!session) return { today: 0, avgTime: "0m", emergencies: 0 };

    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    // 1. Total sessions today (for this radiographer)
    const sessionsToday = await prisma.session.count({
        where: {
            radiographerId: session.radiographerId,
            createdAt: {
                gte: start,
                lte: end,
            },
        },
    });

    // 2. Emergencies today (for this radiographer's sessions)
    const emergenciesToday = await prisma.emergencyLog.count({
        where: {
            session: {
                radiographerId: session.radiographerId,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        },
    });

    // 3. Average duration of completed sessions today
    const completedSessions = await prisma.session.findMany({
        where: {
            radiographerId: session.radiographerId,
            status: "COMPLETED",
            createdAt: {
                gte: start,
                lte: end,
            },
            endTime: {
                not: null,
            },
        },
        select: {
            createdAt: true,
            endTime: true,
        },
    });

    let avgTime = "0m";
    if (completedSessions.length > 0) {
        const totalDurationMs = completedSessions.reduce((acc, sess) => {
            if (!sess.endTime) return acc;
            return acc + (sess.endTime.getTime() - sess.createdAt.getTime());
        }, 0);

        const avgMinutes = Math.round(totalDurationMs / completedSessions.length / 1000 / 60);
        avgTime = `${avgMinutes}m`;
    }

    return {
        today: sessionsToday,
        avgTime,
        emergencies: emergenciesToday,
    };
}
