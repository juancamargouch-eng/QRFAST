import { QRStyles } from "./types";

export const generateQRData = (options: QRStyles): string => {
    if (options.contentType === "url") {
        return options.url || " ";
    } else if (options.contentType === "vcard") {
        const vcard = options.vcard;
        return `BEGIN:VCARD
VERSION:3.0
FN:${vcard.firstName} ${vcard.lastName}
N:${vcard.lastName};${vcard.firstName};;;
ORG:${vcard.organization}
TITLE:${vcard.title}
TEL;TYPE=CELL:${vcard.phone}
EMAIL:${vcard.email}
END:VCARD`;
    } else if (options.contentType === "wifi") {
        const { ssid, password, encryption, hidden } = options.wifi;
        return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;
    } else if (options.contentType === "whatsapp") {
        const { phone, message } = options.whatsapp;
        const cleanPhone = phone.replace(/\D/g, "");
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    } else if (options.contentType === "event") {
        const { title, location, description, startDate, startTime, endDate, endTime } = options.event;
        const startStr = `${(startDate || '20260101').replace(/-/g, "")}T${(startTime || '1200').replace(/:/g, "")}00`;
        const endStr = `${(endDate || '20260101').replace(/-/g, "")}T${(endTime || '1300').replace(/:/g, "")}00`;
        return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${description}
DTSTART:${startStr}
DTEND:${endStr}
END:VEVENT
END:VCALENDAR`;
    } else {
        if (options.geoMode === "coords") {
            const { lat, lng } = options.geo;
            if (!lat || !lng) return " ";
            return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        } else {
            const { address } = options.geo;
            if (!address) return " ";
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        }
    }
};

export const formatColorHex = (color: string): string => {
    return color.toUpperCase();
};
