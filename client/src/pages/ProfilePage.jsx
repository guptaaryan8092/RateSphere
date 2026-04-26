import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/authService';
import { validatePassword } from '../utils/validators';
import { formatDate } from '../utils/formatters';
import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const roleBadgeMap = {
  admin: 'badge-admin',
  user:  'badge-user',
  owner: 'badge-owner',
};

export default function ProfilePage() {
  const { user } = useAuth();

  const [form, setForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required.';
    const pe = validatePassword(form.newPassword);
    if (pe) errs.newPassword = pe;
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500
                        flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white text-2xl font-black">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</h2>
            <span className={roleBadgeMap[user?.role] || 'badge'}>{user?.role}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
          {user?.address && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.address}</p>
          )}
          {user?.created_at && (
            <p className="text-xs text-slate-400 mt-2">Member since {formatDate(user.created_at)}</p>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30
                          flex items-center justify-center">
            <KeyIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Change Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {[
            { id: 'cp-current', label: 'Current Password',  field: 'currentPassword',  ph: '••••••••' },
            { id: 'cp-new',     label: 'New Password',      field: 'newPassword',       ph: 'Min 8 chars, 1 uppercase, 1 special' },
            { id: 'cp-confirm', label: 'Confirm Password',  field: 'confirmPassword',   ph: 'Repeat new password' },
          ].map(({ id, label, field, ph }) => (
            <div key={id}>
              <label htmlFor={id} className="label">{label}</label>
              <input
                id={id} type="password"
                value={form[field]} onChange={set(field)}
                className={`input ${errors[field] ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder={ph}
              />
              {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
