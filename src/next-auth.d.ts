import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import { AdapterUser as BaseAdapterUser } from "next-auth/adapters";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            isPro: boolean;
            role: string;
            proUntil: Date | null | string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        isPro: boolean;
        role: string;
        proUntil: Date | null | string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends NextAuthJWT {
        id: string;
        isPro: boolean;
        role: string;
        proUntil: Date | null | string;
    }
}

/*
- **Panel Maestro**: Implementación total del Dashboard Admin con métricas, gestión de usuarios (edición/eliminación) y seguridad RBAC.
- **Acceso Inicial**: Creación de usuario administrador maestro vía script para puesta en marcha inmediata.
- **Lógica Pro**: Sincronización automática de expiración basada en `proUntil` con actualización en DB.
*/
declare module "next-auth/adapters" {
    interface AdapterUser extends BaseAdapterUser {
        id: string;
        isPro: boolean;
        role: string;
        proUntil: Date | null | string;
    }
}

// También aumentamos @auth/core para compatibilidad con versiones modernas de adaptadores
declare module "@auth/core/adapters" {
    interface AdapterUser {
        id: string;
        isPro: boolean;
        role: string;
        proUntil: Date | null | string;
    }
}

export { };
