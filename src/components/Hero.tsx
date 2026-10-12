import { type MediaFile } from "../data/media";
import { SearchIcon, SparkIcon, XIcon } from "./Icons";

export default function Hero({
  query,
  onQuery,
  files: _files,
  loading: _loading,
}: {
  query: string;
  onQuery: (q: string) => void;
  files: MediaFile[];
  loading: boolean;
}) {
  return (
    <section className="relative overflow-hidden px-4 pt-6 md:px-6 md:pt-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-cream-300 bg-gradient-to-br from-[#fffaf4] via-white to-[#fffdf9] px-5 py-8 shadow-card md:px-10 md:py-10 lg:px-14 lg:py-10">
        <div className="ms-auto max-w-[760px] text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-extrabold text-brand-700">
            <SparkIcon width={15} height={15} />
            مكتبة ريبون
          </span>

          <h1 className="font-display mt-5 text-[2.45rem] font-extrabold leading-[1.18] tracking-[-0.02em] text-ink-950 md:text-[4rem] lg:text-[4.35rem]">
            كل ما تحتاجه عن منتجك
          </h1>

          <p className="mt-4 text-sm font-medium leading-7 text-ink-700 md:text-lg md:leading-8">
            ابحث برقم المنتج أو الاسم، ثم افتح صفحة واحدة تجمع التصاميم والفيديوهات وملفات 3D.
          </p>

          <form
            className="group relative mt-7"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="pointer-events-none absolute inset-y-0 end-5 grid place-items-center text-[#ad967d] transition group-focus-within:text-brand-600">
              <SearchIcon width={21} height={21} />
            </span>

            <button
              type="submit"
              aria-label="بحث"
              className="absolute inset-y-1.5 start-1.5 z-10 grid w-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-card transition hover:bg-brand-600 active:scale-[0.98] md:w-16"
            >
              <SearchIcon width={23} height={23} />
            </button>

            <input
              id="library-search"
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="ابحث برقم المنتج، مثال: RE-1-132"
              aria-label="ابحث برقم المنتج أو اسم المنتج"
              className="h-16 w-full rounded-[1.35rem] border border-cream-300 bg-white pe-14 ps-20 text-base font-semibold text-ink-950 shadow-card placeholder:font-medium placeholder:text-[#b19579] transition-all duration-300 focus:border-brand-500 focus:shadow-lift focus:outline-none md:h-[72px] md:pe-16 md:ps-24 md:text-lg"
            />

            {query && (
              <button
                type="button"
                onClick={() => onQuery("")}
                aria-label="مسح البحث"
                className="absolute inset-y-0 end-12 my-auto grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-ink-700 transition hover:bg-brand-500 hover:text-white active:scale-90 md:end-14"
              >
                <XIcon width={15} height={15} />
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
