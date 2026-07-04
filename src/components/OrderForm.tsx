import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Phone, MapPin, MessageSquare, ShoppingBag, Plus, Minus, Send, Check } from "lucide-react";
import { Language, translations } from "../translations";

interface OrderFormProps {
  pricePerLiter: number;
  merchantPhone: string;
  lang: Language;
  onOrderSuccess: (orderData: {
    name: string;
    phone: string;
    address: string;
    volume: 1 | 2 | 5;
    quantity: number;
    comment: string;
    totalPrice: number;
  }) => void;
}

export default function OrderForm({ pricePerLiter, merchantPhone, lang, onOrderSuccess }: OrderFormProps) {
  const t = translations[lang];

  // Form fields state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [volume, setVolume] = useState<1 | 2 | 5>(2); // Default to 2 liters
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate dynamic pricing
  const itemPrice = pricePerLiter * volume;
  const totalPrice = itemPrice * quantity;

  // Kyrgyzstan phone auto-format helper (optional helper)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Keep digits and '+'
    value = value.replace(/[^0-9+ ]/g, "");
    setPhone(value);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = t.errName;
    }
    if (!phone.trim()) {
      newErrors.phone = t.errPhone;
    } else if (phone.trim().length < 8) {
      newErrors.phone = t.errPhone;
    }
    if (!address.trim()) {
      newErrors.address = t.errAddress;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Prepare order data
    const orderData = {
      name,
      phone,
      address,
      volume,
      quantity,
      comment,
      totalPrice,
    };

    // Simulate short processing before WhatsApp redirection
    setTimeout(() => {
      onOrderSuccess(orderData);
      setIsSubmitting(false);

      // Clean phone number from merchantConfig for WhatsApp API (digits only, keep leading + if present)
      const cleanMerchantPhone = merchantPhone.replace(/[^0-9]/g, "");

      // Format WhatsApp Message
      const totalVolume = volume * quantity;
      const messageText = `${t.waGreeting}

📋 *${t.waDetails}:*
• *${t.waName}:* ${name.trim()}
• *${t.waPhone}:* ${phone.trim()}
• *${t.waAddress}:* ${address.trim()}
• *${t.waVolume}:* ${volume === 1 ? t.volume1L : volume === 2 ? t.volume2L : t.volume5L}
• *${t.waQty}:* ${quantity} ${t.historyQtySuffix} (${totalVolume} ${t.historyLitersSuffix})
• *${t.waTotal}:* *${totalPrice} ${t.priceLabel}*

${comment.trim() ? `💬 *${t.waComment}:* ${comment.trim()}\n` : ""}
_Заказ оформлен через сайт «Кумыс из Нарына»_`;

      // Construct WhatsApp URL
      // Use wa.me with clean number
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanMerchantPhone}&text=${encodeURIComponent(messageText)}`;

      // Open WhatsApp in new tab or window redirection
      window.open(whatsappUrl, "_blank");
    }, 800);
  };

  const incrementQty = () => setQuantity((q) => Math.min(q + 1, 50));
  const decrementQty = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div id="order-section" className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Form Header */}
      <div className="bg-primary-dark px-6 py-6 md:px-8 md:py-8 text-white relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <ShoppingBag className="w-5 h-5 text-accent-lime" />
            </span>
            <span className="text-accent-lime text-xs font-bold uppercase tracking-widest">
              {t.formBadge}
            </span>
          </div>
          <h2 className="text-3xl font-display font-extrabold">
            {t.formTitle}
          </h2>
          <p className="text-white/80 text-xs md:text-sm font-light">
            {t.formSubtitle}
          </p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Name & Phone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              {t.labelName} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder={lang === "kg" ? "Азамат" : "Азамат"}
                className={`w-full px-4 py-3 bg-white border ${
                  errors.name ? "border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:ring-accent-lime"
                } rounded-2xl outline-none focus:ring-2 transition-all text-sm text-gray-950`}
              />
            </div>
            {errors.name && (
              <p className="text-rose-500 text-xs font-medium flex items-center gap-1 animate-pulse">
                <span>⚠️</span> {errors.name}
              </p>
            )}
          </div>

          {/* Phone Input */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              {t.labelPhone} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+996 (___) __-__-__"
                className={`w-full px-4 py-3 bg-white border ${
                  errors.phone ? "border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:ring-accent-lime"
                } rounded-2xl outline-none focus:ring-2 transition-all text-sm text-gray-950`}
              />
            </div>
            {errors.phone && (
              <p className="text-rose-500 text-xs font-medium flex items-center gap-1 animate-pulse">
                <span>⚠️</span> {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Address Input */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            {t.labelAddress} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
              }}
              placeholder={t.placeholderAddress}
              className={`w-full px-4 py-3 bg-white border ${
                errors.address ? "border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:ring-accent-lime"
              } rounded-2xl outline-none focus:ring-2 transition-all text-sm text-gray-950`}
            />
          </div>
          {errors.address && (
            <p className="text-rose-500 text-xs font-medium flex items-center gap-1 animate-pulse">
              <span>⚠️</span> {errors.address}
            </p>
          )}
        </div>

        {/* Volume Selector - Peer checked look matching Vibrant theme style */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            {t.labelVolume} <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 1 L Option */}
            <div
              onClick={() => setVolume(1)}
              className={`flex-1 text-center py-4 border-2 rounded-2xl cursor-pointer font-bold transition-all relative overflow-hidden flex flex-col justify-between ${
                volume === 1
                  ? "bg-accent-lime border-accent-lime text-primary-dark shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${volume === 1 ? "text-primary-dark/70" : "text-gray-400"}`}>{t.volumeBottle}</span>
                <span className="text-lg font-display font-extrabold">{t.volume1L}</span>
              </div>
              <div className="mt-2 text-xs font-bold">
                {pricePerLiter * 1} {t.priceLabel}
              </div>
            </div>

            {/* 2 L Option */}
            <div
              onClick={() => setVolume(2)}
              className={`flex-1 text-center py-4 border-2 rounded-2xl cursor-pointer font-bold transition-all relative overflow-hidden flex flex-col justify-between ${
                volume === 2
                  ? "bg-accent-lime border-accent-lime text-primary-dark shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              <div className="absolute top-1 right-2 bg-primary-dark/10 text-primary-dark px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide">
                {t.tagPopular}
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${volume === 2 ? "text-primary-dark/70" : "text-gray-400"}`}>{t.volumeBottle}</span>
                <span className="text-lg font-display font-extrabold">{t.volume2L}</span>
              </div>
              <div className="mt-2 text-xs font-bold">
                {pricePerLiter * 2} {t.priceLabel}
              </div>
            </div>

            {/* 5 L Option */}
            <div
              onClick={() => setVolume(5)}
              className={`flex-1 text-center py-4 border-2 rounded-2xl cursor-pointer font-bold transition-all relative overflow-hidden flex flex-col justify-between ${
                volume === 5
                  ? "bg-accent-lime border-accent-lime text-primary-dark shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
              }`}
            >
              <div className="absolute top-1 right-2 bg-primary-dark/10 text-primary-dark px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide">
                {t.tagValue}
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${volume === 5 ? "text-primary-dark/70" : "text-gray-400"}`}>{t.volumeCanister}</span>
                <span className="text-lg font-display font-extrabold">{t.volume5L}</span>
              </div>
              <div className="mt-2 text-xs font-bold">
                {pricePerLiter * 5} {t.priceLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Picker & Summary */}
        <div className="bg-[#FAF8F5] border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 justify-between items-center">
          {/* Quantity Selector */}
          <div className="space-y-1.5 w-full sm:w-auto text-center sm:text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t.labelQty}
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
              <button
                type="button"
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-display font-black text-primary-dark w-10 text-center select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                disabled={quantity >= 50}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-40 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pricing Calc Summary */}
          <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t.labelTotalVolume}: <strong className="text-primary-dark font-black">{volume * quantity} {t.historyLitersSuffix}</strong>
            </span>
            <span className="text-xs text-gray-400 block mt-0.5">{t.labelTotalPay}:</span>
            <div className="text-3xl font-display font-black text-primary-dark tracking-tight">
              {totalPrice} {t.priceLabel}
            </div>
          </div>
        </div>

        {/* Comment Field */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            {t.labelComment}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={t.placeholderComment}
            className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-accent-lime rounded-2xl outline-none transition-all h-24 resize-none text-sm text-gray-950"
          />
        </div>

        {/* Form Actions - Button "Заказать через WhatsApp" */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer text-sm tracking-wide uppercase"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {/* Custom styled WhatsApp Svg icon */}
              <svg
                className="w-6 h-6 fill-current text-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.43.001 9.85-4.417 9.854-9.848.002-5.43-4.416-9.848-9.846-9.849-5.431 0-9.85 4.417-9.853 9.848-.001 2.046.549 3.551 1.621 5.321l-1.012 3.701 3.92-1.015z" />
              </svg>
              <span>{t.submitBtn}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
