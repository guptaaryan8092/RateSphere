/**
 * Loading skeleton component
 * @param {string} type - 'card' | 'table' | 'page' | 'stat'
 * @param {number} count - number of skeleton items
 */
export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'page') {
    return (
      <div className="flex flex-col items-center gap-4 w-64">
        <div className="skeleton w-16 h-16 rounded-full" />
        <div className="skeleton h-4 w-48 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-card">
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-7 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2">
        <div className="skeleton h-10 w-full rounded-xl" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // card
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="flex justify-between">
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-5 w-14 rounded" />
          </div>
          <div className="skeleton h-4 w-56 rounded" />
          <div className="skeleton h-4 w-48 rounded" />
          <div className="skeleton h-6 w-28 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}
