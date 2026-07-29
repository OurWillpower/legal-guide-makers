// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

// Pin the project root to this config file's directory so plugins that resolve
// paths relative to the working directory (e.g. the MCP route generator, which
// asserts at construction time) work regardless of where the build is invoked from.
const projectRoot = dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== projectRoot) {
  process.chdir(projectRoot);
}


export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    root: projectRoot,
    envDir: projectRoot,
    plugins: [
      mcpPlugin({
        routesDir: resolve(projectRoot, "src/routes"),
        mcpEntry: resolve(projectRoot, "src/lib/mcp/index.ts"),
      }),
    ],
  },
});
