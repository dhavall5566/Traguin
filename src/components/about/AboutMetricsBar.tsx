import { ABOUT_METRICS } from "@/data/about-content";
import { curatedDestinationCount } from "@/data/pageContent";

export function AboutMetricsBar() {
  const metrics = ABOUT_METRICS.map((metric) =>
    metric.label === "Destinations"
      ? { ...metric, value: `${curatedDestinationCount}+` }
      : metric
  );

  return (
    <section className="about-metrics" aria-label="Company overview">
      <div className="page-x-padding">
        <div className="site-container">
          <dl className="about-metrics__grid">
            {metrics.map((metric) => (
              <div key={metric.label} className="about-metrics__item">
                <dt className="about-metrics__label">{metric.label}</dt>
                <dd className="about-metrics__value">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
