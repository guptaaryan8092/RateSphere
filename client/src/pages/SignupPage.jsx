import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi } from '../services/authService';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { login }  = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    const nameErr    = validateName(form.name);
    const emailErr   = validateEmail(form.email);
    const passErr    = validatePassword(form.password);
    const addrErr    = validateAddress(form.address);
    if (nameErr)  errs.name     = nameErr;
    if (emailErr) errs.email    = emailErr;
    if (passErr)  errs.password = passErr;
    if (addrErr)  errs.address  = addrErr;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await signupApi(form);
      const { user } = res.data.data;
      login(user);
      toast.success('Account created! Welcome to RateSphere 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, type = 'text', field, autoComplete, placeholder, hint }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id} type={type} autoComplete={autoComplete}
        value={form[field]} onChange={set(field)}
        className={`input ${errors[field] ? 'border-red-400 focus:ring-red-400' : ''}`}
        placeholder={placeholder}
      />
      {errors[field]
        ? <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
        : hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16
                    bg-gradient-to-br from-primary-50 via-white to-violet-50
                    dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-primary-600 shadow-xl mb-4">
            <span className="text-white text-2xl font-black">R</span>
          </div>
          <h1 className="text-3xl font-extrabold gradient-text">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Join RateSphere today</p>
        </div>

        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field id="signup-name"     label="Full Name"       field="name"     autoComplete="name"          placeholder="Min. 20 characters"   hint="20–60 characters" />
            <Field id="signup-email"    label="Email Address"   field="email"    type="email" autoComplete="email"     placeholder="you@example.com" />
            <Field id="signup-password" label="Password"        field="password" type="password" autoComplete="new-password" placeholder="••••••••" hint="8–16 chars, 1 uppercase, 1 special" />
            <Field id="signup-address"  label="Address (opt.)"  field="address"  autoComplete="street-address" placeholder="Your address"           hint="Max 400 characters" />

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
