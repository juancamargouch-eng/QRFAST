"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface AdBannerProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle";
    style?: React.CSSProperties;
}

export default function AdBanner({ slot, format = "auto", style }: AdBannerProps) {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Si el usuario es Pro, no renderizamos absolutamente nada del anuncio
    if (session?.user?.isPro) {
        return null;
    }

    if (!mounted) {
        return null;
    }

    return (
        <div className="w-full flex justify-center my-8 overflow-hidden" style={style}>
            <div className="relative w-full max-w-4xl bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-4 transition-all hover:border-blue-200 group">
                {/* Indicador de Anuncio */}
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 transition-colors group-hover:text-blue-400">
                    Publicidad
                </div>

                <ins
                    className="adsbygoogle"
                    style={{ display: "block", ...style }}
                    data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                />

                {/* Script de activación por slot */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
                    }}
                />
            </div>
        </div>
    );
}
