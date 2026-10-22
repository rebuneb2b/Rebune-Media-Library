import { useEffect, useRef, useState } from "react";
import type { Section } from "../data/media";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  section: Section;
  accent: string;
  fullBleed?: boolean;
};

const SLIDES: Slide[] = [
  {
    id: "winter-gif",
    eyebrow: "",
    title: "",
    subtitle: "",
    cta: "",
    image: "/media/Gif-banner.gif",
    section: "latest",
    accent: "from-white via-white to-white",
    fullBleed: true,
  },
  {
    id: "latest",
    eyebrow: "جديد المكتبة",
    title: "أحدث الملفات في مكان واحد",
    subtitle: "وصول أسرع إلى أحدث الصور والفيديوهات والمواد المضافة للمكتبة.",
    cta: "عرض أحدث الملفات",
    image: "/media/hero-main.svg",
    section: "latest",
    accent: "from-[#fff7ef] via-white to-[#fff1e5]",
  },
  {
    id: "designs",
    eyebrow: "جاهز للتسويق",
    title: "التصاميم الإعلانية بسهولة",
    subtitle: "تصفّح التصاميم الجاهزة للمنتجات والحملات من قسم واحد مرتب.",
    cta: "استعراض التصاميم",
    image: "/media/designs-banner.jpg",
    section: "designs",
    accent: "from-[#fff8f2] via-[#fffdfb] to-[#f7eee5]",
  },
  {
    id: "videos",
    eyebrow: "محتوى مرئي",
    title: "فيديوهات المنتجات أقرب لك",
    subtitle: "ابحث عن فيديو المنتج وافتحه أو حمّله مباشرة من المكتبة.",
    cta: "فتح الفيديوهات",
    image: "/media/videos-banner.jpg",
    section: "videos",
    accent: "from-[#fffaf5] via-white to-[#f3ede7]",
  },
];

export default function PromoSlider({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goTo = (index: number) => {
    const normalized = (index + SLIDES.length) % SLIDES.length;
    setActive(normalized);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 45) return;
    if (delta > 0) goTo(active - 1);
    else goTo(active + 1);
  };

  return (
    <section className="px-3 pt-3 md:px-6 md:pt-6" aria-label="بنرات المكتبة">
      <div
        className="promo-slider group relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-cream-300/80 bg-white shadow-card md:rounded-[2rem]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[210px] sm:h-[235px] md:h-[300px] lg:h-[330px]">
          {SLIDES.map((slide, index) => (
            <article
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === active
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : index < active
                    ? "pointer-events-none translate-x-[4%] opacity-0"
                    : "pointer-events-none -translate-x-[4%] opacity-0"
              }`}
              aria-hidden={index !== active}
            >
              {slide.fullBleed ? (
                <button
                  type="button"
                  onClick={() => onNavigate(slide.section)}
                  className="absolute inset-0 h-full w-full bg-[#f4f2ef]"
                  aria-label="عرض بنر جديد ريبون"
                >
                  <img
                    src={slide.image}
                    alt="بنر جديد ريبون"
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ) : (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-l ${slide.accent}`} />
                  <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_12%_20%,#e8601c_0,transparent_28%),radial-gradient(circle_at_88%_90%,#d8c6a9_0,transparent_35%)]" />

                  <div className="relative grid h-full grid-cols-[1.05fr_.95fr] items-center gap-2 px-5 py-5 sm:px-8 md:grid-cols-[1.12fr_.88fr] md:px-12 lg:px-14" dir="rtl">
                    <div className="relative z-10 max-w-[620px] text-right">
                      <span className="inline-flex rounded-full bg-white/85 px-3 py-1 text-[10px] font-extrabold text-brand-600 shadow-sm backdrop-blur md:px-4 md:py-1.5 md:text-xs">
                        {slide.eyebrow}
                      </span>
                      <h2 className="mt-2.5 text-[1.22rem] font-extrabold leading-[1.35] tracking-[-0.02em] text-ink-950 sm:text-[1.5rem] md:mt-4 md:text-[2.2rem] lg:text-[2.45rem]">
                        {slide.title}
                      </h2>
                      <p className="mt-1.5 max-w-[560px] text-[11px] font-semibold leading-5 text-ink-700 sm:text-[12px] md:mt-3 md:text-[15px] md:leading-7">
                        {slide.subtitle}
                      </p>
                      <button
                        onClick={() => onNavigate(slide.section)}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-3.5 py-2 text-[11px] font-extrabold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lift active:translate-y-0 md:mt-5 md:rounded-2xl md:px-5 md:py-3 md:text-sm"
                      >
                        {slide.cta}
                        <span aria-hidden="true" className="text-base leading-none">←</span>
                      </button>
                    </div>

                    <div className="relative flex h-full items-center justify-center overflow-hidden">
                      <div className="absolute h-[75%] w-[78%] rounded-full bg-brand-100/35 blur-3xl" />
                      <img
                        src={slide.image}
                        alt=""
                        className={`promo-slide-image relative z-10 max-h-[160px] w-full max-w-[310px] object-contain drop-shadow-[0_20px_28px_rgb(66_43_25/0.16)] sm:max-h-[185px] md:max-h-[255px] md:max-w-[420px] ${index === active ? "is-active" : ""}`}
                      />
                    </div>
                  </div>
                </>
              )}
            </article>
          ))}

          <button
            type="button"
            aria-label="البنر السابق"
            onClick={() => goTo(active - 1)}
            className="absolute start-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/80 text-xl font-bold text-ink-700 shadow-card backdrop-blur transition hover:bg-white hover:text-brand-600 md:grid"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="البنر التالي"
            onClick={() => goTo(active + 1)}
            className="absolute end-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/80 text-xl font-bold text-ink-700 shadow-card backdrop-blur transition hover:bg-white hover:text-brand-600 md:grid"
          >
            ›
          </button>
        </div>

        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1.5 shadow-sm backdrop-blur md:bottom-4">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`انتقل إلى البنر ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === index ? "w-6 bg-brand-500" : "w-1.5 bg-ink-400/45 hover:bg-ink-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
