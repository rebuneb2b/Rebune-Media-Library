import type { ReactNode } from "react";
import { type MediaFile, type Section } from "../data/media";
import { ClockIcon, ImageIcon, PlayIcon, Rotate360Icon } from "./Icons";
import { Reveal } from "./ui";

export default function SectionCards({
  section,
  onSelect,
  files: _files,
  loading: _loading,
}: {
  section: Section;
  onSelect: (s: Section) => void;
  files: MediaFile[];
  loading: boolean;
}) {
  const cards: Array<{
    key: Section;
    title: string;
    copy: string;
    icon: ReactNode;
  }> = [
    {
      key: "designs",
      title: "التصاميم",
      copy: "صور المنتجات والمواد التسويقية",
      icon: <ImageIcon width={23} height={23} />,
    },
    {
      key: "videos",
      title: "الفيديوهات",
      copy: "مقاطع الاستخدام والإعلانات",
      icon: <PlayIcon width={22} height={22} />,
    },
    {
      key: "products3d",
      title: "منتجات 3D",
      copy: "نماذج تفاعلية للمنتجات",
      icon: <Rotate360Icon width={24} height={24} />,
    },
    {
      key: "latest",
      title: "أحدث الملفات",
      copy: "كل ما أضيف مؤخرًا",
      icon: <ClockIcon width={22} height={22} />,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-3 pt-3 md:px-6 md:pt-8" aria-label="أقسام المكتبة">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
        {cards.map((card, index) => (
          <Reveal key={card.key} delay={index * 55} className="h-full">
            <button
              type="button"
              onClick={() => onSelect(card.key)}
              className={`group flex h-full min-h-[96px] w-full items-center justify-between gap-3 rounded-[1.2rem] border bg-white px-3.5 py-3.5 text-right shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift active:scale-[0.985] md:min-h-[118px] md:px-5 ${
                section === card.key
                  ? "border-brand-500 ring-2 ring-brand-500/15"
                  : "border-cream-300"
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="font-display block text-[15px] font-extrabold text-ink-950 md:text-lg">
                  {card.title}
                </span>
                <span className="mt-1.5 block text-[11px] font-semibold leading-5 text-[#a98765] md:text-xs">
                  {card.copy}
                </span>
              </span>

              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12">
                {card.icon}
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
