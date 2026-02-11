import React from "react";
import {
    Link2,
    UserCircle2,
    MapPin,
    Navigation,
    Loader2,
    Search,
    Wifi,
    MessageCircle,
    Calendar,
    Shield,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import { QRStyles, VCardData, GeoData, WifiData, WhatsAppData, EventData, ContentType } from "./types";

interface ContentFormProps {
    options: QRStyles;
    setOptions: React.Dispatch<React.SetStateAction<QRStyles>>;
    isLocating: boolean;
    getCurrentLocation: () => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({
    options,
    setOptions,
    isLocating,
    getCurrentLocation
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const updateNested = <T extends keyof QRStyles>(key: T, value: Partial<QRStyles[T]>) => {
        setOptions(prev => ({
            ...prev,
            [key]: { ...(prev[key] as Record<string, unknown>), ...value }
        }));
    };

    const handleVCardChange = (field: keyof VCardData, value: string) => updateNested("vcard", { [field]: value });
    const handleGeoChange = (field: keyof GeoData, value: string) => updateNested("geo", { [field]: value });
    const handleWifiChange = (field: keyof WifiData, value: string | boolean) => updateNested("wifi", { [field]: value });
    const handleWAChange = (field: keyof WhatsAppData, value: string) => updateNested("whatsapp", { [field]: value });
    const handleEventChange = (field: keyof EventData, value: string) => updateNested("event", { [field]: value });

    return (
        <section className="space-y-6">
            {/* Selector de Tipo Ultra-Modulado */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-4">
                    <Search size={18} className="text-blue-600" />
                    <h2>¿Qué quieres codificar?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                        { id: 'url' as ContentType, label: 'Enlace', icon: Link2 },
                        { id: 'vcard' as ContentType, label: 'Contacto', icon: UserCircle2 },
                        { id: 'geo' as ContentType, label: 'Ubicación', icon: MapPin },
                        { id: 'wifi' as ContentType, label: 'WiFi', icon: Wifi },
                        { id: 'whatsapp' as ContentType, label: 'WhatsApp', icon: MessageCircle },
                        { id: 'event' as ContentType, label: 'Evento', icon: Calendar },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setOptions({ ...options, contentType: item.id })}
                            className={`flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all ${options.contentType === item.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Panel de Contenido Dinámico */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[300px]">
                {options.contentType === "url" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold">
                            <Link2 size={18} className="text-blue-600" />
                            <h2>Enlace o Texto Ágil</h2>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">URL / Mensaje</label>
                            <input
                                type="text"
                                value={options.url}
                                onChange={(e) => setOptions({ ...options, url: e.target.value })}
                                placeholder="https://tu-sitio.com o un texto cualquiera"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-600 font-medium font-mono"
                            />
                        </div>
                    </div>
                )}

                {options.contentType === "vcard" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold">
                            <UserCircle2 size={18} className="text-blue-600" />
                            <h2>Perfil de Contacto</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'firstName', label: 'Nombre', placeholder: 'Juan' },
                                { id: 'lastName', label: 'Apellidos', placeholder: 'Pérez' },
                                { id: 'phone', label: 'Celular', placeholder: '+51 900...' },
                                { id: 'email', label: 'Email', placeholder: 'juan@mail.com' },
                                { id: 'organization', label: 'Empresa', placeholder: 'Empresa S.A.' },
                                { id: 'title', label: 'Cargo', placeholder: 'Analista' }
                            ].map((f) => (
                                <div key={f.id} className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                                    <input
                                        type="text"
                                        value={options.vcard[f.id as keyof VCardData]}
                                        onChange={(e) => handleVCardChange(f.id as keyof VCardData, e.target.value)}
                                        placeholder={f.placeholder}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {options.contentType === "wifi" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                            <Wifi size={18} className="text-blue-600" />
                            <h2>Acceso WiFi Instantáneo</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de Red (SSID)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={options.wifi.ssid}
                                        onChange={(e) => handleWifiChange("ssid", e.target.value)}
                                        placeholder="Mi_Red_WiFi"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                    />
                                    <Wifi size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={options.wifi.password}
                                        onChange={(e) => handleWifiChange("password", e.target.value)}
                                        placeholder="********"
                                        className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                    />
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seguridad</label>
                                    <select
                                        value={options.wifi.encryption}
                                        onChange={(e) => handleWifiChange("encryption", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">Sin Contraseña</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => handleWifiChange("hidden", !options.wifi.hidden)}
                                        className={`w-full py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${options.wifi.hidden ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                                    >
                                        <Shield size={14} />
                                        {options.wifi.hidden ? 'Red Oculta' : 'Red Visible'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {options.contentType === "whatsapp" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                            <MessageCircle size={20} className="text-green-500" />
                            <h2>Enlace de WhatsApp</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número (con prefijo)</label>
                                <input
                                    type="tel"
                                    value={options.whatsapp.phone}
                                    onChange={(e) => handleWAChange("phone", e.target.value)}
                                    placeholder="51900000000"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-mono font-bold"
                                />
                                <p className="text-[10px] text-slate-400 italic">Ej: 51 para Perú + número sin espacios</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensaje Predeterminado</label>
                                <textarea
                                    value={options.whatsapp.message}
                                    onChange={(e) => handleWAChange("message", e.target.value)}
                                    rows={3}
                                    placeholder="Hola, me gustaría más información..."
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {options.contentType === "event" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                            <Calendar size={18} className="text-orange-500" />
                            <h2>Agendar Evento (iCal)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título del Evento</label>
                                <input
                                    type="text"
                                    value={options.event.title}
                                    onChange={(e) => handleEventChange("title", e.target.value)}
                                    placeholder="Reunión de Proyecto"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inicio</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={options.event.startDate}
                                        onChange={(e) => handleEventChange("startDate", e.target.value)}
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                                    />
                                    <input
                                        type="time"
                                        value={options.event.startTime}
                                        onChange={(e) => handleEventChange("startTime", e.target.value)}
                                        className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fin</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={options.event.endDate}
                                        onChange={(e) => handleEventChange("endDate", e.target.value)}
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                                    />
                                    <input
                                        type="time"
                                        value={options.event.endTime}
                                        onChange={(e) => handleEventChange("endTime", e.target.value)}
                                        className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={options.event.location}
                                    onChange={(e) => handleEventChange("location", e.target.value)}
                                    placeholder="Oficina Principal / Google Meet"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {options.contentType === "geo" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-slate-800 font-bold">
                                <MapPin size={18} className="text-blue-600" />
                                <h2>Geolocalización Maps</h2>
                            </div>
                            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl shadow-inner">
                                {(['coords', 'address'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setOptions({ ...options, geoMode: mode })}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${options.geoMode === mode ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-600"}`}
                                    >
                                        {mode === 'coords' ? 'GPS' : 'TXT'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {options.geoMode === "coords" ? (
                            <div className="space-y-5">
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={isLocating}
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100 rounded-2xl text-sm font-black hover:from-blue-100 hover:to-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLocating ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                                    {isLocating ? "CALIBRANDO GPS..." : "CAPTURAR MI POSICIÓN"}
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    {(['lat', 'lng'] as const).map((coord) => (
                                        <div key={coord} className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{coord === 'lat' ? 'Latitud' : 'Longitud'}</label>
                                            <input
                                                type="text"
                                                value={options.geo[coord]}
                                                onChange={(e) => handleGeoChange(coord, e.target.value)}
                                                placeholder={coord === 'lat' ? '-12.04' : '-77.04'}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lugar o Dirección</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={options.geo.address}
                                        onChange={(e) => handleGeoChange("address", e.target.value)}
                                        placeholder="Ej: Estadio Nacional del Perú..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
