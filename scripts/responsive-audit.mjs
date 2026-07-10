/**
 * Quick responsive overflow audit — checks public routes at common viewports.
 * Usage: node scripts/responsive-audit.mjs [baseUrl]
 */
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:3000";

const routes = [
  "/",
  "/about",
  "/destinations",
  "/travel-expert",
  "/client-stories",
  "/gallery",
  "/careers",
  "/contact",
  "/plan-my-journey",
  "/privacy-policy",
  "/terms-of-service",
];

const viewports = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-320", width: 320, height: 568 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const issues = [];

for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  for (const route of routes) {
    const url = `${baseUrl}${route}`;

    try {
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      if (!response || response.status() >= 400) {
        issues.push({ viewport: viewport.name, route, type: "http", detail: `status ${response?.status() ?? "none"}` });
        continue;
      }

      await page.waitForTimeout(800);

      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const overflowX =
          Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth;
        const wideElements = [...document.querySelectorAll("*")]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > window.innerWidth + 2 && rect.right > window.innerWidth + 2;
          })
          .slice(0, 5)
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === "string" ? el.className.slice(0, 80) : "",
            width: Math.round(el.getBoundingClientRect().width),
          }));

        return {
          overflowX: Math.round(overflowX),
          wideElements,
        };
      });

      if (metrics.overflowX > 8) {
        issues.push({
          viewport: viewport.name,
          route,
          type: "overflow",
          detail: `${metrics.overflowX}px horizontal overflow`,
          wideElements: metrics.wideElements,
        });
      }
    } catch (error) {
      issues.push({
        viewport: viewport.name,
        route,
        type: "error",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

await browser.close();

console.log(`\nResponsive audit — ${baseUrl}`);
console.log(`Routes: ${routes.length} | Viewports: ${viewports.length}\n`);

if (issues.length === 0) {
  console.log("No horizontal overflow or load errors detected.");
  process.exit(0);
}

for (const issue of issues) {
  console.log(`[${issue.viewport}] ${issue.route} — ${issue.type}: ${issue.detail}`);
  if (issue.wideElements?.length) {
    for (const el of issue.wideElements) {
      console.log(`  · <${el.tag}${el.className ? `.${el.className.split(" ").join(".")}` : ""}> ${el.width}px`);
    }
  }
}

console.log(`\n${issues.length} issue(s) found.`);
process.exit(issues.some((i) => i.type === "overflow" || i.type === "http") ? 1 : 0);
