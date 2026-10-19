import { LOCAL_PRODUCT_MEDIA } from "../data/localProducts";
import { PRODUCT_PAGES, normalizeProductCode } from "../data/productPages";

export default function ProductCatalog({ query }: { query: string }) {
  const term = query.trim().toLocaleLowerCase();
  const products = Object.entries(PRODUCT_PAGES).map(([code, href]) => ({
    code, href, media: LOCAL_PRODUCT_MEDIA.find(file => file.productCode === code && file.fileType === "image"),
  })).filter(product => product.media && (!term || `${product.code} ${product.media.productName} ${product.media.category}`.toLocaleLowerCase().includes(term) || normalizeProductCode(product.code).includes(normalizeProductCode(term))));
  return <section id="library" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-10 md:px-6">
    <h2 className="font-display text-2xl font-extrabold text-ink-950">استكشف المنتجات <span className="text-base text-brand-600">({products.length})</span></h2>
    <p className="mb-6 mt-3 text-ink-700">تعرّف على كل منتج، مميزاته وطريقة استخدامه في صفحة متكاملة، واستكشف العرض ثلاثي الأبعاد عند توفره.</p>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map(({code, href, media}) => <a key={code} href={href} className="group overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-card transition hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-brand-500">
        <div className="relative aspect-square bg-white"><img src={media!.thumbnail} alt={media!.productName} loading="lazy" className="h-full w-full object-contain p-5 transition-transform group-hover:scale-105" />{["RE-3-065", "RE-2207-2", "RE-1-132"].includes(code) && <span className="absolute end-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">عرض تفاعلي 360°</span>}</div>
        <div className="p-5"><span className="lat text-sm font-bold text-brand-600">{code}</span><h3 className="mt-2 text-lg font-extrabold text-ink-950">{media!.productName}</h3><p className="mt-2 text-sm text-ink-500">{media!.category}</p><span className="mt-5 block rounded-xl bg-brand-500 px-4 py-3 text-center text-sm font-extrabold text-white">اكتشف المنتج ←</span></div>
      </a>)}
    </div>
    {!products.length && <p className="rounded-xl border border-cream-300 p-8 text-center">لا توجد صفحات منتجات مطابقة. جرّب اسم المنتج أو رقم الموديل.</p>}
  </section>;
}
