import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {

    try {
        const params = await context.params;
        const code = params?.code;


        if (!code) {
            console.log(`[DynamicQR] Error: No hay código en params`);
            return new Response("Código no proporcionado", { status: 400 });
        }

        console.log(`[DynamicQR] Buscando en BD el código: ${code}...`);
        const dynamicQR = await prisma.dynamicQR.findUnique({
            where: { shortCode: code },
        });

        if (!dynamicQR) {
            console.log(`[DynamicQR] Error: Código ${code} no existe en BD`);
            return NextResponse.redirect(new URL("/", request.url));
        }

        console.log(`[DynamicQR] ¡Éxito! Redirigiendo a: ${dynamicQR.targetUrl}`);

        // Incremento asíncrono
        prisma.dynamicQR.update({
            where: { shortCode: code },
            data: { clicks: { increment: 1 } },
        }).catch(e => console.error("[DynamicQR] Fallo al contar click:", e));

        let targetUrl = dynamicQR.targetUrl;
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://") && !targetUrl.startsWith("/")) {
            targetUrl = `https://${targetUrl}`;
        }

        return NextResponse.redirect(new URL(targetUrl));
    } catch (error) {
        console.error("[DynamicQR] ERROR CRÍTICO:", error);
        const message = error instanceof Error ? error.message : "Error desconocido";
        return new Response(`Error interno: ${message}`, { status: 500 });
    }
}

