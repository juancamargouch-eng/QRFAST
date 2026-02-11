import { DotType, CornerSquareType, CornerDotType, GradientType } from "qr-code-styling";

export type ContentType = "url" | "vcard" | "geo" | "wifi" | "whatsapp" | "event";
export type GeoMode = "coords" | "address";

export type VCardData = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    organization: string;
    title: string;
};

export type GeoData = {
    lat: string;
    lng: string;
    address: string;
};

export type WifiData = {
    ssid: string;
    password: string;
    encryption: "WPA" | "WEP" | "nopass";
    hidden: boolean;
};

export type WhatsAppData = {
    phone: string;
    message: string;
};

export type EventData = {
    title: string;
    location: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
};

export type FrameStyle = "none" | "smooth" | "retro" | "industrial";

export type QRStyles = {
    contentType: ContentType;
    geoMode: GeoMode;
    url: string;
    vcard: VCardData;
    geo: GeoData;
    wifi: WifiData;
    whatsapp: WhatsAppData;
    event: EventData;
    // Estética de puntos
    colorDots: string;
    colorDotsSecondary: string;
    isGradient: boolean;
    gradientType: GradientType;
    gradientRotation: number;
    dotStyle: DotType;
    // Estética de esquinas
    cornerSquareStyle: CornerSquareType;
    cornerDotStyle: CornerDotType;
    colorCornersSquare: string;
    colorCornersDot: string;
    // Fondo y Logo
    colorBackground: string;
    logoUrl: string;
    logoSize: number;
    logoMargin: number;
    // Marcos y Etiquetas
    frameStyle: FrameStyle;
    frameColor: string;
    frameText: string;
    frameTextColor: string;
    // Exportación
    resolution: number;
    // SaaS Features
    isDynamic: boolean;
    dynamicShortCode?: string;
};

export const INITIAL_OPTIONS: QRStyles = {
    contentType: "url",
    geoMode: "coords",
    url: "https://google.com",
    vcard: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        organization: "",
        title: "",
    },
    geo: {
        lat: "",
        lng: "",
        address: "",
    },
    wifi: {
        ssid: "",
        password: "",
        encryption: "WPA",
        hidden: false,
    },
    whatsapp: {
        phone: "",
        message: "Hola, me interesa tu servicio",
    },
    event: {
        title: "",
        location: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
    },
    colorDots: "#0f172a",
    colorDotsSecondary: "#3b82f6",
    isGradient: false,
    gradientType: "linear",
    gradientRotation: 0,
    dotStyle: "square",
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
    colorCornersSquare: "#0f172a",
    colorCornersDot: "#0f172a",
    colorBackground: "#ffffff",
    logoUrl: "",
    logoSize: 0.3,
    logoMargin: 10,
    // Marcos y Etiquetas
    frameStyle: "none",
    frameColor: "#0f172a",
    frameText: "ESCANEAME",
    frameTextColor: "#ffffff",
    // Ultra Features
    resolution: 2, // 1000px aprox (pixelRatio * 500)
    // SaaS Features
    isDynamic: false,
};
