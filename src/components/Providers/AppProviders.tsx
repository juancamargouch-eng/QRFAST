"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { NextAuthProvider } from "@/components/Providers/NextAuthProvider";
import { Toaster } from "sonner";
import { Header } from "@/components/QRGenerator/Header";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthProvider>
            <PayPalScriptProvider options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
                currency: "USD",
                intent: "capture"
            }}>
                <Toaster position="top-right" richColors closeButton />
                <Header />
                <div className="pt-20">
                    {children}
                </div>
            </PayPalScriptProvider>
        </NextAuthProvider>
    );
}
