import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    try {
        const stats = await prisma.$transaction([
            prisma.user.count(),
            prisma.user.count({ where: { isPro: true } }),
            prisma.dynamicQR.count(),
            prisma.dynamicQR.aggregate({
                _sum: { clicks: true }
            }),
            // Usuarios registrados hoy
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            })
        ]);

        // Obtener historial de QRs de los últimos 7 días
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyActivity = await prisma.dynamicQR.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Agrupar por día (Prisma group by DateTime incluye horas, hay que normalizar)
        const activityMap: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            activityMap[d.toISOString().split('T')[0]] = 0;
        }

        dailyActivity.forEach(day => {
            const dateStr = day.createdAt.toISOString().split('T')[0];
            if (activityMap[dateStr] !== undefined) {
                activityMap[dateStr] += day._count.id;
            }
        });

        const history = Object.entries(activityMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({
            totalUsers: stats[0],
            proUsers: stats[1],
            totalQRs: stats[2],
            totalClicks: stats[3]._sum.clicks || 0,
            newUsersToday: stats[4],
            history
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ message: "Error al obtener estadísticas" }, { status: 500 });
    }
}
