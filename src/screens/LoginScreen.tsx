import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Mail, Key, ShieldCheck, ArrowRight, User } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { user, loginWithGoogle, loginWithEmail, isLoading } = useAuth();
  const { navigateTo, language } = useLibrary();

  const isBn = language === 'bn';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, password);
    navigateTo('home');
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    navigateTo('home');
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          {isBn ? 'আপনি ইতিমধ্যে লগইন অবস্থায় আছেন' : 'You are currently logged in'}
        </h2>
        <p className="text-xs text-slate-500 font-mono">{user.email}</p>
        <button
          onClick={() => navigateTo('my_library')}
          className="w-full py-3 bg-emerald-700 text-white font-bold text-xs rounded-xl"
        >
          {isBn ? 'আমার লাইব্রেরিতে যান' : 'Go to My Library'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex-1 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {isBn ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'Sign in to Digital Library'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'বিকাশের মাধ্যমে বই ক্রয় ও ব্যক্তিগত লাইব্রেরিতে বই সংরক্ষণের জন্য লগইন করুন'
              : 'Save purchased books and unlock permanent PDF downloads'}
          </p>
        </div>

        {/* Google One-Click Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isBn ? 'গুগল দিয়ে লগইন করুন' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          <span>{isBn ? 'অথবা ইমেইল দিয়ে' : 'or with email'}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="reader@example.com"
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
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isBn ? 'লগইন করুন' : 'Sign In'}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hover:text-slate-800"
          >
            {isBn ? 'অতিথি হিসেবে পড়ুন' : 'Continue as Guest'}
          </button>
          <button
            type="button"
            onClick={() => navigateTo('admin_login')}
            className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
