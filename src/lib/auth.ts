import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isPro: user.isPro,
                    role: user.role,
                    proUntil: user.proUntil
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production",
                // Al NO definir maxAge aquí, la cookie se vuelve de "sesión" (transiente)
                // y se borra al cerrar el navegador.
            },
        },
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.isPro = user.isPro;
                token.role = user.role;
                token.proUntil = user.proUntil;
            }

            // Lógica de sincronización con la base de datos si el tiempo ha expirado
            if (token.isPro && token.proUntil) {
                const now = new Date();
                const expirationDate = new Date(token.proUntil as string);

                if (now > expirationDate) {
                    // La suscripción ha expirado. Actualizamos el token inmediatamente.
                    token.isPro = false;

                    // Actualizamos la base de datos de forma asíncrona (sin bloquear el login)
                    prisma.user.update({
                        where: { id: token.id as string },
                        data: { isPro: false },
                    }).catch(err => console.error("Error al desactivar suscripción expirada:", err));
                }
            }

            if (trigger === "update" && session) {
                if (session.isPro !== undefined) token.isPro = session.isPro;
                if (session.proUntil !== undefined) token.proUntil = session.proUntil;
                if (session.role !== undefined) token.role = session.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.isPro = token.isPro;
                session.user.role = token.role;
                session.user.proUntil = token.proUntil;
            }
            return session;
        },
    },
};
