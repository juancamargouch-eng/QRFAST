"use client";

import React, { useEffect, useRef } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";
import { X, Download, Zap, LayoutGrid, Maximize } from "lucide-react";
import { QRStyles } from "@/components/QRGenerator/types";
import { toPng, toSvg } from "html-to-image";
import { toast } from "sonner";

interface QRPreviewModalProps {
    qr: {
        shortCode: string;
        name: string;
        options: QRStyles;
    };
    onClose: () => void;
}

export const QRPreviewModal: React.FC<QRPreviewModalProps> = ({ qr, onClose }) => {
    const qrContainerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const options = qr.options as QRStyles;

    useEffect(() => {
        const currentContainer = qrContainerRef.current;
        if (!currentContainer) return;

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const data = `${origin}/go/${qr.shortCode}`;

        // Configuración base con sincronización de colores de esquinas
        const config: Options = {
            width: 250,
            height: 250,
            type: "svg",
            data: data,
            dotsOptions: {
                type: options.dotStyle,
                color: options.colorDots,
            },
            backgroundOptions: {
                color: options.colorBackground,
            },
            cornersSquareOptions: {
                type: options.cornerSquareStyle,
                color: options.colorDots, // Sincronizado con Estética como en el generador
            },
            cornersDotOptions: {
                type: options.cornerDotStyle,
                color: options.colorDots, // Sincronizado con Estética como en el generador
            },
            image: options.logoUrl || undefined,
            imageOptions: {
                crossOrigin: "anonymous",
                margin: options.logoMargin || 10,
                imageSize: options.logoSize || 0.4,
            },
        };

        // Soporte para Degradados
        if (options.isGradient && config.dotsOptions) {
            config.dotsOptions.gradient = {
                type: options.gradientType,
                rotation: (options.gradientRotation * Math.PI) / 180,
                colorStops: [
                    { offset: 0, color: options.colorDots },
                    { offset: 1, color: options.colorDotsSecondary }
                ]
            };
        }

        qrCodeRef.current = new QRCodeStyling(config);
        qrCodeRef.current.append(currentContainer);

        return () => {
            if (currentContainer) {
                currentContainer.innerHTML = "";
            }
        };
    }, [qr, options]);

    const handleDownload = async (ext: "png" | "svg") => {
        const targetElement = options.frameStyle === "none"
            ? qrContainerRef.current
            : frameRef.current;

        if (!targetElement) return;

        try {
            const downloadOptions = {
                quality: 1,
                pixelRatio: options.resolution || 2,
                backgroundColor: 'transparent',
                cacheBust: true,
                style: { transform: 'scale(1)' }
            };

            const dataUrl = ext === "png"
                ? await toPng(targetElement as HTMLElement, downloadOptions)
                : await toSvg(targetElement as HTMLElement, downloadOptions);

            const fetchRes = await fetch(dataUrl);
            const blob = await fetchRes.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `QRFAST-${qr.name || 'code'}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            toast.success("Descarga completada");
        } catch {
            toast.error("Error al exportar");
        }
    };

    const renderQR = () => (
        <div
            ref={qrContainerRef}
            className="bg-white flex items-center justify-center overflow-hidden rounded-xl"
            style={{ width: '250px', height: '250px' }}
        />
    );

    const renderFrame = () => {
        if (options.frameStyle === "none") return renderQR();

        const frameConfigs = {
            smooth: {
                outer: "rounded-[3rem] p-8 shadow-2xl",
                inner: "rounded-2xl shadow-lg p-2 bg-white",
                text: "font-black text-xl mt-6"
            },
            retro: {
                outer: "rounded-none p-6 border-[10px] border-double",
                inner: "border-4 border-slate-900 p-2 bg-white",
                text: "font-mono text-lg italic mt-4"
            },
            industrial: {
                outer: "rounded-none p-10 border-[14px] border-slate-900 border-t-[45px] relative",
                inner: "border-4 border-slate-900 p-2 bg-white",
                text: "font-black text-2xl tracking-[0.15em] mt-8"
            }
        }[options.frameStyle as 'smooth' | 'retro' | 'industrial'] || { outer: "", inner: "", text: "" };

        return (
            <div
                ref={frameRef}
                style={{ backgroundColor: options.frameColor, borderColor: options.frameColor }}
                className={`${frameConfigs.outer} flex flex-col items-center relative transition-all duration-500`}
            >
                {options.frameStyle === "industrial" && (
                    <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[8px] text-white font-black tracking-[0.3em] whitespace-nowrap">
                        <Zap size={12} className="fill-yellow-400 text-yellow-400" />
                        SECURE DYNAMIC ASSET
                    </div>
                )}
                <div className={frameConfigs.inner}>
                    {renderQR()}
                </div>
                {options.frameText && (
                    <div style={{ color: options.frameTextColor }} className={frameConfigs.text}>
                        {options.frameText}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 z-[999] animate-in fade-in duration-300">
            <div className="bg-white/5 border border-white/10 w-full max-w-2xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-white/10 text-white rounded-2xl hover:bg-red-500 transition-all z-20"
                >
                    <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Visualización */}
                    <div className="flex justify-center relative">
                        <div className="absolute -inset-20 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
                        {renderFrame()}
                    </div>

                    {/* Información y Acciones */}
                    <div className="space-y-8 text-white">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                <LayoutGrid size={14} />
                                Recurso Recuperado
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">{qr.name || "Sin nombre"}</h2>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                Este es el diseño actual de tu QR dinámico. Puedes descargarlo en alta resolución cuantas veces quieras.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleDownload("png")}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-white text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                <Download size={18} />
                                Descargar PNG HD
                            </button>
                            <button
                                onClick={() => handleDownload("svg")}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                            >
                                <Maximize size={18} />
                                Descargar SVG (Vector)
                            </button>
                        </div>

                        <div className="pt-4 flex items-center gap-3 opacity-30">
                            <div className="h-px flex-1 bg-white/20" />
                            <Zap size={14} />
                            <div className="h-px flex-1 bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
