import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: { main: "index.html", airfryer: "products/RE-11-065/index.html", re0008: "products/RE0008/index.html", kettle: "products/RE-1-132/index.html", styler: "products/RE-2207-2/index.html", iron: "products/RE-3-065/index.html", toaster: "products/RE-5-087/index.html", heater: "products/RE-7-122/index.html", grill: "products/RE-5-096/index.html" } } },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
