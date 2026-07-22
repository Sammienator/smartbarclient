import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, BellRing, PackageSearch, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    icon: Zap,
    accent: "amber",
    title: "Orders, instantly",
    text: "The moment a guest taps \"Place order\", the right station sees it — no tickets, no shouting across the room.",
  },
  {
    icon: BellRing,
    accent: "copper",
    title: "Kitchen & bar in sync",
    text: "Food and drinks route to the right screen automatically, so every order reaches the person making it.",
  },
  {
    icon: PackageSearch,
    accent: "electric",
    title: "Stock that watches itself",
    text: "Low-stock alerts and live availability mean guests never order something you've already run out of.",
  },
  {
    icon: Smartphone,
    accent: "moss",
    title: "No app to download",
    text: "Guests order from their own phone in the browser — pick a table, browse the menu, done.",
  },
];

const ACCENT_STYLES = {
  amber: { wrap: "bg-amber/20 text-amber-deep", stripe: "bg-amber" },
  copper: { wrap: "bg-copper/15 text-copper", stripe: "bg-copper" },
  electric: { wrap: "bg-electric/15 text-electric", stripe: "bg-electric" },
  moss: { wrap: "bg-moss/20 text-moss-deep", stripe: "bg-moss" },
};

// A lightweight, self-contained carousel highlighting the benefits of the
// Smart Bar system. No external images are used - each "slide" pairs an
// icon-led illustration panel with a short benefit statement, in keeping
// with the app's flat-color sticker/graffiti visual language.
export default function BenefitsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  function go(delta) {
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);
  }

  const slide = SLIDES[index];
  const Icon = slide.icon;
  const styles = ACCENT_STYLES[slide.accent];

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 mb-10">
      <div className="relative bg-white dark:bg-ink-soft rounded-2xl border-3 border-ink dark:border-ink-line shadow-pop overflow-hidden">
        <div className={`absolute top-0 left-0 h-1.5 w-full ${styles.stripe}`} aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6 px-6 sm:px-8 py-8"
          >
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-ink dark:border-ink-line flex items-center justify-center shrink-0 ${styles.wrap}`}
              aria-hidden="true"
            >
              <Icon size={40} strokeWidth={1.75} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-display font-bold text-lg text-ink dark:text-paper mb-1.5">
                {slide.title}
              </h3>
              <p className="text-ink/55 dark:text-paper/55 text-sm leading-snug">{slide.text}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => go(-1)}
          aria-label="Previous benefit"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center bg-paper/80 dark:bg-ink/60 border-2 border-ink dark:border-ink-line text-ink dark:text-paper hover:bg-amber transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next benefit"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center bg-paper/80 dark:bg-ink/60 border-2 border-ink dark:border-ink-line text-ink dark:text-paper hover:bg-amber transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all border border-ink dark:border-ink-line ${
              i === index ? "w-6 bg-ink dark:bg-paper" : "w-2 bg-ink/20 dark:bg-paper/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
