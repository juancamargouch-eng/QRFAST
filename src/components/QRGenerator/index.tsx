"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";
import { INITIAL_OPTIONS, QRStyles } from "./types";
import { generateQRData } from "./utils";
import { ContentForm } from "./ContentForm";
import { DesignPanel } from "./DesignPanel";
import { PreviewPanel } from "./PreviewPanel";
import { toast } from "sonner";
import AdBanner from "../AdSense/AdBanner";

export default function QRGenerator() {
    const [options, setOptions] = useState<QRStyles>(INITIAL_OPTIONS);
    const [isLocating, setIsLocating] = useState(false);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const qrContainerRef = useRef<HTMLDivElement>(null);
    // Memoizar los datos del QR para evitar cálculos innecesarios
    const qrData = useMemo(() => {
        if (options.isDynamic && options.dynamicShortCode) {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            return `${origin}/go/${options.dynamicShortCode}`;
        }
        return generateQRData(options);
    }, [options]);

    // Inicializar instancia de qr-code-styling
    useEffect(() => {
        if (typeof window !== "undefined") {
            qrCodeRef.current = new QRCodeStyling({
                width: 250,
                height: 250,
                type: "svg",
                data: qrData,
                dotsOptions: {
                    color: options.colorDots,
                    type: options.dotStyle,
                },
                backgroundOptions: {
                    color: options.colorBackground,
                },
                cornersSquareOptions: {
                    type: options.cornerSquareStyle,
                    color: options.colorCornersSquare,
                },
                cornersDotOptions: {
                    type: options.cornerDotStyle,
                    color: options.colorCornersDot,
                },
                image: options.logoUrl || undefined,
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: options.logoMargin,
                    imageSize: options.logoSize,
                }
            });

            if (qrContainerRef.current) {
                qrCodeRef.current.append(qrContainerRef.current);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Actualizar QR cuando cambien las opciones o los datos
    useEffect(() => {
        if (qrCodeRef.current) {
            // Si el contenedor está vacío (porque React lo recreó), volver a inyectar el QR
            if (qrContainerRef.current && qrContainerRef.current.childNodes.length === 0) {
                qrCodeRef.current.append(qrContainerRef.current);
            }

            const updateOptions: Options = {
                data: qrData,
                dotsOptions: {
                    type: options.dotStyle,
                },
                backgroundOptions: {
                    color: options.colorBackground,
                },
                cornersSquareOptions: {
                    type: options.cornerSquareStyle,
                    color: options.colorDots, // Sincronizado con Estética
                },
                cornersDotOptions: {
                    type: options.cornerDotStyle,
                    color: options.colorDots, // Sincronizado con Estética
                },
                image: options.logoUrl || undefined,
                imageOptions: {
                    margin: options.logoMargin,
                    imageSize: options.logoSize,
                },
            };

            if (options.isGradient && updateOptions.dotsOptions) {
                updateOptions.dotsOptions.gradient = {
                    type: options.gradientType,
                    rotation: (options.gradientRotation * Math.PI) / 180,
                    colorStops: [
                        { offset: 0, color: options.colorDots },
                        { offset: 1, color: options.colorDotsSecondary }
                    ]
                };
            } else if (updateOptions.dotsOptions) {
                updateOptions.dotsOptions.color = options.colorDots;
            }

            qrCodeRef.current.update(updateOptions);
        }
    }, [options, qrData]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setOptions((prev) => ({ ...prev, logoUrl: event.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setOptions((prev) => ({ ...prev, logoUrl: "" }));
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocalización no soportada", {
                description: "Tu navegador no permite acceder a la ubicación GPS.",
            });
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOptions(prev => ({
                    ...prev,
                    geo: {
                        ...prev.geo,
                        lat: position.coords.latitude.toFixed(6),
                        lng: position.coords.longitude.toFixed(6)
                    }
                }));
                setIsLocating(false);
            },
            (error) => {
                console.error("Error obteniendo ubicación:", error);
                toast.error("Error de ubicación", {
                    description: "Por favor, asegúrate de dar permisos de GPS en tu navegador.",
                });
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4 lg:p-8 animate-in fade-in duration-700">
            {/* Columna Izquierda: Controles */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <ContentForm
                        options={options}
                        setOptions={setOptions}
                        isLocating={isLocating}
                        getCurrentLocation={getCurrentLocation}
                    />

                    <DesignPanel
                        options={options}
                        setOptions={setOptions}
                        handleLogoUpload={handleLogoUpload}
                        removeLogo={removeLogo}
                    />
                </div>
            </div>

            {/* Columna Derecha: Vista Previa y Anuncios */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 h-fit sticky top-8">
                <PreviewPanel
                    options={options}
                    qrContainerRef={qrContainerRef}
                />
                <AdBanner slot="XXXXXXXXXX2" format="rectangle" />
            </div>
        </div>
    );
}
