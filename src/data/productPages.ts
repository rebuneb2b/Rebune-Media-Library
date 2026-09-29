/** Add a local published page here to enable its Learn more link automatically. */
export const PRODUCT_PAGES: Record<string, string> = {
  "RE-1-132": "/products/RE-1-132/index.html",
  "RE-2207-2": "/products/RE-2207-2/index.html",
  "RE-3-065": "/products/RE-3-065/index.html",
  "RE-5-087": "/products/RE-5-087/index.html",
  "RE-7-122": "/products/RE-7-122/index.html",
  "RE-5-096": "/products/RE-5-096/index.html",
};
export function normalizeProductCode(code: string): string {
  return code.trim().toUpperCase().replace(/[–—]/g, "-").replace(/\s+/g, "");
}
export function getProductPage(code: string): string | undefined {
  return PRODUCT_PAGES[normalizeProductCode(code)];
}
