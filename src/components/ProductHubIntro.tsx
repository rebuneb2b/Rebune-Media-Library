import { useMemo, type ReactNode } from "react";
import type { ProductGroup, Section } from "../data/media";
import { ClockIcon, ImageIcon, PlayIcon, Rotate360Icon, SearchIcon, SparkIcon } from "./Icons";

const QUICK: Array<{
  key: Section;
  title: string;
  sub: string;
  icon: ReactNode;
}> = [
  { key: "designs", title: "التصاميم", sub: "صور المنتجات والمواد التسويقية", icon: <ImageIcon width={24} height={24} /> },
  { key: "videos", title: "الفيديوهات", sub: "مقاطع الاستخدام والإعلانات", icon: <PlayIcon width={23} height={23} /> },
  { key: "products3d", title: "منتجات 3D", sub: "نماذج تفاعلية للمنتجات", icon: <Rotate360Icon width={26} height={26} /> },
  { key: "latest", title: "أحدث الملفات", sub: "كل ما أضيف مؤخرًا", icon: <ClockIcon width={24} height={24} /> },
];

function ProductTile({ product, onOpen }: { product: ProductGroup; onOpen: (code: string) => void }) {
  const visual = product.files.find((f) => f.fileType !== "3d" && f.thumbnail);
  return (
    <button
      type="button"
      onClick={() => onOpen(product.code)}
      className="group min-w-0 overflow-hidden rounded-2xl border border-cream-300/80 bg-cream-50 text-start shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
    >
      <span className="block aspect-[4/3] overflow-hidden bg-white">
        {visual ? (
          <img src={visual.thumbnail} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="grid h-full place-items-center bg-brand-50 text-brand-500"><Rotate360Icon width={34} height={34} /></span>
        )}
      </span>
      <span className="block p-3.5">
        <span className="lat block text-[11px] font-extrabold text-brand-600">{product.code}</span>
        <span className="mt-1 block truncate text-sm font-extrabold text-ink-950">{product.name}</span>
        <span className="mt-1 block text-[10px] font-bold text-ink-400">{product.files.length} ملفات</span>
      </span>
    </button>
  );
}

export default function ProductHubIntro({
  query,
  onQuery,
  products,
  onOpenProduct,
  onNavigate,
}: {
  query: string;
  onQuery: (value: string) => void;
  products: ProductGroup[];
  onOpenProduct: (code: string) => void;
  onNavigate: (section: Section) => void;
}) {
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => `${p.code} ${p.name}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [products, query]);

  const recent = products.slice(0, 6);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-10">
        <div className="relative overflow-visible rounded-[1.75rem] border border-cream-300/70 bg-cream-50/80 px-5 py-7 shadow-card md:px-9 md:py-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]" aria-hidden="true">
            <div className="absolute -end-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
            <div className="absolute -bottom-20 start-16 h-52 w-52 rounded-full bg-cream-400/25 blur-2xl" />
          </div>

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-700">
              <SparkIcon width={14} height={14} /> مكتبة ريبون
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink-950 md:text-5xl">
              كل ما تحتاجه عن منتجك
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-ink-700 md:text-base">
              ابحث برقم المنتج أو الاسم، ثم افتح صفحة واحدة تجمع التصاميم والفيديوهات وملفات 3D.
            </p>

            <div className="relative mt-6 max-w-2xl">
              <div className="flex h-15 items-center gap-2 rounded-2xl border border-cream-300 bg-white p-1.5 shadow-lift md:h-16">
                <SearchIcon className="ms-3 shrink-0 text-ink-400" width={21} height={21} />
                <input
                  id="product-search"
                  type="search"
                  value={query}
                  onChange={(e) => onQuery(e.target.value)}
                  placeholder="ابحث برقم المنتج، مثال: RE-1-132"
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm font-bold text-ink-950 outline-none placeholder:font-semibold placeholder:text-ink-400 md:text-base"
                />
                <button type="button" onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })} className="grid h-11 w-12 shrink-0 place-items-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 active:scale-95 md:h-12 md:w-14" aria-label="بحث">
                  <SearchIcon width={21} height={21} />
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-cream-300 bg-white p-2 shadow-lift">
                  {suggestions.map((p) => {
                    const visual = p.files.find((f) => f.fileType !== "3d" && f.thumbnail);
                    return (
                      <button key={p.code} type="button" onClick={() => onOpenProduct(p.code)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition hover:bg-cream-100">
                        <span className="h-12 w-14 shrink-0 overflow-hidden rounded-lg border border-cream-200 bg-cream-50">
                          {visual && <img src={visual.thumbnail} alt="" className="h-full w-full object-contain p-1" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="lat block text-xs font-extrabold text-brand-600">{p.code}</span>
                          <span className="block truncate text-sm font-bold text-ink-900">{p.name}</span>
                        </span>
                        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold text-ink-500">{p.files.length} ملفات</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-5 max-w-6xl px-4 md:mt-7 md:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK.map((item) => (
            <button key={item.key} type="button" onClick={() => onNavigate(item.key)} className="group flex min-h-28 items-center gap-3 rounded-2xl border border-cream-300/80 bg-cream-50 p-4 text-start shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift md:p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">{item.icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-ink-950 md:text-base">{item.title}</span>
                <span className="mt-1 hidden text-[11px] font-semibold leading-5 text-ink-500 sm:block">{item.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto mt-8 max-w-6xl px-4 md:mt-10 md:px-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-brand-600">وصول سريع</p>
              <h2 className="mt-1 font-display text-xl font-extrabold text-ink-950 md:text-2xl">أحدث المنتجات</h2>
            </div>
            <button type="button" onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })} className="text-xs font-extrabold text-brand-600 hover:text-brand-700">عرض الكل</button>
          </div>
          <div className="no-scrollbar grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {recent.map((p) => <ProductTile key={p.code} product={p} onOpen={onOpenProduct} />)}
          </div>
        </section>
      )}
    </>
  );
}
