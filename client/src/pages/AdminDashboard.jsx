import { useState, useEffect, useCallback } from 'react';
import {
  UsersIcon, BuildingStorefrontIcon, StarIcon,
  PlusIcon, FunnelIcon,
} from '@heroicons/react/24/outline';
import { getDashboard, listUsers, createUser, listStores, createStore } from '../services/adminService';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate, formatRating } from '../utils/formatters';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';
import useDebounce from '../hooks/useDebounce';
import toast from 'react-hot-toast';

// ── Stat Card ────────────────────────────────────────────────────────────────
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

// ── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = { admin: 'badge-admin', user: 'badge-user', owner: 'badge-owner' };
  return <span className={map[role] || 'badge'}>{role}</span>;
}

export default function AdminDashboard() {
  const [tab, setTab]   = useState('users'); // 'users' | 'stores'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Users state ────────────────────────────────────────────────────────────
  const [users, setUsers]             = useState([]);
  const [usersTotal, setUsersTotal]   = useState(0);
  const [usersPage, setUsersPage]     = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch]   = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSort, setUserSort]       = useState({ by: 'created_at', order: 'DESC' });
  const debouncedUserSearch = useDebounce(userSearch);

  // ── Stores state ───────────────────────────────────────────────────────────
  const [stores, setStores]               = useState([]);
  const [storesTotal, setStoresTotal]     = useState(0);
  const [storesPage, setStoresPage]       = useState(1);
  const [storesTotalPages, setStoresTotalPages] = useState(1);
  const [storesLoading, setStoresLoading] = useState(false);
  const [storeSearch, setStoreSearch]     = useState('');
  const [storeSort, setStoreSort]         = useState({ by: 'created_at', order: 'DESC' });
  const debouncedStoreSearch = useDebounce(storeSearch);

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [userModal, setUserModal]   = useState(false);
  const [storeModal, setStoreModal] = useState(false);

  // ── Fetch Stats ────────────────────────────────────────────────────────────
  useEffect(() => {
    getDashboard()
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error('Failed to load dashboard stats.'))
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch Users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const r = await listUsers({
        name: debouncedUserSearch || undefined,
        role: userRoleFilter || undefined,
        sortBy: userSort.by, order: userSort.order,
        page: usersPage, limit: 8,
      });
      const d = r.data.data;
      setUsers(d.users); setUsersTotal(d.total); setUsersTotalPages(d.totalPages);
    } catch { toast.error('Failed to load users.'); }
    finally { setUsersLoading(false); }
  }, [debouncedUserSearch, userRoleFilter, userSort, usersPage]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Fetch Stores ───────────────────────────────────────────────────────────
  const fetchStores = useCallback(async () => {
    setStoresLoading(true);
    try {
      const r = await listStores({
        name: debouncedStoreSearch || undefined,
        sortBy: storeSort.by, order: storeSort.order,
        page: storesPage, limit: 8,
      });
      const d = r.data.data;
      setStores(d.stores); setStoresTotal(d.total); setStoresTotalPages(d.totalPages);
    } catch { toast.error('Failed to load stores.'); }
    finally { setStoresLoading(false); }
  }, [debouncedStoreSearch, storeSort, storesPage]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleUserSort = (key) =>
    setUserSort((s) => ({ by: key, order: s.by === key && s.order === 'ASC' ? 'DESC' : 'ASC' }));

  const handleStoreSort = (key) =>
    setStoreSort((s) => ({ by: key, order: s.by === key && s.order === 'ASC' ? 'DESC' : 'ASC' }));

  // ── User Columns ───────────────────────────────────────────────────────────
  const userCols = [
    { key: 'name',       label: 'Name',       sortable: true },
    { key: 'email',      label: 'Email',      sortable: true },
    { key: 'role',       label: 'Role',       sortable: true, render: (r) => <RoleBadge role={r.role} /> },
    { key: 'address',    label: 'Address',    render: (r) => r.address ? <span className="truncate max-w-[150px] inline-block">{r.address}</span> : '—' },
    { key: 'created_at', label: 'Joined',     sortable: true, render: (r) => formatDate(r.created_at) },
  ];

  // ── Store Columns ──────────────────────────────────────────────────────────
  const storeCols = [
    { key: 'name',       label: 'Store Name', sortable: true },
    { key: 'email',      label: 'Email' },
    { key: 'address',    label: 'Address',    render: (r) => r.address ? <span className="truncate max-w-[150px] inline-block">{r.address}</span> : '—' },
    { key: 'owner_name', label: 'Owner',      render: (r) => r.owner_name || '—' },
    { key: 'avg_rating', label: 'Avg Rating', sortable: true, render: (r) => (
      <span className="font-semibold text-amber-500">{formatRating(r.avg_rating)} ⭐</span>
    )},
    { key: 'rating_count', label: 'Ratings',  render: (r) => r.rating_count || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <LoadingSkeleton type="stat" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard icon={UsersIcon}               label="Total Users"   value={stats?.totalUsers}   color="bg-primary-500" />
          <StatCard icon={BuildingStorefrontIcon}  label="Total Stores"  value={stats?.totalStores}  color="bg-violet-500"  />
          <StatCard icon={StarIcon}                label="Total Ratings" value={stats?.totalRatings} color="bg-amber-500"   />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {['users', 'stores'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t
                ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Users Tab ─────────────────────────────────────────────────────── */}
      {tab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-3 flex-1">
              <SearchBar
                value={userSearch} onChange={setUserSearch}
                placeholder="Search by name or email…"
                className="flex-1 max-w-sm"
              />
              <select
                value={userRoleFilter}
                onChange={(e) => { setUserRoleFilter(e.target.value); setUsersPage(1); }}
                className="input w-36"
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <button onClick={() => setUserModal(true)} className="btn-primary shrink-0">
              <PlusIcon className="w-4 h-4" /> Add User
            </button>
          </div>
          <p className="text-sm text-slate-500">{usersTotal} user{usersTotal !== 1 ? 's' : ''} found</p>
          {usersLoading ? <LoadingSkeleton type="table" count={8} /> : (
            <DataTable columns={userCols} rows={users} sortBy={userSort.by} order={userSort.order} onSort={handleUserSort} emptyMsg="No users match your filters." />
          )}
          <Pagination page={usersPage} totalPages={usersTotalPages} onPage={setUsersPage} />
        </div>
      )}

      {/* ── Stores Tab ────────────────────────────────────────────────────── */}
      {tab === 'stores' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <SearchBar
              value={storeSearch} onChange={setStoreSearch}
              placeholder="Search stores…"
              className="flex-1 max-w-sm"
            />
            <button onClick={() => setStoreModal(true)} className="btn-primary shrink-0">
              <PlusIcon className="w-4 h-4" /> Add Store
            </button>
          </div>
          <p className="text-sm text-slate-500">{storesTotal} store{storesTotal !== 1 ? 's' : ''} found</p>
          {storesLoading ? <LoadingSkeleton type="table" count={8} /> : (
            <DataTable columns={storeCols} rows={stores} sortBy={storeSort.by} order={storeSort.order} onSort={handleStoreSort} emptyMsg="No stores found." />
          )}
          <Pagination page={storesPage} totalPages={storesTotalPages} onPage={setStoresPage} />
        </div>
      )}

      {/* ── Create User Modal ─────────────────────────────────────────────── */}
      <CreateUserModal open={userModal} onClose={() => setUserModal(false)} onCreated={fetchUsers} />

      {/* ── Create Store Modal ────────────────────────────────────────────── */}
      <CreateStoreModal open={storeModal} onClose={() => setStoreModal(false)} onCreated={fetchStores} />
    </div>
  );
}

