"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    Edit2,
    Trash2,
    Zap,
    User,
    MoreHorizontal,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isPro: boolean;
    proUntil: string | null;
    createdAt: string;
    _count: {
        qrs: number;
    }
}

export default function UserManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        isPro: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated" || (session && session.user.role !== "ADMIN")) {
            router.push("/");
        } else if (session?.user.role === "ADMIN") {
            fetchUsers();
        }
    }, [session, status, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch {
            toast.error("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: UserData) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name || "",
            email: user.email,
            password: "",
            role: user.role,
            isPro: user.isPro
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                toast.success("Usuario actualizado correctamente");
                setEditingUser(null);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.message || "Error al actualizar");
            }
        } catch {
            toast.error("Error de conexión");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string | null) => {
        if (!confirm(`¿Estás seguro de eliminar al usuario ${name || id}?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Usuario eliminado");
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.message || "Error al eliminar");
            }
        } catch {
            toast.error("Error de conexión");
        }
    };

    const togglePro = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPro: !currentStatus })
            });

            if (res.ok) {
                toast.success(`Estatus PRO ${!currentStatus ? 'activado' : 'desactivado'}`);
                fetchUsers();
            }
        } catch {
            toast.error("Error al actualizar estatus");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Gestión de <span className="text-blue-600">Usuarios</span></h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Directorio Global de la Plataforma</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por email o nombre..."
                                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold w-full sm:w-80 focus:border-blue-600 outline-none transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm">
                            <Filter size={14} />
                            Filtros
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black">
                                                    {(user.name || user.email)[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900">{user.name || 'Sin nombre'}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.isPro ? (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full w-fit">
                                                    <Zap size={12} className="fill-amber-600" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">Pro Elite</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full w-fit">
                                                    <User size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">Estándar</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-slate-700">{user._count.qrs} QRs</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Creados en total</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => togglePro(user.id, user.isPro)}
                                                    className={`p-2 rounded-xl transition-all ${user.isPro ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                                    title={user.isPro ? "Bajar a Estándar" : "Subir a Pro"}
                                                >
                                                    <Zap size={18} fill={user.isPro ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />

                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-8">Editar <span className="text-blue-600">Usuario</span></h2>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-600 outline-none transition-all font-sans"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-600 outline-none transition-all font-sans"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña (Opcional)</label>
                                <input
                                    type="password"
                                    placeholder="Dejar en blanco para no cambiar"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-600 outline-none transition-all font-sans"
                                    value={editFormData.password}
                                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-600 outline-none transition-all"
                                        value={editFormData.role}
                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Pro</label>
                                    <div className="flex items-center h-[56px] px-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-blue-600"
                                            checked={editFormData.isPro}
                                            onChange={(e) => setEditFormData({ ...editFormData, isPro: e.target.checked })}
                                        />
                                        <span className="ml-3 text-xs font-black uppercase tracking-tight text-slate-600">Activo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    {saving && <Loader2 className="animate-spin" size={16} />}
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
