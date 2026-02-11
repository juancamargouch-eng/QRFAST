"use client";

import React from "react";
import { Check, Zap, Shield, BarChart3, Maximize2, Layers, Crown } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { PayPalButtons } from "@paypal/react-paypal-js";

export const PricingSection = () => {
    const { data: session } = useSession();
    const isPro = session?.user?.isPro;

    return (
        <section className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-4">
                <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Planes y Precios</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    Escala tu impacto con <span className="text-blue-600">Pro</span>
                </h3>
                <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                    Desde generadores básicos hasta potentes herramientas de marketing dinámico.
                    Elige el plan que mejor se adapte a tu marca.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Plan Standard */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900">Standard</h4>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Para uso personal ágil</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-slate-900">$0</span>
                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Gratis siempre</span>
                    </div>

                    <ul className="space-y-4">
                        {[
                            "QRs Estáticos Ilimitados",
                            "Personalización de Colores",
                            "Resolución Standard (500px)",
                            "Sin necesidad de cuenta",
                            "Formatos PNG y SVG"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                <div className="p-1 bg-slate-100 rounded-full text-slate-400">
                                    <Check size={12} />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    {isPro ? (
                        <div className="block w-full py-4 text-center bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest opacity-60">
                            Plan Base
                        </div>
                    ) : (
                        <Link
                            href="/"
                            className="block w-full py-4 text-center bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                        >
                            {session ? "Tu Plan Actual" : "Empezar ahora"}
                        </Link>
                    )}
                </div>

                {/* Plan Pro */}
                <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl shadow-blue-900/20 space-y-8 relative overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                    {/* Badge Popular */}
                    <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/30 animate-pulse">
                        Más Popular
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Zap size={20} fill="currentColor" />
                            <h4 className="text-xl font-black text-white">QRFAST Pro</h4>
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-none">Poder dinámico corporativo</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white font-sans">$9.90</span>
                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/mes</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { icon: Maximize2, label: "QRs Dinámicos (Editables)", detail: "Cambia el destino después de imprimir." },
                            { icon: Layers, label: "Resolución Ultra HD (4000px)", detail: "Calidad de imprenta profesional máxima." },
                            { icon: BarChart3, label: "Estadísticas de Clics", detail: "Rastrea quién y cuándo escanea tu código." },
                            { icon: Shield, label: "Dashboard de Gestión Pro", detail: "Organiza proyectos y dominios seguros." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                <div className="p-2 bg-blue-600/20 rounded-xl text-blue-400 h-fit">
                                    <item.icon size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-white text-sm font-black leading-none">{item.label}</p>
                                    <p className="text-slate-500 text-[11px] leading-tight mt-1">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isPro ? (
                        <div className="block w-full py-5 text-center bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                            <Crown size={18} fill="currentColor" />
                            Tu Plan Actual
                        </div>
                    ) : session ? (
                        <div className="pt-2">
                            <PayPalButtons
                                style={{ layout: "horizontal", color: "blue", shape: "pill", label: "pay" }}
                                createOrder={async () => {
                                    const res = await fetch("/api/payments/paypal/create", { method: "POST" });
                                    const order = await res.json();
                                    return order.id;
                                }}
                                onApprove={async (data) => {
                                    const id = toast.loading("Confirmando tu pago...");
                                    try {
                                        const res = await fetch("/api/payments/paypal/capture", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ orderId: data.orderID }),
                                        });
                                        const result = await res.json();
                                        if (result.status === "success") {
                                            toast.success("¡Pago Exitoso!", { description: result.message, id });
                                            window.location.reload();
                                        } else {
                                            throw new Error(result.message);
                                        }
                                    } catch (error) {
                                        const message = error instanceof Error ? error.message : "Error desconocido";
                                        toast.error("Error", { description: message || "Error al capturar el pago", id });
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <Link
                            href="/auth/register"
                            className="block w-full py-5 text-center bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer"
                        >
                            Empezar ahora Pro
                        </Link>
                    )}

                    {/* Decoración de fondo */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
                </div>
            </div>

            {/* Trusted Benefits bar */}
            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                {[
                    { label: "Seguridad Bancaria", icon: Shield },
                    { label: "Soporte 24/7", icon: Zap },
                    { label: "SLA del 99.9%", icon: BarChart3 },
                    { icon: Layers, label: "Nodos Globales" }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 group cursor-default">
                        <item.icon size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};
