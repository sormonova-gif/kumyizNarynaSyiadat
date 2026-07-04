import { motion } from "motion/react";
import { Clock, CheckCircle2, Copy, Repeat, Trash2, Box } from "lucide-react";
import { Order } from "../types";
import { Language, translations } from "../translations";

interface RecentOrdersProps {
  orders: Order[];
  onRepeatOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onClearAll: () => void;
  lang: Language;
}

export default function RecentOrders({ orders, onRepeatOrder, onDeleteOrder, onClearAll, lang }: RecentOrdersProps) {
  const t = translations[lang];

  if (orders.length === 0) {
    return (
      <div className="bg-[#F9FAF5] border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
        <Box className="w-8 h-8 mx-auto text-gray-300 mb-2.5" />
        <p className="text-sm font-semibold text-primary-dark">{t.historyEmpty}</p>
        <p className="text-xs mt-1 text-gray-500">{t.historyEmptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary-dark uppercase tracking-wider">
          <Clock className="w-4 h-4 text-primary-dark" />
          <span>{t.historyTitle} ({orders.length})</span>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold transition hover:underline"
        >
          {t.historyClear}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
        {orders.map((order) => (
          <motion.div
            layoutId={order.id}
            key={order.id}
            className="bg-white border border-gray-100 hover:border-accent-lime/30 rounded-xl p-4 shadow-sm hover:shadow transition duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Order Meta Info */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] text-gray-400 font-mono">
                  {new Date(order.timestamp).toLocaleString(lang === "kg" ? "ky-KG" : "ru-RU", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="bg-accent-lime/20 text-primary-dark px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {t.historySent}
                </span>
              </div>

              {/* Product Info */}
              <h4 className="font-display font-bold text-primary-dark text-sm">
                {lang === "kg" ? (
                  <>Кымыз {order.volume}л × {order.quantity} {t.historyQtySuffix} ({order.volume * order.quantity} {t.historyLitersSuffix})</>
                ) : (
                  <>Кумыс {order.volume}л × {order.quantity} {t.historyQtySuffix} ({order.volume * order.quantity} {t.historyLitersSuffix})</>
                )}
              </h4>
              <p className="text-xs text-primary-dark/80 font-bold mt-0.5">
                {t.historyTotal}: {order.totalPrice} {t.priceLabel}
              </p>

              {/* Delivery info */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1 text-[11px] text-gray-500">
                <div>
                  <strong className="text-gray-700 font-semibold">{t.historyName}:</strong> {order.name}
                </div>
                <div>
                  <strong className="text-gray-700 font-semibold">{t.historyAddress}:</strong> {order.address}
                </div>
                {order.comment && (
                  <div className="italic text-gray-400 mt-1 pl-1 border-l-2 border-accent-lime/30">
                    «{order.comment}»
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-2.5 border-t border-gray-100">
              <button
                onClick={() => onDeleteOrder(order.id)}
                className="p-1.5 text-gray-300 hover:text-rose-500 rounded-lg transition"
                title={lang === "kg" ? "Тарыхтан өчүрүү" : "Удалить из истории"}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onRepeatOrder(order)}
                className="px-3 py-1.5 text-xs bg-accent-lime/10 hover:bg-accent-lime text-primary-dark font-bold rounded-lg transition flex items-center gap-1"
              >
                <Repeat className="w-3 h-3" />
                <span>{t.historyRepeat}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
