import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

import { defineConfig } from "vite";

const passthroughFiles = ["_headers", "robots.txt", "sitemap.xml", ".nojekyll"];

export default defineConfig({
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: "dist",
  },
  plugins: [
    {
      name: "copy-static-deploy-files",
      async writeBundle() {
        await Promise.all(
          passthroughFiles.map((file) =>
            copyFile(resolve(file), resolve("dist", file)),
          ),
        );
      },
    },
  ],
});
