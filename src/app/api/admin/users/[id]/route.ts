import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, email, password, role, isPro, proUntil } = body;

        interface UpdateData {
            name?: string;
            email?: string;
            role?: string;
            isPro?: boolean;
            proUntil?: Date | null;
            password?: string;
        }

        const updatedData: UpdateData = {
            name,
            email,
            role,
            isPro,
            proUntil: proUntil ? new Date(proUntil) : null
        };

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updatedData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isPro: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Admin User Patch Error:", error);
        return NextResponse.json({ message: "Error al actualizar usuario" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    if (session.user.id === id) {
        return NextResponse.json({ message: "No puedes eliminar tu propia cuenta" }, { status: 400 });
    }

    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("Admin User Delete Error:", error);
        return NextResponse.json({ message: "Error al eliminar usuario" }, { status: 500 });
    }
}
