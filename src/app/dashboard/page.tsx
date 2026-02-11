"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    QrCode,
    ExternalLink,
    BarChart3,
    Edit3,
    Trash2,
    Plus,
    Loader2,
    Calendar,
    Globe
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { QRStyles } from "@/components/QRGenerator/types";

interface DynamicQR {
    id: string;
    shortCode: string;
    name: string;
    targetUrl: string;
    clicks: number;
    createdAt: string;
    options: QRStyles;
}

import { QRPreviewModal } from "@/components/Dashboard/QRPreviewModal";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [qrs, setQrs] = useState<DynamicQR[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingQr, setEditingQr] = useState<DynamicQR | null>(null);
    const [viewingQr, setViewingQr] = useState<DynamicQR | null>(null);
    const [deletingQrId, setDeletingQrId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            const isPro = session?.user.isPro;
            if (!isPro) {
                window.location.href = "/";
                return;
            }
            fetchQrs();
        } else if (status === "unauthenticated") {
            window.location.href = "/auth/login";
        }
    }, [status, session]);

    const fetchQrs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/qrs");
            if (res.ok) {
                const data = await res.json();
                setQrs(data);
            }
        } catch {
            console.error("Error fetching QRs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQr) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/qrs/${editingQr.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUrl: editingQr.targetUrl, name: editingQr.name }),
            });

            if (res.ok) {
                setEditingQr(null);
                fetchQrs();
                toast.success("Proyecto actualizado", {
                    description: "Los cambios se han guardado correctamente.",
                });
            }
        } catch {
            toast.error("Error al actualizar", {
                description: "No se pudieron guardar los cambios en el servidor.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingQrId(null);
        try {
            const res = await fetch(`/api/qrs/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchQrs();
                toast.success("QR eliminado", {
                    description: "El recurso ha sido borrado permanentemente.",
                });
            }
        } catch {
            toast.error("Error al eliminar", {
                description: "Hubo un problema al intentar borrar el QR.",
            });
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Gestiona tus QRs dinámicos e inteligentes</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={18} />
                        Nuevo QR Pro
                    </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
                        <div className="p-3 bg-blue-50 w-fit rounded-2xl text-blue-600"><QrCode size={20} /></div>
                        <p className="text-3xl font-black text-slate-900">{qrs.length}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">QRs Activos</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
                        <div className="p-3 bg-green-50 w-fit rounded-2xl text-green-600"><BarChart3 size={20} /></div>
                        <p className="text-3xl font-black text-slate-900">{qrs.reduce((acc, curr) => acc + curr.clicks, 0)}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Escaneos Totales</p>
                    </div>
                </div>

                {/* QR List */}
                <div className="grid grid-cols-1 gap-4">
                    {qrs.map((qr) => (
                        <div key={qr.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-6 w-full">
                                <div className="hidden md:flex p-5 bg-slate-50 rounded-[2rem] text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                    <QrCode size={32} />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black text-slate-900">{qr.name || "Nombre no asignado"}</h3>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-md">Pro dynamic</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-bold">
                                        <div className="flex items-center gap-1.5"><Globe size={14} /> {qr.targetUrl}</div>
                                        <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(qr.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1.5"><BarChart3 size={14} /> {qr.clicks} escaneos</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-fit">
                                <button
                                    onClick={() => setViewingQr(qr)}
                                    className="flex-1 md:flex-none p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                    title="Ver y Descargar QR"
                                >
                                    <QrCode size={18} />
                                </button>
                                <button
                                    onClick={() => setEditingQr(qr)}
                                    className="flex-1 md:flex-none p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                    title="Editar Destino"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button
                                    onClick={() => setDeletingQrId(qr.id)}
                                    className="flex-1 md:flex-none p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <Link
                                    href={`/go/${qr.shortCode}`}
                                    target="_blank"
                                    className="flex-1 md:flex-none p-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all active:scale-95"
                                >
                                    <ExternalLink size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Edición */}
            {editingQr && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Editar QR Dinámico</h2>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    value={editingQr.name}
                                    onChange={e => setEditingQr({ ...editingQr, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva URL de Destino</label>
                                <input
                                    type="url"
                                    value={editingQr.targetUrl}
                                    onChange={e => setEditingQr({ ...editingQr, targetUrl: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                                />
                                <p className="text-[10px] text-slate-400 font-medium italic mt-1">* Los cambios se aplican instantáneamente al QR ya impreso.</p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingQr(null)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-3 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : null}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación Elite */}
            {deletingQrId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 fade-in duration-300 border border-red-50 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50/50">
                            <Trash2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¿Eliminar Recurso?</h2>
                        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Esta acción es irreversible. El código QR impreso dejará de funcionar permanentemente.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleDelete(deletingQrId)}
                                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200"
                            >
                                Sí, Eliminar Permanentemente
                            </button>
                            <button
                                onClick={() => setDeletingQrId(null)}
                                className="w-full py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Cancelar y Mantener
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Previsualización y Redescarga */}
            {viewingQr && (
                <QRPreviewModal
                    qr={viewingQr}
                    onClose={() => setViewingQr(null)}
                />
            )}
        </div>
    );
}
