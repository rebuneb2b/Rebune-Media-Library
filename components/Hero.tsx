import { groupByProduct, type MediaFile } from "../data/media";
import { SearchIcon, XIcon } from "./Icons";

export default function Hero({
  query,
  onQuery,
  files,
  loading,
}: {
  query: string;
  onQuery: (q: string) => void;
  files: MediaFile[];
  loading: boolean;
}) {
  const products = groupByProduct(files).length;

  return (
    <section className="relative overflow-hidden px-4 pt-6 md:px-6 md:pt-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-cream-300 bg-gradient-to-br from-cream-50 via-white to-cream-100 px-5 py-8 shadow-card md:px-10 md:py-12">
        <div className="mx-auto max-w-3xl text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
            مكتبة ريبون
          </span>

          <h1 className="font-display mt-5 text-[2.2rem] font-extrabold leading-[1.2] text-ink-950 md:text-[4rem]">
            كل ما تحتاجه عن منتجك
          </h1>

          <p className="mt-4 text-sm leading-7 text-ink-700 md:text-xl md:leading-9">
            ابحث برقم المنتج أو الاسم، ثم افتح صفحة واحدة تجمع التصاميم والفيديوهات وملفات 3D.
          </p>

          <p className="mt-5 text-sm font-bold text-ink-700 md:text-base">
            ابحث باسم المنتج أو رقم الموديل
          </p>

          <form
            className="group relative mt-3"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <button
              type="submit"
              aria-label="بحث"
              className="absolute inset-y-1.5 start-1.5 z-10 grid w-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-card transition hover:bg-brand-600 active:scale-[0.98] md:w-16"
            >
              <SearchIcon width={24} height={24} />
            </button>

            <input
              id="library-search"
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="مثال: RE-1-132"
              aria-label="ابحث باسم المنتج أو رقم الموديل"
              className="h-16 w-full rounded-[1.5rem] border-2 border-cream-300 bg-white pe-14 ps-20 text-base font-semibold text-ink-950 shadow-card placeholder:font-medium placeholder:text-ink-400 transition-all duration-300 focus:border-brand-500 focus:shadow-lift focus:outline-none md:h-[74px] md:rounded-[1.6rem] md:pe-16 md:ps-24 md:text-xl"
            />

            {query && (
              <button
                type="button"
                onClick={() => onQuery("")}
                aria-label="مسح البحث"
                className="absolute inset-y-0 end-4 my-auto grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-ink-700 transition hover:bg-brand-500 hover:text-white active:scale-90"
              >
                <XIcon width={16} height={16} />
              </button>
            )}
          </form>

          <p className="mt-4 text-sm text-ink-500 md:text-base">
            {loading ? "..." : `${products}`} صفحة ومنتج جاهزة للاستكشاف داخل المكتبة.
          </p>
        </div>
      </div>
    </section>
  );
}
