import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

/**
 * StarRating component
 * @param {number} value - current rating (0–5)
 * @param {function} onRate - called with new rating when interactive
 * @param {boolean} interactive - enable hover/click
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function StarRating({ value = 0, onRate, interactive = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);

  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const cls = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (interactive ? hovered || value : value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={[
              'transition-transform duration-100',
              interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default',
            ].join(' ')}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {filled
              ? <StarIcon    className={`${cls} text-amber-400`} />
              : <StarOutline className={`${cls} text-slate-300 dark:text-slate-600`} />}
          </button>
        );
      })}
    </div>
  );
}
