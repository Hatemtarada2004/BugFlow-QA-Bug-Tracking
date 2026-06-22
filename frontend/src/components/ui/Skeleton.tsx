const cls = (...c: string[]) => c.join(" ");

export const Skeleton = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={cls("animate-pulse rounded bg-slate-200", className)} style={style} />
);

export const BugsTableSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex gap-4">
      {[120, 80, 72, 80, 72, 96, 60].map((w, i) => (
        <Skeleton key={i} className={`h-3`} style={{ width: w }} />
      ))}
    </div>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0">
        <div className="w-2 h-2 rounded-full bg-slate-200 flex-shrink-0" />
        <Skeleton className="h-3.5 flex-1 max-w-xs" />
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-8 w-44 rounded-lg" />
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      ))}
    </div>

    {/* Chart row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="p-4 flex items-center justify-center">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>

    {/* Bottom row */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <Skeleton className="h-4 w-28" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0">
            <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="p-4">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export const BugDetailSkeleton = () => (
  <div className="max-w-4xl space-y-6">
    <div>
      <Skeleton className="h-4 w-28 mb-4" />
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-3.5 w-56" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-4/6" />
    </div>
  </div>
);
