import { MapPinIcon, EnvelopeIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { formatRating, truncate } from '../utils/formatters';
import StarRating from './StarRating';

export default function StoreCard({ store, onRate, currentUserId }) {
  const avg = parseFloat(store.avg_rating) || 0;
  const userRating = store.user_rating;

  return (
    <div className="card-hover p-5 flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
            {store.name}
          </h3>
          {store.owner_name && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              by {store.owner_name}
            </p>
          )}
        </div>

        {/* Avg rating badge */}
        <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-900/30
                        px-2.5 py-1 rounded-lg">
          <StarSolid className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
            {formatRating(store.avg_rating)}
          </span>
          <span className="text-xs text-slate-400 ml-0.5">
            ({store.rating_count || 0})
          </span>
        </div>
      </div>

      {/* Address */}
      {store.address && (
        <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
          <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5 text-primary-400" />
          <span>{truncate(store.address, 80)}</span>
        </div>
      )}

      {/* Email */}
      {store.email && (
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <EnvelopeIcon className="w-4 h-4 shrink-0 text-primary-400" />
          <span>{store.email}</span>
        </div>
      )}

      {/* User rating section */}
      {onRate && (
        <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {userRating ? 'Your rating:' : 'Rate this store:'}
          </p>
          <StarRating
            value={userRating || 0}
            onRate={(val) => onRate(store, val)}
            interactive
          />
        </div>
      )}
    </div>
  );
}
