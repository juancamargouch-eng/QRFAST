"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const registered = searchParams.get("registered");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/");
            router.refresh();
        } else {
            setError("Credenciales inválidas. Verifique su acceso.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 select-none">
                    <div className="relative w-20 h-20 mb-4 items-center justify-center flex">
                        <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-2xl" />
                        <Image src="/logo.svg" alt="QRFAST Logo" width={80} height={80} priority className="relative z-10 drop-shadow-2xl" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                        QR<span className="text-blue-600 underline underline-offset-8 decoration-4 decoration-blue-200">FAST</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-2">Enterprise Access System</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={120} className="text-blue-600" />
                    </div>

                    <div className="relative z-10">
                        {registered && (
                            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                <CheckCircle2 className="text-emerald-500" size={20} />
                                <p className="text-emerald-800 text-xs font-bold uppercase tracking-tight">Registro exitoso. Ya puede ingresar.</p>
                            </div>
                        )}

                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Bienvenido de nuevo</h2>
                        <p className="text-slate-400 text-sm font-medium mb-8">Acceda a sus códigos dinámicos y métricas de élite.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificador de Acceso</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Escriba su email..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all shadow-inner"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clave de Seguridad</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all shadow-inner"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-[11px] font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-950 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                            >
                                {loading ? "Verificando Acceso..." : "Entrar al Dashboard"}
                                {!loading && <LogIn size={16} />}
                            </button>
                        </form>

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">
                                ¿Aún no eres miembro? <Link href="/auth/register" className="text-blue-600 hover:underline">Crear Cuenta PRO</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-8 tracking-widest opacity-50">
                    QRFAST Technology • Secure Authentication
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
