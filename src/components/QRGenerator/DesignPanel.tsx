import React from "react";
import { useSession } from "next-auth/react";
import {
    Palette,
    CircleDot,
    Trash2,
    Upload,
    Paintbrush as GradientIcon,
    Image as ImageIcon,
    Maximize,
    Zap,
    LayoutGrid,
    Lock
} from "lucide-react";
import Image from "next/image";
import { QRStyles } from "./types";
import { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import { toast } from "sonner";

interface DesignPanelProps {
    options: QRStyles;
    setOptions: React.Dispatch<React.SetStateAction<QRStyles>>;
    handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeLogo: () => void;
}

export const DesignPanel: React.FC<DesignPanelProps> = ({
    options,
    setOptions,
    handleLogoUpload,
    removeLogo
}) => {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = React.useState<'visual' | 'corners' | 'branding' | 'export'>('visual');

    const tabs = [
        { id: 'visual', label: 'Estética', icon: Palette },
        { id: 'corners', label: 'Estructura', icon: CircleDot },
        { id: 'branding', label: 'Branding', icon: ImageIcon },
        { id: 'export', label: 'Exportación', icon: Maximize },
    ] as const;

    const isUserPro = session?.user?.isPro;

    return (
        <section className="space-y-4">
            {/* Navegación por Pestañas */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${activeTab === tab.id
                                ? "bg-white text-blue-600 shadow-sm scale-[1.02]"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <Icon size={18} className="mb-1" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="min-h-[380px]">
                {/* Pestaña 1: Estética Visual */}
                {activeTab === 'visual' && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-4">
                            <Palette size={18} className="text-blue-600" />
                            <h2>Estética Visual</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <GradientIcon size={16} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-600">Usar Degradado</span>
                                </div>
                                <button
                                    onClick={() => setOptions({ ...options, isGradient: !options.isGradient })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${options.isGradient ? 'bg-blue-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${options.isGradient ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{options.isGradient ? 'Color Inicio' : 'Color Puntos'}</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={options.colorDots}
                                            onChange={(e) => setOptions({ ...options, colorDots: e.target.value })}
                                            className="w-10 h-10 rounded-xl border-none cursor-pointer shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={options.colorDots}
                                            onChange={(e) => setOptions({ ...options, colorDots: e.target.value })}
                                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                {options.isGradient && (
                                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Color Fin</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={options.colorDotsSecondary}
                                                onChange={(e) => setOptions({ ...options, colorDotsSecondary: e.target.value })}
                                                className="w-10 h-10 rounded-xl border-none cursor-pointer shadow-sm"
                                            />
                                            <input
                                                type="text"
                                                value={options.colorDotsSecondary}
                                                onChange={(e) => setOptions({ ...options, colorDotsSecondary: e.target.value })}
                                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Forma de Puntos</label>
                                    <select
                                        value={options.dotStyle}
                                        onChange={(e) => setOptions({ ...options, dotStyle: e.target.value as DotType })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                                    >
                                        {['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'].map(s => (
                                            <option key={s} value={s}>{s.split('-').join(' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña 2: Estructura de Esquinas */}
                {activeTab === 'corners' && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-4">
                            <CircleDot size={18} className="text-blue-600" />
                            <h2>Estructura de Esquinas</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Marco Exterior</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                    <select
                                        value={options.cornerSquareStyle}
                                        onChange={(e) => setOptions({ ...options, cornerSquareStyle: e.target.value as CornerSquareType })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                                    >
                                        {['square', 'dot', 'extra-rounded'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                    </select>
                                    <p className="text-[9px] text-slate-400 font-medium italic px-1">
                                        * El color se sincroniza con la &quot;Estética&quot; para la armonía visual.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Punto Interior</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                    <select
                                        value={options.cornerDotStyle}
                                        onChange={(e) => setOptions({ ...options, cornerDotStyle: e.target.value as CornerDotType })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                                    >
                                        {['square', 'dot'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                    </select>
                                    <p className="text-[9px] text-slate-400 font-medium italic px-1">
                                        * Diseño profesional unificado automáticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña 3: Branding (Logo + Marco) */}
                {activeTab === 'branding' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Sub-Panel: Logo */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-4">
                                <ImageIcon size={18} className="text-blue-600" />
                                <h2>Branding: Logo</h2>
                            </div>

                            {!options.logoUrl ? (
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all group">
                                    <div className="flex items-center gap-3 px-4">
                                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                        <p className="text-xs font-bold text-slate-400 group-hover:text-blue-600 tracking-tight uppercase">Subir logo corporativo</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                </label>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 bg-white rounded-xl border border-slate-200 p-1">
                                                <Image src={options.logoUrl} alt="Preview" fill className="object-contain p-1" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 tracking-tight uppercase">Logo activo</span>
                                        </div>
                                        <button onClick={removeLogo} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tamaño</label>
                                            </div>
                                            <input type="range" min="0.1" max="0.5" step="0.05" value={options.logoSize} onChange={(e) => setOptions({ ...options, logoSize: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Margen</label>
                                            </div>
                                            <input type="range" min="0" max="20" step="2" value={options.logoMargin} onChange={(e) => setOptions({ ...options, logoMargin: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sub-Panel: Marcos */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-4">
                                <Maximize size={18} className="text-blue-600" />
                                <h2>Branding: Marco</h2>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {(['none', 'smooth', 'retro', 'industrial'] as const).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setOptions({ ...options, frameStyle: s })}
                                        className={`py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${options.frameStyle === s
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {options.frameStyle !== 'none' && (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in duration-300">
                                    <input
                                        type="text"
                                        value={options.frameText}
                                        onChange={(e) => setOptions({ ...options, frameText: e.target.value })}
                                        placeholder="Etiqueta del marco..."
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                                        maxLength={20}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Fondo</label>
                                            <input type="color" value={options.frameColor} onChange={(e) => setOptions({ ...options, frameColor: e.target.value })} className="w-full h-7 rounded-lg cursor-pointer" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Texto</label>
                                            <input type="color" value={options.frameTextColor} onChange={(e) => setOptions({ ...options, frameTextColor: e.target.value })} className="w-full h-7 rounded-lg cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pestaña 4: Exportación y SaaS */}
                {activeTab === 'export' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                                    <Zap size={16} className="text-white" />
                                </div>
                                Funciones Pro (SaaS)
                            </h3>

                            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Zap size={100} className="text-blue-500" />
                                </div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-white uppercase tracking-widest">QR Dinámico (SaaS)</p>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Edita el enlace sin cambiar el QR impreso.</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (status !== 'authenticated') {
                                                toast.error("Inicia sesión para activar QRs Dinámicos.", {
                                                    description: "Necesitas una cuenta para gestionar enlaces persistentes.",
                                                });
                                                return;
                                            }

                                            if (!isUserPro) {
                                                toast.warning("Función exclusiva de QRFAST Pro 🚀", {
                                                    description: "El Vínculo Virtual permite editar destinos sin cambiar el código impreso.",
                                                });
                                                return;
                                            }

                                            if (options.isDynamic) {
                                                setOptions({ ...options, isDynamic: false });
                                                return;
                                            }

                                            // Activar directamente con feedback premium
                                            if (!options.dynamicShortCode) {
                                                try {
                                                    const res = await fetch('/api/qrs', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            name: "Mi QR Dinámico",
                                                            targetUrl: options.url,
                                                            options: options
                                                        })
                                                    });

                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setOptions({
                                                            ...options,
                                                            isDynamic: true,
                                                            dynamicShortCode: data.shortCode
                                                        });
                                                        toast.success("¡Vínculo Dinámico Activado! ⚡", {
                                                            description: "Tu QR ahora es inteligente y puede ser editado en cualquier momento.",
                                                        });
                                                    } else {
                                                        const err = await res.json();
                                                        toast.error("Error al crear QR Dinámico", {
                                                            description: err.message || "Hubo un problema técnico.",
                                                        });
                                                    }
                                                } catch {
                                                    toast.error("Error de conexión", {
                                                        description: "No se pudo contactar con el servidor.",
                                                    });
                                                }
                                            } else {
                                                setOptions({ ...options, isDynamic: true });
                                                toast.success("Vínculo reactivado", {
                                                    description: "Sigues usando tu enlace persistente.",
                                                });
                                            }
                                        }}
                                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${options.isDynamic ? 'bg-blue-600' : 'bg-slate-800'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${options.isDynamic ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                {options.isDynamic && (
                                    <div className="pt-4 border-t border-white/5 space-y-4 animate-in fade-in duration-300 relative z-10">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] text-blue-400 font-black tracking-widest uppercase mb-2">Estado del Nodo Corporativo</p>
                                            <div className="flex items-center gap-3 mb-2 text-white">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                                <span className="text-[11px] font-bold">Vínculo Virtual Activo</span>
                                            </div>
                                            {options.dynamicShortCode && (
                                                <div className="mt-3 p-2 bg-black/50 rounded-lg text-[10px] font-mono text-slate-300 break-all select-all">
                                                    Link: {typeof window !== 'undefined' ? window.location.origin : ''}/go/{options.dynamicShortCode}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-slate-950 rounded-lg shadow-lg">
                                    <LayoutGrid size={16} className="text-white" />
                                </div>
                                Resolución de Salida
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { val: 1, label: 'Standard', res: '500px', isPro: false },
                                    { val: 2, label: 'HQ', res: '1000px', isPro: false },
                                    { val: 4, label: 'Pro', res: '2000px', isPro: true },
                                    { val: 8, label: 'Ultra', res: '4000px', isPro: true }
                                ].map((r) => {
                                    const isLocked = r.isPro && !isUserPro;

                                    return (
                                        <button
                                            key={r.val}
                                            onClick={() => {
                                                if (isLocked) {
                                                    toast.warning("Resolución Ultra HD bloqueada 🔒", {
                                                        description: "Sube al plan Pro para descargar diseños en alta fidelidad (4000px).",
                                                    });
                                                    return;
                                                }
                                                setOptions({ ...options, resolution: r.val });
                                            }}
                                            className={`p-4 rounded-2xl border transition-all text-left group relative ${options.resolution === r.val
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]'
                                                : 'bg-white border-slate-100 hover:border-slate-200'
                                                } ${isLocked ? 'opacity-60 grayscale-[0.5]' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${options.resolution === r.val ? 'text-blue-400' : 'text-slate-400'}`}>
                                                    {r.label}
                                                </p>
                                                {isLocked && <Lock size={12} className="text-slate-400" />}
                                            </div>
                                            <p className="text-xs font-bold">{r.res}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
