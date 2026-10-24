import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { CatalogueScreen } from './screens/CatalogueScreen';
import { SearchScreen } from './screens/SearchScreen';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { PdfReaderScreen } from './screens/PdfReaderScreen';
import { BkashCheckoutScreen } from './screens/BkashCheckoutScreen';
import { PaymentResultScreen } from './screens/PaymentResultScreen';
import { MyLibraryScreen } from './screens/MyLibraryScreen';
import { PurchaseHistoryScreen } from './screens/PurchaseHistoryScreen';
import { LoginScreen } from './screens/LoginScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { UploadBookScreen } from './screens/UploadBookScreen';
import { EditBookScreen } from './screens/EditBookScreen';
import { SalesReportScreen } from './screens/SalesReportScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutTermsScreen } from './screens/AboutTermsScreen';

function AppContent() {
  const { currentScreen, navigateTo, language } = useLibrary();
  const isBn = language === 'bn';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'catalogue':
        return <CatalogueScreen />;
      case 'search':
        return <SearchScreen />;
      case 'book_detail':
        return <BookDetailScreen />;
      case 'pdf_reader':
        return <PdfReaderScreen />;
      case 'bkash_checkout':
        return <BkashCheckoutScreen />;
      case 'payment_result':
        return <PaymentResultScreen />;
      case 'my_library':
        return <MyLibraryScreen />;
      case 'purchase_history':
        return <PurchaseHistoryScreen />;
      case 'login':
        return <LoginScreen />;
      case 'admin_login':
        return <AdminLoginScreen />;
      case 'admin_dashboard':
        return <AdminDashboardScreen />;
      case 'admin_upload':
        return <UploadBookScreen />;
      case 'admin_edit':
        return <EditBookScreen />;
      case 'admin_sales':
        return <SalesReportScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'about_terms':
        return <AboutTermsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isReader = currentScreen === 'pdf_reader';

  return (
    <div className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col justify-between">
      {!isReader && <TopBar />}

      <main className="flex-1 w-full max-w-full overflow-x-hidden flex flex-col">
        {renderScreen()}
      </main>

      {!isReader && (
        <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 border-t border-slate-800 text-xs hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-white font-bold text-sm block">
                {isBn ? 'ডিজিটাল বুক লাইব্রেরি (বাংলাদেশ)' : 'Digital Book Library (Bangladesh)'}
              </span>
              <p className="text-slate-500 mt-1">
                {isBn
                  ? 'সবার জন্য উন্মুক্ত জ্ঞান · ফ্রি অনলাইন পাঠ · অফিসিয়াল বিকাশ গেটওয়ে দ্বারা সুরক্ষিত ডাউনলোড'
                  : 'Open Knowledge · Read Free Online · Protected bKash Original PDF Downloads'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <button
                onClick={() => navigateTo('catalogue')}
                className="hover:text-white transition-colors"
              >
                {isBn ? 'সকল বই' : 'All Books'}
              </button>
              <button
                onClick={() => navigateTo('my_library')}
                className="hover:text-white transition-colors"
              >
                {isBn ? 'আমার লাইব্রেরি' : 'My Library'}
              </button>
              <button
                onClick={() => navigateTo('settings')}
                className="hover:text-white transition-colors"
              >
                {isBn ? 'সেটিংস ও ডিভাইস মোড' : 'Settings & Preview'}
              </button>
              <button
                onClick={() => navigateTo('about_terms')}
                className="hover:text-white transition-colors"
              >
                {isBn ? 'নীতিমালা ও টেস্ট চেকলিস্ট' : 'About & Test Checklist'}
              </button>
              <button
                onClick={() => navigateTo('admin_login')}
                className="hover:text-emerald-400 text-slate-300 font-semibold transition-colors"
              >
                {isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© 2026 Digital Book Library. Open Reading Initiative Bangladesh.</span>
            <span className="font-mono">zulfiqareee@gmail.com</span>
          </div>
        </footer>
      )}

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <AndroidFrame>
          <AppContent />
        </AndroidFrame>
      </LibraryProvider>
    </AuthProvider>
  );
}
