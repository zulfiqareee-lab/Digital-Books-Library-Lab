import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, Search, BookmarkCheck, ShieldAlert } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, language, deviceMode } = useLibrary();
  const { isAdmin } = useAuth();

  const isBn = language === 'bn';
  const showNav = deviceMode !== 'desktop' || currentScreen !== 'pdf_reader';

  if (!showNav || currentScreen === 'pdf_reader') {
    return null;
  }

  const navItems = [
    { id: 'home', label: isBn ? 'হোম' : 'Home', icon: Home },
    { id: 'catalogue', label: isBn ? 'সকল বই' : 'Books', icon: Compass },
    { id: 'search', label: isBn ? 'অনুসন্ধান' : 'Search', icon: Search },
    { id: 'my_library', label: isBn ? 'লাইব্রেরি' : 'Library', icon: BookmarkCheck },
    {
      id: isAdmin ? 'admin_dashboard' : 'admin_login',
      label: isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel',
      icon: ShieldAlert
    },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 shrink-0 md:hidden">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'admin_dashboard' && currentScreen.startsWith('admin'));

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as any)}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors rounded-lg ${
                isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
