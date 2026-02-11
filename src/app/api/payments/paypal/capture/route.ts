import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { capturePayPalOrder } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ message: "Order ID requerido" }, { status: 400 });
        }

        const capture = await capturePayPalOrder(orderId);

        if (capture.status === "COMPLETED") {
            // Activar Plan Pro
            const proUntil = new Date();
            proUntil.setDate(proUntil.getDate() + 30);


            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    isPro: true,
                    proUntil: proUntil
                },
            });

            return NextResponse.json({
                status: "success",
                message: "¡Pago completado y cuenta activada! 🚀",
                proUntil: proUntil
            });
        } else {
            return NextResponse.json({ status: "failed", message: "El pago no pudo ser procesado" }, { status: 400 });
        }
    } catch (error) {
        console.error("PayPal Capture Order Error:", error);
        const message = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json(
            { message: "Error al capturar el pago de PayPal", error: message },
            { status: 500 }
        );
    }
}
