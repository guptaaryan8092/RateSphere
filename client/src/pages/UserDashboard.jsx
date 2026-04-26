import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { listStores } from '../services/storeService';
import { submitRating, updateRating } from '../services/ratingService';
import StoreCard from '../components/StoreCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import useDebounce from '../hooks/useDebounce';
import { FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user } = useAuth();

  const [stores, setStores]         = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  const [search, setSearch]         = useState('');
  const [address, setAddress]       = useState('');
  const [sortBy, setSortBy]         = useState('name');
  const [order, setOrder]           = useState('ASC');
  const debouncedSearch  = useDebounce(search);
  const debouncedAddress = useDebounce(address);

  // Rating modal state
  const [rateModal, setRateModal]   = useState(null); // { store, currentRating }
  const [rateValue, setRateValue]   = useState(0);
  const [rateLoading, setRateLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const r = await listStores({
        name: debouncedSearch || undefined,
        address: debouncedAddress || undefined,
        sortBy, order, page, limit: 12,
      });
      const d = r.data.data;
      setStores(d.stores); setTotal(d.total); setTotalPages(d.totalPages);
    } catch { toast.error('Failed to load stores.'); }
    finally { setLoading(false); }
  }, [debouncedSearch, debouncedAddress, sortBy, order, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRate = (store, val) => {
    setRateValue(val || store.user_rating || 0);
    setRateModal(store);
  };

  const handleRateSubmit = async () => {
    if (!rateValue) { toast.error('Please select a rating.'); return; }
    setRateLoading(true);
    try {
      if (rateModal.user_rating_id) {
        await updateRating(rateModal.user_rating_id, { rating: rateValue });
        toast.success('Rating updated!');
      } else {
        await submitRating({ storeId: rateModal.id, rating: rateValue });
        toast.success('Rating submitted!');
      }
      setRateModal(null); setRateValue(0);
      fetchStores();
    } catch (err) { toast.error(err.message); }
    finally { setRateLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Discover and rate stores — {total} store{total !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <SearchBar
          value={search} onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by store name…"
          className="flex-1 min-w-[200px]"
        />
        <SearchBar
          value={address} onChange={(v) => { setAddress(v); setPage(1); }}
          placeholder="Search by address…"
          className="flex-1 min-w-[200px]"
        />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="input w-40"
          >
            <option value="name">Sort: Name</option>
            <option value="avg_rating">Sort: Rating</option>
            <option value="created_at">Sort: Newest</option>
          </select>
          <button
            onClick={() => setOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'))}
            className="btn-secondary px-3"
            title={`Currently ${order}`}
          >
            {order === 'ASC' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Store Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : stores.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">🏪</p>
          <p className="text-lg font-medium">No stores found</p>
          <p className="text-sm mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRate={handleRate} currentUserId={user?.id} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />

      {/* Rating Modal */}
      <Modal
        open={!!rateModal}
        onClose={() => { setRateModal(null); setRateValue(0); }}
        title={rateModal?.user_rating_id ? 'Update Your Rating' : 'Rate This Store'}
      >
        {rateModal && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{rateModal.name}</h3>
              {rateModal.address && <p className="text-sm text-slate-500 mt-1">{rateModal.address}</p>}
            </div>
            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Tap to select your rating</p>
              <StarRating value={rateValue} onRate={setRateValue} interactive size="lg" />
              <p className="text-3xl font-black text-primary-600 dark:text-primary-400 mt-1">
                {rateValue > 0 ? rateValue : '—'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setRateModal(null); setRateValue(0); }} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleRateSubmit} disabled={rateLoading || !rateValue} className="btn-primary flex-1">
                {rateLoading ? 'Saving…' : rateModal.user_rating_id ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
