import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, Flame, Heart, Map, ShoppingBag, ShieldCheck } from "lucide-react";
import KumisDetails from "./components/KumisDetails";
import OrderForm from "./components/OrderForm";
import RecentOrders from "./components/RecentOrders";
import MerchantConfigPanel from "./components/MerchantConfigPanel";
import { Order, MerchantConfig } from "./types";
import { Language, translations } from "./translations";

export default function App() {
  // Load language preference from localStorage
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("naryn_kumis_lang");
      return (saved === "kg" || saved === "ru") ? saved : "ru";
    } catch (e) {
      return "ru";
    }
  });

  // Load merchant configuration from localStorage or use defaults
  const [merchantConfig, setMerchantConfig] = useState<MerchantConfig>(() => {
    try {
      const saved = localStorage.getItem("naryn_kumis_merchant_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappPhone === "+996700123456" || parsed.whatsappPhone === "996700123456") {
          parsed.whatsappPhone = "996505111154";
          localStorage.setItem("naryn_kumis_merchant_config", JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error("Error loading merchant config:", e);
    }
    return {
      whatsappPhone: "996505111154", // New default WhatsApp phone number
      pricePerLiter: 150, // Default price requested by user: 150 som
    };
  });

  // Load customer order history from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("naryn_kumis_orders");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading orders:", e);
    }
    return [];
  });

  // Show a visual success notification overlay on successful checkout
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("naryn_kumis_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("naryn_kumis_merchant_config", JSON.stringify(merchantConfig));
  }, [merchantConfig]);

  useEffect(() => {
    localStorage.setItem("naryn_kumis_orders", JSON.stringify(orders));
  }, [orders]);

  // Handle new order addition
  const handleOrderSuccess = (orderData: {
    name: string;
    phone: string;
    address: string;
    volume: 1 | 2 | 5;
    quantity: number;
    comment: string;
    totalPrice: number;
  }) => {
    const newOrder: Order = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      ...orderData,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSuccessOrder(newOrder);

    // Automatically hide success alert after 5 seconds
    setTimeout(() => {
      setSuccessOrder(null);
    }, 5000);
  };

  const handleRepeatOrder = (order: Order) => {
    // Fill the inputs in the form by scrolling and prefilling if necessary,
    // or simply populate state. For better UX, we can show a toast or scroll down
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleClearAllOrders = () => {
    const confirmMsg = lang === "kg" 
      ? "Буйрутмаларыңыздын тарыхын толугу менен өчүрүүнү каалайсызбы?" 
      : "Вы уверены, что хотите полностью очистить историю ваших заказов?";
    if (confirm(confirmMsg)) {
      setOrders([]);
    }
  };

  const scrollToOrderForm = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#F9FAF5] text-primary-dark font-sans selection:bg-accent-lime/30 selection:text-primary-dark overflow-x-hidden">
      {/* Visual background decorations - blurred organic shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-lime/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-accent-lime/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 bg-[#F9FAF5]/95 backdrop-blur-md border-b border-gray-100 z-30 transition">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce" role="img" aria-label="Kumis leaf">🥛</span>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-primary-dark italic">
                {t.brandName}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-accent-lime/25 to-accent-lime/10 text-primary-dark text-[9px] font-black uppercase tracking-widest rounded border border-accent-lime/40 shadow-sm leading-none">
                  <span className="text-[10px] select-none" role="img" aria-label="mountain">🏔️</span>
                  {t.brandSub}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex bg-gray-100 p-0.5 rounded-full border border-gray-200 shadow-inner mr-1">
              <button
                onClick={() => setLang("ru")}
                className={`px-2.5 py-1 text-[10px] font-black rounded-full transition-all duration-200 ${
                  lang === "ru"
                    ? "bg-primary-dark text-white shadow-sm"
                    : "text-gray-500 hover:text-primary-dark"
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLang("kg")}
                className={`px-2.5 py-1 text-[10px] font-black rounded-full transition-all duration-200 ${
                  lang === "kg"
                    ? "bg-primary-dark text-white shadow-sm"
                    : "text-gray-500 hover:text-primary-dark"
                }`}
              >
                KG
              </button>
            </div>

            {/* Merchant custom panel to change configuration */}
            <MerchantConfigPanel config={merchantConfig} onSave={setMerchantConfig} lang={lang} />
            <button
              onClick={scrollToOrderForm}
              className="px-4 py-2 bg-accent-lime hover:bg-accent-lime/90 text-primary-dark text-xs font-display font-extrabold rounded-full shadow-sm transition flex items-center gap-1.5 uppercase tracking-wider"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.orderBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 space-y-16">
        {/* Hero & Kumis Details Card */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-sm">
          <KumisDetails pricePerLiter={merchantConfig.pricePerLiter} onOrderClick={scrollToOrderForm} lang={lang} />
        </section>

        {/* Informative Grid detailing Kyrgyz traditions */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs text-primary-dark font-extrabold uppercase tracking-widest bg-accent-lime px-3 py-1 rounded-full">
              {t.whyUsBadge}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-dark leading-tight italic">
              {t.whyUsTitle}
            </h2>
            <p className="text-gray-500 text-sm font-light">
              {t.whyUsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-3 shadow-sm hover:border-accent-lime/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-accent-lime/10 flex items-center justify-center">
                <span className="text-xl">🏔️</span>
              </div>
              <h3 className="font-display font-bold text-base text-primary-dark">
                {t.whyUsCard1Title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t.whyUsCard1Desc}
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-3 shadow-sm hover:border-accent-lime/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-accent-lime/10 flex items-center justify-center">
                <span className="text-xl">🥛</span>
              </div>
              <h3 className="font-display font-bold text-base text-primary-dark">
                {t.whyUsCard2Title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t.whyUsCard2Desc}
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-3 shadow-sm hover:border-accent-lime/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-accent-lime/10 flex items-center justify-center">
                <span className="text-xl">❤️</span>
              </div>
              <h3 className="font-display font-bold text-base text-primary-dark">
                {t.whyUsCard3Title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t.whyUsCard3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Order Area & History Side by Side */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Form (Main Area) */}
          <div className="lg:col-span-7">
            <OrderForm
              pricePerLiter={merchantConfig.pricePerLiter}
              merchantPhone={merchantConfig.whatsappPhone}
              lang={lang}
              onOrderSuccess={handleOrderSuccess}
            />
          </div>

          {/* Side Info Panel & History */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Quick Delivery Note Card */}
            <div className="bg-gradient-to-br from-primary-dark via-primary-dark to-accent-lime/40 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl border border-white/10">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 blur-lg"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-accent-lime text-primary-dark rounded-lg text-xs font-bold tracking-wider uppercase">
                    {t.deliveryBadge}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-extrabold italic">{t.deliveryTitle}</h3>
                <ul className="space-y-2.5 text-xs text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-lime mt-0.5">✔</span>
                    <span>{t.deliveryRule1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-lime mt-0.5">✔</span>
                    <span>{t.deliveryRule2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-lime mt-0.5">✔</span>
                    <span>{t.deliveryRule3}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Previous Order History on the Client Device */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md">
              <RecentOrders
                orders={orders}
                onRepeatOrder={handleRepeatOrder}
                onDeleteOrder={handleDeleteOrder}
                onClearAll={handleClearAllOrders}
                lang={lang}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Success Modal / Notification Overlay */}
      <AnimatePresence>
        {successOrder && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-primary-dark text-white rounded-2xl shadow-2xl border border-accent-lime/30 p-5 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-lime/20 flex items-center justify-center text-accent-lime shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm">{t.successTitle}</h4>
                <p className="text-xs text-gray-300">{t.successSubtitle}</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-3 text-xs space-y-1">
              <div><span className="text-gray-400">{t.historyName}:</span> {successOrder.name}</div>
              <div><span className="text-gray-400">{t.waVolume}:</span> {successOrder.volume * successOrder.quantity} {t.historyLitersSuffix}</div>
              <div><span className="text-gray-400">{t.historyTotal}:</span> <span className="text-accent-lime font-bold">{successOrder.totalPrice} {t.priceLabel}</span></div>
            </div>

            <button
              onClick={() => setSuccessOrder(null)}
              className="text-xs text-center text-gray-400 hover:text-white transition py-1 hover:underline font-medium"
            >
              {t.successClose}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-primary-dark text-white/70 py-12 mt-16 border-t border-accent-lime/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 justify-between items-center text-center md:text-left">
          <div className="space-y-1.5">
            <h3 className="font-display font-extrabold text-white text-lg">🥛 {t.footerTitle}</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              {t.footerSubtitle}
            </p>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p>© {new Date().getFullYear()} {t.footerCopyright}</p>
            <p>{t.footerTradition}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
