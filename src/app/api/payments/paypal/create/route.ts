import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        // Crear la orden en PayPal (9.90 USD para el plan Pro)
        const order = await createPayPalOrder("9.90");

        if (order.id) {
            return NextResponse.json({ id: order.id });
        } else {
            throw new Error("No se pudo obtener el ID de la orden de PayPal");
        }
    } catch (error) {
        console.error("PayPal Create Order Error:", error);
        const message = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json(
            { message: "Error al crear la orden de PayPal", error: message },
            { status: 500 }
        );
    }
}
