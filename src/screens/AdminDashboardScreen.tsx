import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { adminDeleteBook, adminUpdateBook, adminFetchSales } from '../services/api';
import {
  ShieldAlert,
  Plus,
  BookOpen,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { books, navigateTo, language, refreshBooks, setEditingBook } = useLibrary();

  const isBn = language === 'bn';
  const [salesMetrics, setSalesMetrics] = useState<any>(null);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (isAdmin) {
      adminFetchSales().then(data => {
        if (data.success) setSalesMetrics(data.metrics);
      }).catch(console.error);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">
          {isBn ? 'অননুমোদিত প্রবেশাধিকার' : 'Access Restricted'}
        </h2>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'এই ড্যাশবোর্ডটি শুধুমাত্র সার্ভার-অনুমোদিত অ্যাডমিনিস্ট্রেটরের জন্য সংরক্ষিত।'
            : 'This dashboard is strictly protected for authorized administrators.'}
        </p>
        <button
          onClick={() => navigateTo('admin_login')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'অ্যাডমিন লগইন করুন' : 'Admin Login'}
        </button>
      </div>
    );
  }

  const totalBooks = books.length;
  const publishedBooks = books.filter(b => b.isPublished).length;
  const totalOrders = salesMetrics?.verifiedOrdersCount ?? 2;
  const totalRevenue = salesMetrics?.totalRevenueBdt ?? 300;

  const handleTogglePublish = async (bookId: string, currentStatus: boolean) => {
    if (!user) return;
    setIsTogglingId(bookId);
    try {
      await adminUpdateBook(bookId, { isPublished: !currentStatus }, user.email);
      await refreshBooks();
    } catch (e: any) {
      alert(e.message || 'স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।');
    } finally {
      setIsTogglingId(null);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!user) return;
    try {
      await adminDeleteBook(bookId, user.email);
      setDeleteConfirmId(null);
      await refreshBooks();
    } catch (e: any) {
      alert(e.message || 'বই মুছতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-20 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-emerald-400 font-mono">
              ADMIN VERIFIED
            </span>
            <span className="text-xs text-slate-500 font-mono">{user?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {isBn ? 'অ্যাডমিন নিয়ন্ত্রণ কক্ষ ও ক্যাটালগ' : 'Admin Command Center'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('admin_sales')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span>{isBn ? 'বিক্রয় রিপোর্ট' : 'Sales Report'}</span>
          </button>

          <button
            onClick={() => navigateTo('admin_upload')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন বই আপলোড করুন' : 'Upload New Book'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">{isBn ? 'মোট বই' : 'Total Books'}</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{totalBooks}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {isBn ? 'লাইব্রেরি ডাটাবেজে অন্তর্ভুক্ত' : 'In library repository'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">{isBn ? 'প্রকাশিত বই' : 'Published Books'}</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{publishedBooks}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            {isBn ? 'জনগণের জন্য উন্মুক্ত' : 'Publicly accessible'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">{isBn ? 'যাচাইকৃত অর্ডার' : 'Verified Orders'}</span>
            <TrendingUp className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{totalOrders}</div>
          <span className="text-[10px] text-pink-700 font-semibold mt-1 block">
            {isBn ? 'বিকাশ দিয়ে কেনা' : 'Via bKash PGW'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">{isBn ? 'মোট বিক্রয়' : 'Total Revenue'}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">৳{totalRevenue}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {isBn ? 'বাংলাদেশি টাকা (BDT)' : 'Bangladeshi Taka'}
          </span>
        </div>
      </div>

      {/* Book Management Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? 'বই ক্যাটালগ ও ব্যবস্থাপনা' : 'Book Catalogue & Operations'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn ? 'বই সম্পাদনা, ড্রাফট সেভ, প্রকাশ অথবা আনপাবলিশ করুন' : 'Edit metadata, manage draft/publish state, or delete'}
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={isBn ? 'বই বা লেখক খুঁজুন...' : 'Search title or author...'}
                className="pl-3 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden w-48"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">{isBn ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              <option value="novel">{isBn ? 'উপন্যাস' : 'Novel'}</option>
              <option value="poetry">{isBn ? 'কবিতা' : 'Poetry'}</option>
              <option value="scifi">{isBn ? 'কল্পবিজ্ঞান' : 'Sci-Fi'}</option>
              <option value="history">{isBn ? 'ইতিহাস' : 'History'}</option>
              <option value="biography">{isBn ? 'জীবনী' : 'Biography'}</option>
              <option value="research">{isBn ? 'গবেষণা' : 'Research'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">{isBn ? 'বই ও প্রচ্ছদ' : 'Book & Cover'}</th>
                <th className="px-6 py-3.5 font-semibold">{isBn ? 'লেখক' : 'Author'}</th>
                <th className="px-6 py-3.5 font-semibold">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="px-6 py-3.5 font-semibold">{isBn ? 'মূল্য (BDT)' : 'Price'}</th>
                <th className="px-6 py-3.5 font-semibold">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="px-6 py-3.5 font-semibold text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {books.filter(book => {
                if (categoryFilter !== 'all' && book.category !== categoryFilter) return false;
                if (searchTerm.trim()) {
                  const q = searchTerm.toLowerCase();
                  return (
                    book.titleBn.toLowerCase().includes(q) ||
                    book.titleEn.toLowerCase().includes(q) ||
                    book.authorBn.toLowerCase().includes(q) ||
                    book.authorEn.toLowerCase().includes(q)
                  );
                }
                return true;
              }).map(book => (
                <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-13 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img src={book.coverUrl} alt={book.titleBn} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{book.titleBn}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{book.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-800">{book.authorBn}</td>
                  <td className="px-6 py-3.5 text-slate-600 capitalize">{book.category}</td>
                  <td className="px-6 py-3.5 font-bold font-mono text-slate-900">৳{book.priceBdt}</td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => handleTogglePublish(book.id, book.isPublished)}
                      disabled={isTogglingId === book.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                        book.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {book.isPublished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isBn ? 'প্রকাশিত' : 'Published'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>{isBn ? 'ড্রাফট (অপ্রকাশিত)' : 'Draft'}</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Preview Button */}
                      <button
                        onClick={() => navigateTo('pdf_reader', { book, page: 1 })}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900"
                        title={isBn ? 'প্রিভিউ' : 'Preview'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          navigateTo('admin_edit');
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-700 hover:text-emerald-800"
                        title={isBn ? 'সম্পাদনা' : 'Edit'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmId(book.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 hover:text-rose-700"
                        title={isBn ? 'মুছুন' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'বইটি নিশ্চিতভাবে মুছে ফেলতে চান?' : 'Confirm Delete Book?'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'এই বইটি লাইব্রেরি ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে।'
                  : 'This action is irreversible. The book will be permanently removed.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDeleteBook(deleteConfirmId)}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                {isBn ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
