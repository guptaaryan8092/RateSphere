import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authService';
import { validateEmail } from '../utils/validators';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await loginApi({ email: form.email, password: form.password });
      const { user, token } = res.data.data;
      login(user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const dashMap = { admin: '/admin', user: '/dashboard', owner: '/owner' };
      navigate(dashMap[user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16
                    bg-gradient-to-br from-primary-50 via-white to-violet-50
                    dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-primary-600 shadow-xl mb-4">
            <span className="text-white text-2xl font-black">R</span>
          </div>
          <h1 className="text-3xl font-extrabold gradient-text">RateSphere</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="label">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={set('password')}
                className={`input ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 card p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-600 dark:text-slate-300">Demo accounts:</p>
          <p>Admin: <code>admin@ratesphere.com</code> / <code>Admin@1234</code></p>
          <p>User: create via signup</p>
        </div>
      </div>
    </div>
  );
}
