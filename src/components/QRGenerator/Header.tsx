"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, User as UserIcon, Zap, Crown, Check, Shield, Clock } from "lucide-react";

export const Header = () => {
    const { data: session } = useSession();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const isPro = session?.user?.isPro;
    const proUntil = session?.user?.proUntil;
    const remainingDays = proUntil ? Math.max(0, Math.ceil((new Date(proUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-all duration-300 transform active:scale-95">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-xl group-hover:bg-blue-600/20 transition-all duration-500" />
                        <Image
                            src="/logo.svg"
                            alt="QRFAST Logo"
                            width={40}
                            height={40}
                            priority
                            className="relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none">
                            QRFAST <span className="text-blue-600">{isPro ? 'ELITE' : 'PRO'}</span>
                        </h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                            {isPro ? 'Membresía Activa' : 'SaaS Edition'}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            {isPro ? (
                                <div className="hidden md:flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-inner animate-in zoom-in-95 duration-500">
                                        <Crown size={14} fill="currentColor" />
                                        Ya eres Pro
                                    </div>
                                    {remainingDays !== null && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                            <Clock size={12} className="text-blue-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                                {remainingDays} {remainingDays === 1 ? 'día' : 'días'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95"
                                >
                                    <Zap size={14} fill="currentColor" />
                                    Subir a Pro
                                </button>
                            )}

                            {isPro && (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-xs font-black text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-100 rounded-xl transition-all uppercase tracking-widest shadow-sm"
                                >
                                    <LayoutDashboard size={14} />
                                    <span className="hidden sm:inline">Panel</span>
                                </Link>
                            )}

                            {session.user.role === "ADMIN" && (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-xs font-black text-blue-400 hover:text-white border border-slate-800 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-blue-500/10"
                                >
                                    <Shield size={14} />
                                    <span className="hidden sm:inline">Maestro</span>
                                </Link>
                            )}

                            <div className="h-6 w-px bg-slate-200" />

                            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-slate-100 shadow-sm relative group/user">
                                <div className="relative w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 overflow-hidden">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="User" fill className="object-cover" />
                                    ) : (
                                        <UserIcon size={14} />
                                    )}
                                    {isPro && (
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 border border-blue-600 rounded-full" />
                                    )}
                                </div>

                                <div className="hidden lg:flex flex-col -space-y-0.5 max-w-[100px]">
                                    <span className="text-[10px] font-black text-slate-900 truncate">{session.user?.name || 'Usuario'}</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${isPro ? 'text-yellow-600' : 'text-slate-400'}`}>
                                        {isPro ? 'Pro Member' : 'Free Plan'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => signOut()}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/auth/login"
                                className="px-5 py-2.5 text-xs font-black text-slate-600 hover:text-blue-600 transition-all uppercase tracking-widest"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                            >
                                Empezar Pro
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Pago / Upgrade Simulado */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />

                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="p-4 bg-blue-50 rounded-[2rem] text-blue-600">
                                    <Crown size={40} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Upgrade a QRFAST Pro</h2>
                                <p className="text-slate-500 font-medium text-sm px-4">
                                    Desbloquea QRs dinámicos, resolución 4K y analíticas ilimitadas hoy mismo.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Plan Mensual</span>
                                    <span className="text-lg font-black text-slate-900">$9.90 / mes</span>
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        "Edición de QRs Ilimitada",
                                        "Descargas en RAW (4000px)",
                                        "Soporte Premium 24/7",
                                        "Sin Marcas de Agua SaaS"
                                    ].map((t, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                            <div className="p-1 bg-blue-100 text-blue-600 rounded-full"><Check size={8} /></div>
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/#pricing"
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
                                >
                                    <Shield size={18} />
                                    Ir a Planes y Pagar
                                </Link>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
                                >
                                    Quizás más tarde
                                </button>
                            </div>

                            <p className="text-[9px] text-slate-400 text-center font-medium px-8 leading-relaxed italic">
                                * Las transacciones son procesadas de forma segura por PayPal con cifrado de grado bancario.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
