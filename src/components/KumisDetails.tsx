import { motion } from "motion/react";
import { Mountain, Droplets, ShieldCheck, Sparkles, Flame, CheckCircle2 } from "lucide-react";
import kumisImg from "../assets/images/naryn_kumis_1783182392962.jpg";
import { Language, translations } from "../translations";

interface KumisDetailsProps {
  pricePerLiter: number;
  onOrderClick: () => void;
  lang: Language;
}

export default function KumisDetails({ pricePerLiter, onOrderClick, lang }: KumisDetailsProps) {
  const t = translations[lang];

  const highlights = [
    {
      icon: <Mountain className="w-5 h-5 text-primary-dark" />,
      title: t.highlight1Title,
      desc: t.highlight1Desc,
    },
    {
      icon: <Droplets className="w-5 h-5 text-primary-dark" />,
      title: t.highlight2Title,
      desc: t.highlight2Desc,
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary-dark" />,
      title: t.highlight3Title,
      desc: t.highlight3Desc,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Photo Column */}
      <motion.div
        className="lg:col-span-5 relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute -inset-1.5 bg-gradient-to-r from-accent-lime/20 to-primary-dark/10 rounded-3xl blur-md group-hover:blur-xl transition duration-500 opacity-75"></div>
        <div className="relative overflow-hidden rounded-2xl border border-accent-lime/20 shadow-xl bg-white p-2">
          <img
            src={kumisImg}
            alt="Настоящий Нарынский Кумыс"
            className="w-full h-auto aspect-[4/3] object-cover rounded-xl transform hover:scale-[1.02] transition duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-primary-dark/95 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 border border-accent-lime/30 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-accent-lime animate-pulse" />
            <span>{t.brandSub}</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-primary-dark px-4 py-2 rounded-xl text-sm font-semibold shadow-lg border border-accent-lime/20 flex items-center gap-1">
            <span className="text-accent-lime-light font-black text-xl bg-primary-dark px-2 py-0.5 rounded-lg mr-1">{pricePerLiter} {t.priceLabel}</span>
            <span className="text-xs text-gray-500 font-normal">/ {t.perLiter}</span>
          </div>
        </div>
      </motion.div>

      {/* Description Column */}
      <motion.div
        className="lg:col-span-7 flex flex-col space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 bg-accent-lime text-primary-dark text-xs font-bold uppercase tracking-widest rounded-full mb-2">
            {t.premiumQuality}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-primary-dark leading-none tracking-tight italic">
            {t.kumisTitle}
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-700">
            {t.kumisSubtitle}
          </p>
        </div>

        <p className="text-gray-600 leading-relaxed text-sm md:text-base font-light">
          {t.kumisDescription}
        </p>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-accent-lime/30 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
            >
              <div className="bg-accent-lime/20 p-2 rounded-lg inline-block mb-3">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-primary-dark text-sm mb-1.5">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Quick Check */}
        <div className="bg-[#FAF8F5] border border-accent-lime/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {t.benefitsTitle}
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-lime" /> {t.benefitDigestion}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-lime" /> {t.benefitImmunity}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-lime" /> {t.benefitVigor}
              </span>
            </div>
          </div>
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto px-6 py-3.5 bg-accent-lime hover:bg-accent-lime/90 text-primary-dark font-display font-bold rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            <Flame className="w-4 h-4 text-primary-dark fill-primary-dark" />
            {t.orderNow}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
