import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Tablet, Monitor, BookOpen, ShieldCheck, User } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { currentScreen, navigateTo, deviceMode, setDeviceMode, language, setLanguage } = useLibrary();
  const { user, isAdmin } = useAuth();

  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 tracking-tight block leading-none">
              {isBn ? 'ডিজিটাল লাইব্রেরি' : 'Digital Book Library'}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium tracking-wide">
              {isBn ? 'বিনামূল্যে পড়ুন · বিকাশে ডাউনলোড' : 'Read Free · Pay with bKash'}
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Nav Links (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => navigateTo('home')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentScreen === 'home' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            {isBn ? 'হোম' : 'Home'}
          </button>
          <button
            onClick={() => navigateTo('catalogue')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentScreen === 'catalogue' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            {isBn ? 'সকল বই' : 'All Books'}
          </button>
          <button
            onClick={() => navigateTo('search')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentScreen === 'search' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            {isBn ? 'অনুসন্ধান' : 'Search'}
          </button>
          <button
            onClick={() => navigateTo('my_library')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentScreen === 'my_library' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            {isBn ? 'আমার লাইব্রেরি' : 'My Library'}
          </button>
          <button
            onClick={() => navigateTo('purchase_history')}
            className={`whitespace-nowrap hover:text-slate-900 transition-colors ${
              currentScreen === 'purchase_history' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            {isBn ? 'ক্রয় ইতিহাস' : 'Orders'}
          </button>
          <button
            onClick={() => navigateTo(isAdmin ? 'admin_dashboard' : 'admin_login')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-bold ${
              currentScreen.startsWith('admin')
                ? 'bg-slate-900 text-emerald-400 border-slate-900'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Upload CTA button for Admin */}
          <button
            onClick={() => navigateTo(isAdmin ? 'admin_upload' : 'admin_login')}
            title={isBn ? 'নতুন বই আপলোড করুন' : 'Upload New Book'}
            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isBn ? 'বই আপলোড' : 'Upload Book'}</span>
            <span className="sm:hidden">{isBn ? 'আপলোড' : 'Upload'}</span>
          </button>

          {/* Device Frame Viewport Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setDeviceMode('phone')}
              title="Android Phone View"
              className={`p-1.5 rounded transition-colors ${
                deviceMode === 'phone' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Android Tablet View"
              className={`p-1.5 rounded transition-colors ${
                deviceMode === 'tablet' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Responsive Desktop View"
              className={`p-1.5 rounded transition-colors ${
                deviceMode === 'desktop' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(isBn ? 'en' : 'bn')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            {isBn ? 'English' : 'বাংলা'}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <button
              onClick={() => navigateTo('my_library')}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-emerald-700 bg-emerald-50/60 border border-emerald-200/80 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[90px] truncate hidden sm:inline">{user.displayName.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              {isBn ? 'লগইন' : 'Login'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