// ── Create User Modal ────────────────────────────────────────────────────────
function CreateUserModal({ open, onClose, onCreated }) {
  const [form, setForm]     = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    const ne = validateName(form.name); if (ne) errs.name = ne;
    const ee = validateEmail(form.email); if (ee) errs.email = ee;
    const pe = validatePassword(form.password); if (pe) errs.password = pe;
    const ae = validateAddress(form.address); if (ae) errs.address = ae;
    if (!form.role) errs.role = 'Role is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await createUser(form);
      toast.success('User created successfully.');
      onCreated(); onClose();
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New User">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {[
          { id: 'cu-name',     label: 'Full Name',   field: 'name',     type: 'text',     ph: 'Min. 20 chars' },
          { id: 'cu-email',    label: 'Email',        field: 'email',    type: 'email',    ph: 'email@example.com' },
          { id: 'cu-password', label: 'Password',     field: 'password', type: 'password', ph: '••••••••' },
          { id: 'cu-address',  label: 'Address',      field: 'address',  type: 'text',     ph: 'Optional' },
        ].map(({ id, label, field, type, ph }) => (
          <div key={id}>
            <label htmlFor={id} className="label">{label}</label>
            <input id={id} type={type} value={form[field]} onChange={set(field)}
              className={`input ${errors[field] ? 'border-red-400' : ''}`} placeholder={ph} />
            {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="cu-role" className="label">Role</label>
          <select id="cu-role" value={form.role} onChange={set('role')} className="input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Store Owner</option>
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Create Store Modal ───────────────────────────────────────────────────────
function CreateStoreModal({ open, onClose, onCreated }) {
  const [form, setForm]     = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    const ne = validateName(form.name);  if (ne) errs.name = ne;
    const ee = validateEmail(form.email); if (ee) errs.email = ee;
    const ae = validateAddress(form.address); if (ae) errs.address = ae;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await createStore({ ...form, owner_id: form.owner_id ? Number(form.owner_id) : undefined });
      toast.success('Store created successfully.');
      onCreated(); onClose();
      setForm({ name: '', email: '', address: '', owner_id: '' });
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Store">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {[
          { id: 'cs-name',     label: 'Store Name', field: 'name',     type: 'text',  ph: 'Min. 20 chars' },
          { id: 'cs-email',    label: 'Email',       field: 'email',    type: 'email', ph: 'store@example.com' },
          { id: 'cs-address',  label: 'Address',     field: 'address',  type: 'text',  ph: 'Store address' },
          { id: 'cs-owner',    label: 'Owner ID',    field: 'owner_id', type: 'number',ph: 'Optional owner user ID' },
        ].map(({ id, label, field, type, ph }) => (
          <div key={id}>
            <label htmlFor={id} className="label">{label}</label>
            <input id={id} type={type} value={form[field]} onChange={set(field)}
              className={`input ${errors[field] ? 'border-red-400' : ''}`} placeholder={ph} />
            {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating…' : 'Create Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
