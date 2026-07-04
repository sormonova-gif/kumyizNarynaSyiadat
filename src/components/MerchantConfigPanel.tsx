import React, { useState } from "react";
import { Settings, Phone, Check, RefreshCw, AlertCircle } from "lucide-react";
import { MerchantConfig } from "../types";
import { Language, translations } from "../translations";

interface MerchantConfigPanelProps {
  config: MerchantConfig;
  onSave: (newConfig: MerchantConfig) => void;
  lang: Language;
}

export default function MerchantConfigPanel({ config, onSave, lang }: MerchantConfigPanelProps) {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState(config.whatsappPhone);
  const [pricePerLiter, setPricePerLiter] = useState(config.pricePerLiter);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      whatsappPhone: whatsappPhone.trim(),
      pricePerLiter: Number(pricePerLiter) || 150,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsOpen(false);
    }, 1200);
  };

  const handleReset = () => {
    setWhatsappPhone("996505111154");
    setPricePerLiter(150);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-primary-dark hover:bg-accent-lime/10 text-xs font-bold shadow-sm transition-all"
        title={t.merchantSettings}
      >
        <Settings className={`w-3.5 h-3.5 ${isOpen ? "rotate-90" : ""} transition-transform duration-300`} />
        <span>{lang === "kg" ? "Панель" : "Панель продавца"}</span>
      </button>

      {/* Dropdown Modal Container */}
      {isOpen && (
        <>
          {/* Overlay to close */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

          <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-2xl border border-gray-100 shadow-xl p-5 z-50 text-left animate-in fade-in-50 slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
              <h3 className="font-display font-extrabold text-primary-dark text-sm">
                {t.merchantSettings}
              </h3>
              <button
                onClick={handleReset}
                className="text-[10px] text-gray-400 hover:text-gray-600 font-medium flex items-center gap-0.5 transition"
                title={t.resetBtn}
              >
                <RefreshCw className="w-2.5 h-2.5" /> {t.resetBtn}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* WhatsApp Phone field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3 text-primary-dark" /> {t.whatsappPhoneLabel}
                </label>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="996505111154"
                  className="w-full bg-[#F9FAF5] border border-gray-200 focus:border-accent-lime focus:ring-2 focus:ring-accent-lime rounded-xl py-2 px-3 text-primary-dark text-xs focus:outline-none transition"
                />
                <p className="text-[9px] text-gray-400">
                  {t.whatsappPhoneHelp}
                </p>
              </div>

              {/* Price Per Liter field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  {t.pricePerLiterLabel}
                </label>
                <input
                  type="number"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(Number(e.target.value) || 0)}
                  placeholder="150"
                  min="1"
                  className="w-full bg-[#F9FAF5] border border-gray-200 focus:border-accent-lime focus:ring-2 focus:ring-accent-lime rounded-xl py-2 px-3 text-primary-dark text-xs focus:outline-none transition"
                />
              </div>

              {/* Tips */}
              <div className="bg-[#FAF8F5] border border-accent-lime/10 p-2.5 rounded-lg flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-800 leading-normal font-light">
                  {t.merchantSettingsSub}
                </p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaved}
                className={`w-full py-2.5 rounded-xl font-display font-bold text-xs transition duration-200 flex items-center justify-center gap-1.5 ${
                  isSaved
                    ? "bg-accent-lime/30 text-primary-dark font-extrabold"
                    : "bg-accent-lime text-primary-dark hover:bg-accent-lime/90 shadow-sm hover:shadow font-extrabold"
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> {t.savedBtn}
                  </>
                ) : (
                  t.saveBtn
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
