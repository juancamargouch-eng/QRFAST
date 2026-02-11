import QRGenerator from "@/components/QRGenerator";
import { PricingSection } from "@/components/Marketing/PricingSection";
import AdBanner from "@/components/AdSense/AdBanner";

export default function Home() {
  return (
    <main className="min-h-[calc(100-5rem)] bg-slate-50 flex flex-col items-center py-12 px-4 font-sans tracking-tight">
      <QRGenerator />
      <AdBanner slot="XXXXXXXXXX1" format="auto" />
      <PricingSection />
    </main>
  );
}
