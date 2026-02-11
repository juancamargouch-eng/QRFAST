"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Users,
    Zap,
    QrCode,
    MousePointer2,
    TrendingUp,
    ArrowRight,
    Loader2,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface HistoryItem {
    date: string;
    count: number;
}

interface Stats {
    totalUsers: number;
    proUsers: number;
    totalQRs: number;
    totalClicks: number;
    newUsersToday: number;
    history: HistoryItem[];
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated" || (session && session.user.role !== "ADMIN")) {
            router.push("/");
        } else if (session?.user.role === "ADMIN") {
            fetchStats();
        }
    }, [session, status, router]);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching admin stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (session?.user.role !== "ADMIN") return null;

    const cards = [
        {
            title: "Usuarios Totales",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "blue",
            detail: `${stats?.newUsersToday} nuevos hoy`
        },
        {
            title: "Miembros Elite (PRO)",
            value: stats?.proUsers || 0,
            icon: Zap,
            color: "amber",
            detail: `${((stats?.proUsers || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% conversión`
        },
        {
            title: "QRs Generados",
            value: stats?.totalQRs || 0,
            icon: QrCode,
            color: "indigo",
            detail: "Total en plataforma"
        },
        {
            title: "Interacciones (Clicks)",
            value: stats?.totalClicks || 0,
            icon: MousePointer2,
            color: "emerald",
            detail: "Engagement acumulado"
        },
    ];

    return (
        <main className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-slate-950 p-2 rounded-xl">
                                <ShieldAlert className="text-blue-400" size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard <span className="text-blue-600">Maestro</span></h1>
                        </div>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Central de Inteligencia QRFAST</p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/admin/users"
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue-600 transition-all shadow-sm"
                        >
                            Gestionar Usuarios
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform group">
                            <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 w-fit mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors`}>
                                <card.icon size={24} />
                            </div>
                            <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">{card.title}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</span>
                                <TrendingUp size={16} className="text-emerald-500" />
                            </div>
                            <p className="text-slate-400 text-[9px] font-bold uppercase mt-4 tracking-tight">{card.detail}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Areas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Users size={160} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 relative z-10">Actividad del Sistema</h2>
                        <p className="text-slate-400 text-sm font-medium mb-8 relative z-10">Creación de QRs en los últimos 7 días.</p>

                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.history || []}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(str) => {
                                            const parts = str.split('-');
                                            return `${parts[2]}/${parts[1]}`;
                                        }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            fontSize: '12px',
                                            fontWeight: '800'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        name="QRs Creados"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        <div className="absolute inset-0 bg-blue-600/10" />
                        <h2 className="text-2xl font-black mb-6 relative z-10">Control Maestro</h2>
                        <div className="space-y-4 relative z-10">
                            <button className="w-full text-left p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors group">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-1 group-hover:text-white">Ajustes Globales</h4>
                                <p className="text-slate-400 text-[10px]">Restricciones y límites del sistema.</p>
                            </button>
                            <button className="w-full text-left p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors group">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-1 group-hover:text-white">Auditoría de Pagos</h4>
                                <p className="text-slate-400 text-[10px]">Revisión de transacciones manuales.</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
