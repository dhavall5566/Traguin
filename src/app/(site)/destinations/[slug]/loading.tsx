export default function DestinationLoading() {
  return (
    <div className="site-container py-16 md:py-24" aria-busy="true" aria-label="Loading journey">
      <div className="mx-auto max-w-3xl animate-pulse space-y-6">
        <div className="h-4 w-28 rounded-full bg-surface-elevated" />
        <div className="h-12 w-4/5 rounded-2xl bg-surface-elevated" />
        <div className="h-4 w-full rounded-full bg-surface-elevated" />
        <div className="h-4 w-11/12 rounded-full bg-surface-elevated" />
        <div className="mt-10 aspect-[16/10] w-full rounded-[1.75rem] bg-surface-elevated" />
      </div>
    </div>
  );
}
