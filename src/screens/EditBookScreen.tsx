import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { adminUpdateBook, adminDeleteBook } from '../services/api';
import { CATEGORIES } from '../data/initialBooks';
import { ArrowLeft, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const EditBookScreen: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { editingBook, navigateTo, language, refreshBooks } = useLibrary();

  const isBn = language === 'bn';
  const book = editingBook;

  if (!isAdmin || !book) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 mb-4">{isBn ? 'কোনো বই নির্বাচন করা হয়নি।' : 'No book selected for editing.'}</p>
        <button
          onClick={() => navigateTo('admin_dashboard')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  const [titleBn, setTitleBn] = useState(book.titleBn);
  const [titleEn, setTitleEn] = useState(book.titleEn || '');
  const [authorBn, setAuthorBn] = useState(book.authorBn);
  const [authorEn, setAuthorEn] = useState(book.authorEn || '');
  const [category, setCategory] = useState(book.category);
  const [priceBdt, setPriceBdt] = useState<number>(book.priceBdt);
  const [descriptionBn, setDescriptionBn] = useState(book.descriptionBn || '');
  const [isPublished, setIsPublished] = useState(book.isPublished);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await adminUpdateBook(
        book.id,
        {
          titleBn,
          titleEn,
          authorBn,
          authorEn,
          category,
          priceBdt: Number(priceBdt),
          descriptionBn,
          isPublished
        },
        user.email
      );

      await refreshBooks();
      navigateTo('admin_dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'বই হালনাগাদ ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm(isBn ? 'আপনি কি নিশ্চিত এই বইটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this book?')) {
      return;
    }
    try {
      await adminDeleteBook(book.id, user.email);
      await refreshBooks();
      navigateTo('admin_dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'বই মুছতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-24">
      <button
        onClick={() => navigateTo('admin_dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isBn ? 'বইয়ের তথ্য সম্পাদনা' : 'Edit Book Metadata'}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{book.id}</p>
          </div>

          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'বই মুছুন' : 'Delete Book'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? 'শিরোনাম (বাংলা) *' : 'Title (Bengali) *'}
            </label>
            <input
              type="text"
              required
              value={titleBn}
              onChange={e => setTitleBn(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? 'লেখক (বাংলা) *' : 'Author (Bengali) *'}
            </label>
            <input
              type="text"
              required
              value={authorBn}
              onChange={e => setAuthorBn(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? 'লেখক (ইংরেজি)' : 'Author (English)'}
            </label>
            <input
              type="text"
              value={authorEn}
              onChange={e => setAuthorEn(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? 'ক্যাটাগরি' : 'Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {isBn ? cat.nameBn : cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? 'মূল্য (BDT ৳)' : 'Price (BDT ৳)'}
            </label>
            <input
              type="number"
              min={0}
              required
              value={priceBdt}
              onChange={e => setPriceBdt(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {isBn ? 'বিবরণ' : 'Description'}
          </label>
          <textarea
            rows={4}
            value={descriptionBn}
            onChange={e => setDescriptionBn(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <input
            type="checkbox"
            id="published"
            checked={isPublished}
            onChange={e => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="published" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
            {isBn ? 'প্রকাশিত (সবার জন্য ক্যাটালগে দৃশ্যমান)' : 'Published (Visible in public catalogue)'}
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigateTo('admin_dashboard')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isBn ? 'হালনাগাদ সংরক্ষণ করুন' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
