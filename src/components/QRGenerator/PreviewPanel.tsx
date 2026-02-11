import React from "react";
import {
    Download,
    Maximize,
    LayoutGrid,
    Zap
} from "lucide-react";
import { toast } from "sonner";
import { QRStyles } from "./types";
import { toPng, toSvg } from "html-to-image";

interface PreviewPanelProps {
    options: QRStyles;
    qrContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    options,
    qrContainerRef
}) => {
    const frameRef = React.useRef<HTMLDivElement>(null);

    const handleDownloadComposite = async (ext: "png" | "svg") => {
        const targetElement = options.frameStyle === "none"
            ? qrContainerRef.current
            : frameRef.current;

        if (!targetElement) {
            toast.error("Error de renderizado", {
                description: "No se pudo encontrar el elemento para procesar la descarga.",
            });
            return;
        }

        try {
            const downloadOptions = {
                quality: 1,
                pixelRatio: options.resolution || 2,
                backgroundColor: 'transparent',
                cacheBust: true,
                style: {
                    transform: 'scale(1)',
                }
            };

            // Generar imagen (siempre devolvemos dataUrl de toPng/toSvg)
            const dataUrl = ext === "png"
                ? await toPng(targetElement as HTMLElement, downloadOptions)
                : await toSvg(targetElement as HTMLElement, downloadOptions);

            if (!dataUrl || dataUrl === 'data:,') throw new Error("Generación fallida.");

            // CORRECCIÓN: Convertir Base64 a Blob para soportar altas resoluciones
            const fetchRes = await fetch(dataUrl);
            const blob = await fetchRes.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `QRFAST-${options.frameText || 'code'}-${Date.now()}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpieza inmediata del objeto URL
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

            toast.success("Descarga iniciada", {
                description: `Tu código QR ${ext.toUpperCase()} está listo.`,
            });
        } catch (err) {
            console.error("Error generating image:", err);
            toast.error("Error al exportar", {
                description: "Prueba reduciendo la resolución o quitando el marco si el error persiste.",
            });
        }
    };

    const renderQRContainer = () => (
        <div
            ref={qrContainerRef}
            className="qr-preview-container overflow-hidden bg-white flex items-center justify-center"
            style={{ width: '250px', height: '250px' }}
        />
    );

    const renderFrame = () => {
        const { frameStyle, frameColor, frameText, frameTextColor } = options;

        if (frameStyle === "none") {
            return (
                <div className="relative bg-white p-5 rounded-[2rem] shadow-inner transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="rounded-xl overflow-hidden border border-slate-100">
                        {renderQRContainer()}
                    </div>
                </div>
            );
        }

        const frameConfigs = {
            smooth: {
                outer: "rounded-[3.5rem] p-8 shadow-2xl",
                inner: "rounded-2xl shadow-lg p-2 bg-white flex items-center justify-center",
                text: "font-black text-xl mt-6"
            },
            retro: {
                outer: "rounded-none p-6 border-[10px] border-double shadow-none",
                inner: "border-4 border-slate-900 p-2 bg-white flex items-center justify-center",
                text: "font-mono text-lg italic mt-4"
            },
            industrial: {
                outer: "rounded-none p-10 border-[14px] border-slate-900 border-t-[45px] shadow-none uppercase",
                inner: "border-4 border-slate-900 p-2 bg-white flex items-center justify-center",
                text: "font-black text-2xl tracking-[0.15em] mt-8"
            }
        }[frameStyle as 'smooth' | 'retro' | 'industrial'];

        return (
            <div
                ref={frameRef}
                style={{ backgroundColor: frameColor, borderColor: frameColor }}
                className={`${frameConfigs.outer} flex flex-col items-center transition-transform duration-500 group-hover:scale-[1.02] relative`}
            >
                {frameStyle === "industrial" && (
                    <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] text-white font-black tracking-[0.3em]">
                        <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                        DYNAMIC SECURITY TAG
                        <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                    </div>
                )}

                <div className={frameConfigs.inner}>
                    {renderQRContainer()}
                </div>

                {frameText && (
                    <div style={{ color: frameTextColor }} className={frameConfigs.text}>
                        {frameText}
                    </div>
                )}

                {frameStyle === "industrial" && (
                    <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1.5 h-6 bg-slate-900/10" />)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="sticky top-8 space-y-6">
                <div className="bg-slate-950 p-7 rounded-[3.5rem] border border-white/5 shadow-2xl shadow-blue-900/20 flex flex-col items-center overflow-hidden">
                    <div className="w-full flex justify-between items-center mb-8 text-white/20 px-4">
                        <div className="flex items-center gap-2">
                            <LayoutGrid size={14} />
                            <span className="text-[9px] font-black tracking-[0.3em] uppercase">QRFAST CORE V2</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                            <span className="text-[9px] font-black text-blue-400">READY</span>
                        </div>
                    </div>

                    <div className="relative group w-full flex justify-center py-6 min-h-[400px] items-center">
                        <div
                            className="absolute -inset-20 opacity-10 blur-[100px] transition-opacity duration-1000 group-hover:opacity-20 pointer-events-none"
                            style={{ backgroundColor: options.colorDots }}
                        />
                        {renderFrame()}
                    </div>

                    <div className="mt-10 flex flex-col gap-3 w-full px-4 relative z-10">
                        <button
                            onClick={() => handleDownloadComposite("png")}
                            className="w-full flex items-center justify-center gap-3 px-4 py-5 bg-white text-slate-950 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 group/btn cursor-pointer"
                        >
                            <Download size={18} />
                            Descargar Branding
                        </button>
                        <p className="text-center text-[9px] text-white/30 font-black tracking-widest uppercase">
                            Optimizado para 1000x1000px HQ
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[3rem] border border-white/5 shadow-2xl text-white group overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                                <Maximize size={20} />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-tight">Escaneo Garantizado</h3>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            Nuestra tecnología de renderizado compuesto asegura que el QR sea legible incluso con marcos complejos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
