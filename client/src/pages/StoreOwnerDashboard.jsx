import { useState, useEffect, useCallback } from 'react';
import { getOwnerDashboard } from '../services/ownerService';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StarRating from '../components/StarRating';
import { formatDate, formatRating } from '../utils/formatters';
import { StarIcon, UsersIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card animate-fade-in">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function StoreOwnerDashboard() {
  const { user } = useAuth();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getOwnerDashboard({ page, limit: 10 });
      setData(r.data.data);
    } catch { toast.error('Failed to load dashboard.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const raterCols = [
    { key: 'user_name',  label: 'Customer' },
    { key: 'user_email', label: 'Email' },
    { key: 'rating',     label: 'Rating', render: (r) => <StarRating value={r.rating} size="sm" /> },
    { key: 'created_at', label: 'Date',   render: (r) => formatDate(r.created_at) },
    { key: 'updated_at', label: 'Updated',render: (r) => formatDate(r.updated_at) },
  ];

  const primaryStore = data?.stores?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Store Owner Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor ratings and customer feedback
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="stat" />
      ) : data?.stores?.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">🏪</p>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No stores assigned yet</p>
          <p className="text-sm text-slate-500 mt-1">Contact an admin to link your store.</p>
        </div>
      ) : (
        <>
          {/* Store overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={BuildingStorefrontIcon} label="Your Stores"   value={data?.stores?.length}    color="bg-primary-500" />
            <StatCard icon={StarIcon}               label="Average Rating" value={formatRating(primaryStore?.avg_rating)} color="bg-amber-500" />
            <StatCard icon={UsersIcon}              label="Total Raters"  value={data?.total}             color="bg-violet-500" />
          </div>

          {/* Store list */}
          {data?.stores?.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.stores.map((s) => (
                <div key={s.id} className="card p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.address || 'No address'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-amber-500">{formatRating(s.avg_rating)}</p>
                    <p className="text-xs text-slate-400">{s.rating_count} rating{s.rating_count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rater table */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Customer Ratings{primaryStore ? ` — ${primaryStore.name}` : ''}
            </h2>
            {loading ? (
              <LoadingSkeleton type="table" count={8} />
            ) : (
              <DataTable
                columns={raterCols}
                rows={data?.raters || []}
                emptyMsg="No ratings yet. Share your store link to get started!"
              />
            )}
            <Pagination page={page} totalPages={data?.totalPages || 1} onPage={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
