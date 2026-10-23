import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';

export const AdminLoginScreen: React.FC = () => {
  const { user, isAdmin, loginWithEmail, loginAsAdminDirect } = useAuth();
  const { navigateTo, language } = useLibrary();

  const isBn = language === 'bn';
  const [email, setEmail] = useState('zulfiqareee@gmail.com');
  const [password, setPassword] = useState('Admin@Pass2026');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email.trim().toLowerCase() !== 'zulfiqareee@gmail.com') {
      setError(
        isBn
          ? 'অননুমোদিত ইমেইল! শুধুমাত্র অনুমোদিত অ্যাডমিন (zulfiqareee@gmail.com) প্রবেশ করতে পারবেন।'
          : 'Unauthorized email. Only server-authorized admin (zulfiqareee@gmail.com) has access.'
      );
      return;
    }
    loginWithEmail(email, password);
    navigateTo('admin_dashboard');
  };

  const handleAuthorizedClick = () => {
    loginAsAdminDirect();
    navigateTo('admin_dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex-1 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {isBn ? 'অ্যাডমিনিস্ট্রেটর পোর্টাল' : 'Administrator Portal'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'বই আপলোড, সম্পাদন ও বিক্রয় নিরীক্ষার জন্য সুরক্ষিত অ্যাডমিন লগইন'
              : 'Secure backend authorization for book curation & sales audit'}
          </p>
        </div>

        {/* Server Authorized Notice */}
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isBn ? 'সার্ভার-অনুমোদিত অ্যাডমিন:' : 'Authorized Server Admin:'}</span>
          </div>
          <p className="font-mono text-[11px] font-semibold text-emerald-950">
            zulfiqareee@gmail.com
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'অ্যাডমিন ইমেইল' : 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {isBn ? 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In as Administrator'}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleAuthorizedClick}
            className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{isBn ? 'অনুমোদিত অ্যাডমিন (zulfiqareee@gmail.com) হিসেবে সক্রিয় করুন' : 'Authenticate as zulfiqareee@gmail.com'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
