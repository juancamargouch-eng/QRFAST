import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user || !session.user.isPro) {
        return NextResponse.json({ message: "No autorizado (Requiere Pro)" }, { status: 403 });
    }

    try {
        const { name, targetUrl, options } = await request.json();
        const shortCode = nanoid(6); // Genera un código único corto

        const qr = await prisma.dynamicQR.create({
            data: {
                name,
                targetUrl,
                shortCode,
                options,
                userId: session.user.id,
            },
        });

        return NextResponse.json(qr, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Error al crear QR" }, { status: 500 });
    }
}

export async function GET() {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user || !session.user.isPro) {
        return NextResponse.json({ message: "No autorizado (Requiere Pro)" }, { status: 403 });
    }

    const qrs = await prisma.dynamicQR.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(qrs);
}
