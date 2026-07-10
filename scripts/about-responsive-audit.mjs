/**
 * Responsive audit for the About page only.
 * Usage: node scripts/about-responsive-audit.mjs [baseUrl]
 */
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:3000";

const viewports = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-834", width: 834, height: 1194 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const issues = [];

for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  try {
    const response = await page.goto(`${baseUrl}/about`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    if (!response || response.status() >= 400) {
      issues.push({
        viewport: viewport.name,
        type: "http",
        detail: `status ${response?.status() ?? "none"}`,
      });
      continue;
    }

    await page.waitForTimeout(900);

    const metrics = await page.evaluate(() => {
      const scrollable =
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

      const sections = {
        hero: document.querySelector(".about-hero"),
        stats: document.querySelector(".about-hero-stats__card"),
        catalog: document.querySelector(".about-catalog__shell"),
        partners: document.querySelector(".about-partners"),
        faq: document.querySelector(".about-faq__layout"),
        cta: document.querySelector(".page-cta"),
      };

      const sectionOverflow = Object.entries(sections)
        .filter(([, el]) => {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.right > window.innerWidth + 2 || rect.left < -2;
        })
        .map(([name]) => name);

      const smallTargets = [...document.querySelectorAll(".about-catalog__nav-item")].filter(
        (el) => el.getBoundingClientRect().height < 40
      ).length;

      return {
        scrollable,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        sectionOverflow,
        smallTargets,
      };
    });

    if (metrics.scrollable) {
      issues.push({
        viewport: viewport.name,
        type: "overflow",
        detail: `${metrics.scrollWidth - metrics.clientWidth}px horizontal scroll`,
      });
    }

    if (metrics.sectionOverflow.length > 0) {
      issues.push({
        viewport: viewport.name,
        type: "section",
        detail: metrics.sectionOverflow.join(", "),
      });
    }

    if (metrics.smallTargets > 0) {
      issues.push({
        viewport: viewport.name,
        type: "touch-target",
        detail: `${metrics.smallTargets} catalog nav items below 40px height`,
      });
    }

    const status = issues.some((i) => i.viewport === viewport.name) ? "ISSUE" : "OK";
    console.log(
      `${status} ${viewport.name} — scroll:${metrics.scrollWidth}px${metrics.scrollable ? " (overflow)" : ""}`
    );
  } catch (error) {
    issues.push({
      viewport: viewport.name,
      type: "error",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

await browser.close();

console.log(`\nAbout page audit — ${baseUrl}`);
if (issues.length === 0) {
  console.log("All viewports passed.");
  process.exit(0);
}

for (const issue of issues) {
  console.log(`[${issue.viewport}] ${issue.type}: ${issue.detail}`);
}
console.log(`\n${issues.length} issue(s) found.`);
process.exit(1);
