import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const { id } = await props.params;
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user || !session.user.isPro) {
        return NextResponse.json({ message: "No autorizado (Requiere Pro)" }, { status: 403 });
    }

    try {
        const { name, targetUrl } = await request.json();

        const qr = await prisma.dynamicQR.update({
            where: { id: id, userId: session.user.id },
            data: { name, targetUrl },
        });

        return NextResponse.json(qr);
    } catch {
        return NextResponse.json({ message: "Error al actualizar" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const { id } = await props.params;
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        await prisma.dynamicQR.delete({
            where: { id: id, userId: session.user.id },
        });

        return NextResponse.json({ message: "Eliminado con éxito" });
    } catch {
        return NextResponse.json({ message: "Error al eliminar" }, { status: 500 });
    }
}
