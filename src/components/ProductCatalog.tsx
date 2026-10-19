import { LOCAL_PRODUCT_MEDIA } from "../data/localProducts";
import { PRODUCT_PAGES, normalizeProductCode } from "../data/productPages";

const INTERACTIVE_CODES = new Set(["RE-3-076", "RE-3-065", "RE-1-132", "RE-2207-2", "RE0008", "RE-7-122"]);

export default function ProductCatalog({ query }: { query: string }) {
  const term = query.trim().toLocaleLowerCase();
  const products = Object.entries(PRODUCT_PAGES)
    .map(([code, href]) => ({
      code,
      href,
      media: LOCAL_PRODUCT_MEDIA.find((file) => file.productCode === code && file.fileType === "image"),
    }))
    .filter(
      (product) =>
        product.media &&
        (!term ||
          `${product.code} ${product.media.productName} ${product.media.category}`
            .toLocaleLowerCase()
            .includes(term) ||
          normalizeProductCode(product.code).includes(normalizeProductCode(term)))
    );

  return (
    <section id="library" className="mx-auto max-w-6xl scroll-mt-28 px-3 py-6 md:px-6 md:py-10">
      <h2 className="font-display text-2xl font-extrabold text-ink-950">
        استكشف المنتجات <span className="text-base text-brand-600">({products.length})</span>
      </h2>
      <p className="mb-6 mt-3 text-ink-700">
        تعرّف على كل منتج، مميزاته وطريقة استخدامه في صفحة متكاملة، واستكشف العرض التفاعلي للمنتجات.
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
        {products.map(({ code, href, media }) => {
          const interactive = INTERACTIVE_CODES.has(code);
          return (
            <a
              key={code}
              href={href}
              className="group overflow-hidden rounded-[1.15rem] border border-cream-300 bg-cream-50 shadow-card transition hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-brand-500 md:rounded-2xl"
            >
              <div className="relative aspect-square bg-white">
                <img
                  src={media!.thumbnail}
                  alt={media!.productName}
                  loading="lazy"
                  className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105 md:p-5"
                />
                {interactive && (
                  <span className="absolute end-2 top-2 rounded-full bg-brand-500 px-2 py-1 text-[9px] font-bold text-white md:end-3 md:top-3 md:px-3 md:text-xs">
                    عرض تفاعلي 360°
                  </span>
                )}
              </div>
              <div className="p-3 md:p-5">
                <span className="lat text-[11px] font-bold text-brand-600 md:text-sm">{code}</span>
                <h3 className="mt-1.5 line-clamp-2 min-h-[2.8rem] text-[14px] font-extrabold leading-6 text-ink-950 md:mt-2 md:min-h-0 md:text-lg">{media!.productName}</h3>
                <p className="mt-1 text-[11px] text-ink-500 md:mt-2 md:text-sm">{media!.category}</p>
                <span className="mt-3 block rounded-xl bg-brand-500 px-2 py-2.5 text-center text-[11px] font-extrabold text-white md:mt-5 md:px-4 md:py-3 md:text-sm">
                  اكتشف المنتج ←
                </span>
              </div>
            </a>
          );
        })}
      </div>
      {!products.length && (
        <p className="rounded-xl border border-cream-300 p-8 text-center">
          لا توجد صفحات منتجات مطابقة. جرّب اسم المنتج أو رقم الموديل.
        </p>
      )}
    </section>
  );
}
