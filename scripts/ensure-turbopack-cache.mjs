import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcSitePage = path.join(root, "src/app/(site)/page.tsx");
const srcRootPage = path.join(root, "src/app/page.tsx");
const ghostPage = path.join(root, ".next/dev/server/app/page.js");
const sitePage = path.join(root, ".next/dev/server/app/(site)/page.js");

/**
 * Turbopack can leave a stale flattened `/page` artifact alongside `/(site)/page`
 * when the dev cache is corrupted. That ghost entry recompiles every second at ~900% CPU
 * even with no browser open. Clear only the dev cache when we detect that pattern.
 */
function hasStaleHomeRouteCache() {
  if (!fs.existsSync(srcSitePage) || fs.existsSync(srcRootPage)) return false;
  return fs.existsSync(ghostPage) && fs.existsSync(sitePage);
}

if (hasStaleHomeRouteCache()) {
  const devCache = path.join(root, ".next/dev");
  console.warn(
    "[traguin] Stale Turbopack dev cache detected (duplicate /page build output). Clearing .next/dev..."
  );
  fs.rmSync(devCache, { recursive: true, force: true });
}
